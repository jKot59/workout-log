import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    globals: true, // Optional: Makes describe, it, expect available without importing
    setupFiles: ['./vitest.setup.ts'], // We'll create this next
  },
});
