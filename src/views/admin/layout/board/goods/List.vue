<template>
	<div style="width:100%; ">
		<v-layout align-center>
			<div class="main_title">
				상품 리스트
			</div>
			<div class="router_title ml-3">
				상품 관리 > 상품 리스트
			</div>
		</v-layout>
		<div class="mt-10">
			<v-layout align-center>
				<v-layout align-center class="search_box">
					<div class="search_title">
						검색어
					</div>
					<div class="search_body">
						<div style="width:200px" class="ml-3">
							<v-select class="search_select" v-model="search_keyword.value" hideDetails :items="search_keyword.items" outlined></v-select>
						</div>
						<div style="width:200px" class="ml-3">
							<v-text-field class="text_field" v-model="search_keyword.input" hideDetails outlined></v-text-field>
						</div>
					</div>
				</v-layout>
				<v-layout align-center>
					<div class="search_title">
						상태
					</div>
					<div class="search_body">
						<div>
							<v-select class="search_select" v-model="status.value" hideDetails :items="status.items" outlined></v-select>
						</div>
					</div>
				</v-layout>
			</v-layout>
			<v-layout align-center class="mt-2">
				<v-layout align-center class="search_box">
					<div class="search_title">
						등록일
					</div>
					<div class="search_body2">
						<div class="ml-3">
							<v-btn
								:outlined="date.value === '오늘' ? false : true"
								:color="date.value === '오늘' ? 'primary' : ''"
								@click="changeDate('오늘')"
							>
								오늘
							</v-btn>
							<v-btn
								:outlined="date.value === '1주일' ? false : true"
								class="ml-2"
								:color="date.value === '1주일' ? 'primary' : ''"
								@click="changeDate('1주일')"
							>
								1주일
							</v-btn>
							<v-btn
								:outlined="date.value === '15일' ? false : true"
								class="ml-2"
								:color="date.value === '15일' ? 'primary' : ''"
								@click="changeDate('15일')"
							>
								15일
							</v-btn>
							<v-btn
								:outlined="date.value === '1개월' ? false : true"
								class="ml-2"
								:color="date.value === '1개월' ? 'primary' : ''"
								@click="changeDate('1개월')"
							>
								1개월
							</v-btn>
							<v-btn
								:outlined="date.value === '3개월' ? false : true"
								class="ml-2"
								:color="date.value === '3개월' ? 'primary' : ''"
								@click="changeDate('3개월')"
							>
								3개월
							</v-btn>
							<v-btn
								:outlined="date.value === '전체' ? false : true"
								class="ml-2"
								:color="date.value === '전체' ? 'primary' : ''"
								@click="changeDate('전체')"
							>
								전체
							</v-btn>
						</div>
						<div class="d-flex align-center date_picker ml-3" style="width:150px">
							<DatepickerDialog :picker="date.start"></DatepickerDialog>
						</div>
						<div class="d-flex align-center mx-1">~</div>
						<div class="d-flex align-center date_picker" style="width:150px">
							<DatepickerDialog :picker="date.end" :allowed_dates="allowed_datesEnd"></DatepickerDialog>
						</div>
						<v-checkbox class="ml-3" label="수정일로 검색" v-model="date.check"></v-checkbox>
					</div>
				</v-layout>
			</v-layout>
			<v-layout align-center class="mt-2">
				<v-layout align-center class="search_box">
					<div class="search_title">
						상품검색
					</div>
					<div class="search_body2">
						<div style="width:200px" class="ml-3" v-for="(search_product, index) in search_products" :key="index">
							<v-select
								class="search_select"
								v-model="search_product.value"
								hideDetails
								:items="search_product.items"
								outlined
								@change="click_select(index)"
							></v-select>
						</div>
					</div>
				</v-layout>
			</v-layout>
		</div>
		<v-layout class="mt-8 pb-5 search_btn" justify-center align-center>
			<v-btn color="primary" style="width:120px; height:35px;" @click="click_search">
				검색
			</v-btn>
			<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="click_clear">
				초기화
			</v-btn>
		</v-layout>
		<div class="table_box mt-5" style="width:100%">
			<v-layout justify-space-between align-center>
				<div class="product_detail_title">검색결과 총 {{ table.items.length }}건</div>
				<div>
					<v-btn small outlined class="btn-style" @click="click_delete">
						상품삭제
					</v-btn>
					<v-btn small outlined class="btn-style ml-3" @click="excelExport">
						<img src="@/assets/images/excel-img2.png" />
						엑셀파일 다운로드
					</v-btn>
				</div>
			</v-layout>
			<v-data-table
				v-model="selected"
				show-select
				:headers="table.headers"
				:items="table.items"
				item-key="id"
				class="elevation-0 table_style mt-2"
				:footer-props="{
					['items-per-page-text']: ``,
					['items-per-page-options']: [10, 20, 30, 40, 50],
				}"
			>
				<template v-slot:[`item.status`]="{ item }">
					<div>
						<v-layout justify-center>
							<v-switch
								color="primary"
								value
								:input-value="item.status === 'contractcompleted'"
								@click="updateProductAction(item)"
							></v-switch>
							<v-icon small v-if="item.status === 'contractcompleted'" @click.stop="open_contract_dialog(item)">
								mdi-information
							</v-icon>

							<!-- <v-flex> -->
							<!-- <div
									
									style="text-decoration: underline; cursor:pointer;"
									
								>
									계약완료
								</div> -->
							<!-- </v-flex> -->
						</v-layout>
						<!-- <div v-else>
						미계약
					</div> -->
					</div>
				</template>
				<template v-slot:[`item.created_at`]="{ item }">
					<div>
						{{ $moment(item.created_at).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
				<template v-slot:[`item.updated_at`]="{ item }">
					<div style="text-decoration: underline; cursor:pointer;" @click.stop="open_update_history_dialog(item)">
						{{ $moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
			</v-data-table>
			<download-excel
				class="btn btn-default"
				id="clientExcel"
				:data="selected"
				style="display:none"
				:fields="table.json_fields"
				type="text/csv;charset=utf8"
				worksheet="My Worksheet"
				name="테스트1"
			>
			</download-excel>
		</div>
		<contractDialog :setdialog="contract" />
		<updateHistoryDialog :setdialog="history" />
		<saveDialog :dialog="save_dialog" :activeSave="active_save" />
	</div>
</template>

<script>
import { DatepickerDialog, saveDialog } from '@/components'
import contractDialog from '@/components/dialog/contractDialog.vue'
import updateHistoryDialog from '@/components/dialog/updateHistoryDialog.vue'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		DatepickerDialog,
		downloadExcel,
		contractDialog,
		updateHistoryDialog,
		saveDialog,
	},
	created() {},
	async mounted() {
		await this.me()
		await this.first_productList()
		await this.businesses()
	},
	methods: {
		updateProductAction(item) {
			this.$store.state.loading = true
			let input = {
				id: item.id,
				status: item.status === 'contractcompleted' ? 'uncontracted' : 'contractcompleted',
				contractorName: '관리자',
				contractDate: this.$moment(),
			}
			this.$store
				.dispatch('updateProduct', input)
				.then(() => {
					this.click_search()
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		async me() {
			await this.$store
				.dispatch('me')
				.then(() => {})
				.catch(() => {})
		},
		first_productList() {
			let input = {
				business: this.$store.state.meData.business.id,
			}
			this.$store
				.dispatch('productList', input)
				.then(res => {
					let [data1_list] = [['전체']]
					res.products.forEach(el => {
						if (el.data1) {
							data1_list.push(el.data1)
						}
					})
					let uniqueArr = data1_list.filter((element, index) => {
						return data1_list.indexOf(element) === index
					})
					let clear_li = [
						{
							value: '전체',
							items: uniqueArr,
						},
					]

					this.search_products = clear_li
					this.table.items = res.products
				})
				.catch(err => {
					console.log({ err })
				})
		},
		businesses() {
			this.$store.dispatch('businesses').then(res => {
				if (res.businesses[0].product.length > 0) {
					res.businesses[0].product.forEach((el, index) => {
						this.table.json_fields[el.name] = `data${index + 1}`
						let obj = {
							text: `#{${el.name}}`,
							value: `data${index + 1}`,
							align: 'center',
							width: '200px',
						}
						this.table.headers.push(obj)
					})
					this.table.headers.add_header_count = res.businesses[0].product.length
				}
			})
		},
		click_select(idx) {
			let input = {
				business: this.$store.state.meData.business.id,
				data1: this.search_products[0].value === '전체' ? '' : this.search_products[0].value,
				data2: this.search_products[1] ? (this.search_products[1].value === '전체' ? '' : this.search_products[1].value) : '',
				data3: this.search_products[2] ? (this.search_products[2].value === '전체' ? '' : this.search_products[2].value) : '',
				data4: this.search_products[3] ? (this.search_products[3].value === '전체' ? '' : this.search_products[3].value) : '',
				data5: this.search_products[4] ? (this.search_products[4].value === '전체' ? '' : this.search_products[4].value) : '',
				data6: this.search_products[5] ? (this.search_products[5].value === '전체' ? '' : this.search_products[5].value) : '',
				data7: this.search_products[6] ? (this.search_products[6].value === '전체' ? '' : this.search_products[6].value) : '',
			}
			this.$store
				.dispatch('productList', input)
				.then(res => {
					if (res.products.length > 0) {
						let data_list = ['전체']
						res.products.forEach(el => {
							if (el[`data${idx + 2}`]) {
								data_list.push(el[`data${idx + 2}`])
							}
						})
						let uniqueArr = data_list.filter((element, index) => {
							return data_list.indexOf(element) === index
						})
						let li = []
						for (let i = 0; i < idx + 1; i++) {
							li.push(this.search_products[i])
						}
						this.search_products = li
						if (uniqueArr.length > 1) {
							this.search_products.push({
								value: '전체',
								items: uniqueArr,
							})
						}
					}
				})
				.catch(err => {
					console.log({ err })
				})
		},
		click_search() {
			let input
			if (this.date.check) {
				input = {
					business: this.$store.state.meData.business.id,
					title: this.search_keyword.input,
					data1: this.search_products[0].value === '전체' ? '' : this.search_products[0].value,
					data2: this.search_products[1] ? (this.search_products[1].value === '전체' ? '' : this.search_products[1].value) : '',
					data3: this.search_products[2] ? (this.search_products[2].value === '전체' ? '' : this.search_products[2].value) : '',
					data4: this.search_products[3] ? (this.search_products[3].value === '전체' ? '' : this.search_products[3].value) : '',
					data5: this.search_products[4] ? (this.search_products[4].value === '전체' ? '' : this.search_products[4].value) : '',
					data6: this.search_products[5] ? (this.search_products[5].value === '전체' ? '' : this.search_products[5].value) : '',
					data7: this.search_products[6] ? (this.search_products[6].value === '전체' ? '' : this.search_products[6].value) : '',
				}
				if (this.date.start.date !== '') {
					input['updated_at_lte'] = this.$moment(this.date.end.date).add(1, 'day')
					input['updated_at_gte'] = this.$moment(this.date.start.date)
				}
			} else {
				input = {
					business: this.$store.state.meData.business.id,
					title: this.search_keyword.input,
					data1: this.search_products[0].value === '전체' ? '' : this.search_products[0].value,
					data2: this.search_products[1] ? (this.search_products[1].value === '전체' ? '' : this.search_products[1].value) : '',
					data3: this.search_products[2] ? (this.search_products[2].value === '전체' ? '' : this.search_products[2].value) : '',
					data4: this.search_products[3] ? (this.search_products[3].value === '전체' ? '' : this.search_products[3].value) : '',
					data5: this.search_products[4] ? (this.search_products[4].value === '전체' ? '' : this.search_products[4].value) : '',
					data6: this.search_products[5] ? (this.search_products[5].value === '전체' ? '' : this.search_products[5].value) : '',
					data7: this.search_products[6] ? (this.search_products[6].value === '전체' ? '' : this.search_products[6].value) : '',
				}
				if (this.date.start.date !== '') {
					input['created_at_gte'] = this.$moment(this.date.start.date)
					input['created_at_lte'] = this.$moment(this.date.end.date).add(1, 'day')
				}
			}
			if (this.status.value !== '전체') {
				input['status'] = this.status.value === '미계약' ? 'uncontracted' : 'contractcompleted'
			}
			this.$store
				.dispatch('productList', input)
				.then(res => {
					this.table.items = res.products
					this.$store.state.loading = false
				})
				.catch(() => {
					this.$store.state.loading = true
				})
		},
		click_clear() {
			this.$store.state.loading = true
			this.first_productList()
			this.search_keyword.input = ''
			this.status.value = '전체'
			this.date = {
				value: '오늘',
				start: {
					date: this.$moment().format('YYYY-MM-DD'),
				},
				end: {
					date: this.$moment().format('YYYY-MM-DD'),
				},
				check: false,
			}
			this.$store.state.loading = false
		},
		open_contract_dialog(item) {
			this.contract.dialog = !this.contract.dialog
			this.contract.data = item
		},
		open_update_history_dialog(item) {
			this.history.dialog = !this.history.dialog
			this.history.data = item
		},
		excelExport() {
			if (this.selected.length === 0) {
				this.save_dialog.open = true
			} else {
				document.getElementById('clientExcel').click()
			}
		},
		active_save() {
			this.save_dialog.open = false
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
		async click_delete() {
			if (this.selected.length === 0) return alert('상품을 선택하세요')
			for (let i = 0; i < this.selected.length; i++) {
				let input = {
					id: this.selected[i].id,
				}
				await this.$store.dispatch('deleteProduct', input).then(() => {
					if (i === this.selected.length - 1) {
						this.first_productList()
					}
				})
			}
		},
	},
	data() {
		return {
			contract: {
				dialog: false,
				title: '계약완료 정보확인',
				data: {},
			},
			history: {
				dialog: false,
				title: '상품정보 변경이력',
				data: {},
			},
			table: {
				headers: [
					{ text: '상품명', value: 'title', align: 'center', width: '250px' },
					{ text: '상품번호', value: 'id', align: 'center', width: '100px' },
					{ text: '상태', value: 'status', align: 'center', width: '200px' },
					{ text: '등록일', value: 'created_at', align: 'center', width: '200px' },
					{ text: '수정일', value: 'updated_at', align: 'center', width: '200px' },
				],
				headerCheck: false,
				items: [],

				json_fields: {
					상품명: 'name',
					상품번호: 'id',
					상태: 'status',
					등록일: 'created_at',
					수정일: 'updated_at',
				},
				add_header_count: '',
			},
			selected: [],
			search_keyword: {
				value: '상품명',
				items: ['상품명'],
				input: '',
			},
			search_products: [
				{
					value: '전체',
					items: ['전체'],
				},
			],
			status: {
				value: '전체',
				items: ['전체', '미계약', '계약완료'],
			},
			date: {
				value: '전체',
				start: {
					date: '',
				},
				end: {
					date: '',
				},
				check: false,
			},
			save_dialog: {
				//  저장 dialog
				open: false,
				content: '다운로드할 상품을 선택해주세요',
				btnTxt: '확인',
				activeBtn: true,
			},
		}
	},
}
</script>
<style lang="scss">
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

.btn-style {
	box-shadow: none;
	background-color: #ffffff;
	border: 1px solid #9a9c9b;
	border-radius: 5px;
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

.table_style > .v-data-table__wrapper {
	overflow: auto;
	table {
		border-right: 1px solid #d1d1d1;
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
				th:nth-child(1) {
					position: sticky;
					left: 0;
					z-index: 2 !important;
					border-left: 1px solid #d1d1d1;
					border-right: none;
					> i {
						display: none;
					}
				}
				th:nth-child(2) {
					position: sticky;
					left: 65px;
					z-index: 2 !important;
					border-left: 1px solid #d1d1d1;
				}
				th:nth-child(3) {
					position: sticky;
					left: 315px;
					z-index: 2 !important;
				}
				th:nth-child(4) {
					position: sticky;
					left: 415px;
					z-index: 2 !important;
				}
				th:nth-child(5) {
					position: sticky;
					left: 615px;
					z-index: 2 !important;
				}
				th:nth-child(6) {
					position: sticky;
					left: 815px;
					z-index: 2 !important;
				}
			}
		}
	}
}

.table_style > .v-data-table__wrapper > table {
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
			td:nth-child(1) {
				text-align: center !important;
				position: sticky;
				left: 0;
				z-index: 2 !important;
				border-left: 1px solid #d1d1d1;
				border-right: none;
			}
			td:nth-child(2) {
				position: sticky;
				left: 65px;
				z-index: 2 !important;
				border-left: 1px solid #d1d1d1;
			}
			td:nth-child(3) {
				position: sticky;
				left: 315px;
				z-index: 2 !important;
			}
			td:nth-child(4) {
				position: sticky;
				left: 415px;
				z-index: 2 !important;
			}
			td:nth-child(5) {
				position: sticky;
				left: 615px;
				z-index: 2 !important;
			}
			td:nth-child(6) {
				position: sticky;
				left: 815px;
				z-index: 2 !important;
			}
		}
	}
}
.table_style {
	.v-data-footer {
		border: none !important;
	}
}
.table_box {
	div {
		.v-data-table__wrapper::-webkit-scrollbar {
			width: 12px;
			height: 12px;
		}
	}
}
.table_box {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-thumb {
			background-color: #ced4d7;
			border-radius: 10px;
			background-clip: padding-box;
			border: 2px solid transparent;
		}
	}
}
.table_box {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-track {
			background-color: transparent;
			border-radius: 10px;
			box-shadow: inset 0px 0px 5px white;
			margin-left: 1015px;
		}
	}
}

.table_style .v-data-footer {
	border-top: unset !important;
}
</style>
