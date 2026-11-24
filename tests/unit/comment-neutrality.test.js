// Guard against sibling-application references in package source and test comments.
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = fileURLToPath(new URL('../../', import.meta.url));
const SCAN_DIRS = ['src/js', 'src/css', 'tests/unit', 'tests/e2e'];
const JS_EXTENSIONS = new Set(['.js', '.mjs']);
const CSS_EXTENSIONS = new Set(['.css']);
const REGEX_PRECEDING_KEYWORDS = new Set([
    'await', 'case', 'delete', 'do', 'else', 'in', 'instanceof',
    'new', 'of', 'return', 'throw', 'typeof', 'void', 'yield'
]);
const SIBLING_APP_PATTERN = /\b(?:auth|counters|todos\.webapp|todo|meteo|family-portal|support\.js)\b/i;

function collectFiles(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    const out = [];
    for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...collectFiles(fullPath));
        }
        else {
            out.push(fullPath);
        }
    }
    return out;
}

function lineAt(source, index) {
    let line = 1;
    for (let i = 0; i < index; i++) {
        if (source[i] === '\n') {
            line++;
        }
    }
    return line;
}

function extractCssComments(source) {
    const items = [];
    const pattern = /\/\*[\s\S]*?\*\//g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
        items.push({
            kind: 'comment',
            line: lineAt(source, match.index),
            text: match[0]
        });
    }
    return items;
}

function isIdentChar(ch) {
    return ch !== undefined && /[A-Za-z0-9_$]/.test(ch);
}

function scanJsTokens(source, includeTestTitles) {
    const items = [];
    const tokens = [];
    let i = 0;
    const len = source.length;

    const canStartRegex = () => {
        if (tokens.length === 0) {
            return true;
        }
        const prev = tokens[tokens.length - 1];
        if (prev.type === 'ident') {
            return REGEX_PRECEDING_KEYWORDS.has(prev.value);
        }
        if (prev.type === 'number' || prev.type === 'string') {
            return false;
        }
        return ![']', ')', '++', '--'].includes(prev.value);
    };

    while (i < len) {
        const ch = source[i];
        const next = source[i + 1];

        if (/\s/.test(ch)) {
            i++;
            continue;
        }

        if (ch === '/' && next === '/') {
            const start = i;
            i += 2;
            while (i < len && source[i] !== '\n') {
                i++;
            }
            items.push({
                kind: 'comment',
                line: lineAt(source, start),
                text: source.slice(start, i)
            });
            continue;
        }

        if (ch === '/' && next === '*') {
            const start = i;
            i += 2;
            while (i < len && !(source[i] === '*' && source[i + 1] === '/')) {
                i++;
            }
            i = Math.min(len, i + 2);
            items.push({
                kind: 'comment',
                line: lineAt(source, start),
                text: source.slice(start, i)
            });
            continue;
        }

        if (ch === '/' && canStartRegex()) {
            i++;
            let inClass = false;
            while (i < len) {
                if (source[i] === '\\') {
                    i += 2;
                    continue;
                }
                if (source[i] === '[') {
                    inClass = true;
                }
                else if (source[i] === ']') {
                    inClass = false;
                }
                else if (source[i] === '/' && !inClass) {
                    i++;
                    while (i < len && /[a-z]/i.test(source[i])) {
                        i++;
                    }
                    break;
                }
                i++;
            }
            tokens.push({ type: 'regex', value: '' });
            continue;
        }

        if (ch === '\'' || ch === '"' || ch === '`') {
            const quote = ch;
            const start = i;
            i++;
            while (i < len) {
                if (source[i] === '\\') {
                    i += 2;
                    continue;
                }
                if (source[i] === quote) {
                    i++;
                    break;
                }
                i++;
            }
            const raw = source.slice(start, i);
            tokens.push({ type: 'string', value: raw, index: start });
            continue;
        }

        if (/[A-Za-z_$]/.test(ch)) {
            const start = i;
            i++;
            while (i < len && isIdentChar(source[i])) {
                i++;
            }
            tokens.push({ type: 'ident', value: source.slice(start, i), index: start });
            continue;
        }

        if (/[0-9]/.test(ch)) {
            const start = i;
            i++;
            while (i < len && /[0-9A-Za-z._]/.test(source[i])) {
                i++;
            }
            tokens.push({ type: 'number', value: source.slice(start, i), index: start });
            continue;
        }

        if ((ch === '+' && next === '+') || (ch === '-' && next === '-')) {
            tokens.push({ type: 'punct', value: ch + next, index: i });
            i += 2;
            continue;
        }

        tokens.push({ type: 'punct', value: ch, index: i });
        i++;
    }

    if (includeTestTitles) {
        for (let t = 0; t < tokens.length; t++) {
            const tok = tokens[t];
            if (tok.type !== 'ident' || !['describe', 'it', 'test'].includes(tok.value)) {
                continue;
            }
            let cursor = t + 1;
            while (
                cursor + 1 < tokens.length &&
                tokens[cursor].value === '.' &&
                tokens[cursor + 1].type === 'ident'
            ) {
                cursor += 2;
            }
            if (
                cursor + 1 < tokens.length &&
                tokens[cursor].value === '(' &&
                tokens[cursor + 1].type === 'string'
            ) {
                const titleTok = tokens[cursor + 1];
                items.push({
                    kind: 'test-title',
                    line: lineAt(source, titleTok.index),
                    text: titleTok.value
                });
            }
        }
    }

    return items;
}

describe('comment neutrality across source and tests', () => {
    it('contains no sibling-application references in source or test comments and test titles', () => {
        const violations = [];

        for (const relDir of SCAN_DIRS) {
            const absDir = join(repoRoot, relDir);
            const isTestDir = relDir.startsWith('tests/');
            for (const filePath of collectFiles(absDir)) {
                const ext = extname(filePath);
                const source = readFileSync(filePath, 'utf8');
                let items = [];
                if (JS_EXTENSIONS.has(ext)) {
                    items = scanJsTokens(source, isTestDir);
                }
                else if (CSS_EXTENSIONS.has(ext)) {
                    items = extractCssComments(source);
                }
                else {
                    continue;
                }

                const relPath = relative(repoRoot, filePath).replace(/\\/g, '/');
                for (const item of items) {
                    const match = item.text.match(SIBLING_APP_PATTERN);
                    if (match) {
                        violations.push(`${relPath}:${item.line} [${item.kind}] matched "${match[0]}"`);
                    }
                }
            }
        }

        expect(violations).toEqual([]);
    });
});
