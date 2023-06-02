<template>
	<div>
		<div class="wrapper">
			<!-- 검색 --------- start -->
			<v-layout align-center class="header_search">
				<v-layout class="search_wrap" justify-end>
					<v-flex md2 sm3 xs12 class="ml-3 mr-auto">
						<selectBox :sel="$store.state.businesses_list_system" @change="change_project"></selectBox>
					</v-flex>

					<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_1'" lg2 md2 sm7 xs12>
						<DatepickerDialog :picker="termStartpicker" :disabledata="disabledata"></DatepickerDialog
					></v-flex>
					<span class="mx-1"> ~ </span>
					<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_2 mr-2'" lg2 md2 sm7 xs12>
						<DatepickerDialog :picker="termEndpicker" :disabledata="disabledata" :allowed_dates="termCustomer"></DatepickerDialog
					></v-flex>

					<v-btn class="search_btn" color="#5d19ff" @click="friendTalkstatistics()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
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
				<span class="sub_header">친구톡 발송 통계</span>
			</v-layout>
			<!-- 서브 헤더 ----------- end -->

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12>
					<datatable :datatable="table.datatable" class="tbl-type01 ft_report_table" excelUseYn="true" excelType="ft_report_excel">
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>

		<!-- sweetAlet - ${}를 입력해주세요, 완료 팝업 -->
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<sweetAlert :dialog="sweetInfo" />
	</div>
</template>

<script>
import { datatable, sweetAlert, selectBox, DatepickerDialog } from '@/components/index.js'
export default {
	components: {
		datatable,
		sweetAlert,
		selectBox,
		DatepickerDialog,
	},
	data() {
		return {
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
				type: 'month',
				date: this.$moment()
					.subtract(6, 'M')
					.format('YYYY-MM'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},

			termEndpicker: {
				// datePicker
				type: 'month',
				date: this.$moment().format('YYYY-MM'),
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

			addBtn: {
				// 추가 버튼
				dark: true,
			},
		}
	},
	async created() {
		this.$store.state.loading = true
		this.friendTalkstatistics()
		this.$store.state.loading = false
	},
	computed: {},
	methods: {
		search_reset() {
			this.termStartpicker.date = this.$moment()
				.subtract(6, 'M')
				.format('YYYY-MM')
			this.termEndpicker.date = this.$moment().format('YYYY-MM')
			this.friendTalkstatistics()
		},
		friendTalkstatistics() {
			this.$store.state.loading = true
			const data = {
				sdate: this.termStartpicker.date,
				edate: this.$moment(this.termEndpicker.date)
					.add(1, 'M')
					.format('YYYY-MM'),
				business: this.$store.state.businesses_list_system?.value.id,
			}
			this.$store.dispatch('friendTalkstatistics', data).then(res => {
				this.table.datatable.headers = res.data.friendTalkstatistics.count.headers
				this.table.datatable.items = res.data.friendTalkstatistics.count.items
				this.$store.state.loading = false
			})
		},
		async messages_call() {
			// 약관 내역 호출
			let variable = {
				tplCodeStr: this.search_name,
			}
			this.$store.dispatch('messages', variable).then(res => {
				let messages_data = res.data.messages
				this.set_table_data(messages_data)
			})
		},
		//엑셀 저장
		clickExport(table) {
			this.table.datatable.items.forEach(element => {
				element.phone = element.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
			})
			document.getElementById(table.datatable.title).click()
		},

		change_project() {
			// 프로젝트 변경
			this.search_name = ''
			this.friendTalkstatistics()
		},
		disabledata() {
			this.datedisable = false
		},
		termCustomer(val) {
			let start = this.$moment(this.termStartpicker.date).format('YYMM')

			val = this.$moment(val).format('YYMM') >= start
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
