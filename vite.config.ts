import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Get repository name from environment variable or default to the current folder name
  const repoName = process.env.VITE_REPO_NAME || 'customer-panel-ghc-poc-v1'
  
  // Use repository name as base path for production builds, root path for development
  const base = command === 'build' ? `/${repoName}/` : '/'
  
  return {
    plugins: [react(), tailwindcss()],
    base,
  }
})
