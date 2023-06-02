<template>
	<div style="width:100%; margin:0 37px">
		<v-layout wrap class="" style="border-radius:1vh; display:grid">
			<v-flex
				xs12
				class="dashbord-top"
				style="height:0px"
				v-if="$store.state.meData.role ? $store.state.meData.role.name === 'Authenticated' : false"
			>
				<v-layout flex-wrap justify-space-between align-center>
					<v-flex xs3 class="dashboard-title"> 프로젝트별 현황 </v-flex>
					<!-- <v-flex xs4>
						<v-layout justify-end>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_1'">
								<DatepickerDialog :picker="projectstartPicker" @input="realRangeTimeCount"> </DatepickerDialog>
							</v-flex>
							<span class="mx-1"> ~ </span>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'search_date_2'">
								<DatepickerDialog
									:picker="projectendPicker"
									@input="realRangeTimeCount"
									:allowed_dates="allowed_datesEnd1"
								></DatepickerDialog>
							</v-flex>
							<v-flex class="search_select ml-4" style="width:120px !important; max-width:120px !important;">
								<selectBox :sel="searchsel" @change="changeSel" :class="'searchSel'"></selectBox>
							</v-flex>
						</v-layout>
					</v-flex> -->
				</v-layout>
			</v-flex>
			<v-layout
				justify-center
				class="mt-12"
				style="border-top: 1px solid #323153;"
				v-if="$store.state.meData.role ? $store.state.meData.role.name === 'Authenticated' : false"
			>
				<v-flex xs12>
					<v-simple-table class="dashboard-project">
						<template v-slot:default>
							<thead>
								<tr>
									<th class="text-center">
										프로젝트
									</th>
									<th class="text-center">
										설문
									</th>
									<th class="text-center">
										예약
									</th>
									<th class="text-center">
										방문
									</th>
									<th class="text-center">
										상담
									</th>
									<th class="text-center">
										이벤트
									</th>
									<th class="text-center">
										알림톡
									</th>
								</tr>
							</thead>
							<tbody v-if="desserts.length > 1">
								<tr v-for="(item, index) in desserts" :key="item.name + index">
									<td class="project-title">
										<span style="width:auto; overflow:auto;">{{ item.name }}</span>
									</td>
									<td>{{ item.survey }}</td>
									<td>{{ item.reserve }}</td>
									<td>{{ item.visit }}</td>
									<td>{{ item.consulting }}</td>
									<td>{{ item.event }}</td>
									<td>{{ item.talk }}</td>
								</tr>
							</tbody>
							<tbody v-else class="none_data"></tbody>
						</template>
					</v-simple-table>
				</v-flex>
			</v-layout>

			<v-flex xs12 class="mt-4">
				<v-layout flex-wrap justify-space-between align-center class="mt-4">
					<v-flex class="dashboard-title"> 기간별 등록고객 현황 </v-flex>
					<v-flex>
						<v-layout justify-end>
							<v-flex mr-2 class="search_select" style="width:250px !important; max-width:250px !important;">
								<selectBox :sel="customer.searchsel" @change="realRangeTimeCount2" class="searchSel"></selectBox>
							</v-flex>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_1'" style="margin-left:20px;">
								<DatepickerDialog :picker="customer.startPicker" @input="realRangeTimeCount2"> </DatepickerDialog>
							</v-flex>
							<span class="mx-1"> ~ </span>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'search_date_2'">
								<DatepickerDialog
									:picker="customer.endPicker"
									@input="realRangeTimeCount2"
									:allowed_dates="allowed_datesEnd2"
								></DatepickerDialog>
							</v-flex>
							<v-flex class="search_select ml-4" style="width:120px !important; max-width:120px !important;">
								<selectBox :sel="searchsel2" @change="changeSel2" class="searchSel"></selectBox>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</v-flex>
			<v-layout flex-wrap class="dashboard_header_search mt-8" align-center>
				<v-flex xs12>
					<v-flex class="ml-4" xs12>
						<v-layout align-center>
							<div class="dashbord-customer-title">{{ customer.searchsel.value }}</div>
							<div class="dashbord-customer-date">{{ customer.startPicker.date }} ~ {{ customer.endPicker.date }}</div>
						</v-layout>
					</v-flex>
					<v-flex class="ml-4 mt-4" xs12>
						<v-layout align-center>
							<v-flex v-for="(data, index) in customer.status" :key="index + data.title">
								<v-layout>
									<div class="dashbord-customer-text mr-1">• {{ data.title }} :</div>
									<div class="dashbord-customer-num" v-if="data.count">{{ data.count | comma }}</div>
									<div class="dashbord-customer-num" v-else>0</div>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-flex>
			</v-layout>
			<v-layout my-4 style="overflow:auto;">
				<v-layout class="dashboard-customer-box" align-center v-for="(data, index) in customer.status_length" :key="index + data.date">
					<v-flex px-4 pb-3>
						<v-flex class="dashbord-customer-text" style="height: 30px">• {{ data.date }}</v-flex>
						<v-layout
							class="dashboard-customer-box2"
							v-if="reservedaysData[reservedaysData.map(x => x.title).indexOf(customer.searchsel.value)].type === 'c'"
						>
							<v-flex px-2>
								<v-layout
									class="dashboard-customer-box3"
									justify-space-between
									v-for="(value, i) in data.value.filter(x => !['이벤트', '알림톡', 'LMS', 'SMS'].includes(x.title))"
									:key="i"
								>
									<v-flex class="dashbord-customer-text2" py-1 xs5>
										{{ value.title }}
									</v-flex>
									<v-flex class="dashbord-customer-text3" py-1 pr-2 xs4 style="text-align: end;">
										{{ value.count }}
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
						<v-layout class="dashboard-customer-box4" mt-3 v-else>
							<v-flex px-2>
								<v-layout
									class="dashboard-customer-box3"
									justify-space-between
									v-for="(value, i) in data.value.filter(x => !['이벤트', '알림톡', 'LMS', 'SMS'].includes(x.title))"
									:key="i"
								>
									<v-flex class="dashbord-customer-text2" py-1 xs5>
										{{ value.title }}
									</v-flex>
									<v-flex class="dashbord-customer-text3" py-1 pr-2 xs4 style="text-align: end;">
										{{ value.count }}
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
						<v-layout
							class="dashboard-customer-box2"
							mt-3
							v-for="(value, i) in data.value.filter(x => ['이벤트'].includes(x.title))"
							:key="i"
						>
							<v-flex px-2>
								<v-layout justify-space-between>
									<v-flex class="dashbord-customer-text2" py-1 xs5>
										{{ value.title }}
									</v-flex>
									<v-flex class="dashbord-customer-text3" py-1 xs4 pr-2 style="text-align: end;">
										{{ value.count }}
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
						<v-layout class="dashboard-customer-box4" mt-3>
							<v-flex px-2>
								<v-layout
									class="dashboard-customer-box3"
									justify-space-between
									v-for="(value, i) in data.value.filter(x => ['알림톡', 'LMS', 'SMS'].includes(x.title))"
									:key="i"
								>
									<v-flex class="dashbord-customer-text2" py-1 xs5>
										{{ value.title }}
									</v-flex>
									<v-flex class="dashbord-customer-text3" py-1 pr-2 xs4 style="text-align: end;">
										{{ value.count }}
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</v-layout>
		</v-layout>
	</div>
