import { config } from 'dotenv';
import { defineConfig } from 'vitest/config';

config({ path: '.env' });

export default defineConfig({
    test: {
        testTimeout: 0, // Remove o timeout globalmente
        environment: 'node',
    },
});