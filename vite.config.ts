import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // This allows proper routing for development server
    historyApiFallback: true
  },
  build: {
    // Generates a single-page application
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Ensures CSS and JS chunks have consistent names
        manualChunks: undefined,
      },
    },
  },
  base: '/' // Ensures assets are loaded from the correct path
})
