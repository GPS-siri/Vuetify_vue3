import Axios from 'axios'
import Vue from 'vue'
import Vuex from 'vuex'
import apollo from '../apollo/config'
import {
	login,
	createSendSm,
	register,
	updateBusiness,
	createBusiness,
	updateNotice,
	createNotice,
	deleteNotice,
	createCounselor,
	updateCounselor,
	createClient,
	updateClient,
	updateReserveday,
	updateReservation,
	createReservation,
	updateSystem,
	createSystem,
	createGotowork,
	updateGotowork,
	deleteGotowork,
	updateUser,
	updateVacation,
	createProduct,
	updateProduct,
	deleteProduct,
	createVacation,
	createInputBox,
	createCategory,
	createCategoryDetail,
	createTeam,
	updateTeam,
	deleteTeam,
	createRank,
	updateRank,
	deleteRank,
	updateCategoryDetail,
	updateCategory,
	updateInputBox,
	updatePersonalPage,
	createPersonalPage,
	updateMessages,
	updatePost,
} from '../apollo/mutation'
import {
	me,
	sendSms,
	emailDuplicate,
	phoneDuplicate,
	businesses,
	business,
	notices,
	counselor,
	clients,
	clientCount,
	client,
	clientsCount,
	reservations,
	terms,
	gotoWork,
	users,
	productList,
	productList2,
	systems,
	vacationUsers,
	vacations,
	teams,
	productCounts,
	posts,
	inputBoxes,
	productAvailableCounts,
	availableTimes,
	client_check,
	businessDashboard,
	personalPage,
	messages,
	reservation,
	businesses_register,
	businesses_title,
	systems_reservation,
	system,
	ranks,
	postes,
	messages_title,
	event_title,
} from '../apollo/query'
Vue.use(Vuex)

const tokenName = 'here-t'

