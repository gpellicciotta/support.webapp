import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['tests/unit/**/*.test.js'],
        exclude: ['**/*.slow.test.*'],
        testTimeout: 30_000
    }
});
