import "./assets/icon/icon.scss";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from "./router/index.js";

import App from './App.vue'

const app = createApp(App)
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

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
