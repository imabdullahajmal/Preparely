import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Tailwind v4 recommends using the official Vite plugin for on-demand processing
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
})
