<template>
	<div style="width:100%">
		<v-layout align-center>
			<div class="main_title">
				기간별 출/퇴근 리스트
			</div>
			<div class="router_title ml-3">
				근태관리 > 출퇴근리스트 > 기간별 출/퇴근 리스트
			</div>
		</v-layout>
		<div class="mt-10">
			<v-layout align-center>
				<v-layout align-center class="search_box">
					<div class="search_title">
						검색어
					</div>
					<div class="search_body">
						<div style="width:200px" class="ml-3">
							<v-select class="search_select" v-model="search_keyword.value" hideDetails :items="search_keyword.items" outlined></v-select>
						</div>
						<div style="width:200px" class="ml-3">
							<v-text-field class="text_field" v-model="search_keyword.input" hideDetails outlined></v-text-field>
						</div>
					</div>
				</v-layout>
			</v-layout>
			<v-layout align-center class="mt-2">
				<v-layout align-center class="search_box">
					<div class="search_title">
						기간
					</div>
					<div class="search_body2">
						<div class="ml-3">
							<v-btn
								:outlined="date.value === '오늘' ? false : true"
								:color="date.value === '오늘' ? 'primary' : ''"
								@click="changeDate('오늘')"
							>
								오늘
							</v-btn>
							<v-btn
								:outlined="date.value === '1주일' ? false : true"
								class="ml-2"
								:color="date.value === '1주일' ? 'primary' : ''"
								@click="changeDate('1주일')"
							>
								1주일
							</v-btn>
							<v-btn
								:outlined="date.value === '15일' ? false : true"
								class="ml-2"
								:color="date.value === '15일' ? 'primary' : ''"
								@click="changeDate('15일')"
							>
								15일
							</v-btn>
							<v-btn
								:outlined="date.value === '1개월' ? false : true"
								class="ml-2"
								:color="date.value === '1개월' ? 'primary' : ''"
								@click="changeDate('1개월')"
							>
								1개월
							</v-btn>
							<v-btn
								:outlined="date.value === '3개월' ? false : true"
								class="ml-2"
								:color="date.value === '3개월' ? 'primary' : ''"
								@click="changeDate('3개월')"
							>
								3개월
							</v-btn>
						</div>
						<div class="d-flex align-center date_picker ml-3" style="width:150px">
							<DatepickerDialog :picker="date.start"></DatepickerDialog>
						</div>
						<div class="d-flex align-center mx-1">~</div>
						<div class="d-flex align-center date_picker" style="width:150px">
							<DatepickerDialog :picker="date.end" :allowed_dates="allowed_datesEnd"></DatepickerDialog>
						</div>
					</div>
				</v-layout>
			</v-layout>
		</div>
		<v-layout class="mt-8 pb-5 search_btn" justify-center align-center>
			<v-btn color="primary" style="width:120px; height:35px;" @click="searchAction()">
				검색
			</v-btn>
			<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="clearData()">
				초기화
			</v-btn>
		</v-layout>
		<div class="table_box mt-5">
			<v-layout justify-space-between align-center>
				<v-flex xs6>
					<span style="font-size:12px;"> 검색결과 총 {{ table.items.length }} 건 </span>
				</v-flex>
				<v-flex style="text-align: -webkit-right; ">
					<v-layout align-center style="width:450px; justify-content:right;">
						<v-btn small rounded outlined color="primary" @click="$router.push({ name: '/attendanceManagementDayList' })">
							출/퇴근 리스트보기
						</v-btn>
						<span style="font-size:12px; margin-left:10px; margin-right:10px;">
							|
						</span>
						<v-btn disabled small outlined class="btn-style" color="green" @click="excelExport()">
							<img src="@/assets/images/excel-img2.png" />
							엑셀파일 다운로드
						</v-btn>
					</v-layout>
				</v-flex>
			</v-layout>
			<v-data-table
				:headers="table.headers"
				:items="table.items"
				class="elevation-0 table_style_1 mt-2"
				show-select
				v-model="selected"
				item-key="name"
				:footer-props="{
					['items-per-page-text']: ``,
				}"
			>
				<template v-slot:body="{ headers, items, isSelected, select }">
					<tbody>
						<tr v-for="(d, index) in items" :key="index">
							<td>
								<v-checkbox
									:input-value="isSelected(d)"
									style="margin:0px;padding:0px"
									color="#535353"
									hide-details
									@click="select(d, !isSelected(d))"
								>
								</v-checkbox>
							</td>
							<td>
								{{ d.name }}
							</td>
							<td style="border-right:1px solid #d1d1d1; ">{{ d.gotoworks.filter(x => x.status === 'endWork').length }}일</td>
							<td v-for="(hd, i) in headers.slice(3, headers.length)" :key="i">
								<div v-if="d.gotoworks.filter(x => x.date === hd.text).length > 0" style="border:1px solid #d1d1d1; min-width:100px;">
									<v-layout style="color:#606060; font-size:0.75rem; ">
										<v-flex xs6 style="background-color:#f99f9f; border-right:1px solid #a5a4a4;">{{
											d.gotoworks.filter(x => x.date === hd.text)[0].startWork
												? $moment(d.gotoworks.filter(x => x.date === hd.text)[0].startWork).format('HH:mm')
												: '-'
										}}</v-flex>
										<v-flex xs6 style="background-color:#D4D3FC;">{{
											d.gotoworks.filter(x => x.date === hd.text)[0].endWork
												? $moment(d.gotoworks.filter(x => x.date === hd.text)[0].endWork).format('HH:mm')
												: '-'
										}}</v-flex>
									</v-layout>
									<v-layout style="color:#606060; font-size:0.75rem;">
										<v-flex style="background-color:#bfbfbf; border-top:1px solid #a5a4a4; border-bottom:1px solid #a5a4a4;">
											{{
												$moment(d.gotoworks.filter(x => x.date === hd.text)[0].startWork) &&
												$moment(d.gotoworks.filter(x => x.date === hd.text)[0].endWork)
													? timeCheck(
															$moment(d.gotoworks.filter(x => x.date === hd.text)[0].startWork),
															$moment(d.gotoworks.filter(x => x.date === hd.text)[0].endWork),
													  )
													: '-'
											}}
											<!-- d.gotoworks.filter(x => x.date === hd.text)[0].date  -->
										</v-flex>
									</v-layout>
									<v-layout style="color:#606060; font-size:0.75rem;">
										<v-flex>
											{{ workStatus(d.gotoworks.filter(x => x.date === hd.text)[0].status) }}
										</v-flex>
									</v-layout>
								</div>
								<div v-else class="my-1" style="font-size:0.75rem; width:100%; border:1px solid #d1d1d1; min-width:100px;">
									<v-layout>
										<v-flex xs6 style="background-color:#f99f9f; border-right:1px solid #a5a4a4; ">-</v-flex>
										<v-flex xs6 style="background-color:#D4D3FC; ">-</v-flex>
									</v-layout>
									<v-layout>
										<v-flex xs12 style="background-color:#bfbfbf;  border-top:1px solid #a5a4a4; border-bottom:1px solid #a5a4a4;">
											-
										</v-flex>
									</v-layout>
									<v-layout>
										<v-flex xs12 style=""> -</v-flex>
									</v-layout>
								</div>
							</td>
						</tr>
					</tbody>
				</template>
			</v-data-table>
			<download-excel
				class="btn btn-default"
				id="clientExcel"
				:data="table.select_items"
				style="display:none"
				:fields="table.json_fields"
				type="text/csv;charset=utf8"
				worksheet="My Worksheet"
				name="테스트"
			>
			</download-excel>
		</div>
	</div>
