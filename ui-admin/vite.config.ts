import { defineConfig } from 'vite';
import { join } from 'path';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    minify: 'terser', // 'terser' 相对较慢，但大多数情况下构建后的文件体积更小。'esbuild' 最小化混淆更快但构建后的文件相对更大。
    sourcemap: false, // 构建后是否生成 source map 文件。如果为 true，将会创建一个独立的 source map 文件
    // brotliSize: false,
    assetsInlineLimit: 4096, // 4KB
    terserOptions: {
      // compress: {
      //   drop_debugger: env.NODE_ENV === "production", // 生产环境去除debugger
      //   drop_console: env.NODE_ENV === "production", // 生产环境去除console
      // },
    },
    rollupOptions: {
      output: {
        dir: join(__dirname, '../public'),
        // 输出文件名
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: '[name]/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        // 第三方依赖进行拆包
        manualChunks: (id: string) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    extensions: [
      '.mjs',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
      '.less',
      '.css',
    ],
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }, // 路径别名
  },
});
