import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE lets the same build live at a sub-path, e.g. BASE=/portfolio/ npm run build
// for https://<user>.github.io/portfolio/
export default defineConfig({
  base: process.env.BASE || '/',
  plugins: [react()],
})
