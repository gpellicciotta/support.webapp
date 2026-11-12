import { defineConfig } from '@playwright/test';
import { createServer } from 'node:net';

const port = process.env.TEST_WORKER_INDEX !== undefined
    ? Number(process.env.SUPPORT_WEBAPP_PLAYWRIGHT_PORT)
    : await new Promise((resolve, reject) => {
        const probe = createServer();
        probe.once('error', reject);
        probe.listen(0, '127.0.0.1', () => {
            const { port } = probe.address();
            probe.close(error => {
                if (error) {
                    reject(error);
                }
                else {
                    resolve(port);
                }
            });
        });
    });
// Workers reload this config and must use the runner's selected port.
process.env.SUPPORT_WEBAPP_PLAYWRIGHT_PORT = String(port);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    retries: 0,
    timeout: 120_000,
    use: { baseURL, browserName: 'chromium' },
    projects: [
        { name: 'desktop-light', use: { viewport: { width: 1440, height: 900 }, colorScheme: 'light' } },
        { name: 'desktop-dark', use: { viewport: { width: 1440, height: 900 }, colorScheme: 'dark' } },
        { name: 'mobile-light', use: { viewport: { width: 390, height: 844 }, colorScheme: 'light' } },
        { name: 'mobile-dark', use: { viewport: { width: 390, height: 844 }, colorScheme: 'dark' } }
    ],
    webServer: {
        command: `node scripts/serve.mjs --port ${port}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 30_000
    }
});
