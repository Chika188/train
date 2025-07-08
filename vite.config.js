import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteCompression from "vite-plugin-compression"

// https://vite.dev/config/
export default defineConfig({
    base: '/train/',
    build: {
       minify: "esbuild",
       cssMinify: true,
               rollupOptions: {
            output: {
                manualChunks: {
                    // 将 React 相关库打包到一个文件中
                    'vendor': ['react', 'react-dom'],
                },
                // 控制每个文件的大小
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
            }
        },
        // 启用产物分析报告
        reportCompressedSize: true,
        // 设置警告阈值为 800KB
        chunkSizeWarningLimit: 800,
       }, // boolean | 'terser' | 'esbuild'
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
  },
  plugins: [react(), viteCompression({ algorithm: "gzip",threshold: 10240})],
})