</template>

<script>
import { DatepickerDialog } from '@/components'
import downloadExcel from 'vue-json-excel'
export default {
	components: { DatepickerDialog, downloadExcel },
	mounted() {},
	filters: {},
	methods: {
		timeCheck(start, end) {
			if (!isNaN(start) || !isNaN(end)) {
				const moment = require('moment')
				let timeData = ''
				let hour = parseInt(moment.duration(this.$moment(end).diff(this.$moment(start))).asMinutes() / 60)
				let minute = parseInt(moment.duration(this.$moment(end).diff(this.$moment(start))).asMinutes() % 60)
				if (minute === 0) {
					timeData = hour + '시간'
				} else {
					timeData = hour + '시간' + minute + '분'
				}
				return timeData
			} else {
				return 'ㅤ'
			}
		},
		workStatus(val) {
			if (val === 'endWork') {
				return '정상근무'
			} else if (val === 'afternoonVacation') {
				return '오후반차'
			} else if (val === 'morningVacation') {
				return '오전반차'
			} else if (val === 'vacation') {
				return '휴가'
			} else {
				return '출근'
			}
			// d.gotoworks.filter(x => x.date === hd.text)[0].status === 'endWork'
			// 													? '정상근무'
			// 													: d.gotoworks.filter(x => x.date === hd.text)[0].status === 'afternoonVacation'
			// 													? '오후반차'
			// 													: d.gotoworks.filter(x => x.date === hd.text)[0].status === 'morningVacation'
			// 													? '오전반차'
			// 													: d.gotoworks.filter(x => x.date === hd.text)[0].status === 'vacation'
			// 													? '휴가'
			// 													: '출근'
		},
		clearData() {
			this.search_keyword = {
				value: '상담사 이름',
				items: ['상담사 이름', '연락처'],
			}
			this.date = {
				value: '1주일',
				start: {
					date: this.$moment()
						.subtract(7, 'd')
						.format('YYYY-MM-DD'),
				},
				end: { date: this.$moment().format('YYYY-MM-DD') },
			}
			let data = {
				business: this.$store.state.meData.business.id,
				date_gte: this.date.start.date,
				date_lte: this.date.end.date,
			}
			this.usersView(data)
		},
		searchAction() {
			this.headerCheckAction(this.date.start.date, this.date.end.date)
			let data = {
				business: this.$store.state.meData.business.id,
				date_gte: this.date.start.date,
				date_lte: this.date.end.date,
			}
			if (this.search_keyword.value === '상담사 이름') {
				data.name = this.search_keyword.input
			} else {
				data.phone = this.search_keyword.input
			}
			this.usersView(data)
		},
		usersView(data) {
			this.$store
				.dispatch('users', data)
				.then(res => {
					this.table.items = res.users
				})
				.catch(err => {
					console.log({ err })
				})
		},
		headerCheckAction(startDate, endDate) {
			const moment = require('moment')
			let count = moment.duration(this.$moment(endDate).diff(this.$moment(startDate))).asDays() + 1
			let result = []
			this.table.headers = [
				{ text: '상담사', value: 'name', align: 'center', width: '200px' },
				{ text: '근무일수', value: 'amont', align: 'center', width: '200px' },
			]
			for (let index = 0; index < count; index++) {
				let day = this.$moment(startDate)
					.add(index, 'd')
					.format('YYYY-MM-DD')
				result.push(this.table.headers.push({ text: day, value: 'data' + index, align: 'center' }))
				this.table.json_fields[day] = 'data' + index
			}
		},
		checked(item) {
			if (this.table.select_items.findIndex(x => x.name === item.name) > -1) {
				return true
			} else {
				return false
			}
		},
		excelExport() {
			// document.getElementById('clientExcel').click()
		},
		allowed_datesEnd(val) {
			if (this.date.start === '') {
				return val
			} else {
				val = this.$moment().format('YYYY-MM-DD') >= val
			}
			return val
		},
		changeDate(value) {
			if (value === '오늘') {
				this.date.start.date = this.$moment().format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '1주일') {
				this.date.start.date = this.$moment()
					.subtract(7, 'd')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '15일') {
				this.date.start.date = this.$moment()
					.subtract(15, 'd')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '1개월') {
				this.date.start.date = this.$moment()
					.subtract(1, 'M')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '3개월') {
				this.date.start.date = this.$moment()
					.subtract(3, 'M')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			}
			this.date.value = value
		},
		handleAllCheck(check) {
			let li = []
			if (check) {
				li = this.table.items
			} else {
				li = []
			}
			this.table.select_items = li
		},
		handleCheck(item) {
			let li = JSON.parse(JSON.stringify(this.table.select_items))
			if (li.findIndex(x => x.name === item.name) > -1) {
				li.splice(
					li.findIndex(x => x.name === item.name),
					1,
				)
			} else {
				li.push(item)
			}
			this.table.select_items = li
		},
	},
	data() {
		return {
			responseData: [],
			selected: [],
			table: {
				headers: [
					{ text: '상담사', value: 'name', align: 'center', width: '200px' },
					{ text: '근무일수', value: 'amont', align: 'center', width: '200px' },
				],
				headerCheck: false,
				items: [],
				select_items: [],
				json_fields: {
					상담사: 'name',
					근무일수: 'amont',
				},
			},
			search_keyword: {
				value: '상담사 이름',
				items: ['상담사 이름', '연락처'],
				input: '',
			},
			status: {
				value: '전체',
				items: ['전체', '미계약', '계약완료'],
			},
			date: {
				value: '1주일',
				start: {
					date: this.$moment()
						.subtract(6, 'd')
						.format('YYYY-MM-DD'),
				},
				end: { date: this.$moment().format('YYYY-MM-DD') },
			},
		}
	},
	created() {
		const meDataCheck = setInterval(() => {
			let ok = 0
			ok += 1
			if (this.$store.state.meData.business) {
				this.headerCheckAction(this.date.start.date, this.date.end.date)
				const data = {
					business: this.$store.state.meData.business.id,
					role: 3,
					date_gte: this.date.start.date,
					date_lte: this.date.end.date,
				}
				this.usersView(data)
				clearInterval(meDataCheck)
			} else if (ok === 5) {
				clearInterval(meDataCheck)
			}
		}, 1000)
	},
}
</script>
<style lang="scss" scoped>
.main_title {
	font-size: 20px;
}
.router_title {
	font-size: 12px;
	font-weight: 100;
}
.search_box {
	width: 800px;
}
.search_title {
	width: 100px;
	font-size: 12px;
}
.search_body {
	display: flex;
	align-items: center;
	width: 600px;
}
.search_body2 {
	display: flex;
	align-items: center;
}
.search_btn {
	border-bottom: 1px solid #eaeaea;
}

