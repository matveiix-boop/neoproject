import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const apiProxy = {
  target: 'http://[::1]:8080',
  changeOrigin: true,
  rewrite: (path: string) => path.replace(/^\/api/, ''),
};

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': apiProxy,
    },
  },
  preview: {
    proxy: {
      '/api': apiProxy,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: false,
    css: true,
    pool: 'threads',
    maxWorkers: 4,
    isolate: false,
    teardownTimeout: 1000,
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['dist/**', 'src/test/**', '**/*.d.ts', '**/*.scss', 'src/shared/assets/**'],
    },
  },
});
