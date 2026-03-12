import { defineConfig } from 'vite';

export default defineConfig({
  // Root is the workspace folder (index.html lives here)
  root: '.',

  // Static assets served from /public
  publicDir: 'public',

  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },

  server: {
    port: 3000,
    open: true,
  },
});
