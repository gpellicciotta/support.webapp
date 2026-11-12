import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/integration/**/*.test.js'],
        // Each test packs the repository, and prepack and postpack share one manifest.json.
        fileParallelism: false,
        testTimeout: 120_000
    }
});
