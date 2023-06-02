<template>
	<div style="width:100%;">
		<v-layout align-center justify-end class="header_search">
			<v-flex class="search_select ml-3 mr-2 " style="max-width:200px !important;">
				<selectBox :sel="searchsel" :class="'searchSel'" style="font-size:12px"></selectBox>
			</v-flex>
			<v-flex style="max-width:200px;">
				<txtField class="search_box_admin" v-model="search_project" :txtField="search"></txtField>
			</v-flex>
			<v-flex class="ml-3" style="max-width:100px;">
				<v-btn class="search_btn" color="#5d19ff" @click="SearchBiz()" elevation="0"><v-icon>mdi-magnify</v-icon>조회</v-btn>
			</v-flex>
		</v-layout>
		<datatable
			:search="search_project"
			:datatable="projectTable"
			excelUseYn="true"
			class="table_header"
			:detailClick="detailClick"
		></datatable>
		<div class="d-flex justify-end align-item-center ">
			<v-btn
				v-if="$store.state.meData.role ? $store.state.meData.role.name === 'Authenticated' : false"
				class="new_pj"
				@click="createProject()"
				>신규등록</v-btn
			>
		</div>
		<newProject :setdialog="newDialog" @update="update" />
	</div>
</template>

<script>
import newProject from './newProject.vue'
import { selectBox, txtField, datatable } from '@/components/index.js'

export default {
	components: {
		selectBox,
		txtField,
		newProject,
		datatable,
	},

	data() {
		return {
			searchActive: false,
			//프로젝트 생성
			newDialog: {
				dialog: false,
				edit: false,
				editData: {},
				title: '프로젝트 생성',
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
					{ text: '지점명', value: 'title' },
					{ text: '위치', value: 'address' },
					{ text: '대표번호', value: 'mainPhone' },
					{ text: '생성일', value: 'created_at' },
					{ text: '관리자', value: 'manager' },
					{ text: '관리자연락처', value: 'managerPhone' },
					{ text: '사용인원', value: 'useNumber' },
					{ text: '비고', value: 'etc_detail', align: 'center' },
				],
				class: 'datatablehover3',
				items: [],
				noweditting: '',
				itemPerPage: 10,
				page: 1,
				pageCount: 0,
			},

			datedisable: true,
			termDatatable: {
				disableSort: true,
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},

			searchsel: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: [],
				outlined: true,
				placeholder: '지점선택',
				returnObject: true,
				itemText: 'title',
			},
			search: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
			search_project: '',
		}
	},

	created() {
		this.getBusiness()
	},
	mounted() {},

	methods: {
		async update() {
			this.getBusiness()
		},
		SearchBiz() {
			let input = {}
			if (this.searchsel.value !== '전체') {
				input.id = this.searchsel.value.id
			}

			this.$store.state.loading = true
			this.$store.dispatch('businesses', input).then(res => {
				this.projectTable.items = JSON.parse(JSON.stringify(res.businesses))
				this.$store.state.loading = false
			})
		},
		detailClick(item) {
			this.newDialog.title = '지점관리'
			this.newDialog.dialog = true
			this.newDialog.edit = true
			this.newDialog.editData = item
		},

		async getBusiness() {
			this.$store.state.loading = true
			const data = {}
			await this.$store.dispatch('businesses', data).then(res => {
				this.projectTable.items = JSON.parse(JSON.stringify(res.businesses))
				this.searchsel.items = JSON.parse(JSON.stringify(res.businesses))
				this.searchsel.items.unshift('전체')
				this.$store.state.loading = false
			})
		},
		createProject() {
			this.newDialog.edit = false
			this.newDialog.title = '프로젝트 생성'
			this.newDialog.dialog = true
		},
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
}
//검색 버튼
.search_btn {
	width: 75px !important;
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
