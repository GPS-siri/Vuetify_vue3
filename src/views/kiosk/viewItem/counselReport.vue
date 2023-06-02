<template>
	<div style="width:100%;">
		<div :class="$vuetify.breakpoint.xs ? '' : 'wrapper'">
			<div class="notice-sample" v-if="$route.name === 'sample1'">
				※ 현 데이터를 샘플 이므로 변경 되지 않습니다.
			</div>
			<v-layout wrap>
				<!--일별 상담고객 통계 -->
				<v-flex class="mb-3 mt-8 pl-2" lg12 xs12>
					<v-card class="pa-2">
						<v-layout wrap align-center>
							<v-flex lg3 md4 sm12 xs12 offset-lg9 offset-md8 class="my-5" v-if="$route.name !== 'sample1'">
								<selectBox v-if="sel.items != []" :sel="selWaiting" @change="changeWaiting" />
							</v-flex>
							<span class="mr-3">| 일별 상담고객 현황 </span>
							<v-flex :class="$vuetify.breakpoint.xs ? 'my-2' : 'my-2 mx-5'" lg2 md2 sm12 xs12
								><DatepickerDialog :picker="waitingpicker" :disabledata="disabledata" @input="counselingCount(sel.value)"></DatepickerDialog
							></v-flex>
							<btn
								:btn="hideDisagree"
								:style="`background-color:${$store.state.PointColor2}`"
								@click="clickExport9"
								:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
								btn_txt="Excel"
							></btn>
							<v-flex xs12>
								<datatable :datatable="waitingDatatable" class="tbl-type01 sort_lay" :search="searchTxt"> </datatable>
							</v-flex>
							<download-excel
								class="btn btn-default"
								id="csv-download9"
								:data="waitingDatatable.items"
								style="display:none"
								:fields="json_fields9"
								type="csv; charset=utf-8;"
								worksheet="My Worksheet"
								:name="waitingpicker.date + '_' + selWaiting.value + ' 상담고객 현황'"
							>
							</download-excel>
						</v-layout>
					</v-card>
				</v-flex>
				<!--기간별 상담고객 통계 -->
				<v-flex class="mb-3 mt-8 pl-2" lg12 xs12>
					<v-card class="pa-2">
						<v-layout wrap align-center>
							<span class="mr-3">| 기간별 상담고객 현황 </span>
							<v-flex :class="$vuetify.breakpoint.xs ? 'my-2' : 'my-2 mx-5'" lg2 md2 sm12 xs12
								><DatepickerDialog :picker="waitingTermStartpicker" :disabledata="disabledata"></DatepickerDialog
							></v-flex>
							<span class="mx-3"> ~ </span>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'my-2 mr-5 ml-2'" lg2 md2 sm12 xs12>
								<DatepickerDialog
									:picker="waitingTermEndpicker"
									:disabledata="disabledata"
									:allowed_dates="termCouselor"
									@input="counselingRangeCount(sel.value)"
								></DatepickerDialog>
							</v-flex>
							<btn
								:btn="hideDisagree"
								:style="`background-color:${$store.state.PointColor2}`"
								@click="clickExport10"
								:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
								btn_txt="Excel"
							></btn>

							<!-- <v-btn @click="showChart4" class="addBtn" color="PointColor2">CHART</v-btn> -->
							<v-flex xs12>
								<datatable :datatable="waitingTermDatatable" class="tbl-type01 sort_lay" :search="searchTxt"> </datatable>
							</v-flex>
							<div class="exportAlign">
								<!-- <v-btn @click="clickExport4" class="addBtn" color="PointColor2">EXPORT</v-btn> -->
							</div>

							<download-excel
								class="btn btn-default"
								id="csv-download10"
								:data="waitingTermDatatable.items"
								style="display:none"
								:fields="json_fields10"
								type="csv; charset=utf-8;"
								worksheet="My Worksheet"
								:name="waitingTermStartpicker.date + ' ~ ' + waitingTermEndpicker.date + '_' + selWaiting.value + ' 상담고객 현황'"
							>
							</download-excel>
						</v-layout>
					</v-card>
				</v-flex>
				<!-- 일별 상담사 상담 현황 -->
				<v-flex class="mb-3 mt-8 pl-2" lg12 xs12>
					<v-card class="pa-2">
						<v-layout wrap align-center>
							<span class="mr-3">| 일별 상담사 상담 현황 </span>
							<v-flex :class="$vuetify.breakpoint.xs ? 'my-2' : 'my-2 mx-5'" lg2 md2 sm12 xs12
								><DatepickerDialog :picker="counselorpicker" :disabledata="disabledata" @input="waitingsCount(sel.value)"></DatepickerDialog
							></v-flex>
							<btn
								:btn="hideDisagree"
								:style="`background-color:${$store.state.PointColor2}`"
								@click="clickExport3"
								:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
								btn_txt="Excel"
							></btn>
							<v-flex xs12>
								<datatable :datatable="counselorDatatable" class="tbl-type01 sort_lay" :search="searchTxt"> </datatable>
							</v-flex>
							<download-excel
								class="btn btn-default"
								id="csv-download3"
								:data="counselorDatatable.items"
								style="display:none"
								:fields="json_fields3"
								type="csv; charset=utf-8;"
								worksheet="My Worksheet"
								:name="counselorpicker.date + ' 상담사 상담 현황'"
							>
							</download-excel>
						</v-layout>
					</v-card>
				</v-flex>
				<!-- 기간별 상담사 상담 현황 -->
				<v-flex class="mb-3 mt-8 pl-2" lg12 xs12>
					<v-card class="pa-2">
						<v-layout wrap align-center>
							<span class="mr-3">| 기간별 상담사 상담 현황 </span>
							<v-flex :class="$vuetify.breakpoint.xs ? 'my-2' : 'my-2 mx-5'" lg2 md2 sm12 xs12
								><DatepickerDialog
									:picker="counselTermStartpicker"
									:disabledata="disabledata"
									@input="waitingsRangeCount(sel.value)"
								></DatepickerDialog
							></v-flex>
							<span class="mx-3"> ~ </span>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'my-2 mr-5 ml-2'" lg2 md2 sm12 xs12>
								<DatepickerDialog
									:picker="counselTermEndpicker"
									:disabledata="disabledata"
									:allowed_dates="termCouselor"
									@input="waitingsRangeCount(sel.value)"
								></DatepickerDialog>
							</v-flex>
							<btn
								:btn="hideDisagree"
								:style="`background-color:${$store.state.PointColor2}`"
								@click="clickExport4"
								:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
								btn_txt="Excel"
							></btn>

							<!-- <v-btn @click="showChart4" class="addBtn" color="PointColor2">CHART</v-btn> -->
							<v-flex xs12>
								<datatable :datatable="counselTermDatatable" class="tbl-type01 sort_lay" :search="searchTxt"> </datatable>
							</v-flex>
							<div class="exportAlign">
								<!-- <v-btn @click="clickExport4" class="addBtn" color="PointColor2">EXPORT</v-btn> -->
							</div>

							<download-excel
								class="btn btn-default"
								id="csv-download4"
								:data="counselTermDatatable.items"
								style="display:none"
								:fields="json_fields4"
								type="csv; charset=utf-8;"
								worksheet="My Worksheet"
								:name="counselTermStartpicker.date + ' ~ ' + counselTermEndpicker.date + ' 상담사 상담 현황'"
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
import { datatable, DatepickerDialog, selectBox, btn } from '@/components/index.js'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		downloadExcel,
		datatable,
		DatepickerDialog,
		selectBox,
		btn,
	},
	props: {
		selData: String,
	},
	data() {
		return {
			dataForExcel: [],

			/// 상담고객 통계
			waitingDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			waitingpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			waitingTermDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			waitingTermStartpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			waitingTermEndpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			/// 상담사 통계
			counselorDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			counselorpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			counselTermDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			counselTermStartpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			counselTermEndpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			///

			searchTxt: '',

			// selectBox
			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			selWaiting: { value: '', errorMessage: '', hideDetail: true, items: [], code: [], outlined: true, label: '거점 홍보명' },

			json_fields3: {},
			json_fields4: {},
			json_fields9: {},
			json_fields10: {},
			datedisable: true,
			reservedayItem: [],

			hideDisagree: {
				class: '',
				dark: true,
				color: '',
				width: '100',
			},
			screenWidth: window.innerWidth,
		}
	},
	watch: {
		selData() {
			this.setGroupData()
		},
	},
	computed: {
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
	created() {
		this.setTime()
		if (this.$route.params.tag == undefined) {
			this.$route.params.tag = 'chart'
		}
		if (this.$route.name !== 'sample1') {
			this.setGroupData() // 페이지 데이터 set api 호출
		} else {
			this.counselorDatatable.items = [
				{ '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0, '14': 1, '15': 1, '16': 3, '17': 12, List: 'sample1', Sum: 17 },
			]
			this.counselorDatatable.headers = [
				{ text: 'List', value: 'List' },
				{ text: '8Hour', value: '8' },
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
			this.counselTermDatatable.items = [
				{
					List: 'sample1',
					'21-10-21': 0,
					'21-10-22': 0,
					'21-10-23': 0,
					'21-10-24': 17,
					'21-10-25': 0,
					'21-10-26': 0,
					'21-10-27': 0,
					Sum: 17,
				},
			]
			this.counselTermDatatable.headers = [
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
			this.waitingDatatable.items = [
				{ '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, List: '상담신청', Sum: 0 },
				{ '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, List: '상담완료', Sum: 0 },
				{ '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, List: '상담실패', Sum: 0 },
			]
			this.waitingDatatable.headers = [
				{ text: 'List', value: 'List' },
				{ text: '8Hour', value: '8' },
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
			this.waitingTermDatatable.items = [
				{
					List: '상담신청',
					'21-10-21': 0,
					'21-10-22': 0,
					'21-10-23': 0,
					'21-10-24': 0,
					'21-10-25': 0,
					'21-10-26': 0,
					'21-10-27': 0,
					Sum: 0,
				},
				{
					List: '상담완료',
					'21-10-21': 0,
					'21-10-22': 0,
					'21-10-23': 0,
					'21-10-24': 0,
					'21-10-25': 0,
					'21-10-26': 0,
					'21-10-27': 0,
					Sum: 0,
				},
				{
					List: '상담실패',
					'21-10-21': 0,
					'21-10-22': 0,
					'21-10-23': 0,
					'21-10-24': 0,
					'21-10-25': 0,
					'21-10-26': 0,
					'21-10-27': 0,
					Sum: 0,
				},
			]
			this.waitingTermDatatable.headers = [
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
			this.json_fields3 = {
				List: 'List',
				'8Hour': '8',
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
			this.json_fields4 = {
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
			this.json_fields9 = {
				List: 'List',
				'8Hour': '8',
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
			this.json_fields10 = {
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

		termCouselor(val) {
			let start = this.$moment(this.counselTermStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.counselTermStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
		termWaiting(val) {
			let start = this.$moment(this.waitingTermStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.waitingTermStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},

		disabledata() {
			this.datedisable = false
		},

		clickExport3() {
			document.getElementById('csv-download3').click()
		},
		clickExport4() {
			document.getElementById('csv-download4').click()
		},

		clickExport9() {
			document.getElementById('csv-download9').click()
		},
		clickExport10() {
			document.getElementById('csv-download10').click()
		},

		setGroupData() {
			this.$store.state.loading = true
			this.$store
				.dispatch('groups')
				.then(res => {
					// groups data 저장
					this.groups = res.data.groups
					res.data.groups.forEach(o => {
						if (o.isuse === 0 || o.isuse === 1) {
							this.sel.items.push(o.groupcode)
						}
					})
					this.sel.value = this.$store.state.meData.group.groupcode
					this.reservedays(this.sel.value)
					this.waitingsCount(this.sel.value)
					this.waitingsRangeCount(this.sel.value)
				})
				.catch(() => {})
		},
		setTime() {
			// 일별별 날짜 셋팅
			this.counselorpicker.date = this.$moment(new Date()).format('YYYY-MM-DD')
			this.waitingpicker.date = this.$moment(new Date()).format('YYYY-MM-DD')
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			// 기간별 날짜 셋팅
			this.counselTermStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.counselTermEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
			this.waitingTermStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.waitingTermEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
		},

		waitingsCount(groupcode) {
			const data = {
				groupcode: groupcode,
				date: this.counselorpicker.date,
			}
			this.$store
				.dispatch('waitingsCount', data)
				.then(res => {
					this.counselorDatatable.items = res.data.waitingsCount.count.items
					this.counselorDatatable.headers = res.data.waitingsCount.count.headers
					this.counselorpicker.menu = false
					let ExportItems = {}
					res.data.waitingsCount.count.headers.forEach(x => {
						let key = x.text
						let value = x.value
						ExportItems[key] = value
					})
					this.json_fields3 = ExportItems
				})
				.catch(() => {})
		},
		waitingsRangeCount(groupcode) {
			const data = {
				groupcode: groupcode,
				sdate: this.counselTermStartpicker.date,
				edate: this.counselTermEndpicker.date,
			}
			this.$store
				.dispatch('waitingsRangeCount', data)
				.then(res => {
					this.counselTermDatatable.items = res.data.waitingsRangeCount.count.items
					this.counselTermDatatable.headers = res.data.waitingsRangeCount.count.headers

					this.counselTermStartpicker.menu = false
					this.counselTermEndpicker.menu = false

					let ExportItems = {}
					res.data.waitingsRangeCount.count.headers.forEach(x => {
						let key = x.text
						let value = x.value
						ExportItems[key] = value
					})
					this.json_fields4 = ExportItems
				})
				.catch(() => {})
		},
		counselingCount(groupcode) {
			let index = this.selWaiting.items.findIndex(e => e === this.selWaiting.value)

			const data = {
				groupcode: groupcode,
				code: this.selWaiting.code[index],
				date: this.waitingpicker.date,
			}
			this.$store
				.dispatch('counselingCount', data)
				.then(res => {
					this.waitingDatatable.items = res.data.counselingCount.count.items
					this.waitingDatatable.headers = res.data.counselingCount.count.headers
					this.waitingpicker.menu = false
					let ExportItems = {}
					res.data.counselingCount.count.headers.forEach(x => {
						let key = x.text
						let value = x.value
						ExportItems[key] = value
					})
					this.json_fields9 = ExportItems
				})
				.catch(() => {})
		},
		counselingRangeCount(groupcode) {
			let index = this.selWaiting.items.findIndex(e => e === this.selWaiting.value)
			const data = {
				groupcode: groupcode,
				code: this.selWaiting.code[index],
				sdate: this.waitingTermStartpicker.date,
				edate: this.waitingTermEndpicker.date,
			}
			this.$store
				.dispatch('counselingRangeCount', data)
				.then(res => {
					this.waitingTermDatatable.items = res.data.counselingRangeCount.count.items
					this.waitingTermDatatable.headers = res.data.counselingRangeCount.count.headers
					this.waitingTermStartpicker.menu = false
					this.waitingTermEndpicker.menu = false

					let ExportItems = {}
					res.data.counselingRangeCount.count.headers.forEach(x => {
						let key = x.text
						let value = x.value
						ExportItems[key] = value
					})
					this.json_fields10 = ExportItems
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
					let items = []
					let code = []
					if (res.data.reservedays[0]) {
						res.data.reservedays.forEach(o => {
							if (o.business) {
								if (o.business.id === this.selData) {
									items.push(o.title)
									code.push(o.code)
								}
							}
						})
						this.selWaiting.items = items
						this.selWaiting.value = items[0]
						this.selWaiting.code = code
					} else {
						this.selWaiting.items = items
					}
					this.counselingCount(this.sel.value)
					this.counselingRangeCount(this.sel.value)
					this.reservedayItem = res.data.reservedays
					this.$store.state.loading = false
				})
				.catch(() => {})
		},
		changeWaiting() {
			this.$store.state.loading = true
			this.counselingCount(this.sel.value)
			this.counselingRangeCount(this.sel.value)
		},
	},
}
</script>
<style lang="scss">
.exportAlign {
	text-align: right;
}
.sort_lay {
	.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
		width: 100%;
	}
}
</style>
