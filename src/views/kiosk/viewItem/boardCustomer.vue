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
								class="searchSel"
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
							<DatepickerDialog :picker="termEndpicker" :allowed_dates="termCustomer"> </DatepickerDialog>
						</v-flex>
						<v-flex class="search_select ml-4" style="width:120px !important; max-width:120px !important;">
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
			<v-layout align-center class="filter_search mt-4" style="min-height:50px !important; height:auto !important; padding: 4px 0px;">
				<v-flex xs12 class="px-4">
					<v-layout wrap>
						<v-flex xs4 class="mt-4">
							<v-layout align-center>
								<div class="customer-management-text" style="min-width:100px; width:auto; text-align:center;">
									수집그룹
								</div>
								<div xs12 class="search_select_type" style="margin-left:10px; width:100%;">
									<selectBox :sel="getGroup" class="searchSel"></selectBox>
								</div>
							</v-layout>
						</v-flex>
						<v-flex xs4 v-for="(filter, index) in table.filter" :key="index" class="mt-4">
							<v-layout align-center>
								<div class="customer-management-text" style="min-width:100px; width:auto; text-align:center;">
									{{ filter.check.label }}
								</div>
								<div xs12 v-if="filter.sel" class="search_select_type" style="margin-left:10px; width:100%;">
									<selectBox :sel="filter.sel" class="searchSel"></selectBox>
								</div>
								<div xs12 v-else-if="filter.tag" class="search_select_type" style="margin-left:10px; max-width:130px; width:130px;">
									<v-layout>
										<v-flex class="search_select_type" style="min-width:130px; max-width:130px">
											<selectBox :sel="searchsel_city1" class="searchSel" @change="loc_firstSelect"></selectBox>
										</v-flex>
										<v-flex class="search_select_type ml-1" style="min-width:130px; max-width:130px">
											<selectBox :sel="searchsel_city2" class="searchSel" @change="loc_twoSelect"></selectBox>
										</v-flex>
										<v-flex class="search_select_type ml-1" style="min-width:130px; max-width:130px">
											<selectBox :sel="searchsel_city3" class="searchSel"></selectBox>
										</v-flex>
									</v-layout>
								</div>
							</v-layout>
						</v-flex>
					</v-layout>
					<v-layout align-center justify-end class="mb-1">
						<v-btn class="customer-management-btn" @click="addFilter(table)">
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
						excelType="campaign_customer"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>
		<button id="refresh-cam" @click="refresh" style="display:none;"></button>
		<campaignCustomer :setdialog="detail_dialog" />
	</div>
</template>

