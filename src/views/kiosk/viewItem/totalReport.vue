<template>
	<div style="width:100%;">
		<div :class="$vuetify.breakpoint.xs ? '' : 'wrapper'">
			<v-card class="pa-2 mt-8">
				<v-layout wrap>
					<!-- 상단 selectbox, 날짜 선택 -->
					<v-flex xs12>
						<v-layout wrap align-center>
							<v-spacer></v-spacer>
							<!-- 상태 selectbox -->
							<v-flex lg3 md3 sm12 xs12 class="my-2">
								<selectBox :sel="statusSel" @change="changeStatus" class="mr-2" />
							</v-flex>
							<btn :btn="exportBtn" :style="`background-color:${$store.state.PointColor2}`" @click="clickExport1" btn_txt="Excel"></btn>
						</v-layout>
					</v-flex>
					<!-- 데이터 테이블 -->
					<div style="width:100%">
						<v-data-table
							class="tbl-type01 datatable-setting datatablehover"
							:headers="totalDatatable.headers"
							:hide-default-footer="false"
							:items="totalDatatable.items"
							:single-expand="singleExpand"
							:item-class="itemBackground"
							:expanded.sync="expanded"
							item-key="title"
							show-expand
							:footer-props="{
								['items-per-page-text']: '',
							}"
						>
							<template v-slot:[`item.data-table-expand`]="{ isExpanded, item }">
								<v-icon @click="expanded = [item]" v-if="!isExpanded">mdi-plus-box-outline </v-icon>
								<v-icon @click="expanded = []" v-else>mdi-minus-box-outline </v-icon>
							</template>
							<template v-slot:[`expanded-item`]="{ headers, item }">
								<td :colspan="headers.length" class="pa-0 mt-5">
									<!-- 중분류 테이블 -->
									<!-- hide-default-header -->
									<v-data-table
										class="tbl-type01 extendDatatable "
										:headers="totalDatatable.childHeaders"
										:items="item.itemList"
										mobile-breakpoint="10"
										:items-per-page="10"
										:item-class="itemBackground1"
										:footer-props="{
											['items-per-page-text']: '',
										}"
									>
									</v-data-table>
								</td>
							</template>
						</v-data-table>
					</div>

					<download-excel
						class="btn btn-default"
						id="totalReport-export"
						:data="totalDatatable.exportItems"
						style="display:none"
						:fields="json_fields1"
						type="csv; charset=utf-8;"
						worksheet="My Worksheet"
						:name="'통계보고서'"
					>
					</download-excel>
				</v-layout>
			</v-card>
		</div>
	</div>
</template>

