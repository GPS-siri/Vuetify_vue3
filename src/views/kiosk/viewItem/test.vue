<template>
	<div>
		<!-- <breadcrumbs title="상담고객 관리" :pageNavi="[{ text: 'HOME' }, { text: 'CONTROL' }, { text: 'Customer' }]"></breadcrumbs> -->
		<div class="wrapper">
			<v-layout wrap align-center class="pt-5">
				<v-flex lg3 md4 sm6 xs12 offset-lg9 offset-md8 offset-sm6>
					<selectBox v-if="sel.items != []" :sel="surveySel" @change="getTableData" />
				</v-flex>
			</v-layout>
			<!-- --- 등록 버튼 --- -->
			<v-layout wrap class="mt-5" align-baseline>
				<!-- 날짜 선택  -->
				<span class="mr-10" :class="$vuetify.breakpoint.smAndDown ? 'my-5' : ''">| 상담고객 현황 </span>
				<v-flex lg2 md3 sm12 xs12
					><DatepickerRange
						:picker="termStartpicker"
						:disable="dateChice"
						:disabledata="disabledata"
						@input="termStartpicker.menu = false"
					></DatepickerRange
				></v-flex>
				<span class="mx-3"> ~ </span>
				<v-flex lg2 md3 sm12 xs12
					><DatepickerRange
						:picker="termEndpicker"
						:disable="dateChice"
						:disabledata="disabledata"
						:allowed_dates="termCustomer"
						@input="getTableData(sel.value)"
					></DatepickerRange
				></v-flex>
				<!-- <v-spacer /> -->
				<!-- groupcode 셀렉트박스 -->
				<!-- <v-flex xs2 v-if="$store.state.meData.role.name !== 'partner'">
					<selectBox v-if="sel.items != []" :sel="sel" @change="applyTable"
				/></v-flex> -->
			</v-layout>
			<!-- --- 데이터 테이블 --- -->
			<v-layout wrap>
				<v-flex lg2 xs12 class="my-4 filterFlex">
					<div class="filterBox">
						<v-layout wrap class="filterHead">
							<div style="align-self:center; font-size: 14px; font-weight: bold;">
								항목 선택
							</div>
							<v-spacer />
							<btn :btn="hideDisagree" @click="clickExport(table)" :style="`background-color:${$store.state.PointColor2}`" btn_txt="Excel">
							</btn>
							<!-- 마케팅, 상담사, 유형 필터-->
							<v-flex xs12 v-show="table.filter.length > 0" v-for="(filter, idx) in prevfilter" :key="idx" style="padding-top:14px">
								<v-flex xs12 class="mb-2">
									<checkBox
										:check="filter.check"
										:color="$store.state.PointColor1"
										@click="selAble(filter, table)"
										class="checkboxLinebreak"
									></checkBox>
								</v-flex>
								<v-flex xs12 v-if="table.filter.length > 0">
									<selectBox3 :sel="filter.sel" :disable="filter.sel.disable" @change="addFilter(table)"></selectBox3>
								</v-flex>
							</v-flex>
						</v-layout>
						<!-- 선택지 별 필터 -->
						<v-layout wrap class="filterLayout" v-for="(filter, index) in table.filter" :key="index">
							<v-flex xs12 class="mb-2">
								<checkBox :check="filter.check" @click="selAble(filter, table)" class="checkboxLinebreak"></checkBox>
							</v-flex>
							<v-flex xs12 v-if="filter.sel">
								<selectBox3 :sel="filter.sel" :disable="filter.sel.disable" @change="addFilter(table)"></selectBox3>
							</v-flex>
						</v-layout>
					</div>
				</v-flex>
				<!-- 테이블 -->
				<v-flex lg10 xs12>
					<!-- 검색창 -->
					<v-layout wrap justify-end class="py-5">
						<v-flex lg2 md2 sm3 xs12>
							<selectBox :sel="searchsel" @change="changeSel" :class="$vuetify.breakpoint.xs ? 'mb-5' : 'searchSel'"></selectBox>
						</v-flex>
						<v-flex lg3 md3 sm4 xs12>
							<txtField v-model="searchName" :txtField="search" v-if="searchsel.value === '이름'" @enter="getTableData()"></txtField>
							<txtField v-model="searchPhone" :txtField="search" v-if="searchsel.value === '전화번호'" @enter="getTableData()"></txtField>
						</v-flex>
						<btn :btn="searchBtn" btn_txt="search" @click="getTableData()" :class="$vuetify.breakpoint.xs ? 'mt-5' : 'ml-3'"></btn>
					</v-layout>
					<!-- 데이터테이블 -->
					<datatable
						:datatable="table.datatable"
						class="tbl-type01"
						:clickDeleteBtn="clickDeleteBtn"
						:clickName="clickName"
						:imgDialogShow="imgDialogShow"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 엑셀 저장 버튼 --- -->
			<v-layout class="my-3" align-center>
				<download-excel
					class="btn btn-default"
					:id="table.datatable.waitingtitle"
					:data="addStat"
					style="display:none"
					:fields="table.json_fields"
					type="text/csv;charset=utf8"
					worksheet="My Worksheet"
					:name="termStartpicker.date + ' ~ ' + termEndpicker.date + '_' + table.datatable.waitingtitle + '_' + ' 기간별 상담고객 현황'"
				>
				</download-excel>
			</v-layout>
		</div>

		<alertModal :setdialog="alertModal" :clickDeleteBtnModal="deleteAccount" />
		<alertModal2 :setdialog="alertModal2" />
		<alertModal3 :setdialog="reserveUsersInfo" :userExport="userExport" type="waiting" />
		<!-- 히스토리 excel export -->
		<download-excel
			class="btn btn-default"
			:id="reserveUsersInfo.phone"
			:data="reserveUsersInfo.datatable.items"
			style="display:none"
			:fields="reserveUsersInfo.json_fields"
			type="text/csv;charset=utf8"
			worksheet="My Worksheet"
			:name="reserveUsersInfo.name + '_' + reserveUsersInfo.phone"
		>
		</download-excel>
	</div>
