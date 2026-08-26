import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function ssrCssNoop() {
  return {
    name: 'ssr-css-noop',
    transform(code, id, options) {
      if (options?.ssr && /\.(scss|sass|css)$/.test(id)) {
        return { code: 'export default {}', map: null };
      }
      return null;
    }
  };
}

export default defineConfig({
  plugins: [react(), ssrCssNoop()],
  base: './', // relative asset paths — works on Pages, Vercel and file://
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
