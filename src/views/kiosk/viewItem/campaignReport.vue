<template>
	<div style="width:100%;">
		<div :class="$vuetify.breakpoint.xs ? '' : 'wrapper'">
			<div class="notice-sample" v-if="$route.name === 'sample1'">
				※ 현 데이터를 샘플 이므로 변경 되지 않습니다.
			</div>
			<v-layout wrap>
				<!-- 일별 등록고객 -->
				<v-flex class="mb-3 mt-8 pr-2" lg12 xs12>
					<v-card class="pa-2">
						<v-layout wrap align-center>
							<span>| 일별 등록고객 현황 </span>
							<v-flex :class="$vuetify.breakpoint.xs ? 'my-2' : 'my-2 mx-5'" lg2 md2 sm12 xs12
								><DatepickerDialog :picker="daypicker" :disabledata="disabledata" @input="reserveusersCount(sel.value)"></DatepickerDialog
							></v-flex>
							<btn
								:btn="hideDisagree"
								:style="`background-color:${$store.state.PointColor2}`"
								@click="clickExport1"
								:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
								btn_txt="Excel"
							></btn>
							<v-flex xs12>
								<datatable :datatable="dayDatatable" class="tbl-type01 sort_lay" :search="searchTxt"> </datatable>
							</v-flex>
							<div class="exportAlign"></div>
							<download-excel
								class="btn btn-default"
								id="csv-download1"
								:data="dayDatatable.items"
								style="display:none"
								:fields="json_fields1"
								type="text/csv;charset=utf8"
								worksheet="My Worksheet"
								:name="daypicker.date + ' 등록고객 현황'"
							>
							</download-excel>
						</v-layout>
					</v-card>
				</v-flex>
				<!-- 기간별 등록고객 -->
				<v-flex class="mb-3 mt-8 pr-2" lg12 xs12>
					<v-card class="pa-2">
						<v-layout wrap align-center>
							<span>| 기간별 등록고객 현황</span>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'my-2 ml-5 mr-2'" lg2 md2 sm7 xs12>
								<DatepickerDialog
									:picker="termStartpicker"
									:disabledata="disabledata"
									@input="reserveusersRangeCount(sel.value)"
								></DatepickerDialog
							></v-flex>
							<span class="mx-3"> ~ </span>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'my-2 mr-5 ml-2'" lg2 md2 sm12 xs12>
								<DatepickerDialog
									:picker="termEndpicker"
									:disabledata="disabledata"
									:allowed_dates="termCustomer"
									@input="reserveusersRangeCount(sel.value)"
								></DatepickerDialog
							></v-flex>

							<btn
								:btn="hideDisagree"
								:style="`background-color:${$store.state.PointColor2}`"
								@click="clickExport2"
								:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
								btn_txt="Excel"
							></btn>
							<v-flex xs12>
								<datatable :datatable="termDatatable" class="tbl-type01 sort_lay" :search="searchTxt"> </datatable>
							</v-flex>
							<div class="exportAlign"></div>

							<download-excel
								class="btn btn-default"
								id="csv-download2"
								:data="termDatatable.items"
								style="display:none"
								:fields="json_fields2"
								type="csv; charset=utf-8;"
								worksheet="My Worksheet"
								:name="termStartpicker.date + ' ~ ' + termEndpicker.date + ' 등록고객 현황'"
							>
							</download-excel>
						</v-layout>
					</v-card>
				</v-flex>
				<!-- 알림톡 전송 현황 -->
				<v-flex class="mb-3 mt-8 pr-2" lg12 xs12>
					<v-card class="pa-2">
						<v-layout wrap align-center>
							<span>| 알림톡 전송 현황</span>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'my-2 ml-5 mr-2'" lg2 md2 sm7 xs12>
								<DatepickerDialog
									:picker="messageStartpicker"
									:disabledata="disabledata"
									@input="messageReport(sel.value)"
								></DatepickerDialog
							></v-flex>
							<span class="mx-3"> ~ </span>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'my-2 mr-5 ml-2'" lg2 md2 sm12 xs12>
								<DatepickerDialog
									:picker="messageEndpicker"
									:disabledata="disabledata"
									:allowed_dates="messageCustomer"
									@input="messageReport(sel.value)"
								></DatepickerDialog
							></v-flex>

							<btn
								:btn="hideDisagree"
								:style="`background-color:${$store.state.PointColor2}`"
								@click="clickExport3"
								:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
								btn_txt="Excel"
							></btn>
							<v-flex xs12>
								<datatable :datatable="messageDatatable" class="tbl-type01 sort_lay" :search="searchTxt"> </datatable>
							</v-flex>
							<div class="exportAlign"></div>

							<download-excel
								class="btn btn-default"
								id="messageReport"
								:data="messageDatatable.items"
								style="display:none"
								:fields="json_fields3"
								type="csv; charset=utf-8;"
								worksheet="My Worksheet"
								:name="messageStartpicker.date + ' ~ ' + messageEndpicker.date + ' 알림톡 전송 현황'"
							>
							</download-excel>
						</v-layout>
					</v-card>
				</v-flex>
			</v-layout>
		</div>
	</div>
