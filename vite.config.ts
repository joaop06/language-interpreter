import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        testTimeout: 0, // Remove o timeout globalmente
    },
});