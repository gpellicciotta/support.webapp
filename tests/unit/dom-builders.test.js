// @vitest-environment happy-dom
// Unit tests for dom-builders.js: h, setChildren, createDomBuilders, and catalog component builders.
import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setSpriteUrl } from '../../src/js/icon.js';
import {
    button,
    checkbox,
    createDomBuilders,
    dataTable,
    emptyState,
    errorBanner,
    facts,
    h,
    inlineConfirm,
    select,
    setChildren,
    severityChip,
    severityOf,
    statusLine
} from '../../src/js/dom-builders.js';

const SPRITE = '/vendor/design/looks/neutral/icons.svg';

describe('dom-builders', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        setSpriteUrl(SPRITE);
    });

    describe('h and setChildren', () => {
        it('sets attributes, classes, event listeners, and DOM properties while skipping nullish and false attributes', () => {
            const onClick = vi.fn();
            const onCustom = vi.fn();
            const btn = h('button', {
                class: 'button button--secondary',
                type: 'button',
                disabled: false,
                hidden: false,
                required: true,
                'data-skip': null,
                'data-undef': undefined,
                'data-flag': false,
                'data-hook': 'save',
                'aria-expanded': 'false',
                onclick: onClick,
                'oncustom:ping': onCustom,
                onignored: null
            }, 'Save');

            expect(btn.tagName).toBe('BUTTON');
            expect(btn.className).toBe('button button--secondary');
            expect(btn.getAttribute('type')).toBe('button');
            expect(btn.disabled).toBe(false);
            expect(btn.hidden).toBe(false);
            expect(btn.hasAttribute('required')).toBe(true);
            expect(btn.getAttribute('required')).toBe('');
            expect(btn.hasAttribute('data-skip')).toBe(false);
            expect(btn.hasAttribute('data-undef')).toBe(false);
            expect(btn.hasAttribute('data-flag')).toBe(false);
            expect(btn.getAttribute('data-hook')).toBe('save');
            expect(btn.getAttribute('aria-expanded')).toBe('false');

            btn.click();
            btn.dispatchEvent(new CustomEvent('custom:ping'));
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onCustom).toHaveBeenCalledTimes(1);
        });

        it('sets value, checked, disabled, hidden, open, and selected as DOM properties', () => {
            const input = h('input', { type: 'checkbox', value: 'yes', checked: true, disabled: true });
            expect(input.value).toBe('yes');
            expect(input.checked).toBe(true);
            expect(input.disabled).toBe(true);

            const details = h('details', { open: true, hidden: true }, h('summary', null, 'More'));
            expect(details.open).toBe(true);
            expect(details.hidden).toBe(true);

            const optionA = h('option', { value: 'a', selected: false }, 'A');
            const optionB = h('option', { value: 'b', selected: true }, 'B');
            expect(optionA.selected).toBe(false);
            expect(optionB.selected).toBe(true);

            const selectEl = h('select', { value: 'b' }, h('option', { value: 'a' }, 'A'), h('option', { value: 'b' }, 'B'));
            expect(selectEl.value).toBe('b');
        });

        it('flattens nested children, preserves zero, and escapes text without parsing HTML', () => {
            const el = h('div', null, null, false, undefined, 0, ' ', [h('span', null, 'inner'), ['<img src=x onerror=alert(1)>', [false, 'end']]]);
            expect(el.querySelectorAll('img')).toHaveLength(0);
            expect(el.querySelector('span').textContent).toBe('inner');
            expect(el.textContent).toBe('0 inner<img src=x onerror=alert(1)>end');
        });

        it('replaces all children via setChildren and supports nested arrays', () => {
            const host = h('div', null, h('p', null, 'Old'));
            setChildren(host, null, [h('span', null, 'New'), ' ', 42, false]);
            expect(host.querySelector('p')).toBeNull();
            expect(host.querySelector('span').textContent).toBe('New');
            expect(host.textContent).toBe('New 42');
        });

        it('binds every builder to an injected document via createDomBuilders', () => {
            const foreign = document.implementation.createHTMLDocument('Foreign');
            const dom = createDomBuilders(foreign);
            const container = dom.h('div', null,
                dom.button('Save', null, { kind: 'primary', icon: 'check' }),
                dom.select([['a', 'Alpha']], 'a'),
                dom.checkbox('Agree', { name: 'agree' }),
                dom.facts([['ID', '1']]),
                dom.dataTable('Rows', ['ID'], [dom.h('tr', null, dom.h('td', null, '1'))]),
                dom.severityChip('warning'),
                dom.statusLine('Loading'),
                dom.errorBanner('Failed'),
                dom.emptyState('Nothing here')
            );
            expect(container.ownerDocument).toBe(foreign);
            for (const descendant of container.querySelectorAll('*')) {
                expect(descendant.ownerDocument).toBe(foreign);
            }
            dom.destroy();
        });
    });

    describe('button', () => {
        it('matches the button catalog skeleton across kinds, modifiers, icons, and handlers', () => {
            const onClick = vi.fn();
            const secondary = button('Keep', onClick);
            expect(secondary.tagName).toBe('BUTTON');
            expect(secondary.type).toBe('button');
            expect(secondary.className).toBe('button button--secondary');
            expect(secondary.textContent).toBe('Keep');
            secondary.click();
            expect(onClick).toHaveBeenCalledTimes(1);

            const primary = button('Save', null, { kind: 'primary', type: 'submit' });
            expect(primary.className).toBe('button');
            expect(primary.type).toBe('submit');

            const dangerSmall = button('Delete', null, { kind: 'secondary', danger: true, small: true, icon: 'alert', 'aria-disabled': 'true' });
            expect(dangerSmall.className).toBe('button button--secondary button--danger button--small');
            expect(dangerSmall.getAttribute('aria-disabled')).toBe('true');
            expect(dangerSmall.querySelector('svg.icon use').getAttribute('href')).toBe(`${SPRITE}#icon-alert`);

            const quiet = button('Cancel', null, { kind: 'quiet', disabled: true });
            expect(quiet.className).toBe('button button--quiet');
            expect(quiet.disabled).toBe(true);

            const inverse = button('Action', null, { kind: 'inverse' });
            expect(inverse.className).toBe('button button--inverse');

            expect(() => button('Bad', null, { kind: 'ghost' })).toThrow(RangeError);
        });
    });

    describe('select', () => {
        it('builds a field__control select from tuples, objects, and primitives with selected state', () => {
            const fromTuples = select([['', 'All statuses'], ['active', 'Active'], ['warning', 'Marked']], 'active', { id: 'status' });
            expect(fromTuples.tagName).toBe('SELECT');
            expect(fromTuples.className).toBe('field__control');
            expect(fromTuples.id).toBe('status');
            expect([...fromTuples.options].map((opt) => [opt.value, opt.textContent, opt.selected])).toEqual([
                ['', 'All statuses', false],
                ['active', 'Active', true],
                ['warning', 'Marked', false]
            ]);
            expect(fromTuples.value).toBe('active');

            const fromMixed = select(['20', { value: '50', label: '50 rows' }, { value: '100', label: '100 rows', disabled: true }], 50);
            expect(fromMixed.value).toBe('50');
            expect(fromMixed.options[2].disabled).toBe(true);
        });
    });

    describe('checkbox', () => {
        it('matches the checkbox catalog skeleton and forwards input properties', () => {
            const onChange = vi.fn();
            const el = checkbox('Done', { name: 'done', checked: true, indeterminate: true, 'aria-invalid': 'true', onchange: onChange });
            expect(el.tagName).toBe('LABEL');
            expect(el.className).toBe('checkbox');
            const input = el.querySelector('input');
            const labelSpan = el.querySelector('span');
            expect(input.className).toBe('checkbox__control');
            expect(input.type).toBe('checkbox');
            expect(input.name).toBe('done');
            expect(input.checked).toBe(true);
            expect(input.indeterminate).toBe(true);
            expect(input.getAttribute('aria-invalid')).toBe('true');
            expect(labelSpan.className).toBe('checkbox__label');
            expect(labelSpan.textContent).toBe('Done');
        });
    });

    describe('facts', () => {
        it('matches the list--facts catalog skeleton with direct list__term and list__value children', () => {
            const el = facts([
                ['ID', '34', { 'data-fact': 'id' }],
                { term: 'Status', value: severityChip('ok', 'Active'), key: 'status' },
                null
            ], true);

            expect(el.tagName).toBe('DL');
            expect(el.className).toBe('list list--facts list--compact');
            expect([...el.children].map((child) => `${child.tagName}:${child.className}`)).toEqual([
                'DT:list__term',
                'DD:list__value',
                'DT:list__term',
                'DD:list__value'
            ]);
            expect(el.querySelector('[data-fact="id"]').textContent).toBe('34');
            expect(el.querySelector('[data-fact="status"] .chip--status').textContent).toBe('Active');

            const regular = facts([['Owner', 'Ann']]);
            expect(regular.className).toBe('list list--facts');
        });
    });

    describe('dataTable', () => {
        it('matches the table catalog skeleton with focusable frame, linked caption, scoped headers, and body rows', () => {
            const row = h('tr', { 'aria-selected': 'true' },
                h('td', { class: 'table__numeric' }, '34'),
                h('th', { scope: 'row' }, 'Samira Patel'),
                h('td', null, 'Inspect'));

            const frame = dataTable('Sample accounts', [
                { label: 'ID', numeric: true },
                'Name',
                { label: 'Actions', hidden: true }
            ], [row]);

            expect(frame.tagName).toBe('DIV');
            expect(frame.className).toBe('table__frame');
            expect(frame.getAttribute('role')).toBe('region');
            expect(frame.getAttribute('tabindex')).toBe('0');

            const table = frame.querySelector('table');
            expect(table.className).toBe('table table--dense');
            const caption = table.querySelector('caption');
            expect(caption.className).toBe('visually-hidden');
            expect(caption.textContent).toBe('Sample accounts');
            expect(frame.getAttribute('aria-labelledby')).toBe(caption.id);

            const headers = [...table.querySelectorAll('thead th')];
            expect(headers.map((th) => th.getAttribute('scope'))).toEqual(['col', 'col', 'col']);
            expect(headers[0].className).toBe('table__numeric');
            expect(headers[1].textContent).toBe('Name');
            expect(headers[2].querySelector('.visually-hidden').textContent).toBe('Actions');
            expect(table.querySelectorAll('tbody tr')).toHaveLength(1);

            const plain = dataTable('Plain', ['Col'], [], { framed: false, dense: false, showCaption: true, captionId: 'custom-cap' });
            expect(plain.className).toBe('table__scroll');
            expect(plain.querySelector('table').className).toBe('table');
            expect(plain.querySelector('caption').className).toBe('table__caption');
            expect(plain.getAttribute('aria-labelledby')).toBe('custom-cap');
        });
    });

    describe('severityOf and severityChip', () => {
        it('normalizes severity aliases and emits chip--status skeletons with distinct sprite icons', () => {
            expect(severityOf('WARN')).toBe('warning');
            expect(severityOf('Danger')).toBe('error');
            expect(severityOf('ok')).toBe('ok');
            expect(severityOf('success')).toBe('success');
            expect(severityOf('debug')).toBe('debug');
            expect(severityOf('unknown')).toBe('info');
            expect(severityOf(null)).toBe('info');

            const ok = severityChip('ok', 'Active');
            expect(ok.className).toBe('chip chip--status');
            expect(ok.dataset.severity).toBe('ok');
            expect(ok.querySelector('svg.icon use').getAttribute('href')).toBe(`${SPRITE}#icon-check`);
            expect(ok.textContent).toBe('Active');

            const warn = severityChip('warn');
            expect(warn.className).toBe('chip chip--status chip--warning');
            expect(warn.dataset.severity).toBe('warning');
            expect(warn.querySelector('svg.icon use').getAttribute('href')).toBe(`${SPRITE}#icon-sync-error`);
            expect(warn.textContent).toBe('Warning');

            const err = severityChip('error', 'Locked');
            expect(err.className).toBe('chip chip--status chip--danger');
            expect(err.dataset.severity).toBe('error');
            expect(err.querySelector('svg.icon use').getAttribute('href')).toBe(`${SPRITE}#icon-alert`);
            expect(err.textContent).toBe('Locked');

            const custom = severityChip('info', 'Note', { icon: 'help' });
            expect(custom.querySelector('svg.icon use').getAttribute('href')).toBe(`${SPRITE}#icon-help`);
        });
    });

    describe('statusLine, errorBanner, and emptyState', () => {
        it('matches the loading__status catalog skeleton', () => {
            const line = statusLine('Loading accounts…');
            expect(line.tagName).toBe('P');
            expect(line.className).toBe('loading__status');
            expect(line.getAttribute('role')).toBe('status');
            expect(line.getAttribute('aria-live')).toBe('polite');
            expect(line.getAttribute('aria-atomic')).toBe('true');
            expect(line.textContent).toBe('Loading accounts…');
        });

        it('matches the banner--danger catalog skeleton with optional action', () => {
            const retry = button('Retry', null, { icon: 'refresh' });
            const banner = errorBanner('Accounts could not be loaded.', retry);
            expect(banner.tagName).toBe('DIV');
            expect(banner.className).toBe('banner banner--danger');
            expect(banner.getAttribute('role')).toBe('alert');
            expect(banner.querySelector('svg.icon use').getAttribute('href')).toBe(`${SPRITE}#icon-alert`);
            expect(banner.querySelector('.banner__text').textContent).toBe('Accounts could not be loaded.');
            expect(banner.contains(retry)).toBe(true);
        });

        it('matches the empty-state catalog skeleton with optional icon, title, and actions', () => {
            const simple = emptyState('No matching accounts.');
            expect(simple.className).toBe('empty-state');
            expect(simple.querySelector('.empty-state__text').textContent).toBe('No matching accounts.');
            expect(simple.querySelector('.empty-state__actions')).toBeNull();

            const clearBtn = button('Clear filter', null, { kind: 'quiet' });
            const full = emptyState('Try another filter.', clearBtn, { icon: 'search', title: 'No accounts found', headingLevel: 3 });
            expect(full.querySelector('svg.icon.icon--lg use').getAttribute('href')).toBe(`${SPRITE}#icon-search`);
            expect(full.querySelector('h3.empty-state__title').textContent).toBe('No accounts found');
            expect(full.querySelector('.empty-state__actions button')).toBe(clearBtn);
        });
    });

    describe('inlineConfirm', () => {
        it('matches the inline-confirm skeleton, evaluates dynamic questions, handles confirm/cancel/Escape, and destroys cleanly', () => {
            const dom = createDomBuilders(document);
            let targetName = 'Alex North';
            const onConfirm = vi.fn();
            const onCancel = vi.fn();
            const trigger = dom.button('Delete permanently', null, { kind: 'primary', danger: true });
            const slot = dom.inlineConfirm(trigger, {
                label: 'Confirm permanent deletion',
                text: () => `Delete ${targetName} now?`,
                confirmLabel: 'Delete permanently',
                onConfirm,
                onCancel
            });
            document.body.append(slot);

            expect(slot.hasAttribute('data-inline-confirm-slot')).toBe(true);
            expect(trigger.hasAttribute('data-inline-confirm-content')).toBe(true);
            expect(trigger.hasAttribute('data-inline-confirm-trigger')).toBe(true);

            const question = slot.querySelector('[data-inline-confirm]');
            expect(question.className).toBe('inline-confirm');
            expect(question.getAttribute('role')).toBe('group');
            expect(question.getAttribute('aria-label')).toBe('Confirm permanent deletion');
            expect(question.hidden).toBe(true);

            const yesBtn = question.querySelector('[data-inline-confirm-answer="yes"]');
            const noBtn = question.querySelector('[data-inline-confirm-answer="no"]');
            expect(yesBtn.className).toBe('button button--danger');
            expect(noBtn.className).toBe('button button--secondary');
            expect(noBtn.textContent).toBe('Keep');

            trigger.click();
            expect(question.hidden).toBe(false);
            expect(trigger.hidden).toBe(true);
            expect(question.querySelector('.inline-confirm__question').textContent).toBe('Delete Alex North now?');
            expect(document.activeElement).toBe(question);

            noBtn.click();
            expect(question.hidden).toBe(true);
            expect(trigger.hidden).toBe(false);
            expect(document.activeElement).toBe(trigger);
            expect(onCancel).toHaveBeenCalledTimes(1);
            expect(onConfirm).not.toHaveBeenCalled();

            targetName = 'Jordan Kim';
            trigger.click();
            expect(question.querySelector('.inline-confirm__question').textContent).toBe('Delete Jordan Kim now?');
            yesBtn.click();
            expect(onConfirm).toHaveBeenCalledTimes(1);
            expect(question.hidden).toBe(true);

            // Destroy removes listeners so clicking the trigger no longer opens the confirmation.
            dom.destroy();
            trigger.click();
            expect(question.hidden).toBe(true);
        });

        it('supports static text and the onKeep callback alias when called standalone', () => {
            const onKeep = vi.fn();
            const trigger = button('Revoke', null, { kind: 'primary', danger: true });
            const slot = inlineConfirm(trigger, {
                label: 'Confirm revoke',
                text: 'Revoke this session?',
                confirmLabel: 'Revoke',
                onConfirm: vi.fn(),
                onKeep
            });
            document.body.append(slot);
            const question = slot.querySelector('[data-inline-confirm]');
            expect(question.querySelector('.inline-confirm__question').textContent).toBe('Revoke this session?');
            trigger.click();
            question.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
            expect(question.hidden).toBe(true);
            expect(onKeep).toHaveBeenCalledTimes(1);
        });
    });

    it('registers dom-builders in contract.json', () => {
        const contract = JSON.parse(readFileSync('src/contract.json', 'utf8'));
        expect(contract.components).toContain('dom-builders');
    });
});
