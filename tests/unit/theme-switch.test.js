import { Window } from 'happy-dom';
import { describe, expect, it, vi } from 'vitest';
import { applyTheme, attachThemeSwitch } from '../../src/js/theme-switch.js';

function setup(appName = 'example', getStorage) {
    const window = new Window({ url: 'https://example.test' });
    const doc = window.document;
    doc.body.innerHTML = '<fieldset><input type="radio" name="theme" value="system"><input type="radio" name="theme" value="light"><input type="radio" name="theme" value="dark"></fieldset>';
    const storage = window.localStorage;
    const create = (options = {}) => attachThemeSwitch(doc.body, { document: doc, appName, getStorage: getStorage ?? (() => storage), ...options });
    return { doc, storage, create };
}

describe('theme switch', () => {
    it('defaults to System and leaves the CSS media query in control', () => {
        const { doc, create } = setup();
        doc.documentElement.dataset.theme = 'dark';
        const controller = create();
        expect(controller.getTheme()).toBe('system');
        expect(doc.documentElement.hasAttribute('data-theme')).toBe(false);
        expect(doc.querySelector('[value="system"]').checked).toBe(true);
        controller.destroy();
    });

    it.each(['light', 'dark', 'system'])('restores and stores %s with an app prefix', theme => {
        const { doc, storage, create } = setup();
        storage.setItem('example.theme', theme);
        const controller = create();
        expect(controller.getTheme()).toBe(theme);
        expect(doc.querySelector(`[value="${theme}"]`).checked).toBe(true);
        controller.setTheme('dark');
        expect(storage.getItem('example.theme')).toBe('dark');
        expect(storage.getItem('other.theme')).toBe(null);
        expect(doc.documentElement.dataset.theme).toBe('dark');
    });

    it('handles changes and removes listeners on destroy', () => {
        const { doc, create, storage } = setup();
        const onChange = vi.fn();
        const controller = create({ onChange });
        doc.querySelector('[value="light"]').click();
        expect(storage.getItem('example.theme')).toBe('light');
        expect(onChange).toHaveBeenCalledWith('light', true);
        controller.destroy();
        doc.querySelector('[value="dark"]').click();
        expect(storage.getItem('example.theme')).toBe('light');
    });

    it('ignores corrupt storage and applies choices when storage throws', () => {
        const { create, storage, doc } = setup();
        storage.setItem('example.theme', 'invalid');
        expect(create().getTheme()).toBe('system');
        const failed = setup('blocked', () => {
            throw new Error('blocked');
        });
        const controller = failed.create();
        expect(controller.setTheme('dark')).toBe(false);
        expect(failed.doc.documentElement.dataset.theme).toBe('dark');
        expect(() => applyTheme(doc, 'invalid')).toThrow(RangeError);
        expect(() => attachThemeSwitch(doc.body, { document: doc })).toThrow(TypeError);
    });
});
