// @vitest-environment happy-dom
// Unit tests for file-download.js and download toast actions in toast.js.
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createFileDownload, downloadBlob, downloadFile, downloadJson, downloadUrl } from '../../src/js/file-download.js';
import { createToast } from '../../src/js/toast.js';

/**
 * Create a fake URL API tracking created blobs and revocations.
 * @returns {{createObjectURL: ReturnType<typeof vi.fn>, revokeObjectURL: ReturnType<typeof vi.fn>, blobs: Map<string, Blob>, revoked: string[]}} fake URL API
 */
function fakeUrl() {
    let seq = 0;
    const blobs = new Map();
    const revoked = [];
    const createObjectURL = vi.fn((blob) => {
        const href = `blob:https://example.test/${++seq}`;
        blobs.set(href, blob);
        return href;
    });
    const revokeObjectURL = vi.fn((href) => {
        revoked.push(href);
    });
    return { createObjectURL, revokeObjectURL, blobs, revoked };
}

/**
 * Record every click on a temporary `a[download]` inside a document.
 * @param {Document} doc target document
 * @returns {Array<{href: string, download: string, hidden: boolean, hooked: boolean, connected: boolean}>} recorded clicks
 */
function watchDownloads(doc) {
    const clicks = [];
    doc.addEventListener('click', (event) => {
        const link = event.target?.closest?.('a[download]');
        if (!link) {
            return;
        }
        clicks.push({
            href: link.getAttribute('href'),
            download: link.getAttribute('download'),
            hidden: link.hidden,
            hooked: link.hasAttribute('data-file-download'),
            connected: link.isConnected
        });
    });
    return clicks;
}

/**
 * Add a dialog answering `:modal` for open modals in happy-dom.
 * @returns {HTMLDialogElement} the dialog
 */
function addModal() {
    document.body.insertAdjacentHTML('beforeend', '<dialog id="dl-modal"><button type="button">Close</button></dialog>');
    const modal = document.getElementById('dl-modal');
    modal.matches = (selector) => (selector === ':modal' ? modal.open : Element.prototype.matches.call(modal, selector));
    return modal;
}

