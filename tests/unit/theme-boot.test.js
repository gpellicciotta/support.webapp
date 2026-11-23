import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { Window } from 'happy-dom';
import { describe, expect, it, vi } from 'vitest';
import {
    applyTheme,
    attachThemeSwitch,
    normalizeTheme,
    syncAccountTheme,
    themeBootScript,
    themeOfSettings
} from '../../src/js/theme-switch.js';

const bootSource = () => readFileSync(new URL('../../src/js/theme-boot.js', import.meta.url), 'utf8');

function setup(appName = 'example', getStorage) {
    const window = new Window({ url: 'https://example.test' });
    const doc = window.document;
    doc.head.innerHTML = '<meta name="color-scheme" content="light dark">';
    doc.body.innerHTML = '<fieldset><input type="radio" name="theme" value="system"><input type="radio" name="theme" value="light"><input type="radio" name="theme" value="dark"></fieldset>';
    const storage = window.localStorage;
    const create = (options = {}) => attachThemeSwitch(doc.body, {
        document: doc,
        appName,
        getStorage: getStorage ?? (() => storage),
        ...options
    });
    return { window, doc, storage, create };
}

function runBootScript(code, { app, legacyKey, storageData = {}, throwOnStorage = false, withMeta = true } = {}) {
    const window = new Window({ url: 'https://example.test' });
    const doc = window.document;
    if (withMeta) {
        doc.head.innerHTML = '<meta name="color-scheme" content="light dark">';
    }
    const script = doc.createElement('script');
    if (app !== undefined) {
        script.setAttribute('data-theme-switch-app', app);
    }
    if (legacyKey !== undefined) {
        script.setAttribute('data-theme-switch-legacy-key', legacyKey);
    }
    Object.defineProperty(doc, 'currentScript', { value: script, configurable: true });
    for (const [key, value] of Object.entries(storageData)) {
        window.localStorage.setItem(key, value);
    }
    const localStorage = throwOnStorage
        ? new Proxy({}, {
            get() {
                throw new Error('storage blocked');
            }
        })
        : window.localStorage;
    vm.runInNewContext(code, { document: doc, localStorage });
    return { doc, storage: window.localStorage };
}

describe('normalizeTheme and themeOfSettings', () => {
    it('normalizes known themes, maps default to system, and ignores unknown values', () => {
        expect(normalizeTheme('light')).toBe('light');
        expect(normalizeTheme('DARK')).toBe('dark');
        expect(normalizeTheme(' system ')).toBe('system');
        expect(normalizeTheme('default')).toBe('system');
        expect(normalizeTheme('DEFAULT')).toBe('system');
        expect(normalizeTheme('sepia')).toBe(null);
        expect(normalizeTheme('')).toBe(null);
        expect(normalizeTheme(null)).toBe(null);
        expect(normalizeTheme(42)).toBe(null);
    });

    it('reads theme and style-settings from lists, objects, JSON strings, and bare strings', () => {
        expect(themeOfSettings([{ name: 'theme', value: 'dark' }])).toBe('dark');
        expect(themeOfSettings([{ name: 'theme', value: 'default' }])).toBe('system');
        expect(themeOfSettings([{ name: 'style-settings', value: { theme: 'light' } }])).toBe('light');
        expect(themeOfSettings([{ name: 'style-settings', value: { theme: 'default' } }])).toBe('system');
        expect(themeOfSettings([{ name: 'style-settings', value: '{"theme":"dark"}' }])).toBe('dark');
        expect(themeOfSettings([
            { name: 'style-settings', value: { theme: 'light' } },
            { name: 'theme', value: 'dark' }
        ])).toBe('dark');
        expect(themeOfSettings([
            { name: 'theme', value: 'unknown' },
            { name: 'style-settings', value: { theme: 'dark' } }
        ])).toBe('dark');
        expect(themeOfSettings({ theme: 'dark' })).toBe('dark');
        expect(themeOfSettings({ theme: 'default' })).toBe('system');
        expect(themeOfSettings({ 'style-settings': { theme: 'light' } })).toBe('light');
        expect(themeOfSettings({ 'style-settings': { theme: 'default' } })).toBe('system');
        expect(themeOfSettings({ 'style-settings': '{"theme":"dark"}' })).toBe('dark');
        expect(themeOfSettings({ 'style-settings': { theme: 'light' }, theme: 'dark' })).toBe('dark');
        expect(themeOfSettings('dark')).toBe('dark');
        expect(themeOfSettings('default')).toBe('system');
    });

    it('returns null when settings hold no known theme', () => {
        expect(themeOfSettings(null)).toBe(null);
        expect(themeOfSettings(undefined)).toBe(null);
        expect(themeOfSettings([])).toBe(null);
        expect(themeOfSettings({})).toBe(null);
        expect(themeOfSettings([{ name: 'other', value: 'dark' }])).toBe(null);
        expect(themeOfSettings([{ name: 'theme', value: 'bogus' }])).toBe(null);
        expect(themeOfSettings([{ name: 'style-settings', value: 'not-json' }])).toBe(null);
        expect(themeOfSettings({ theme: 'unknown' })).toBe(null);
    });
});

