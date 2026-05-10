import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
var apiProxy = {
    target: 'http://[::1]:8080',
    changeOrigin: true,
    rewrite: function (path) { return path.replace(/^\/api/, ''); },
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
