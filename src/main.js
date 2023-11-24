/**
 * main.js
 * Vuetify and other plugins then mounts the App`
 */

import App from './App.vue'
import store from '@/store'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'

import dayjs from 'dayjs'
// import router from './router'

//When you check up your router guard in here
// router.beforeEach((to, from, next) => {
//   console.log(to, 'go to URL')
//   console.log(from, 'where from URL')
//   console.log(next, 'next() is function to go other side')
// })

const app = createApp(App).use(store)

registerPlugins(app)
app.config.globalProperties.$dayjs = dayjs
app.mount('#app')
