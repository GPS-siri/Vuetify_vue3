<template>
	<div>
		<v-layout align-center class="header_search">
			<v-layout class="search_wrap ml-3">
				<v-flex class="search_select ml-4" style="max-width:260px !important" lg3 md3 sm3 xs12>
					<selectBox :sel="searchsel" class="searchSel" style="font-size:12px"></selectBox>
				</v-flex>
				<v-layout justify-end>
					<v-flex class="mr-3" style="max-width:200px;">
						<txtField :txtField="search" class="search_box_admin" v-model="search.notice_title"></txtField>
					</v-flex>
					<v-btn class="search_btn" color="#5d19ff" elevation="0" @click="notice_filter"><v-icon>mdi-magnify</v-icon>조회</v-btn>
				</v-layout>
			</v-layout>
		</v-layout>
		<v-layout class="mt-4">
			<v-flex xs8>
				<datatable :datatable="noticeTable" class="notice_table" @update="update" @click="notice_detail"> </datatable>
			</v-flex>
			<v-flex xs4 class="ml-10">
				<v-layout style="border-top:1px solid black">
					<v-flex class="notice_right_table" xs2>
						지점
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<div class="py-3 right_subtable">
							<v-radio-group v-model="right_radio" hide-details row class="notice_radio ml-3">
								<v-radio class="mb-0 mr-2" label="전체" :value="false" color="#FB9C00" :ripple="false" @click="radioSelect"></v-radio>
								<v-radio class="mb-0" label="선택" :value="true" color="#FB9C00" :ripple="false" @click="radioSelect"></v-radio>
							</v-radio-group>
							<selectBox v-if="right_radio" :sel="spacesel" class="searchSel mx-5" style="font-size:12px; width:170px"></selectBox>
							<div class="mr-3">
								<v-btn class="notice_btn" color="#F3F3FF" elevation="0" @click="addSpace">적용</v-btn>
							</div>
						</div>
						<div style="min-height:50px">
							<v-layout wrap v-if="right_radio">
								<div
									v-for="(name, i) in spacesel.name"
									:key="i"
									class="table_title_wrap py-1 px-2 ma-3"
									style="background:#F1F1F2; color:black; font-weight:normal"
								>
									{{ name.title }}
									<v-icon @click="removeName(name)" class="table_icon" style="background:#F4F4F5 !important">mdi-close</v-icon>
								</div>
							</v-layout>
						</div>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						제목
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<txtField :txtField="notice_title" v-model="title_text" class="search_box_admin pa-3"></txtField>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						내용
					</v-flex>
					<v-flex xs10 class="notice_right_table2" style="height:">
						<v-textarea
							class="notice_content_text ma-3"
							outlined
							v-model="content_text"
							auto-grow
							hide-details
							style="font-size:12px !important"
						></v-textarea>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						공개
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<v-radio-group v-model="show_value" :value="true" hide-details row class="notice_radio ma-3">
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
						<v-checkbox
							v-model="checkbox_value"
							class="right_checkbox"
							color="rgb(251, 156, 0)"
							hide-details
							:ripple="false"
							:label="' 고정 공지글'"
						></v-checkbox>
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
					<div class="mr-3">
						<v-btn class="new_notice_btn" color="#0500B7" elevation="0" :disabled="btn_active === false" @click="check_notice">수정</v-btn>
					</div>
					<div>
						<v-btn class="new_notice_btn" color="#0500B7" elevation="0" :disabled="btn_active" @click="check_notice">생성</v-btn>
					</div>
				</v-layout>
				<noticeDialog :dialog="confirm" @click="createNotice" />
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
import { selectBox, txtField, datatable, noticeDialog } from '@/components/index.js'

