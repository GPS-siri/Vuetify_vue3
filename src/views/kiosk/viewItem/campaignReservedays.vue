<template>
	<div>
		<div class="wrapper">
			<!-- 날짜 선택 --------- start -->
			<v-layout align-center class="header_search">
				<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_1'" lg2 md2 sm7 xs12>
					<DatepickerDialog :picker="termStartpicker" :disabledata="disabledata"></DatepickerDialog
				></v-flex>
				<span class="mx-1"> ~ </span>
				<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'search_date_2'" lg2 md2 sm7 xs12>
					<DatepickerDialog :picker="termEndpicker" :disabledata="disabledata" :allowed_dates="termCustomer"></DatepickerDialog
				></v-flex>
				<v-layout class="search_wrap">
					<v-flex class="search_select ml-4" lg3 md3 sm3 xs12>
						<selectBox :sel="searchsel" @change="selectDays" :class="'searchSel'"></selectBox>
					</v-flex>
					<v-flex md2 sm3 xs12>
						<txtField class="search_box" v-model="search_project" :txtField="search"></txtField>
					</v-flex>
					<v-layout justify-end>
						<v-btn class="search_btn" color="#5d19ff" @click="reservedays_call()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
						<v-btn class="search_btn" color="#5d19ff" @click="search_reset()">초기화</v-btn>
					</v-layout>
				</v-layout>
			</v-layout>
			<!-- 날짜 선택 ----------- end -->

			<!-- 서브 헤더 --------- start -->
			<v-layout wrap class="mt-5" align-center>
				<v-icon color="#9D9DB7">
					<!-- mdi-magnify -->
					mdi-circle-small
				</v-icon>
				<span class="sub_header">거점 홍보 관리 </span>
			</v-layout>
			<!-- 서브 헤더 ----------- end -->

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
						@campaign_url="campaign_url"
						excelType="reservedays"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>
		<v-layout justify-end align-items-center class="">
			<btn
				:btn="addBtn"
				:class="'small_action_btn  new_pj'"
				:style="`background-color:${$store.state.PointColor2}`"
				:btn_txt="'신규등록'"
				@click="detailClick()"
			></btn>
		</v-layout>
		<!-- 캠페인 생성/수정 alert ------ start -->
		<edit-resereday-campaign-dialog :setdialog="edit_dialog" :validation_chceck="validation_chceck" />
		<!-- 캠페인 생성/수정 alert ------ end -->

		<!-- 저장 확인 팝업 -->
		<sweetAlert :dialog="sweetInfo" />
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<QRDialog :setdialog="QRDialogData" />
	</div>
</template>

<script>
import {
	btn,
	datatable,
	selectBox,
	txtField,
	DatepickerDialog,
	editReseredayCampaignDialog,
	sweetAlert,
	QRDialog,
} from '@/components/index.js'

