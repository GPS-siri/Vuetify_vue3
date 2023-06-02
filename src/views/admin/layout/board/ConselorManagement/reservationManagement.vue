<template>
	<div style="width:100%;">
		<v-layout align-center>
			<div class="main_title">
				상담예약 리스트
			</div>
			<div class="router_title ml-3">
				상담사 관리 > 상담예약 리스트
			</div>
		</v-layout>
		<!-- 헤더 제외 컨텐츠 영역  -->
		<!-- 필터 영역 -->
		<div class="mt-10">
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
			<v-layout align-center class="mt-3">
				<v-layout align-center class="search_box">
					<div class="search_title">
						상담일
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
							<DatepickerDialog :picker="date.start" :allowed_dates="allowed_datesStart"></DatepickerDialog>
						</div>
						<div class="d-flex align-center mx-1">~</div>
						<div class="d-flex align-center date_picker" style="width:150px">
							<DatepickerDialog :picker="date.end" :allowed_dates="allowed_datesEnd"></DatepickerDialog>
						</div>
					</div>
				</v-layout>
			</v-layout>
			<!-- 필터 검색 3 -->
			<v-layout align-center class="mt-3" justify-start>
				<div class="search_box" style="display:flex; width:fit-content; align-items: center;">
					<div class="search_title">
						상태
					</div>
					<div class="search_body" style="width:200px">
						<div class="ml-3">
							<v-select
								class="search_select"
								style="width:200px"
								v-model="status_filter.value"
								hideDetails
								:items="status_filter.items"
								outlined
							></v-select>
						</div>
					</div>
				</div>
				<div class="search_box ml-8" style="display:flex; width:fit-content; align-items: center;">
					<div class="search_title" style="width:60px">
						팀구분
					</div>
					<div class="search_body" style="width:200px">
						<div style="display:flex" class="ml-3">
							<v-select
								class="search_select"
								v-model="team_filter.value"
								hideDetails
								:items="team_filter.items"
								outlined
								style="width:200px;"
								@change="team_change()"
								return-object
							></v-select>
							<v-select
								class="search_select ml-2"
								v-model="rank_filter.value"
								hideDetails
								:items="rank_filter.items"
								outlined
								return-object
								style="width:200px;"
							></v-select>
						</div>
					</div>
				</div>
			</v-layout>
		</div>
		<!-- 검색 / 초기화 버튼 -->
		<v-layout class="mt-8 pb-5 search_btn" justify-center align-center>
			<v-btn color="primary" style="width:120px; height:35px;" depressed @click="filtered_reservations()">
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
				</v-flex>

				<!-- 엑셀 다운로드 -->
				<v-flex style="text-align: -webkit-right;">
					<v-layout align-center justify-end style="width:450px;">
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
				class="counsel_list_table elevation-0 table_style_normal mt-2"
				:footer-props="{
					['items-per-page-text']: ``,
				}"
			>
				<!-- 팀구분 -->
				<template v-slot:[`item.team`]="{ item }">
					<v-layout wrap style="height: 100%;">
						<v-flex xs6 class="border_right text_center">
							<div class="pr-4" style="width:100%; text-align: start;">
								{{ item.team.split('_')[0] }}
							</div>
						</v-flex>
						<v-flex xs6 class="text_center">
							<div class="pl-4" style="width:100%; text-align: start;">
								{{ item.team.split('_')[1] }}
							</div>
						</v-flex>
					</v-layout>
				</template>

				<!--상담일시 -->
				<template v-slot:[`item.reservation_time`]="{ item }">
					<v-layout style="height:100%">
						<div class="px-4 border_right text_center" style="width:110px">
							{{ item.reservation_time.date }}
						</div>
						<div class="px-4 border_right text_center" style="width:70px" v-for="(time, index) in item.reservation_time.times" :key="index">
							{{ time }}
						</div>
					</v-layout>
				</template>

				<!-- 예약상품 -->
				<template v-slot:[`item.houseDatas_selectBox`]="{ item }">
					<div>
						<v-select
							class="search_select"
							v-model="item.houseDatas_selectBox.value"
							hideDetails
							item-text="title"
							:items="item.houseDatas_selectBox.items"
							outlined
						></v-select>
					</div>
				</template>

				<!-- 상태 -->
				<template v-slot:[`item.status`]="{ item }">
					<!-- 상담 미완료 / 상담 취소 -->
					<div
						v-if="item.status === '상담 미완료' || item.status === '상담취소'"
						style="text-decoration: underline; cursor: pointer;"
						@click="status_click(item)"
					>
						{{ item.status }}
					</div>
					<!-- 상담대기 / 상담완료 -->
					<div v-else>{{ item.status }}</div>
				</template>
			</v-data-table>

			<download-excel
				class="btn btn-default"
				id="counsel_list_Excel"
				:data="table.selected"
				style="display:none"
				:fields="table.json_fields"
				type="text/csv;charset=utf8"
				worksheet="My Worksheet"
				name="상담예약_리스트.xls"
			>
			</download-excel>
		</div>
		<counselReason :setdialog="counsel_reason" />

		<!-- 엑셀 미선택 다이어로그 -->
		<saveDialog :dialog="excel_alert" />
	</div>
