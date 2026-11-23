// Covers the install prompt module: beforeinstallprompt, appinstalled, prompt outcome, standalone detection, and destroy.
import { describe, expect, it, vi } from 'vitest';
import { attachInstallPrompt } from '../../src/js/install-prompt.js';
import { readContract } from './contract.js';

/**
 * A fake EventTarget that counts active listeners so destroy() cleanup can be asserted.
 * @returns {EventTarget & {count: () => number}} tracked target
 */
function trackedTarget() {
    const target = new EventTarget();
    const listeners = new Set();
    const add = target.addEventListener.bind(target);
    const remove = target.removeEventListener.bind(target);
    return Object.assign(target, {
        addEventListener(type, listener, options) {
            listeners.add(listener);
            add(type, listener, options);
        },
        removeEventListener(type, listener, options) {
            listeners.delete(listener);
            remove(type, listener, options);
        },
        count: () => listeners.size
    });
}

/**
 * Create a fake MediaQueryList whose `matches` state can change during a test.
 * @param {boolean} initial whether `(display-mode: standalone)` matches at start
 * @returns {EventTarget & {matches: boolean, media: string, set: (next: boolean) => void, count: () => number}} fake media query
 */
function fakeMedia(initial = false) {
    const media = Object.assign(trackedTarget(), {
        matches: initial,
        media: '(display-mode: standalone)',
        set(next) {
            this.matches = next;
            this.dispatchEvent(new Event('change'));
        }
    });
    return media;
}

/**
 * Build a synthetic cancelable `beforeinstallprompt` event.
 * @param {object} [options] event behavior
 * @param {() => unknown} [options.prompt] custom prompt handler
 * @param {Promise<{outcome: string, platform?: string}>} [options.userChoice] promise resolving to the user's choice
 * @returns {Event & {prompt: Function, userChoice?: Promise<{outcome: string, platform?: string}>}} synthetic event
 */
function installEvent({ prompt = vi.fn(), userChoice = Promise.resolve({ outcome: 'accepted', platform: 'web' }) } = {}) {
    const event = new Event('beforeinstallprompt', { cancelable: true });
    event.prompt = prompt;
    if (userChoice !== undefined) {
        event.userChoice = userChoice;
    }
    return event;
}

