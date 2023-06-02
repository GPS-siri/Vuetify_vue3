<template>
	<div>
		<div class="wrapper">
			<!-- 날짜 선택 --------- start -->
			<v-layout align-center class="header_search">
				<v-layout class="search_wrap">
					<!-- <v-flex class="search_select ml-4" lg3 md3 sm3 xs12>
						<selectBox :sel="searchsel_type" @change="select_type" :class="'searchSel'"></selectBox>
					</v-flex> -->
					<v-flex md2 sm3 xs12>
						<txtField class="search_box" v-model="search_message" :txtField="search"></txtField>
					</v-flex>
					<!-- <v-layout justify-end>
						<v-btn class="search_btn" color="#5d19ff" @click="messages_call()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
					</v-layout> -->
				</v-layout>
			</v-layout>
			<!-- 날짜 선택 ----------- end -->

			<!-- 서브 헤더 --------- start -->
			<v-layout wrap class="mt-5" align-center>
				<v-icon color="#9D9DB7">
					<!-- mdi-magnify -->
					mdi-circle-small
				</v-icon>
				<span class="sub_header">알림톡 관리 </span>
			</v-layout>
			<!-- 서브 헤더 ----------- end -->

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12 style="position: relative;">
					<datatable
						:search="search_message"
						:datatable="table.datatable"
						class="tbl-type01"
						:detailClick="detailClick"
						:previewClick="previewClick"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<v-layout justify-end align-items-center class="">
				<btn
					:btn="addBtn"
					:class="'small_action_btn'"
					:style="`background-color:${$store.state.PointColor2}`"
					:btn_txt="'알림톡 등록하기'"
					@click="get_talks()"
				></btn>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
			<download-excel
				class="btn btn-default"
				:id="table.datatable.title"
				:data="table.datatable.items"
				style="display:none"
				:fields="table.json_fields"
				type="text/csv;charset=utf8"
				worksheet="My Worksheet"
				:name="termStartpicker.date + ' ~ ' + termEndpicker.date + '_' + table.datatable.title + '_' + ' 기간별 등록고객 현황' + '.xls'"
			>
			</download-excel>
		</div>

		<!-- 알림톡 가져오기 alert  -->
		<editTalkDialog :setdialog="edit_dialog" @update="update" />
		<!-- 알림톡 자세히 보기 alert -->
		<editTalkDetailDialog :setdialog="detail_dialog" :validation_chceck="validation_chceck" />
		<!-- 미리보기 팝업  -->
		<previewTalk :setdialog="preview_dialog" />
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
		<!-- sweetAlet - ${}를 입력해주세요, 완료 팝업 -->
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<sweetAlert :dialog="sweetInfo" />
		<button style="display:none" @click="first_messages_call" id="systemTalkRefresh"></button>
	</div>
</template>

