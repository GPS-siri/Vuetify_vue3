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
						<txtField class="search_box" v-model="search_term" :txtField="search"></txtField>
					</v-flex>
					<!-- <v-layout justify-end>
						<v-btn class="search_btn" color="#5d19ff" @click="terms_call()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
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
				<span class="sub_header">약관 관리 </span>
			</v-layout>
			<!-- 서브 헤더 ----------- end -->

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12>
					<datatable :search="search_term" :datatable="table.datatable" class="tbl-type01" :detailClick="detailClick"> </datatable>
				</v-flex>
			</v-layout>
			<v-layout justify-end align-items-center class="mb-3">
				<btn
					:btn="addBtn"
					:class="'small_action_btn mr-2 new_pj'"
					:style="`background-color:${$store.state.PointColor2}`"
					:btn_txt="'신규생성'"
					@click="detailClick()"
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

		<!-- 사용자 생성/수정 alert ------ start -->
		<editTermSystemDialog :setdialog="edit_dialog" :validation_chceck="validation_chceck" />
		<!-- 사용자 생성/수정 alert ------ end -->
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
	</div>
</template>

<script>
import { btn, datatable, txtField, editTermSystemDialog, sweetAlert } from '@/components/index.js'
import html2canvas from 'html2canvas'
import downloadExcel from 'vue-json-excel'
export default {
	components: { btn, downloadExcel, datatable, txtField, editTermSystemDialog, sweetAlert },
	data() {
		return {
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
			searchsel_type: { value: '약관명', errorMessage: '', hideDetail: true, items: ['약관명'], outlined: true },
			search_term: '',
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

			edit_dialog: {
				// 수정/추가 다이어로그
				dialog: false,
				type: 'edit',
				edit_item: {},
				left_items: [
					{
						title: '약관제목',
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

					{
						title: '',
						type: 'datatable',
						datatable: {
							class: 'datatablehover3',
							// 약관 다이어로그 데이터테이블
							headers: [
								{ text: '작성일시', value: 'update_at' },
								{ text: '변경사유', value: 'reason', align: 'center' },
							],
							items: [],
							hidedefaultfooter: true,
							itemPerPage: 100,
							page: 1,
							height: '342px',
						},
					},
				],
				items: [
					//0
					{
						title: '약관제목',
						id: 'title',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '약관제목을 입력하세요.',
						},
						required: true,
					},
					//1
					{
						title: '약관내용',
						id: 'content',
						type: 'textarea',
						textarea: {
							rows: 10,
							outlined: true,
							value: '',
							noresize: true,
						},
						required: false,
					},
					//2
					{
						title: '작성사유',
						id: '',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '작성사유를 입력하세요.',
						},
						required: true,
					},
					// 3
					{
						title: '상태',
						id: 'stat',
						value: '',
						type: 'selectBox',
						selectBox: {
							value: '사용',
							disable: false,
							errorMessage: '',
							hideDetail: true,
							items: ['사용', '미사용'],
							inputItems: [],
							outlined: true,
							class: 'small_font bizInput',
							placeholder: '',
						},
						required: false,
					},
				],
			},
			sweetInfo: {
				//  밸리데이션
				open: false,
				title: '',
				content: ``,
				modalIcon: 'info',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},
			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '신규 약관 저장',
				content: `추가한 약관을
저장합니다`,
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
		}
	},
	async created() {
		this.$store.state.loading = true
		await this.first_terms_call()
		this.$store.state.loading = false
	},
	computed: {},
	methods: {
		async first_terms_call() {
			// 약관 내역 호출
			let variable = {}
			this.$store.dispatch('terms', variable).then(res => {
				let term_data = res.data.terms

				this.set_table_data(term_data)
			})
		},
		async terms_call() {
			// 약관 내역 호출
			let variable = {
				title: this.search_term,
			}
			this.$store.dispatch('terms', variable).then(res => {
				let term_data = res.data.terms
				term_data.forEach(term => {
					term.created_at = this.$moment(term.created_at).format('YYYY-MM-DD HH:mm:ss')
					term.updated_at = this.$moment(term.updated_at).format('YYYY-MM-DD HH:mm:ss')
					term['showing'] = term.stat === 1 ? '사용' : '미사용'
					term['history_length'] =
						term.history && term.history.length > 0 && term.history.filter(el => el.type === 'edit').length > 0
							? `${term.history.filter(el => el.type === 'edit').length}건`
							: ''
				})

				this.set_table_data(term_data)
			})
		},

		set_table_data(term_data) {
			let headers = [
				{ text: '약관명', value: 'title' },
				{ text: '작성일', value: 'created_at' },
				{ text: '최종 수정일', value: 'updated_at' },
				{ text: '개정이력', value: 'history_length' },
				{ text: '사용여부', value: 'showing' },
				{ text: '비고', align: 'center', value: 'etc_detail', width: '10%' },
			]
			let tableItems = {
				datatable: {
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
			this.search_term = ''
		},
		detailClick(item) {
			if (item) {
				// 데이터 테이블 - 자세히보기 클릭

				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'edit'
				this.edit_dialog.items[2].title = '수정사유'
				this.edit_dialog.items[2].txtfield.placeholder = '수정사유를 입력하세요.'
				this.edit_dialog.edit_item = item

				this.edit_dialog.items.forEach(element => {
					if (element.type === 'txtfield') {
						if (item[element.id]) {
							element.value = item[element.id]
						} else {
							element.value = ''
						}
					} else if (element.type === 'selectBox') {
						element.selectBox.value = item[element.id] === 1 ? '사용' : '미사용'
					} else if (element.type === 'textarea') {
						element.textarea.value = item[element.id]
					}
				})
				this.edit_dialog.left_items[0].value = item.title
				let edit_history = item.history && item.history.length > -1 ? item.history.filter(el => el.type === 'edit') : []

				edit_history.sort((a, b) => {
					return new Date(b.update_at) - new Date(a.update_at)
				})

				this.edit_dialog.left_items[1].datatable.items = edit_history
			} else {
				// 신규 생성
				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'create'
				this.edit_dialog.edit_item = {}
				this.edit_dialog.items[2].title = '작성사유'
				this.edit_dialog.items[2].txtfield.placeholder = '작성사유를 입력하세요.'
				this.edit_dialog.items[3].selectBox.value = '사용'

				this.edit_dialog.items.forEach(element => {
					if (element.type === 'txtfield') {
						element.value = ''
					} else if (element.type === 'textarea') {
						element.textarea.value = ''
					}
				})
			}
		},
		validation_chceck() {
			// 빈값 체크
			// 약관 저장 버튼 클릭
			if (this.edit_dialog.items[0].value.length === 0) {
				this.sweetInfo.title = '약관제목 입력'
				this.sweetInfo.content = `약관제목을 입력해주세요.`

				return (this.sweetInfo.open = true)
			} else if (this.edit_dialog.items[1].textarea.value.length === 0) {
				this.sweetInfo.title = '약관내용 입력'
				this.sweetInfo.content = `약관내용을 입력해주세요.`

				return (this.sweetInfo.open = true)
			} else if (this.edit_dialog.items[2].value.length === 0) {
				this.sweetInfo.title = `${this.edit_dialog.type === 'create' ? '작성사유' : '수정사유'}  입력`
				this.sweetInfo.content = `${this.edit_dialog.type === 'create' ? '작성사유' : '수정사유'}를 입력해주세요.`

				return (this.sweetInfo.open = true)
			}

			if (this.edit_dialog.type === 'create') {
				this.sweetDialog.title = '신규 약관 저장'
				this.sweetDialog.content = `추가한 약관을
저장합니다`

				return (this.sweetDialog.open = true)
			} else {
				this.sweetDialog.title = '약관 수정 완료'
				this.sweetDialog.content = `변경된 내용을
저장합니다`
				return (this.sweetDialog.open = true)
			}

			// if (this.edit_dialog.type === 'create') {

			// 	this.create_term()
			// } else {
			// 	this.update_term()
			// }
		},

		clickSave() {
			if (this.edit_dialog.type === 'create') {
				this.create_term()
			} else {
				this.update_term()
			}
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
				content: this.edit_dialog.items[1].textarea.value,
				stat: this.edit_dialog.items[3].selectBox.value === '사용' ? 1 : 2,
				history: history,
				businesses: [this.$store.state.businesses_list_system.value.id],
			}
			this.$store.state.loading = true
			await this.$store
				.dispatch('createTerm', variable)
				.then(async () => {
					await this.first_terms_call()
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
				title: this.edit_dialog.items[0].value,
				content: this.edit_dialog.items[1].textarea.value,
				stat: this.edit_dialog.items[3].selectBox.value === '사용' ? 1 : 2,
				type: 'edit',
				reason: this.edit_dialog.items[2].value,
				update_at: this.$moment().format('YYYY-MM-DD HH:mm:ss'),
			})

			let variable = {
				id: this.edit_dialog.edit_item.id,
				title: this.edit_dialog.items[0].value,
				content: this.edit_dialog.items[1].textarea.value,
				stat: this.edit_dialog.items[3].selectBox.value === '사용' ? 1 : 2,
				history: history,
				businesses: this.edit_dialog.edit_item.businesses.map(el => el.id),
			}

			this.$store.state.loading = true
			await this.$store
				.dispatch('updateTerm', variable)
				.then(async () => {
					await this.first_terms_call()
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
