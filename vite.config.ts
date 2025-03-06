import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'src': '/src'
    }
  },
  optimizeDeps: {
    include: ['xlsx']
  },
  build: {
    commonjsOptions: {
      include: [/xlsx/, /node_modules/]
    }
  }
})
