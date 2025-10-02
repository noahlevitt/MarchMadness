import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './Frontend/src/setupTests.js',
    globals: true,            
  },
  resolve: {
    dedupe: ['react', 'react-dom'],   // prevents double‑react in tests
  },
});

