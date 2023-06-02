<template>
	<div>
		<div class="wrapper">
			<!-- 검색 --------- start -->
			<v-layout align-center class="header_search">
				<v-layout class="search_wrap" justify-end>
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
						<txtField class="search_box_type_friendTalk" v-model="search_name" :txtField="search" @enter="unscribe_call"></txtField>
					</v-flex>
					<v-btn class="search_btn" color="#5d19ff" @click="unscribe_call()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
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
				<span class="sub_header">수신 거부 리스트</span>
			</v-layout>
			<!-- 서브 헤더 ----------- end -->

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12>
					<datatable
						:datatable="table.datatable"
						class="tbl-type01"
						excelUseYn="true"
						excelType="unsubscribes_excel"
						@unsubscribe_change="unsubscribe_change"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>
	</div>
</template>

<script>
import { datatable, txtField, selectBox, DatepickerDialog } from '@/components/index.js'
export default {
	components: {
		datatable,
		txtField,
		selectBox,
		DatepickerDialog,
	},
	props: {
		tab_change: Function,
	},
	data() {
		return {
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
				placeholder: '전화번호를 입력하세요.',
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},

			filter_active: false, // 검색 활성화 여부
		}
	},
	async created() {
		this.$store.state.loading = true
		await this.unsubscribes()
	},
	computed: {},
	methods: {
		async unsubscribes() {
			// 약관 내역 호출
			let variable = {}

			if (this.filter_active) {
				variable['rejectDate_gte'] = this.termStartpicker.date + 'T00:00:00.000Z'
				variable['rejectDate_lte'] =
					this.$moment(this.termEndpicker.date)
						.add(1, 'day')
						.format('YYYY-MM-DD') + 'T00:00:00.000Z'
				variable['phone'] = this.search_name
			}
			this.$store.state.loading = true
			this.$store.dispatch('unsubscribes', variable).then(res => {
				let unsubscribes_data = res.data.unsubscribes

				unsubscribes_data.forEach(el => {
					el['phone_mask'] = `${el.phone.slice(0, 3)}-${el.phone.slice(3, 4)}***-${el.phone.slice(7, 11)}`
					el['reject_date'] = this.$moment(el.rejectDate).format('YYYY-MM-DD HH:mm:ss')

					if (el.access) {
						el['access_state'] = '허용'
					} else {
						el['access_state'] = '거부'
					}
				})

				unsubscribes_data.forEach((el, index) => {
					el['row_num'] = index + 1
				})

				this.set_table_data(unsubscribes_data)
				this.$store.state.loading = false
			})
		},

		set_table_data(term_data) {
			let headers = [
				{ text: 'No', value: 'row_num', width: '80px' },
				{ text: '연락처', value: 'phone_mask' },
				{ text: '수신 거부일', value: 'reject_date' },
				{ text: '관리자', value: 'manage' },
				{ text: '현재상태', value: 'access_state' },
				{ text: '비고', value: 'unsubscribe_change' },
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
		async search_reset() {
			this.$store.state.loading = true
			this.filter_active = false
			this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			this.searchsel.value = '오늘'
			this.search_name = ''
			await this.unsubscribes()
			this.$store.state.loading = false
		},
		unscribe_call() {
			// 검색 실행
			this.filter_active = true
			this.unsubscribes()
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
		unsubscribe_change(item) {
			let variable = {
				id: item.id,
				access: !item.access,
			}

			this.$store.state.loading = true
			this.$store.dispatch('updateUnsubscribe', variable).then(async () => {
				await this.unsubscribes()
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