<script>
import { datatable, selectBox, txtField, DatepickerDialog, campaignCustomer } from '@/components/index.js'
import location1 from '../../../utils/location1'
import location2 from '../../../utils/location2'
export default {
	components: {
		datatable,
		selectBox,
		txtField,
		DatepickerDialog,
		campaignCustomer,
	},
	data() {
		return {
			tableData: [],
			businessId: '',
			reservedayId: '',
			dateChice: true,
			datedisable: true,
			// --- 데이터 테이블 데이터 --``
			getGroup: {
				value: null,
				clearable: true,
				errorMessage: '',
				hideDetail: true,
				items: [],
				itmeCode: '',
				returnObject: true,
				itemText: 'title',
				outlined: true,
				disable: true,
			},
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
			table: {
				datatable: {
					headers: [
						{ text: '거점 홍보명', value: 'title', width: '20%' },
						{ text: '고객명', value: 'name', width: '13%' },
						{ text: '휴대전화번호', value: 'phone', width: '13%' },
						{ text: '참여일시', value: 'created_at_time', width: '13%' },
						{ text: '수집그룹', value: 'reserveGroupCode' },
						{
							text: '비고',
							align: 'center',
							value: 'etc_detail',
							width: '10%',
						},
					],
					items: [],
					hidedefaultfooter: false,
					noweditting: '',
					// title: x.name,
					onlyAgree: false,
					// inputboxId: x.id,
				},
				filter: [],
				json_fields: {},
			},

			// 날짜/검색 데이터
			searchsel: {
				value: '오늘',
				errorMessage: '',
				hideDetail: true,
				items: ['오늘', '이번 주', '이번 달'],
				outlined: true,
			},
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
			},
			searchsel_type: {
				value: '이름',
				errorMessage: '',
				hideDetail: true,
				items: ['이름', '연락처'],
				outlined: true,
			},

			search_project: '',
			search: {
				placeholder: '검색어를 입력해주세요.',
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},

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

			addBtn: {
				// 추가 버튼
				dark: true,
				width: 100,
			},

			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			filter: [],
			filterChecks: {
				label: '몰라!',
				onicon: 'mdi-check-circle',
				officon: 'mdi-check-circle-outline',
			},
			sel1: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			reservedaysData: {},
			imgInfo: false,
			alertModal1: {
				dialog: false,
				text: '',
				btnText: 'send',
			},
			alertModal: {
				dialog: false,
				text: '',
				btnText: 'ok',
				sel: {
					class: 'qrSelectBox',
					value: '',
					errorMessage: '',
					hideDetail: true,
					items: [],
					outlined: true,
				},
				disabled: false,
			},

			// --- 삭제 모달 ---
			alertModal3: {
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
			editmodal: {
				dialog: false,
				title: '등록고객 수정',
				imgFile: '',
				items: [
					{
						title: '사업지 코드',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							disable: true,
						},
						essential: true,
					},
					{
						title: '고객명',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
						},
						essential: true,
					},
					{
						title: '전화번호',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							onlyNumber: true,
						},
						essential: true,
					},
					{
						title: '등록일시',
						value: '',
						picker: {
							date: '',
							errorMessage: '',
							hideDetail: false,
							class: 'txtField',
						},
					},
					{
						title: '시작일',
						value: '',
						picker: {
							date: '',
							errorMessage: '',
							hideDetail: false,
							class: 'txtField',
						},
						essential: true,
					},
					{
						title: '종료일',
						value: '',
						picker: {
							date: '',
							errorMessage: '',
							hideDetail: false,
							class: 'txtField',
						},
						essential: true,
					},
					{
						title: '동행인',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							onlyNumber: true,
						},
					},
					{
						title: '개인정보수집동의',
						sel: {
							value: '',
							errorMessage: '',
							hideDetail: false,
							items: ['Y', 'N'],
							outlined: true,
						},
					},
					{
						title: '마케팅활용동의',
						sel: {
							value: '',
							errorMessage: '',
							hideDetail: false,
							items: ['Y', 'N'],
							outlined: true,
						},
					},
					{
						title: '카테고리',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
						},
					},
				],
			},
			/// 엑셀 저장
			json_fields: {},
			// --- 숨김 버튼 ---
			hideDisagree: {
				class: '',
				dark: true,
				color: '',
				width: '',
			},
			// 검색

			searchPhone: '',
			searchName: '',
			searchBtn: {
				class: '',
				dark: true,
				color: this.$store.state.PointColor2,
				height: 40,
			},
			reserveusersItem: [], // 알림톡 데이터 테이블 items
			groups: [], // 그룹지 셀렉트박스를 위한 그룹지 데이터 저장
			inputboxTitles: [], // 그룹코드 별 inputbox item

			marketingCheck: {
				value: '',
				label: '마케팅활용',
				class: 'filterCheckBox',
				color: '',
				onicon: 'mdi-check-circle',
				officon: 'mdi-check-circle-outline',
			},
			marketingSel: { value: '', errorMessage: '', hideDetail: true, items: ['동의', '미동의'], outlined: true, disable: true },
			reservedaysSet: [],
			QRreserveusersDatas: [],
			detail_dialog: {
				dialog: false,
				title: '고객 상세 보기',
				edit: false,
				editData: {},
				inputBoxDisable: true,
				name: '',
				group: '',
				filter: [],
				code_object: [],
			},
			first: true,
			searchsel_city1: {
				clearable: true,
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
			},
			searchsel_city2: {
				value: '',
				clearable: true,
				disabled: true,
				errorMessage: '',
				hideDetail: true,
				items: [],
				outlined: true,
				filter: true,
				class: 'small_font bizInput',
			},
			searchsel_city3: {
				value: '',
				clearable: true,
				disabled: true,
				errorMessage: '',
				disable: false,
				hideDetail: true,
				items: [],
				outlined: true,
				filter: true,
				class: 'small_font bizInput',
			},
		}
	},
	async created() {
		this.reservedays()
		this.searchsel_city1.value = ''
		this.searchsel_city2.value = ''
		this.searchsel_city3.value = ''
	},
	computed: {},
	methods: {
		loc_firstSelect(val) {
			this.searchsel_city2.items = location1[val].sort()
			this.searchsel_city2.value = ''
			this.searchsel_city3.value = ''
		},
		loc_twoSelect(val) {
			this.searchsel_city3.value = ''
			this.searchsel_city3.items = location2[this.searchsel_city1.value][val].sort()
		},
		refresh() {
			this.getTableData(this.surveySel.value)
		},
		async search_reservedays() {
			this.$store.state.loading = true

			this.first = true
			const data = {
				business: this.surveySel_project.value.id,
				type: 'c',
			}
			await this.$store.dispatch('reservedays', data).then(res => {
				this.surveySel.items = res.data.reservedays
				if (res.data.reservedays.length > 0) {
					this.surveySel.value = res.data.reservedays[0]
					this.getTableData(res.data.reservedays[0])
				} else {
					this.surveySel.value = null
					this.table.datatable.businessId = this.surveySel_project.value.id
					this.table.datatable.reservedayId = ''
					this.table.datatable.items = []
				}
				this.$store.state.loading = false
			})
		},

		async getTableData(val) {
			this.dateChice = false
			this.$store.state.loading = true
			this.termStartpicker.menu = false
			this.termEndpicker.menu = false
			let headers

			// 기존 셋팅
			headers = [
				{ text: '거점 홍보명', value: 'title', width: '20%' },
				{ text: '고객명', value: 'name', width: '13%' },
				{ text: '휴대전화번호', value: 'phone', width: '13%' },
				{ text: '참여일시', value: 'created_at_time', width: '13%' },
				{ text: '수집그룹', value: 'reserveGroupCode' },
				{ text: '비고', align: 'center', value: 'etc_detail', width: '10%' },
			]

			let tableItems = {}
			let fiterItem = []
			let exportField = {
				사업지명: 'title',
				고객명: 'name',
				전화번호: 'phone',
				예약일시: 'rdate1',
				등록일시: 'updated_at',
				개인정보수집동의: 'ispersonal1',
				상태: 'status1',
				'이미지 첨부': 'imgUpload',
			}
			// /마케팅 체크박스 리셋
			this.marketingCheck = {
				value: '',
				label: '마케팅활용',
				class: 'filterCheckBox',
				color: '',
				onicon: 'mdi-check-circle',
				officon: 'mdi-check-circle-outline',
			}
			this.marketingSel = {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: ['동의', '미동의'],
				outlined: true,
				disable: true,
			}
			// reserveuser 호출
			let data
			if (this.surveySel.value === null) {
				return (this.$store.state.loading = false)
			} else if (this.first) {
				data = {
					code: this.surveySel.value.code,
				}
				this.first = false
			} else {
				data = {
					rsdate:
						this.$moment(this.termStartpicker.date)
							.subtract(1, 'd')
							.format('YYYY-MM-DD') + 'T15:00:00.000Z',
					redate: this.termEndpicker.date + 'T15:00:00.000Z',
					code: this.surveySel.value.code,
				}
			}
			data.type = 'c'
			await this.$store.dispatch('customer_campagin_reserveusers', data).then(res => {
				this.reserveusersItem = res.data.reserveusers.filter(e => {
					return e.status !== 99
				})
				this.reserveusersItem.forEach(element => {
					element.groupData = this.surveySel.value.reserveday_groups
					if (element.updated_at) {
						element.updated_at = this.$moment(element.updated_at).format('YYYY-MM-DD HH:mm:ss')
					}
				})
				if (val.input_box) {
					val.input_box.categories.forEach(a => {
						let check = {
							value: '',
							label: '',
							class: 'filterCheckBox',
							color: this.$store.state.PointColor1,
							onicon: 'mdi-check-circle',
							officon: 'mdi-check-circle-outline',
						}
						let sel = {
							value: '',
							clearable: true,
							errorMessage: '',
							hideDetail: true,
							items: [],
							itmeCode: '',
							outlined: true,
							disable: true,
						}
						if (a.stat === 1) {
							if (a.type === 11) {
								check.label = a.codename
								a.category_details.forEach(detail => {
									sel.items.push(detail.detailname)
									sel.itemCode = detail.code
								})
								fiterItem.push({ check, sel })
							} else if (a.type === 10) {
								check.label = a.codename
								a.category_details.forEach(detail => {
									sel.items.push(detail.detailname)
									sel.itemCode = detail.code
								})
								fiterItem.push({ check, sel })
							} else if (a.type === 12) {
								check.label = a.codename
								a.category_details.forEach(detail => {
									sel.items.push(detail.detailname)
									sel.itemCode = detail.code
								})
								fiterItem.push({ check, sel })
							} else if (a.tag === 'location') {
								check.label = a.codename
								fiterItem.push({ tag: 'location', check })
							}
						}
					})
					tableItems = {
						datatable: {
							headers: headers,
							items: this.reserveusersItem,
							hidedefaultfooter: false,
							noweditting: '',
							title: val.input_box.name,
							onlyAgree: false,
							// inputboxId: x.id,
						},
						filter: fiterItem,
						json_fields: exportField,
					}
					this.tableData = JSON.parse(JSON.stringify(this.reserveusersItem))
					tableItems.datatable['reservedayId'] = this.reservedayId
					tableItems.datatable['businessId'] = this.businessId
					this.table = tableItems
				} else {
					tableItems = {
						datatable: {
							headers: headers,
							items: [],
							hidedefaultfooter: false,
							noweditting: '',
							title: '',
							onlyAgree: false,
							// inputboxId: x.id,
						},
						filter: fiterItem,
						json_fields: exportField,
					}
					this.tableData = []
					tableItems.datatable['reservedayId'] = this.reservedayId
					tableItems.datatable['businessId'] = this.businessId
					this.table = tableItems
				}
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
		async reservedays() {
			this.$store.state.loading = true
			const input = {
				show: true,
			}

			await this.$store.dispatch('businesses', input).then(async resData => {
				if (resData.data.businesses.length > 0) {
					await this.$store.dispatch('reservedayGroups', {}).then(resData2 => {
						resData2.data.reservedayGroups.unshift({ title: '전체' })
						this.getGroup.items = resData2.data.reservedayGroups
					})
					this.surveySel_project.items = resData.data.businesses
					this.surveySel_project.value = resData.data.businesses[0]
					this.businessId = resData.data.businesses[0].id
					const data = {
						business: resData.data.businesses[0].id,
						type: 'c',
					}
					this.$store.dispatch('reservedays', data).then(res => {
						this.surveySel.items = res.data.reservedays
						if (res.data.reservedays.length > 0) {
							this.reservedayId = res.data.reservedays[0].id
							this.surveySel.value = res.data.reservedays[0]
							this.getTableData(res.data.reservedays[0])
						} else {
							this.surveySel.value = null
							this.table.datatable.items = []
						}

						this.$store.state.loading = false
					})
				} else this.$store.state.loading = false
			})
		},

		addFilter(table) {
			// 필터 값 추가
			let result = this.tableData
			table.filter.forEach(e => {
				if (e.sel) {
					if (e.sel.value) {
						result = result.filter(item => {
							for (let index = 0; index < item.userData.length; index++) {
								if (item.userData[index].type === 10) {
									if (item.userData[index].value) {
										if (e.sel.value === item.userData[index].value) {
											return true
										}
									}
								} else if (item.userData[index].type === 11) {
									if (item.userData[index].value) {
										if (item.userData[index].value.indexOf(',') > -1) {
											if (item.userData[index].value.split(',').indexOf(e.sel.value) > -1) {
												return true
											}
										} else {
											if (e.sel.value === item.userData[index].value) {
												return true
											}
										}
									}
								}
							}
						})
					}
				} else {
					if (this.searchsel_city3.value) {
						result = result.filter(item => {
							if (
								item.locationData.indexOf(
									this.searchsel_city1.value + '_' + this.searchsel_city2.value + '_' + this.searchsel_city3.value,
								) > -1
							)
								return true
						})
					} else if (this.searchsel_city2.value) {
						result = result.filter(item => {
							if (item.locationData.indexOf(this.searchsel_city1.value + '_' + this.searchsel_city2.value) > -1) {
								return true
							}
						})
					} else {
						result = result.filter(item => {
							if (item.locationData.indexOf(this.searchsel_city1.value) > -1) {
								return true
							}
						})
					}
					console.log(1)
				}
			})
			if (this.getGroup.value !== null) {
				if (this.getGroup.value.title !== '전체') {
					result = result.filter(x => x.reserveGroupCode === this.getGroup.value.qrcode)
				}
			}
			table.datatable.items = result
		},

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
			this.detail_dialog.filter = this.table.filter
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
