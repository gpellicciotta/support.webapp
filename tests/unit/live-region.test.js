// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { announce, createLiveRegion } from '../../src/js/live-region.js';

describe('createLiveRegion', () => {
    let liveRegion;

    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = '';
        liveRegion = createLiveRegion();
    });

    afterEach(() => {
        liveRegion.destroy();
        vi.useRealTimers();
    });

    it('adds a polite status and an assertive alert region that stay visually hidden', () => {
        const polite = document.querySelector('[aria-live="polite"]');
        const assertive = document.querySelector('[aria-live="assertive"]');
        expect(polite.getAttribute('role')).toBe('status');
        expect(assertive.getAttribute('role')).toBe('alert');
        expect(polite.getAttribute('aria-atomic')).toBe('true');
        expect(assertive.getAttribute('aria-atomic')).toBe('true');
        expect(polite.classList.contains('visually-hidden')).toBe(true);
        expect(assertive.classList.contains('visually-hidden')).toBe(true);
        expect(polite.getAttribute('style')).toBeNull();
        expect(polite.textContent).toBe('');
    });

    it('announces politely by default after a short delay', () => {
        liveRegion.announce('List created.');
        const polite = document.querySelector('[aria-live="polite"]');
        expect(polite.textContent).toBe('');
        vi.runAllTimers();
        expect(polite.textContent).toBe('List created.');
        expect(document.querySelector('[aria-live="assertive"]').textContent).toBe('');
    });

    it('announces assertively when asked', () => {
        liveRegion.announce('Sync failed.', { politeness: 'assertive' });
        vi.runAllTimers();
        expect(document.querySelector('[aria-live="assertive"]').textContent).toBe('Sync failed.');
    });

    it('clears and sets the text again for a repeated message', () => {
        const polite = document.querySelector('[aria-live="polite"]');
        liveRegion.announce('Task moved.');
        vi.runAllTimers();
        liveRegion.announce('Task moved.');
        expect(polite.textContent).toBe('');
        vi.runAllTimers();
        expect(polite.textContent).toBe('Task moved.');
    });

    it('appends the regions to a given parent', () => {
        liveRegion.destroy();
        document.body.innerHTML = '<div id="parent"></div>';
        const parent = document.getElementById('parent');
        liveRegion = createLiveRegion({ parent });
        expect(parent.querySelectorAll('[aria-live]')).toHaveLength(2);
    });

    it('removes its regions on destroy and ignores later announcements', () => {
        liveRegion.announce('Late.');
        liveRegion.destroy();
        vi.runAllTimers();
        expect(document.querySelector('[aria-live]')).toBeNull();
        liveRegion.announce('Later.');
        vi.runAllTimers();
        expect(document.body.textContent).toBe('');
    });

    it('shares ownership and timers without letting one handle destroy another', () => {
        const second = createLiveRegion();
        expect(document.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
        liveRegion.announce('Overtaken.');
        second.announce('Latest.');
        liveRegion.destroy();
        liveRegion.destroy();
        liveRegion.announce('Ignored.');
        vi.runAllTimers();
        expect(document.querySelector('[data-live-region="polite"]').textContent).toBe('Latest.');
        second.destroy();
        expect(document.querySelector('[aria-live]')).toBeNull();
    });

    it('recreates lazy defaults after destruction and cancels the old pending message', () => {
        announce(document, 'Old.');
        liveRegion.destroy();
        announce(document, 'New.');
        liveRegion = createLiveRegion();
        vi.runAllTimers();
        expect(document.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
        expect(document.querySelector('[data-live-region="polite"]').textContent).toBe('New.');
        announce(document, 'New.');
        expect(document.querySelector('[data-live-region="polite"]').textContent).toBe('');
        vi.runAllTimers();
        expect(document.querySelector('[data-live-region="polite"]').textContent).toBe('New.');
    });

    it('keeps documents isolated', () => {
        const other = document.implementation.createHTMLDocument();
        const second = createLiveRegion({ document: other });
        announce(document, 'First.');
        announce(other, 'Second.');
        vi.runAllTimers();
        expect(document.querySelector('[data-live-region="polite"]').textContent).toBe('First.');
        expect(other.querySelector('[data-live-region="polite"]').textContent).toBe('Second.');
        second.destroy();
    });
});
