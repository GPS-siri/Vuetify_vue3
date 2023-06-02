<template>
	<div>
		<v-layout align-center class="header_search">
			<v-layout class="search_wrap ml-3">
				<v-flex class="search_select ml-4" style="max-width:260px !important" lg3 md3 sm3 xs12>
					<selectBox :sel="searchsel" class="searchSel" style="font-size:12px"></selectBox>
				</v-flex>
				<v-layout justify-end>
					<v-flex class="mr-3" style="max-width:200px;">
						<txtField :txtField="search" class="search_box_admin"></txtField>
					</v-flex>
					<v-btn class="search_btn" color="#5d19ff" elevation="0"><v-icon>mdi-magnify</v-icon>조회</v-btn>
				</v-layout>
			</v-layout>
		</v-layout>
		<v-layout class="mt-4">
			<v-flex xs8>
				<datatable :datatable="noticeTable" class="notice_table"> </datatable>
			</v-flex>
			<v-flex xs4 class="ml-10">
				<v-layout style="border-top:1px solid black">
					<v-flex class="notice_right_table" xs2>
						지점
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<div class="py-3 right_subtable">
							<v-radio-group :value="true" hide-details row class="notice_radio ml-3">
								<v-radio class="mb-0 mr-2" label="전체" :value="true" color="#FB9C00" :ripple="false"></v-radio>
								<v-radio class="mb-0" label="선택" :value="false" color="#FB9C00" :ripple="false"></v-radio>
							</v-radio-group>
							<selectBox :sel="spacesel" class="searchSel mx-5" style="font-size:12px;"></selectBox>
							<div class="mr-3">
								<v-btn class="notice_btn" color="#F3F3FF" elevation="0">적용</v-btn>
							</div>
						</div>
						<div class="pa-3">{{}}</div>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						제목
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<txtField :txtField="notice_title" class="search_box_admin pa-3"></txtField>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						내용
					</v-flex>
					<v-flex xs10 class="notice_right_table2" style="height:">
						<v-textarea class="notice_content_text ma-3" outlined auto-grow hide-details style="font-size:12px !important"></v-textarea>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						공개
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<v-radio-group :value="true" hide-details row class="notice_radio ma-3">
							<v-radio class="mb-0 mr-2" label="공개" :value="true" color="#FB9C00" :ripple="false"></v-radio>
							<v-radio class="mb-0" label="비공개" :value="false" color="#FB9C00" :ripple="false"></v-radio>
						</v-radio-group>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						고정
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<v-checkbox class="right_checkbox" color="rgb(251, 156, 0)" hide-details :ripple="false" :label="' 고정 공지글'"></v-checkbox>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						첨부파일
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<div class="right_subtable" style="border-bottom:0">
							<txtField :txtField="notice_file" class="search_box_admin pa-3" style="width:100%"></txtField>
							<div class="mr-3">
								<v-btn class="notice_btn" color="#fff" elevation="0">첨부</v-btn>
							</div>
						</div>
					</v-flex>
				</v-layout>
				<v-layout class="mt-8" justify-end>
					<div>
						<v-btn class="new_notice_btn" color="#0500B7" elevation="0">생성 및 저장</v-btn>
					</div>
				</v-layout>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
import { selectBox, txtField, datatable } from '@/components/index.js'

export default {
	created() {
		this.notice_first_table()
	},
	methods: {
		notice_first_table() {
			this.$store.dispatch('notices').then(res => {
				let data = res.notices
				data.forEach(el => {
					el['business_title'] = el.business.title
					el['notice_status'] = el.status
					el['table_select'] = {
						items: [
							{ text: '공개', value: true },
							{ text: '비공개', value: false },
						],
						outlined: true,
						hideDetail: true,
						value: el.status,
					}
				})
				this.noticeTable.items = data
				console.log(this.noticeTable.items)
			})
		},
	},
	data() {
		return {
			notice_title: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
			notice_file: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				disable: true,
			},
			noticeTable: {
				headers: [
					{ text: '제목', value: 'title', width: '30%' },
					{ text: '공개여부', value: 'notice_status', width: '10%' },
					{ text: '작성일', value: 'created_at', width: '15%' },
					{ text: '지점명', value: 'business_title', width: '45%' },
				],
				class: 'datatablehover3',
				items: [],
				noweditting: '',
				itemPerPage: 15,
				page: 1,
				pageCount: 0,
			},
			searchsel: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				placeholder: '지점선택',
				items: [],
				outlined: true,
			},
			spacesel: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: [],
				outlined: true,
			},
			search: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
		}
	},
	components: {
		selectBox,
		txtField,
		datatable,
	},
}
</script>

<style lang="scss">
.notice_table {
	div {
		.v-data-table__wrapper {
			margin: 0;
		}
	}
}
.notice_right_table {
	background-color: #f5f5f5;
	font-size: 12px;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	border-right: 1px solid #c8c8c8;
	border-bottom: 1px solid #c8c8c8;
	border-left: 1px solid #c8c8c8;
}
.notice_right_table2 {
	border-right: 1px solid #c8c8c8;
	border-bottom: 1px solid #c8c8c8;
}
.right_subtable {
	display: flex;
	align-items: center;
	text-align: center;
	border-bottom: 1px solid #c8c8c8;
}
.notice_radio {
	margin: 0;
	padding: 0;
	font-size: 12px;
	.v-label {
		font-size: 12px;
	}
}
.notice_btn {
	width: 68px !important;
	height: 26px !important;
	padding: 0 !important;
	font-size: 12px !important;
	font-weight: normal;
	border: 1px solid #c5c3d5 !important;
	.v-btn__content {
		color: black;
	}
}
.right_checkbox {
	margin: 12px !important;
	padding: 0 !important;
	.v-label {
		font-size: 12px;
	}
}
.notice_content_text {
	.v-text-field__slot {
		textarea {
			margin-top: 0px !important;
			padding-top: 5px !important;
			max-height: 120px !important;
			overflow: auto;
			line-height: 18px !important;
		}
	}
}
.new_notice_btn {
	width: 110px !important;
	height: 30px !important;
	padding: 0 !important;
	font-size: 13px !important;
	font-weight: bold;
	.v-btn__content {
		color: #fff;
	}
}
</style>
