// Covers the timing of the Refresh pattern (ADR-0003): polls while visible, returns to the tab, and destroy.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { attachAutoRefresh } from '../../src/js/auto-refresh.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

/**
 * A stand-in for the document's visibility state and its `visibilitychange` events.
 * @param {'visible'|'hidden'} state the first visibility state
 * @returns {EventTarget & {visibilityState: string, set: (state: string) => void, count: () => number}} the fake document
 */
function fakeDocument(state = 'visible') {
    const target = new EventTarget();
    const listeners = new Set();
    const add = target.addEventListener.bind(target);
    const remove = target.removeEventListener.bind(target);
    return Object.assign(target, {
        visibilityState: state,
        set(next) {
            this.visibilityState = next;
            this.dispatchEvent(new Event('visibilitychange'));
        },
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

describe('attachAutoRefresh', () => {
    let controller;
    let clock;
    const now = () => clock;

    beforeEach(() => {
        vi.useFakeTimers();
        clock = 1_000_000;
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
        vi.useRealTimers();
    });

    /**
     * Advance the fake timers and the injected clock together.
     * @param {number} ms milliseconds to advance
     */
    function advance(ms) {
        clock += ms;
        vi.advanceTimersByTime(ms);
    }

    it('polls once per interval while the tab is visible', () => {
        const onPoll = vi.fn();
        controller = attachAutoRefresh({ document: fakeDocument(), onPoll, now });
        advance(59_999);
        expect(onPoll).not.toHaveBeenCalled();
        advance(1);
        expect(onPoll).toHaveBeenCalledTimes(1);
        advance(120_000);
        expect(onPoll).toHaveBeenCalledTimes(3);
    });

    it('never polls while the tab is hidden', () => {
        const onPoll = vi.fn();
        const doc = fakeDocument();
        controller = attachAutoRefresh({ document: doc, onPoll, now });
        doc.set('hidden');
        advance(300_000);
        expect(onPoll).not.toHaveBeenCalled();
    });

    it('calls onReturn with the hidden time when the tab becomes visible again', () => {
        const onReturn = vi.fn();
        const doc = fakeDocument();
        controller = attachAutoRefresh({ document: doc, onPoll: () => {}, onReturn, now });
        doc.set('hidden');
        expect(onReturn).not.toHaveBeenCalled();
        advance(30_000);
        doc.set('visible');
        expect(onReturn).toHaveBeenCalledExactlyOnceWith({ away: 30_000, long: false });
    });

    it('marks a return long from the absence threshold on', () => {
        const onReturn = vi.fn();
        const doc = fakeDocument();
        controller = attachAutoRefresh({ document: doc, onReturn, now });
        doc.set('hidden');
        advance(59_999);
        doc.set('visible');
        doc.set('hidden');
        advance(60_000);
        doc.set('visible');
        expect(onReturn.mock.calls).toEqual([[{ away: 59_999, long: false }], [{ away: 60_000, long: true }]]);
    });

    it('counts the absence from attach time when the tab starts hidden, and from the first hide when hidden twice', () => {
        const onReturn = vi.fn();
        const doc = fakeDocument('hidden');
        controller = attachAutoRefresh({ document: doc, onReturn, now });
        advance(10_000);
        doc.set('hidden');
        advance(5_000);
        doc.set('visible');
        expect(onReturn).toHaveBeenCalledExactlyOnceWith({ away: 15_000, long: false });
    });

    it('takes a custom interval and absence threshold', () => {
        const onPoll = vi.fn();
        const onReturn = vi.fn();
        const doc = fakeDocument();
        controller = attachAutoRefresh({ document: doc, onPoll, onReturn, interval: 5_000, longAbsence: 2_000, now });
        advance(10_000);
        expect(onPoll).toHaveBeenCalledTimes(2);
        doc.set('hidden');
        advance(2_000);
        doc.set('visible');
        expect(onReturn).toHaveBeenCalledExactlyOnceWith({ away: 2_000, long: true });
    });

    it('stops polls and returns on destroy', () => {
        const onPoll = vi.fn();
        const onReturn = vi.fn();
        const doc = fakeDocument();
        controller = attachAutoRefresh({ document: doc, onPoll, onReturn, now });
        expect(doc.count()).toBe(1);
        controller.destroy();
        controller = null;
        expect(doc.count()).toBe(0);
        advance(120_000);
        doc.set('hidden');
        doc.set('visible');
        expect(onPoll).not.toHaveBeenCalled();
        expect(onReturn).not.toHaveBeenCalled();
    });

    it('defaults to the real clock', () => {
        const onReturn = vi.fn();
        const doc = fakeDocument();
        controller = attachAutoRefresh({ document: doc, onReturn });
        doc.set('hidden');
        vi.advanceTimersByTime(61_000);
        doc.set('visible');
        expect(onReturn).toHaveBeenCalledExactlyOnceWith({ away: 61_000, long: true });
    });
});

describe('Refresh pattern documentation', () => {
    it('lists the pattern in ADR-0003 and the module in the utility table', () => {
        const patterns = read('../../docs/adrs/ADR-0003-components-and-patterns.md').split('### Shared patterns')[1]?.split('###')[0] ?? '';
        expect(patterns).toMatch(/auto-refresh\.js/);
        expect(patterns).toMatch(/Refresh button/);
        const utilities = read('../../docs/specs/naming.md').split('## Utility Modules')[1]?.split('##')[0] ?? '';
        expect(utilities).toMatch(/\|\s*`auto-refresh\.js`\s*\|\s*`attachAutoRefresh`/);
    });
});
