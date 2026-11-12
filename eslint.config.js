import stylistic from '@stylistic/eslint-plugin';

export default [
    { ignores: ['node_modules/**', '.venv/**', '.plan/**', 'template/**', 'test-results/**', 'playwright-report/**', 'dist/**'] },
    {
        files: ['**/*.js', '**/*.mjs'],
        plugins: { '@stylistic': stylistic },
        rules: {
            'no-unused-vars': 'error',
            'no-unreachable': 'error',
            'curly': ['error', 'all'],
            '@stylistic/brace-style': ['error', 'stroustrup'],
            '@stylistic/indent': ['error', 4],
            '@stylistic/semi': ['error', 'always']
        }
    }
];
