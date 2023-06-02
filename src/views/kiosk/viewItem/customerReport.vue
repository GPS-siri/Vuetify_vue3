<template>
	<div style="width:100%;">
		<div :class="$vuetify.breakpoint.xs ? '' : 'wrapper'">
			<div class="notice-sample" v-if="$route.name === 'sample1'">
				※ 현 데이터를 샘플 이므로 변경 되지 않습니다.
			</div>
			<v-layout wrap>
				<!-- 입장고객 통계 -->
				<v-flex class="mb-3 mt-8 px-2" lg12 xs12>
					<v-card class="pa-2">
						<v-layout wrap align-center>
							<v-flex lg3 md4 sm12 xs12 offset-lg9 offset-md8 class="my-5" v-if="$route.name !== 'sample1'">
								<selectBox v-if="sel.items != []" :sel="selVisit" @change="changeVisit" />
							</v-flex>
							<span class="mr-3">| 일별 방문고객 현황 </span>
							<v-flex :class="$vuetify.breakpoint.xs ? 'my-2' : 'my-2 mx-5'" lg2 md2 sm12 xs12
								><DatepickerDialog :picker="visitpicker" :disabledata="disabledata" @input="visitCount(sel.value)"></DatepickerDialog
							></v-flex>
							<btn
								:btn="hideDisagree"
								:style="`background-color:${$store.state.PointColor2}`"
								@click="clickExport7"
								:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
								btn_txt="Excel"
							></btn>
							<v-flex xs12>
								<datatable :datatable="visitDatatable" class="tbl-type01 sort_lay" :search="searchTxt"> </datatable>
							</v-flex>

							<download-excel
								class="btn btn-default"
								id="csv-download7"
								:data="visitDatatable.items"
								style="display:none"
								:fields="json_fields5"
								type="csv; charset=utf-8;"
								worksheet="My Worksheet"
								:name="visitpicker.date + '_' + selVisit.value + ' 방문고객 현황'"
							>
							</download-excel>
						</v-layout>
					</v-card>
				</v-flex>
				<!-- 입장고객 현황 통계 -->
				<v-flex class="mb-3 mt-8 px-2" lg12 xs12>
					<v-card class="pa-2">
						<v-layout wrap align-center>
							<span class="mr-3">| 기간별 방문고객 현황 </span>
							<v-flex :class="$vuetify.breakpoint.xs ? 'my-2' : 'my-2 mx-5'" lg2 md2 sm12 xs12
								><DatepickerDialog
									:picker="visitStartpicker"
									:disabledata="disabledata"
									@input="visitRangeCount(sel.value)"
								></DatepickerDialog
							></v-flex>
							<span class="mx-3"> ~ </span>
							<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'my-2 mr-5 ml-2'" lg2 md2 sm12 xs12>
								<DatepickerDialog
									:picker="visitEndpicker"
									:disabledata="disabledata"
									:allowed_dates="termVisit"
									@input="visitRangeCount(sel.value)"
								></DatepickerDialog>
							</v-flex>
							<btn
								:btn="hideDisagree"
								:style="`background-color:${$store.state.PointColor2}`"
								@click="clickExport8"
								:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
								btn_txt="Excel"
							></btn>
							<v-flex xs12>
								<datatable :datatable="visitTermDatatable" class="tbl-type01 sort_lay" :search="searchTxt"> </datatable>
							</v-flex>
							<div class="exportAlign">
								<!-- <v-btn @click="clickExport8" class="addBtn" color="PointColor2">EXPORT</v-btn> -->
							</div>

							<download-excel
								class="btn btn-default"
								id="csv-download8"
								:data="visitTermDatatable.items"
								style="display:none"
								:fields="json_fields6"
								type="csv; charset=utf-8;"
								worksheet="My Worksheet"
								:name="visitStartpicker.date + ' ~ ' + visitEndpicker.date + '_' + selVisit.value + ' 방문고객 현황'"
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
import { datatable, DatepickerDialog, btn, selectBox } from '@/components/index.js'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		downloadExcel,
		datatable,
		DatepickerDialog,
		btn,
		selectBox,
	},
	props: {
		selData: String,
	},
	watch: {
		selData() {
			this.setGroupData()
		},
	},
	data() {
		return {
			dataForExcel: [],

			//visit 통계
			visitDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			visitpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			visitTermDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			visitStartpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			visitEndpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},

			searchTxt: '',

			// selectBox
			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			selVisit: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true, label: '방문 거점 홍보명' },

			json_fields5: {},
			json_fields6: {},
			datedisable: true,
			reservedayItem: [],
			campaigns: [],
			login: '',

			hideDisagree: {
				class: '',
				dark: true,
				color: '',
				width: '100',
			},
			screenWidth: window.innerWidth,
		}
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
	created() {
		this.setTime()
		if (this.$route.params.tag == undefined) {
			this.$route.params.tag = 'chart'
		}
		if (this.$route.name !== 'sample1') {
			this.setGroupData() // 페이지 데이터 set api 호출
		} else {
			this.visitDatatable.items = [
				{ '8': 0, '9': 1, '10': 2, '11': 0, '12': 0, '13': 3, '14': 2, '15': 2, '16': 2, '17': 0, List: '예약 현황', Sum: 12 },
				{ '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, List: '예약자 방문 현황', Sum: 0 },
				{ '8': 0, '9': 0, '10': 0, '11': 0, '12': 0, '13': 0, '14': 0, '15': 0, '16': 0, '17': 0, List: '동반고객 방문 현황', Sum: 0 },
			]
			this.visitDatatable.headers = [
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
			this.visitTermDatatable.items = [
				{
					List: '예약 현황',
					'21-10-21': 0,
					'21-10-22': 0,
					'21-10-23': 9,
					'21-10-24': 12,
					'21-10-25': 0,
					'21-10-26': 0,
					'21-10-27': 0,
					Sum: 21,
				},
				{
					List: '예약자 방문 현황',
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
					List: '동반고객 방문 현황',
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
			this.visitTermDatatable.headers = [
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
			this.json_fields5 = {
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
			this.json_fields6 = {
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

		termVisit(val) {
			let start = this.$moment(this.visitStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.visitStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},

		disabledata() {
			this.datedisable = false
		},

		clickExport7() {
			document.getElementById('csv-download7').click()
		},
		clickExport8() {
			document.getElementById('csv-download8').click()
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
				})
				.catch(() => {})
		},
		setTime() {
			// 일별별 날짜 셋팅
			this.visitpicker.date = this.$moment(new Date()).format('YYYY-MM-DD')
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			// 기간별 날짜 셋팅

			this.visitStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.visitEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
		},

		// visitSet(groupcode) {},
		visitCount(groupcode) {
			const index = this.reservedayItem.map(x => x.title).indexOf(this.selVisit.value)
			const data = {
				groupcode: groupcode,
				date: this.visitpicker.date,
				code: this.reservedayItem[index].code,
			}
			this.$store.dispatch('visitCount', data).then(res => {
				this.visitDatatable.items = res.data.visitCount.count.items
				this.visitDatatable.headers = res.data.visitCount.count.headers
				this.visitpicker.menu = false
				let ExportItems = {}
				res.data.visitCount.count.headers.forEach(x => {
					let key = x.text
					let value = x.value
					ExportItems[key] = value
				})
				this.json_fields5 = ExportItems
			})
		},
		visitRangeCount(groupcode) {
			const index = this.reservedayItem.map(x => x.title).indexOf(this.selVisit.value)
			const data = {
				groupcode: groupcode,
				sdate: this.visitStartpicker.date,
				edate: this.visitEndpicker.date,
				code: this.reservedayItem[index].code,
			}
			this.$store.dispatch('visitRangeCount', data).then(res => {
				this.visitTermDatatable.items = res.data.visitRangeCount.count.items
				this.visitTermDatatable.headers = res.data.visitRangeCount.count.headers
				this.visitStartpicker.menu = false
				this.visitEndpicker.menu = false

				let ExportItems = {}
				res.data.visitRangeCount.count.headers.forEach(x => {
					let key = x.text
					let value = x.value
					ExportItems[key] = value
				})
				this.json_fields6 = ExportItems
				this.$store.state.loading = false
			})
		},

		reservedays(groupcode) {
			const data = {
				groupcode: groupcode,
				status: 1,
			}
			this.$store.dispatch('reservedays', data).then(res => {
				let code = []
				let itemsVisit = []
				if (res.data.reservedays[0]) {
					res.data.reservedays.forEach(o => {
						if (o.business) {
							if (o.business.id === this.selData) {
								if (o.type === 'd') {
									itemsVisit.push(o.title)
									code.push(o.code)
								}
							}
						}
					})
					this.selVisit.items = itemsVisit
					this.selVisit.value = itemsVisit[0]
				} else {
					this.selVisit.items = itemsVisit
				}
				this.reservedayItem = res.data.reservedays

				if (itemsVisit.length > 0) {
					this.visitCount(this.sel.value)
					this.visitRangeCount(this.sel.value)
				} else {
					this.visitDatatable = {
						disableSort: true,
						headers: [],
						items: [],
						hidedefaultfooter: false,
						breakpoint: false,
					}

					this.visitTermDatatable = {
						disableSort: true,
						headers: [],
						items: [],
						hidedefaultfooter: false,
						breakpoint: false,
					}
				}
				this.$store.state.loading = false
			})
		},

		clickDeleteBtn() {},
		clickEditBtn() {},

		test() {
			document.getElementById('testdown').click()
		},

		changeVisit() {
			this.$store.state.loading = true
			this.visitCount(this.sel.value)
			this.visitRangeCount(this.sel.value)
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
