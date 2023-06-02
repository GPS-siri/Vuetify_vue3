<template>
	<div>
		<v-layout align-center class="header_search">
			<v-layout class="search_wrap ml-3">
				<v-flex class="search_select ml-4" style="max-width:260px !important" lg3 md3 sm3 xs12>
					<selectBox :sel="searchsel" class="searchSel" style="font-size:12px" @change="getGoods()"></selectBox>
				</v-flex>
				<v-layout justify-end>
					<v-flex class="search_select ml-4" style="max-width:260px !important" lg3 md3 sm3 xs12>
						<selectBox :sel="searchsel1" class="searchSel" style="font-size:12px" @change="getData2()"></selectBox>
					</v-flex>
					<v-flex class="search_select ml-4" style="max-width:260px !important" lg3 md3 sm3 xs12>
						<selectBox :sel="searchsel2" class="searchSel" style="font-size:12px" @change="getGoodName()"></selectBox>
					</v-flex>
					<v-flex class="search_select ml-4" style="max-width:260px !important" lg3 md3 sm3 xs12>
						<selectBox :sel="searchsel3" class="searchSel" style="font-size:12px" @change="getItems()"></selectBox>
					</v-flex>
					<v-flex class="ml-4 mr-3" style="max-width:200px;">
						<txtField :txtField="search" v-model="search.value" class="search_box_admin"></txtField>
					</v-flex>
					<v-btn class="search_btn" color="#5d19ff" elevation="0" @click="getItems()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
				</v-layout>
			</v-layout>
		</v-layout>
		<v-layout class="mt-4">
			<v-flex xs8>
				<datatable :search="search.value" :datatable="goodsTable" class="notice_table" excelUseYn="true" @click="click_detail"> </datatable>
			</v-flex>
			<v-flex xs4 class="ml-10">
				<v-layout style="border-top:1px solid black">
					<v-flex class="notice_right_table" xs2>
						상품명
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<v-layout>
							<v-flex xs7>
								<txtField :txtField="detailData" v-model="detailData.name" class="search_box_admin pa-3"></txtField>
							</v-flex>
							<v-flex xs4 v-if="detailData.id">
								<txtField :txtField="disabledData" v-model="detailData.goodsCode" class="search_box_admin py-3"></txtField>
							</v-flex>
							<v-flex xs4 v-else>
								<txtField :txtField="detailData" v-model="detailData.goodsCode" class="search_box_admin py-3"></txtField>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						대분류
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<v-layout>
							<v-flex xs7>
								<selectBox :sel="detailData.data1" class="searchSel pa-3" style="font-size:12px" @change="getdata2_detail"></selectBox>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						중분류
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<v-layout align-center>
							<v-flex xs7>
								<selectBox :sel="detailData.data2" class="searchSel pa-3" style="font-size:12px"></selectBox>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						등록일
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<v-layout>
							<v-flex xs7>
								<txtField :txtField="detailData" v-model="detailData.created_at" class="search_box_admin pa-3"></txtField>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						변경이력
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<datatable :datatable="detailTable" class="detailTable"> </datatable>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						상품설명
					</v-flex>
					<v-flex xs10 class="notice_right_table2" style="height:">
						<v-layout wrap>
							<v-flex xs12>
								<v-textarea
									class="notice_content_text ma-3"
									v-model="detailData.description"
									outlined
									auto-grow
									hide-details
									style="font-size:12px !important"
								></v-textarea>
							</v-flex>
							<v-flex xs12 v-if="detailData.file">
								<div class="right_subtable" style="border-bottom:0">
									<div class="px-3" style="color:#BCBCBC; font-size:12px; text-decoration: underline; cursor:pointer">
										{{ detailData.file.name }}
									</div>
								</div>
							</v-flex>
							<v-flex xs12>
								<div class="right_subtable" style="border-bottom:0">
									<txtField :txtField="disabledData" class="search_box_admin pa-3" style="width:100%"></txtField>
									<div class="mr-3">
										<v-btn class="notice_btn" color="#fff" elevation="0" @click="fileUpload">첨부</v-btn>
										<input
											type="file"
											style="display:none;"
											id="goods_file"
											@change="fileUploadChange"
											accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
										/>
									</div>
								</div>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
		<v-layout class="mt-8" justify-space-between>
			<div>
				<v-btn class="new_notice_btn" color="#0500B7" elevation="0">신규등록</v-btn>
			</div>
			<div>
				<v-btn class="new_notice_btn" color="#0500B7" elevation="0" @click="save_comfirm()">저장</v-btn>
			</div>
		</v-layout>
		<noticeDialog :dialog="confirm" @click="click_update_save()" />
	</div>
</template>

<script>
import { selectBox, txtField, datatable, noticeDialog } from '@/components/index.js'