export default {
	components: { btn, datatable, selectBox, txtField, DatepickerDialog, editReseredayCampaignDialog, sweetAlert, QRDialog },
	data() {
		return {
			QRDialogData: {
				code: '',
				title: '',
				dialog: false,
			},
			dateChice: true,
			datedisable: true,
			// --- 데이터 테이블 데이터 --``
			table: {
				datatable: {
					headers: [
						{ text: '프로젝트명', value: 'project_name', width: '13%' },
						{ text: '거점 홍보명', value: 'title', width: '13%' },
						{ text: '생성일', value: 'created_at', width: '9%' },
						{ text: '최종 수정일', value: 'updated_at', width: '9%' },
						{ text: '진행기간', value: 'range_camapign', width: '13%' },
						{ text: '적용 문항', value: 'input_box_name' },
						{ text: '거점 홍보 URL', value: 'campaign_url' },
						{ text: '비고', align: 'center', value: 'etc_detail', width: '8%' },
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

			// --- 삭제 모달 ---

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

			// 날짜/검색 데이터
			searchsel: { value: '오늘', errorMessage: '', hideDetail: true, items: ['오늘', '이번 주', '이번 달'], outlined: true },
			searchsel_type: { value: '이름', errorMessage: '', hideDetail: true, items: ['이름', '연락처'], outlined: true },
			search_project: '',
			search: {
				placeholder: '검색어를 입력하세요.',
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
			sweetInfo: {
				// 미입력 팝업
				open: false,
				title: '미입력 정보',
				content: `유형명을 입력해 주세요`,
				modalIcon: 'success',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},
			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '거점 홍보 정보 저장',
				content: `변경된 내용을
저장합니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
			},

			addBtn: {
				// 추가 버튼
				dark: true,
				width: 100,
			},
			edit_dialog: {
				dialog: false,
				title: '약간 관리 수정',
				imgFile: '',
				type: 'create',
				edit_item: null,
				items: [
					// 0
					{
						title: '프로젝트 선택',
						value: '',
						value2: '',
						disable: false,
						type: 'selectBox',
						selectBox: {
							value: '',
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							returnObject: true,
							filter: true,
							itemText: 'title',
							class: 'small_font bizInput',
						},
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							disable: true,
							errorMessage: '',
							autocomplete: 'off',
						},
					},

					// 1
					{
						title: '거점 홍보 제목',
						value: '',
						type: 'txtfield',
						txtfield: {
							placeholder: '예) 운정자이 시그니쳐 사전설문조사',
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
						},
						essential: true,
					},
					// 2
					{
						title: '메인이미지',
						value: '',
						type: 'fileinput',
						fileinput: {
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							readonly: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_메인이미지.png',
							},
						},
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							readonly: true,
							placeholder: '※ jpg,png / 500kb이하',
						},
					},
					// 3
					{
						title: '문항선택',
						type: 'selectBox',
						selectBox: {
							value: '',
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							filter: true,
							outlined: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_설문선택.png',
							},
							class: 'small_font bizInput',
						},
						essential: true,
					},
					// 4

					{
						title: '버튼 텍스트',
						value: '',
						type: 'txtfield',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							tooltip: {
								url: '/image/tooltip/4.방문예약_버튼텍스트.png',
							},
						},
					},
					// 5
					{
						title: '기간 설정',
						value: '',
						type: 'datePicker',

						startpicker: {
							// datePicker
							date: this.$moment().format('YYYY-MM-DD'),
							errorMessage: '',
							class: 'whiteBack defalut-date-picker-setting',
							menu: false,
						},

						endpicker: {
							// datePicker
							date: this.$moment().format('YYYY-MM-DD'),
							errorMessage: '',
							class: 'whiteBack defalut-date-picker-setting',
							menu: false,
						},

						essential: true,
					},
					// 6
					{
						title: '참여 인원 설정',
						value: '1000',
						type: 'radios',
						txtfield: {
							class: 'max_people',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							type: 'Number',
							max: 99999999,
							maxlength: 8,
							onlyNumber: true,
						},
						radios: {
							radioSelected: true,
							items: [
								{ label: '가능', value: true },
								{ label: '불가능', value: false },
							],
							color: '#202840',
						},
					},
					// 7

					{
						title: '참여 그룹 설정',
						type: 'excel',
						value: '',
						// txtfield: {
						// 	maxlength: '255',
						// 	outlined: true,
						// 	hideDetail: true,
						// 	errorMessage: '',
						// 	onlyNumber: true,
						// 	autocomplete: 'off',
						// 	readonly: true,
						// },

						selectBox: {
							value: '',
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							filter: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_모집단.png',
							},
							class: 'small_font bizInput',
						},
					},

					// 8
					{
						title: '알림톡 선택',
						value: '',
						disable: false,
						type: 'preview',
						selectBox: {
							value: '',
							errorMessage: '',
							clearable: true,
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							filter: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_모집단.png',
							},
							class: 'small_font bizInput',
						},
					},

					// 9
					{
						title: '완료 링크',
						value: 'https://pf.kakao.com/_IgBkj/friend',
						type: 'txtfield',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '형식 예: https://www.google.com',
							tooltip: {
								url: '/image/tooltip/3.캠페인_완료링크.png',
							},
						},
					},
					// 10
					{
						title: '이벤트 설정',
						value: '',
						disable: false,
						type: 'selectBox',
						selectBox: {
							value: '',
							clearable: true,
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							filter: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_이벤트 설정.png',
							},
							class: 'small_font bizInput',
						},
					},
				],
				datatable: {
					// 약관 다이어로그 데이터테이블
					headers: [
						{ text: 'No.', value: 'No', width: '75px' },
						{ text: '유형', value: 'group_type', width: '150px' },
						{ text: '그룹명', value: 'title_txtField', width: '150px' },
						{ text: '그룹별 거점 홍보 정보', value: 'campaign_url', width: '290px' },
						{ text: '비고', value: 'etc_capmaign', align: 'center', width: '260px' },
					],
					class: 'datatablehover3',
					items: [],
					hidedefaultfooter: true,
					itemPerPage: 100,
					page: 1,
					height: '63vh',
				},
			},
		}
	},

	async created() {
		this.$store.state.loading = true
		await this.first_reservedays_call()
		await this.getBusiness()
		await this.messages_call()
		await this.systems_call()

		this.$store.state.loading = false
	},
	computed: {},
	methods: {
		async first_reservedays_call() {
			let variable = {
				type: 'c',
				status: 1,
			}

			await this.$store
				.dispatch('reservedays', variable)
				.then(res => {
					let reservedaysData = res.data.reservedays
					reservedaysData.forEach(el => {
						el['range_camapign'] = `${this.$moment(el.sdate).format('YYYY-MM-DD')} ~ ${this.$moment(el.edate).format('YYYY-MM-DD')}`
						if (el.input_box) {
							el['input_box_name'] = el.input_box.name
						}
						el['project_name'] = el.business.title
					})
					this.set_table_data(reservedaysData)
				})
				.catch(() => {})
		},
		async search_reset() {
			this.$store.state.loading = true
			this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			this.searchsel.value = '오늘'
			this.search_project = ''
			await this.first_reservedays_call()
			this.$store.state.loading = false
		},
		reservedays_call() {
			let variable = {
				created_at_gte: this.termStartpicker.date,
				created_at_lte: this.$moment(this.termEndpicker.date)
					.add(1, 'day')
					.format('YYYY-MM-DD'),
				title: this.search_project,
				type: 'c',
				status: 1,
			}

			this.$store.state.loading = true
			this.$store
				.dispatch('reservedays', variable)
				.then(res => {
					let reservedaysData = res.data.reservedays

					reservedaysData.forEach(el => {
						el['range_camapign'] = `${this.$moment(el.sdate).format('YYYY-MM-DD')} ~ ${this.$moment(el.seate).format('YYYY-MM-DD')}`

						if (el.input_box) {
							el['input_box_name'] = el.input_box.name
						}
						el['project_name'] = el.business.title
					})

					this.set_table_data(reservedaysData)
					this.$store.state.loading = false
				})
				.catch(() => {
					this.$store.state.loading = false
				})
		},
		set_table_data(reservedaysData) {
			let headers = [
				{ text: '프로젝트명', value: 'project_name', width: '13%' },
				{ text: '거점 홍보명', value: 'title', width: '13%' },
				{ text: '생성일', value: 'created_at', width: '9%' },
				{ text: '최종 수정일', value: 'updated_at', width: '9%' },
				{ text: '진행기간', value: 'range_camapign', width: '13%' },
				{ text: '적용 문항', value: 'input_box_name' },
				{ text: '거점 홍보 URL', value: 'campaign_url' },
				{ text: '비고', align: 'center', value: 'etc_detail', width: '8%' },
			]
			let tableItems = {
				datatable: {
					headers: headers,
					items: reservedaysData,

					noweditting: '',
					title: '테스트 타이틀',
					onlyAgree: false,
				},
			}
			this.table = tableItems
		},

		async getBusiness() {
			// 팝업 - 프로젝트 아이템 세팅용
			const data = {
				show: true,
			}
			await this.$store.dispatch('businesses_simple', data).then(res => {
				// let items = res.data.businesses.map(el => {
				// 	return { value: el.id, text: el.title }
				// })

				// this.edit_dialog.items[0].selectBox.items = items
				let li = []
				if (this.$store.state.meData.role.name !== 'Authenticated') {
					for (let i = 0; i < res.data.businesses.length; i++) {
						for (let j = 0; j < res.data.businesses[i].users.length; j++) {
							if (res.data.businesses[i].users[j] === this.$store.state.meData.id) {
								li.push(res.data.businesses[i])
							}
						}
					}
				}
				this.edit_dialog.items[0].selectBox.items = li.length > 0 ? li : res.data.businesses
			})
		},

		async messages_call() {
			//  팝업 - 알림톡 선택 아이템 세팅
			this.$store.dispatch('messages', {}).then(res => {
				let items = res.data.messages.map(el => {
					return { value: el.id, text: el.tplCodeStr }
				})

				this.edit_dialog.items[8].selectBox.items = items
				this.edit_dialog.items[8].selectBox.inputItems = res.data.messages
			})
		},

		async systems_call() {
			// 항목 내역 호출
			let variable = {
				type: 'collection',
				useYn: true,
			}

			this.$store.dispatch('systems', variable).then(res => {
				let items = res.data.systems.map(el => {
					return { value: el.id, text: el.title }
				})

				this.$store.state.capmaign_collection_list = items
			})
		},
		async reservedayGroupss_call(id) {
			// reserveday id 별 예약 그룹 호출
			let variable = {
				reserveday: id,
			}

			this.$store.dispatch('reservedayGroups', variable).then(res => {
				res.data.reservedayGroups.forEach(el => {
					let type_exsit = this.$store.state.capmaign_collection_list.filter(item => item.text === el.type)
					let type_value = type_exsit.length > 0 ? type_exsit[0] : ''

					el['group_type'] = {
						value: type_value,
						errorMessage: '',
						hideDetail: true,
						items: this.$store.state.capmaign_collection_list,
						outlined: true,
						class: 'small_font bizInput',
					}

					el['title_txtField'] = {
						value: el.title,
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
						},
					}
					el['etc_capmaign'] = el.useYn
				})

				this.edit_dialog.datatable.items = res.data.reservedayGroups
			})
		},
		disabledata() {
			this.datedisable = false
		},

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
		selectDays(date) {
			if (date === '오늘') {
				this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (date === '이번 주') {
				this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment()
					.add(7, 'd')
					.format('YYYY-MM-DD')
			} else if (date === '이번 달') {
				this.termStartpicker.date = this.$moment()
					.startOf('month')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment()
					.endOf('month')
					.format('YYYY-MM-DD')
			}
		},

		async detailClick(item) {
			// 추가 됬을 시 대비해서 팝업 열 때 마다 문항, 이벤트 리스트 호출
			this.$store.state.loading = true
			this.$store.state.loading = false
			this.$store.state.uploadFileData.file = null

			if (item) {
				// 데이터 테이블 - 자세히보기 클릭

				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'edit'
				this.edit_dialog.id = item.id
				this.edit_dialog.edit_item = item
				this.edit_dialog.items[0].selectBox.value = item.business ? item.business : ''
				this.edit_dialog.items[0].value2 = item.business ? item.business.code : ''
				this.edit_dialog.items[1].value = item.title
				this.edit_dialog.items[2].value = item.mainimg?.name
				this.edit_dialog.items[3].selectBox.value = item.input_box ? item.input_box.id : ''
				this.edit_dialog.items[4].value = item.btnText
				this.edit_dialog.items[5].startpicker.date = this.$moment(item.sdate).format('YYYY-MM-DD')
				this.edit_dialog.items[5].endpicker.date = this.$moment(item.edate).format('YYYY-MM-DD')
				this.edit_dialog.items[6].value = String(item.maxcount)
				this.edit_dialog.items[6].radios.radioSelected = item.duplicate ? true : false
				this.edit_dialog.items[7].value = item.accessPhones ? item.accessPhones : ''
				this.edit_dialog.items[7].selectBox.value = item.population ? item.population : '설정 해제'
				let tpl_exist = this.edit_dialog.items[8].selectBox.inputItems.filter(el => el.tplCode === item.tplCode[1])
				this.edit_dialog.items[8].selectBox.value = tpl_exist.length > 0 ? tpl_exist[0].id : ''
				this.edit_dialog.items[9].value = item.endLink
				this.edit_dialog.items[10].selectBox.value = item.event ? item.event.id : ''

				// 그룹 호출
				this.reservedayGroupss_call(item.id)
			} else {
				// 신규 생성
				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'create'
				this.edit_dialog.id = ''
				this.edit_dialog.edit_item = null

				this.edit_dialog.items.forEach(element => {
					if (element.type === 'txtfield') {
						if (element.title === '완료 링크') element.value = 'https://pf.kakao.com/_IgBkj/friend'
						else element.value = ''
					} else if (element.type === 'selectBox') {
						element.selectBox.value = ''
					} else if (element.type === 'fileinput') {
						element.value = ''
					} else if (element.type === 'datePicker') {
						element.startpicker.date = this.$moment().format('YYYY-MM-DD')
						element.endpicker.date = this.$moment().format('YYYY-MM-DD')
					} else if (element.type === 'radios') {
						element.value = '1000'
						element.radios.radioSelected = false
					} else if (element.type === 'radios_group') {
						element.value = ''
						element.radios.radioSelected = 'kakao'
					} else if (element.type === 'excel') {
						element.value = ''
						element.selectBox.value = ''
					} else if (element.type === 'preview') {
						element.value = ''
						element.selectBox.value = ''
					}
				})
				this.edit_dialog.items[0].value2 = ''
				this.edit_dialog.datatable.items = []
			}
		},
		validation_chceck() {
			// 빈값 체크
			let ok = true
			this.sweetInfo.modalIcon = 'info'
			if (!this.edit_dialog.items[0].selectBox.value) {
				this.sweetInfo.content = `프로젝트를 선택해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[1].value) {
				this.sweetInfo.content = `거점 홍보 제목을 입력해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[2].value) {
				this.sweetInfo.content = `메인이미지를 등록해 주세요`
				// ok = false
			} else if (!this.edit_dialog.items[3].selectBox.value) {
				this.sweetInfo.content = `문항을 선택해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[4].value) {
				this.sweetInfo.content = `버튼 텍스트를 입력해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[6].value) {
				this.sweetInfo.content = `참여인원을 입력해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[8].selectBox.value) {
				this.sweetInfo.content = `알림톡을 선택해 주세요`
				ok = false
			}

			if (!ok) {
				return (this.sweetInfo.open = true)
			}
			// 빈값 없음
			this.sweetDialog.open = true
			if (this.edit_dialog.type === 'create') {
				this.sweetDialog.title = '거점 홍보 저장'
				this.sweetDialog.content = `거점 홍보 정보를
저장합니다`
			}
		},
		clickSave() {
			this.clickSaveBtn()
		},

		campaign_url(item, type) {
			// 데이터 테이블 캠페인 URL 클릭

			if (type === 'QR') {
				this.QRDialogData.dialog = true
				this.QRDialogData.code = process.env.VUE_APP_CUSTOMER_URL + '/reserve_visit/' + item.code
				this.QRDialogData.title = item.title
			} else if (type === 'navigate') {
				window.open(process.env.VUE_APP_CUSTOMER_URL + '/reserve_visit/' + item.code)
			} else if (type === 'copy') {
				window.navigator.clipboard.writeText(process.env.VUE_APP_CUSTOMER_URL + '/reserve_visit/' + item.code).then(() => {
					this.sweetInfo.open = true
					this.sweetInfo.title = '복사 완료'
					this.sweetInfo.modalIcon = 'success'
					this.sweetInfo.content = `ctrl + v로 url을 확인하세요.`
				})
			}
		},

		//  gs start =====================

		clickSaveBtn() {
			this.$store.state.loading = true

			if (this.edit_dialog.id) {
				if (this.$store.state.uploadFileData.file) {
					// 업데이트 - 파일 업로드
					this.$store
						.dispatch('upload', { file: this.$store.state.uploadFileData.file })
						.then(res => {
							this.updateReserveday(this.edit_dialog.id, res)
						})
						.catch(() => {
							this.$store.state.loading = false
						})
				} else {
					// 업데이트 - 파일 업로드 없이
					this.updateReserveday(this.edit_dialog.id)
				}
			} else {
				if (this.$store.state.uploadFileData.file) {
					// 생성 - 파일 업로드
					this.$store
						.dispatch('upload', { file: this.$store.state.uploadFileData.file })
						.then(res => {
							this.createReserveday(res)
						})
						.catch(() => {
							this.$store.state.loading = false
						})
				} else {
					// 생성 - 파일 업로드 없이
					this.createReserveday()
				}
			}
		},
		async createReserveday(imageData) {
			// 캠페인 생성
			let tplCode_selected = this.edit_dialog.items[8].selectBox.inputItems.filter(
				el => el.id === this.edit_dialog.items[8].selectBox.value,
			)
			let tplCode_code = ''
			if (tplCode_selected.length > 0) {
				tplCode_code = tplCode_selected[0].tplCode
			}

			const data = {
				// groupcode: this.editmodal.items[1].value,
				title: this.edit_dialog.items[1].value,
				sdate: new Date(this.edit_dialog.items[5].startpicker.date),
				edate: new Date(this.edit_dialog.items[5].endpicker.date),
				maxcount: Number(this.edit_dialog.items[6].value),
				input_box: this.edit_dialog.items[3].selectBox.value,
				type: 'c',
				duplicate: this.edit_dialog.items[6].radios.radioSelected,
				status: 1,
				inputBoxType: '1',
				endLink: this.edit_dialog.items[9].value,

				accessPhones: this.edit_dialog.items[7].value ? this.edit_dialog.items[7].value : null,
				btnText: this.edit_dialog.items[4].value,
				business: this.edit_dialog.items[0].selectBox.value.id,
				showInfo: false,
				tplCode: [
					'',
					tplCode_code,
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'TG_6026', // 내가받을 알림톡
				],
				noUserData: false,
				event: this.edit_dialog.items[10].selectBox.value
					? this.edit_dialog.items[10].selectBox.value.text !== '없음'
						? this.edit_dialog.items[10].selectBox.value
						: null
					: null,
				// selfAlert: this.editmodal.items[18].check.txtfield.value,
			}
			if (this.edit_dialog.items[7].selectBox.value) {
				if (this.edit_dialog.items[7].selectBox.value === '설정 해제') data.population = null
				else data.population = this.edit_dialog.items[7].selectBox.value
			} else {
				data.population = null
			}
			if (this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.QRlogo = imageData.data.multipleUpload[1].id
			} else if (this.$store.state.uploadFileData.file && !this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data[0].id
			} else if (!this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.QRlogo = imageData.data[0].id
			}
			data.loginType = 'phone'
			this.$store.state.loading = true
			await this.$store
				.dispatch('createReserveday', data)
				.then(async res => {
					this.$store.state.uploadFileData.file = null
					if (this.edit_dialog.datatable.items.length === 0) {
						// 추가할 reservday group 없음
						this.$store.state.loading = false
						this.first_reservedays_call()
						this.edit_dialog.dialog = false
						this.sweetDialog.open = false
					} else {
						// 추가할 reservday group 있음
						for (let index = 0; index < this.edit_dialog.datatable.items.length; index++) {
							// 선택한 그룹 유형 세팅
							let type_exsit = this.$store.state.capmaign_collection_list.filter(
								item => item.value === this.edit_dialog.datatable.items[index].group_type.value,
							)
							// 생성 그룹 데이터 세팅
							let variable = {
								reserveday: res.data.createReserveday.reserveday.id,
								type: type_exsit[0].text,
								title: this.edit_dialog.datatable.items[index].title_txtField.value,
								useYn: this.edit_dialog.datatable.items[index].etc_capmaign,
							}
							await this.createReservedayGroup(variable)
							// 마지막 index 로딩 멈추기
							if (index === this.edit_dialog.datatable.items.length - 1) {
								this.$store.state.loading = false
								this.first_reservedays_call()
								this.edit_dialog.dialog = false
								this.sweetDialog.open = false
							}
						}
					}
				})
				.catch(() => {
					alert('생성 허용치를 초과하였습니다.')
					this.$store.state.loading = false
					this.sweetDialog.open = false
					this.edit_dialog.dialog = false
				})
		},
		async updateReserveday(id, imageData) {
			// 캠페인 생성
			let tplCode_selected = this.edit_dialog.items[8].selectBox.inputItems.filter(
				el => el.id === this.edit_dialog.items[8].selectBox.value,
			)
			let tplCode_code = ''
			if (tplCode_selected.length > 0) {
				tplCode_code = tplCode_selected[0].tplCode
			}
			const data = {
				id: id,
				title: this.edit_dialog.items[1].value,
				sdate: new Date(this.edit_dialog.items[5].startpicker.date),
				edate: new Date(this.edit_dialog.items[5].endpicker.date),
				maxcount: Number(this.edit_dialog.items[6].value),
				input_box: this.edit_dialog.items[3].selectBox.value,
				type: 'c',
				duplicate: this.edit_dialog.items[6].radios.radioSelected,
				status: 1,
				inputBoxType: '1',
				endLink: this.edit_dialog.items[9].value,
				accessPhones: this.edit_dialog.items[7].value ? this.edit_dialog.items[7].value : null,
				btnText: this.edit_dialog.items[4].value,
				business: this.edit_dialog.items[0].selectBox.value.id,
				showInfo: false,
				tplCode: [
					'',
					tplCode_code,
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'TG_6026', // 내가받을 알림톡
				],
				noUserData: false,
				event: this.edit_dialog.items[10].selectBox.value
					? this.edit_dialog.items[10].selectBox.value.text !== '없음'
						? this.edit_dialog.items[10].selectBox.value
						: null
					: null,
				// selfAlert: this.editmodal.items[18].check.txtfield.value,
			}
			if (this.edit_dialog.items[7].selectBox.value) {
				if (this.edit_dialog.items[7].selectBox.value === '설정 해제') data.population = null
				else data.population = this.edit_dialog.items[7].selectBox.value
			} else {
				data.population = null
			}
			if (this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.QRlogo = imageData.data.multipleUpload[1].id
			} else if (this.$store.state.uploadFileData.file && !this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data[0].id
			} else if (!this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.QRlogo = imageData.data[0].id
			}
			this.$store.state.loading = true
			await this.$store
				.dispatch('updateReserveday', data)
				.then(async res => {
					this.$store.state.uploadFileData.file = null
					for (let index = 0; index < this.edit_dialog.datatable.items.length; index++) {
						// 선택한 그룹 유형 세팅
						let type_exsit = this.$store.state.capmaign_collection_list.filter(
							item => item.value === this.edit_dialog.datatable.items[index].group_type.value,
						)
						// 생성 그룹 데이터 세팅
						let variable = {
							reserveday: res.data.updateReserveday.reserveday.id,
							type: this.edit_dialog.datatable.items[index].new ? type_exsit[0].text : this.edit_dialog.datatable.items[index].type,
							title: this.edit_dialog.datatable.items[index].title_txtField.value,
							useYn: this.edit_dialog.datatable.items[index].etc_capmaign,
						}
						if (this.edit_dialog.datatable.items[index].new) await this.createReservedayGroup(variable)
						else {
							variable.id = this.edit_dialog.datatable.items[index].id
							await this.updateReservedayGroup(variable)
						}
					}
					this.$store.state.loading = false
					this.first_reservedays_call()
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
				})
				.catch(() => {
					alert('생성 허용치를 초과하였습니다.')
					this.$store.state.loading = false
					this.sweetDialog.open = true
					this.edit_dialog.dialog = false
				})
		},

		async createReservedayGroup(variable) {
			await this.$store.dispatch('createReservedayGroup', variable)
		},
		async updateReservedayGroup(variable) {
			await this.$store.dispatch('updateReservedayGroup', variable)
		},

		// gs end ===========
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
</style>
