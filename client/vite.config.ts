import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Lets the dev server call the API on the same origin, so no CORS setup
      // or VITE_API_URL is needed locally.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // The dependencies change far less often than the app code, so they go
        // in their own chunks and stay cached in the browser across deploys.
        advancedChunks: {
          groups: [
            {
              name: 'react',
              test: /node_modules[\\/](react|react-dom|scheduler|react-router)/,
            },
            {
              name: 'redux',
              test: /node_modules[\\/](@reduxjs|react-redux|immer|redux)/,
            },
            { name: 'supabase', test: /node_modules[\\/]@supabase/ },
          ],
        },
      },
    },
  },
});
