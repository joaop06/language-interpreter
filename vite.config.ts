import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

config({ path: '.env' });

export default defineConfig({
    test: {
        testTimeout: 0, // Remove o timeout globalmente
        environment: 'node',
        coverage: {
            provider: 'v8',
            exclude: [
                'dist/**',
                'test/**',
                'move-pack.js',
                '.eslintrc.js',
                'vite.config.ts',
                'test/helper.ts',
            ]
        }
    },
});