</template>

<script>
import {
	datatable,
	alertModal,
	selectBox,
	selectBox3,
	checkBox,
	alertModal2,
	alertModal3,
	DatepickerRange,
	btn,
	txtField,
} from '@/components/index.js'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		downloadExcel,
		datatable,
		alertModal,
		selectBox,
		selectBox3,
		alertModal2,
		alertModal3,
		checkBox,
		DatepickerRange,
		btn,
		txtField,
	},
	data() {
		return {
			termStartpicker: {
				menu: false,
				date: '',
				errorMessage: '',
				class: 'whiteBack',
			},
			termEndpicker: {
				menu: false,
				date: '',
				errorMessage: '',
				class: 'whiteBack',
			},
			code: null,
			dateChice: true,
			datedisable: true,
			// --- 데이터 테이블 데이터 --``
			table: {
				datatable: {
					// headers: headers,
					// items: result,
					hidedefaultfooter: false,
					noweditting: '',
					// title: x.name,
					onlyAgree: false,
					// inputboxId: x.id,
				},
				filter: [],
				json_fields: {},
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
				placeholder: '검색',
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
			searchsel: { value: '이름', errorMessage: '', hideDetail: true, items: ['이름', '전화번호'], outlined: true },

			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			waitingsItem: [], // 알림톡 데이터 테이블 items
			groups: [], // 그룹지 셀렉트박스를 위한 그룹지 데이터 저장
			inputboxTitles: [], // 그룹코드 별 inputbox item
			surveySel: { value: '', errorMessage: '', hideDetail: true, items: [], fullItem: [], outlined: true, label: '설문 이름' }, // 설문 selctbox
			// 마케팅 필터
			prevfilter: [
				// {
				// 	check: {
				// 		value: '',
				// 		label: '마케팅활용',
				// 		class: 'filterCheckBox',
				// 		color: '',
				// 		onicon: 'mdi-check-circle',
				// 		officon: 'mdi-check-circle-outline',
				// 	},
				// 	sel: {
				// 		value: '',
				// 		errorMessage: '',
				// 		hideDetail: true,
				// 		items: ['동의', '미동의'],
				// 		itemCode: 'ismarketing',
				// 		outlined: true,
				// 		disable: true,
				// 	},
				// },
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
		}
	},
	created() {
		this.setGroupData()
	},
	computed: {},
	methods: {
		// 그룹 데이터 호출
		setGroupData() {
			this.setdate()
			this.sel.value = this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode
			this.getInputboxes(this.sel.value)
		},
		getInputboxes(groupcode) {
			const data = {
				groupcode: groupcode,
			}
			this.$store.dispatch('inputboxes', data).then(res => {
				let selItem = []
				if (this.$store.state.meData.reserveday) {
					res.data.inputBoxes.forEach(x => {
						let campFound = x.reservedays.findIndex(e => e.title === this.$store.state.meData.reserveday.title)
						if (campFound !== -1) {
							selItem.push(x.name)
							this.code = x.reservedays[0].code
						}
					})
				} else {
					res.data.inputBoxes.forEach(x => {
						let campFound = x.reservedays.findIndex(e => e.type === 'd')
						if (campFound !== -1) {
							selItem.push(x.name)
						}
					})
				}

				this.surveySel.value = selItem[0]
				this.surveySel.items = selItem
				this.surveySel.fullItem = res.data.inputBoxes
				this.getCounselors()
				this.table = {
					datatable: {
						headers: [],
						items: [],
						hidedefaultfooter: false,
						noweditting: '',
						// title: x.name,
						onlyAgree: false,
						// inputboxId: x.id,
					},
					filter: [],
					json_fields: {},
				}
				this.getTableData()
				// this.inputboxTitles = inpuboxItem
				this.$store.state.loading = false
			})
		},
		getTableData() {
			this.prevfilter[0].sel.disable = true
			this.dateChice = false
			this.$store.state.loading = true
			this.termStartpicker.menu = false
			this.termEndpicker.menu = false

			let selIndex = this.surveySel.fullItem.findIndex(e => e.name === this.surveySel.value)
			this.prevfilter[0].check.value = false
			this.prevfilter[1].check.value = false
			this.prevfilter[0].sel.value = ''
			this.prevfilter[1].sel.value = ''
			let headers = [
				// { text: '사업지 코드', value: 'groupcode' },
				{ text: '사업지명', value: 'title' },
				{ text: '고객명', value: 'name' },
				{ text: '전화번호', value: 'phone' },
				{ text: '상담신청일시', value: 'rdate' },
				// { text: '예약일시', value: 'cdate' },
				// { text: '등록일시', value: 'rdate' },
				// { text: '개인정보수집동의', width: '150px', align: 'center', value: 'ispersonal' },
				// { text: '마케팅활용동의', align: 'center', value: 'ismarketing' },
				// { text: '상담 처리', align: 'center', value: 'stat' },
				// { text: '상태', align: 'center', value: 'status' },
				{ text: '상담사', value: 'counselorid' },
				{ text: '호응도', value: 'custlike' },
				{ text: '비고', align: 'center', value: 'etc' },
			]
			// if (this.surveySel.fullItem[selIndex].categories.findIndex(x => x.type === 21) !== -1) {
			// 	headers.push({ text: '이미지 첨부', value: 'imgUpload', width: '200px', align: 'center' })
			// }
			let tableItems = {}
			let fiterItem = [
				{
					check: {
						value: '',
						label: '전체 선택',
						class: 'filterCheckBox',
						color: this.$store.state.PointColor1,
						onicon: 'mdi-check-circle',
						officon: 'mdi-check-circle-outline',
					},
				},
			]
			let exportField = {
				'사업지 코드': 'groupcode',
				사업지명: 'title',
				고객명: 'name',
				전화번호: 'phone',
				상담신청일시: 'rdate1',
				개인정보수집동의: 'ispersonal1',
				// 마케팅활용동의: 'ismarketing1',
				'이미지 첨부': 'imgUpload',
				상담사: 'counselorid',
				고객성향: 'custlike',
				고객특징: 'recomand',
				고객태그: 'commentTag',
				상담처리: 'addStat',
			}

			var tDate = new Date(this.termEndpicker.date)
			// reserveuser 호출
			const data = {
				groupcode: this.sel.value,
				rsdate: new Date(this.termStartpicker.date),
				redate: new Date(tDate.setDate(tDate.getDate() + 1)),
				inputBoxTitle: this.surveySel.value,
				name: this.searchName,
				phone: this.searchPhone.replace(/-/g, ''),
			}
			this.$store.dispatch('waitings', data).then(res => {
				
				this.waitingsItem = res.data.waitings.filter(e => {
					return e.stat !== 99
				})
				this.waitingsItem.forEach(e => {
					e.rdate = this.$moment(e.rdate)._d
					if (e.updated_at) {
						e.updated_at = this.$moment(e.updated_at).format('YYYY-MM-DD HH:mm:ss')
					}
					e.categories = this.surveySel.fullItem[selIndex].categories
					if (e.ismarketing && e.ispersonal) {
						let ismarketing
						let ispersonal
						if (e.ismarketing === 1) {
							ismarketing = 'Y'
						} else if (e.ismarketing === 2) {
							ismarketing = 'N'
						}
						if (e.ispersonal === 1) {
							ispersonal = 'Y'
						} else if (e.ispersonal === 2) {
							ispersonal = 'N'
						}

						e.ismarketing1 = ismarketing
						e.ispersonal1 = ispersonal
					}
					e.categories.forEach(a => {
						if (a.stat === 1) {
							// inputbox type이 약관이 경우
							if (a.type === 90) {
								let ismarketing
								let ispersonal
								if (e.ismarketing === 1) {
									ismarketing = 'Y'
								} else if (e.ismarketing === 2) {
									ismarketing = 'N'
								}
								if (e.ispersonal === 1) {
									ispersonal = 'Y'
								} else if (e.ispersonal === 2) {
									ispersonal = 'N'
								}

								e.ismarketing1 = ismarketing
								e.ispersonal1 = ispersonal
							} else if (a.type === 31 || a.type === 30) {
								// type 날짜일 경우 예약일시 적용
							} else {
								if (a.type !== 21) {
									exportField[a.codename] = a.code
								}

								if (a.type === 11) {
									e[this.changeTypeText(a.type)].split('/').forEach(type => {
										if (type.split(':')[0] === a.code) {
											let checkItem = []
											type
												.split(':')[1]
												.split(',')
												.forEach(detailCode => {
													if (detailCode) {
														let valIndex = a.category_details.findIndex(x => x.detailcode === detailCode)
														if (a.category_details[valIndex] !== undefined) {
															let value = a.category_details[valIndex].detailname
															value = a.category_details[valIndex].detailname
															checkItem.push(value)
														}
													}
												})
											e[type.split(':')[0]] = checkItem.toString()
										}
									})
								} else if (a.type === 10) {
									e[this.changeTypeText(a.type)].split('/').forEach(type => {
										if (type.split(':')[0] === a.code && type.split(':')[1]) {
											let valIndex = a.category_details.findIndex(x => x.detailcode === type.split(':')[1])
											let value
											if (a.category_details[valIndex] !== undefined) {
												value = a.category_details[valIndex].detailname
												if (value === '기타') {
													if (e.etc) {
														let etc = e.etc.split('/')
														let etcIndex = etc.findIndex(e => e.indexOf(type.split(':')[1]) !== -1)
														if (etc[etcIndex]) {
															if (etc[etcIndex].split(':')[1] !== '') {
																e[type.split(':')[0]] = `기타: ${etc[etcIndex].split(':')[1]}`
															} else {
																e[type.split(':')[0]] = '기타:'
															}
														}
													}
												} else {
													e[type.split(':')[0]] = value
												}
											}
										}
									})
								} else if (a.type === 12) {
									e[this.changeTypeText(a.type)].split('/').forEach(type => {
										if (type.split(':')[0] === a.code && type.split(':')[1]) {
											let valIndex = a.category_details.findIndex(x => x.detailcode === type.split(':')[1])
											let value
											if (a.category_details[valIndex] !== undefined) {
												value = a.category_details[valIndex].detailname
												e[type.split(':')[0]] = value
											}
										}
									})
								} else if (a.type === 20) {
									e[this.changeTypeText(a.type)].split('/').forEach(type => {
										if (type.split(':')[0] === a.code) {
											e[type.split(':')[0]] = type.split(':')[1]
										}
									})
								} else if (a.type === 21) {
									let images = []
									const uri = this.$store.state.backServer
									e.fileUpload.forEach(x => {
										images.push(uri + x.url)
									})

									e['imgUpload'] = images
								}
							}
						}
					})
					if (e.date) {
						e.date = this.$moment(e.date)
							.subtract(9, 'hours')
							.format('YYYY-MM-DD HH:mm:ss')
					}
					e.rdate = this.$moment(e.rdate).format('YYYY-MM-DD HH:mm:ss')
					e.rdate1 = this.$moment(e.rdate)
						.subtract(9, 'hours')
						.format('YYYY-MM-DD HH:mm:ss')

					e.cdate = this.$moment(e.cdate).format('YYYY-MM-DD HH:mm:ss')
					e.cdate1 = this.$moment(e.cdate)
						.subtract(9, 'hours')
						.format('YYYY-MM-DD HH:mm:ss')
				})
				//filter 삽입
				if (this.surveySel.fullItem[selIndex]) {
					this.surveySel.fullItem[selIndex].categories.forEach(a => {
						// inputbox type이 약관이 경우
						let check = {
							value: '',
							label: '',
							color: this.$store.state.PointColor1,
							class: 'filterCheckBox',
							onicon: 'mdi-check-circle',
							officon: 'mdi-check-circle-outline',
						}
						let sel = { value: '', errorMessage: '', hideDetail: true, items: [], itmeCode: '', outlined: true, disable: true }
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
							}
						}
					})
					if (fiterItem.length !== 0) {
						fiterItem.push({
							check: {
								value: '',
								label: '고객성향',
								color: this.$store.state.PointColor1,
								class: 'filterCheckBox',
								onicon: 'mdi-check-circle',
								officon: 'mdi-check-circle-outline',
							},
							sel: {
								value: '',
								errorMessage: '',
								hideDetail: true,
								items: ['S', 'A', 'B', 'C', 'D', '미처리'],
								itemCode: 'custlike',
								outlined: true,
								disable: true,
							},
						})
					}
					tableItems = {
						datatable: {
							headers: headers,
							items: this.waitingsItem,
							hidedefaultfooter: false,
							noweditting: '',
							waitingtitle: this.surveySel.fullItem[selIndex].name + '_상담',
							onlyAgree: false,
							// inputboxId: x.id,
						},
						filter: fiterItem,
						json_fields: exportField,
					}
					this.table = tableItems
				}
				this.$store.state.loading = false
			})
		},
		getCounselors() {
			const data = {
				groupcode: this.sel.value,
			}
			if (this.code) {
				data.code = this.code
			}
			this.$store
				.dispatch('counselors', data)
				.then(res => {
					let items = []
					res.data.counselors.forEach(e => {
						items.push(e.counselorid)
					})
					this.prevfilter[0].sel.disable = true
					this.prevfilter[0].sel.items = items
				})
				.catch(() => {})
		},

		deleteReserveuser(id) {
			const data = {
				id: id,
				stat: 99,
			}
			this.$store
				.dispatch('updateWaiting', data)
				.then(() => {
					this.getTableData()
				})
				.catch(() => {})
		},
		deleteAccount() {
			this.deleteReserveuser(this.$store.state.datatableItem.id)
			this.alertModal.dialog = false
		},

		clickDeleteBtn() {
			this.alertModal.dialog = true
		},

		termCustomer(val) {
			let start = this.$moment(this.termStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.termStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')
			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
		disabledata() {
			this.datedisable = false
		},
		//엑셀 저장
		clickExport(table) {
			this.addStat = []
			this.table.datatable.items.forEach(element => {
				element.phone = element.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
				if (element.stat === 0) {
					element.addStat = '상담 예약'
					this.addStat.push(element)
				} else if (element.stat === 1) {
					element.addStat = '상담중'
					this.addStat.push(element)
				} else if (element.stat === 2) {
					element.addStat = '미처리'
					this.addStat.push(element)
				} else if (element.stat === 9) {
					element.addStat = '상담 완료'
					this.addStat.push(element)
				}
			})
			setTimeout(() => {
				document.getElementById(table.datatable.waitingtitle).click()
			}, 500)
		},
		// 셀렉트 박스 선택된 값 테이블 적용
		applyTable() {
			this.$store.state.loading = true
			this.termStartpicker.menu = false
			this.termEndpicker.menu = false
			this.getInputboxes(this.sel.value)
		},
		reserveAllow2(val) {
			let start = this.$moment(this.editmodal.items[4].picker.date).format('YYMMDD')
			val = this.$moment(val).format('YYMMDD') > start
			return val
		},
		// 미동의자 숨기기
		onlyDisagree(table) {
			let filterType = this.sel.value
			let result = this.waitingsItem.filter(item => {
				return item.groupcode === filterType && item.inputBoxTitle === table.datatable.title
			})
			if (table.datatable.onlyAgree === false) {
				let disagreed = result.filter(item => {
					return item.ismarketing === 1 && item.ispersonal === 1
				})
				table.datatable.items = disagreed
			} else {
				table.datatable.items = result
			}
			table.datatable.onlyAgree = !table.datatable.onlyAgree
		},
		setdate() {
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			this.termStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
		},
		clickName() {
			// 이름 클릭- 히스토리 출력
			this.reserveUsersInfo.dialog = true
			this.reserveUsersInfo.name = this.$store.state.datatableItem.name
			this.reserveUsersInfo.phone = this.$store.state.datatableItem.phone
			let userPhone = this.$store.state.datatableItem.phone
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
				phone: userPhone.replace(/-/g, ''),
			}
			//고객 번호로 고객 모든 예약 호출
			this.$store
				.dispatch('waitings', data)
				.then(res => {
					this.reserveUsersInfo.reserveList = res.data.waitings
					this.reserveUsersInfo.reserveList.sort((a, b) => {
						if (a.updated_at > b.updated_at) return 1
						if (a.updated_at === b.updated_at) return 0
						if (a.updated_at < b.updated_at) return -1
					})
					// 히스토리 datatbel 항목 설정
					let header = [
						{ text: '사업지코드', value: 'groupcode', width: '200px' },
						{ text: '사업지명', value: 'title', width: '250px' },
						{ text: '상담신청일시', value: 'rdate', width: '200px' },
						{ text: '개인정보수집동의', value: 'ispersonal1', width: '200px', align: 'center' },
						// { text: '마케팅활용동의', value: 'ismarketing1', width: '200px', align: 'center' },
						// { text: '상태', align: 'center', width: '200px', value: 'status' },
					]
					let items = []
					// 사업지 중복 참여 여부
					let dupBusiness = []
					// export 항목 중복여부 data
					let dup = {}
					// excel export 항목 설정
					let exportField = {
						사업지코드: 'groupcode',
						사업지명: 'title',
						상담신청일시: 'rdate1',
						개인정보수집동의: 'ispersonal1',
						// 마케팅활용동의: 'ismarketing1',
						// 상태: 'status1',
						'이미지 첨부': 'imgUpload',
					}
					this.reserveUsersInfo.reserveList.forEach((e, i) => {
						let dupIndex = dupBusiness.findIndex(obj => obj.code === e.code)
						if (dupIndex === -1) {
							dupBusiness.push({ code: e.code, index: i })
						}
						if (e.fileUpload.length !== 0) {
							header = [
								{ text: '사업지코드', value: 'groupcode', width: '200px' },
								{ text: '사업지명', value: 'title', width: '250px' },
								{ text: '상담신청일시', value: 'rdate', width: '200px' },
								{ text: '개인정보수집동의', value: 'ispersonal1', width: '200px', align: 'center' },
								// { text: '마케팅활용동의', value: 'ismarketing1', width: '200px', align: 'center' },
								// { text: '상태', align: 'center', width: '200px', value: 'status' },
								{ text: '이미지 첨부', value: 'imgUpload', width: '200px', align: 'center' },
							]
						}
						// 예약 목록으로 해당 방문예약 호출
						let item = {}
						let data1 = {
							groupcode: e.groupcode,
							code: e.code,
						}
						let status1
						if (e.status === null || e.status === 1) {
							status1 = '방문 예약'
						} else if (e.status === 2) {
							status1 = '예약 취소'
						}
						item.status = e.status
						item.status1 = status1
						let ismarketing
						let ispersonal
						if (e.ismarketing === 1) {
							ismarketing = 'Y'
						} else if (e.ismarketing === 2) {
							ismarketing = 'N'
						}
						if (e.ispersonal === 1) {
							ispersonal = 'Y'
						} else if (e.ispersonal === 2) {
							ispersonal = 'N'
						}

						item.ismarketing1 = ismarketing
						item.ispersonal1 = ispersonal

						this.$store
							.dispatch('reservedays', data1)
							.then(res => {
								//방문예약의 inputbox 정보 저장
								e.categories = res.data.reservedays[0].input_box.categories
								e.categories.forEach(a => {
									// inputbox type이 약관이 경우
									item.groupcode = a.groupcode
									if (a.type === 90) {
										let ismarketing
										let ispersonal
										if (e.ismarketing === 1) {
											ismarketing = 'Y'
										} else if (e.ismarketing === 2) {
											ismarketing = 'N'
										}
										if (e.ispersonal === 1) {
											ispersonal = 'Y'
										} else if (e.ispersonal === 2) {
											ispersonal = 'N'
										}

										item.ismarketing1 = ismarketing
										item.ispersonal1 = ispersonal
									} else if (a.type === 31 || a.type === 30) {
										// type 날짜일 경우 예약일시 적용
									} else {
										//  inputbox type이 약관,날짜 아닐 경우 header 저장
										if (a.type !== 21) {
											if (dupIndex === -1) {
												header.push({
													text: a.codename,
													value: a.code + i,
													width: '200',
												})
												/// export key, value 설정
												if (a.codename in exportField) {
													let dupKey = a.codename + '(' + dup[a.codename] + ')'
													exportField[dupKey] = a.code + i
													dup[a.codename] += 1
												} else {
													dup[a.codename] = 1
													exportField[a.codename] = a.code + i
												}

												if (a.type === 11) {
													e[this.changeTypeText(a.type)].split('/').forEach(type => {
														if (type.split(':')[0] === a.code) {
															let checkItem = []
															type
																.split(':')[1]
																.split(',')
																.forEach(detailCode => {
																	if (detailCode) {
																		let valIndex = a.category_details.findIndex(x => x.detailcode === detailCode)
																		let value
																		if (a.category_details[valIndex] !== undefined) {
																			value = a.category_details[valIndex].detailname
																			checkItem.push(value)
																		}
																	}
																})
															item[type.split(':')[0] + i] = checkItem.toString()
														}
													})
												} else if (a.type === 10) {
													e[this.changeTypeText(a.type)].split('/').forEach(type => {
														if (type.split(':')[0] === a.code && type.split(':')[1]) {
															let valIndex = a.category_details.findIndex(x => x.detailcode === type.split(':')[1])
															let value
															if (a.category_details[valIndex] !== undefined) {
																value = a.category_details[valIndex].detailname
																if (value === '기타') {
																	let etc = e.etc.split('/')
																	let etcIndex = etc.findIndex(e => e.indexOf(type.split(':')[1]) !== -1)

																	if (etc[etcIndex].split(':')[1] !== '') {
																		item[type.split(':')[0] + i] = `기타: ${etc[etcIndex].split(':')[1]}`
																	} else {
																		item[type.split(':')[0] + i] = '기타:'
																	}
																} else {
																	item[type.split(':')[0] + i] = value
																}
															}
														}
													})
												} else if (a.type === 12) {
													e[this.changeTypeText(a.type)].split('/').forEach(type => {
														if (type.split(':')[0] === a.code && type.split(':')[1]) {
															let valIndex = a.category_details.findIndex(x => x.detailcode === type.split(':')[1])
															let value
															if (a.category_details[valIndex] !== undefined) {
																value = a.category_details[valIndex].detailname
																if (value === '기타') {
																	let etc = e.etc.split('/')
																	let etcIndex = etc.findIndex(e => e.indexOf(type.split(':')[1]) !== -1)

																	item[type.split(':')[0] + i] = etc[etcIndex].split(':')[1]
																} else {
																	item[type.split(':')[0] + i] = value
																}
															}
														}
													})
												} else if (a.type === 20) {
													e[this.changeTypeText(a.type)].split('/').forEach(type => {
														if (type.split(':')[0] === a.code) {
															item[type.split(':')[0] + i] = type.split(':')[1]
														}
													})
												}
											} else {
												if (a.type === 11) {
													e[this.changeTypeText(a.type)].split('/').forEach(type => {
														if (type.split(':')[0] === a.code) {
															let checkItem = []
															type
																.split(':')[1]
																.split(',')
																.forEach(detailCode => {
																	if (detailCode) {
																		let valIndex = a.category_details.findIndex(x => x.detailcode === detailCode)
																		let value
																		if (a.category_details[valIndex] !== undefined) {
																			value = a.category_details[valIndex].detailname
																			checkItem.push(value)
																		}
																	}
																})
															item[type.split(':')[0] + dupBusiness[dupIndex].index] = checkItem.toString()
														}
													})
												} else if (a.type === 10) {
													e[this.changeTypeText(a.type)].split('/').forEach(type => {
														if (type.split(':')[0] === a.code && type.split(':')[1]) {
															let valIndex = a.category_details.findIndex(x => x.detailcode === type.split(':')[1])
															let value
															if (a.category_details[valIndex] !== undefined) {
																value = a.category_details[valIndex].detailname
																if (value === '기타') {
																	let etc = e.etc.split('/')
																	let etcIndex = etc.findIndex(e => e.indexOf(type.split(':')[1]) !== -1)

																	if (etc[etcIndex].split(':')[1] !== '') {
																		item[type.split(':')[0] + dupBusiness[dupIndex].index] = `기타: ${etc[etcIndex].split(':')[1]}`
																	} else {
																		item[type.split(':')[0] + dupBusiness[dupIndex].index] = '기타:'
																	}
																} else {
																	item[type.split(':')[0] + dupBusiness[dupIndex].index] = value
																}
															}
														}
													})
												} else if (a.type === 12) {
													e[this.changeTypeText(a.type)].split('/').forEach(type => {
														if (type.split(':')[0] === a.code && type.split(':')[1]) {
															let valIndex = a.category_details.findIndex(x => x.detailcode === type.split(':')[1])
															let value
															if (a.category_details[valIndex] !== undefined) {
																value = a.category_details[valIndex].detailname
																if (value === '기타') {
																	let etc = e.etc.split('/')
																	let etcIndex = etc.findIndex(e => e.indexOf(type.split(':')[1]) !== -1)

																	item[type.split(':')[0] + dupBusiness[dupIndex].index] = etc[etcIndex].split(':')[1]
																} else {
																	item[type.split(':')[0] + dupBusiness[dupIndex].index] = value
																}
															}
														}
													})
												} else if (a.type === 20) {
													e[this.changeTypeText(a.type)].split('/').forEach(type => {
														if (type.split(':')[0] === a.code) {
															item[type.split(':')[0] + dupBusiness[dupIndex].index] = type.split(':')[1]
														}
													})
												}
											}
										} else if (a.type === 21) {
											let images = []
											const uri = this.$store.state.backServer
											e.fileUpload.forEach(x => {
												images.push(uri + x.url)
											})

											item['imgUpload'] = images
										}
									}
								})
								//사업지명,등록일시 삽입
								item.title = e.title
								item.updated_at = this.$moment(e.updated_at).format('YYYY-MM-DD HH:mm:ss')
								if (e.rdate) {
									item.rdate = this.$moment(e.rdate).format('YYYY-MM-DD HH:mm:ss')
								}
								item.rdate1 = this.$moment(e.rdate)
									.subtract(9, 'hours')
									.format('YYYY-MM-DD HH:mm:ss')
								items.push(item)
							})
							.catch(() => {})
					})
					// 데이터 삽입
					this.reserveUsersInfo.datatable.headers = header
					this.reserveUsersInfo.datatable.items = items
					this.reserveUsersInfo.json_fields = exportField
				})
				.catch(() => {})
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

		userExport() {
			document.getElementById(this.reserveUsersInfo.phone).click()
		},
		imgDialogShow() {
			this.alertModal2.dialog = true
		},
		selAble(filter, table) {
			if (filter.check.label === '전체 선택') {
				if (filter.check.value === true) {
					table.filter.forEach(e => {
						e.check.value = true
						if (e.sel) {
							e.sel.disable = false
							e.sel.value = ''
						}
					})
				} else {
					table.filter.forEach(e => {
						e.check.value = false
						if (e.sel) {
							e.sel.disable = true
							e.sel.value = ''
						}
					})
				}
				this.addFilter(table)
			} else {
				filter.sel.disable = !filter.sel.disable
				filter.sel.value = ''
				this.addFilter(table)
			}
		},
		addFilter(table) {
			// 필터 값 추가
			let filterType = this.sel.value
			let result = this.waitingsItem.filter(item => {
				// inputbox 따라 백업 reserveuser에서 호출
				if (
					this.$moment(item.rdate)._d >= this.$moment(this.termStartpicker.date)._d &&
					this.$moment(item.rdate)._d <= this.$moment(this.termEndpicker.date).add('days', 1)._d
				) {
					return item.groupcode === filterType && (item.inputBoxTitle === this.surveySel.value || item.inputBoxId === table.datatable.id)
				}
			})
			// selectbox 값에 따라 필터링
			table.filter.forEach(e => {
				if (e.sel) {
					if (e.sel.value) {
						result = result.filter(item => {
							return item[e.sel.itemCode].indexOf(e.sel.value) !== -1
						})
					}
				}
			})
			this.prevfilter.forEach(e => {
				if (e.sel) {
					if (e.sel.value) {
						let value = e.sel.value
						if (e.sel.value === '동의') {
							value = 1
						} else if (e.sel.value === '미동의') {
							value = 2
						}
						result = result.filter(item => {
							return item[e.sel.itemCode] === value
						})
					}
				}
			})
			table.datatable.items = result
		},
	},
}
</script>

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
</style>