describe('file-download helper', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('serializes JSON with indentation and trailing newline, clicks a temporary anchor, and revokes after the delay', async () => {
        const url = fakeUrl();
        const clicks = watchDownloads(document);
        const handle = downloadJson({ account: 'alex', count: 2 }, 'account.json', { url });

        expect(url.createObjectURL).toHaveBeenCalledTimes(1);
        expect(clicks).toEqual([{
            href: 'blob:https://example.test/1',
            download: 'account.json',
            hidden: true,
            hooked: true,
            connected: true
        }]);
        expect(document.querySelector('a[download]')).toBeNull();

        const blob = url.blobs.get('blob:https://example.test/1');
        expect(blob.type).toBe('application/json');
        expect(await blob.text()).toBe('{\n  "account": "alex",\n  "count": 2\n}\n');

        vi.advanceTimersByTime(999);
        expect(url.revokeObjectURL).not.toHaveBeenCalled();
        expect(handle.isRevoked()).toBe(false);

        vi.advanceTimersByTime(1);
        expect(url.revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:https://example.test/1');
        expect(handle.isRevoked()).toBe(true);
    });

    it('downloads a Blob directly and preserves its MIME type and bytes', async () => {
        const url = fakeUrl();
        const clicks = watchDownloads(document);
        const blob = new Blob(['a,b\n1,2\n'], { type: 'text/csv' });

        downloadBlob(blob, 'report.csv', { url, revokeDelay: 250 });

        expect(clicks).toHaveLength(1);
        expect(clicks[0].download).toBe('report.csv');
        expect(url.blobs.get(clicks[0].href)).toBe(blob);
        expect(await url.blobs.get(clicks[0].href).text()).toBe('a,b\n1,2\n');

        vi.advanceTimersByTime(250);
        expect(url.revokeObjectURL).toHaveBeenCalledExactlyOnceWith(clicks[0].href);
    });

    it('dispatches Blob and JSON values through downloadFile and normalizes undefined JSON', async () => {
        const url = fakeUrl();
        const clicks = watchDownloads(document);
        const plainBlob = new Blob(['hello'], { type: 'text/plain' });

        downloadFile(plainBlob, 'note.txt', { url });
        downloadFile({ ok: true }, 'data.json', { url });
        downloadJson(undefined, 'empty.json', { url });

        expect(clicks.map((entry) => entry.download)).toEqual(['note.txt', 'data.json', 'empty.json']);
        expect(url.blobs.get(clicks[0].href)).toBe(plainBlob);
        expect(await url.blobs.get(clicks[1].href).text()).toBe('{\n  "ok": true\n}\n');
        expect(await url.blobs.get(clicks[2].href).text()).toBe('null\n');

        vi.advanceTimersByTime(1000);
        expect(url.revokeObjectURL).toHaveBeenCalledTimes(3);
    });

    it('keeps a reusable handle active until revoked, revokes idempotently, and refuses clicks once revoked', () => {
        const url = fakeUrl();
        const doc = document.implementation.createHTMLDocument('Export');
        const clicks = watchDownloads(doc);

        const handle = createFileDownload({ items: [1] }, 'items.json', { document: doc, url });
        expect(handle.filename).toBe('items.json');
        expect(handle.url).toBe('blob:https://example.test/1');
        expect(handle.isRevoked()).toBe(false);

        vi.advanceTimersByTime(60_000);
        expect(url.revokeObjectURL).not.toHaveBeenCalled();

        expect(handle.download()).toBe(true);
        expect(clicks).toHaveLength(1);
        expect(document.querySelector('a[download]')).toBeNull();

        handle.revoke({ delay: 1000 });
        handle.destroy();
        handle.revoke();
        expect(url.revokeObjectURL).toHaveBeenCalledTimes(1);
        expect(handle.isRevoked()).toBe(true);

        vi.advanceTimersByTime(5000);
        expect(url.revokeObjectURL).toHaveBeenCalledTimes(1);
        expect(handle.download()).toBe(false);
        expect(clicks).toHaveLength(1);
    });

    it('removes the temporary anchor even when a click listener throws and supports downloadUrl', () => {
        const doc = document.implementation.createHTMLDocument('Throw');
        doc.addEventListener('click', () => {
            throw new Error('click failure');
        });
        expect(() => downloadUrl('https://example.test/file.txt', 'file.txt', { document: doc })).toThrow('click failure');
        expect(doc.querySelector('a[download]')).toBeNull();
    });

    it('registers file-download in contract.json', () => {
        const contract = JSON.parse(readFileSync('src/contract.json', 'utf8'));
        expect(contract.components).toContain('file-download');
    });
});

