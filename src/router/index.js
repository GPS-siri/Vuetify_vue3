import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 에러 화면
// import notFound from '../views/errorpage/NotFound.vue'
import notAuth from '../views/errorpage/NotAuthenticated.vue'

// 메인 화면
const adminLogin = () => import(/* webpackChunkName: "main" */ '../views/admin/login.vue')

const routes = [
	{ path: '*', name: 'notfound', component: () => import(/* webpackChunkName: "counselorPage" */ '../views/counselor/main.vue') },
	{ path: '/', name: 'mainPage', component: () => import(/* webpackChunkName: "counselorPage" */ '../views/counselor/main.vue') },
	{ path: '/block', name: 'block', component: notAuth },

	{
		path: '/counselor/main',
		name: 'counselorMain',
		component: () => import(/* webpackChunkName: "counselorPage" */ '../views/counselor/main.vue'),
	},

	// 상담사 화면
	{
		path: '/counselors',
		name: 'counselors',
		component: () => import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/board.vue'),
		children: [
			{
				path: '/counselor/login',
				name: 'counselorLogin',
				component: () => import(/* webpackChunkName: "counselorPage" */ '../views/counselor/login.vue'),
			},

			{
				path: '/counselor/register',
				name: 'counselorRegister',
				component: () => import(/* webpackChunkName: "counselorPage" */ '../views/counselor/register.vue'),
			},

			{
				path: '/counselor/dashboard',
				name: 'counselorDashboard',
				component: () => import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/dashboard.vue'),
			},
			// 상담사  - 대시보드
			{
				path: '/counselor/bizDashboard/:id',
				name: 'counselorBizDashboard',
				component: () => import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/bizDashboard.vue'),
			},
			// 상담사  - 알림톡관리
			{
				path: '/counselor/bizDashboard/alertTalkManagement/:id/alertTalk',
				name: 'alertTalk',
				component: () =>
					import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/bizDashboardItem/alertTalkManagement/alertTalk.vue'),
			},
			{
				path: '/counselor/bizDashboard/alertTalkManagement/:id/alertTalk/new',
				name: 'alertTalkNew',
				component: () =>
					import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/bizDashboardItem/alertTalkManagement/alertTalkNew.vue'),
			},
			// 상담사  - 상담관리
			{
				path: '/counselor/reservation/:id',
				name: 'counselorBizReservation',
				component: () =>
					import(
						/* webpackChunkName: "counselorBiz" */ '../views/counselor/bizDashboardItem/counselManagement/counselorBizReservation.vue'
					),
			},
			{
				path: '/counselor/contentsManagement/:id',
				name: 'contentsManagement',
				component: () =>
					import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/bizDashboardItem/contentsManagement/contentsManage.vue'),
			},
			{
				path: '/counselor/bizDashboardItem/clientManagement',
				name: 'counselorClients',
				component: () => import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/bizDashboardItem/clientManagement/index.vue'),
			},

			{
				path: '/counselor/commuteManagement/manage',
				component: () => import(/* webpackChunkName: "campaign" */ '../views/counselor/bizDashboardItem/commuteManagement/manage.vue'),
				name: '/counselor/commuteManagement/manage',
			},
			// 공지사항  - 공지사항
			{
				path: '/counselor/notice/:id',
				name: 'counselorNotice',
				component: () => import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/bizDashboardItem/notice.vue'),
			},
			// 공지사항  - 공지사항
			{
				path: '/counselor/profileManagement/:id',
				name: 'profileManagement',
				component: () =>
					import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/bizDashboardItem/profileManagement/profileManagement.vue'),
			},
			// 상담사  - 고객등록
			{
				path: '/counselor/customerManagement',
				name: 'customerManagement',
				component: () =>
					import(/* webpackChunkName: "counselorBiz" */ '../views/counselor/bizDashboardItem/customerManagement/customer.vue'),
			},
		],
	},
	// {
	// 	path: '/KIOSK',
	// 	name: 'KIOSK',
	// 	component: () => import(/* webpackChunkName: "KIOSK" */ '../views/kiosk/boardLayout/KIOSK.vue'),
	// 	meta: { requiresAuth: true },
	// 	children: [
	// 		{
	// 			path: '/',
	// 			name: 'dashBoard',
	// 			component: () => import(/* webpackChunkName: "dashBoard" */ '../views/kiosk/view/dashBoard.vue'),
	// 		},
	// 		{
	// 			path: 'campaignManagement',
	// 			name: 'campaignManagement',
	// 			component: () => import(/* webpackChunkName: "campaignManagement" */ '../views/kiosk/view/campaignManagement.vue'),
	// 			meta: { partner: true },
	// 		},

	// 		{
	// 			path: 'boardReport',
	// 			name: 'boardReport',
	// 			component: () => import(/* webpackChunkName: "boardReport" */ '../views/kiosk/view/boardReport.vue'),
	// 		},
	// 		{
	// 			path: 'customerAdminManagement',
	// 			name: 'customerAdminManagement',
	// 			component: () => import(/* webpackChunkName: "customerManagement" */ '../views/kiosk/view/customerManagement.vue'),
	// 		},
	// 		{
	// 			path: 'systemManagement',
	// 			name: 'systemManagement',
	// 			component: import(/* webpackChunkName: "systemManagement" */ '../views/kiosk/view/systemManagement.vue'),
	// 			meta: { admin: true },
	// 		},
	// 		{
	// 			path: 'messageManagement',
	// 			name: 'messageManagement',
	// 			component: () => import(/* webpackChunkName: "messageManagement" */ '../views/kiosk/view/messageManagement.vue'),
	// 		},
	// 		{
	// 			path: 'system',
	// 			name: 'system',
	// 			component: () => import(/* webpackChunkName: "system" */ '../views/kiosk/view/system.vue'),
	// 		},
	// 	],
	// },
	{ path: '/admin/login', name: 'adminLogin', component: adminLogin },
	{
		path: '/admin/signUp/:business',
		name: 'adminSignUp',
		component: () => import(/* webpackChunkName: "businessSiteManagement" */ '../views/admin/signUp.vue'),
	},
	{
		path: '/MANAGER',
		name: 'MANAGER',
		component: () => import(/* webpackChunkName: "manager" */ '../views/admin/KIOSK.vue'),
		meta: { requiresAuth: true },
		children: [
			{
				path: 'businessSiteManagement',
				name: 'businessSiteManagement',
				component: () =>
					import(
						/* webpackChunkName: "businessSiteManagement" */ '../views/admin/layout/board/BusinessManagement/businessSiteManagement.vue'
					),
				meta: { partner: true },
			},
			{
				path: '',
				component: () => import(/* webpackChunkName: "dashBoard" */ '../views/admin/layout/board/dashBoard.vue'),
				name: 'dashBoard',
			},

			{
				path: '/detail/:id',
				component: () => import(/* webpackChunkName: "manager" */ '../views/admin/layout/board/dashboardDetail.vue'),
				name: 'dashboardDetail',
			},
			// 사업지관리 - 사업지관리
			{
				path: '/business',
				component: () => import(/* webpackChunkName: "business" */ '../views/admin/layout/board/BusinessManagement/business/business.vue'),
				name: 'business',
			},
			// 사업지관리 - 상담예약시간 관리
			{
				path: '/business_timeManagement',
				component: () => import(/* webpackChunkName: "business" */ '../views/admin/layout/board/BusinessManagement/timeManagement.vue'),
				name: 'business_timeManagement',
			},
			// 사업지관리 - 공지사항 관리
			{
				path: '/business_noticeManagement',
				component: () =>
					import(/* webpackChunkName: "business" */ '../views/admin/layout/board/BusinessManagement/notice/noticeManagement.vue'),
				name: 'business_noticeManagement',
			},
			// 사업지관리 - 관리자 리스트
			{
				path: '/business_managerManagement',
				component: () => import(/* webpackChunkName: "business" */ '../views/admin/layout/board/BusinessManagement/managerManagement.vue'),
				name: 'business_managerManagement',
			},
			// 상담사 관리 - 상담사 리스트
			{
				path: '/counselor',
				component: () => import(/* webpackChunkName: "counselor" */ '../views/admin/layout/board/ConselorManagement/counselor.vue'),
				name: 'counselor',
			},
			{
				path: '/counselor/:id',
				component: () => import(/* webpackChunkName: "counselor" */ '../views/admin/layout/board/ConselorManagement/counselorDetail.vue'),
				name: 'counselordetail',
			},
			// 상담사 관리 - 상담 예약 리스트
			{
				path: '/reservationManagement',
				component: () =>
					import(/* webpackChunkName: "counselor" */ '../views/admin/layout/board/ConselorManagement/reservationManagement.vue'),
				name: 'reservationManagement',
			},
			// 포스트 관리 - 포스트 관리
			{
				path: 'postManagement',
				component: () => import(/* webpackChunkName: "counselor" */ '../views/admin/layout/board/PostManagement/postManagement.vue'),
				name: 'postManagement',
				meta: { partner: true },
			},
			{
				path: '/counselor/:id',
				component: () => import(/* webpackChunkName: "counselor" */ '../views/admin/layout/board/counselorDetail.vue'),
				name: 'counselorDetail',
			},
			{
				path: '/client',
				component: () => import(/* webpackChunkName: "client" */ '../views/admin/layout/board/client.vue'),
				name: 'client',
			},
			{
				path: '/client/:id',
				component: () => import(/* webpackChunkName: "client" */ '../views/admin/layout/board/clientDetail.vue'),
				name: 'clientDetail',
			},
			{
				path: '/campaign',
				component: () => import(/* webpackChunkName: "campaign" */ '../views/admin/layout/board/campaignManagement.vue'),
				name: 'campaign',
			},
			{
				path: '/goodsList',
				component: () => import(/* webpackChunkName: "campaign" */ '../views/admin/layout/board/goods/List.vue'),
				name: 'goodsList',
			},
			{
				path: '/goods/add',
				component: () => import(/* webpackChunkName: "campaign" */ '../views/admin/layout/board/goods/Add.vue'),
				name: 'goodsAdd',
			},
			{
				path: '/attendanceManagementDayList',
				component: () => import(/* webpackChunkName: "campaign" */ '../views/admin/layout/board/AttendanceManagement/dayList.vue'),
				name: '/attendanceManagementDayList',
			},
			{
				path: '/attendanceManagementList',
				component: () => import(/* webpackChunkName: "campaign" */ '../views/admin/layout/board/AttendanceManagement/list.vue'),
				name: '/attendanceManagementList',
			},
			{
				path: '/attendanceManagementVacation',
				component: () => import(/* webpackChunkName: "campaign" */ '../views/admin/layout/board/AttendanceManagement/vacation.vue'),
				name: '/attendanceManagementVacation',
			},
			{
				path: '/campainManage/manage',
				component: () => import(/* webpackChunkName: "campaign" */ '../views/admin/layout/board/campainManage/index.vue'),
				name: '/campainManage/manage',
			},
		],
	},
	// 출퇴근 qr 리더 화면
	{
		path: '/qr_gotowork/:id',
		component: () => import(/* webpackChunkName: "qrGotowork" */ '../views/admin/layout/board/qrGotowork/qrGotowork.vue'),
		name: 'qrGotowork',
	},
	// 상담사 화면
	{
		path: '/customer',
		name: 'customer',
		component: () => import(/* webpackChunkName: "counselorBiz" */ '../views/customer/board.vue'),
		children: [
			// 홍보페이지
			{
				path: '/customer/personalPage',
				name: 'personalPage',
				component: () => import(/* webpackChunkName: "counselorBiz" */ '../views/customer/personalPage/personalPage.vue'),
			},
		],
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
