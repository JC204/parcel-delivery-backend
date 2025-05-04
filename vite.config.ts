import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      api: path.resolve(__dirname, 'src/api/index.ts'),
      types: path.resolve(__dirname, 'src/types.ts'),
      components: path.resolve(__dirname, 'src/components'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
