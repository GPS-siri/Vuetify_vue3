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
console.log(process.env.VUE_APP_I18N_LOCALE, process.env.VUE_APP_I18N_FALLBACK_LOCALE, 'test here ')

export default createI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'ko',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ko',
  messages
})