describe('theme boot script', () => {
    it('applies stored light and dark themes and updates color-scheme metadata', () => {
        const dark = runBootScript(bootSource(), { app: 'auth', storageData: { 'auth.theme': 'dark' } });
        expect(dark.doc.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(dark.doc.querySelector('meta[name="color-scheme"]').getAttribute('content')).toBe('dark');

        const light = runBootScript(bootSource(), { app: 'auth', storageData: { 'auth.theme': 'light' } });
        expect(light.doc.documentElement.getAttribute('data-theme')).toBe('light');
        expect(light.doc.querySelector('meta[name="color-scheme"]').getAttribute('content')).toBe('light');

        const system = runBootScript(bootSource(), { app: 'auth', storageData: { 'auth.theme': 'system' } });
        expect(system.doc.documentElement.hasAttribute('data-theme')).toBe(false);
        expect(system.doc.querySelector('meta[name="color-scheme"]').getAttribute('content')).toBe('light dark');
    });

    it('migrates a legacy key once without overwriting an existing value', () => {
        const migrated = runBootScript(bootSource(), {
            app: 'auth',
            legacyKey: 'auth_theme',
            storageData: { auth_theme: 'dark' }
        });
        expect(migrated.doc.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(migrated.storage.getItem('auth.theme')).toBe('dark');
        expect(migrated.storage.getItem('auth_theme')).toBe(null);

        const kept = runBootScript(bootSource(), {
            app: 'auth',
            legacyKey: 'auth_theme',
            storageData: { 'auth.theme': 'light', auth_theme: 'dark' }
        });
        expect(kept.doc.documentElement.getAttribute('data-theme')).toBe('light');
        expect(kept.storage.getItem('auth.theme')).toBe('light');
        expect(kept.storage.getItem('auth_theme')).toBe(null);

        const ignored = runBootScript(bootSource(), {
            app: 'auth',
            legacyKey: 'auth_theme',
            storageData: { auth_theme: 'default' }
        });
        expect(ignored.doc.documentElement.hasAttribute('data-theme')).toBe(false);
        expect(ignored.storage.getItem('auth.theme')).toBe(null);
        expect(ignored.storage.getItem('auth_theme')).toBe(null);
    });

    it('never throws when storage is blocked or attributes are missing', () => {
        expect(() => runBootScript(bootSource(), { app: 'auth', throwOnStorage: true })).not.toThrow();
        const missing = runBootScript(bootSource(), { storageData: { 'auth.theme': 'dark' } });
        expect(missing.doc.documentElement.hasAttribute('data-theme')).toBe(false);
    });

    it('generates an inlineable classic script via themeBootScript', () => {
        const inline = themeBootScript('counters', { legacyKey: 'counters_theme' });
        const result = runBootScript(inline, { storageData: { counters_theme: 'dark' } });
        expect(result.doc.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(result.storage.getItem('counters.theme')).toBe('dark');
        expect(result.storage.getItem('counters_theme')).toBe(null);
        expect(() => runBootScript(inline, { throwOnStorage: true })).not.toThrow();
        expect(() => themeBootScript('')).toThrow(TypeError);
    });
});

describe('applyTheme color-scheme metadata', () => {
    it('syncs meta[name="color-scheme"] when present', () => {
        const { doc } = setup();
        applyTheme(doc, 'dark');
        expect(doc.querySelector('meta[name="color-scheme"]').getAttribute('content')).toBe('dark');
        applyTheme(doc, 'light');
        expect(doc.querySelector('meta[name="color-scheme"]').getAttribute('content')).toBe('light');
        applyTheme(doc, 'system');
        expect(doc.querySelector('meta[name="color-scheme"]').getAttribute('content')).toBe('light dark');
    });
});

describe('account theme sync', () => {
    it('applies preloaded or fetched account settings via syncAccountTheme', async () => {
        const { doc, storage } = setup();
        const onChange = vi.fn();
        const fromList = await syncAccountTheme({
            document: doc,
            appName: 'auth',
            getStorage: () => storage,
            settings: [{ name: 'theme', value: 'dark' }],
            onChange
        });
        expect(fromList).toBe('dark');
        expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(storage.getItem('auth.theme')).toBe('dark');
        expect(onChange).toHaveBeenCalledWith('dark', true);

        const fromLoad = await syncAccountTheme({
            document: doc,
            appName: 'auth',
            getStorage: () => storage,
            load: async () => ({ 'style-settings': { theme: 'default' } })
        });
        expect(fromLoad).toBe('system');
        expect(doc.documentElement.hasAttribute('data-theme')).toBe(false);
        expect(storage.getItem('auth.theme')).toBe('system');
    });

    it('reports load failures through onError and leaves the current theme alone', async () => {
        const { doc, storage } = setup();
        applyTheme(doc, 'dark');
        const onError = vi.fn();
        const failed = await syncAccountTheme({
            document: doc,
            appName: 'auth',
            getStorage: () => storage,
            load: async () => {
                throw new Error('offline');
            },
            onError
        });
        expect(failed).toBe(null);
        expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(onError).toHaveBeenCalledWith(expect.any(Error), { operation: 'load' });
        await expect(syncAccountTheme({ document: doc })).rejects.toThrow(TypeError);
    });

    it('syncs account settings on attachThemeSwitch without echoing save back', async () => {
        const { doc, storage, create } = setup('auth');
        const load = vi.fn(async () => [{ name: 'theme', value: 'dark' }]);
        const save = vi.fn(async () => {});
        const controller = create({ sync: { load, save } });

        const synced = await controller.sync();
        expect(synced).toBe('dark');
        expect(doc.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(doc.querySelector('[value="dark"]').checked).toBe(true);
        expect(storage.getItem('auth.theme')).toBe('dark');
        expect(save).not.toHaveBeenCalled();

        doc.querySelector('[value="light"]').click();
        expect(save).toHaveBeenCalledWith('light');
        expect(save).toHaveBeenCalledTimes(1);

        const direct = await controller.sync({ 'style-settings': { theme: 'default' } });
        expect(direct).toBe('system');
        expect(doc.querySelector('[value="system"]').checked).toBe(true);
        expect(save).toHaveBeenCalledTimes(1);

        controller.setTheme('dark', { sync: false });
        expect(save).toHaveBeenCalledTimes(1);
        controller.destroy();
    });

    it('forwards save errors to sync.onError and ignores stale in-flight loads', async () => {
        const { doc, create } = setup('auth');
        let finishLoad;
        const onError = vi.fn();
        const controller = create({
            sync: {
                load: () => new Promise((resolve) => {
                    finishLoad = resolve;
                }),
                save: async () => {
                    throw new Error('save failed');
                },
                onError
            }
        });

        const pending = controller.sync();
        doc.querySelector('[value="light"]').click();
        finishLoad([{ name: 'theme', value: 'dark' }]);
        expect(await pending).toBe(null);
        expect(controller.getTheme()).toBe('light');
        expect(doc.documentElement.getAttribute('data-theme')).toBe('light');

        await vi.waitFor(() => {
            expect(onError).toHaveBeenCalledWith(expect.any(Error), { operation: 'save', theme: 'light' });
        });
        controller.destroy();
    });

    it('migrates legacyKey on attach and reacts to cross-tab storage events', () => {
        const { window, doc, storage, create } = setup('auth');
        storage.setItem('auth_theme', 'dark');
        const save = vi.fn();
        const controller = create({ legacyKey: 'auth_theme', sync: { save } });
        expect(controller.getTheme()).toBe('dark');
        expect(storage.getItem('auth.theme')).toBe('dark');
        expect(storage.getItem('auth_theme')).toBe(null);

        window.dispatchEvent(new window.StorageEvent('storage', { key: 'auth.theme', newValue: 'light' }));
        expect(controller.getTheme()).toBe('light');
        expect(doc.documentElement.getAttribute('data-theme')).toBe('light');
        expect(doc.querySelector('[value="light"]').checked).toBe(true);
        expect(save).not.toHaveBeenCalled();

        controller.destroy();
        window.dispatchEvent(new window.StorageEvent('storage', { key: 'auth.theme', newValue: 'dark' }));
        expect(controller.getTheme()).toBe('light');
    });
});
