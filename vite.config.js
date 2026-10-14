import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5174,
    open: false
  },
  test: {
    globals: true,
    environment: 'node'
  }
});