</template>

<script>
import { DatepickerDialog, counselReason, saveDialog } from '@/components'
import downloadExcel from 'vue-json-excel'
export default {
	components: { DatepickerDialog, downloadExcel, counselReason, saveDialog },
	created() {
		this.$store.state.loading = true

		// meData에 사업지 정보 있나 확인
		let interval = setInterval(() => {
			if (this.$store.state.meData.business) {
				let variable = {
					business: this.$store.state.meData.business.id,
					name: this.search_keyword.value === '고객 이름' ? this.search_keyword.input : '',
					phone: this.search_keyword.value === '고객 연락처' ? this.search_keyword.input : '',
					counselor_name: this.search_keyword.value === '상담사 이름' ? this.search_keyword.input : '',
					counselor_phone: this.search_keyword.value === '상담사 연락처' ? this.search_keyword.input : '',
				}

				// 상태
				if (this.status_filter.value === '상담대기') {
					variable['status'] = 'waiting'
				} else if (this.status_filter.value === '상담 미완료') {
					variable['status'] = 'incomplete'
				} else if (this.status_filter.value === '상담취소') {
					variable['status'] = 'cancel'
				} else if (this.status_filter.value === '상담완료') {
					variable['status'] = 'complete'
				}
				// 팀구분

				if (this.team_filter.value.value !== 'all') {
					variable['counselor_team'] = this.team_filter.value.value
				}
				//팀 -직위
				if (this.rank_filter.value.value !== 'all') {
					variable['counselor_rank'] = this.rank_filter.value.value
				}

				if (this.date.value !== '전체') {
					// 생성일
					variable['date_gte'] = this.$moment(this.date.start.date).format('YYYY-MM-DD')
					variable['date_lte'] = this.$moment(this.date.end.date).format('YYYY-MM-DD')
				}
				this.reservations(variable)
				this.teams()

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
		async reservations(variable) {
			let input
			if (variable) {
				input = variable
			} else {
				input = {
					business: this.$store.state.meData.business.id,
				}
			}
			this.$store.state.loading = true

			await this.$store
				.dispatch('reservations', input)
				.then(res => {
					console.log(res)
					let reservations_item = res.reservations

					if (input.blocked_false) {
						reservations_item = reservations_item.filter(items => items.blocked !== true)
					}

					reservations_item.forEach(el => {
						// 팀구분
						// if (el['team']) {
						el['team'] =
							(el.users_permissions_user.team ? el.users_permissions_user.team.title : '') +
							'_' +
							(el.users_permissions_user.rank ? el.users_permissions_user.rank.title : '')
						// } else {
						// 	el['team'] = '-'
						// }
						// 상담사 정보
						// if (el.name && el.users_permissions_user) {
						el['conselor_name'] = el.users_permissions_user.name
						// } else {
						// 	el['conselor_name'] = '-'
						// }

						el['conselor_phone'] = el.users_permissions_user.phone

						// 상담 일시 정보

						el['reservation_time'] = {
							date: el.date,
							times: el.times?.split(','),
						}
						el['reservation_time_excel'] = (el.date ? el.date : '') + '_' + (el.times ? el.times : '')

						// 상태

						if (el.status === 'waiting') {
							el['status'] = '상담대기'
						} else if (el.status === 'complete') {
							el['status'] = '상담완료'
						} else if (el.status === 'incomplete') {
							el['status'] = '상담 미완료'
						} else if (el.status === 'cancel') {
							el['status'] = '상담취소'
						}

						// 예약 상품
						if (el.products && el.products.length > 0) {
							// 예약 상품 있는 경우
							el['houseDatas_selectBox'] = {
								value: el.products[0],
								items: el.products,
							}
							let houseData_excel = el.products.map(data => data.title)

							el['houseDatas_excel'] = houseData_excel.join(', ')
						} else {
							// 예약 상품 없는 경우
							el['houseDatas_selectBox'] = {
								value: '',
								items: [],
							}
							el['houseDatas_excel'] = ''
						}
					})

					this.table.items = reservations_item
					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		async teams() {
			// 팀 호출
			let input = {
				business: this.$store.state.meData.business.id,
			}

			await this.$store.dispatch('teams', input).then(res => {
				let items = [{ value: 'all', text: '전체' }]

				res.teams.forEach(el => {
					items.push({
						value: el.id,
						text: el.title,
						ranks: el.ranks,
					})
				})

				this.team_filter.items = items
				this.team_filter.value = items[0]
			})
		},
		excelExport() {
			if (this.table.selected.length === 0) {
				this.excel_alert.open = true
			} else {
				document.getElementById('counsel_list_Excel').click()
			}
		},
		allowed_datesEnd(val) {
			if (this.date.start === '') {
				return val
			} else {
				val = this.date.start.date <= val
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
		filtered_reservations() {
			// 검색 버튼 클릭
			let variable = {
				business: this.$store.state.meData.business.id,
				name: this.search_keyword.value === '고객 이름' ? this.search_keyword.input : '',
				phone: this.search_keyword.value === '고객 연락처' ? this.search_keyword.input : '',
				counselor_name: this.search_keyword.value === '상담사 이름' ? this.search_keyword.input : '',
				counselor_phone: this.search_keyword.value === '상담사 연락처' ? this.search_keyword.input : '',
			}

			// 상태
			if (this.status_filter.value === '상담대기') {
				variable['status'] = 'waiting'
			} else if (this.status_filter.value === '상담 미완료') {
				variable['status'] = 'incomplete'
			} else if (this.status_filter.value === '상담취소') {
				variable['status'] = 'cancel'
			} else if (this.status_filter.value === '상담완료') {
				variable['status'] = 'complete'
			}
			// 팀구분

			if (this.team_filter.value.value !== 'all') {
				variable['counselor_team'] = this.team_filter.value.value
			}
			//팀 -직위
			if (this.rank_filter.value.value !== 'all') {
				variable['counselor_rank'] = this.rank_filter.value.value
			}

			if (this.date.value !== '전체') {
				// 생성일
				variable['date_gte'] = this.$moment(this.date.start.date).format('YYYY-MM-DD')
				variable['date_lte'] = this.$moment(this.date.end.date).format('YYYY-MM-DD')
			}

			this.reservations(variable)
		},
		reset_filter() {
			this.search_keyword.value = ''
			this.search_keyword.input = ''
			this.date.value = '오늘'
			this.date.start.date = this.$moment().format('YYYY-MM-DD')
			this.date.end.date = this.$moment().format('YYYY-MM-DD')
			this.status_filter.value = '전체'
			this.team_filter.value = { value: 'all', text: '전체' }
			this.rank_filter.value = { value: 'all', text: '전체' }
			this.rank_filter.items = [{ value: 'all', text: '전체' }]
		},
		team_change() {
			// 필터  - 팀 구분 변경
			if (this.team_filter.value.value !== 'all' && this.team_filter.value.ranks) {
				let items = [{ value: 'all', text: '전체' }]

				this.team_filter.value.ranks.forEach(el => {
					items.push({
						value: el.id,
						text: el.title,
					})
				})

				this.rank_filter.items = items
				this.rank_filter.value = items[0]
			} else {
				let items = [{ value: 'all', text: '전체' }]
				this.rank_filter.items = items
				this.rank_filter.value = items[0]
			}
		},

		status_click(item) {
			// 사유 확인 다이어로그 열기
			this.counsel_reason.dialog = true
			this.counsel_reason.counselor = item.users_permissions_user.name
			this.counsel_reason.name = item.name
			this.counsel_reason.houseDatas = item.houseDatas ? item.houseDatas.map(el => el.name).join(', ') : ''
			this.counsel_reason.reason = item.reason
		},
	},
	data() {
		return {
			table: {
				headers: [
					{ text: '팀구분', value: 'team', align: 'center', width: '250px' },
					{
						text: '상담사',
						value: 'conselor_name',
						align: 'center',
						width: '120px',
					},
					{
						text: '연락처',
						value: 'conselor_phone',
						align: 'center',
						width: '170px',
					},
					{ text: '고객', value: 'name', align: 'center', width: '120px' },
					{ text: '연락처', value: 'phone', align: 'center', width: '200px' },
					{ text: '상담일시', value: 'reservation_time', align: 'center' },
					{ text: '상태', value: 'status', align: 'center', width: '130px' },
					{
						text: '예약상품',
						value: 'houseDatas_selectBox',
						align: 'center',
						width: '300px',
					},
				],
				headerCheck: false,
				items: [],
				selected: [],
				json_fields: {
					팀구분: 'team',
					상담사: 'conselor_name',
					연락처: 'conselor_phone',
					고객: 'name',
					고객연락처: 'phone',
					상담일시: 'reservation_time_excel',
					상태: 'status',
					예약상품: 'houseDatas_excel',
				},
			},
			search_keyword: {
				// 이름 / 연락처 / 이메일 필터
				value: '',
				items: ['상담사 이름', '상담사 연락처', '고객 이름', '고객 연락처'],
				input: '',
			},

			status_filter: {
				// 상태 필터
				value: '전체',
				items: ['전체', '상담대기', '상담 미완료', '상담취소', '상담완료'],
				input: '',
			},

			team_filter: {
				// 회사 필터
				value: { value: 'all', text: '전체' },
				items: [{ value: 'all', text: '전체' }],
				input: '',
			},

			rank_filter: {
				// 회사 필터
				value: { value: 'all', text: '전체' },
				items: [{ value: 'all', text: '전체' }],
				input: '',
			},

			date: {
				value: '오늘',
				start: {
					date: this.$moment().format('YYYY-MM-DD'),
				},
				end: {
					date: this.$moment().format('YYYY-MM-DD'),
				},
			},
			excel_alert: {
				//  엑셀 저장 alert
				open: false,
				content: '엑셀 다운로드 받을 상담예약을 선택해주세요.',
				cancelBtnTxt: '확인',
				cancelBtn: true,
			},
			counsel_reason: {
				// 사유확인 다이어로그
				dialog: false,
				title: '사유확인',
				counselor: '',
				name: '',
				houseDatas: '',
				reason: '',
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
