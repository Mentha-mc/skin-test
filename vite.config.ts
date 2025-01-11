import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue(), react()],
  optimizeDeps: {
    exclude: ['lucide-react', 'lucide-vue-next'],
  },
  base: './',
});