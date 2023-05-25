/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import { createHead } from '@vueuse/head'
import vuetify from './vuetify'
import i18n from './i18n'
import router from '../router'

const head = createHead()

export function registerPlugins(app) {
  loadFonts()
  app.use(head).use(i18n).use(vuetify).use(router)
}