export default {
	components: {
		selectBox,
		txtField,
		datatable,
		noticeDialog,
	},
	data() {
		return {
			confirm: {
				open: false,
				title: '공지사항 관리',
				content: '공지사항을 등록(저장)합니다.',
			},
			originData: {},
			detailData: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				id: '',
				name: '',
				goodsCode: '',
				data1: {
					value: '',
					errorMessage: '',
					hideDetail: true,
					placeholder: '대분류',
					items: [],
					outlined: true,
					returnObject: true,
					itemText: 'data1',
				},
				data2: {
					value: '',
					errorMessage: '',
					hideDetail: true,
					placeholder: '중분류',
					items: [],
					outlined: true,
					returnObject: true,
					itemText: 'data2',
				},
				created_at: '',
				description: '',
				file: {},
			},
			disabledData: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				disable: true,
				placeholder: 'pdf, hwp, doc, ppt',
			},
			goodsTable: {
				headers: [
					{ text: '상품명', value: 'title', width: '20%' },
					{ text: '대분류', value: 'data1', width: '15%' },
					{ text: '중분류', value: 'data2', width: '15%' },
					{ text: '등록일', value: 'created_at', width: '15%' },
					{ text: '상품코드', value: 'goodsCode', width: '15%' },
					{ text: '판매건수', value: 'priceNum', width: '15%' },
				],
				class: 'datatablehover3',
				items: [],
				noweditting: '',
				itemPerPage: 10,
				page: 1,
				pageCount: 0,
			},
			detailTable: {
				headers: [
					{ text: '변경이력', value: 'history', width: '50%' },
					{ text: '변경일시', value: 'created_at_time', width: '50%' },
				],
				class: 'datatablehover3',
				items: [{ history: '1' }, { history: '2' }, { history: '3' }, { history: '4' }],
				hidedefaultfooter: true,
				header_fixed: true,
				height: '162px',
				noweditting: '',
				itemPerPage: 10,
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
				returnObject: true,
				itemText: 'title',
			},
			searchsel1: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				placeholder: '대분류',
				items: [],
				outlined: true,
				returnObject: true,
				itemText: 'data1',
			},
			searchsel2: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				placeholder: '중분류',
				items: [],
				outlined: true,
				returnObject: true,
				itemText: 'data2',
			},
			searchsel3: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				placeholder: '상품',
				items: [],
				outlined: true,
				returnObject: true,
				itemText: 'title',
			},
			search: {
				value: '',
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
		}
	},
	async created() {
		await this.getBusiness()
		await this.getGoods()
	},
	methods: {
		save_comfirm() {
			this.confirm.title = '상품 관리'
			this.confirm.content = '상품 정보를 저장합니다'
			this.confirm.left = '1400px'
			this.confirm.top = '120px'
			this.confirm.open = true
		},
		fileUploadChange(val) {
			this.detailData.file.file = val.target.files[0]
			this.detailData.file.name = val.target.files[0].name
			this.detailData.file.fileUpload = true
		},
		fileUpload() {
			document.getElementById(`goods_file`).click()
		},
		async click_update_save() {
			this.$store.state.loading = true
			if (this.detailData.file.file) {
				let file_input = {
					files: this.detailData.file.file,
				}
				await this.$store.dispatch('upload', file_input).then(resData => {
					if (this.originData.title !== this.detailData.name) {
						this.detailTable.items.push({ history: '상품명 변경', created_at: this.$moment() })
					}
					if (this.originData.data1 !== this.detailData.data1.value.data1 || this.originData.data2 !== this.detailData.data2.value.data2) {
						this.detailTable.items.push({ history: '상품 카테고리', created_at: this.$moment() })
					}
					if (this.originData.description !== this.detailData.description) {
						this.detailTable.items.push({ history: '상품설명 변경', created_at: this.$moment() })
					}
					if (this.originData.file.name !== this.detailData.file.name) {
						this.detailTable.items.push({ history: '첨부파일 변경', created_at: this.$moment() })
					}
					let input = {
						id: this.detailData.id,
						business: this.searchsel.value.id,
						title: this.detailData.title,
						data1: this.detailData.data1.value.data1,
						data2: this.detailData.data2.value.data2,
						description: this.detailData.description,
						file: resData.data[0].id,
						editHistory: this.detailTable.items,
					}

					this.$store.dispatch('updateProduct', input).then(async () => {
						this.detailData.file.file = ''
						await this.getBusiness()
						await this.getGoods()
						this.$store.state.loading = false
					})
				})
			} else {
				if (this.originData.title !== this.detailData.name) {
					this.detailTable.items.push({ history: '상품명 변경', created_at: this.$moment() })
				}
				if (this.originData.data1 !== this.detailData.data1.value.data1 || this.originData.data2 !== this.detailData.data2.value.data2) {
					this.detailTable.items.push({ history: '상품 카테고리', created_at: this.$moment() })
				}
				if (this.originData.description !== this.detailData.description) {
					this.detailTable.items.push({ history: '상품설명 변경', created_at: this.$moment() })
				}
				if (this.originData.file.name !== this.detailData.file.name) {
					this.detailTable.items.push({ history: '첨부파일 변경', created_at: this.$moment() })
				}
				let input = {
					id: this.detailData.id,
					business: this.searchsel.value.id,
					title: this.detailData.name,
					data1: this.detailData.data1.value.data1,
					data2: this.detailData.data2.value.data2,
					description: this.detailData.description,
					editHistory: this.detailTable.items,
				}

				this.$store.dispatch('updateProduct', input).then(async () => {
					await this.getBusiness()
					await this.getGoods()
					this.$store.state.loading = false
				})
			}
		},
		// 상품 detail 에서 중분류값
		async getdata2_detail() {
			this.$store.state.loading = true
			const data = {
				business: this.searchsel.value.id,
				data1: this.detailData.data1.value.data1,
			}
			await this.$store.dispatch('productList', data).then(res => {
				this.detailData.data2.items = JSON.parse(JSON.stringify(res.products))
				this.$store.state.loading = false
			})
		},
		// dataTable 클릭시 상품 데이터 불러오기
		async click_detail(data) {
			this.$store.state.loading = true
			const input = {
				business: data.business.id,
				data1: data.data1,
			}
			await this.$store.dispatch('productList', input).then(res => {
				this.originData = JSON.parse(JSON.stringify(data))
				this.detailData.data2.items = JSON.parse(JSON.stringify(res.products))
				this.detailData.id = data.id
				this.detailData.name = data.title
				this.detailData.goodsCode = data.goodsCode
				this.detailData.data1.value = data
				this.detailData.data2.value = data
				this.detailData.created_at = this.$moment(data.created_at).format('YYYY-MM-DD HH:mm:ss')
				this.detailData.description = data.description
				this.detailData.file = data.file
				this.detailTable.items = data.editHistory

				this.$store.state.loading = false
			})
		},
		async getBusiness() {
			this.$store.state.loading = true
			const data = {}
			await this.$store.dispatch('businesses', data).then(res => {
				this.searchsel.items = JSON.parse(JSON.stringify(res.businesses))
				this.searchsel.value = res.businesses[0]
				this.$store.state.loading = false
			})
		},
		async getGoods() {
			this.$store.state.loading = true
			const data = {
				business: this.searchsel.value.id,
			}
			await this.$store.dispatch('productList', data).then(res => {
				this.detailData = {
					clearable: false,
					maxlength: '255',
					outlined: true,
					backCol: 'white',
					name: '',
					goodsCode: '',
					data1: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						placeholder: '대분류',
						items: [],
						outlined: true,
						returnObject: true,
						itemText: 'data1',
					},
					data2: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						placeholder: '중분류',
						items: [],
						outlined: true,
						returnObject: true,
						itemText: 'data2',
					},
					created_at: '',
					description: '',
					file: {},
				}
				this.detailTable.items = []
				this.goodsTable.items = JSON.parse(JSON.stringify(res.products))
				this.searchsel1.items = JSON.parse(JSON.stringify(res.products))
				this.detailData.data1.items = JSON.parse(JSON.stringify(res.products))
				this.searchsel1.items.unshift('전체')
				this.searchsel1.value = ''
				this.searchsel2.items = []
				this.searchsel2.value = ''
				this.searchsel3.items = []
				this.searchsel3.value = ''

				this.$store.state.loading = false
			})
		},
		async getData2() {
			this.$store.state.loading = true
			let data = {
				business: this.searchsel.value.id,
			}
			if (this.searchsel1.value !== '전체' || this.searchsel1.value !== '') {
				data.data1 = this.searchsel1.value.data1
			}
			await this.$store.dispatch('productList', data).then(res => {
				this.goodsTable.items = JSON.parse(JSON.stringify(res.products))
				this.searchsel2.items = JSON.parse(JSON.stringify(res.products))
				this.searchsel2.items.unshift('전체')
				this.searchsel2.value = ''
				this.searchsel3.items = []
				this.searchsel3.value = ''
				this.$store.state.loading = false
			})
		},
		async getGoodName() {
			this.$store.state.loading = true
			const data = {
				business: this.searchsel.value.id,
			}
			if (this.searchsel1.value !== '전체' || this.searchsel1.value !== '') {
				data.data1 = this.searchsel1.value.data1
			}
			if (this.searchsel2.value !== '전체' || this.searchsel2.value !== '') {
				data.data2 = this.searchsel2.value.data2
			}
			await this.$store.dispatch('productList', data).then(res => {
				this.goodsTable.items = JSON.parse(JSON.stringify(res.products))
				this.searchsel3.items = JSON.parse(JSON.stringify(res.products))
				this.searchsel3.items.unshift('전체')
				this.searchsel3.value = ''
				this.$store.state.loading = false
			})
		},
		async getItems() {
			this.$store.state.loading = true
			const data = {
				business: this.searchsel.value.id,
			}
			if (this.searchsel1.value !== '전체' || this.searchsel1.value !== '') {
				data.data1 = this.searchsel1.value.data1
			}
			if (this.searchsel2.value !== '전체' || this.searchsel2.value !== '') {
				data.data2 = this.searchsel2.value.data2
			}
			if (this.searchsel3.value !== '전체' || this.searchsel3.value !== '') {
				data.title = this.searchsel3.value.title
			}
			await this.$store.dispatch('productList', data).then(res => {
				this.goodsTable.items = JSON.parse(JSON.stringify(res.products))
				this.$store.state.loading = false
			})
		},
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
