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
						<txtField class="search_box" v-model="search_project" :txtField="search"></txtField>
					</v-flex>
					<!-- <v-layout justify-end>
						<v-btn class="search_btn" color="#5d19ff" @click="users_call()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
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
				<span class="sub_header">사용자 관리 </span>
			</v-layout>
			<!-- 서브 헤더 ----------- end -->

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12>
					<datatable :search="search_project" :datatable="table.datatable" class="tbl-type01" :detailClick="detailClick"> </datatable>
				</v-flex>
			</v-layout>
			<v-layout justify-end align-items-center class="">
				<btn
					:btn="addBtn"
					:class="'small_action_btn new_pj'"
					:style="`background-color:${$store.state.PointColor2}`"
					:btn_txt="'신규등록'"
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
		<editUserSystemDialog
			:setdialog="edit_dialog"
			:validation_chceck="validation_chceck"
			:add_project="add_project"
			:delete_project="delete_project"
		/>
		<!-- 사용자 생성/수정 alert ------ end -->
		<!-- 저장 확인 팝업 -->
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />

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
import { btn, datatable, txtField, editUserSystemDialog, sweetAlert } from '@/components/index.js'
import html2canvas from 'html2canvas'
import downloadExcel from 'vue-json-excel'
export default {
	components: { btn, downloadExcel, datatable, txtField, editUserSystemDialog, sweetAlert },
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

			// --- 삭제 모달 ---

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

			edit_dialog: {
				// 수정/추가 다이어로그
				dialog: false,
				type: 'create',
				id: '',
				items: [
					//0
					{
						title: '아이디',
						id: 'username',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '아이디를 입력하세요.',
						},
						required: true,
					},
					//1
					{
						title: '이름',
						id: 'name',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '20',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '이름을 입력하세요',
						},
						required: false,
					},
					//2
					{
						title: '휴대폰 번호',
						id: 'phone',
						value: '',
						type: 'txtfield',
						txtfield: {
							maxlength: '13',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '휴대폰 번호를 입력하세요',
						},
						required: true,
					},
					//3
					{
						title: '권한',
						id: 'auth',
						value: '',
						type: 'selectBox',
						selectBox: {
							value: '',
							disable: false,
							errorMessage: '',
							hideDetail: true,
							items: ['슈퍼마스터', '분양소장', '분양기획'],
							inputItems: [],
							outlined: true,
							class: 'small_font bizInput',
							placeholder: '권한을 선택하세요.',
						},
						required: false,
					},
					//4
					{
						title: '프로젝트',
						id: 'project',
						value: '',
						type: 'selectBox',
						selectBox: {
							value: '',
							disable: false,
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							filter: true,
							class: 'small_font bizInput',
							placeholder: '프로젝트를 선택하세요.',
						},
						btn: true,
						required: false,
					},
					//5
					{
						title: '상태',
						id: 'businesses',
						value: '',
						type: 'chips',

						chips: [],
						btn: true,
						required: false,
					},
				],
			},
			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '사용자 정보 저장',
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
		}
	},

	async created() {
		this.$store.state.loading = true
		await this.first_users_call()
		this.$store.state.loading = false
	},
	computed: {},
	methods: {
		async first_users_call() {
			this.$store.dispatch('Users', {}).then(res => {
				let user_data = res.data.users
				this.set_table_data(user_data)
			})
		},
		async users_call() {
			// 유저 내역 호출
			let variable = {}

			if (this.searchsel_type.value === '이름') {
				variable['username'] = this.search_project
			} else {
				variable['phone'] = this.search_project
			}
			this.$store.dispatch('Users', variable).then(res => {
				let user_data = res.data.users
				user_data.forEach(el => {
					el.created_at = this.$moment(el.created_at).format('YYYY-MM-DD HH:mm:ss')

					el['email_name'] = el.email.split('@')[0]

					el['businesses_title'] = el.businesses && el.businesses.length > 0 ? el.businesses.map(el => el.title).join(`, `) : ''
				})
				this.set_table_data(user_data)
			})
		},
		set_table_data(user_data) {
			let headers = [
				{ text: '계정정보', value: 'username', width: '13%' },
				{ text: '이름', value: 'user_name', width: '13%' },
				{ text: '연락처', value: 'phone', width: '13%' },
				{ text: '등록일', value: 'created_at', width: '13%' },
				{ text: '프로젝트', value: 'businesses_title' },
				{ text: '비고', align: 'center', value: 'etc_detail', width: '10%' },
			]
			let tableItems = {
				datatable: {
					class: 'datatablehover3',
					headers: headers,
					items: user_data,
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
			this.search_project = ''
		},
		detailClick(item) {
			if (item) {
				// 데이터 테이블 - 자세히보기 클릭

				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'edit'
				this.edit_dialog.id = item.id

				this.edit_dialog.items.forEach(element => {
					if (element.type === 'txtfield') {
						element.value = item[element.id]
					} else if (element.type === 'selectBox') {
						if (element.id === 'auth') {
							let role = ''

							if (item.role.id === '1') {
								role = '슈퍼마스터'
							} else if (item.role.id === '3') {
								role = '분양소장'
							} else if (item.role.id === '4') {
								role = '분양기획'
							}

							element.selectBox.value = role
						} else {
							element.selectBox.value = ''
						}
					} else if (element.type === 'chips') {
						element.chips = JSON.parse(JSON.stringify(item.businesses))
					}
				})
			} else {
				// 신규 생성
				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'create'
				this.edit_dialog.id = ''

				this.edit_dialog.items.forEach(element => {
					if (element.type === 'txtfield') {
						element.value = ''
					} else if (element.type === 'selectBox') {
						element.selectBox.value = ''
					} else if (element.type === 'chips') {
						element.chips = []
					}
				})
			}
			this.edit_dialog.items[4].selectBox.items = this.able_projects()
		},
		validation_chceck() {
			// 빈값 체크
			if (this.edit_dialog.items[0].value.length === 0) {
				return alert('아이디를 입력해주세요.')
			} else if (this.edit_dialog.items[1].value.length === 0) {
				return alert('이름을 입력해주세요.')
			} else if (this.edit_dialog.items[2].value.length === 0) {
				return alert('휴대폰 번호를 입력해주세요.')
			} else if (this.edit_dialog.items[3].selectBox.value.length === 0) {
				return alert('권한을 선택해주세요.')
			}
			this.sweetDialog.open = true
			if (this.edit_dialog.type === 'create') {
				this.sweetDialog.title = '사용자 생성'
				this.sweetDialog.content = `사용자를 생성합니다.`
			} else {
				this.sweetDialog.title = '사용자 정보 저장'
				this.sweetDialog.content = `변경된 내용을
저장합니다.`
			}
		},
		clickSave() {
			if (this.edit_dialog.type === 'create') {
				this.create_user()
			} else {
				this.update_user()
			}
		},
		add_project() {
			// 프로젝트 추가
			if (this.edit_dialog.items[4].selectBox.value.length === 0) {
				return alert('프로젝트를 선택해주세요.')
			}
			let selected = JSON.parse(JSON.stringify(this.edit_dialog.items[4].selectBox.value))
			this.edit_dialog.items[5].chips.push(selected)
			this.edit_dialog.items[4].selectBox.items = this.able_projects()
			this.edit_dialog.items[4].selectBox.value = ''
		},
		delete_project() {
			// 프로젝트 삭제
			this.edit_dialog.items[4].selectBox.items = this.able_projects()
		},
		async create_user() {
			let role = ''

			if (this.edit_dialog.items[3].selectBox.value === '슈퍼마스터') {
				role = 1
			} else if (this.edit_dialog.items[3].selectBox.value === '분양소장') {
				role = 3
			} else if (this.edit_dialog.items[3].selectBox.value === '분양기획') {
				role = 4
			}

			let businesses = this.edit_dialog.items[5].chips.map(el => el.id)

			let variable = {
				email: `${this.edit_dialog.items[0].value}@xi.com`,
				username: this.edit_dialog.items[0].value,
				name: this.edit_dialog.items[1].value,
				password: this.edit_dialog.items[0].value,
				role: role, // 3:partner  3: marketing
				confirmed: true,
				language: 'ko',
				phone: this.edit_dialog.items[2].value,
				businesses: businesses,
			}
			await this.$store
				.dispatch('createUser', variable)
				.then(async () => {
					this.$store.state.loading = true
					await this.first_users_call()
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
				})
				.catch(() => {
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
				})
		},
		async update_user() {
			let role = ''

			if (this.edit_dialog.items[3].selectBox.value === '슈퍼마스터') {
				role = 1
			} else if (this.edit_dialog.items[3].selectBox.value === '분양소장') {
				role = 3
			} else if (this.edit_dialog.items[3].selectBox.value === '분양기획') {
				role = 4
			}

			let businesses = this.edit_dialog.items[5].chips.map(el => el.id)

			let variable = {
				id: this.edit_dialog.id,
				email: `${this.edit_dialog.items[0].value}@xi.com`,
				username: this.edit_dialog.items[0].value,
				password: this.edit_dialog.items[0].value,
				name: this.edit_dialog.items[1].value,
				role: role, // 3:partner  3: marketing
				confirmed: true,
				language: 'ko',
				phone: this.edit_dialog.items[2].value,
				businesses: businesses,
			}
			await this.$store
				.dispatch('updateUser', variable)
				.then(async () => {
					this.$store.state.loading = true
					await this.first_users_call()
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
				})
				.catch(() => {
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
				})
		},

		able_projects() {
			// 팝업 - 프로젝트 셀렉트 박스 아이템 세팅

			let able = this.$store.state.businesses_lists.filter(
				el => this.edit_dialog.items[5].chips.findIndex(item => item.id === el.id) === -1,
			)

			let able_map = able.map(el => {
				return { value: { id: el.id, title: el.title }, text: el.title }
			})
			return able_map
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
