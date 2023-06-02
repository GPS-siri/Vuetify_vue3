<template>
	<div>
		<div class="wrapper">
			<!-- 검색 --------- start -->
			<v-layout align-center class="header_search">
				<v-layout class="search_wrap" justify-end>
					<v-flex md2 sm3 xs12 class="ml-3 mr-auto">
						<selectBox :sel="business_selectBox" @change="change_project"></selectBox>
					</v-flex>

					<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_1'" lg2 md2 sm7 xs12>
						<DatepickerDialog :picker="termStartpicker" :disabledata="disabledata"></DatepickerDialog
					></v-flex>
					<span class="mx-1"> ~ </span>
					<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'search_date_2'" lg2 md2 sm7 xs12>
						<DatepickerDialog :picker="termEndpicker" :disabledata="disabledata" :allowed_dates="termCustomer"></DatepickerDialog
					></v-flex>
					<v-flex class="search_select ml-4" lg3 md3 sm3 xs12>
						<selectBox :sel="searchsel" @change="selectDays" :class="'searchSel'"></selectBox>
					</v-flex>

					<!-- 이름 검색 -->
					<v-flex md2 sm3 xs12>
						<txtField class="search_box_type_friendTalk" v-model="search_name" :txtField="search" @enter="friendTalk_call"></txtField>
					</v-flex>
					<v-btn class="search_btn" color="#5d19ff" @click="friendTalk_call()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
					<v-btn class="search_btn" color="#5d19ff" @click="search_reset()">초기화</v-btn>
				</v-layout>
			</v-layout>
			<!-- 검색 ----------- end -->

			<!-- 서브 헤더 --------- start -->
			<v-layout wrap class="mt-5" align-center>
				<v-icon color="#9D9DB7">
					<!-- mdi-magnify -->
					mdi-circle-small
				</v-icon>
				<span class="sub_header">친구톡 발송 결과</span>
			</v-layout>
			<!-- 서브 헤더 ----------- end -->

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12>
					<datatable
						:datatable="table.datatable"
						class="tbl-type01"
						:detailClick="detailClick"
						:previewClick="previewClick"
						excelUseYn="true"
						excelType="freind_talk_sent_list_excel"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>

		<!-- 발송 결과 자세히 보기 alert -->
		<editmessageResultDialog
			:setdialog="detail_dialog"
			:validation_chceck="validation_chceck"
			:open_disable_dialog="open_disable_dialog"
			:showAlert="showAlert"
		/>
		<!-- 미리보기 팝업  -->
		<previewfriendTalk :setdialog="preview_dialog" />

		<!-- sweetAlet - ${}를 입력해주세요, 완료 팝업 -->
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<sweetAlert :dialog="sweetInfo" />
		<!-- 저장완료 팝업 -->
		<sweetAlert :dialog="doneDialog" @click="clickResult()" />
		<!-- 발송정지 팝업 -->
		<sweetAlert :dialog="stopDialog" @click="clickStop()" />
	</div>
</template>

