<template>
	<div>
		<div class="wrapper">
			<!-- 날짜 선택 --------- start -->
			<v-layout align-center class="header_search">
				<v-layout class="search_wrap">
					<v-layout>
						<v-flex md2 sm3 xs12>
							<txtField class="search_box_type" v-model="search_project" :txtField="search"></txtField>
						</v-flex>
					</v-layout>
				</v-layout>
			</v-layout>

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12>
					<datatable :datatable="table.datatable" class="tbl-type01" :detailClick="detailClick" :search="search_project"> </datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>

		<!-- 사용자 생성/수정 alert ------ start -->
		<editReservedayDialog :reservedialog="edit_dialog" :alerts="alerts" :validation_chceck="validation_chceck" />
		<!-- 사용자 생성/수정 alert ------ end -->
	</div>
</template>

<script>
import { datatable, txtField, editReservedayDialog } from '@/components/index.js'
export default {
	components: { datatable, txtField, editReservedayDialog },
	data() {
		return {
			tplCodes: [],
			alerts: [],
			bizDatas: [],
			dateChice: true,
			datedisable: true,
			// --- 데이터 테이블 데이터 --``
			table: {
				datatable: {
					class: 'datatablehover3',
					headers: [
						{ text: '프로젝트', value: 'business.title', width: '20%' },
						{ text: '캠페인명', value: 'title', width: '25%' },
						{ text: '등록일', value: 'created_at_time' },
						{ text: '최종 수정일', value: 'updated_at_time' },
						{ text: '집행기간', value: 'systemDate', width: '20%' },
						{ text: '비고', align: 'center', value: 'etc_detail' },
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

			// 날짜/검색 데이터
			searchsel: { value: '오늘', errorMessage: '', hideDetail: true, items: ['오늘', '이번 주', '이번 달'], outlined: true },
			searchsel_position: {
				value: '철산자이 더 헤리티지 고객 설문조사',
				errorMessage: '',
				hideDetail: true,
				items: ['철산자이 더 헤리티지 고객 설문조사', '철산자이 더 헤리티지 고객 설문조사1', '철산자이 더 헤리티지 고객 설문조사2'],
				outlined: true,
			},
			searchsel_type: { value: '이름', errorMessage: '', hideDetail: true, items: ['이름', '연락처'], outlined: true },
			searchsel_name: {
				value: '전체',
				errorMessage: '',
				hideDetail: true,
				items: ['전체', '방문예약 명'],
				outlined: true,
			},
			searchsel_visit: {
				value: '전체',
				errorMessage: '',
				hideDetail: true,
				items: ['전체', '방문 여부'],
				outlined: true,
			},
			searchsel_visit_type: {
				value: '전체',
				errorMessage: '',
				hideDetail: true,
				items: ['전체', '방문 형태'],
				outlined: true,
			},
			searchsel_reception: {
				value: '전체',
				errorMessage: '',
				hideDetail: true,
				items: ['전체', '수신동의'],
				outlined: true,
			},
			search_project: '',
			search: {
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				placeholder: '검색어를 입력하세요.',
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
				items: [
					//0
					{
						title: '프로젝트 선택',
						id: 'reserveday',
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
							placeholder: '',
						},
						required: true,
					},
					//1
					{
						title: '거점 홍보 제목',
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
						},
						required: true,
					},
					// 2
					{
						title: '진행기간',
						id: 'range',
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
						required: true,
					},
				],
				items2: [
					//0
					{
						title: '인증방식',
						id: 'auth',
						value: '',
						type: 'radio',
						radio: {
							value: '',
							items: [
								{
									label: '카카오 계정으로 로그인',
									value: 'kakao',
								},
								{ label: '정보 입력(인증번호 인증)', value: 'phone' },
								{
									label: '정보 입력(인증없음)',
									value: 'nomal',
								},
							],
						},
						required: true,
					},
					// 1
					{
						title: '완료시 이동 페이지',
						id: 'endLink',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
						},
						required: false,
					},
				],
			},

			addBtn: {
				// 추가 버튼
				dark: true,
				width: 100,
			},
		}
	},
	async created() {
		this.reservedays()
	},
	computed: {},
	methods: {
		reservedays() {
			this.$store.state.loading = true
			const data = {
				// type: 'c',
			}
			this.$store.dispatch('reservedays', data).then(res => {
				this.table.datatable.items = res.data.reservedays
				this.$store.dispatch('events', {}).then(res => {
					this.$store.state.loading = false
					for (let index = 0; index < res.data.events.length; index++) {
						res.data.events[index].type = 'event'
						res.data.events[index].sdate = res.data.events[index].start
						res.data.events[index].edate = res.data.events[index].end
						this.table.datatable.items.push(res.data.events[index])
					}
				})
			})
		},
		reservedays_search() {
			this.$store.state.loading = true
			const data = {
				// type: 'c',
			}
			this.$store.dispatch('reservedays', data).then(res => {
				this.$store.state.loading = false
				this.table.datatable.items = res.data.reservedays
			})
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

			val = this.$moment(val).format('YYMMDD') >= start
			return val
		},
		selectDays() {
			let date
			if (this.$moment().format('ddd') === 'Sun') {
				date = 6
			} else if (this.$moment().format('ddd') === 'Mon') {
				date = 0
			} else if (this.$moment().format('ddd') === 'Tue') {
				date = 1
			} else if (this.$moment().format('ddd') === 'Wed') {
				date = 2
			} else if (this.$moment().format('ddd') === 'Thu') {
				date = 3
			} else if (this.$moment().format('ddd') === 'Fri') {
				date = 4
			} else if (this.$moment().format('ddd') === 'Sat') {
				date = 5
			}
			if (this.searchsel.value === '오늘') {
				this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '어제') {
				this.termStartpicker.date = this.$moment()
					.subtract(1, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '이번 주') {
				this.termStartpicker.date = this.$moment()
					.subtract(date, 'day')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '지난 주') {
				this.termStartpicker.date = this.$moment()
					.subtract(date + 7, 'day')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment()
					.subtract(date + 1, 'day')
					.format('YYYY-MM-DD')
			} else if (this.searchsel.value === '최근 7일') {
				this.termStartpicker.date = this.$moment()
					.subtract(7, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '최근 14일') {
				this.termStartpicker.date = this.$moment()
					.subtract(14, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '최근 30일') {
				this.termStartpicker.date = this.$moment()
					.subtract(30, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '이번 달') {
				this.termStartpicker.date = this.$moment()
					.subtract(Number(this.$moment().format('DD')) - 1, 'days')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (this.searchsel.value === '전체') {
				this.termStartpicker.date = ''
				this.termEndpicker.date = ''
			}
		},
		detailClick(item) {
			if (item) {
				const data = {
					show: true,
				}
				this.$store.dispatch('businesses', data).then(res => {
					this.bizDatas = res.data.businesses
					this.$store.dispatch('messages', {}).then(alert => {
						this.alerts = alert.data.messages
						this.edit_dialog.dialog = true
						this.edit_dialog.id = item.id
						this.edit_dialog.type = item.type
						this.edit_dialog.items[0].selectBox.items = res.data.businesses.map(x => x.title)
						this.edit_dialog.items[0].selectBox.value = item.business?.title
						this.edit_dialog.items[1].value = item.title
						this.edit_dialog.items[2].startpicker.date = this.$moment(item.sdate).format('YYYY-MM-DD')
						this.edit_dialog.items[2].endpicker.date = this.$moment(item.edate).format('YYYY-MM-DD')

						this.edit_dialog.items2[0].radio.value = item.loginType
						this.edit_dialog.items2[1].value = item.endLink
						this.tplCodes = item.tplCode
					})
				})
			}
		},
		validation_chceck() {
			const bizIndex = this.bizDatas.map(x => x.title).indexOf(this.edit_dialog.items[0].selectBox.value)
			if (this.edit_dialog.type === 'event') {
				const data = {
					id: this.edit_dialog.id,
					title: this.edit_dialog.items[1].value,
					start: new Date(this.edit_dialog.items[2].startpicker.date),
					end: new Date(this.edit_dialog.items[2].endpicker.date),
					endLink: this.edit_dialog.items2[1].value,
					loginType: this.edit_dialog.items2[0].radio.value,
					business: this.bizDatas[bizIndex].id,
				}
				this.$store.dispatch('updateEvent', data).then(() => {
					this.edit_dialog.dialog = false
					this.reservedays()
				})
			} else {
				const data = {
					id: this.edit_dialog.id,
					title: this.edit_dialog.items[1].value,
					sdate: new Date(this.edit_dialog.items[2].startpicker.date),
					edate: new Date(this.edit_dialog.items[2].endpicker.date),
					endLink: this.edit_dialog.items2[1].value,
					loginType: this.edit_dialog.items2[0].radio.value,
					business: this.bizDatas[bizIndex].id,
				}
				this.$store.dispatch('updateReserveday', data).then(() => {
					this.edit_dialog.dialog = false
					this.reservedays()
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
.search_box_type {
	width: auto !important;
	height: 26px !important;
	margin-right: 10px !important;
	padding: 0 10px !important;
	font-size: 13px;
	font-weight: bold;
	.v-btn__content {
		color: #fff;
	}
}
//검색 박스
.search_box_type {
	width: 193px;
	margin-left: 10px;
	div {
		div {
			.v-input__slot {
				min-height: 26px !important;
				height: 26px;
				padding: 0 10px !important;
			}
		}
	}
}
.search_select_type {
	min-height: 26px !important;
	height: 26px !important;
	// width: 400px;
	// max-width: 400px;
	div {
		div {
			div {
				div {
					.v-input__append-inner {
						margin-top: 1px !important;
					}
				}
			}
		}
	}
}
.customer-management-text {
	font-size: 12px;
	font-weight: bold;
	width: auto;
	color: #204037;
}
.customer-management-btn {
	box-shadow: none;
	border: 1px solid #c5c3d5;
	width: 88px;
	height: 26px !important;
	background-color: #f3f3ff !important;
	.v-btn__content {
		color: #323153;
		font-size: 13px;
	}
}
.qus-title-text {
	font-size: 13px;
	color: #333333;
	font-weight: bold;
	span {
		font-weight: normal;
	}
}
</style>
