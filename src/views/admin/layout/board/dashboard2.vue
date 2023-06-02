<template>
	<div>
		<div class="menu_title">대시보드</div>
		<v-layout>
			<div style="width:300px;">
				<v-list color="#F3F3F3" style="height:100vh; padding:0">
					<div v-for="(leftTable, i) in leftItems" :key="i" :style="i === 0 ? 'padding-top:50px' : ''">
						<v-list-item class="table_left" :style="leftTable.click ? 'background-color:white;' : ''" @click="tableClick(leftTable)">
							<v-list-item-title :style="leftTable.click ? 'color:#3a258f !important;' : ''">{{ leftTable.title }}</v-list-item-title>
							<v-icon v-if="leftTable.click">mdi-refresh</v-icon>
							<v-icon v-if="leftTable.click == false">mdi-chevron-right</v-icon>
						</v-list-item>
					</div>
				</v-list>
			</div>
			<v-data-table
				class="dashboard_datatable"
				:headers="dashboard_table.headers"
				:items="dashboard_table.items"
				disable-sort
				:hide-default-footer="true"
			>
				<template v-slot:[`item.today`]="{ item }">
					<div>
						<span style="text-decoration: underline;">
							{{ item.today }}
						</span>
						{{
							leftItems.filter(x => x.click)[0].title === '상품 현황' ||
							leftItems.filter(x => x.click)[0].title === '상담사 영업페이스 현황'
								? '건'
								: '명'
						}}
					</div>
				</template>
				<template v-slot:[`item.yesterday`]="{ item }">
					<div style="color:#949494;">{{ item.yesterday }} 명</div>
				</template>
				<template v-slot:[`item.between`]="{ item }">
					<v-layout>
						<v-icon v-if="item.today - item.yesterday > 0" small color="red">mdi-arrow-up</v-icon>
						<v-icon v-else-if="item.today - item.yesterday < 0" small color="blue">mdi-arrow-down</v-icon>
						<div>{{ Math.abs(item.today - item.yesterday) === 0 ? '-' : Math.abs(item.today - item.yesterday) }}</div>
					</v-layout>
				</template>
			</v-data-table>
		</v-layout>
	</div>
