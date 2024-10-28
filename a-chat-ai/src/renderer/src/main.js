import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/icon/iconfont.css'
import router from '@/router'
import '@/assets/cust-elementplus.scss'
import '@/assets/base.scss'
import '@/assets/git/iconfont.css'
import '@/assets/git/iconfont.js'
import '@/assets/sub/iconfont.js'
import '@/assets/sub/iconfont.css'
import '@/assets/failed/iconfont.js'
import '@/assets/failed/iconfont.css'
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import Utils from "./utils/Utils";
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app  =  createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.config.globalProperties.Utils = Utils
app.mount('#app')

