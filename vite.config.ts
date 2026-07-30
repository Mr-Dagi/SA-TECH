import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Exclude archive/snapshot folders from dependency scanning
  optimizeDeps: {
    exclude: [],
    entries: ['./index.html', './src/**/*.{ts,tsx}']
  },
  server: {
    fs: {
      allow: ['.']
    },
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  build: {
    cssMinify: false
  }
})
