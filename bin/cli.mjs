#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { packageRoot } from './manifest.mjs';
import { vendor } from './vendor.mjs';
import { check, printResult } from './check.mjs';

const metadata = JSON.parse(readFileSync(join(packageRoot, 'package.json')));
const header = `${metadata.name} v${metadata.version} - ${metadata.copyright}`;
try {
    const { values, positionals } = parseArgs({ allowPositionals: true, options: {
        help: { type: 'boolean', short: 'h' }, version: { type: 'boolean' }, verbose: { type: 'boolean', short: 'v' },
        look: { type: 'string' }, to: { type: 'string' }, styles: { type: 'string', multiple: true },
        'dry-run': { type: 'boolean' }, format: { type: 'string', default: 'text' }
    } });
    const command = positionals[0] ?? 'help';
    if (!['text', 'json'].includes(values.format) || positionals.length > 1) {
        throw Object.assign(new Error('Invalid arguments or format'), { exitCode: 2 });
    }
    if (values.version || command === 'version') {
        console.log(header);
    }
    else if (values.help || command === 'help') {
        console.log(`${header}\nVendor and verify the design system.\nUsage: support-webapp <command> [options]\nCommands: vendor, check, help, version\nOptions: --help/-h, --version, --verbose/-v, --format text|json\nVendor: --look <name> --to <folder> [--styles <folder>]... [--dry-run]\nRun from the app root. Check reads design.json there.\nExit codes: 0 success, 1 operational/check failure, 2 invalid arguments`);
    }
    else if (command === 'vendor') {
        if (!values.look || !values.to || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.look)) {
            throw Object.assign(new Error('vendor requires --look <name> and --to <folder>'), { exitCode: 2 });
        }
        const result = vendor({ look: values.look, to: values.to, styles: values.styles, dryRun: values['dry-run'] });
        console.log(values.format === 'json' ? JSON.stringify(result) : `${result.dryRun ? 'Would write' : 'Wrote'}:\n${result.changes.join('\n')}`);
    }
    else if (command === 'check') {
        if (values.look || values.to || values.styles || values['dry-run']) {
            throw Object.assign(new Error('check does not accept vendor options'), { exitCode: 2 });
        }
        process.exitCode = printResult(check(process.cwd()), values.format);
    }
    else {
        throw Object.assign(new Error(`Unknown command: ${command}`), { exitCode: 2 });
    }
}
catch (error) {
    console.error(error.message);
    process.exitCode = error.exitCode ?? (error.code?.startsWith('ERR_PARSE_ARGS') ? 2 : 1);
}
