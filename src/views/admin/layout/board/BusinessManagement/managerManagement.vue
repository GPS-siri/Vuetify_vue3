<template>
	<div style="width:100%; height: inherit; background-color:white;">
		<v-layout align-center class="padding_24px whith_header">
			<div class="main_title">
				관리자 리스트
			</div>
			<div class="router_title ml-3">
				사업지관리 > 관리자 리스트
			</div>
		</v-layout>
		<!-- 헤더 제외 컨텐츠 영역  -->
		<div class="overflow_max_height mt-4" style="padding:0px 24px 24px; display:block; overflow-y:auto; overflow-x:hidden;">
			<!-- 필터 영역 -->
			<div>
				<!-- 필터 검색 1 -->
				<v-layout align-center>
					<v-layout align-center class="search_box">
						<div class="search_title">
							검색어
						</div>
						<div class="search_body">
							<div style="width:200px" class="ml-3">
								<v-select
									class="search_select"
									v-model="search_keyword.value"
									hideDetails
									:items="search_keyword.items"
									outlined
									@change="search_keyword.input = ''"
									placeholder="검색어 입력"
								></v-select>
							</div>
							<div style="width:200px" class="ml-3">
								<v-text-field
									class="text_field"
									:disabled="search_keyword.value ? false : true"
									v-model="search_keyword.input"
									hideDetails
									outlined
								></v-text-field>
							</div>
						</div>
					</v-layout>
				</v-layout>
				<!-- 필터 검색 2 -->
				<v-layout align-center class="mt-2">
					<v-layout align-center class="search_box">
						<div class="search_title">
							작성일
						</div>
						<div class="search_body2">
							<div class="ml-3">
								<v-btn
									:outlined="date.value === '오늘' ? false : true"
									:color="date.value === '오늘' ? 'primary' : ''"
									@click="changeDate('오늘')"
									depressed
								>
									오늘
								</v-btn>
								<v-btn
									:outlined="date.value === '1주일' ? false : true"
									class="ml-2"
									:color="date.value === '1주일' ? 'primary' : ''"
									@click="changeDate('1주일')"
									depressed
								>
									1주일
								</v-btn>
								<v-btn
									:outlined="date.value === '15일' ? false : true"
									class="ml-2"
									:color="date.value === '15일' ? 'primary' : ''"
									@click="changeDate('15일')"
									depressed
								>
									15일
								</v-btn>
								<v-btn
									:outlined="date.value === '1개월' ? false : true"
									class="ml-2"
									:color="date.value === '1개월' ? 'primary' : ''"
									@click="changeDate('1개월')"
									depressed
								>
									1개월
								</v-btn>
								<v-btn
									:outlined="date.value === '3개월' ? false : true"
									class="ml-2"
									:color="date.value === '3개월' ? 'primary' : ''"
									@click="changeDate('3개월')"
									depressed
								>
									3개월
								</v-btn>
								<v-btn
									:outlined="date.value === '전체' ? false : true"
									class="ml-2"
									:color="date.value === '전체' ? 'primary' : ''"
									@click="changeDate('전체')"
									depressed
								>
									전체
								</v-btn>
							</div>
							<div class="d-flex align-center date_picker ml-3" style="width:150px">
								<DatepickerDialog :picker="date.start" :allowed_dates="allowed_datesStart"> </DatepickerDialog>
							</div>
							<div class="d-flex align-center mx-1">~</div>
							<div class="d-flex align-center date_picker" style="width:150px">
								<DatepickerDialog :picker="date.end" :allowed_dates="allowed_datesEnd" @change="endDate_change()"></DatepickerDialog>
							</div>
						</div>
					</v-layout>
				</v-layout>
				<!-- 필터 검색 3 -->
				<v-layout align-center class="mt-2" justify-start>
					<div class="search_box" style="display:flex; width:fit-content; align-items: center;">
						<div class="search_title">
							공개여부
						</div>
						<div class="search_body" style="width:200px">
							<div style="width:200px" class="ml-3">
								<v-select class="search_select" v-model="status_filter.value" hideDetails :items="status_filter.items" outlined></v-select>
							</div>
						</div>
					</div>
					<div class="search_box ml-8" style="display:flex; width:fit-content; align-items: center;">
						<div class="search_title">
							회사
						</div>
						<div class="search_body" style="width:200px">
							<div style="width:200px" class="ml-3">
								<v-select
									class="search_select"
									v-model="constructor_filter.value"
									hideDetails
									:items="constructor_filter.items"
									outlined
								></v-select>
							</div>
						</div>
					</div>
				</v-layout>
			</div>
			<!-- 검색 / 초기화 버튼 -->
			<v-layout class="mt-8 pb-5 search_btn" justify-center align-center>
				<v-btn color="primary" style="width:120px; height:35px;" depressed @click="filtered_users()">
					검색
				</v-btn>
				<v-btn class="ml-3" outlined depressed style="width:120px; height:35px;" @click="reset_filter()">
					초기화
				</v-btn>
			</v-layout>

			<!-- 데이터 테이블 영역 -->
			<div class="table_box_normal mt-5">
				<!-- 데이터 테이블 상단 검색결과 / 버튼 영역 -->
				<v-layout justify-space-between align-center>
					<v-flex xs6 style="display:flex; ">
						<span class="pt-1" style="font-size:12px;"> 검색결과 총 {{ table.items.length }} 건 </span>
						<span class="mx-2 pt-1" style="font-size:12px;">| </span>

						<div class="notice_change_div">
							<v-select
								class="search_select_small mr-1"
								v-model="company_change_selectBox.value"
								hideDetails
								:items="company_change_selectBox.items"
								outlined
							></v-select>

							<v-btn small outlined @click="apply_check()">
								소속회사 적용
							</v-btn>
							<v-btn class="ml-2" small outlined @click="open_add()">
								회사 추가하기
							</v-btn>
						</div>
					</v-flex>
					<v-flex style="text-align: -webkit-right;">
						<v-layout align-center justify-end style="width:450px;">
							<v-btn class="mr-2" small rounded outlined color="primary" @click="check_delete()">
								관리자 삭제
							</v-btn>

							<span style="font-size:12px; margin-left:10px; margin-right:10px;">
								|
							</span>
							<!-- <v-select
							style="max-width:200px;"
							dense
							v-model="search_keyword.value"
							hideDetails
							:items="search_keyword.items"
							outlined
						></v-select> -->

							<v-btn small outlined class="btn-style ml-3" color="green" @click="excelExport()">
								<img src="@/assets/images/excel-img2.png" />
								엑셀파일 다운로드
							</v-btn>
						</v-layout>
					</v-flex>
				</v-layout>
				<!-- 데이터테이블 -->
				<v-data-table
					v-model="table.selected"
					show-select
					:headers="table.headers"
					:items="table.items"
					item-key="id"
					class="elevation-0 table_style_normal mt-2"
					:footer-props="{
						['items-per-page-text']: ``,
					}"
				>
					<!-- 상태 -->
					<template v-slot:[`item.status`]="{ item }">
						<div>
							<v-select
								class="search_select"
								style="width:120px"
								v-model="item.status"
								hideDetails
								:items="table_show_items"
								@change="change_table_status(item)"
								outlined
							></v-select>
						</div>
					</template>
				</v-data-table>
				<download-excel
					class="btn btn-default"
					id="clientExcel"
					:data="table.selected"
					style="display:none"
					:fields="table.json_fields"
					type="text/csv;charset=utf8"
					worksheet="My Worksheet"
					name="관리자_리스트.xls"
				>
				</download-excel>
			</div>
		</div>
		<!-- 삭제 dialog -->
		<saveDialog :dialog="delete_dialog" :activeSave="active_delete" />

		<!-- 소속회사 추가 dialog -->
		<saveDialog :dialog="save_dialog" :activeSave="active_save" />

		<!-- 소속회사 적용 dialog -->
		<saveDialog :dialog="apply_dialog" :activeSave="active_apply" />

		<!-- 불가 다이어로그 -->
		<saveDialog :dialog="reject_alert" />

		<!-- 수정/생성 정보 다이어로그 -->
		<constructorAddDialog :dialog="constructor_add_dialog" :activeSave="check_edit_save" />
	</div>