describe('createToast download actions', () => {
    let region;
    let liveRegion;
    let url;
    let toaster;

    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML = '<button id="export-btn" type="button">Export</button><div id="region" class="toast-region"></div>';
        region = document.getElementById('region');
        liveRegion = { announce: vi.fn(), destroy: vi.fn() };
        url = fakeUrl();
        toaster = createToast({ region, liveRegion, undoShortcut: true, url });
    });

    afterEach(() => {
        toaster.destroy();
        vi.useRealTimers();
    });

    it('shows a persistent download toast with data-toast-action="download" and keeps its URL until clicked', async () => {
        const clicks = watchDownloads(document);
        const onAction = vi.fn();
        const onDismiss = vi.fn();
        const trigger = document.getElementById('export-btn');
        trigger.focus();

        toaster.show('Account export is ready.', {
            download: { json: { user: 'alex' }, filename: 'user-data.json' },
            onAction,
            onDismiss
        });

        const button = region.querySelector('[data-toast-action="download"]');
        expect(button).not.toBeNull();
        expect(button.textContent).toBe('user-data.json');
        expect(url.createObjectURL).toHaveBeenCalledTimes(1);

        // Persistent by default: survives far past the 8 second toast expiry and ignores Ctrl+Z.
        vi.advanceTimersByTime(60_000);
        expect(region.querySelectorAll('.toast')).toHaveLength(1);
        expect(url.revokeObjectURL).not.toHaveBeenCalled();

        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true, cancelable: true }));
        expect(toaster.undoLatest()).toBe(false);
        expect(clicks).toHaveLength(0);
        expect(region.querySelectorAll('.toast')).toHaveLength(1);

        button.focus();
        button.click();

        expect(clicks).toHaveLength(1);
        expect(clicks[0].download).toBe('user-data.json');
        expect(clicks[0].href).toBe('blob:https://example.test/1');
        expect(await url.blobs.get(clicks[0].href).text()).toBe('{\n  "user": "alex"\n}\n');
        expect(region.querySelectorAll('.toast')).toHaveLength(0);
        expect(document.activeElement).toBe(trigger);
        expect(onDismiss).toHaveBeenCalledWith('action');
        expect(onAction).toHaveBeenCalledTimes(1);

        // Keeps the URL briefly so the browser finishes reading the blob, then revokes it once.
        expect(url.revokeObjectURL).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1000);
        expect(url.revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:https://example.test/1');
    });

    it('revokes the object URL immediately when dismissed by dismiss(), Escape, overflow, timeout, or destroy()', () => {
        const dismiss = toaster.show('Export 1 ready.', { download: { blob: new Blob(['1']), filename: '1.txt' } });
        dismiss();
        expect(url.revokeObjectURL).toHaveBeenCalledWith('blob:https://example.test/1');

        toaster.show('Export 2 ready.', { download: { blob: new Blob(['2']), filename: '2.txt' } });
        region.querySelector('.toast').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
        expect(url.revokeObjectURL).toHaveBeenCalledWith('blob:https://example.test/2');

        toaster.show('Export 3 ready.', { download: { blob: new Blob(['3']), filename: '3.txt' }, persistent: false });
        vi.advanceTimersByTime(8000);
        expect(url.revokeObjectURL).toHaveBeenCalledWith('blob:https://example.test/3');

        toaster.show('Export 4 ready.', { download: { blob: new Blob(['4']), filename: '4.txt' } });
        toaster.show('Two');
        toaster.show('Three');
        toaster.show('Four');
        expect(url.revokeObjectURL).toHaveBeenCalledWith('blob:https://example.test/4');

        toaster.show('Export 5 ready.', { download: { blob: new Blob(['5']), filename: '5.txt' } });
        toaster.destroy();
        expect(url.revokeObjectURL).toHaveBeenCalledWith('blob:https://example.test/5');
        expect(url.revokeObjectURL).toHaveBeenCalledTimes(5);
    });

    it('revokes a held download toast dismissed while a modal dialog is open', () => {
        const modal = addModal();
        modal.showModal();
        const dismiss = toaster.show('Held export.', { download: { json: { held: true }, filename: 'held.json' } });
        expect(url.revokeObjectURL).not.toHaveBeenCalled();
        dismiss();
        expect(url.revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:https://example.test/1');
        modal.close();
    });

    it('supports custom labels, pre-built FileDownload handles, and existing blob or https URLs', () => {
        const clicks = watchDownloads(document);
        const handle = createFileDownload({ ready: true }, 'handle.json', { url });
        toaster.show('Handle ready.', { download: handle, actionLabel: 'Save JSON' });
        expect(region.querySelector('[data-toast-action="download"]').textContent).toBe('Save JSON');
        region.querySelector('[data-toast-action="download"]').click();
        expect(clicks[0].download).toBe('handle.json');

        // Destroying the toaster flushes pending post-action revocations immediately.
        toaster.destroy();
        expect(handle.isRevoked()).toBe(true);
        expect(url.revokeObjectURL).toHaveBeenCalledTimes(1);

        toaster = createToast({ region, liveRegion, url });
        const dismissBlobUrl = toaster.show('Existing blob URL.', { download: { url: 'blob:https://example.test/manual', filename: 'manual.json', label: 'Get file' } });
        expect(region.querySelector('[data-toast-action="download"]').textContent).toBe('Get file');
        dismissBlobUrl();
        expect(url.revokeObjectURL).toHaveBeenCalledWith('blob:https://example.test/manual');

        const dismissHttpUrl = toaster.show('Static file.', { download: { url: 'https://example.test/static.json', filename: 'static.json' } });
        dismissHttpUrl();
        expect(url.revokeObjectURL).not.toHaveBeenCalledWith('https://example.test/static.json');
    });
});
