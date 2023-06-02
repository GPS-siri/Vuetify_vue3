<template>
	<div style="width:100%; ">
		<div class="d-flex align-center">
			<div class="product_detail_title">
				선택 상품 상세
			</div>
			<div
				class="d-flex align-center product_detail_subtitle ml-3"
				style="margin-top:2px;"
				v-for="(item, index) in businesses_product"
				:key="item + index"
			>
				<div class="mr-2">{{ item.name }} {{ detail_data['data' + (index + 1)] }}</div>
				<div v-if="businesses_product.length - 1 !== index">
					>
				</div>
			</div>
			<v-layout justify-end align-center>
				<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="click_open_dialog2()">
					삭제
				</v-btn>
			</v-layout>
		</div>
		<div class="table_box">
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
					<div
						v-if="item.status === 'contractcompleted'"
						style="text-decoration: underline; cursor:pointer;"
						@click.stop="open_contract_dialog(item)"
					>
						계약완료
					</div>
					<div v-else>
						미계약
					</div>
				</template>
				<template v-slot:[`item.created_at`]="{ item }">
					<div v-if="item.created_at">
						{{ $moment(item.created_at).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
					<div v-else>
						-
					</div>
				</template>
				<template v-slot:[`item.updated_at`]="{ item }">
					<div v-if="item.updated_at" style="text-decoration: underline; cursor:pointer;" @click.stop="open_update_history_dialog(item)">
						{{ $moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
					<div v-else>
						-
					</div>
				</template>
			</v-data-table>
		</div>

		<div class="mt-5 d-flex ">
			<div>
				<div class="product_box d-flex align-center">
					<div class="product_title py-2 d-flex align-center" style="border-bottom:1px solid #eaeaea;">
						상품등록
					</div>
				</div>
				<div class="product_box d-flex align-center">
					<div class="product_title py-2 d-flex align-center" style="border-bottom:1px solid #eaeaea;">
						타이틀 입력
					</div>
				</div>
				<div class="product_box d-flex align-center" style="height:180px;">
					<div class="product_title py-2 d-flex align-start" style="border-bottom:1px solid #eaeaea; height:180px;">
						등록상품
					</div>
				</div>
				<div class="product_box d-flex align-center">
					<div class="product_title py-2 d-flex align-center">
						상품명 입력
					</div>
				</div>
			</div>
			<div style="width:auto">
				<div class="product_body d-flex align-center ml-3 py-2 justify-space-between">
					<div class="d-flex align-center">
						<v-btn color="primary" style="width:120px; height:28px;" @click="click_save()">
							저장
						</v-btn>
					</div>
					<div class="d-flex align-center ml-3">
						<v-btn small outlined class="btn-style " :disabled="templates[0].productList.length > 0" @click="templateAdd">
							상품 등록 템플릿 추가
						</v-btn>
						<v-btn small outlined class="btn-style ml-3" :disabled="templates[0].productList.length > 0" @click="templateDelete">
							상품 등록 템플릿 삭제
						</v-btn>
					</div>
				</div>
				<div class="d-flex" style="width:1400px; overflow:auto;">
					<div v-for="(template, index) in templates" :key="index">
						<div class="py-2 ml-3" style="width:200px;">
							<v-text-field
								class="text_field2 "
								v-model="template.title"
								hideDetails
								outlined
								:disabled="templates[0].productList.length > 0"
							></v-text-field>
						</div>
						<div class="product_body3 py-2 ml-3" style="width:200px; height:184px; overflow:auto;">
							<div
								:class="
									detail_data[`data${index + 1}`] === item.name
										? `d-flex justify-space-between px-2 product_focus2`
										: `d-flex justify-space-between px-2 product_hover`
								"
								v-for="item in template.productList"
								:key="item.name"
								@click="click_product(index, item.name)"
							>
								<div>
									{{ item.name }}
								</div>
								<div>
									{{ item.cnt }}
								</div>
							</div>
						</div>
						<div class="py-2 ml-3 d-flex" style="width:200px;">
							<v-text-field class="text_field2" style="width:122px;" v-model="template.name" hideDetails outlined></v-text-field>
							<v-btn small outlined color="#3A258F" class="btn-style ml-1" style="width:73px; height:35px;" @click="productAdd(index)">
								상품 추가
							</v-btn>
						</div>
					</div>
				</div>
			</div>
		</div>
		<saveDialog :dialog="save_dialog2" :activeSave="active_save2" />
		<contractDialog :setdialog="contract" />
		<updateHistoryDialog :setdialog="history" />
	</div>
</template>

<script>
import { saveDialog } from '@/components'
import contractDialog from '@/components/dialog/contractDialog.vue'
import updateHistoryDialog from '@/components/dialog/updateHistoryDialog.vue'
export default {
	components: {
		saveDialog,
		updateHistoryDialog,
		contractDialog,
	},
	async created() {},
	async mounted() {
		await this.me()
		await this.first_productList()
	},
	watch: {
		async propsData() {
			if (this.propsData === 1) {
				await this.first_productList()
			}
		},
	},
	methods: {
		async me() {
			await this.$store
				.dispatch('me')
				.then(() => {})
				.catch(() => {})
		},
		async first_productList() {
			await this.$store.dispatch('businesses').then(async res => {
				let res_data = res.businesses[0].product
				this.businesses_product = res_data
				let li = []
				if (res_data.length > 0) {
					for (let i = 0; i < res_data.length; i++) {
						let obj = {}
						obj['title'] = res_data[i].name
						obj['productList'] = []
						obj['name'] = ''
						li.push(obj)
					}
					this.templates = li
				}
				let input = {
					business: this.$store.state.meData.business.id,
				}
				await this.$store.dispatch('productList', input).then(res => {
					let data1_list = []
					res.products.forEach(el => {
						if (el.data1) {
							data1_list.push(el.data1)
						}
					})
					let uniqueArr = data1_list.filter((element, index) => {
						return data1_list.indexOf(element) === index
					})
					let li = []
					for (let j = 0; j < uniqueArr.length; j++) {
						let num = 0
						let obj = {}
						for (let i = 0; i < res.products.length; i++) {
							if (uniqueArr[j] === res.products[i].data1) {
								num++
							}
						}
						obj['name'] = uniqueArr[j]
						obj['cnt'] = num
						li.push(obj)
					}
					this.templates[0].productList = li
				})
			})
		},
		// click_select(idx) {

		// },
		templateAdd() {
			if (this.templates.length <= 6) {
				this.templates.push({ title: '', productList: [], name: '' })
			}
		},
		templateDelete() {
			if (this.templates.length >= 2) {
				this.templates.pop()
			}
		},
		productAdd(idx) {
			if (this.templates[idx].name === '') {
				alert('상품명을 입력하세요')
				return
			} else if (idx !== 0) {
				if (this.detail_data['data' + idx] === '') {
					alert(`${this.templates[idx - 1].title}를 선택하세요`)
					return
				}
			} else if (this.templates[0].productList.findIndex(x => x.name === this.templates[0].name) > -1) {
				alert('이미있는 상품입니다.')
				return
			}
			if (idx === this.templates.length - 1) {
				if (this.templates[idx].productList.findIndex(x => x.name === this.templates[idx].name) > -1) {
					let str = ''
					for (let i = 1; i < this.templates.length + 1; i++) {
						if (i === 1) {
							str = this.detail_data['data' + i]
						} else if (this.detail_data['data' + i]) {
							str = str + '_' + this.detail_data['data' + i]
						} else if (this.templates[idx].name) {
							str = str + '_' + this.templates[idx].name
						}
					}
					this.templates[idx].productList[this.templates[idx].productList.findIndex(x => x.name === this.templates[idx].name)].cnt++
					if (this.detail_data['data' + (idx + 1)]) {
						this.table.items.unshift({ title: str, id: '신규등록', status: 'uncontracted', created_at: '', updated_at: '', new: true })
					}
				} else {
					this.templates[idx].productList.push({ name: this.templates[idx].name, cnt: 1, new: true })
				}
			} else {
				this.templates[idx].productList.push({ name: this.templates[idx].name, cnt: 0, new: true })
			}
			if (idx === this.templates.length - 1) {
				for (let j = 0; j < this.templates.length - 1; j++) {
					for (let k = 0; k < this.templates[j].productList.length; k++) {
						if (this.templates[j].productList[k].name === this.detail_data['data' + (j + 1)]) {
							this.templates[j].productList[k].cnt++
						}
					}
				}
			}
			this.templates[idx].name = ''
		},
		async click_product(idx, value) {
			this.$store.state.loading = true

			let num_test = -1
			this.templates[0].productList.findIndex(x => {
				if (x.name === value) {
					num_test = x.cnt
				}
			})

			if (idx === 0) {
				if (num_test !== 0) {
					let input99 = {
						business: this.$store.state.meData.business.id,
					}
					await this.$store.dispatch('productList', input99).then(res => {
						let data1_list = []
						res.products.forEach(el => {
							if (el['data1']) {
								data1_list.push(el['data1'])
							}
						})
						let uniqueArr = data1_list.filter((element, index) => {
							return data1_list.indexOf(element) === index
						})
						let li = []
						for (let j = 0; j < uniqueArr.length; j++) {
							let num = 0
							let obj = {}
							for (let i = 0; i < res.products.length; i++) {
								if (uniqueArr[j] === res.products[i]['data1']) {
									num++
								}
							}
							obj['name'] = uniqueArr[j]
							obj['cnt'] = num
							li.push(obj)
						}
						this.templates[0].productList = li
					})
				}
			} else if (idx !== this.templates.length - 1) {
				if (this.last_templates_len) {
					let num99 = 0
					for (let i = 0; i < this.templates[this.templates.length - 1].productList.length; i++) {
						num99 = num99 + Number(this.templates[this.templates.length - 1].productList[i].cnt)
					}
					let result = num99 - Number(this.last_templates_len)
					for (let j = 0; j < this.templates.length; j++) {
						for (let k = 0; k < this.templates[j].productList.length; k++) {
							if (this.templates[j].productList[k].name === this.detail_data['data' + (j + 1)]) {
								this.templates[j].productList[k].cnt = Number(this.templates[j].productList[k].cnt) - result
							}
						}
					}
					this.last_templates_len = ''
				}

				let input100 = {
					business: this.$store.state.meData.business.id,
				}
				await this.$store.dispatch('productList', input100).then(res => {
					let data1_list = []
					res.products.forEach(el => {
						if (el['data' + (idx + 2)]) {
							data1_list.push(el['data' + (idx + 2)])
						}
					})
					let uniqueArr = data1_list.filter((element, index) => {
						return data1_list.indexOf(element) === index
					})
					let li = []
					for (let j = 0; j < uniqueArr.length; j++) {
						let num = 0
						let obj = {}
						for (let i = 0; i < res.products.length; i++) {
							if (uniqueArr[j] === res.products[i]['data' + (idx + 2)]) {
								num++
							}
						}
						obj['name'] = uniqueArr[j]
						obj['cnt'] = num
						li.push(obj)
					}
					this.templates[idx + 1].productList = li
				})
			}
			idx = idx + 1
			this.detail_data['data' + idx] = value
			if (this.templates.length === idx) {
				for (let i = 0; i < this.templates.length; i++) {
					if (i === 0) {
						this.detail_data.name = this.detail_data.data1
					} else {
						this.detail_data.name = this.detail_data.name + '_' + this.detail_data['data' + (i + 1)]
					}
				}
			}

			for (let i = idx; i < this.templates.length; i++) {
				this.templates[i].productList = []
			}
			for (let i = idx + 1; i < 8; i++) {
				this.detail_data['data' + i] = ''
			}
			let input = {
				business: this.$store.state.meData.business.id,
				data1: this.detail_data.data1 ? this.detail_data.data1 : '',
			}
			if (this.detail_data.data2) {
				input['data2'] = this.detail_data.data2
			}
			if (this.detail_data.data3) {
				input['data3'] = this.detail_data.data3
			}
			if (this.detail_data.data4) {
				input['data4'] = this.detail_data.data4
			}
			if (this.detail_data.data5) {
				input['data5'] = this.detail_data.data5
			}
			if (this.detail_data.data6) {
				input['data6'] = this.detail_data.data6
			}
			if (this.detail_data.data7) {
				input['data7'] = this.detail_data.data7
			}

			await this.$store.dispatch('productList2', input).then(res => {
				let numm = 0

				if (res.products.length > 0) {
					let data_list = []
					res.products.forEach(el => {
						if (el[`data${idx + 1}`]) {
							data_list.push(el[`data${idx + 1}`])
						}
					})
					let uniqueArr = data_list.filter((element, index) => {
						return data_list.indexOf(element) === index
					})
					let li = []
					for (let j = 0; j < uniqueArr.length; j++) {
						let num = 0
						let obj = {}
						for (let i = 0; i < res.products.length; i++) {
							if (uniqueArr[j] === res.products[i][`data${idx + 1}`]) {
								num++
							}
						}
						obj['name'] = uniqueArr[j]
						obj['cnt'] = num
						numm = numm + num
						li.push(obj)
					}

					if (li.length > 0) {
						this.templates[idx].productList = li
						if (idx === this.templates.length - 1) {
							this.last_templates_len = numm
						}
					} else if (li.length === 0) {
						let new_create =
							this.templates[idx - 1].productList[
								this.templates[idx - 1].productList.findIndex(x => x.name === this.detail_data['data' + idx])
							].cnt - res.products.length

						for (let i = 0; i < new_create; i++) {
							res.products.unshift({
								title: this.detail_data.name,
								id: '신규등록',
								status: 'uncontracted',
								created_at: '',
								updated_at: '',
							})
						}
						this.table.items = res.products
					}
				} else {
					let li = []
					let new_create = this.templates[idx - 1].productList[
						this.templates[idx - 1].productList.findIndex(x => x.name === this.detail_data['data' + idx])
					].cnt

					for (let i = 0; i < new_create; i++) {
						li.unshift({
							title: this.detail_data.name,
							id: '신규등록',
							status: 'uncontracted',
							created_at: '',
							updated_at: '',
						})
					}
					this.table.items = li
				}
			})
			this.$store.state.loading = false
		},
		click_save() {
			for (let i = 1; i < this.templates.length + 1; i++) {
				if (this.detail_data['data' + i] === '') {
					alert(`${this.businesses_product[i - 1].name}를 선택해주세요`)
					return
				}
			}

			let input = {
				title: this.detail_data.name,
				data1: this.detail_data.data1,
				data2: this.detail_data.data2,
				data3: this.detail_data.data3,
				data4: this.detail_data.data4,
				data5: this.detail_data.data5,
				data6: this.detail_data.data6,
				data7: this.detail_data.data7,
				editHistory: [],
				status: this.status.value === '미계약' ? 'uncontracted' : 'contractcompleted',
				business: this.$store.state.meData.business.id,
			}
			this.$store.state.loading = true
			this.$store.dispatch('createProduct', input).then(() => {
				this.$store.state.loading = false
				if (this.templates[0].productList.length === 0) {
					let li = []
					for (let i = 0; i < this.templates.length; i++) {
						let obj = { name: this.templates[i].title, value: `data${i + 1}` }
						li.push(obj)
					}
					let input2 = {
						id: this.$store.state.meData.id,
						Product: li,
					}
					this.$store.dispatch('updateBusiness', input2).then(() => {
						this.$router.push({ name: 'goodsList' })
					})
				} else {
					this.$router.push({ name: 'goodsList' })
				}
			})
		},

		click_open_dialog2() {
			this.save_dialog2.open = true
			this.save_dialog2.content = '상품을 삭제 하시겠습니까?'
			this.save_dialog2.btnTxt = '확인'
			this.save_dialog2.cancelBtn = true
			this.save_dialog2.cancelBtnTxt = '취소'
			this.save_dialog2.selected = this.selected
		},
		async active_save2() {
			this.$store.state.loading = true
			if (this.selected.findIndex(x => x.status === 'contractcompleted') > -1) {
				alert('계약완료 상품이 포함되어있어서 삭제할 수 없습니다.')
				this.save_dialog2.open = false
				this.$store.state.loading = false
				return
			}
			for (let i = 0; i < this.selected.length; i++) {
				if (this.selected[i].id !== '신규등록') {
					let input = {
						id: this.selected[i].id,
						business: null,
					}
					await this.$store.dispatch('updateProduct', input).then(async () => {
						if (this.selected.length === i + 1) {
							let input = {
								business: this.$store.state.meData.business.id,
								data1: this.detail_data.data1 ? this.detail_data.data1 : '',
								data2: this.detail_data.data2 ? this.detail_data.data2 : '',
								data3: this.detail_data.data3 ? this.detail_data.data3 : '',
								data4: this.detail_data.data4 ? this.detail_data.data4 : '',
								data5: this.detail_data.data5 ? this.detail_data.data5 : '',
								data6: this.detail_data.data6 ? this.detail_data.data6 : '',
								data7: this.detail_data.data7 ? this.detail_data.data7 : '',
							}
							await this.$store.dispatch('productList', input).then(res => {
								for (let j = 0; j < this.templates.length; j++) {
									for (let k = 0; k < this.templates[j].productList.length; k++) {
										if (this.templates[j].productList[k].name === this.detail_data['data' + (j + 1)]) {
											this.templates[j].productList[k].cnt--
											if (this.templates[j].productList[k].cnt === 0) {
												this.$delete(this.templates[j].productList, k)
											}
										}
									}
								}
								this.table.items = res.products
							})
							this.save_dialog2.open = false
							this.$store.state.loading = false
						}
					})
				} else {
					this.$delete(this.table.items, i)
					this.save_dialog2.open = false
					this.$store.state.loading = false
				}
			}
		},
		open_contract_dialog(item) {
			this.contract.dialog = !this.contract.dialog
			this.contract.data = item
		},
		open_update_history_dialog(item) {
			this.history.dialog = !this.history.dialog
			this.history.data = item
		},
	},
	props: {
		propsData: Number,
		updated: Boolean,
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
			detail_data: {
				data1: '',
				data2: '',
				data3: '',
				data4: '',
				data5: '',
				data6: '',
				data7: '',
				name: '',
				created_at: '-',
				updated_at: '-',
				status: '',
				editHistory: '',
			},

			name_write: false,
			status: {
				value: '미계약',
				items: ['미계약', '계약완료'],
			},
			templates: [{ title: '', productList: [], name: '' }],
			last_templates_len: '',
			businesses_product: [],
			current_status: 'detail',
			save_dialog2: {
				//  저장 dialog
				open: false,
				content: '수정한 내용을 저장하시겠습니까?',
				btnTxt: '저장',
				activeBtn: true,
			},
		}
	},
}
</script>
<style lang="scss">
.product_detail_title {
	font-size: 16px;
}
.product_detail_subtitle {
	font-size: 14px;
}

.product_detail_body_title {
	background-color: #f5f4f4;
	width: 200px;
	height: 36px;
	padding-left: 10px;
}
.product_text_field {
	width: 193px;
	margin-left: 10px;
	div {
		.v-input__slot {
			min-height: 25px !important;
			height: 25px !important;
			padding: 0 10px !important;
		}
	}
}
.product_search_select {
	div {
		.v-input__slot {
			height: 25px !important;
			max-height: 25px !important;
			min-height: 25px !important;
			div {
				.v-input__append-inner {
					margin-top: 2px;
				}
			}
		}
	}
}
.product_box {
	width: 130px;
	height: 50px;
}
.product_title {
	width: 120px;
	font-size: 12px;
}
.text_field2 {
	width: 200px;
	margin-left: 10px;
	div {
		.v-input__slot {
			min-height: 35px !important;
			height: 35px;
			padding: 0 10px !important;
		}
	}
}
.product_body {
	display: flex;
	align-items: center;
	width: 200px;
}
.product_body3 {
	width: 200px;
	height: 184px;
	border: 1px solid #333333;
	border-radius: 5px;
}
.product_hover:hover {
	background-color: #f3f3f3;
	color: #333333;
	cursor: pointer;
}
.product_focus2 {
	background-color: #f3f3f3;
	color: #333333;
	cursor: pointer;
}
.table_style > .v-data-table__wrapper {
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
				th:nth-child(1) {
					> i {
						display: none;
					}
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
			// margin-left: 1015px;
		}
	}
}

.table_style .v-data-footer {
	border-top: unset !important;
}
</style>
