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
						<txtField class="search_box" v-model="search_project" :txtField="search" @enter="reservedays_call()"></txtField>
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
				<span class="sub_header">예약/방문/상담관리 </span>
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
						@reservation_page="reservation_page"
						excelType="reservation"
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

		<!-- 사용자 생성/수정 alert ------ start -->
		<ReserveDialog :setdialog="edit_dialog" :reservedaysData="table.datatable.items" />
		<button id="refresh" @click="refresh()" style="display:none"></button>
		<!-- 사용자 생성/수정 alert ------ end -->
		<!-- 저장 확인 팝업 -->
		<QRDialog :setdialog="QRDialogData" />
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<sweetAlert :dialog="sweetInfo" />
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
import { btn, datatable, selectBox, txtField, DatepickerDialog, sweetAlert, QRDialog } from '@/components/index.js'
import html2canvas from 'html2canvas'
import downloadExcel from 'vue-json-excel'
import ReserveDialog from './ReserveDialog'
export default {
	components: { btn, downloadExcel, datatable, selectBox, txtField, DatepickerDialog, sweetAlert, ReserveDialog, QRDialog },
	data() {
		return {
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
			dateChice: true,
			datedisable: true,
			// --- 데이터 테이블 데이터 --``
			table: {
				datatable: {
					headers: [
						{ text: '프로젝트명', value: 'project_name' },
						{ text: '제목', value: 'title', width: '12%' },
						{ text: '진행기간', value: 'range', width: '13%' },
						{ text: '방문예약 확인', value: 'wating_check', width: '18%' },
						{ text: '방문등록 확인', value: 'reservation_check', width: '18%' },
						{ text: '상담사 화면', value: 'counselor_page' },
						{ text: '상담현황판', value: 'waiting_board' },
						{ text: '비고', align: 'center', value: 'etc_detail', width: '4%' },
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

			edit_dialog: {
				dialog: false,
				type: 'create',
				imgFile: '',
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
			QRDialogData: {
				code: '',
				title: '',
				dialog: false,
			},
		}
	},
	async created() {
		await this.first_reservedays_call()
	},
	computed: {},
	methods: {
		refresh() {
			if (this.searchActive) this.reservedays_call()
			else this.first_reservedays_call()
		},
		async first_reservedays_call() {
			this.$store.state.loading = true

			let variable = {
				type: 'd',
				status: 1,
			}

			await this.$store
				.dispatch('reservedays', variable)
				.then(res => {
					let reservedaysData = res.data.reservedays
					reservedaysData.forEach(el => {
						el['range_reserve'] = `${this.$moment(el.sdate).format('YYYY-MM-DD')} ~ ${this.$moment(el.edate).format('YYYY-MM-DD')}`
						if (el.input_box) {
							el['input_box_name'] = el.input_box.name
						}
						el['project_name'] = el.business.title
					})
					this.$store.state.loading = false
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
				type: 'd',
				status: 1,
			}

			this.$store.state.loading = true
			this.$store
				.dispatch('reservedays', variable)
				.then(res => {
					let reservedaysData = res.data.reservedays

					reservedaysData.forEach(el => {
						el['range_reserve'] = `${this.$moment(el.sdate).format('YYYY-MM-DD')} ~ ${this.$moment(el.seate).format('YYYY-MM-DD')}`

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
				{ text: '프로젝트명', value: 'project_name' },
				{ text: '제목', value: 'title', width: '12%' },
				{ text: '진행기간', value: 'range_reserve', width: '13%' },
				{ text: '방문예약 확인', value: 'wating_check', width: '18%' },
				{ text: '방문등록 확인', value: 'reservation_check', width: '18%' },
				{ text: '상담사 화면', value: 'counselor_page' },
				{ text: '상담현황판', value: 'waiting_board' },
				{ text: '비고', align: 'center', value: 'etc_edit', width: '4%' },
			]
			let tableItems = {
				datatable: {
					headers: headers,
					items: reservedaysData,
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
			this.search_project = ''
		},
		detailClick(item) {
			if (item) {
				// 데이터 테이블 - 자세히보기 클릭

				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'edit'
				this.edit_dialog.id = item.id
				this.edit_dialog.item = item
			} else {
				// 신규 생성
				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'create'
				this.edit_dialog.id = ''
			}
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
				username: this.edit_dialog.items[1].value,
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
					await this.first_reservedays_call()
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
				username: this.edit_dialog.items[1].value,
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
					await this.first_reservedays_call()
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

		reservation_page(item, type) {
			if (type === 'wating_check_url') {
				window.navigator.clipboard.writeText(process.env.VUE_APP_CUSTOMER_URL + '/reserve_day/' + item.code).then(() => {
					this.sweetInfo.open = true
					this.sweetInfo.title = '복사 완료'
					this.sweetInfo.content = `ctrl + v로 url을 확인하세요.`
				})
			} else if (type === 'wating_check_QR') {
				window.open(process.env.VUE_APP_CUSTOMER_URL + '/reserve_day/' + item.code)
			} else if (type === 'reservation_check_url') {
				window.navigator.clipboard.writeText(process.env.VUE_APP_CUSTOMER_URL + '/reserve_direct/' + item.code).then(() => {
					this.sweetInfo.open = true
					this.sweetInfo.title = '복사 완료'
					this.sweetInfo.content = `ctrl + v로 url을 확인하세요.`
				})
			} else if (type === 'reservation_check_QR') {
				window.open(process.env.VUE_APP_CUSTOMER_URL + '/reserve_direct/' + item.code)
			} else if (type === 'counselor_page_QR') {
				window.open(process.env.VUE_APP_CUSTOMER_URL + '/counselorlogin/' + item.code)
			} else if (type === 'counselor_page_url') {
				window.navigator.clipboard.writeText(process.env.VUE_APP_CUSTOMER_URL + '/counselorlogin/' + item.code).then(() => {
					this.sweetInfo.open = true
					this.sweetInfo.title = '복사 완료'
					this.sweetInfo.content = `ctrl + v로 url을 확인하세요.`
				})
			} else if (type === 'waiting_board_QR') {
				window.open(process.env.VUE_APP_CUSTOMER_URL + '/board/' + item.code)
			} else if (type === 'waiting_QR') {
				this.QRDialogData.dialog = true
				this.QRDialogData.code = process.env.VUE_APP_CUSTOMER_URL + '/reserve_day/' + item.code
				this.QRDialogData.title = item.title
			} else if (type === 'reservation_QR') {
				this.QRDialogData.dialog = true
				this.QRDialogData.code = process.env.VUE_APP_CUSTOMER_URL + '/reserve_direct/' + item.code
				this.QRDialogData.title = item.title
			} else {
				window.navigator.clipboard.writeText(process.env.VUE_APP_CUSTOMER_URL + '/board/' + item.code).then(() => {
					this.sweetInfo.open = true
					this.sweetInfo.title = '복사 완료'
					this.sweetInfo.content = `ctrl + v로 url을 확인하세요.`
				})
			}
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
