import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  /*
    There is deliberately no `define: { 'process.env': process.env }` here.
    That inlines the whole build machine's environment into the client bundle,
    which ships every secret on the machine to every visitor. Client config
    belongs in `VITE_`-prefixed variables, which Vite exposes on
    `import.meta.env` on purpose.
  */
  server: {
    host: true,
    port: 3000,
  },
  build: {
    assetsDir: 'assets',
    // The bundle was one 1.1 MB file because `manualChunks` was pinned to
    // `undefined`, which switches Rollup's own splitting off. Routes are lazy
    // now; these groups keep the heavy, rarely-changing vendors cacheable.
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
            'firebase/storage',
          ],
          midi: ['@tonejs/midi'],
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
  base: '/',
});