</template>

<script>
import { datatable, DatepickerDialog, btn } from '@/components/index.js'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		datatable,
		DatepickerDialog,
		btn,
		downloadExcel,
	},
	props: {
		selData: String,
	},
	data() {
		return {
			dataForExcel: [],
			// 등록 고객 현황
			dayDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			daypicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			termDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			termStartpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			termEndpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			// 알림톡 전송현황

			messageDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			messageStartpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			messageEndpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			searchTxt: '',
			/// 캠페인별 통계

			// selectBox
			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },

			json_fields1: {},
			json_fields2: {},
			json_fields3: {},

			datedisable: true,

			login: '',

			hideDisagree: {
				class: '',
				dark: true,
				color: '',
				width: '100',
			},
			groups: [],
			screenWidth: window.innerWidth,
			reservedayItem: [], //reserveday 데이터
		}
	},
	watch: {
		selData() {
			this.setGroupData()
		},
	},
	computed: {
		// companionNum() {
		// 	/// 셀렉트박스 클릭
		// 	if (this.companion.value !== '동반자 없음') {
		// 		return ' 외' + this.companion.value
		// 	} else return ''
		// },
		nowWidth() {
			window.addEventListener('resize', () => {
				this.screenWidth = window.innerWidth
			})
			let boolean
			if (this.screenWidth < 900) {
				boolean = true
			} else {
				boolean = false
			}

			return boolean
		},
	},
	async created() {
		this.setTime()
		if (this.$route.name !== 'sample1') {
			await this.setGroupData() // 페이지 데이터 set api 호출
		} else {
			this.dayDatatable.items = [
				{ '9': 1, '10': 2, '11': 0, '12': 0, '13': 3, '14': 2, '15': 2, '16': 2, '17': 0, List: '샘플 방문예약', Sum: 12 },
			]
			this.dayDatatable.headers = [
				{ text: 'List', value: 'List' },
				{ text: '9Hour', value: '9' },
				{ text: '10Hour', value: '10' },
				{ text: '11Hour', value: '11' },
				{ text: '12Hour', value: '12' },
				{ text: '13Hour', value: '13' },
				{ text: '14Hour', value: '14' },
				{ text: '15Hour', value: '15' },
				{ text: '16Hour', value: '16' },
				{ text: '17Hour', value: '17' },
				{ text: 'Sum', value: 'Sum' },
			]
			this.termDatatable.items = [
				{
					List: '샘플 방문예약',
					'21-10-21': 0,
					'21-10-22': 0,
					'21-10-23': 9,
					'21-10-24': 12,
					'21-10-25': 0,
					'21-10-26': 0,
					'21-10-27': 0,
					Sum: 21,
				},
			]
			this.termDatatable.headers = [
				{ text: 'List', value: 'List' },
				{ text: '21-10-21', value: '21-10-21' },
				{ text: '21-10-22', value: '21-10-22' },
				{ text: '21-10-23', value: '21-10-23' },
				{ text: '21-10-24', value: '21-10-24' },
				{ text: '21-10-25', value: '21-10-25' },
				{ text: '21-10-26', value: '21-10-26' },
				{ text: '21-10-27', value: '21-10-27' },
				{ text: 'Sum', value: 'Sum' },
			]
			this.json_fields1 = {
				List: 'List',
				'9Hour': '9',
				'10Hour': '10',
				'11Hour': '11',
				'12Hour': '12',
				'13Hour': '13',
				'14Hour': '14',
				'15Hour': '15',
				'16Hour': '16',
				'17Hour': '17',
				Sum: 'Sum',
			}
			this.json_fields2 = {
				List: 'List',
				'21-10-21': '21-10-21',
				'21-10-22': '21-10-22',
				'21-10-23': '21-10-23',
				'21-10-24': '21-10-24',
				'21-10-25': '21-10-25',
				'21-10-26': '21-10-26',
				'21-10-27': '21-10-27',
				Sum: 'Sum',
			}
		}
	},
	methods: {
		loginData() {
			this.login = this.$store.state.meData.role.name
		},
		// Datepicker 날짜 disable
		termCustomer(val) {
			let start = this.$moment(this.termStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.termStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
		messageCustomer(val) {
			let start = this.$moment(this.messageStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.messageStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
		disabledata() {
			this.datedisable = false
		},
		clickExport1() {
			document.getElementById('csv-download1').click()
		},
		clickExport2() {
			document.getElementById('csv-download2').click()
		},
		clickExport3() {
			document.getElementById('messageReport').click()
		},
		async setGroupData() {
			this.$store.state.loading = true
			await this.$store
				.dispatch('groups')
				.then(res => {
					// groups data 저장
					this.groups = res.data.groups
					res.data.groups.forEach(o => {
						this.sel.items.push(o.groupcode)
					})
					this.sel.value = this.$store.state.meData.group.groupcode
					this.reservedays(this.sel.value)
					this.$store.state.loading = false
				})
				.catch(() => {})
		},
		reservedays(groupcode) {
			const data = {
				groupcode: groupcode,
				status: 1,
			}
			this.$store
				.dispatch('reservedays', data)
				.then(res => {
					this.reservedayItem = res.data.reservedays
					this.reserveusersCount(this.sel.value)
					this.reserveusersRangeCount(this.sel.value)
					this.messageReport(this.sel.value)
				})
				.catch(() => {})
		},
		setTime() {
			// 일별별 날짜 셋팅
			this.daypicker.date = this.$moment(new Date()).format('YYYY-MM-DD')
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			// 기간별 날짜 셋팅
			this.termStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
			this.messageStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.messageEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
		},
		reserveusersCount(groupcode) {
			let data

			data = {
				groupcode: groupcode,
				date: this.daypicker.date,
			}
			this.$store
				.dispatch('reserveusersCount', data)
				.then(res => {
					let items = []
					res.data.reserveusersCount.count.items.forEach(e => {
						let titleCheck = this.reservedayItem.findIndex(obj => obj.title === e['List'])
						if (this.reservedayItem[titleCheck] !== undefined) {
							if (this.reservedayItem[titleCheck].business) {
								if (this.reservedayItem[titleCheck].business.id === this.selData) {
									items.push(e)
								}
							}
						}
					})
					this.dayDatatable.items = items
					this.dayDatatable.headers = res.data.reserveusersCount.count.headers
					this.daypicker.menu = false
					let ExportItems = {}
					res.data.reserveusersCount.count.headers.forEach(x => {
						let key = x.text
						let value = x.value
						ExportItems[key] = value
					})
					this.json_fields1 = ExportItems
					this.$store.state.loading = false
				})
				.catch(() => {})
		},
		reserveusersRangeCount(groupcode) {
			let data

			data = {
				groupcode: groupcode,
				sdate: this.termStartpicker.date,
				edate: this.termEndpicker.date,
			}
			this.$store
				.dispatch('reserveusersRangeCount', data)
				.then(res => {
					let items = []
					res.data.reserveusersRangeCount.count.items.forEach(e => {
						let titleCheck = this.reservedayItem.findIndex(obj => obj.title === e['List'])
						if (this.reservedayItem[titleCheck] !== undefined) {
							if (this.reservedayItem[titleCheck].business) {
								if (this.reservedayItem[titleCheck].business.id === this.selData) {
									items.push(e)
								}
							}
						}
					})

					this.termDatatable.items = items
					this.termDatatable.headers = res.data.reserveusersRangeCount.count.headers
					this.termStartpicker.menu = false
					this.termEndpicker.menu = false

					let ExportItems = {}
					res.data.reserveusersRangeCount.count.headers.forEach(x => {
						let key = x.text
						let value = x.value
						ExportItems[key] = value
					})
					this.json_fields2 = ExportItems
					this.$store.state.loading = false
				})
				.catch(() => {})
		},
		messageReport(groupcode) {
			let data

			data = {
				groupcode: groupcode,
				sdate: this.messageStartpicker.date,
				edate: this.messageEndpicker.date,
			}
			this.$store
				.dispatch('messageReport', data)
				.then(res => {
					let items = []
					res.data.messageReport.count.items.forEach(e => {
						let titleCheck = this.reservedayItem.findIndex(obj => obj.title === e['List'])
						if (this.reservedayItem[titleCheck] !== undefined) {
							if (this.reservedayItem[titleCheck].business) {
								if (this.reservedayItem[titleCheck].business.id === this.selData) {
									items.push(e)
								}
							}
						}
					})

					this.messageDatatable.items = items
					this.messageDatatable.headers = res.data.messageReport.count.headers
					this.messageStartpicker.menu = false
					this.messageEndpicker.menu = false
					let ExportItems = {}

					res.data.messageReport.count.headers.forEach(x => {
						let key = x.text
						let value = x.value
						ExportItems[key] = value
					})

					// res.data.reserveusersRangeCount.count.headers.forEach(x => {
					// 	let key = x.text
					// 	let value = x.value
					// 	ExportItems[key] = value
					// })
					this.json_fields3 = ExportItems
				})
				.catch(() => {})
		},
	},
}
</script>
<style lang="scss">
.notice-sample {
	padding-left: 4px;
	font-size: 1.15rem;
	font-weight: 700;
}
.exportAlign {
	text-align: right;
}
.sort_lay {
	.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
		width: 100%;
	}
}
</style>
