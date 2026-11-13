import { describe, expect, it, vi } from 'vitest';
import { watchWorkerUpdates } from '../../src/js/sw-update.js';

function setup({ controlled = true, waiting = true } = {}) {
    const serviceWorker = new EventTarget();
    serviceWorker.controller = controlled ? {} : null;
    const worker = new EventTarget();
    worker.state = 'installed';
    worker.postMessage = vi.fn();
    const registration = new EventTarget();
    registration.waiting = waiting ? worker : null;
    serviceWorker.register = vi.fn().mockResolvedValue(registration);
    const dismiss = vi.fn();
    const toaster = { show: vi.fn().mockReturnValue(dismiss) };
    const reload = vi.fn();
    const create = () => watchWorkerUpdates({ serviceWorker, script: '/sw.js', toaster, reload });
    return { serviceWorker, worker, registration, toaster, reload, create, dismiss };
}

describe('service worker update', () => {
    it('offers a persistent Update and reloads once only after consent and controller change', async () => {
        const s = setup();
        await s.create();
        expect(s.toaster.show).toHaveBeenCalledWith('An update is ready.', expect.objectContaining({ persistent: true, actionLabel: 'Update', undo: false }));
        expect(s.reload).not.toHaveBeenCalled();
        const latest = { postMessage: vi.fn() };
        s.registration.waiting = latest;
        s.toaster.show.mock.calls[0][1].onAction();
        expect(latest.postMessage).toHaveBeenCalledWith({ type: 'skip-waiting' });
        expect(s.reload).not.toHaveBeenCalled();
        s.serviceWorker.dispatchEvent(new Event('controllerchange'));
        s.serviceWorker.dispatchEvent(new Event('controllerchange'));
        expect(s.reload).toHaveBeenCalledTimes(1);
    });

    it('replaces stale Update with an explicit once-only Reload after activation elsewhere', async () => {
        const s = setup();
        await s.create();
        const staleAction = s.toaster.show.mock.calls[0][1].onAction;
        s.registration.waiting = null;
        s.worker.state = 'activated';
        s.serviceWorker.dispatchEvent(new Event('controllerchange'));
        expect(s.dismiss).toHaveBeenCalledTimes(1);
        expect(s.reload).not.toHaveBeenCalled();
        staleAction();
        expect(s.worker.postMessage).not.toHaveBeenCalled();
        expect(s.reload).not.toHaveBeenCalled();
        expect(s.toaster.show).toHaveBeenLastCalledWith('An update is ready.', expect.objectContaining({ actionLabel: 'Reload', persistent: true, undo: false }));
        const reloadAction = s.toaster.show.mock.calls[1][1].onAction;
        reloadAction();
        reloadAction();
        s.serviceWorker.dispatchEvent(new Event('controllerchange'));
        expect(s.reload).toHaveBeenCalledTimes(1);
        expect(s.worker.postMessage).not.toHaveBeenCalled();
    });

    it('tracks installing updates and cleans up listeners and its toast', async () => {
        const s = setup({ waiting: false });
        const controller = await s.create();
        s.worker.state = 'installing';
        s.registration.installing = s.worker;
        s.registration.dispatchEvent(new Event('updatefound'));
        s.worker.state = 'installed';
        s.registration.waiting = s.worker;
        s.worker.dispatchEvent(new Event('statechange'));
        s.worker.dispatchEvent(new Event('statechange'));
        expect(s.toaster.show).toHaveBeenCalledTimes(1);
        controller.destroy();
        expect(s.dismiss).toHaveBeenCalledTimes(1);
        s.toaster.show.mock.calls[0][1].onAction();
        expect(s.worker.postMessage).not.toHaveBeenCalled();
    });

    it('does not offer first installs or reload automatically', async () => {
        const s = setup({ controlled: false });
        await s.create();
        s.serviceWorker.dispatchEvent(new Event('controllerchange'));
        expect(s.toaster.show).not.toHaveBeenCalled();
        expect(s.reload).not.toHaveBeenCalled();
    });

    it('supports unavailable service workers and propagates registration errors', async () => {
        expect(await watchWorkerUpdates({ serviceWorker: null })).toHaveProperty('destroy');
        const s = setup();
        s.serviceWorker.register.mockRejectedValue(new Error('registration failed'));
        await expect(s.create()).rejects.toThrow('registration failed');
    });
});
