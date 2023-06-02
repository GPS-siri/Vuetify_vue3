<template>
	<div style="width:100%; margin:0 37px">
		<v-layout align-center class="header_title">
			<!--  타이틀  -->
			<v-flex xs10>
				<v-layout align-center>
					<div class="slash mr-1"></div>
					<span class="admin_title">
						지점 관리
					</span>
				</v-layout>
			</v-flex>
		</v-layout>
		<v-tabs :color="$store.state.PointColor1" background-color="#F4F8FD" v-model="tab" class="reservationTab mt-5" slider-size="1">
			<v-tab v-for="(tab, i) in tabs" :key="i" :ripple="false"> {{ tab }}</v-tab>
		</v-tabs>
		<v-tabs-items id="management-tab" v-model="tab" style="">
			<v-tab-item style="padding-top:20px;">
				<campaignInputBox></campaignInputBox>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<campaignReservedays></campaignReservedays>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<campaignReservation></campaignReservation>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<noticeManagement></noticeManagement>
			</v-tab-item>
		</v-tabs-items>
		<v-layout align-center class="header_search">
			<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_1'" lg2 md2 sm7 xs12>
				<DatepickerDialog :picker="termStartpicker" :disabledata="disabledata"></DatepickerDialog
			></v-flex>
			<span class="mx-1"> ~ </span>
			<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'search_date_2'" lg2 md2 sm7 xs12>
				<DatepickerDialog :picker="termEndpicker" :disabledata="disabledata" :allowed_dates="termCustomer"></DatepickerDialog
			></v-flex>
			<v-layout class="search_wrap ml-3">
				<v-flex class="search_select ml-4" lg3 md3 sm3 xs12>
					<selectBox :sel="searchsel" @change="selectDays" :class="'searchSel'"></selectBox>
				</v-flex>
				<v-flex md2 sm3 xs12>
					<txtField class="search_box_admin" v-model="search_project" :txtField="search"></txtField>
				</v-flex>
				<v-layout justify-end>
					<v-btn class="search_btn" color="#5d19ff" @click="SearchBiz()" elevation="0"><v-icon>mdi-magnify</v-icon>조회</v-btn>
					<v-btn class="search_btn" color="#5d19ff" @click="click_clear()" elevation="0">초기화</v-btn>
				</v-layout>
			</v-layout>
		</v-layout>
		<datatable :search="search_project" :datatable="projectTable" class="table_header" :detailClick="detailClick"></datatable>
		<div class="d-flex justify-end align-item-center ">
			<v-btn
				v-if="$store.state.meData.role ? $store.state.meData.role.name === 'Authenticated' : false"
				class="new_pj"
				@click="createProject()"
				>신규등록</v-btn
			>
		</div>
		<!-- <newProject :setdialog="newDialog" /> -->
	</div>
</template>

<script>
// import newProject from '../viewItem/newProject.vue'
import { DatepickerDialog, selectBox, txtField, datatable } from '@/components/index.js'
import noticeManagement from '../../admin/layout/board/BusinessManagement/notice/noticeManagement.vue'