.btn-style {
	box-shadow: none;
	background-color: #ffffff;
	border: 1px solid #9a9c9b;
	border-radius: 5px;
}
</style>
<style lang="scss">
.search_select {
	div {
		.v-input__slot {
			height: 35px !important;
			max-height: 35px !important;
			min-height: 35px !important;
			div {
				.v-input__append-inner {
					margin-top: 6px;
				}
			}
		}
	}
}
.text_field {
	width: 193px;
	margin-left: 10px;
	div {
		.v-input__slot {
			min-height: 35px !important;
			height: 35px;
			padding: 0 10px !important;
		}
	}
}
.date_picker {
	div {
		div {
			.v-input__slot {
				min-height: 35px !important;
				height: 35px !important;
			}
		}
	}
}

.table_style_1 > .v-data-table__wrapper {
	overflow: auto;
	table {
		border-right: 1px solid #d1d1d1;
		border-bottom: 1px solid #d1d1d1;
		thead {
			tr {
				z-index: 1;
				// th:not(:last-of-type) {
				// 	border-right: 1px solid #d1d1d1;
				// }
				th {
					text-align: center !important;
					color: #333333;
					height: 53px;
					border-top: 1px solid #7d7d7d !important;
					border-bottom: 1px solid #7d7d7d !important;
					background-color: #f5f5f5 !important;
				}
				th:nth-child(1) {
					position: sticky;
					left: 0;
					z-index: 2 !important;
					border-left: 1px solid #d1d1d1;
					// border-right: 1px solid #d1d1d1;
					> i {
						display: none;
					}
				}
				th:nth-child(2) {
					position: sticky;
					left: 65px;
					z-index: 2 !important;
					border-left: 1px solid #d1d1d1;
					// border-right: 1px solid #d1d1d1;
				}
				th:nth-child(3) {
					position: sticky;
					left: 265px;
					z-index: 2 !important;
					border-left: 1px solid #d1d1d1;
					border-right: 1px solid #d1d1d1;
				}
			}
		}
	}
}