</template>

<script>
import { DatepickerDialog, selectBox } from '@/components'
export default {
	components: {
		selectBox,
		DatepickerDialog,
	},
	async created() {
		// this.bizDatas()
		// this.dashboard_dashboardList_call()
		// this.$store.dispatch('me').then(() => {
		// 	this.dashboard_reservedays_call()
		// })
	},
	filters: {
		comma(val) {
			return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		},
	},
	methods: {
		// updateReserveusers(id, bizId) {
		// 	const data = {
		// 		id: id,
		// 		business: bizId,
		// 		state: 'reserve',
		// 		reserveType: 'direct',
		// 	}
		// 	this.$store.dispatch('updateReserveuser', data)
		// },
		// bizDatas() {
		// 	this.$store.dispatch('businesses').then(resBiz => {
		// 		console.log(resBiz.data.businesses)
		// 		this.$store.dispatch('findReserveusers').then(res => {
		// 			const setDatas = res.data.reserveusers.filter(x => x.reserveType === null)
		// 			console.log(setDatas)
		// 			let set = 0
		// 			for (let index = 0; index < setDatas.length; index++) {
		// 				if (resBiz.data.businesses.map(x => x.title).indexOf(setDatas[index].title) > -1) {
		// 					set += 1
		// 					this.updateReserveusers(
		// 						setDatas[index].id,
		// 						resBiz.data.businesses[resBiz.data.businesses.map(x => x.title).indexOf(setDatas[index].title)].id,
		// 					)
		// 				}
		// 			}
		// 			console.log(set)
		// 		})
		// 	})
		// },

		//밸류로 키값가져오기
		getKeyByValue(object, value) {
			return Object.keys(object).find(key => object[key] === value)
		},
		realRangeTimeCount() {
			this.first = false
			this.dashboard_dashboardList_call()
		},
		realRangeTimeCount2() {
			this.dashboard_realTimeCount_call()
		},

		dashboard_reservedays_call() {
			this.$store.dispatch('dashboard_reservedays', {}).then(res => {
				this.reservedaysData = res.data.reservedays
				if (this.$store.state.meData.role?.name === 'Authenticated') {
					this.customer.searchsel.value = res.data.reservedays.map(x => x.title)[0]
					this.customer.searchsel.items = res.data.reservedays.map(x => x.title)
				} else {
					let list = []
					for (let index = 0; index < this.$store.state.meData.businesses.length; index++) {
						for (let index2 = 0; index2 < this.$store.state.meData.businesses[index].reservedays.map(x => x.title).length; index2++) {
							list.push(this.$store.state.meData.businesses[index].reservedays.map(x => x.title)[index2])
						}
					}
					this.customer.searchsel.value = list[0]
					this.customer.searchsel.items = list
				}
				this.dashboard_realTimeCount_call()
			})
		},
		dashboard_realTimeCount_call() {
			let data = {
				code: this.reservedaysData[this.reservedaysData.map(x => x.title).indexOf(this.customer.searchsel.value)].code,
				sdate: this.$moment(this.customer.startPicker.date)
					.subtract(0, 'days')
					.format('YYYY-MM-DD'),
				edate: this.customer.endPicker.date,
				type: this.reservedaysData[this.reservedaysData.map(x => x.title).indexOf(this.customer.searchsel.value)].type,
			}
			this.$store.dispatch('dashboard_realTimeCount', data).then(res => {
				let status = []
				for (let index = 0; index < res.data.realTimeCount.count.items.length; index++) {
					for (let index2 = 0; index2 < res.data.realTimeCount.count.items[index].value.length; index2++) {
						if (index === 0)
							status.push({
								title: res.data.realTimeCount.count.items[index].value[index2].title,
								count: res.data.realTimeCount.count.items[index].value[index2].count,
							})
						else {
							status[status.map(x => x.title).indexOf(res.data.realTimeCount.count.items[index].value[index2].title)].count +=
								res.data.realTimeCount.count.items[index].value[index2].count
						}
					}
				}
				this.customer.status = status
				this.customer.status_length = res.data.realTimeCount.count.items.reverse()
			})
		},
		dashboard_dashboardList_call() {
			// let startDate
			// if (this.first) {
			// 	startDate = this.$moment()
			// 		.subtract(1, 'month')
			// 		.format('YYYY-MM-DD')
			// } else {
			// 	startDate = this.projectstartPicker.date
			// }
			// let data = {
			// 	sdate: startDate,
			// 	edate: this.projectendPicker.date,
			// }
			this.$store.dispatch('dashboard_dashboardList', {}).then(res => {
				let li = []
				for (let i = 1; i < res.data.dashboardList.count.headers.length; i++) {
					li.unshift({ name: res.data.dashboardList.count.headers[i].text, value: res.data.dashboardList.count.headers[i].value })
				}
				for (let i = 0; i < li.length; i++) {
					li[i]['survey'] = res.data.dashboardList.count.items[0][li[i].value]
					li[i]['reserve'] = res.data.dashboardList.count.items[1][li[i].value]
					li[i]['visit'] = res.data.dashboardList.count.items[2][li[i].value]
					li[i]['consulting'] = res.data.dashboardList.count.items[3][li[i].value]
					li[i]['event'] = res.data.dashboardList.count.items[4][li[i].value]
					li[i]['talk'] = res.data.dashboardList.count.items[5][li[i].value]
				}
				if (li.length === 0) {
					li.unshift({
						name: 0,
						survey: 0,
						reserve: 0,
						visit: 0,
						consulting: 0,
						event: 0,
						talk: 0,
					})
				}
				this.desserts = li
				this.$store.dispatch('dashboard_dashboardList_visit', {}).then(res => {
					let li = JSON.parse(JSON.stringify(this.desserts))
					for (let i = 0; i < li.length; i++) {
						li[i]['survey'] = res.data.dashboardList_visit.count.items[0][li[i].value]
					}
					this.desserts = li
					this.$store.dispatch('dashboard_dashboardList_day', {}).then(res => {
						let li = JSON.parse(JSON.stringify(this.desserts))

						for (let i = 0; i < li.length; i++) {
							li[i]['reserve'] = res.data.dashboardList_day.count.items[1][li[i].value]
						}
						this.desserts = li
					})
				})
			})
		},
		termCustomer(val) {
			let start = this.$moment(this.termStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.termStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
		changeSel() {
			let date
			if (this.$moment().format('ddd') === 'Sun') {
				date = 6
			} else if (this.$moment().format('ddd') === 'Mon') {
				date = 0
			} else if (this.$moment().format('ddd') === 'Tue') {
				date = 1
			} else if (this.$moment().format('ddd') === 'Wed') {
				date = 2
			} else if (this.$moment().format('ddd') === 'Thu') {
				date = 3
			} else if (this.$moment().format('ddd') === 'Fri') {
				date = 4
			} else if (this.$moment().format('ddd') === 'Sat') {
				date = 5
			}
			if (this.searchsel.value === '오늘') {
				this.projectstartPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '어제') {
				this.projectstartPicker.date = this.$moment()
					.subtract(1, 'days')
					.format('YYYY-MM-DD')
				this.projectendPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '이번 주') {
				this.projectstartPicker.date = this.$moment()
					.subtract(date, 'day')
					.format('YYYY-MM-DD')
				this.projectendPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '지난 주') {
				this.projectstartPicker.date = this.$moment()
					.subtract(date + 7, 'day')
					.format('YYYY-MM-DD')
				this.projectendPicker.date = this.$moment()
					.subtract(date + 1, 'day')
					.format('YYYY-MM-DD')
			} else if (this.searchsel.value === '최근 7일') {
				this.projectstartPicker.date = this.$moment()
					.subtract(7, 'days')
					.format('YYYY-MM-DD')
				this.projectendPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '최근 14일') {
				this.projectstartPicker.date = this.$moment()
					.subtract(14, 'days')
					.format('YYYY-MM-DD')
				this.projectendPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '최근 30일') {
				this.projectstartPicker.date = this.$moment()
					.subtract(30, 'days')
					.format('YYYY-MM-DD')
				this.projectendPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '이번 달') {
				this.projectstartPicker.date = this.$moment()
					.subtract(Number(this.$moment().format('DD')) - 1, 'days')
					.format('YYYY-MM-DD')
				this.projectendPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '지난 달') {
				let date2
				date2 = this.$moment().subtract(1, 'month')
				this.projectstartPicker.date = this.$moment(date2)
					.startOf('month')
					.format('YYYY-MM-DD')

				this.projectendPicker.date = this.$moment(date2)
					.endOf('month')
					.format('YYYY-MM-DD')
			} else if (this.searchsel.value === '전체') {
				this.projectstartPicker.date = '2020-01-01'
				this.projectendPicker.date = '2099-12-31'
			}
			this.dashboard_dashboardList_call()
		},
		changeSel2() {
			let date
			if (this.$moment().format('ddd') === 'Sun') {
				date = 6
			} else if (this.$moment().format('ddd') === 'Mon') {
				date = 0
			} else if (this.$moment().format('ddd') === 'Tue') {
				date = 1
			} else if (this.$moment().format('ddd') === 'Wed') {
				date = 2
			} else if (this.$moment().format('ddd') === 'Thu') {
				date = 3
			} else if (this.$moment().format('ddd') === 'Fri') {
				date = 4
			} else if (this.$moment().format('ddd') === 'Sat') {
				date = 5
			}
			if (this.searchsel2.value === '오늘') {
				this.customer.startPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel2.value === '어제') {
				this.customer.startPicker.date = this.$moment()
					.subtract(1, 'days')
					.format('YYYY-MM-DD')
				this.customer.endPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel2.value === '이번 주') {
				this.customer.startPicker.date = this.$moment()
					.subtract(date, 'day')
					.format('YYYY-MM-DD')
				this.customer.endPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel2.value === '지난 주') {
				this.customer.startPicker.date = this.$moment()
					.subtract(date + 7, 'day')
					.format('YYYY-MM-DD')
				this.customer.endPicker.date = this.$moment()
					.subtract(date + 1, 'day')
					.format('YYYY-MM-DD')
			} else if (this.searchsel2.value === '최근 7일') {
				this.customer.startPicker.date = this.$moment()
					.subtract(7, 'days')
					.format('YYYY-MM-DD')
				this.customer.endPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel2.value === '최근 14일') {
				this.customer.startPicker.date = this.$moment()
					.subtract(14, 'days')
					.format('YYYY-MM-DD')
				this.customer.endPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel2.value === '최근 30일') {
				this.customer.startPicker.date = this.$moment()
					.subtract(30, 'days')
					.format('YYYY-MM-DD')
				this.customer.endPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel2.value === '이번 달') {
				this.customer.startPicker.date = this.$moment()
					.subtract(Number(this.$moment().format('DD')) - 1, 'days')
					.format('YYYY-MM-DD')
				this.customer.endPicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel2.value === '지난 달') {
				let date2
				date2 = this.$moment().subtract(1, 'month')
				this.customer.startPicker.date = this.$moment(date2)
					.startOf('month')
					.format('YYYY-MM-DD')

				this.customer.endPicker.date = this.$moment(date2)
					.endOf('month')
					.format('YYYY-MM-DD')
			}
			this.dashboard_realTimeCount_call()
		},
		async setdate() {
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			this.projectstartPicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.projectendPicker.date = this.$moment(after).format('YYYY-MM-DD')
		},
		allowed_datesEnd1(val) {
			let start = this.$moment(this.projectstartPicker.date).format('YYMMDD')

			let startDate = new Date(this.projectstartPicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
		async setdate2() {
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			this.customer.startPicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.customer.endPicker.date = this.$moment(after).format('YYYY-MM-DD')
		},
		allowed_datesEnd2(val) {
			let start = this.$moment(this.customer.startPicker.date).format('YYMMDD')

			let startDate = new Date(this.customer.startPicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
	},
	data() {
		return {
			reservedaysData: [],
			// 프로젝트 날짜 셀렉트
			searchsel: {
				value: '최근 30일',
				errorMessage: '',
				hideDetail: true,
				items: ['오늘', '어제', '이번 주', '지난 주', '최근 7일', '최근 14일', '최근 30일', '이번 달', '지난 달', '전체'],
				outlined: true,
			},
			// 기간별
			searchsel2: {
				value: '최근 7일',
				errorMessage: '',
				hideDetail: true,
				items: ['오늘', '어제', '이번 주', '지난 주', '최근 7일', '최근 14일', '최근 30일', '이번 달', '지난 달'],
				outlined: true,
			},
			// 프로젝트 날짜 기간 선택
			projectstartPicker: {
				date: this.$moment()
					.subtract(30, 'days')
					.format('YYYY-MM-DD'),
				class: 'whiteBack defalut-date-picker-setting',
			},
			projectendPicker: {
				date: this.$moment().format('YYYY-MM-DD'),
				class: 'whiteBack defalut-date-picker-setting',
			},
			// 기간별 등록고객

			customer: {
				position: {},
				startPicker: {
					date: this.$moment()
						.subtract(6, 'days')
						.format('YYYY-MM-DD'),
					class: 'whiteBack defalut-date-picker-setting',
				},
				endPicker: { date: this.$moment().format('YYYY-MM-DD'), class: 'whiteBack defalut-date-picker-setting' },
				searchsel: {
					value: '',
					code: '',
					errorMessage: '',
					filter: true,
					hideDetail: true,
					items: [],
					outlined: true,
				},
				status: [
					{
						title: '거점설문',
						value: 0,
					},
					{
						title: '부동산 설문',
						value: 0,
					},
					{
						title: '방문예약',
						value: 0,
					},
					{
						title: '방문',
						value: 0,
					},
					{
						title: '이벤트 참여',
						value: 0,
					},
					{
						title: '상담신청',
						value: 0,
					},
					{
						title: '상담완료',
						value: 0,
					},
					{
						title: '미처리',
						value: 0,
					},
					{
						title: '알림톡',
						value: 0,
					},
					{
						title: 'LMS',
						value: 0,
					},
					{
						title: 'SMS',
						value: 0,
					},
				],

				status_length: [],
			},

			desserts: [],
			first: true,
		}
	},
}
</script>

<style lang="scss">
.apexcharts-toolbar {
	z-index: 0 !important;
}
.left_dashboard {
	background-color: white;
	border-radius: 1vh;
}
</style>
<style lang="scss">
.fill-height {
	.v-toolbar__content,
	.v-toolbar__extension {
		padding: 0px;
	}
}
.dashboard-title {
	border-left: 5px solid #707070;
	padding-left: 10px;
	font-weight: bold;
}
.dashbord-top {
	border-top: 1px solid #f2f2f2;
	padding-top: 10px;
}
.dashboard-project {
	border-radius: 0px;
	width: 100%;
	div {
		table {
			display: flex;
			width: 100%;
			padding-bottom: 12px;
			thead {
				tr {
					width: 190px;
					display: flex;
					flex-flow: column;
					background-color: #f5f5f5;
					th {
						height: 36px !important;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #333333 !important;
						font-weight: bold;
					}
					th:first-child {
						height: 36px;
						text-align: center;
						word-break: keep-all;
					}
				}
			}
		}
	}
}
.dashboard-project {
	div {
		table {
			display: flex;
			tbody {
				display: flex;
				tr:hover {
					background: #ffd999 !important;
				}
				tr {
					width: 205px;
					display: flex;
					flex-flow: column;
					border-right: 1px solid #d1d1d1;
					td {
						height: 36px !important;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					td:first-child {
						height: 36px;
						text-align: center;
						word-break: keep-all;
					}
				}
			}
		}
	}
}
.project-title {
	overflow-x: auto;
	overflow-y: hidden;
	white-space: nowrap;
	color: #333333 !important;
	font-weight: bold;
	padding: 0 !important;
}
// 마지막 테이블 데이터 밑줄
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr > td:not(.v-data-table__mobile-row),
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody > tr > th:not(.v-data-table__mobile-row) {
	border-bottom: thin solid rgba(0, 0, 0, 0.12);
}
.dashboard_picker {
	max-width: 170px !important;
	button {
		color: #633efd !important;
	}
}
.dashbord-customer-title {
	font-size: 17px;
	font-weight: bold;
	width: auto;
	margin-right: 18px;
}
.dashbord-customer-date {
	font-size: 14px;
	font-weight: bold;
	width: auto;
}
.dashbord-customer-text {
	font-size: 14px;
	font-weight: bold;
	width: auto;
}
.dashbord-customer-text2 {
	font-size: 12px;
	font-weight: bold;
	width: auto;
	color: #204037;
}
.dashbord-customer-text3 {
	font-size: 12px;
	font-weight: bold;
	width: auto;
	color: #8b8b8b;
}
.dashbord-customer-num {
	font-size: 14px;
	font-weight: bold;
	width: auto;
	color: #e89000;
	margin-right: 15px;
}
.dashboard_header_search {
	height: 87px;
	background: #fffaf2;
	border-top: 1px solid #ffd999;
	border-bottom: 1px solid #ffd999;
}
.dashboard-customer-box {
	width: 201px;
	min-width: 201px;
	max-width: 201px;
	height: fit-content;
	padding: 8px 0;
	margin-right: 23px !important;
	border: 1px solid #c2bcc2;
}
.dashboard-customer-box2 {
	width: 170px;
	max-width: 170px;
	height: auto;
	margin-right: 33px !important;
	border: 1px solid #d1d1d1;
	background-color: #f2f2f2;
	border-radius: 5px;
}
.dashboard-customer-box3 {
	border-bottom: 1px solid #d1d1d1;
}
.dashboard-customer-box3:nth-last-child(1) {
	border-bottom: 0;
}
.dashboard-customer-box4 {
	width: 170px;
	max-width: 170px;
	height: auto;
	margin-right: 33px !important;
	border: 1px solid #d1d1d1;
	background-color: #fffaf2;
	border-radius: 5px;
}
.search_select_type {
	min-height: 26px !important;
	height: 26px !important;
	// width: 400px;
	// max-width: 400px;
	div {
		div {
			div {
				div {
					.v-input__append-inner {
						margin-top: 1px !important;
					}
				}
			}
		}
	}
}
.none_data {
	border-bottom: 1px solid #d1d1d1;
	border-right: 1px solid #d1d1d1;
	width: 100%;
}
</style>