<script>
import { btn, datatable, txtField, editTalkDialog, sweetAlert, previewTalk, editTalkDetailDialog } from '@/components/index.js'
import html2canvas from 'html2canvas'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		btn,
		downloadExcel,
		datatable,
		txtField,
		editTalkDialog,
		sweetAlert,
		previewTalk,
		editTalkDetailDialog,
	},
	data() {
		return {
			testBoolean: false,

			dateChice: true,
			datedisable: true,
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

			reserveUsersInfo: {
				dialog: false,
				reserveList: [],
				datatable: {
					class: 'datatablehover3',
					headers: [],
					items: [],
				},
				name: '',
				phone: '',
				json_fields: {},
			},

			// 날짜/검색 데이터
			searchsel: { value: '오늘', errorMessage: '', hideDetail: true, items: ['오늘', '이번 주', '이번 달'], outlined: true },
			searchsel_type: { value: '거점 홍보명', errorMessage: '', hideDetail: true, items: ['거점 홍보명'], outlined: true },
			search_message: '',
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

			preview_dialog: {
				// 미리포기 다이어로그
				dialog: false,
				title: '철산자이 더 헤리티지',
				content: `[철산자이 더 헤리티지]

[홍길동]고객님,
[2023-01-17 14:25]에
[철산자이 더 헤리티지 고객 설문조사 이벤트]에
참여 하셨습니다.

고객님의 소중한 의견과 참여에 감사드립니다.
아래 버튼을 클릭하시면 이벤트에 관한 
자세세한 내용과 분양정보를 확인 하실 수 
있습니다.`,
				buttons: [
					{
						text: '카카오톡 채널 친구추가',
					},
					{
						text: '홍페이지 바로가기',
					},
					{
						text: '분양 정보 보기',
					},
					{
						text: '챗봇 바로가기',
					},
				],
			},
			edit_dialog: {
				// 알림톡 불러오기 다이어로그
				dialog: false,
				type: 'edit',
				edit_item: {},
				messages_datas: [],
				datatable: {
					class: 'datatablehover3',
					// 알림톡 불러오기 다이어로그 데이터테이블
					headers: [
						{ text: '템플릿 명', value: 'title' },
						{ text: '템플릿 코드', value: 'code_talk' },
						{ text: '검수상태', value: 'status_talk' },
						{ text: '비고', value: 'preview', align: 'center' },
					],
					items: [],
					height: '600px',
					hidedefaultfooter: false,
					showselect: true,
					itemKey: 'id',
				},
				preview: {
					title: '미리보기를 선택해 주세요.',
					content: `미리보기 클릭 시 알림톡 확인가능 합니다.`,
					buttons: [],
				},
			},

			detail_dialog: {
				// 알림톡 자세히 보기 다이어로그
				dialog: false,
				type: 'detail',
				left_items: [
					// 0
					{
						title: '템플릿 정보',
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
						required: true,
					},
					// 1
					{
						title: '템플릿 코드',
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
						required: true,
					},
					// 2
					// {
					// 	title: '적용일',
					// 	id: 'apply_date',
					// 	type: 'txtfield',
					// 	value: '',
					// 	txtfield: {
					// 		maxlength: '255',
					// 		outlined: true,
					// 		hideDetail: true,
					// 		errorMessage: '',
					// 		autocomplete: 'off',
					// 		placeholder: '',
					// 		readonly: true,
					// 	},
					// 	required: true,
					// },
					// 3
					{
						title: '내용',
						id: 'preview',
						type: 'preview',
						preview: {
							title: '철산자이 더 헤리티지',
							content: `[철산자이 더 헤리티지]

[홍길동]고객님,
[2023-01-17 14:25]에
[철산자이 더 헤리티지 고객 설문조사 이벤트]에
참여 하셨습니다.

고객님의 소중한 의견과 참여에 감사드립니다.
아래 버튼을 클릭하시면 이벤트에 관한 
자세세한 내용과 분양정보를 확인 하실 수 
있습니다.`,
							buttons: [
								{
									text: '카카오톡 채널 친구추가',
								},
								{
									text: '홍페이지 바로가기',
								},
								{
									text: '분양 정보 보기',
								},
								{
									text: '챗봇 바로가기',
								},
							],
						},
						required: true,
					},
					// 4
					{
						title: '버튼정보',
						id: 'buttons',
						type: 'buttons',
						buttons: [
							{
								text: '카카오톡 채널 친구추가',
								value: `MO:https://pf.kakao.com/_IgBkj/friend
								PC: https://pf.kakao.com/_IgBkj/friend`,
							},
							{
								text: '홍페이지 바로가기',
								value: `MO:https://pf.kakao.com/_IgBkj/friend
								PC: https://pf.kakao.com/_IgBkj/friend`,
							},
							{
								text: '분양 정보 보기',
								value: `MO:https://pf.kakao.com/_IgBkj/friend
								PC: https://pf.kakao.com/_IgBkj/friend`,
							},
							{
								text: '챗봇 바로가기',
								value: `MO:https://pf.kakao.com/_IgBkj/friend
								PC: https://pf.kakao.com/_IgBkj/friend`,
							},
						],
						required: true,
					},
				],
				items: [
					//0
					{
						title: '내용',
						id: 'title',
						type: 'sub_message',
						value: `[철산자이 더 헤리티지]

[홍길동]고객님,
[2023-01-17 14:25]에
[철산자이 더 헤리티지 고객 설문조사 이벤트]에
참여 하셨습니다.

고객님의 소중한 의견과 참여에 감사드립니다.
아래 버튼을 클릭하시면 이벤트에 관한 
자세세한 내용과 분양정보를 확인 하실 수 
있습니다.`,
					},
				],
			},
			sweetInfo: {
				//  업데이트 완료
				open: false,
				title: '업데이트 완료',
				content: `알림톡 업데이트가
완료되었습니다.`,
				modalIcon: 'success',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},
			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '알림톡 가져오기',
				content: `선택하신 알림톡을 
가져옵니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
			},

			addBtn: {
				// 추가 버튼
				dark: true,
			},
		}
	},
	async created() {
		this.$store.state.loading = true
		await this.first_messages_call()
		this.$store.state.loading = false
	},
	computed: {},
	methods: {
		async update() {
			this.$store.state.loading = true
			await this.first_messages_call()
			this.$store.state.loading = false
		},
		async first_messages_call() {
			// 약관 내역 호출
			let variable = {}
			this.$store.dispatch('messages', variable).then(res => {
				let messages_data = res.data.messages
				this.edit_dialog.messages_datas = res.data.messages
				this.set_table_data(messages_data)
			})
		},
		async messages_call() {
			// 약관 내역 호출
			let variable = {
				tplCodeStr: this.search_message,
			}
			this.$store.dispatch('messages', variable).then(res => {
				let messages_data = res.data.messages
				this.set_table_data(messages_data)
			})
		},

		set_table_data(term_data) {
			let headers = [
				{ text: '템플릿 명', value: 'tplCodeStr' },
				{ text: '템플릿 코드', value: 'tplCode' },
				{ text: '적용일', value: 'created_at' },
				{ text: '비고', align: 'center', value: 'etc_detail_preview' },
			]
			let tableItems = {
				datatable: {
					class: 'datatablehover3',
					headers: headers,
					items: term_data,
					// hidedefaultfooter: false,
					noweditting: '',
					title: '테스트 타이틀',
					onlyAgree: false,
					// inputboxId: x.id,
				},
				// json_fields: exportField,
			}
			this.table = tableItems
		},
		saveImg(fileName) {
			const canvas = this.$refs.qaLists
			html2canvas(canvas).then(canvas => {
				var Image = canvas.toDataURL('image/jpeg')
				this.downloadURL(Image, fileName + '.jpg')
			})
		},
		downloadURL(url, name) {
			var link = document.createElement('a')
			link.download = name
			link.href = url
			document.body.appendChild(link)
			link.click()
			this.$store.state.loading = false
			this.imgInfo = false
		},

		disabledata() {
			this.datedisable = false
		},
		//엑셀 저장
		clickExport(table) {
			this.table.datatable.items.forEach(element => {
				element.phone = element.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
			})
			document.getElementById(table.datatable.title).click()
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

		select_type() {
			this.search_message = ''
		},
		detailClick(item) {
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
				let new_text = `MO : ${el.linkMo} \n PC : ${el.linkPc}`
				el.value = new_text
			})

			this.detail_dialog.left_items[0].value = item.tplCodeStr
			this.detail_dialog.left_items[1].value = item.tplCode
			// this.detail_dialog.left_items[2].value = this.$moment(item.created_at).format('YYYY-MM-DD HH:mm')
			this.detail_dialog.left_items[2].preview.title = item.tplCodeStr
			this.detail_dialog.left_items[2].preview.content = item.message
			this.detail_dialog.left_items[2].preview.buttons = preview_buttons
			this.detail_dialog.left_items[3].buttons = preview_buttons

			this.detail_dialog.items[0].value = item.message

			this.detail_dialog.dialog = true
		},
		previewClick(item) {
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
			this.sweetDialog.open = true
		},

		clickSave() {
			this.sweetDialog.open = false

			// if (this.edit_dialog.type === 'create') {
			// 	this.create_term()
			// } else {
			// 	this.update_term()
			// }
		},
		update_talk() {
			this.sweetInfo.open = true
		},
		async create_term() {
			// 약관 추가
			let history = [
				{
					type: 'create',
					reason: this.edit_dialog.items[2].value,
					update_at: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
				},
			]
			let variable = {
				title: this.edit_dialog.items[0].value,
				groupcode: this.$store.state.businesses_list_system.value.groupcode,
				content: this.edit_dialog.items[1].textarea.value,
				stat: this.edit_dialog.items[3].selectBox.value === '사용' ? 1 : 2,
				history: history,
			}
			this.$store.state.loading = true
			await this.$store
				.dispatch('createTerm', variable)
				.then(async () => {
					await this.first_messages_call()
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
				})
				.catch(() => {
					this.sweetInfo.title = '오류 발생'
					this.sweetInfo.content = `오류가 발생했습니다.`

					this.sweetInfo.open = true
					this.sweetDialog.open = false

					this.$store.state.loading = false
				})
		},
		async update_term() {
			// 약관 수정

			let history = this.edit_dialog.edit_item.history ? [...this.edit_dialog.edit_item.history] : []
			history.push({
				type: 'edit',
				reason: this.edit_dialog.items[2].value,
				update_at: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
			})
			let variable = {
				id: this.edit_dialog.edit_item.id,
				title: this.edit_dialog.items[0].value,
				groupcode: this.$store.state.businesses_list_system.value.groupcode,
				content: this.edit_dialog.items[1].textarea.value,
				stat: this.edit_dialog.items[3].selectBox.value === '사용' ? 1 : 2,
				history: history,
			}

			this.$store.state.loading = true
			await this.$store
				.dispatch('updateTerm', variable)
				.then(async () => {
					await this.first_messages_call()
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false

					this.$store.state.loading = false
				})
				.catch(() => {
					this.sweetInfo.title = '오류 발생'
					this.sweetInfo.content = `오류가 발생했습니다.`

					this.sweetInfo.open = true
					this.sweetDialog.open = false

					this.$store.state.loading = false
				})
		},
		get_talks() {
			// 알림톡 가져오기
			this.edit_dialog.datatable.items = []
			this.edit_dialog.preview = {
				title: '미리보기를 선택해 주세요.',
				content: `미리보기 클릭 시 알림톡 확인가능 합니다.`,
				buttons: [],
			}
			this.edit_dialog.dialog = true
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
