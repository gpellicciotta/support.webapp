// @vitest-environment happy-dom
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setSpriteUrl } from '../../src/js/icon.js';
import {
    attachReleaseNotes,
    createReleaseNotes,
    describeRelease,
    parseInlineMarkdown
} from '../../src/js/release-notes.js';

const here = dirname(fileURLToPath(import.meta.url));
const read = (path) => readFileSync(join(here, path), 'utf8');

const SAMPLE_RELEASES = [
    {
        version: '0.4.1',
        isPreRelease: true,
        tag: 'in development',
        isLatest: true,
        entries: [
            {
                rawText: 'FrontEnd: **[breaking]** Replaced `legacy-notes` with [release-notes](docs/specs/components.md).',
                text: 'Replaced `legacy-notes` with [release-notes](docs/specs/components.md).',
                category: 'ux',
                isUserFacing: true,
                isBreaking: true
            },
            {
                rawText: 'DevEx: Updated `vitest` fixtures for <script>alert(1)</script> safety.',
                text: 'Updated `vitest` fixtures for <script>alert(1)</script> safety.',
                category: 'internal',
                isUserFacing: false,
                isBreaking: false
            }
        ]
    },
    {
        version: '0.4.0',
        isPreRelease: false,
        tag: 'released: 2026-11-23',
        isLatest: false,
        entries: [
            {
                rawText: 'BackEnd: Added `refresh` tokens for offline clients.',
                text: 'Added `refresh` tokens for offline clients.',
                category: 'feature',
                isUserFacing: true,
                isBreaking: false
            },
            {
                rawText: 'Fix: Resolved focus jump after clicking [Cancel](docs/cancel.md).',
                text: 'Resolved focus jump after clicking [Cancel](docs/cancel.md).',
                category: 'fix',
                isUserFacing: true,
                isBreaking: false
            },
            {
                rawText: 'CLI: Normalized `CRLF` hashes in vendored copies.',
                text: 'Normalized `CRLF` hashes in vendored copies.',
                category: 'client',
                isUserFacing: true,
                isBreaking: false
            }
        ]
    },
    {
        version: '0.3.9',
        isPreRelease: false,
        tag: '2026-11-18',
        isLatest: false,
        entries: [
            {
                rawText: 'Docs: Clarified `README.md` setup steps.',
                text: 'Clarified `README.md` setup steps.',
                category: 'internal',
                isUserFacing: false,
                isBreaking: false
            }
        ]
    },
    {
        version: '0.3.8',
        isPreRelease: false,
        tag: 'released: 2026-11-10 • broken',
        isLatest: false,
        entries: [
            {
                rawText: 'Security: Patched session rotation.',
                text: 'Patched session rotation.',
                category: 'security',
                isUserFacing: true,
                isBreaking: false
            }
        ]
    }
];

