import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false,
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    exclude: ['node_modules/**', 'dist/**', 'tests/e2e/**'],
    globals: true,
  },
})