export default new Vuex.Store({
	state: {
		headerMobileStatus: false,
		footerMobileStatus: false,
		questions: [],
		systemsDatas: [],
		primary: '#3A258F',
		primary2: '#633efd',
		point1: '#E1A5C0',
		point2: '#7254C9',
		point3: '#00B80C',
		point4: '#0CB3D6',
		point5: '#D47FA6',
		PointColor2: '#4058DB',
		business: {
			product: [],
		},
		countShow: [
			{
				count1: 0,
				count2: 0,
				count3: 0,
			},
			{
				count1: 0,
				count2: 0,
				count3: 0,
			},
			{
				count1: 0,
				count2: 0,
				count3: 0,
			},
			{
				count1: 0,
				count2: 0,
				count3: 0,
			},
			{
				count1: 0,
				count2: 0,
				count3: 0,
			},
		],
		leftNavDrawer: true,
		dashBoardList: [
			{
				title: '대쉬보드',
				// mdi: 'chart-bar',
				route: 'dashboard',
				click: false,
				list: [],
			},
			{
				title: '사업지 관리',
				// mdi: 'office-building-outline',
				route: 'business',
				click: false,
				list: [
					{
						title: '사업지 관리',
						click: false,
						route: 'business',
					},
					{
						title: '상담예약시간 관리',
						click: false,
						route: 'business_timeManagement',
					},
					{
						title: '공지사항 관리',
						click: false,
						route: 'business_noticeManagement',
					},
					{
						title: '관리자 리스트',
						click: false,
						route: 'business_managerManagement',
					},
				],
			},
			{
				title: '상품 관리',
				// mdi: 'office-building-outline',
				route: 'product',
				click: false,
				list: [
					{
						title: '상품리스트',
						click: false,
						route: 'goodsList',
					},
					{
						title: '상품등록',
						click: false,
						route: 'goodsAdd',
					},
				],
			},
			{
				title: '상담사 관리',
				// mdi: 'account-circle',
				route: 'counselor',
				click: false,
				list: [
					{
						title: '상담사 리스트',
						click: false,
						route: 'counselor',
					},
					{
						title: '상담예약 리스트',
						click: false,
						route: 'reservationManagement',
					},
				],
			},
			{
				title: '고객 관리',
				// mdi: 'calendar-check',
				route: 'customer',
				click: false,
				list: [
					{
						title: '고객 리스트',
						click: false,
						route: 'client',
					},
				],
			},
			{
				title: '근태관리',
				// mdi: 'format-list-bulleted-square',
				route: 'attendanceManagement',
				click: false,
				list: [
					{
						title: '출/퇴근 리스트',
						click: false,
						route: '/attendanceManagementDayList',
					},
					{
						title: '연차관리',
						click: false,
						route: '/attendanceManagementVacation',
					},
				],
			},
			{
				title: '캠페인 관리',
				// mdi: 'format-list-bulleted-square',
				route: 'campain',
				click: false,
				list: [
					{
						title: '설문관리',
						click: false,
						route: '/campainManage/manage',
					},
				],
			},
		],
		meData: {
			name: '',
		},
		loading: false,
		counselor_detail: {
			dialog: false,
		},
		searchsel_city1_location_defalut: {
			value: '서울특별시',
			errorMessage: '',
			hideDetail: true,
			items: [
				'서울특별시',
				'부산광역시',
				'인천광역시',
				'대구광역시',
				'대전광역시',
				'광주광역시',
				'울산광역시',
				'세종특별자치시',
				'경기도',
				'강원도',
				'충청북도',
				'충청남도',
				'전라북도',
				'전라남도',
				'경상북도',
				'경상남도',
				'제주특별자치도',
			],
			outlined: true,
			filter: true,
			class: 'small_font bizInput',
			color: 'primary2',
			itemColor: 'primary2',
		},
		searchsel_city2_location_defalut: {
			value: '강남구',
			disabled: true,
			errorMessage: '',
			hideDetail: true,
			items: [],
			outlined: true,
			filter: true,
			class: 'small_font bizInput',
			color: 'primary2',
			itemColor: 'primary2',
		},
		searchsel_city3_location_defalut: {
			value: '개포제1동',
			disabled: true,
			errorMessage: '',
			disable: false,
			hideDetail: true,
			items: [],
			outlined: true,
			filter: true,
			class: 'small_font bizInput',
			color: 'primary2',
			itemColor: 'primary2',
		},
		searchsel_city1: {
			value: '',
			errorMessage: '',
			hideDetail: true,
			items: [
				'서울특별시',
				'부산광역시',
				'인천광역시',
				'대구광역시',
				'대전광역시',
				'광주광역시',
				'울산광역시',
				'세종특별자치시',
				'경기도',
				'강원도',
				'충청북도',
				'충청남도',
				'전라북도',
				'전라남도',
				'경상북도',
				'경상남도',
				'제주특별자치도',
			],
			outlined: true,
			filter: true,
			class: 'small_font bizInput',
			color: 'primary2',
			itemColor: 'primary2',
		},
		searchsel_city2: {
			value: '강남구',
			disabled: true,
			errorMessage: '',
			hideDetail: true,
			items: [],
			outlined: true,
			filter: true,
			class: 'small_font bizInput',
			color: 'primary2',
			itemColor: 'primary2',
		},
		searchsel_city3: {
			value: '개포제1동',
			disabled: true,
			errorMessage: '',
			disable: false,
			hideDetail: true,
			items: [],
			outlined: true,
			filter: true,
			class: 'small_font bizInput',
			color: 'primary2',
			itemColor: 'primary2',
		},
	},
	mutations: {},
	actions: {
		me({ state }) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: me,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data.me)
						state.meData = data.me
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		sendSms({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: sendSms,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		notices({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: notices,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		postes({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: postes,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		posts({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: posts,
						variables: input,
						// context: {
						// 	headers: {
						// 		Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
						// 	},
						// },
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		businesses({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: businesses,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		businesses_register({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: businesses_register,
						variables: input,
						// context: {
						// 	headers: {
						// 		Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
						// 	},
						// },
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		businesses_title({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: businesses_title,
						variables: input,
						// context: {
						// 	headers: {
						// 		Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
						// 	},
						// },
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		users({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: users,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		vacationUsers({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: vacationUsers,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		gotoWork({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: gotoWork,
						variables: input,
						// context: {
						// 	headers: {
						// 		Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
						// 	},
						// },
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		business({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: business,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		terms({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: terms,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		reservations({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: reservations,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		clientsCount({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: clientsCount,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		client({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: client,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		clientCount({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: clientCount,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		clients({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: clients,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
						console.log(data)
						console.log(sessionStorage.getItem(tokenName))
						console.log('1aaaaaa')
					})
					.catch(err => {
						console.log(sessionStorage.getItem(tokenName))
						console.log(err)
						console.log(123213)
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		client_check({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: client_check,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		counselor({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: counselor,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		emailDuplicate({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: emailDuplicate,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		phoneDuplicate({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: phoneDuplicate,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		login({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: login, variables: input })
					.then(({ data }) => {
						sessionStorage.setItem(tokenName, data.login.jwt)
						resolve(data.login)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		deleteNotice({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: deleteNotice,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createCounselor({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: createCounselor,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createClient({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: createClient,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateReservation({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: updateReservation,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateMessages({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: updateMessages,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createReservation({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: createReservation,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateReserveday({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: updateReserveday,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateClient({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: updateClient,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateCounselor({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: updateCounselor,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createNotice({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: createNotice,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateNotice({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: updateNotice,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createBusiness({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: createBusiness,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateBusiness({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: updateBusiness,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createSendSm({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createSendSm, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		register({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: register, variables: input })
					.then(({ data }) => {
						sessionStorage.setItem(tokenName, data.register.jwt)
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		upload({}, input) {
			return new Promise((resolve, reject) => {
				var formData = new FormData()
				formData.append('files', input.files)
				let config = { headers: { 'Content-Type': 'multipart/form-data' } }
				Axios.post(process.env.VUE_APP_BACKEND_URL + '/upload', formData, config)
					.then(data => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		productList({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: productList,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		productList2({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: productList2,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		systems({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: systems,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		vacations({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: vacations,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateSystem({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateSystem, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateVacation({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateVacation, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		createSystem({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createSystem, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createGotowork({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createGotowork, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateGotowork({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateGotowork, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		deleteGotowork({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: deleteGotowork, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateUser({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateUser, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		teams({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: teams,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		ranks({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: ranks,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		messages({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: messages,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createProduct({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createProduct, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateProduct({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateProduct, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		deleteProduct({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: deleteProduct, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createVacation({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createVacation, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		productCounts({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: productCounts,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		inputBoxes({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: inputBoxes,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		createInputBox({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createInputBox, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		createTeam({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createTeam, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createCategory({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createCategory, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateTeam({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateTeam, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createCategoryDetail({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createCategoryDetail, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		deleteTeam({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: deleteTeam, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		createRank({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createRank, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateRank({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateRank, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		deleteRank({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: deleteRank, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateCategoryDetail({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateCategoryDetail, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateCategory({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateCategory, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updateInputBox({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updateInputBox, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		productAvailableCounts({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: productAvailableCounts,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		availableTimes({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: availableTimes,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		businessDashboard({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: businessDashboard,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		createPersonalPage({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: createPersonalPage, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		updatePersonalPage({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({ mutation: updatePersonalPage, variables: input })
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		personalPage({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: personalPage,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},

		// eslint-disable-next-line no-empty-pattern
		reservation({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: reservation,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		systems_reservation({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: systems_reservation,
						variables: input,
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		system({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: system,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		messages_title({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: messages_title,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		event_title({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.query({
						query: event_title,
						variables: input,
						context: {
							headers: {
								Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
							},
						},
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
		// eslint-disable-next-line no-empty-pattern
		updatePost({}, input) {
			return new Promise((resolve, reject) => {
				apollo.clients['defaultClient']
					.mutate({
						mutation: updatePost,
						variables: input,
						// context: {
						// 	headers: {
						// 		Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
						// 	},
						// },
					})
					.then(({ data }) => {
						resolve(data)
					})
					.catch(err => {
						reject(err)
					})
			})
		},
	},
	modules: {},
})