</template>
<script>
// import axios from 'axios'
export default {
	data() {
		return {
			leftItems: [
				{
					title: '상담사 현황',
					click: false,
				},
				{
					title: '고객계약 현황',
					click: false,
				},
				{
					title: '상담 현황',
					click: false,
				},
				{
					title: '상품 현황',
					click: false,
				},
				{
					title: '상담사 영업페이스 현황',
					click: false,
				},
			],
			dashboard_table: {
				headers: [
					{
						text: '',
						value: 'menu',
					},
					{
						text: '오늘',
						value: 'today',
					},
					{
						text: '전일대비',
						value: 'between',
					},
					{
						text: '전일',
						value: 'yesterday',
					},
				],
				items: [
					{ menu: '상담사 총 인원', today: '', between: '-', yesterday: '' },
					{ menu: '출근', today: '', between: '-', yesterday: '' },
					{ menu: '출근 미확인', today: '', between: '-', yesterday: '' },
					{ menu: '연차신청', today: '', between: '-', yesterday: '' },
					{ menu: '오늘 연차 및 반차 인원', today: '', between: '-', yesterday: '' },
				],
			},
		}
	},
	created() {
		this.tableClick(this.leftItems[0])
	},
	methods: {
		counselorDashboard() {
			const meDataCheck = setInterval(() => {
				// 상담사 현황
				let totalCount = 0
				let startWorkCount = 0
				let count = 0
				let annualLeaveApplicationCount = 0
				let vacationCount = 0
				let beforetotalCount = 0
				let beforestartWorkCount = 0
				let beforecount = 0
				let beforeannualLeaveApplicationCount = 0
				let beforevacationCount = 0

				let ok = 0
				ok += 1
				if (this.$store.state.meData.business) {
					const input = {
						id: this.$store.state.meData.business.id,
						date: this.$moment().format('YYYY-MM-DD'),
					}
					this.$store.dispatch('businessDashboard', input).then(res => {
						totalCount = res.business.users.length
						for (let index = 0; index < res.business.users.length; index++) {
							const element = res.business.users[index]
							if (element.gotoworks.length > 0) {
								if (element.gotoworks[0].vacation === null) {
									startWorkCount += 1
								} else {
									vacationCount += 1
								}
							}
							if (element.vacations.length > 0) {
								annualLeaveApplicationCount += 1
							}
						}
						count = totalCount - startWorkCount - vacationCount
						this.dashboard_table.items[0].today = totalCount
						this.dashboard_table.items[1].today = startWorkCount
						this.dashboard_table.items[2].today = count
						this.dashboard_table.items[3].today = annualLeaveApplicationCount
						this.dashboard_table.items[4].today = vacationCount
					})

					const inputBefore = {
						id: this.$store.state.meData.business.id,
						date: this.$moment()
							.subtract(1, 'd')
							.format('YYYY-MM-DD'),
					}
					this.$store.dispatch('businessDashboard', inputBefore).then(res => {
						beforetotalCount = res.business.users.length
						if (res.business.users.length !== 0) {
							for (let index = 0; index < res.business.users.length; index++) {
								const element = res.business.users[index]
								if (element.gotoworks.length > 0) {
									if (element.gotoworks[0].vacation === null) {
										beforestartWorkCount += 1
									} else {
										beforevacationCount += 1
									}
								}
								if (element.vacations.length > 0) {
									beforeannualLeaveApplicationCount += 1
								}
								if (index === res.business.users.length - 1) {
									beforecount = beforetotalCount - beforestartWorkCount - beforevacationCount
									this.dashboard_table.items[0].yesterday = beforetotalCount
									this.dashboard_table.items[1].yesterday = beforestartWorkCount
									this.dashboard_table.items[2].yesterday = beforecount
									this.dashboard_table.items[3].yesterday = beforeannualLeaveApplicationCount
									this.dashboard_table.items[4].yesterday = beforevacationCount

									this.dashboard_table.items[0].between = totalCount - beforetotalCount
									this.dashboard_table.items[1].between = startWorkCount - beforestartWorkCount
									this.dashboard_table.items[2].between = count - beforecount
									this.dashboard_table.items[3].between = annualLeaveApplicationCount - beforeannualLeaveApplicationCount
									this.dashboard_table.items[4].between = vacationCount - beforevacationCount
									this.$store.state.loading = false
								}
							}
						} else {
							beforecount = 0
							this.dashboard_table.items[0].yesterday = 0
							this.dashboard_table.items[1].yesterday = 0
							this.dashboard_table.items[2].yesterday = 0
							this.dashboard_table.items[3].yesterday = 0
							this.dashboard_table.items[4].yesterday = 0

							this.dashboard_table.items[0].between = 0
							this.dashboard_table.items[1].between = 0
							this.dashboard_table.items[2].between = 0
							this.dashboard_table.items[3].between = 0
							this.dashboard_table.items[4].between = 0
							this.$store.state.loading = false
						}
					})
					clearInterval(meDataCheck)
				} else if (ok === 5) {
					clearInterval(meDataCheck)
					this.$store.state.loading = false
				}
			}, 1000)
		},
		clientDashboard() {
			const meDataCheck = setInterval(() => {
				// 상담사 현황
				let totalCount = 0
				let newCount = 0
				let completeCount = 0

				let beforeTotalCount = 0
				let beforeNewCount = 0
				let beforeCompleteCount = 0

				let ok = 0
				ok += 1
				if (this.$store.state.meData.business) {
					const input = {
						id: this.$store.state.meData.business.id,
						date: this.$moment().format('YYYY-MM-DD'),
					}
					this.$store.dispatch('businessDashboard', input).then(res => {
						totalCount = res.business.clients.length

						for (let index = 0; index < res.business.clients.length; index++) {
							const element = res.business.clients[index]
							if (element.contractStatus === 'contractComplete') {
								completeCount += 1
							}
							if (this.$moment(element.created_at).format('YYYY-MM-DD') === this.$moment().format('YYYY-MM-DD')) {
								newCount += 1
							}
						}

						this.dashboard_table.items[0].today = totalCount
						this.dashboard_table.items[1].today = newCount
						this.dashboard_table.items[2].today = completeCount
					})

					const inputBefore = {
						id: this.$store.state.meData.business.id,
						date: this.$moment()
							.subtract(1, 'd')
							.format('YYYY-MM-DD'),
					}
					this.$store.dispatch('businessDashboard', inputBefore).then(res => {
						beforeTotalCount = res.business.clients.length
						if (res.business.clients.length !== 0) {
							for (let index = 0; index < res.business.clients.length; index++) {
								const element = res.business.clients[index]
								if (element.contractStatus === 'contractComplete') {
									beforeCompleteCount += 1
								}
								if (this.$moment(element.created_at).format('YYYY-MM-DD') === this.$moment().format('YYYY-MM-DD')) {
									beforeNewCount += 1
								}
								if (index === res.business.clients.length - 1) {
									this.dashboard_table.items[0].yesterday = beforeTotalCount
									this.dashboard_table.items[1].yesterday = beforeNewCount
									this.dashboard_table.items[2].yesterday = beforeCompleteCount

									this.dashboard_table.items[0].between = totalCount - beforeTotalCount
									this.dashboard_table.items[1].between = newCount - beforeNewCount
									this.dashboard_table.items[2].between = completeCount - beforeCompleteCount
									this.$store.state.loading = false
								}
							}
						} else {
							this.dashboard_table.items[0].yesterday = 0
							this.dashboard_table.items[1].yesterday = 0
							this.dashboard_table.items[2].yesterday = 0

							this.dashboard_table.items[0].between = 0
							this.dashboard_table.items[1].between = 0
							this.dashboard_table.items[2].between = 0
							this.$store.state.loading = false
						}
					})

					clearInterval(meDataCheck)
				} else if (ok === 5) {
					clearInterval(meDataCheck)
					this.$store.state.loading = false
				}
			}, 1000)
		},

		reservationDashboard() {
			const meDataCheck = setInterval(() => {
				let ok = 0
				ok += 1
				if (this.$store.state.meData.business) {
					const input = {
						id: this.$store.state.meData.business.id,
						date: this.$moment().format('YYYY-MM-DD'),
					}
					this.$store.dispatch('businessDashboard', input).then(res => {
						let todayCount = 0
						let completeCount = 0
						let waitingCount = 0
						let incompleteCount = 0
						let cancelCount = 0
						if (res.business.reservations.length !== 0) {
							for (let index = 0; index < res.business.reservations.length; index++) {
								const element = res.business.reservations[index]
								if (element.date === this.$moment().format('YYYY-MM-DD')) {
									todayCount += 1
								}
								if (element.status === 'waiting') {
									waitingCount += 1
								}
								if (element.status === 'incomplete') {
									incompleteCount += 1
								}
								if (element.status === 'complete') {
									completeCount += 1
								}
								if (element.status === 'cancel') {
									cancelCount += 1
								}
								if (index === res.business.reservations.length - 1) {
									this.dashboard_table.items[0].today = todayCount
									this.dashboard_table.items[1].today = completeCount
									this.dashboard_table.items[2].today = waitingCount
									this.dashboard_table.items[3].today = incompleteCount
									this.dashboard_table.items[4].today = cancelCount
									this.$store.state.loading = false
								}
							}
						} else {
							this.dashboard_table.items[0].today = 0
							this.dashboard_table.items[1].today = 0
							this.dashboard_table.items[2].today = 0
							this.dashboard_table.items[3].today = 0
							this.dashboard_table.items[4].today = 0
							this.$store.state.loading = false
						}
					})

					clearInterval(meDataCheck)
				} else if (ok === 5) {
					clearInterval(meDataCheck)
					this.$store.state.loading = false
				}
			}, 1000)
		},
		productDashboard() {
			const meDataCheck = setInterval(() => {
				let ok = 0
				ok += 1
				if (this.$store.state.meData.business) {
					const input = {
						id: this.$store.state.meData.business.id,
						date: this.$moment().format('YYYY-MM-DD'),
					}
					this.$store.dispatch('businessDashboard', input).then(res => {
						let totalCount = 0
						let completeCount = 0
						let uncontractedCount = 0
						totalCount = res.business.products.length
						if (res.business.products.length !== 0) {
							for (let index = 0; index < res.business.products.length; index++) {
								const element = res.business.products[index]
								if (element.status === 'contractcompleted') {
									completeCount += 1
								}
								if (element.status === 'uncontracted') {
									uncontractedCount += 1
								}
								if (index === res.business.products.length - 1) {
									this.dashboard_table.items[0].today = totalCount
									this.dashboard_table.items[1].today = completeCount
									this.dashboard_table.items[2].today = uncontractedCount
									this.$store.state.loading = false
								}
							}
						} else {
							this.dashboard_table.items[0].today = 0
							this.dashboard_table.items[1].today = 0
							this.dashboard_table.items[2].today = 0
							this.$store.state.loading = false
						}
					})
					clearInterval(meDataCheck)
				} else if (ok === 5) {
					clearInterval(meDataCheck)
					this.$store.state.loading = false
				}
			}, 1000)
		},
		paceDashboard() {
			const meDataCheck = setInterval(() => {
				let ok = 0
				ok += 1
				if (this.$store.state.meData.business) {
					this.$store
						.dispatch('business', { id: this.$store.state.meData.business.id, type: 'goal' })
						.then(result => {
							let businessInfo = result.business
							let goal = businessInfo.systems.filter(el => el.type === 'goal')[0]
							const input = {
								id: this.$store.state.meData.business.id,
								date: this.$moment().format('YYYY-MM-DD'),
							}
							this.$store.dispatch('businessDashboard', input).then(res => {
								let data1 = 0
								let data2 = 0
								let data3 = 0
								let data4 = 0
								let data5 = 0
								let data6 = 0
								let data7 = 0
								if (res.business.users.length !== 0) {
									for (let index = 0; index < res.business.users.length; index++) {
										const element = res.business.users[index]
										if (goal.goalActive) {
											let count = element.clients.filter(x => x.contractStatus === 'contractComplete').length
											let percent = (count / goal.goalCount) * 100
											// 사용자의 목표 활성화 여부 확인
											if (element.goalActive) {
												// 퍼센트별 상태
												if (percent >= 0 && percent <= 5) {
													data2 += 1
												} else if (percent > 5 && percent <= 25) {
													data3 += 1
												} else if (percent > 25 && percent <= 50) {
													data4 += 1
												} else if (percent > 50 && percent <= 75) {
													data5 += 1
												} else if (percent > 75 && percent <= 100) {
													data6 += 1
												} else if (percent > 100) {
													data7 += 1
												}
											} else {
												data1 += 1
											}
										} else {
											data1 += 1
										}
										if (index === res.business.users.length - 1) {
											this.dashboard_table.items[0].today = data1
											this.dashboard_table.items[1].today = data2
											this.dashboard_table.items[2].today = data3
											this.dashboard_table.items[3].today = data4
											this.dashboard_table.items[4].today = data5
											this.dashboard_table.items[5].today = data6
											this.dashboard_table.items[6].today = data7
											this.$store.state.loading = false
										}
									}
								} else {
									this.dashboard_table.items[0].today = 0
									this.dashboard_table.items[1].today = 0
									this.dashboard_table.items[2].today = 0
									this.dashboard_table.items[3].today = 0
									this.dashboard_table.items[4].today = 0
									this.dashboard_table.items[5].today = 0
									this.dashboard_table.items[6].today = 0
									this.$store.state.loading = false
								}
							})
						})
						.catch(err => {
							console.log(err)
						})

					clearInterval(meDataCheck)
				} else if (ok === 5) {
					clearInterval(meDataCheck)
					this.$store.state.loading = false
				}
			}, 1000)
		},
		tableClick(li) {
			this.$store.state.loading = true
			this.leftItems.forEach(element => {
				element.click = false
			})
			li.click = true

			if (li.title === '상담사 현황') {
				this.dashboard_table.headers = [
					{
						text: '',
						value: 'menu',
					},
					{
						text: '오늘',
						value: 'today',
					},
					{
						text: '전일대비',
						value: 'between',
					},
					{
						text: '전일',
						value: 'yesterday',
					},
				]
				this.dashboard_table.items = [
					{ menu: '상담사 총 인원', today: '', between: '-', yesterday: '' },
					{ menu: '출근', today: '', between: '-', yesterday: '' },
					{ menu: '출근 미확인', today: '', between: '-', yesterday: '' },
					{ menu: '연차신청', today: '', between: '-', yesterday: '' },
					{ menu: '오늘 연차 및 반차 인원', today: '', between: '-', yesterday: '' },
				]
				this.counselorDashboard()
			}
			if (li.title === '고객계약 현황') {
				this.dashboard_table.headers = [
					{
						text: '',
						value: 'menu',
					},
					{
						text: '오늘',
						value: 'today',
					},
					{
						text: '전일대비',
						value: 'between',
					},
					{
						text: '전일',
						value: 'yesterday',
					},
				]
				this.dashboard_table.items = [
					{ menu: '총 등록고객', today: '', between: '-', yesterday: '' },
					{ menu: '신규 등록고객', today: '', between: '-', yesterday: '' },
					{ menu: '계약완료 고객', today: '', between: '-', yesterday: '' },
				]
				this.clientDashboard()
			}
			if (li.title === '상담 현황') {
				this.dashboard_table.headers = [
					{
						text: '',
						value: 'menu',
					},
					{
						text: '현재',
						value: 'today',
					},
				]
				this.dashboard_table.items = [
					{ menu: '오늘 상담예정', today: '' },
					{ menu: '상담완료', today: '' },
					{ menu: '상담대기', today: '' },
					{ menu: '상담미완료', today: '' },
					{ menu: '상담취소', today: '' },
				]
				this.reservationDashboard()
			}
			if (li.title === '상품 현황') {
				this.dashboard_table.headers = [
					{
						text: '',
						value: 'menu',
					},
					{
						text: '현재',
						value: 'today',
					},
				]
				this.dashboard_table.items = [
					{ menu: '총 등록상품', today: '' },
					{ menu: '계약완료 상품', today: '' },
					{ menu: '미계약 상품', today: '' },
				]
				this.productDashboard()
			}
			if (li.title === '상담사 영업페이스 현황') {
				this.dashboard_table.headers = [
					{
						text: '',
						value: 'menu',
					},
					{
						text: '현재',
						value: 'today',
					},
				]
				this.dashboard_table.items = [
					{ menu: 'Waiting', today: '' },
					{ menu: 'Warning', today: '' },
					{ menu: 'Slower', today: '' },
					{ menu: 'Walking', today: '' },
					{ menu: 'Running', today: '' },
					{ menu: 'Faster', today: '' },
					{ menu: 'the Fastest', today: '' },
				]
				this.paceDashboard()
			}
			// // 상담사 총 인원
			// axios.get(process.env.VUE_APP_BACKEND_URL + '/users/count?role=3').then(res => {
			// 	this.dashboard_table.items[0].today = res.data
			// })
			// // 출근
			// axios.get(process.env.VUE_APP_BACKEND_URL + '/gotoworks/count?status=startWork&date=2023-03-08').then(res => {
			// 	this.dashboard_table.items[1].today = res.data
			// })
			// axios
			// 	.all([
			// 		axios.get(process.env.VUE_APP_BACKEND_URL + '/users/count?role=3'),
			// 		axios.get(process.env.VUE_APP_BACKEND_URL + '/gotoworks/count?status=startWork&date=2023-03-08'),
			// 	])
			// 	.then(
			// 		axios.spread((res1, res2) => {
			// 			this.dashboard_table.items[2].today = res1.data - res2.data
			// 		}),
			// 	)
			// axios
			// 	.get('http://localhost:5000/vacations/count?created_at_gte=2023-03-08T00:00:00.000Z&created_at_lte=2023-03-08T23:59:00.000Z')
			// 	.then(res => {
			// 		this.dashboard_table.items[3].today = res.data
			// 	})
			// axios.get('http://localhost:5000/vacations/count?vacationDate=2023-03-08').then(res => {
			// 	this.dashboard_table.items[4].today = res.data
			// })
		},
	},
}
</script>
<style lang="scss">
.table_left {
	height: 50px;
	padding-left: 35px;
	font-size: 14px;
}
.table_left:hover {
	color: #3a258f !important;
	transition: 0.5s;
}
.dashboard_datatable {
	min-width: 750px;
}
.dashboard_datatable thead {
	height: 50px;
	background: #f3f3f3;
}
.dashboard_datatable .text-start {
	height: 50px !important;
}
</style>
