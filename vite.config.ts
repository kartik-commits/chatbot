import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'markdown-vendor': ['react-markdown', 'remark-math', 'rehype-katex'],
          'animation-vendor': ['framer-motion'],
          'katex-vendor': ['katex'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