describe('release-notes component contract', () => {
    it('registers release-notes in contract.json, imports its partial, and catalogs it with the containers', () => {
        expect(JSON.parse(read('../../src/contract.json')).components).toContain('release-notes');
        expect(read('../../src/css/style.css')).toContain("@import url('components/release-notes.css');");
        const catalog = read('../../docs/specs/components.md');
        const containers = catalog.split('### Containers')[1]?.split('###')[0] ?? '';
        expect(containers).toMatch(/\|\s*`release-notes`\s*\|/);
        expect(catalog).toMatch(/^### release-notes$/m);
    });

    it('uses only contract tokens in release-notes.css with no raw colors or px lengths', () => {
        const css = read('../../src/css/components/release-notes.css').replace(/\/\*[\s\S]*?\*\//g, '');
        expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch)\(|\b\d+px\b/i);
    });
});

describe('parseInlineMarkdown', () => {
    it('splits backtick code spans and reduces Markdown links outside code to their labels', () => {
        expect(parseInlineMarkdown('See [guide](docs/guide.md) and `use [a](b)` with [home](/)')).toEqual([
            { type: 'text', value: 'See guide and ' },
            { type: 'code', value: 'use [a](b)' },
            { type: 'text', value: ' with home' }
        ]);
    });

    it('keeps unclosed backticks and empty backticks as plain text', () => {
        expect(parseInlineMarkdown('Keep `unclosed tick')).toEqual([
            { type: 'text', value: 'Keep `unclosed tick' }
        ]);
        expect(parseInlineMarkdown('Keep `` and `ok`')).toEqual([
            { type: 'text', value: 'Keep `` and ' },
            { type: 'code', value: 'ok' }
        ]);
    });

    it('returns plain text tokens for HTML-like strings without interpreting tags', () => {
        expect(parseInlineMarkdown('<img src=x onerror=alert(1)> and `<script>x</script>`')).toEqual([
            { type: 'text', value: '<img src=x onerror=alert(1)> and ' },
            { type: 'code', value: '<script>x</script>' }
        ]);
    });
});

describe('describeRelease', () => {
    it('derives version, status, date, and area groups in order of first appearance', () => {
        const pre = describeRelease(SAMPLE_RELEASES[0]);
        expect(pre.version).toBe('0.4.1-pre');
        expect(pre.status).toBe('in-development');
        expect(pre.date).toBeNull();
        expect(pre.groups.map(([area]) => area)).toEqual(['FrontEnd', 'DevEx']);
        expect(pre.groups[0][1][0]).toMatchObject({
            text: 'Replaced `legacy-notes` with [release-notes](docs/specs/components.md).',
            isBreaking: true
        });

        const released = describeRelease(SAMPLE_RELEASES[1]);
        expect(released.version).toBe('0.4.0');
        expect(released.status).toBe('released');
        expect(released.date).toBe('2026-11-23');

        const frozen = describeRelease(SAMPLE_RELEASES[2]);
        expect(frozen.status).toBe('frozen');
        expect(frozen.date).toBe('2026-11-18');

        const broken = describeRelease(SAMPLE_RELEASES[3]);
        expect(broken.status).toBe('broken');
        expect(broken.date).toBe('2026-11-10');
    });

    it('accepts server-described releases without rawText or tag', () => {
        const serverRelease = describeRelease({
            version: '1.2.0',
            status: 'frozen',
            date: '2026-10-01',
            entries: [
                { category: 'API', text: 'Added `/status` route.' },
                { category: 'API', text: 'Documented `429` retry headers.', breaking: true }
            ]
        });
        expect(serverRelease).toMatchObject({
            version: '1.2.0',
            status: 'frozen',
            date: '2026-10-01'
        });
        expect(serverRelease.groups).toHaveLength(1);
        expect(serverRelease.groups[0][0]).toBe('API');
        expect(serverRelease.groups[0][1]).toHaveLength(2);
        expect(serverRelease.groups[0][1][1].isBreaking).toBe(true);
    });
});

describe('createReleaseNotes and attachReleaseNotes', () => {
    let controller;

    beforeEach(() => {
        setSpriteUrl('icons.svg');
        document.body.innerHTML = '';
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
    });

    it('renders one collapsible per visible release with the newest open, Latest, category, and Breaking badges', () => {
        controller = createReleaseNotes(document, { releases: SAMPLE_RELEASES });
        document.body.append(controller.element);

        // Default filter is 'user', so internal-only release 0.3.9 is omitted.
        const releases = [...controller.element.querySelectorAll('[data-release-notes-release]')];
        expect(releases).toHaveLength(3);

        const toggles = releases.map((item) => item.querySelector(':scope > button[aria-controls]'));
        const panels = toggles.map((btn) => document.getElementById(btn.getAttribute('aria-controls')));

        expect(toggles[0].getAttribute('aria-expanded')).toBe('true');
        expect(panels[0].hidden).toBe(false);
        expect(toggles[1].getAttribute('aria-expanded')).toBe('false');
        expect(panels[1].getAttribute('hidden')).toBe('until-found');

        // Latest badge appears only on the latest release.
        expect(toggles[0].querySelector('[data-release-notes-latest]')?.classList.contains('badge--success')).toBe(true);
        expect(toggles[1].querySelector('[data-release-notes-latest]')).toBeNull();

        // Category and Breaking badges.
        const firstEntries = [...panels[0].querySelectorAll('.release-notes__entry')];
        expect(firstEntries).toHaveLength(1);
        expect(firstEntries[0].querySelector('[data-release-notes-category="ux"]')?.textContent).toBe('UX');
        expect(firstEntries[0].querySelector('[data-release-notes-breaking]')?.classList.contains('badge--danger')).toBe(true);
        expect(firstEntries[0].querySelector('[data-release-notes-breaking]')?.textContent).toBe('Breaking');

        // Clicking a collapsed release opens it via collapsible.js even after detached creation.
        toggles[1].click();
        expect(toggles[1].getAttribute('aria-expanded')).toBe('true');
        expect(panels[1].hidden).toBe(false);

        const secondBadges = [...panels[1].querySelectorAll('[data-release-notes-category]')].map((el) => el.textContent);
        expect(secondBadges).toEqual(['Feature', 'Fix', 'Client']);

        // Custom unknown category is capitalized.
        toggles[2].click();
        expect(panels[2].querySelector('[data-release-notes-category="security"]')?.textContent).toBe('Security');
    });

    it('escapes HTML, renders inline code spans as <code>, and strips Markdown links to their label', () => {
        controller = createReleaseNotes(document, {
            releases: SAMPLE_RELEASES,
            filter: 'all'
        });
        document.body.append(controller.element);

        expect(controller.element.querySelectorAll('script, img, a')).toHaveLength(0);
        const firstPanel = controller.element.querySelector('.collapsible__panel');
        const codes = [...firstPanel.querySelectorAll('code')].map((node) => node.textContent);
        expect(codes).toEqual(['legacy-notes', 'vitest']);
        expect(firstPanel.textContent).toContain('Replaced legacy-notes with release-notes.');
        expect(firstPanel.textContent).toContain('<script>alert(1)</script>');
    });

    it('switches between User Highlights and All Changes filter chips', () => {
        const onFilterChange = vi.fn();
        controller = createReleaseNotes(document, {
            releases: SAMPLE_RELEASES,
            onFilterChange
        });
        document.body.append(controller.element);

        const userChip = controller.element.querySelector('[data-release-notes-filter="user"]');
        const allChip = controller.element.querySelector('[data-release-notes-filter="all"]');
        expect(userChip.getAttribute('aria-pressed')).toBe('true');
        expect(allChip.getAttribute('aria-pressed')).toBe('false');
        expect(controller.element.querySelectorAll('[data-release-notes-release]')).toHaveLength(3);

        allChip.click();
        expect(controller.getFilter()).toBe('all');
        expect(onFilterChange).toHaveBeenCalledWith('all');
        expect(controller.element.querySelector('[data-release-notes-filter="all"]').getAttribute('aria-pressed')).toBe('true');
        expect(controller.element.querySelector('[data-release-notes-filter="user"]').getAttribute('aria-pressed')).toBe('false');
        expect(controller.element.querySelectorAll('[data-release-notes-release]')).toHaveLength(4);
        expect(controller.element.querySelector('[data-release-notes-category="internal"]')?.textContent).toBe('Internal');

        controller.setFilter('user');
        expect(controller.getFilter()).toBe('user');
        expect(controller.element.querySelectorAll('[data-release-notes-release]')).toHaveLength(3);
    });

    it('groups entries by area and renders release status chips and dates', () => {
        controller = createReleaseNotes(document, {
            releases: SAMPLE_RELEASES,
            showFilter: false,
            groupByArea: true,
            showStatus: true
        });
        document.body.append(controller.element);

        expect(controller.element.querySelector('[data-release-notes-filters]')).toBeNull();
        const statuses = [...controller.element.querySelectorAll('[data-release-notes-status]')].map((chip) => ({
            status: chip.getAttribute('data-release-notes-status'),
            text: chip.textContent.trim(),
            danger: chip.classList.contains('chip--danger'),
            icon: chip.querySelector('use')?.getAttribute('href')
        }));
        expect(statuses).toEqual([
            { status: 'in-development', text: 'In development', danger: false, icon: 'icons.svg#icon-refresh' },
            { status: 'released', text: 'Released', danger: false, icon: 'icons.svg#icon-check' },
            { status: 'frozen', text: 'Frozen', danger: false, icon: 'icons.svg#icon-more' },
            { status: 'broken', text: 'Broken', danger: true, icon: 'icons.svg#icon-alert' }
        ]);

        const firstRelease = controller.element.querySelector('[data-release-notes-release]');
        expect(firstRelease.querySelector('.release-notes__tag')?.textContent).toBe('No release date');
        const areas = [...firstRelease.querySelectorAll('[data-release-notes-area]')].map((group) => group.querySelector('h3')?.textContent);
        expect(areas).toEqual(['FrontEnd', 'DevEx']);
        expect(firstRelease.querySelector('[data-release-notes-breaking]')?.textContent).toBe('Breaking');
    });

    it('pages older releases with a Show older button and supports non-collapsible mode', () => {
        controller = createReleaseNotes(document, {
            releases: SAMPLE_RELEASES,
            showFilter: false,
            groupByArea: true,
            showStatus: true,
            collapsible: false,
            pageSize: 2
        });
        document.body.append(controller.element);

        expect(controller.element.querySelectorAll('[data-release-notes-release]')).toHaveLength(2);
        const more = controller.element.querySelector('[data-release-notes-more]');
        expect(more?.textContent).toBe('Show 2 older releases');
        more.click();
        expect(controller.element.querySelectorAll('[data-release-notes-release]')).toHaveLength(4);
        expect(controller.element.querySelector('[data-release-notes-more]')).toBeNull();
    });

    it('shows singular Show 1 older release label and handles empty states', () => {
        controller = createReleaseNotes(document, {
            releases: SAMPLE_RELEASES.slice(0, 3),
            showFilter: false,
            pageSize: 2
        });
        document.body.append(controller.element);
        expect(controller.element.querySelector('[data-release-notes-more]')?.textContent).toBe('Show 1 older release');

        controller.setReleases([]);
        expect(controller.element.querySelector('[data-release-notes-empty]')?.textContent).toBe('No release notes available.');

        controller.setReleases([{ version: '0.1.0', tag: 'released: 2026-01-01', entries: [] }]);
        expect(controller.element.querySelector('[data-release-notes-empty]')?.textContent).toBe('No entries.');
    });

    it('supports attachReleaseNotes on existing DOM, expandAll, collapseAll, beforematch, and destroy', () => {
        const root = document.createElement('div');
        root.className = 'release-notes';
        root.setAttribute('data-release-notes', '');
        document.body.append(root);

        controller = attachReleaseNotes(root, { releases: SAMPLE_RELEASES, filter: 'all' });
        const toggles = () => [...root.querySelectorAll('[data-release-notes-release] > button[aria-controls]')];

        controller.expandAll();
        expect(toggles().every((btn) => btn.getAttribute('aria-expanded') === 'true')).toBe(true);

        controller.collapseAll();
        expect(toggles().every((btn) => btn.getAttribute('aria-expanded') === 'false')).toBe(true);

        const secondPanel = document.getElementById(toggles()[1].getAttribute('aria-controls'));
        secondPanel.dispatchEvent(new Event('beforematch'));
        expect(toggles()[1].getAttribute('aria-expanded')).toBe('true');

        controller.destroy();
        controller = null;
        toggles()[1].click();
        expect(toggles()[1].getAttribute('aria-expanded')).toBe('true');
    });
});
