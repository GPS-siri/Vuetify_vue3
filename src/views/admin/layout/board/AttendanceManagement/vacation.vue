<template>
	<div style="width:100%; height: inherit; background-color:white;">
		<v-layout align-center class="padding_30px whith_header">
			<div class="main_title">
				연차관리
			</div>
			<div class="router_title ml-3">
				근태관리 > 연차관리
			</div>
		</v-layout>
		<!-- 헤더 제외 컨텐츠 영역  -->
		<div class="overflow_max_height" style="padding:0px 30px 30px; display:block; overflow-y:auto; overflow-x:hidden;">
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
				<v-layout align-center class="mt-2" justify-start>
					<div class="search_box" style="display:flex; width:fit-content; align-items: center;">
						<div class="search_title">
							상태
						</div>
						<div class="search_body" style="width:200px">
							<div style="width:200px" class="ml-3">
								<v-select class="search_select" v-model="status_filter.value" hideDetails :items="status_filter.items" outlined></v-select>
							</div>
						</div>
					</div>
					<div class="search_box ml-8" style="display:flex; width:fit-content; align-items: center;">
						<div class="search_title">
							구분
						</div>
						<div class="search_body" style="width:200px">
							<div style="width:200px" class="ml-3">
								<v-select class="search_select" v-model="type_filter.value" hideDetails :items="type_filter.items" outlined></v-select>
							</div>
						</div>
					</div>
				</v-layout>
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
								<DatepickerDialog :picker="date.start"></DatepickerDialog>
							</div>
							<div class="d-flex align-center mx-1">~</div>
							<div class="d-flex align-center date_picker" style="width:150px">
								<DatepickerDialog :picker="date.end"></DatepickerDialog>
							</div>
						</div>
					</v-layout>
				</v-layout>
			</div>
			<!-- 검색 / 초기화 버튼 -->
			<v-layout class="mt-8 pb-5 search_btn" justify-center align-center>
				<v-btn color="primary" style="width:120px; height:35px;" depressed @click="searchActive()">
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
							<v-layout align-center>
								<span style="font-size:12px;" class="mr-1">
									최소
								</span>
								<v-text-field
									class="text_field_1 search_select_small mr-1"
									v-model="vacation_input"
									hideDetails
									outlined
									type="number"
								></v-text-field>
								<span style="font-size:12px;" class="mr-1">
									일 전
								</span>
							</v-layout>
							<!-- <v-select
								class="search_select_small mr-1"
								v-model="status_selectBox.value"
								hideDetails
								:items="status_selectBox.items"
								outlined
							></v-select> -->

							<v-btn small outlined @click="updateSystemAction()">
								연차신청설정
							</v-btn>
						</div>
					</v-flex>
					<v-flex style="text-align: -webkit-right;">
						<v-layout align-center justify-end style="width:450px;">
							<div class="notice_change_div">
								<v-select
									class="search_select_small mr-1"
									v-model="status_selectBox_type_2.value"
									hideDetails
									:items="status_selectBox_type_2.items"
									outlined
								></v-select>
								<v-btn small outlined class="mr-2" @click="batchProcessingStatus()">
									변경
								</v-btn>
								<v-btn small outlined @click="setDialog.dialog = true">
									상담사 연차 직접 설정
								</v-btn>
							</div>
							<span style="font-size:12px; margin-left:10px; margin-right:10px;">
								|
							</span>
							<v-btn small outlined class="btn-style" color="green" @click="excelExport()">
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
					<template v-slot:[`item.data5`]="{ item }">
						<div v-if="item.data5 === '관리자설정'" class="">
							<v-select
								class="search_select"
								style="width:120px; color:red;"
								v-model="item.data5"
								hideDetails
								:items="status_selectBox_type_1.items"
								@change="change_table_status(item)"
								outlined
							></v-select>
						</div>
						<div v-else :class="item.data5 === '신청대기' ? 'search_select_red' : ''">
							<v-select
								class="search_select"
								style="width:120px; color:red;"
								v-model="item.data5"
								hideDetails
								:items="status_selectBox.items"
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
		<vacationAddDialog v-if="setDialog.dialog" :setDialog="setDialog"></vacationAddDialog>
		<!-- 소속회사 추가 dialog -->
		<saveDialog :dialog="save_dialog" :activeSave="active_save" />
	</div>
</template>

<script>
import { DatepickerDialog, saveDialog, vacationAddDialog } from '@/components'
import downloadExcel from 'vue-json-excel'

