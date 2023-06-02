<template>
	<div>
		<div class="wrapper">
			<!-- 날짜 선택 --------- start -->
			<v-layout align-center class="header_search">
				<v-layout class="search_wrap">
					<v-layout>
						<v-flex class="search_select_type ml-4" style="width:300px; max-width:300px;">
							<selectBox :sel="surveySel_project" class="searchSel" @change="search_reservedays()"></selectBox>
						</v-flex>
						<v-flex class="search_select_type ml-4" style="width:300px; max-width:300px;">
							<selectBox
								:sel="surveySel"
								class="searchSel "
								@change="
									() => {
										first = true
										getTableData(surveySel.value)
									}
								"
							></selectBox>
						</v-flex>
					</v-layout>
					<v-layout justify-end>
						<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_1'">
							<DatepickerDialog :picker="termStartpicker"></DatepickerDialog>
						</v-flex>
						<span class="mx-1"> ~ </span>
						<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'search_date_2'">
							<DatepickerDialog :picker="termEndpicker" :allowed_dates="termCustomer" @input="getTableData(sel.value)"></DatepickerDialog>
						</v-flex>
						<v-flex class="search_select ml-4">
							<selectBox :sel="searchsel" @change="selectDays" :class="'searchSel'"></selectBox>
						</v-flex>
						<v-flex md3 sm3 xs12>
							<txtField class="search_box_type" v-model="search_project" :txtField="search"></txtField>
						</v-flex>

						<v-btn
							class="search_btn"
							color="#5d19ff"
							@click="
								() => {
									first = false
									getTableData(surveySel.value)
								}
							"
							><v-icon>mdi-magnify</v-icon>조회</v-btn
						>
						<v-btn
							class="search_btn"
							color="#5d19ff"
							@click="
								() => {
									first = true
									getTableData(surveySel.value)
									termStartpicker.date = $moment().format('YYYY-MM-DD')
									termEndpicker.date = $moment().format('YYYY-MM-DD')
									searchsel.value = '오늘'
									search_project = ''
								}
							"
							><v-icon></v-icon>초기화</v-btn
						>
					</v-layout>
				</v-layout>
			</v-layout>
			<v-layout align-center class="filter_search2 mt-4">
				<v-flex xs12 class="px-4">
					<v-layout wrap>
						<v-layout
							v-for="(filter, index) in filter_boxes"
							:key="index"
							align-center
							justify-start
							:style="`max-width:${filter.long ? 450 : 300}px; width:${filter.long ? 450 : 300}px; margin-top:20px !important;`"
						>
							<div class="customer-management-text" style="min-width:120px; width:auto; text-align:center;">
								{{ filter.title }}
							</div>
							<div
								xs12
								v-if="filter"
								class="search_select_type"
								:style="`margin-left:10px; max-width:${filter.long ? 300 : 130}px; width:${filter.long ? 300 : 130}px;`"
							>
								<!-- <selectBox :sel="filter.sel" class="searchSel" @change="addFilter(table)"></selectBox> -->
								<selectBox :sel="filter" class="searchSel" @change="change_filter(index, filter)"></selectBox>
							</div>
						</v-layout>
					</v-layout>
					<v-layout align-center justify-end class="mb-1">
						<v-btn class="customer-management-btn" @click="apply_filter()">
							필터적용
						</v-btn>
					</v-layout>
				</v-flex>
			</v-layout>

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12>
					<datatable
						:search="search_project"
						:datatable="table.datatable"
						class="tbl-type01"
						:detailClick="detailClick"
						excelUseYn="true"
						excelTextYn="true"
						excelType="event_customer"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>
		<button id="refresh-event" @click="refresh" style="display:none;"></button>
		<!-- 사용자 생성/수정 alert ------ start -->
		<eventCustomer :setdialog="detail_dialog" />
		<!-- 사용자 생성/수정 alert ------ end -->
	</div>
</template>