<script>
import {
	datatable,
	txtField,
	sweetAlert,
	previewfriendTalk,
	editmessageResultDialog,
	selectBox,
	DatepickerDialog,
} from '@/components/index.js'
export default {
	components: {
		datatable,
		txtField,
		sweetAlert,
		previewfriendTalk,
		editmessageResultDialog,
		selectBox,
		DatepickerDialog,
	},
	props: {
		tab_change: Function,
	},
	data() {
		return {
			business_selectBox: {
				// 프로젝트 셀렉트박스
				value: '',
				disable: false,
				errorMessage: '',
				hideDetail: true,
				items: [],
				inputItems: [],
				outlined: true,
				filter: true,
				class: 'small_font bizInput dense_selectBox',
				placeholder: '프로젝트를 선택하세요.',
			},
			dateChice: true,
			// --- 데이터 테이블 데이터 --``
			table: {
				datatable: {
					class: 'datatablehover3',
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
			},

			//검색 데이터

			searchsel: { value: '오늘', errorMessage: '', hideDetail: true, items: ['오늘', '이번 주', '이번 달'], outlined: true },

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
			datedisable: true,

			search_name: '',
			search: {
				placeholder: '제목을 입력하세요.',
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},

			preview_dialog: {
				// 미리포기 다이어로그
				dialog: false,
				title: '',
				content: ``,
				url: '',
				buttons: [],
			},

			detail_dialog: {
				// 친구톡 발송결과 자세히 보기 다이어로그
				dialog: false,
				type: 'create',
				id: null,
				left_items: [
					// 0
					{
						title: '제목',
						id: 'title',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: true,
						},
					},
					// 1
					{
						title: '발송 일시',
						id: 'code',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: true,
						},
					},
					// 2
					{
						title: '발송 번호',
						id: 'preview',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: true,
						},
					},
					// 3
					{
						title: '친구톡',
						id: 'preview',

						type: 'txtfield_preview',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: true,
						},
					},
					// 4
					{
						title: '총 발송건수',
						id: 'preview',

						half: true,
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: true,
						},
					},
					// 5
					{
						title: '성공 / 실패건수',
						id: 'preview',

						half: true,
						type: 'txtfield_two',
						value: '',
						value_two: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: true,
						},
					},
					// 6
					{
						title: '친구톡',
						id: 'preview',

						half: true,
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: true,
						},
					},
					// 7
					{
						title: 'LMS / MMS',
						id: 'preview',

						half: true,
						type: 'txtfield_two',
						value: '',
						value_two: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: true,
						},
					},
				],
				group_items: [
					{
						title: '수신 그룹',
						id: 'code',
						type: 'checkBox_group',
						value: '',
						checkBox: {
							all: false,
							items: [
								// {
								// 	label: '일반대량발송',
								// 	value: false,
								// },
								// { label: '변수적용 대량발송', value: false },
							],
							selected: [],
						},
					},
				],
				datatable: {
					class: 'datatablehover3',
					headers: [
						{ text: 'No', value: 'talk_no', width: '80px' },
						{ text: '이름', value: 'name' },
						{ text: '수신 번호', value: 'talk_phone' },
						{ text: '결과', value: 'talk_status' },
					],
					// items: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
					items: [],
					origin_items: [],
					hidedefaultfooter: false,
					noweditting: '',
					// title: x.name,
					onlyAgree: false,
				},
				result_status: {
					total: 0,
					sucess: 0,
					wait: 0,
					fail: 0,
				},
			},
			sweetInfo: {
				//  저장불가 팝업
				open: false,
				title: '버튼 추가 불가',
				content: ``,
				modalIcon: 'info',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},

			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '친구톡 템플릿 저장',
				content: `친구톡 템플릿을 저장합니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '확인',
				modalIcon: 'success',
			},

			doneDialog: {
				// 저장 완료 팝업
				open: false,
				title: '친구톡 발송',
				content: `친구톡 발송이 완료되었습니다.`,
				cancelBtnText: '확인',
				buttonType: 'twoBtn',
				saveBtnText: '발송결과 확인',
				modalIcon: 'success',
			},
			stopDialog: {
				// 발송 중지 팝업
				open: false,
				title: '친구톡 발송 즉시 정지',
				content: `현재 발송중인 친구톡을 중지합니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '확인',
				modalIcon: 'success',
			},

			addBtn: {
				// 추가 버튼
				dark: true,
			},
			filter_active: false, // 검색 활성화 여부
		}
	},
	async created() {
		this.$store.state.loading = true
		await this.reservedays_call()
		await this.unsubscribes_simple()
		await this.sendManagements()
	},
	computed: {},
	methods: {
		async reservedays_call() {
			// 프로젝트 리스트 호출
			let data = {
				show: true,
			}

			if (this.$store.state.meData.role.id !== '1') {
				data['users'] = [this.$store.state.meData.id]
			}
			await this.$store.dispatch('businesses_simple', data).then(res => {
				let data = res.data.businesses
				// data.sort((a, b) => {
				// 	return a.id - b.id
				// })
				let items = data.map(el => {
					return { text: el.title, value: { id: el.id } }
				})

				items.unshift({ text: '전체', value: { id: 'all' } })
				this.business_selectBox.items = items
				this.business_selectBox.value = items[0].value
			})
		},

		async sendManagements() {
			// 약관 내역 호출
			let variable = {}
			if (this.$store.state.meData.role.id !== '1') {
				if (this.business_selectBox.value.id !== 'all') {
					variable['business'] = this.business_selectBox.value.id
				} else {
					variable['business_in'] = this.business_selectBox.items.map(el => el.value.id)
				}
			} else {
				if (this.business_selectBox.value.id !== 'all') {
					variable['business'] = this.business_selectBox.value.id
				}
			}
			if (this.filter_active) {
				variable['created_at_gte'] = this.termStartpicker.date + 'T00:00:00.000Z'
				variable['created_at_lte'] =
					this.$moment(this.termEndpicker.date)
						.add(1, 'day')
						.format('YYYY-MM-DD') + 'T00:00:00.000Z'
				variable['title'] = this.search_name
			}
			this.$store.state.loading = true
			this.$store.dispatch('sendManagementResult', variable).then(res => {
				let sendManagements_data = res.data.sendManagementResult.sendManagement

				sendManagements_data.forEach(el => {
					el['project_title'] = el.business.title
					el['send_date'] = el.immediateDelivery
						? this.$moment(el.created_at).format('YYYY-MM-DD HH:mm:ss')
						: this.$moment(el.reservationSend).format('YYYY-MM-DD HH:mm:ss')
					el['cateogry_title'] = el.category === 'nomal' ? '일반' : '변수'
					el['send_state'] = el.sendState ? el.sendState : '발송전'

					el['send_result'] = `${el.success} / ${el.fail}`
					el['total_txt'] = `${el.total} 건`
					el['freind_talk_txt'] = `${el.freind_talk} 건`
					el['LMS_txt'] = `${el.LMS} 건`
					el['MMS_txt'] = `${el.MMS} 건`
				})

				sendManagements_data.sort((a, b) => {
					// Compare the 2 keys
					if (new Date(this.$moment(a.created_at).format('YYYY-MM-DD')) < new Date(this.$moment(b.created_at).format('YYYY-MM-DD')))
						return 1
					else if (new Date(this.$moment(a.created_at).format('YYYY-MM-DD')) > new Date(this.$moment(b.created_at).format('YYYY-MM-DD')))
						return -1
					else {
						return new Date(b.send_date) - new Date(a.send_date)
					}
				})

				sendManagements_data.forEach((el, index) => {
					el['row_num'] = index + 1
				})

				this.set_table_data(sendManagements_data)
				this.$store.state.loading = false
			})
		},

		set_table_data(term_data) {
			let headers = [
				{ text: 'No', value: 'row_num', width: '80px' },
				{ text: '프로젝트명', value: 'project_title', width: '15%' },
				{ text: '제목', value: 'title', width: '20%' },
				{ text: '발송일', value: 'send_date', width: '190px' },
				{ text: '발송 유형', value: 'cateogry_title' },
				{ text: '발송 건수', value: 'total_txt' },
				{ text: '성공/실패', value: 'send_result' },
				{ text: '친구톡', value: 'freind_talk_txt' },
				{ text: 'LMS', value: 'LMS_txt' },
				{ text: 'MMS', value: 'MMS_txt' },
				{ text: '비고', align: 'center', value: 'etc_detail' },
			]
			let tableItems = {
				datatable: {
					class: 'datatablehover3',
					headers: headers,
					items: term_data,
					noweditting: '',
					title: '테스트 타이틀',
					onlyAgree: false,
				},
			}
			this.table = tableItems
		},

		//엑셀 저장
		clickExport(table) {
			this.table.datatable.items.forEach(element => {
				element.phone = element.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
			})
			document.getElementById(table.datatable.title).click()
		},

		async detailClick(item) {
			this.detail_dialog.type = 'edit'
			this.detail_dialog.dialog = true
			this.detail_dialog.id = item.id

			this.detail_dialog.left_items[0].value = item.title
			this.detail_dialog.left_items[1].value = item.send_date
			this.detail_dialog.left_items[2].value = item.sender
			this.detail_dialog.left_items[3].value = item.message_template.title
			this.detail_dialog.left_items[3].id = item.message_template.id
			this.detail_dialog.left_items[4].value = item.total_txt
			this.detail_dialog.left_items[5].value = String(item.success) + ' 건'
			this.detail_dialog.left_items[5].value_two = String(item.fail) + ' 건'
			this.detail_dialog.left_items[6].value = item.freind_talk_txt
			this.detail_dialog.left_items[7].value = item.LMS_txt
			this.detail_dialog.left_items[7].value_two = item.MMS_txt
			this.detail_dialog.datatable.origin_items = []
			this.detail_dialog.datatable.items = []
			this.detail_dialog.result_status = {
				total: 0,
				sucess: 0,
				wait: 0,
				fail: 0,
			}
			this.$store.state.loading = true
			this.$store.dispatch('sendManagements_sendList', { id: item.id }).then(res => {
				let result = res.data.sendManagements[0]
				this.detail_dialog.send_list = result
				let li = []
				for (let i = 0; i < result.sendList.length; i++) {
					if (li.findIndex(x => x.label === result.sendList[i].title) === -1) {
						li.push({
							label: result.sendList[i].title,
							value: false,
							code: result.sendList[i].code,
						})
					}
				}
				this.detail_dialog.group_items[0].checkBox.items = li
				this.detail_dialog.group_items[0].checkBox.all = false
				this.$store.state.loading = false
			})
		},
		previewClick(item) {
			// 미리보기 클릭
			let preview_buttons = item.button ? JSON.parse(item.button) : []
			if (preview_buttons) {
				if (preview_buttons.button) {
					preview_buttons = preview_buttons.button
				}
			} else {
				preview_buttons = []
			}

			preview_buttons.forEach(el => {
				el['text'] = el.name
			})

			this.preview_dialog.title = item.tplCodeStr
			this.preview_dialog.content = item.message
			this.preview_dialog.buttons = preview_buttons
			this.preview_dialog.dialog = true
		},
		validation_chceck() {
			// 저장 버튼 클릭 시 빈값 체크

			let groups = this.detail_dialog.left_items[1].checkBox.selected.filter(
				el => el.type === this.detail_dialog.left_items[0].radios.radioSelected,
			)

			if (!this.detail_dialog.left_items[0].selectBox.value) {
				this.sweetInfo.title = '프로젝트 미선택'
				this.sweetInfo.content = `프로젝트를 선택해주세요.`
				return (this.sweetInfo.open = true)
			} else if (groups.length === 0) {
				this.sweetInfo.title = '수신그룹 미선택'
				this.sweetInfo.content = `수신그룹을 선택해주세요.`
				return (this.sweetInfo.open = true)
			} else if (!this.detail_dialog.items[0].value) {
				this.sweetInfo.title = '제목'
				this.sweetInfo.content = `제목을 입력해주세요`
				return (this.sweetInfo.open = true)
			} else if (
				!this.detail_dialog.items[1].radios_type.radioSelected &&
				(!this.detail_dialog.items[1].selectBox_hour.value ||
					!this.detail_dialog.items[1].selectBox_minute.value ||
					!this.detail_dialog.items[1].datepicker.date)
			) {
				this.sweetInfo.title = '발송 일자/발송 시간 미선택'
				this.sweetInfo.content = `발송 일자와 발송 시간을 선택해주세요.`
				return (this.sweetInfo.open = true)
			} else if (!this.detail_dialog.items[3].selectBox.value) {
				this.sweetInfo.title = '친구톡 미선택'
				this.sweetInfo.content = `친구톡을 선택해주세요.`
				return (this.sweetInfo.open = true)
			} else {
				if (this.detail_dialog.items.filter(el => el.type === 'time_select')[0].radios_type.radioSelected) {
					this.sweetDialog.content = '친구톡 발송설정을 완료하고 발송합니다.'
				} else {
					this.sweetDialog.content = '친구톡 발송설정을 완료하고 예약합니다.'
				}
				this.sweetDialog.open = true
			}
		},

		clickSave() {
			// 저장 확인 버튼클릭
			this.sweetDialog.open = false

			if (this.detail_dialog.type === 'create') {
				this.createSendManagement()
			} else {
				this.updateSendManagement()
			}
		},
		async createSendManagement() {
			// 발송 생성

			let variable = {
				category: this.detail_dialog.left_items[0].radios.radioSelected,
				title: this.detail_dialog.items[0].value,
				immediateDelivery: this.detail_dialog.items[1].radios_type.radioSelected,
				sender: this.detail_dialog.items[2].value,
				message_template: this.detail_dialog.items[3].selectBox.value,
				sendList: [],
				users_permissions_user: this.$store.state.meData.id,
				sendType: this.detail_dialog.items[5].radios.radioSelected,
				// divideNum: '',
				// divideTerm: '',
				business: this.detail_dialog.left_items[0].selectBox.value.id,
			}

			if (!this.detail_dialog.items[1].radios_type.radioSelected) {
				//  예약 일시 세팅
				let reservationSend = `${this.detail_dialog.items[1].datepicker.date} ${this.detail_dialog.items[1].selectBox_hour.value}:${this.detail_dialog.items[1].selectBox_minute.value}`
				variable['reservationSend'] = this.$moment(reservationSend)
			}

			if (this.detail_dialog.left_items[1].checkBox.selected.length > 0) {
				// 발송 리스트 세팅
				if (this.detail_dialog.left_items[0].radios.radioSelected === 'nomal') {
					// 일반대량 발송

					let code = this.detail_dialog.left_items[1].checkBox.selected.filter(el => el.code && el.type === 'nomal').map(el => el.code)

					if (code.length > 0) {
						// 캠페인 선택 + 엑셀 업로드해서 저장하는 경우
						let variable_count = {
							code: code,
						}
						this.$store.state.loading = true

						// 친구톡 보낼 전화번호들 세팅
						await this.$store.dispatch('reserveusersConnection_phone', variable_count).then(res => {
							// 엑셀로 추가한 데이터 세팅
							let excel_uploaded = this.detail_dialog.left_items[1].checkBox.selected.filter(el => !el.code && el.type === 'nomal')

							excel_uploaded.forEach(excel => {
								res.data.reserveusersConnection.values = res.data.reserveusersConnection.values.concat(excel.list)
							})

							// 중복 전화번호 제거
							variable['sendList'] = res.data.reserveusersConnection.values
								.map(el => {
									return {
										name: el.name,
										phone: el.phone,
										code: el.code,
										title: el.title,
									}
								})
								.filter(
									(v, i, a) => a.findIndex(v2 => v2.phone === v.phone) === i && this.$store.state.unscribe_lists.indexOf(v.phone) === -1,
								)
						})
					} else {
						// 엑셀만 업로드 해서 저장하는 경우
						let excel_uploaded = this.detail_dialog.left_items[1].checkBox.selected.filter(el => el.type === 'nomal')
						let func_lists = []
						excel_uploaded.forEach(excel => {
							func_lists = func_lists.concat(excel.list)
						})
						variable['sendList'] = func_lists
					}
				} else {
					// 변수적용 대량 발송
					let excel_uploaded = this.detail_dialog.left_items[1].checkBox.selected.filter(el => el.type === 'function')
					let func_lists = []
					excel_uploaded.forEach(excel => {
						func_lists = func_lists.concat(excel.list)
					})
					variable['sendList'] = func_lists
				}
			}

			if (this.detail_dialog.items[5].radios.radioSelected === 'divide') {
				// 분산 발송 설정
				variable['divideNum'] = this.detail_dialog.items[6].selectBox_num.value
				variable['divideTerm'] = this.detail_dialog.items[6].selectBox_term.value
			}
			this.$store.state.loading = true
			await this.$store.dispatch('createSendManagement', variable).then(async () => {
				await this.sendManagements()
				this.$store.state.loading = false
				this.detail_dialog.dialog = false
				this.doneDialog.open = true
			})
		},
		async updateSendManagement() {
			// 발송 수정

			let variable = {
				id: this.detail_dialog.id,
				category: this.detail_dialog.left_items[0].radios.radioSelected,
				title: this.detail_dialog.items[0].value,
				immediateDelivery: this.detail_dialog.items[1].radios_type.radioSelected,
				sender: this.detail_dialog.items[2].value,
				message_template: this.detail_dialog.items[3].selectBox.value,
				sendList: [],
				users_permissions_user: this.$store.state.meData.id,
				sendType: this.detail_dialog.items[5].radios.radioSelected,
				// divideNum: '',
				// divideTerm: '',
				business: this.detail_dialog.left_items[0].selectBox.value.id,
			}

			if (!this.detail_dialog.items[1].radios_type.radioSelected) {
				//  예약 일시 세팅
				let reservationSend = `${this.detail_dialog.items[1].datepicker.date} ${this.detail_dialog.items[1].selectBox_hour.value}:${this.detail_dialog.items[1].selectBox_minute.value}`
				variable['reservationSend'] = this.$moment(reservationSend)
			}

			if (this.detail_dialog.left_items[1].checkBox.selected.length > 0) {
				// 발송 리스트 세팅
				if (this.detail_dialog.left_items[0].radios.radioSelected === 'nomal') {
					// 일반대량 발송

					let code = this.detail_dialog.left_items[1].checkBox.selected.filter(el => el.code && el.type === 'nomal').map(el => el.code)

					if (code.length > 0) {
						// 캠페인 선택 + 엑셀 업로드해서 저장하는 경우
						let variable_count = {
							code: code,
						}
						this.$store.state.loading = true

						// 친구톡 보낼 전화번호들 세팅
						await this.$store.dispatch('reserveusersConnection_phone', variable_count).then(res => {
							// 엑셀로 추가한 데이터 세팅
							let excel_uploaded = this.detail_dialog.left_items[1].checkBox.selected.filter(el => !el.code && el.type === 'nomal')

							excel_uploaded.forEach(excel => {
								res.data.reserveusersConnection.values = res.data.reserveusersConnection.values.concat(excel.list)
							})

							// 중복 전화번호 제거
							variable['sendList'] = res.data.reserveusersConnection.values
								.map(el => {
									return {
										name: el.name,
										phone: el.phone,
										code: el.code,
										title: el.title,
									}
								})
								.filter(
									(v, i, a) => a.findIndex(v2 => v2.phone === v.phone) === i && this.$store.state.unscribe_lists.indexOf(v.phone) === -1,
								)
						})
					} else {
						// 엑셀만 업로드 해서 저장하는 경우
						let excel_uploaded = this.detail_dialog.left_items[1].checkBox.selected.filter(el => el.type === 'nomal')
						let func_lists = []
						excel_uploaded.forEach(excel => {
							func_lists = func_lists.concat(excel.list)
						})
						variable['sendList'] = func_lists
					}
				} else {
					// 변수적용 대량 발송
					let excel_uploaded = this.detail_dialog.left_items[1].checkBox.selected.filter(el => el.type === 'function')
					let func_lists = []
					excel_uploaded.forEach(excel => {
						func_lists = func_lists.concat(excel.list)
					})
					variable['sendList'] = func_lists
				}
			}

			if (this.detail_dialog.items[5].radios.radioSelected === 'divide') {
				// 분산 발송 설정
				variable['divideNum'] = this.detail_dialog.items[6].selectBox_num.value
				variable['divideTerm'] = this.detail_dialog.items[6].selectBox_term.value
			}
			this.$store.state.loading = true
			await this.$store.dispatch('updateSendManagement', variable).then(async () => {
				await this.sendManagements()
				this.$store.state.loading = false
				this.detail_dialog.dialog = false
				this.doneDialog.open = true
			})
		},
		add_friend_talk() {
			// 친구톡 등록하기 버튼 클릭
			this.detail_dialog.dialog = true
			this.detail_dialog.type = 'create'
			this.detail_dialog.id = null

			this.detail_dialog.left_items.forEach(el => {
				if (el.type === 'selectBox_radio') {
					el.selectBox.value = ''
					el.radios.radioSelected = el.radios.items[0].value
				} else if (el.type === 'excel_import') {
					el.parseCsv = null
					el.value = ''
				} else if (el.type === 'checkBox_group') {
					el.checkBox.items = []
					el.checkBox.all = false
					el.checkBox.selected = []

					el.selectBox.value = ''
					el.selectBox.items = []
				}
			})

			this.detail_dialog.left_items[0].selectBox.items = this.$store.state.businesses_list_system.items
			this.detail_dialog.left_items[0].selectBox.value = this.$store.state.businesses_list_system.items[0].value
			this.detail_dialog.left_items[1].selectBox.items = this.$store.state.businesses_list_system.items

			this.detail_dialog.items.forEach(el => {
				el.value = ''
				if (el.type === 'fileinput') {
					el.file = { file: {}, url: '' }
				} else if (el.type === 'time_select') {
					el.radios_type.radioSelected = el.radios_type.items[0].value
					el.selectBox_hour.value = ''
					el.selectBox_minute.value = ''
					el.datepicker.date = ''
				} else if (el.type === 'select_preview') {
					el.selectBox.value = ''
				} else if (el.type === 'send_test') {
					el.phones = []
				} else if (el.type === 'txtfield_radio') {
					el.value = ''
					el.radios.radioSelected = el.radios.items[0].value
				} else if (el.type === 'divide_setting') {
					el.selectBox_num.value = ''
					el.selectBox_term.value = ''
				}
			})
			this.detail_dialog.items[2].value = this.$store.state.businesses_list_system.items[0].value.phone
			this.detail_dialog.items[3].selectBox.value = ''
			this.messageTemplates('nomal')
		},

		async unsubscribes_simple() {
			// 수신거부 리스트
			await this.$store.dispatch('unsubscribes_simple', {}).then(res => {
				this.$store.state.unscribe_lists = res.data.unsubscribes.map(el => el.phone)
			})
		},
		async search_reset() {
			this.$store.state.loading = true
			this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			this.searchsel.value = '오늘'
			this.search_name = ''
			this.business_selectBox.value.id = 'all'

			this.filter_active = false
			await this.sendManagements()
			this.$store.state.loading = false
		},
		friendTalk_call() {
			// 검색 실행
			this.filter_active = true
			this.sendManagements()
		},
		change_project() {
			// 프로젝트 변경
			this.search_name = ''
			this.filter_active = false
			this.sendManagements()
		},
		open_disable_dialog(data) {
			// 불가 팝업 열기

			this.sweetInfo.title = data.title
			this.sweetInfo.content = data.content
			this.sweetInfo.open = true
		},
		disabledata() {
			this.datedisable = false
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

		async messageTemplates(category) {
			// 약관 내역 호출
			let variable = {
				category: category,
			}
			this.$store.state.loading = true
			await this.$store.dispatch('messageTemplates', variable).then(res => {
				let messageTemplates_data = res.data.messageTemplates

				let items = messageTemplates_data.map(el => {
					return {
						text: el.title,
						value: el.id,
					}
				})
				this.detail_dialog.items[3].selectBox.items = items
				this.$store.state.loading = false
			})
		},
		stop_now() {
			// 발송 정지 팝업 열기
			this.stopDialog.open = true
		},
		clickStop() {
			// 발송 정지
			this.stopDialog.open = false
			this.detail_dialog.dialog = false
		},
		clickResult() {
			this.doneDialog.open = false
			this.tab_change(2)
		},

		showAlert(data) {
			this.sweetInfo.title = data.title
			this.sweetInfo.content = data.content
			this.sweetInfo.open = true
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
</style>