<script>
import { selectBox, btn } from '@/components/index.js'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		downloadExcel,
		selectBox,
		btn,
	},

	data() {
		return {
			dataForExcel: [],

			searchTxt: '',
			/// 캠페인별 통계
			expanded: [],
			singleExpand: true,
			totalDatatable: {
				headers: [],
				childHeaders: [],
				items: [],
				exportItems: [],
				itemsLists: [],
				hidedefaultfooter: false,
				breakpoint: false,
				itemPerPage: 10,
			},

			exportBtn: {
				// export 버튼
				class: '',
				dark: true,
				color: '',
				width: '100',
			},
			json_fields1: {},
			// selectBox
			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			selCampaign: { value: '', errorMessage: '', hideDetail: true, items: [], code: [], outlined: true },
			statusSel: {
				value: '진행중',
				errorMessage: '',
				hideDetail: true,
				items: ['진행중', '시작 예정', '종료'],
				code: [],
				outlined: true,
				label: '운영 상태',
			},

			datedisable: true,

			screenWidth: window.innerWidth,

			dataForFilter: {},
		}
	},
	created() {
		this.reservedayTotalReport()
	},
	methods: {
		async reservedayTotalReport() {
			this.$store.state.loading = true
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
			}
			await this.$store.dispatch('reservedayTotalReport', data).then(res => {
				this.$store.state.loading = false
				let headers = []
				let childHeaders = []
				// let items = []
				let ExportItems = {}
				let ExportData = []
				if (res.data.reservedayTotalReport.count !== 'no-reserveday') {
					res.data.reservedayTotalReport.count.headers.forEach(e => {
						if (e.value === 'title') {
							e['width'] = '150px'
						} else if (e.value === 'bizStatus') {
							e['width'] = '80px'
						} else if (e.value === 'period') {
							e['width'] = '190px'
						} else {
							e['width'] = '120px'
						}
						headers.push(e)

						let key = e.text
						let value = e.value
						ExportItems[key] = value
					})
					this.json_fields1 = ExportItems

					let expand = { text: '', width: '60px', align: 'start', value: 'data-table-expand' }
					headers.splice(3, 0, expand)

					childHeaders = JSON.parse(JSON.stringify(headers))
					let titleIndex = childHeaders.findIndex(e => e.text === '사업지명')
					let statusIndex = childHeaders.findIndex(e => e.text === '상태')
					let dateIndex = childHeaders.findIndex(e => e.text === '기간')
					childHeaders[titleIndex].text = ''
					childHeaders[titleIndex].sortable = false
					childHeaders[statusIndex].text = ''
					childHeaders[statusIndex].sortable = false
					childHeaders[dateIndex].text = '날짜'
					res.data.reservedayTotalReport.count.items.forEach(e => {
						let sdate = e.period.split('~')[0]
						let edate = e.period.split('~')[1]
						let date = this.$moment()
						let periodcheck = this.$moment(date).isBetween(sdate, edate, undefined, '[]')
						if (periodcheck) {
							e.bizStatus = '진행중'
						} else {
							let beforeCheck = this.$moment(date).isBefore(sdate)
							let afterCheck = this.$moment(date).isAfter(edate)

							if (beforeCheck) {
								let beforDate = this.$moment(sdate).diff(date, 'days')
								e.bizStatus = '시작 예정 (' + beforDate + '일 전)'
							} else if (afterCheck) {
								let afterDate = this.$moment(date).diff(edate, 'days')
								e.bizStatus = '종료 (' + afterDate + '일 경과)'
							}
						}
						let fiterItemlist = res.data.reservedayTotalReport.count.itemsLists.filter(obj => {
							if (e.code === obj.code) {
								return obj
							}
						})
						e['itemList'] = fiterItemlist
						ExportData.push(e)
						fiterItemlist.forEach(obj => {
							ExportData.push(obj)
						})
					})
				}
				this.totalDatatable.itemsLists = res.data.reservedayTotalReport.count.itemsLists
				this.dataForFilter = res.data.reservedayTotalReport.count
				this.totalDatatable.headers = headers
				this.totalDatatable.childHeaders = childHeaders
				this.totalDatatable.items = res.data.reservedayTotalReport.count.items
				this.totalDatatable.exportItems = ExportData
				res.data.reservedayTotalReport.count.items
				this.changeStatus()
			})
		},
		itemBackground() {
			let class1
			class1 = 'trSet'
			return class1
		},
		itemBackground1() {
			let class1
			class1 = 'trSet1'
			return class1
		},

		changeStatus() {
			this.totalDatatable.items = []
			this.totalDatatable.exportItems = []
			this.dataForFilter.items.forEach(element => {
				if (element.bizStatus) {
					if (element.bizStatus.indexOf(this.statusSel.value) > -1) {
						this.totalDatatable.items.push(element)
						this.totalDatatable.exportItems.push(element)
						this.totalDatatable.itemsLists.forEach(list => {
							if (element.code === list.code) {
								this.totalDatatable.exportItems.push(list)
							}
						})
					}
				}
			})
		},
		termCampaign(val) {
			let start = this.$moment(this.totalStartpicker.date).format('YYMMDD')
			val = this.$moment(val).format('YYMMDD') > start
			return val
		},
		disabledata() {
			this.datedisable = false
		},
		clickExport1() {
			document.getElementById('totalReport-export').click()
		},
		inputCampExcelData() {
			let excelDatas = []
			let excelTitle = { ' ': '설문항목별 통계자료 :' }
			let excelSet = {}
			let excelHeader = {}
			let headBlank = ''
			/// col 기준 값에 빈칸 삽입,캠페인 통계 헤더 text 삽입
			this.campDatatable.headers.forEach(e => {
				headBlank = headBlank + ' '
				excelSet[headBlank] = ' '
				excelHeader[headBlank] = e.text
			})
			excelDatas.push(excelSet)
			excelDatas.push(excelTitle)
			// excelDatas.push(excelHeader)
			/// 캠페인 통계 아이템 삽입

			// 항목별 아이템 삽입
			if (this.selCampaign.value) {
				this.campaigns.forEach(e => {
					excelDatas.push({})
					let itemTitle = { ' ': e.title + '별 통계자료 :' }
					excelDatas.push(itemTitle)
					excelDatas.push(excelHeader)
					e.items.forEach(item => {
						let campCountItem = {}
						let headBlank = ''
						for (var key in item) {
							headBlank = headBlank + ' '
							campCountItem[headBlank] = item[key]
						}
						excelDatas.push(campCountItem)
					})
				})
			}
			this.dataForExcel = excelDatas
		},
	},
}
</script>
<style lang="scss">
.datatable-setting2 {
	min-width: 760px !important;
	margin-bottom: 20px;
}
.exportAlign {
	text-align: right;
}
.sort_lay {
	.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
		width: 100%;
	}
}
.sticky1 {
	position: sticky;
	left: 0;
	background-color: white;
	z-index: 5;
}
.sticky2 {
	position: sticky;
	left: 180px;
	background-color: white;
	z-index: 5;
}
.sticky3 {
	position: sticky;
	left: 360px;
	background-color: white;
	z-index: 5;
}
.sticky4 {
	position: sticky;
	left: 540px;
	background-color: white;
	z-index: 5;
}
.extendDatatable {
	.v-data-table__wrapper {
		overflow: hidden;
		margin-top: 0px;
	}
}
</style>
