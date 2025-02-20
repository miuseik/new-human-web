
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router/index.js";

import App from './App.vue'
const app = createApp(App)
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// import 'element-plus/lib/theme-chalk/index.css'

// import '@/utils/rem'

import "@/assets/style/index.scss";
// import EventBus from "@/utils/Bus.js";
// const $bus = new EventBus()
// // ② 挂载
// // 1.使用provide提供
// app.provide('$bus', $bus)
// // 2.挂载到this上
// app.config.globalProperties.$bus = $bus

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(createPinia())
app.use(router)
// import ElementPlus from "element-plus";
// app.use(ElementPlus)
app.use(ElementPlus)
app.mount('#app')