export default {
	created() {
		this.$store.state.loading = true
		this.notice_businesses()
		this.notice_first_table()
	},
	methods: {
		async notice_detail(item) {
			this.edit_biz_id = item.id
			this.btn_active = true
			this.title_text = item.title
			this.content_text = item.content
			this.show_value = item.status
			this.checkbox_value = item.fixYn

			if (item.showAll) {
				// 전체공개

				this.spacesel.name = []
				this.right_radio = false
			} else {
				// 선택공개

				if (item.businesses && item.businesses.length > 0) {
					this.spacesel.name = item.businesses
					this.right_radio = true
				}
			}
		},
		check_notice() {
			if (this.spacesel.name.length === 0) {
				return alert('지점을 선택해주세요.')
			} else if (this.title_text === '') {
				return alert('제목을 입력해주세요.')
			} else if (this.content_text === '') {
				return alert('내용을 입력해주세요.')
			}
			this.confirm.open = true
		},
		update() {
			this.$store.state.loading = true
			this.notice_first_table()
		},
		createNotice() {
			let data = {
				businesses: [],
				title: this.title_text,
				content: this.content_text,
				status: this.show_value,
				fixYn: this.checkbox_value,
			}
			if (this.btn_active) {
				data['id'] = this.edit_biz_id
			}
			for (let i = 0; i < this.spacesel.name.length; i++) {
				data.businesses.push(this.spacesel.name[i].id)
			}
			this.$store.dispatch('createNotice', data).then(() => {
				this.$store.state.loading = true
				this.notice_first_table()
				this.confirm.open = false
			})
		},
		removeName(item) {
			for (let i = 0; i < this.spacesel.name.length; i++) {
				if (this.spacesel.name[i] === item) {
					this.spacesel.name.splice(i, 1)
				}
			}
		},
		addSpace() {
			this.spacesel.name.push(this.spacesel.value)

			console.log(this.spacesel.items)
			console.log(this.spacesel.value)
		},
		radioSelect() {
			// this.right_radio = !this.right_radio
			console.log(this.right_radio)
			this.spacesel.value = ''
		},
		notice_businesses() {
			this.$store.dispatch('businesses_title').then(res => {
				let businesses = [{ text: '전체', value: 'all' }]
				let radio = []
				res.businesses.forEach(el => {
					businesses.push({ text: el.title, value: el.id })
				})
				res.businesses.forEach(el => {
					radio.push(el)
				})

				this.searchsel.items = businesses
				this.spacesel.items = radio
				this.noticeTable.allBiz = radio
			})
		},
		notice_first_table() {
			this.$store.dispatch('notices').then(res => {
				let data = res.notices
				data.forEach(el => {
					let data2 = []
					for (let i = 0; i < el.businesses.length; i++) {
						data2.push({ title: el.businesses[i].title, id: el.businesses[i].id })
					}
					el['business_title'] = el.businesses.length > 0 ? data2 : []
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
				this.$store.state.loading = false
			})
		},
		notice_filter() {
			let variable = {}
			if (this.searchsel.value !== 'all') {
				variable['business'] = this.searchsel.value
			}
			if (this.search.notice_title) {
				variable['title'] = this.search.notice_title
			}

			this.$store.dispatch('notices', variable).then(res => {
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
			})
		},
	},
	data() {
		return {
			edit_biz_id: '',
			btn_active: false,
			confirm: {
				open: false,
				title: '공지사항 관리',
				content: '공지사항을 등록(저장)합니다.',
				left: '72%',
			},
			checkbox_value: false,
			show_value: true,
			content_text: '',
			title_text: '',
			space_box: false,
			right_radio: false,
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
				itemPerPage: 10,
				page: 1,
				pageCount: 0,
				allBiz: [],
			},
			searchsel: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				placeholder: '지점선택',
				items: [],
				business: [],
				outlined: true,
			},
			spacesel: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: [],
				outlined: true,
				name: [],
				returnObject: true,
				itemText: 'title',
			},
			search: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				notice_title: '',
			},
		}
	},
	components: {
		selectBox,
		txtField,
		datatable,
		noticeDialog,
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