export default {
	components: {
		DatepickerDialog,
		selectBox,
		txtField,
		// newProject,
		datatable,
		noticeManagement,
	},
	mounted() {},
	methods: {
		SearchBiz() {
			this.searchActive = true
			const data = {
				created_at_gte: this.termStartpicker.date + 'T00:00:00.000Z',
				created_at_lte:
					this.$moment(this.termEndpicker.date)
						.add(1, 'd')
						.format('YYYY-MM-DD') + 'T00:00:00.000Z',
				show: true,
			}
			this.$store.dispatch('businesses', data).then(res => {
				res.data.businesses.forEach(x => {
					x['businessesCode'] = x.code
				})
				this.projectTable.items = res.data.businesses
			})
		},
		detailClick(item) {
			this.newDialog.title = '프로젝트 수정'
			this.newDialog.dialog = true
			this.newDialog.edit = true
			this.newDialog.editData = item
		},
		async click_clear() {
			this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			this.searchsel.value = '오늘'
			this.search_project = ''
			await this.getBusiness()
		},
		getBusiness() {
			this.$store.state.loading = true
			const data = {
				show: true,
			}
			this.$store.dispatch('businesses', data).then(() => {
				// res.data.businesses.forEach(x => {
				// 	x['businessesCode'] = x.code
				// })
				// this.projectTable.items = res.data.businesses
				this.$store.state.loading = false
			})
		},
		createProject() {
			this.newDialog.edit = false
			this.newDialog.title = '프로젝트 생성'
			this.newDialog.dialog = !this.newDialog.dialog
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
				this.termStartpicker.date = this.$moment()
					.subtract(7, 'd')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (date === '이번 달') {
				this.termStartpicker.date = this.$moment()
					.startOf('month')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment()
					.endOf('month')
					.format('YYYY-MM-DD')
			}
		},
		disabledata() {
			this.datedisable = false
		},
	},
	data() {
		return {
			searchActive: false,
			//프로젝트 생성
			newDialog: {
				dialog: false,
				inputBoxDisable: true,
				edit: false,
				editData: {},
				title: '프로젝트 생성',
				groupcode: '',
				name: '',
				group: '',
			},
			// 모달창 테스트
			sweetDialog: {
				open: false,
				title: '프로젝트 저장',
				content: `프로젝트 정보를
저장합니다`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
			},
			sweetDialog1: {
				open: false,
				title: '문항 저장',
				content: `작성한 문항을
저장합니다`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
			},
			sweetDialog2: {
				sel1: { value: '철산자이 거점설문', items: ['1', '2'], errorMessage: '', hideDetail: true, outlined: true, valIndex: '' }, // 문항 복제 셀렉트 박스,
				addcopy: {
					value: '',
					maxlength: '255',
					outlined: true,
					hideDetail: true,
					errorMessage: '',
					autocomplete: 'off',
				},
				open: false,
				title: '문항 복제',
				setTitle: '문항 복제 완료',
				copyBefore: '복제 합니다',
				copyAfter: '복제가 완료 되었습니다',
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '복제',
				modalIcon: 'success',
			},
			projectTable: {
				headers: [
					{ text: '코드', value: 'businessesCode' },
					{ text: '프로젝트명', value: 'title' },
					{ text: '위치', value: 'location', width: '550px' },
					{ text: '담당자', value: 'manager' },
					{ text: '연락처', value: 'managerPhone' },
					{ text: '대표번호', value: 'phone' },
					{ text: '생성일', value: 'created_at' },
					{ text: '최종수정일', value: 'updated_at' },
					{ text: '비고', value: 'etc_detail', width: '200px', align: 'center' },
				],
				class: 'datatablehover3',
				items: [],
				noweditting: '',
				itemPerPage: 15,
				page: 1,
				pageCount: 0,
			},
			tab: 0, // tab
			tabs: ['지점 관리', '상품 관리', '예약설정관리', '공지사항 관리'],
			datedisable: true,
			termDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			termStartpicker: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termEndpicker: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			searchsel: { value: '오늘', errorMessage: '', hideDetail: true, items: ['오늘', '이번 주', '이번 달'], outlined: true },
			search: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
			search_project: '',
		}
	},
	watch: {
		newDialog: {
			deep: true,
			handler() {
				if (!this.newDialog.dialog) {
					if (this.searchActive) this.SearchBiz()
					else this.getBusiness()
				}
			},
		},
	},
	created() {
		this.getBusiness()
	},
}
</script>
<style lang="scss">
.left_dashboard {
	background-color: white;
	border-radius: 1vh;
}
.search_date_1 {
	max-width: 120px !important;
	margin-left: 40px;
}
.search_date_2 {
	max-width: 120px !important;
}
.search_wrap {
	height: 26px;
}
// 기간 별 버튼
.search_select {
	min-height: 26px !important;
	height: 26px !important;
	max-width: 110px !important;
}
//검색 버튼
.search_btn {
	width: 68px !important;
	height: 26px !important;
	margin-right: 10px !important;
	padding: 0 10px !important;
	font-size: 13px;
	font-weight: bold;
	.v-btn__content {
		color: #fff;
	}
}
.new_pj {
	// margin-top: -90px;
	width: 113px !important;
	height: 26px !important;
	background: #323153 !important;
	color: #fff !important;
}
</style>
