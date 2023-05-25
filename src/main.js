/**
 * main.js
 * Vuetify and other plugins then mounts the App`
 */

import App from './App.vue'
import store from '@/store'
import { createApp } from 'vue'

import { registerPlugins } from '@/plugins'

const app = createApp(App).use(store)

registerPlugins(app)

app.mount('#app')
