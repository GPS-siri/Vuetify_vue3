import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueMoment from 'vue-moment'
import VueMeta from 'vue-meta'
import i18n from './i18n'
import crypto from 'crypto-js'
// import VueMobileDetection from 'vue-mobile-detection'
Vue.config.productionTip = false

Vue.use(VueMoment)
Vue.use(VueMeta)
// Vue.use(VueMobileDetection)

import JsonExcel from 'vue-json-excel'

Vue.component('downloadExcel', JsonExcel)
Vue.prototype.$cryptoJs = crypto

router.beforeEach(async (to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		if (sessionStorage.getItem('here-t') === null) {
			router.push('/admin/login')
		} else {
			next()
		}
	} else {
		next()
	}
	// if (to.matched.some(record => record.meta.admin)) {
	// 	store
	// 		.dispatch('me')
	// 		.then(res => {
	// 			if (res.me.role.name === 'partner') {
	// 				router.push('/block')
	// 				sessionStorage.removeItem('here-t')
	// 			} else {
	// 				next()
	// 			}
	// 		})
	// 		.catch(() => {
	// 			sessionStorage.removeItem('here-t')
	// 			router.push('/block')
	// 		})
	// } else {
	// 	next()
	// }
})

new Vue({
	data: {
		json_meta: [
			[
				{
					key: 'charset',
					value: 'utf-8',
				},
			],
		],
	},
	router,
	store,
	vuetify,
	// VueMobileDetection,
	i18n,
	render: h => h(App),
}).$mount('#app')
