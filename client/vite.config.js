import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
//import WindiCSS from 'vite-plugin-windicss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  
})
