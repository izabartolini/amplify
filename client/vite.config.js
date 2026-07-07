import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Toda requisição que começar com /api será redirecionada para o Go
      '/api': {
        target: 'http://localhost:8080', // <-- Confirme se o Go roda na porta 8080
        changeOrigin: true,
      }
    }
  }
})