.table_style_1 > .v-data-table__wrapper > table {
	tbody {
		tr {
			// td:not(:last-of-type) {

			// }
			td {
				height: 50px;
				text-align: center !important;
				background-color: #ffffff !important;
			}
			td:nth-child(1) {
				position: sticky;
				left: 0;
				z-index: 2 !important;
				border-left: 1px solid #d1d1d1;
				// border-right: 1px solid #d1d1d1;
			}
			td:nth-child(2) {
				position: sticky;
				left: 65px;
				z-index: 2 !important;
				border-left: 1px solid #d1d1d1;
				// border-right: 1px solid #d1d1d1;
			}
			td:nth-child(3) {
				position: sticky;
				left: 265px;
				z-index: 2 !important;
				border-left: 1px solid #d1d1d1;
				border-right: 1px solid #d1d1d1;
			}
		}
	}
}
.table_style_1 {
	.v-data-footer {
		display: flex;
		justify-content: center;
		.v-data-footer__select {
			margin-left: 0;
		}
	}
}
.table_box {
	div {
		.v-data-table__wrapper::-webkit-scrollbar {
			width: 12px;
			height: 12px;
		}
	}
}
.table_box {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-thumb {
			background-color: #ced4d7;
			border-radius: 10px;
			background-clip: padding-box;
			border: 2px solid transparent;
		}
	}
}
.table_box {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-track {
			background-color: transparent;
			border-radius: 10px;
			box-shadow: inset 0px 0px 5px white;
			margin-left: 465px;
		}
	}
}
.theme--light.v-data-table .v-data-footer {
	border-top: none;
}
</style>
