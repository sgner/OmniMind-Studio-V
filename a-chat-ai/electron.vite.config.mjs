import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [vue()],
    server: {
    hmr: true,
      proxy:{ // 获取路径中包含/api的请求
        '/api':{
          target:'http://localhost:5050',
          changeOrigin:true,
          rewrite:(path)=>path.replace(/^\/api/,'')
        }
      }
  }
  },
  build: {
    rollupOptions: {
      external: ['fsevents'],
    },
  },
})