describe('attachInstallPrompt', () => {
    it('starts neither installable nor installed in a browser tab without calling onChange', () => {
        const win = trackedTarget();
        const media = fakeMedia(false);
        const onChange = vi.fn();
        const controller = attachInstallPrompt({ window: win, matchMedia: () => media, onChange });
        expect(controller.getState()).toEqual({ installable: false, installed: false });
        expect(controller.isInstallable()).toBe(false);
        expect(controller.isInstalled()).toBe(false);
        expect(onChange).not.toHaveBeenCalled();
        controller.destroy();
    });

    it('detects an installed app through standalone display mode and media changes', () => {
        const win = trackedTarget();
        const initialMedia = fakeMedia(true);
        const matchMedia = vi.fn(() => initialMedia);
        const controller = attachInstallPrompt({ window: win, matchMedia });
        expect(matchMedia).toHaveBeenCalledWith('(display-mode: standalone)');
        expect(controller.getState()).toEqual({ installable: false, installed: true });
        expect(controller.isInstalled()).toBe(true);
        controller.destroy();

        const liveWin = trackedTarget();
        const liveMedia = fakeMedia(false);
        const onChange = vi.fn();
        const live = attachInstallPrompt({ window: liveWin, matchMedia: () => liveMedia, onChange });
        liveWin.dispatchEvent(installEvent());
        expect(live.getState()).toEqual({ installable: true, installed: false });
        liveMedia.set(true);
        expect(live.getState()).toEqual({ installable: false, installed: true });
        expect(onChange.mock.calls).toEqual([
            [{ installable: true, installed: false }],
            [{ installable: false, installed: true }]
        ]);
        live.destroy();
    });

    it('detects legacy iOS standalone mode through navigator.standalone', () => {
        const win = Object.assign(trackedTarget(), { navigator: { standalone: true } });
        const controller = attachInstallPrompt({ window: win, matchMedia: () => fakeMedia(false) });
        expect(controller.getState()).toEqual({ installable: false, installed: true });
        controller.destroy();
    });

    it('keeps beforeinstallprompt, prevents its default, and deduplicates repeat state updates', () => {
        const win = trackedTarget();
        const onChange = vi.fn();
        const controller = attachInstallPrompt({ window: win, matchMedia: () => fakeMedia(false), onChange });
        const first = installEvent();
        win.dispatchEvent(first);
        expect(first.defaultPrevented).toBe(true);
        expect(controller.getState()).toEqual({ installable: true, installed: false });
        expect(onChange).toHaveBeenCalledExactlyOnceWith({ installable: true, installed: false });

        const second = installEvent();
        win.dispatchEvent(second);
        expect(second.defaultPrevented).toBe(true);
        expect(onChange).toHaveBeenCalledTimes(1);
        controller.destroy();
    });

    it('ignores beforeinstallprompt while already running in standalone mode', () => {
        const win = trackedTarget();
        const onChange = vi.fn();
        const controller = attachInstallPrompt({ window: win, matchMedia: () => fakeMedia(true), onChange });
        const event = installEvent();
        win.dispatchEvent(event);
        expect(controller.getState()).toEqual({ installable: false, installed: true });
        expect(onChange).not.toHaveBeenCalled();
        controller.destroy();
    });

    it('prompts on a user gesture, clears the kept event before awaiting choice, and resolves the outcome', async () => {
        const win = trackedTarget();
        const onChange = vi.fn();
        const controller = attachInstallPrompt({ window: win, matchMedia: () => fakeMedia(false), onChange });
        let resolveChoice;
        const userChoice = new Promise((resolve) => {
            resolveChoice = resolve;
        });
        const promptSpy = vi.fn();
        win.dispatchEvent(installEvent({ prompt: promptSpy, userChoice }));

        const pending = controller.prompt();
        expect(promptSpy).toHaveBeenCalledTimes(1);
        expect(controller.getState()).toEqual({ installable: false, installed: false });
        expect(onChange).toHaveBeenLastCalledWith({ installable: false, installed: false });
        // A second prompt call while awaiting cannot reuse the spent event.
        await expect(controller.prompt()).resolves.toEqual({ outcome: 'unavailable' });
        expect(promptSpy).toHaveBeenCalledTimes(1);

        resolveChoice({ outcome: 'accepted', platform: 'web' });
        await expect(pending).resolves.toEqual({ outcome: 'accepted', platform: 'web' });
        controller.destroy();
    });

    it('supports modern prompt() promises returning the choice directly and dismissed outcomes', async () => {
        const win = trackedTarget();
        const controller = attachInstallPrompt({ window: win, matchMedia: () => fakeMedia(false) });
        const directPrompt = vi.fn().mockResolvedValue({ outcome: 'dismissed', platform: 'web' });
        win.dispatchEvent(installEvent({ prompt: directPrompt, userChoice: undefined }));

        await expect(controller.prompt()).resolves.toEqual({ outcome: 'dismissed', platform: 'web' });
        expect(controller.isInstallable()).toBe(false);

        const retryPrompt = vi.fn().mockResolvedValue({ outcome: 'accepted', platform: 'web' });
        win.dispatchEvent(installEvent({ prompt: retryPrompt, userChoice: undefined }));
        expect(controller.isInstallable()).toBe(true);
        await expect(controller.prompt()).resolves.toEqual({ outcome: 'accepted', platform: 'web' });
        controller.destroy();
    });

    it('resolves unavailable when no prompt is kept and propagates prompt() rejections', async () => {
        const win = trackedTarget();
        const onChange = vi.fn();
        const controller = attachInstallPrompt({ window: win, matchMedia: () => fakeMedia(false), onChange });
        await expect(controller.prompt()).resolves.toEqual({ outcome: 'unavailable' });
        expect(onChange).not.toHaveBeenCalled();

        const failing = vi.fn().mockRejectedValue(new Error('gesture required'));
        win.dispatchEvent(installEvent({ prompt: failing }));
        await expect(controller.prompt()).rejects.toThrow('gesture required');
        expect(controller.isInstallable()).toBe(false);
        controller.destroy();
    });

    it('marks the app installed and clears any kept event on appinstalled', async () => {
        const win = trackedTarget();
        const onChange = vi.fn();
        const controller = attachInstallPrompt({ window: win, matchMedia: () => fakeMedia(false), onChange });
        win.dispatchEvent(installEvent());
        win.dispatchEvent(new Event('appinstalled'));
        win.dispatchEvent(new Event('appinstalled'));
        expect(controller.getState()).toEqual({ installable: false, installed: true });
        expect(onChange.mock.calls).toEqual([
            [{ installable: true, installed: false }],
            [{ installable: false, installed: true }]
        ]);
        await expect(controller.prompt()).resolves.toEqual({ outcome: 'unavailable' });
        controller.destroy();
    });

    it('removes every listener, clears the kept event, and stops reporting after destroy', async () => {
        const win = trackedTarget();
        const media = fakeMedia(false);
        const onChange = vi.fn();
        const controller = attachInstallPrompt({ window: win, matchMedia: () => media, onChange });
        expect(win.count()).toBe(2);
        expect(media.count()).toBe(1);

        win.dispatchEvent(installEvent());
        expect(onChange).toHaveBeenCalledTimes(1);

        controller.destroy();
        controller.destroy();
        expect(win.count()).toBe(0);
        expect(media.count()).toBe(0);
        expect(onChange).toHaveBeenCalledTimes(1);
        await expect(controller.prompt()).resolves.toEqual({ outcome: 'unavailable' });

        win.dispatchEvent(installEvent());
        win.dispatchEvent(new Event('appinstalled'));
        media.set(true);
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it('returns an inert controller when window is absent', async () => {
        const controller = attachInstallPrompt({ window: null });
        expect(controller.getState()).toEqual({ installable: false, installed: false });
        await expect(controller.prompt()).resolves.toEqual({ outcome: 'unavailable' });
        expect(() => controller.destroy()).not.toThrow();
    });

    it('registers install-prompt in contract.json', () => {
        expect(readContract().components).toContain('install-prompt');
    });
});
