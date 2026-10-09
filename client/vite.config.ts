import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const inlineEntryCss: Plugin = {
  name: 'inline-entry-css',
  apply: 'build',
  enforce: 'post',
  generateBundle(_options, bundle) {
    const htmlFile = bundle['index.html'];

    if (!htmlFile || htmlFile.type !== 'asset' || typeof htmlFile.source !== 'string') {
      throw new Error('Could not find the generated index.html asset');
    }

    const stylesheetTags = [
      ...htmlFile.source.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*>/g),
    ];

    for (const [tag] of stylesheetTags) {
      const href = tag.match(/\bhref="([^"]+)"/)?.[1];
      const fileName = href?.replace(/^\/+/, '');
      const cssAsset = fileName ? bundle[fileName] : undefined;

      if (!fileName || !cssAsset || cssAsset.type !== 'asset') {
        throw new Error(`Could not inline generated stylesheet: ${href ?? tag}`);
      }

      htmlFile.source = htmlFile.source.replace(
        tag,
        `<style>${String(cssAsset.source)}</style>`,
      );
      delete bundle[fileName];
    }
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), inlineEntryCss],
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