</template>

<script>
import { DatepickerDialog, saveDialog, constructorAddDialog } from '@/components'
import downloadExcel from 'vue-json-excel'
export default {
	components: { DatepickerDialog, downloadExcel, saveDialog, constructorAddDialog },
	async created() {
		this.$store.state.loading = true
		await this.me()
		// meData에 사업지 정보 있나 확인
		let interval = setInterval(() => {
			if (this.$store.state.meData.business) {
				this.users()
				if (this.$store.state.meData.business.constructors && this.$store.state.meData.business.constructors.length > 0) {
					// 사업지에 회사 리스트 있을 시 회사 셀렉트 박스에 회사 추가
					let constructors = ['전체']
					let constructors_change = []
					this.$store.state.meData.business.constructors.forEach(el => {
						constructors.push(el.name)
						constructors_change.push(el.name)
					})
					this.constructor_filter.items = constructors
					this.company_change_selectBox.items = constructors_change
					this.company_change_selectBox.value = constructors_change[0]
				}
				clearInterval(interval)
			}
		}, 1000)

		// 5초동안 없을 시 오류 alert
		setTimeout(() => {
			if (!this.$store.state.meData.business) {
				clearInterval(interval)
				this.$store.state.loading = false
				alert('다시 로그인 후 확인해 주세요')
			}
			this.$store.state.loading = false
		}, 5000)
	},
	mounted() {},
	methods: {
		async me() {
			await this.$store
				.dispatch('me')
				.then(res => {
					this.meData = res
					if (res.role.name !== 'superAdmin') {
						this.$router.push({ name: 'block' })
						sessionStorage.removeItem('here-t')
					}
				})
				.catch(err => {
					this.$router.push({ name: 'block' })
					console.log({ err })
				})
		},

		async users(variable) {
			let input
			if (variable) {
				input = variable
			} else {
				input = {
					business: this.$store.state.meData.business.id,
					role: 1,
				}
			}
			this.$store.state.loading = true

			this.call_variable = input
			await this.$store
				.dispatch('users', input)
				.then(res => {
					let users_item = res.users

					if (input.blocked_false) {
						users_item = users_item.filter(items => items.blocked !== true)
					}

					users_item.forEach(el => {
						// 상태 값 정의
						// 비활성화 - confiremd = true,  blocked = true
						// 활성화 - confiremd = true,  block = false
						// 승인요청 - confiremd = false

						if (!el.confirmed) {
							el['status'] = '승인요청'
						} else {
							if (el.blocked) {
								el['status'] = '비활성화'
							} else {
								el['status'] = '활성화'
							}
							el['create_time'] = this.$moment(el.created_at).format('YYYY-MM-DD HH:mm:ss')
						}

						if (!el.companyName) {
							el['companyName'] = '-'
						}
					})

					this.table.items = users_item
					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		excelExport() {
			if (this.table.selected.length === 0) {
				this.reject_alert.open = true
			} else {
				document.getElementById('clientExcel').click()
			}
		},
		allowed_datesEnd(val) {
			if (this.date.start === '') {
				return val
			} else {
				val = this.$moment().format('YYYY-MM-DD') >= val
			}
			return val
		},
		allowed_datesStart(val) {
			if (this.date.end === '') {
				return val
			} else {
				val = this.date.end.date >= val
			}
			return val
		},
		endDate_change() {
			if (this.date.start.date > this.date.end.date) {
				this.date.start.date = this.$moment(this.date.end.date)
					.subtract(1, 'day')
					.format('YYYY-MM-DD')
			}
		},

		changeDate(value) {
			this.date.value = value
			if (value === '오늘') {
				this.date.start.date = this.$moment().format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '1주일') {
				this.date.start.date = this.$moment()
					.subtract(7, 'days')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '15일') {
				this.date.start.date = this.$moment()
					.subtract(15, 'days')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '1개월') {
				this.date.start.date = this.$moment()
					.subtract(1, 'month')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '3개월') {
				this.date.start.date = this.$moment()
					.subtract(3, 'month')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '전체') {
				this.date.start.date = ''
				this.date.end.date = ''
			}
		},
		filtered_users() {
			// 검색 버튼 클릭
			let variable = {
				business: this.$store.state.meData.business.id,
				role: 1,
				name: this.search_keyword.value === '이름' ? this.search_keyword.input : '',
				phone: this.search_keyword.value === '연락처' ? this.search_keyword.input : '',
				email: this.search_keyword.value === '이메일' ? this.search_keyword.input : '',
			}

			// 상태 여부
			if (this.status_filter.value === '승인요청') {
				variable['confirmed'] = false
			} else if (this.status_filter.value === '활성화') {
				variable['confirmed'] = true
				variable['blocked_false'] = true
			} else if (this.status_filter.value === '비활성화') {
				variable['blocked'] = true
				variable['confirmed'] = true
			}
			// 회사명
			if (this.constructor_filter.value !== '전체') {
				variable['companyName'] = this.constructor_filter.value
			}

			if (this.date.value !== '전체') {
				// 생성일
				variable['created_at_gte'] = this.$moment(this.date.start.date)
				variable['created_at_lte'] = this.$moment(this.date.end.date).add(1, 'day')
			}

			this.users(variable)
		},
		reset_filter() {
			this.search_keyword.value = ''
			this.search_keyword.input = ''
			this.date.value = '오늘'
			this.date.start.date = this.$moment().format('YYYY-MM-DD')
			this.date.end.date = this.$moment().format('YYYY-MM-DD')
			this.status_filter.value = '전체'
			this.constructor_filter.value = '전체'
			this.modify_Yn = false
		},
		async updateUser(varibale) {
			// 관리자 수정
			this.$store.state.loading = true
			await this.$store
				.dispatch('updateUser', varibale)
				.then(() => {
					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},

		check_delete() {
			// 삭제 버튼 클릭
			if (this.table.selected.length > 0) {
				this.delete_dialog.open = true
				this.delete_dialog.content = '선택한 관리자를 삭제하시겠습니까?'
				this.delete_dialog.btnTxt = '삭제'
			} else {
				this.reject_alert.open = true
				this.reject_alert.content = '삭제할 관리자를 선택해주세요'
			}
		},

		async active_delete() {
			// 삭제 실행
			if (this.delete_dialog.btnTxt === '삭제') {
				this.delete_dialog.open = false

				this.$store.state.loading = true
				// 실제 업데이트
				for (let index = 0; index < this.table.selected.length; index++) {
					let varibale = {
						id: this.table.selected[index].id,
						business: null,
						blocked: true,
						confirmed: false,
					}
					await this.updateUser(varibale)
				}

				for (let index = 0; index < this.table.selected.length; index++) {
					// 변경된 사항 적용

					let delete_index = this.table.items.findIndex(el => el.id === this.table.selected[index].id)

					this.table.items.splice(delete_index, 1)
				}

				this.$store.state.loading = false
				this.table.selected = []

				this.delete_dialog.open = true
				this.delete_dialog.content = '성공적으로 삭제했습니다.'
				this.delete_dialog.btnTxt = '확인'
			} else {
				this.delete_dialog.open = false
			}
		},
		open_add() {
			// 소속회사 추가 창 열기
			this.constructor_add_dialog.type = 'add'
			this.constructor_add_dialog.id = null
			this.constructor_add_dialog.name = ''
			this.constructor_add_dialog.companyNumber = ''
			this.constructor_add_dialog.file = {
				id: null,
				file: null,
				name: '',
				url: '',
				fileUpload: false,
			}

			this.constructor_add_dialog.open = true
		},

		check_edit_save() {
			// 소속회사 추가 저장 시 빈값 체크
			if (!this.constructor_add_dialog.name) {
				return alert('회사명을 입력해주세요')
			} else if (this.company_change_selectBox.items.filter(el => el === this.constructor_add_dialog.name).length > 0) {
				return alert('이미 등록된 회사명입니다.')
			} else if (!this.constructor_add_dialog.companyNumber) {
				return alert('사업자등록번호를 입력해주세요')
			} else if (!this.constructor_add_dialog.file.file) {
				return alert('사업자등록증을 업로드해주세요')
			}

			this.save_dialog.open = true
			this.save_dialog.content = '관리자 소속 회사를 추가하시겠습니까?'
			this.save_dialog.btnTxt = '저장'
		},
		async active_save() {
			// 소속회사 추가
			this.save_dialog.open = false
			if (this.save_dialog.btnTxt !== '저장') {
				return
			}

			this.$store.state.loading = true

			// 소속회사의 사업자등록증 업로드
			await this.$store
				.dispatch('upload', { files: this.constructor_add_dialog.file.file })
				.then(async res => {
					let constructors
					if (this.$store.state.meData.business.constructors && this.$store.state.meData.business.constructors.length > 0) {
						constructors = this.$store.state.meData.business.constructors
					} else {
						constructors = []
					}

					constructors.push({
						name: this.constructor_add_dialog.name,
						companyNumber: this.constructor_add_dialog.companyNumber,
						file: res.data[0].url,
					})

					let update_business_data = {
						id: this.$store.state.meData.business.id,
						constructors: constructors,
					}
					// 사업지에 소속회사 추가
					await this.$store
						.dispatch('updateBusiness', update_business_data)
						.then(() => {
							this.save_dialog.open = true
							this.save_dialog.content = '등록을 완료했습니다.'
							this.save_dialog.btnTxt = '확인'

							this.constructor_filter.items.push(this.constructor_add_dialog.name)
							this.company_change_selectBox.items.push(this.constructor_add_dialog.name)
							if (!this.company_change_selectBox.value) {
								this.company_change_selectBox.value = this.constructor_add_dialog.name
							}

							this.$store.state.loading = false

							this.constructor_add_dialog.open = false
						})
						.catch(err => {
							console.log({ err })
							this.constructor_add_dialog.open = false
							this.$store.state.loading = false
						})
				})
				.catch(err => {
					console.log({ err })
					this.constructor_add_dialog.open = false
					this.$store.state.loading = false
				})
		},
		apply_check() {
			// 소속회사 적용  체크
			if (!this.company_change_selectBox.value) {
				this.reject_alert.open = true
				this.reject_alert.content = '적용할 회사를 선택해주세요.'
			} else if (this.table.selected.length === 0) {
				this.reject_alert.open = true
				this.reject_alert.content = '회사를 적용할 공지사항을 선택해주세요.'
			} else {
				this.apply_dialog.open = true
				this.apply_dialog.content = '관리자의 소속 회사를 적용하시겠습니까?'
				this.apply_dialog.btnTxt = '저장'
			}
		},
		async active_apply() {
			// 소속회사 적용
			this.$store.state.loading = true
			for (let index = 0; index < this.table.selected.length; index++) {
				let varibale = {
					id: this.table.selected[index].id,
					companyName: this.company_change_selectBox.value,
				}

				await this.updateUser(varibale)
			}

			for (let index = 0; index < this.table.selected.length; index++) {
				this.table.selected[index].companyName = this.company_change_selectBox.value
			}

			this.table.selected = []

			this.$store.state.loading = false
			this.apply_dialog.open = false
		},
		async change_table_status(item) {
			// 테이블에서 상태값 변경
			this.$store.state.loading = true
			let varibale = {
				id: item.id,
			}
			// 상태 값 정의
			// 비활성화 - confiremd = true,  blocked = true
			// 활성화 - confiremd = true,  block = false
			// 승인요청 - confiremd = false

			if (item.status === '승인요청') {
				varibale['confirmed'] = false
				varibale['blocked'] = false
			} else if (item.status === '활성화') {
				varibale['confirmed'] = true
				varibale['blocked'] = false
			} else if (item.status === '비활성화') {
				varibale['confirmed'] = true
				varibale['blocked'] = true
			}

			if (item.status === '승인요청') {
				item.create_time = ''
			} else {
				item.create_time = this.$moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
			}
			await this.updateUser(varibale)
			this.$store.state.loading = false
		},
	},
	data() {
		return {
			table: {
				headers: [
					{ text: '이름', value: 'name', align: 'center' },
					{ text: '연락처', value: 'phone', align: 'center' },
					{ text: '이메일', value: 'email', align: 'center' },
					{ text: '등록일', value: 'create_time', align: 'center' },
					{ text: '상태', value: 'status', align: 'center', width: '140px' },
					{ text: '소속회사', value: 'companyName', align: 'center' },
				],
				headerCheck: false,
				items: [],
				selected: [],
				json_fields: {
					이름: 'name',
					연락처: 'phone',
					이메일: 'email',
					등록일: 'create_time',
					상태: 'status',
					소속회사: 'companyName',
				},
			},
			search_keyword: {
				// 이름 / 연락처 / 이메일 필터
				value: '',
				items: ['이름', '연락처', '이메일'],
				input: '',
			},

			status_filter: {
				// 상태 필터
				value: '전체',
				items: ['전체', '승인요청', '활성화', '비활성화'],
				input: '',
			},

			constructor_filter: {
				// 회사 필터
				value: '전체',
				items: ['전체'],
				input: '',
			},

			modify_Yn: false,

			date: {
				value: '전체',
				start: {
					date: '',
				},
				end: {
					date: '',
				},
			},

			company_change_selectBox: {
				// 공개 여부 필터
				value: '',
				items: [],
				input: '',
			},

			table_show_items:
				// 테이블 상태 필터
				['승인요청', '활성화', '비활성화'],

			delete_dialog: {
				//  삭제 dialog
				open: false,
				content: '선택한 관리자를 삭제하시겠습니까?',
				btnTxt: '삭제',
				activeBtn: true,
			},

			save_dialog: {
				//  저장 dialog
				open: false,
				content: '수정한 내용을 저장하시겠습니까?',
				btnTxt: '저장',
				activeBtn: true,
			},

			apply_dialog: {
				//  저장 dialog
				open: false,
				content: '관리자의 소속 회사를 적용하시겠습니까?',
				btnTxt: '저장',
				activeBtn: true,
			},

			constructor_add_dialog: {
				//  추가/수정 dialog
				open: false,
				btnTxt: '저장',
				type: 'add',

				name: '',
				companyNumber: '',
				file: {
					id: null,
					file: null,
					name: '',
					url: '',
					fileUpload: false,
				},
			},
			reject_alert: {
				//  엑셀 저장 alert
				open: false,
				content: '엑셀 다운로드 받을 관리자를 선택해주세요.',
				cancelBtnTxt: '확인',
				cancelBtn: true,
			},
			call_variable: {
				// 호출 variable 저장
			},
		}
	},
}
</script>
<style lang="scss" scoped>
.main_title {
	font-size: 20px;
}
.router_title {
	font-size: 12px;
	font-weight: 100;
}
.search_box {
	width: 800px;
}
.search_title {
	width: 100px;
	font-size: 12px;
}
.search_body {
	display: flex;
	align-items: center;
	width: 600px;
}
.search_body2 {
	display: flex;
	align-items: center;
}
.search_btn {
	border-bottom: 1px solid #eaeaea;
}
.table_box_normal {
	width: unset !important;
}
.btn-style {
	box-shadow: none;
	background-color: #ffffff;
	border: 1px solid #9a9c9b;
	border-radius: 5px;
}
</style>
<style lang="scss">
.search_select {
	div {
		.v-input__slot {
			height: 35px !important;
			max-height: 35px !important;
			min-height: 35px !important;
			div {
				.v-input__append-inner {
					margin-top: 6px;
				}
			}
		}
	}
}
.text_field {
	width: 193px;
	margin-left: 10px;
	div {
		.v-input__slot {
			min-height: 35px !important;
			height: 35px;
			padding: 0 10px !important;
		}
	}
}
.date_picker {
	div {
		div {
			.v-input__slot {
				min-height: 35px !important;
				height: 35px !important;
			}
		}
	}
}

.table_style_normal > .v-data-table__wrapper {
	overflow: auto;
	table {
		border-right: 1px solid #d1d1d1;
		border-left: 1px solid #d1d1d1;
		border-bottom: 1px solid #d1d1d1;
		thead {
			tr {
				z-index: 1;
				th:not(:last-of-type) {
					border-right: 1px solid #d1d1d1;
				}
				th {
					text-align: center !important;
					color: #333333;
					height: 53px;
					border-top: 1px solid #7d7d7d !important;
					border-bottom: 1px solid #7d7d7d !important;
					background-color: #f5f5f5 !important;
				}
			}
		}
	}
}

.table_style_normal > .v-data-table__wrapper > table {
	tbody {
		tr {
			td:not(:last-of-type) {
				border-right: 1px solid #d1d1d1;
			}
			td {
				height: 50px;
				text-align: center !important;
				background-color: #ffffff !important;
			}
		}
	}
}
// .table_style_normal {
// 	.v-data-footer {
// 		display: flex;
// 		justify-content: center;
// 		.v-data-footer__select {
// 			margin-left: 0;
// 		}
// 	}
// }
.table_box_normal {
	div {
		.v-data-table__wrapper::-webkit-scrollbar {
			width: 12px;
			height: 12px;
		}
	}
}
.table_box_normal {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-thumb {
			background-color: #ced4d7;
			border-radius: 10px;
			background-clip: padding-box;
			border: 2px solid transparent;
		}
	}
}
.table_box_normal {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-track {
			background-color: transparent;
			border-radius: 10px;
			box-shadow: inset 0px 0px 5px white;
			// margin-left: 865px;
		}
	}
}
.table_style_normal .v-data-footer {
	border-top: unset !important;
}
</style>
