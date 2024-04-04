import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import VueSetupExtend from 'vite-plugin-vue-setup-extend'
import {resolve} from "path";
// 自动导入vue中hook reactive ref等
import AutoImport from "unplugin-auto-import/vite"
//自动导入ui-组件 比如说ant-design-vue  element-plus等
import Components from 'unplugin-vue-components/vite';

import env from ".//src/env/moudules/env.js";


import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    VueSetupExtend(),

    AutoImport({
      //安装两行后你会发现在组件中不用再导入ref，reactive等
      imports: ['vue', 'vue-router'],
      //存放的位置
      dts: "src/auto-import.d.ts",
    }),
    Components({
      // 引入组件的,包括自定义组件
      // 存放的位置
      dts: "src/components.d.ts",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve("src"),
    },
  },
  server: {
    cors: true, // 默认启用并允许任何源
    open: false,// 默认打开浏览器
    port: 80,// 访问的端口号
    host: "0.0.0.0",// 访问的地址
    proxy: {
      '/api': {	//
        target: env.API_URL, // 目标地址
        // target: 'http://121.40.151.10:9000', // 目标地址
        ws: true,
        secure: false,
        changeOrigin: true,// 是否允许跨域代理
        rewrite: (path) => path.replace(/^\/api/, '') // 重定向地址
      }
    },
  },
  base: './',
  build:{
    chunkSizeWarningLimit:2000
  },
  css   : {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/assets/style/index.scss";`,
      }
    }
  }
})