export default {
	components: { DatepickerDialog, downloadExcel, saveDialog, vacationAddDialog },
	watch: {
		setDialog: {
			deep: true,
			handler() {
				const data = {
					created_at_gte: this.$moment(this.date.start.date),
					created_at_lte: this.$moment(this.date.end.date),
				}
				this.vacationView(data)
				const data1 = { business: this.$store.state.meData.business.id }
				this.systemsView(data1)
			},
		},
	},
	created() {
		this.$store.state.loading = true
		// meData에 사업지 정보 있나 확인
		let interval = setInterval(() => {
			if (this.$store.state.meData.business) {
				const data = {
					created_at_gte: this.$moment(this.date.start.date),
					created_at_lte: this.$moment(this.date.end.date),
				}
				this.vacationView(data)
				const data1 = { business: this.$store.state.meData.business.id }
				this.systemsView(data1)
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
		async batchProcessingStatus() {
			for (let index = 0; index < this.table.selected.length; index++) {
				const element = this.table.selected[index]
				this.$store.state.loading = true
				let varibale = {
					id: element.id,
				}
				// 상태 값 정의
				// waiting - 신청대기
				// admin - 관리자설정
				// agree - 신청승인
				// disagree - 신청반려
				if (this.status_selectBox_type_2.value === '신청대기') {
					varibale['status'] = 'waiting'
					varibale.viewStatus = false
				} else if (this.status_selectBox_type_2.value === '관리자설정') {
					varibale['status'] = 'admin'
					varibale.viewStatus = true
				} else if (this.status_selectBox_type_2.value === '신청승인') {
					varibale['status'] = 'agree'
					varibale.viewStatus = true
				} else if (this.status_selectBox_type_2.value === '신청반려') {
					varibale['status'] = 'disagree'
					varibale.viewStatus = false
				}
				varibale.adminId = this.$store.state.meData.username
				varibale.adminName = this.$store.state.meData.name

				await this.updateVacationAction(varibale, element)

				if (this.table.selected.length - 1 === index) {
					this.$store.state.loading = false
					this.table.selected = []
					this.status_selectBox_type_2.value = ''
				}
			}
			// this.table.selected.forEach((element, index) => {
			// 	this.$store.state.loading = true
			// 	let varibale = {
			// 		id: element.id,
			// 	}
			// 	// 상태 값 정의
			// 	// waiting - 신청대기
			// 	// admin - 관리자설정
			// 	// agree - 신청승인
			// 	// disagree - 신청반려
			// 	if (this.status_selectBox_type_2.value === '신청대기') {
			// 		varibale['status'] = 'waiting'
			// 	} else if (this.status_selectBox_type_2.value === '관리자설정') {
			// 		varibale['status'] = 'admin'
			// 	} else if (this.status_selectBox_type_2.value === '신청승인') {
			// 		varibale['status'] = 'agree'
			// 	} else if (this.status_selectBox_type_2.value === '신청반려') {
			// 		varibale['status'] = 'disagree'
			// 	}
			// 	varibale.adminId = this.$store.state.meData.username
			// 	varibale.adminName = this.$store.state.meData.name
			// 	setTimeout(() => {
			// 		this.updateVacationAction(varibale, element)
			// 	}, 1000)
			// 	if (this.table.selected.length - 1 === index) {
			// 		this.$store.state.loading = false
			// 	}
			// })
		},
		updateSystemAction() {
			if (this.vacation_input !== '') {
				const data = {
					id: this.systemId,
					vacationReservation: Number(this.vacation_input),
				}
				this.$store
					.dispatch('updateSystem', data)
					.then(() => {
						this.save_dialog.open = true
						this.save_dialog.content = '성공적으로 저장했습니다.'
						this.save_dialog.btnTxt = '확인'
						this.$store.state.loading = false
					})
					.catch(err => {
						alert('오류가 발생했습니다.')

						console.log({ err })
						this.$store.state.loading = false
					})
			} else {
				this.save_dialog.content = '최소 일 수를 입력해주세요.'
				this.save_dialog.btnTxt = '확인'
				this.save_dialog.open = true
			}
		},

		systemsView(variable) {
			this.$store
				.dispatch('systems', variable)
				.then(res => {
					this.systemId = res.systems[0].id
					this.vacation_input = res.systems[0].vacationReservation
					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		statusValue(data) {
			if (data === 'waiting') {
				return '신청대기'
			} else if (data === 'admin') {
				return '관리자설정'
			} else if (data === 'agree') {
				return '신청승인'
			} else if (data === 'disagree') {
				return '신청반려'
			}
		},
		typeValue(data) {
			if (data === 'vacation') {
				return '연차'
			} else if (data === 'sick') {
				return '병가'
			} else if (data === 'afternoonVacation') {
				return '오후반차'
			} else if (data === 'morningVacation') {
				return '오전반차'
			} else if (data === 'etc') {
				return '기타'
			}
		},
		async vacationView(variable) {
			// 2023.03.31 전현균
			// 전체기간 조회를 위해서 데이트피커에 선택된 날짜가 없을 시에는 variable 에서 날짜 키 삭제
			if (!this.date.start.date) {
				delete variable.created_at_gte
			}
			if (!this.date.end.date) {
				delete variable.created_at_lte
			}

			this.$store.state.loading = true
			await this.$store
				.dispatch('vacations', variable)
				.then(res => {
					let vacation_items = []
					res.vacations.forEach(element => {
						if (element.users_permissions_user !== null) {
							vacation_items.push({
								id: element.id,
								userId: element.users_permissions_user.id,
								data1: element.users_permissions_user.name ? element.users_permissions_user.name : '-',
								data2: element.users_permissions_user.phone,
								data3: this.$moment(element.created_at).format('YYYY-MM-DD'),
								data4: element.vacationDate,
								data5: this.statusValue(element.status),
								data6: element.adminName ? element.adminName : '-',
								data7: this.typeValue(element.type),
								data8: element.comment,
							})
						}
					})
					this.table.items = vacation_items
					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		excelExport() {
			document.getElementById('clientExcel').click()
		},
		allowed_datesEnd(val) {
			if (this.date.start === '') {
				return val
			} else {
				val = this.$moment().format('YYYY-MM-DD') >= val
			}
			return val
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
		searchActive() {
			// 검색 버튼 클릭
			const data = {
				created_at_gte: this.$moment(this.date.start.date),
				created_at_lte: this.$moment(this.date.end.date),
			}
			if (this.search_keyword.value === '상담사 이름') {
				data.counselorName = this.search_keyword.input
			} else if (this.search_keyword.value === '연락처') {
				data.counselorPhone = this.search_keyword.input
			}
			if (this.status_filter.value !== '전체') {
				if (this.status_filter.value === '신청대기') {
					data.status = 'waiting'
				} else if (this.status_filter.value === '관리자설정') {
					data.status = 'admin'
				} else if (this.status_filter.value === '신청승인') {
					data.status = 'agree'
				} else if (this.status_filter.value === '신청반려') {
					data.status = 'disagree'
				}
			}
			if (this.type_filter.value !== '전체') {
				if (this.type_filter.value === '연차') {
					data.type = 'vacation'
				} else if (this.type_filter.value === '병가') {
					data.type = 'sick'
				} else if (this.type_filter.value === '오후반차') {
					data.type = 'afternoonVacation'
				} else if (this.type_filter.value === '오전반차') {
					data.type = 'morningVacation'
				} else if (this.type_filter.value === '기타') {
					data.type = 'etc'
				}
			}
			this.vacationView(data)
		},
		reset_filter() {
			this.search_keyword.value = '상담사 이름'
			this.search_keyword.input = ''
			this.status_filter.value = '전체'
			this.type_filter.value = '전체'
			this.date.value = '1주일'
			this.date.start.date = this.$moment()
				.subtract(6, 'd')
				.format('YYYY-MM-DD')
			this.date.end.date = this.$moment().format('YYYY-MM-DD')
			const data = {
				created_at_gte: this.$moment(this.date.start.date),
				created_at_lte: this.$moment(this.date.end.date),
			}
			this.vacationView(data)
		},

		async active_save() {
			this.save_dialog.open = true
			this.save_dialog.content = '등록을 완료했습니다.'
			this.save_dialog.btnTxt = '확인'
		},

		async change_table_status(item) {
			// 테이블에서 상태값 변경
			this.$store.state.loading = true
			let varibale = {
				id: item.id,
			}
			// 상태 값 정의
			// waiting - 신청대기
			// admin - 관리자설정
			// agree - 신청승인
			// disagree - 신청반려
			if (item.data5 === '신청대기') {
				varibale['status'] = 'waiting'
			} else if (item.data5 === '관리자설정') {
				varibale['status'] = 'admin'
				varibale.viewStatus = true
			} else if (item.data5 === '신청승인') {
				varibale['status'] = 'agree'
				varibale.viewStatus = true
			} else if (item.data5 === '신청반려') {
				varibale['status'] = 'disagree'
				varibale.viewStatus = false
			}
			varibale.adminId = this.$store.state.meData.username
			varibale.adminName = this.$store.state.meData.name

			this.updateVacationAction(varibale, item)
			this.$store.state.loading = false
		},
		async updateVacationAction(data, item) {
			this.$store.state.loading = true
			await this.$store
				.dispatch('updateVacation', data)
				.then(async res => {
					this.$store.state.loading = false
					if (data.status === 'agree' || data.status === 'admin') {
						const data = {
							date: this.$moment(item.data4).format('YYYY-MM-DD'),
							users_permissions_user: item.userId,
						}
						if (item.data7 === '연차') {
							data.status = 'vacation'
						} else if (item.data7 === '병가') {
							data.status = 'sick'
						} else if (item.data7 === '오후반차') {
							data.status = 'afternoonVacation'
						} else if (item.data7 === '오전반차') {
							data.status = 'morningVacation'
						} else if (item.data7 === '기타') {
							data.status = 'etc'
						}
						data.business = this.$store.state.meData.business.id
						data.vacation = res.updateVacation.vacation.id

						await this.createGotoworkAction(data)
					} else {
						if (res.updateVacation.vacation.gotowork) {
							const data = {
								id: res.updateVacation.vacation.gotowork.id,
							}
							this.deleteGotoworkAction(data)
						}
					}
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		async createGotoworkAction(data) {
			await this.$store
				.dispatch('createGotowork', data)
				.then(() => {
					const data = {
						created_at_gte: this.$moment(this.date.start.date),
						created_at_lte: this.$moment(this.date.end.date),
					}
					this.vacationView(data)
					const data1 = { business: this.$store.state.meData.business.id }
					this.systemsView(data1)
				})
				.catch(err => {
					console.log({ err })
				})
		},
		deleteGotoworkAction(data) {
			this.$store
				.dispatch('deleteGotowork', data)
				.then(() => {
					const data = {
						created_at_gte: this.$moment(this.date.start.date),
						created_at_lte: this.$moment(this.date.end.date),
					}
					this.vacationView(data)
					const data1 = { business: this.$store.state.meData.business.id }
					this.systemsView(data1)
				})
				.catch(err => {
					console.log({ err })
				})
		},
	},
	data() {
		return {
			setDialog: {
				dialog: false,
			},
			systemId: null,
			table: {
				headers: [
					{ text: '이름', value: 'data1', align: 'center' },
					{ text: '연락처', value: 'data2', align: 'center' },
					{ text: '신청일자', value: 'data3', align: 'center' },
					{ text: '희망일자', value: 'data4', align: 'center' },
					{ text: '상태', value: 'data5', align: 'centcreateder', width: '140px' },
					{ text: '승인자', value: 'data6', align: 'center' },
					{ text: '구분', value: 'data7', align: 'center' },
					{ text: '사유', value: 'data8', align: 'center' },
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
				value: '상담사 이름',
				items: ['상담사 이름', '연락처'],
				input: '',
			},
			vacation_input: 0,
			status_filter: {
				// waiting - 신청대기
				// admin - 관리자설정
				// agree - 신청승인
				// disagree - 신청반려
				value: '전체',
				items: ['전체', '신청대기', '관리자설정', '신청승인', '신청반려'],
				input: '',
			},

			type_filter: {
				value: '전체',
				items: ['전체', '연차', '병가', '오후반차', '오전반차', '기타'],
				input: '',
			},

			modify_Yn: false,

			date: {
				value: '전체',
				start: {
					date: '',
				},
				end: { date: '' },
			},

			status_selectBox: {
				// 공개 여부 필터
				value: '',
				items: ['신청승인', '신청반려', '신청대기'],
				input: '',
			},
			status_selectBox_type_1: {
				// 공개 여부 필터
				value: '',
				items: ['신청반려', '관리자설정'],
				input: '',
			},
			status_selectBox_type_2: {
				// 공개 여부 필터
				value: '',
				items: ['신청승인', '신청반려', '신청대기'],
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
	font-weight: bold;
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
.search_select_red {
	div {
		div {
			div {
				div {
					div {
						color: red;
					}
				}
			}
		}
	}
}

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
	width: 200px;
	margin-left: 10px;
	div {
		.v-input__slot {
			min-height: 35px !important;
			height: 35px;
			padding: 0 10px !important;
		}
	}
}
.text_field_1 {
	width: 100px;
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
