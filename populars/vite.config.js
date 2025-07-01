import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteCompression from "vite-plugin-compression"

// https://vite.dev/config/
export default defineConfig({
    build: { minify: "esbuild" }, // boolean | 'terser' | 'esbuild'
    resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [react(), viteCompression({ algorithm: "gzip",threshold: 10240})],
})
