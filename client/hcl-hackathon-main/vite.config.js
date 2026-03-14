import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration stays intentionally small because the app does not require
// custom aliases or proxying until the Node.js backend is wired in by teammates.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
