import { createI18n } from 'vue-i18n'
import i18n_ko from '@/assets/i18n/ko.json'
import i18n_en from '@/assets/i18n/en.json'

const messages = {
  ko: i18n_ko,
  en: i18n_en
}

// function loadLocaleMessages() {
//   const locales = require.context('@/assets/i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i)
//   const messages = {}
//   locales.keys().forEach((key) => {
//     const matched = key.match(/([A-Za-z0-9-_]+)\./i)
//     if (matched && matched.length > 1) {
//       const locale = matched[1]
//       messages[locale] = locales(key)
//     }
//   })
//   return messages
// }
console.log(import.meta.env, 'test here ')
console.log(process.env, 'test here 22 ')

export default createI18n({
  locale: import.meta.env.VITE_APP_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages
})
