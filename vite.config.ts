import { defineConfig } from 'vite';
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
});