<script>
import { datatable, selectBox, txtField, DatepickerDialog, eventCustomer } from '@/components/index.js'
import location1 from '../../../utils/location1'
import location2 from '../../../utils/location2'
export default {
	components: { datatable, selectBox, txtField, DatepickerDialog, eventCustomer },
	data() {
		return {
			businessId: '',
			eventId: '',
			first: true,
			code: null,
			dateChice: true,
			datedisable: true,
			surveySel_project: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: [],
				fullItem: [],
				outlined: true,
				filter: true,
				label: '',
				returnObject: true,
				itemText: 'title',
			},
			// --- 데이터 테이블 데이터 --``
			table: {
				datatable: {
					headers: [
						{ text: '이벤트명', value: 'eventTitle', width: '15%' },
						{ text: '고객명', value: 'name' },
						{ text: '휴대전화번호', value: 'phone' },
						{ text: '참여일시', value: 'created_at' },
						{ text: '상품명', value: 'winnterProduct' },
						{ text: '상품수령여부', value: 'receipt' },
						{ text: '수령일시', value: 'receiptDate' },
						{ text: '비고', align: 'center', value: 'etc_detail' },
					],
					items: [],
					hidedefaultfooter: false,
					noweditting: '',
					// title: x.name,
					onlyAgree: false,
					all_items: [],
					// inputboxId: x.id,
				},
				filter: [],
				json_fields: {},
			},
			counselors: {},
			// 날짜/검색 데이터
			searchsel: { value: '오늘', errorMessage: '', hideDetail: true, items: ['오늘', '이번 주', '이번 달'], outlined: true },

			search_project: '',

			termStartpicker: {
				// datePicker
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},

			termEndpicker: {
				// datePicker
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},

			// --- 삭제 모달 ---
			alertModal: {
				dialog: false,
				text: '정말로 지우시겠습니까?',
			},
			alertModal2: {
				dialog: false,
				text: '',
			},
			reserveUsersInfo: {
				dialog: false,
				reserveList: [],
				datatable: {
					headers: [],
					items: [],
				},
				name: '',
				phone: '',
				json_fields: {},
			},
			// --- 수정, 등록 모달 ---

			/// 엑셀 저장
			json_fields: {},
			addStat: [],
			// --- 숨김 버튼 ---

			hideDisagree: {
				class: '',
				dark: true,
				color: this.$store.state.PointColor2,
				width: '',
			},

			// 검색
			search: {
				placeholder: '검색어를 입력해주세요.',
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
			searchPhone: '',
			searchName: '',
			searchBtn: {
				class: '',
				dark: true,
				color: this.$store.state.PointColor2,
				height: 40,
			},

			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			waitingsItem: [], // 알림톡 데이터 테이블 items
			groups: [], // 그룹지 셀렉트박스를 위한 그룹지 데이터 저장
			inputboxTitles: [], // 그룹코드 별 inputbox item
			surveySel: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: [],
				fullItem: [],
				outlined: true,
				filter: true,
				label: '',
				returnObject: true,
				itemText: 'title',
			}, // 설문 selctbox
			// 마케팅 필터
			prevfilter: [
				{
					check: {
						value: '',
						label: '상담사',
						class: 'filterCheckBox',
						color: '',
						onicon: 'mdi-check-circle',
						officon: 'mdi-check-circle-outline',
					},
					sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true, itemCode: 'counselorid', disable: true },
				},
				{
					check: {
						value: '',
						label: '호응도',
						class: 'filterCheckBox',
						color: '',
						onicon: 'mdi-check-circle',
						officon: 'mdi-check-circle-outline',
					},
					sel: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						items: ['S', 'A', 'B', 'C', 'D'],
						itemCode: 'custlike',
						outlined: true,
						disable: true,
					},
				},
			],

			filter_boxes: [
				{ value: '전체', errorMessage: '', hideDetail: true, items: ['전체'], fullItem: [], outlined: true, title: '상품명' },
				{
					value: '전체',
					errorMessage: '',
					hideDetail: true,
					items: ['전체', '수령', '미수령'],
					fullItem: [],
					outlined: true,
					title: '상품 수령여부',
				},
				{
					value: '전체',
					errorMessage: '',
					hideDetail: true,
					items: ['전체', '동의', '미동의'],
					fullItem: [],
					outlined: true,
					title: '수신 동의',
				},
			],
			detail_dialog: {
				// 수정 다이어로그
				dialog: false,
				title: '고객 상세 보기',
				edit: false,
				editData: {},
				inputBoxDisable: true,
				groupcode: '',
				name: '',
				group: '',
			},
		}
	},
	async created() {
		this.$store.state.loading = true
		this.$store.state.loading = false
		this.events()
	},
	methods: {
		refresh() {
			this.getTableData(this.surveySel.value)
		},
		async search_reservedays() {
			this.$store.state.loading = true

			this.first = true
			const data = {
				business: this.surveySel_project.value.id,
				type: 'd',
			}
			await this.$store.dispatch('events', data).then(res => {
				this.surveySel.items = res.data.events
				if (res.data.events.length > 0) {
					this.surveySel.value = res.data.events[0]
					this.getTableData(res.data.events[0])
				} else {
					this.surveySel.value = null
					this.table.datatable.businessId = this.surveySel_project.value.id
					this.table.datatable.eventId = ''
					this.table.datatable.items = []
				}
				if (res.data.events.length > 0) {
					this.filter_boxes[0].items = res.data.events[0].priceList.map(x => x.product)
				}
				this.filter_boxes[0].items.unshift('전체')
				this.$store.state.loading = false
			})
		},
		async events() {
			this.$store.state.loading = true

			const input = {
				show: true,
			}

			await this.$store.dispatch('businesses', input).then(resData => {
				if (resData.data.businesses.length > 0) {
					this.surveySel_project.items = resData.data.businesses
					this.surveySel_project.value = resData.data.businesses[0]
					this.businessId = resData.data.businesses[0].id
					this.$store.dispatch('events', { business: resData.data.businesses[0].id }).then(res => {
						this.surveySel.items = res.data.events
						if (res.data.events.length > 0) {
							this.eventId = res.data.events[0].id
							this.surveySel.value = res.data.events[0]
							this.getTableData(res.data.events[0])
							this.filter_boxes[0].items = res.data.events[0].priceList.map(x => x.product)
						} else {
							this.surveySel.value = null
							this.table.datatable.items = []
						}
						this.filter_boxes[0].items.unshift('전체')
						this.$store.state.loading = false
					})
				} else this.$store.state.loading = false
			})
		},

		async getTableData() {
			this.$store.state.loading = true
			this.termStartpicker.menu = false
			this.termEndpicker.menu = false

			let headers = [
				{ text: '이벤트명', value: 'eventTitle', width: '15%' },
				{ text: '고객명', value: 'name' },
				{ text: '휴대전화번호', value: 'phone' },
				{ text: '참여일시', value: 'created_at' },
				{ text: '상품명', value: 'winnterProduct' },
				{ text: '상품수령여부', value: 'receipt' },
				{ text: '수령일시', value: 'receiptDate' },
				{ text: '비고', align: 'center', value: 'etc_detail' },
			]

			let tableItems = {}
			let fiterItem = []
			let exportField = {
				'사업지 코드': 'groupcode',
				사업지명: 'title',
				고객명: 'name',
				전화번호: 'phone',
				상담신청일시: 'rdate1',
				개인정보수집동의: 'ispersonal1',
				'이미지 첨부': 'imgUpload',
				상담사: 'counselorid',
				고객성향: 'custlike',
				고객특징: 'recomand',
				고객태그: 'commentTag',
				상담처리: 'addStat',
			}

			// reserveuser 호출
			let data = {}
			if (this.surveySel.value === null) {
				return (this.$store.state.loading = false)
			} else if (this.first) {
				data = {
					code: this.surveySel.value.code,
				}
			} else {
				data = {
					sdate:
						this.$moment(this.termStartpicker.date)
							.subtract(1, 'd')
							.format('YYYY-MM-DD') + 'T15:00:00.000Z',
					edate: this.termEndpicker.date + 'T15:00:00.000Z',
					code: this.surveySel.value.code,
				}
			}
			await this.$store.dispatch('customer_event_reserveusers', data).then(res => {
				let data = res.data.eventJoins
				data.forEach(el => {
					el.created_at = this.$moment(el.created_at).format('YYYY-MM-DD HH:MM:ss')
					el['personalInformation_text'] = el.personalInformation ? '동의' : '미동의'
					if (el.receipt !== '수령') {
						el.receiptDate = null
					}
					if (!el.winner) {
						el.receipt = '미당첨'
					}
				})
				tableItems = {
					datatable: {
						headers: headers,
						items: data,
						hidedefaultfooter: false,
						noweditting: '',
						onlyAgree: false,
						all_items: JSON.parse(JSON.stringify(data)),
					},
					filter: fiterItem,
					json_fields: exportField,
				}
				tableItems.datatable['eventId'] = this.eventId
				tableItems.datatable['businessId'] = this.businessId
				this.table = tableItems

				this.$store.state.loading = false
			})
		},
		changeTypeText(data) {
			if (data === 11) {
				return 'checkbox'
			} else if (data === 10 || data === 12) {
				return 'checkone'
			} else if (data === 20) {
				return 'textfiled'
			}
		},
		changeSel() {
			this.searchName = ''
			this.searchPhone = ''
		},

		// 셀렉트

		// 셀렉트 박스 선택된 값 테이블 적용

		async setdate() {
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			this.termStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
		},

		termCustomer(val) {
			let start = this.$moment(this.termStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.termStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
		selectDays() {
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
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
				this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '어제') {
				this.termStartpicker.date = this.$moment()
					.subtract(1, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '이번 주') {
				this.termStartpicker.date = this.$moment()
					.subtract(date, 'day')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '지난 주') {
				this.termStartpicker.date = this.$moment()
					.subtract(date + 7, 'day')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment()
					.subtract(date + 1, 'day')
					.format('YYYY-MM-DD')
			} else if (this.searchsel.value === '최근 7일') {
				this.termStartpicker.date = this.$moment()
					.subtract(7, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '최근 14일') {
				this.termStartpicker.date = this.$moment()
					.subtract(14, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '최근 30일') {
				this.termStartpicker.date = this.$moment()
					.subtract(30, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '이번 달') {
				this.termStartpicker.date = this.$moment()
					.subtract(Number(this.$moment().format('DD')) - 1, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '지난 달') {
				this.termStartpicker.date = this.$moment()
					.subtract(1, 'm')
					.startOf('month')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment()
					.subtract(1, 'm')
					.endOf('month')
					.format('YYYY-MM-DD')
			} else if (this.searchsel.value === '전체') {
				this.termStartpicker.date = ''
				this.termEndpicker.date = ''
			}
		},

		detailClick(item) {
			// 데이터 테이블 - 자세히보기 클릭
			this.detail_dialog.dialog = true
			this.detail_dialog.title = '고객 상세 보기'
			this.detail_dialog.edit = true
			this.detail_dialog.editData = item
			if (item.locationData) {
				this.$store.state.searchsel_city2.items = location1[item.locationData.split('_')[0]].sort()
				this.$store.state.searchsel_city3.items = location2[item.locationData.split('_')[0]][item.locationData.split('_')[1]].sort()
				this.$store.state.searchsel_city1.value = item.locationData.split('_')[0]
				this.$store.state.searchsel_city2.value = item.locationData.split('_')[1]
				this.$store.state.searchsel_city3.value = item.locationData.split('_')[2]
			} else {
				this.$store.state.searchsel_city2.items = location1['서울특별시'].sort()
				this.$store.state.searchsel_city3.items = location2['서울특별시']['강남구'].sort()
			}
		},

		select_type() {
			this.search_project = ''
		},
		change_filter(index, filter) {
			// 이벤트 필터 변경 시 상품명 필터 설정
			if (index === 0) {
				let fullItem_index = filter.fullItem.findIndex(el => el.id === filter.value)
				if (fullItem_index > -1 && filter.fullItem[fullItem_index].priceList) {
					let prices = ['전체']
					filter.fullItem[fullItem_index].priceList.forEach(el => {
						prices.push(el.product)
					})
					this.filter_boxes[1].items = prices
					this.filter_boxes[1].value = prices[0]
				}
			}
		},
		apply_filter() {
			let filterd_item = JSON.parse(JSON.stringify(this.table.datatable.all_items))
			if (this.filter_boxes[0].value !== '전체') {
				// 상품명 필터
				filterd_item = filterd_item.filter(el => el.winnterProduct === this.filter_boxes[0].value)
			}

			if (this.filter_boxes[1].value !== '전체') {
				// 수령여부 필터
				filterd_item = filterd_item.filter(el => el.receipt === this.filter_boxes[1].value)
			}

			if (this.filter_boxes[2].value !== '전체') {
				// 수신도의 필터
				if (this.filter_boxes[2].value === '동의') {
					filterd_item = filterd_item.filter(el => el.ispersonal === 1)
				} else {
					filterd_item = filterd_item.filter(el => el.ispersonal === 2)
				}
			}

			this.table.datatable.items = filterd_item
		},
	},
}
</script>
<style lang="scss" scoped>
.wrapper {
	margin: 0px !important;
}
</style>
<style lang="scss">
.surveyChoice {
	font-size: 18px;
	font-weight: bold;
	margin-right: 10px;
}
.surveyTitle {
	font-size: 18px;
	font-weight: bold;
	margin-top: 20px;
}

.filterFlex {
	padding: 20px 20px 58px 0px;
}
.filterBox {
	background: white;
	height: 100%;
	border: 2px solid #e1e1e1;
	border-radius: 5px;
}
.filterHead {
	margin: 0px !important;
	padding: 14px;
	border-bottom: 1.5px solid #e1e1e1;
}
.filterLayout {
	padding: 14.8px;
	// border-bottom: 1.5px solid #e1e1e1;`
}
.checkboxLinebreak {
	line-break: anywhere;
}
.qaLists-dialog {
	opacity: 0;
	width: 100%;
	background-color: white !important;
}
.search_box_type {
	width: auto !important;
	height: 26px !important;
	margin-right: 10px !important;
	padding: 0 10px !important;
	font-size: 13px;
	font-weight: bold;
	.v-btn__content {
		color: #fff;
	}
}
//검색 박스
.search_box_type {
	width: 193px;
	margin-left: 10px;
	div {
		div {
			.v-input__slot {
				min-height: 26px !important;
				height: 26px;
				padding: 0 10px !important;
			}
		}
	}
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
.customer-management-text {
	font-size: 12px;
	font-weight: bold;
	width: auto;
	color: #204037;
}
.customer-management-btn {
	box-shadow: none;
	border: 1px solid #c5c3d5;
	width: 88px;
	height: 26px !important;
	background-color: #f3f3ff !important;
	.v-btn__content {
		color: #323153;
		font-size: 13px;
	}
}
</style>
