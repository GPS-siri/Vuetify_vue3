<template>
	<div style="width:100%; ">
		<v-layout align-center>
			<div class="main_title">
				고객 리스트
			</div>
			<div class="router_title ml-3">
				고객 관리 > 고객 리스트
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
							<v-text-field class="text_field" v-model="search_keyword.input" hideDetails outlined placeholder="검색어 입력"></v-text-field>
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
				<v-layout align-center>
					<div class="search_title">
						등록 상담사
					</div>
					<div class="search_body2">
						<div class="ml-3">
							<v-select class="search_select" v-model="counselor.value" hideDetails :items="counselor.items" outlined></v-select>
						</div>
					</div>
					<div class="search_title ml-10">
						계약상태
					</div>
					<div class="search_body2">
						<div class="">
							<v-select class="search_select" v-model="status.value" hideDetails :items="status.items" outlined></v-select>
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
		<div class="table_box3 mt-5">
			<v-layout justify-space-between align-center>
				<div class="product_detail_title">검색결과 총 {{ table.items.length }}건</div>
				<div>
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
				class="elevation-0 table_style3 mt-2"
				:footer-props="{
					['items-per-page-text']: ``,
					['items-per-page-options']: [10, 20, 30, 40, 50],
				}"
			>
				<template v-slot:[`item.name`]="{ item }">
					<div style="text-decoration: underline; cursor:pointer;" @click="client_detail(item)">
						{{ item.name }}
					</div>
				</template>
				<template v-slot:[`item.created_at`]="{ item }">
					<div>
						{{ $moment(item.created_at).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
				<template v-slot:[`item.updated_at`]="{ item }">
					<div>
						{{ $moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss') }}
					</div>
				</template>
				<template v-slot:[`item.contractStatus`]="{ item, index }">
					<div class="d-flex align-center" style="height: 100%;">
						<div class="d-flex align-center justify-center border_right" style="width:150px; height:50px; text-align: center;">
							{{ item.contractStatus | current_status }}
						</div>
						<div class="d-flex align-center justify-center border_right" style="width:100%; height:50px; text-align: center;">
							<div style="width:300px;">
								<div v-if="item.contractStatus === 'contractComplete'">
									{{ item.contract_product ? item.contract_product.name : '' }}
								</div>
								<v-select
									v-else
									class="search_select"
									v-model="item.interest_product_value"
									hideDetails
									:items="item.interest_product_items"
									outlined
									placeholder="관심상품 미등록"
									@change="change_select(item, index)"
								></v-select>
							</div>
						</div>
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
				name="고객 리스트"
			>
			</download-excel>
		</div>
	</div>
</template>
<script>
import { DatepickerDialog } from '@/components'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		DatepickerDialog,
		downloadExcel,
	},
	data() {
		return {
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
			status: {
				value: '전체',
				items: ['전체', 'DB등록', '상담대기', '상담완료', '계약가망', '계약대기', '계약완료'],
			},

			counselor: {
				value: '전체',
				items: ['전체'],
			},
			search_keyword: {
				value: '고객이름',
				items: ['고객이름', '연락처'],
				input: '',
			},
			selected: [],
			table: {
				headers: [
					{ text: '고객이름', value: 'name', align: 'center', width: '100px' },
					{ text: '연락처', value: 'phone', align: 'center', width: '150px' },
					{ text: '등록일', value: 'created_at', align: 'center', width: '200px' },
					{ text: '수정일', value: 'updated_at', align: 'center', width: '200px' },
					{ text: '등록상담사', value: 'counselor', align: 'center', width: '100px' },
					{ text: '계약상태', value: 'contractStatus', align: 'center', width: '400px' },
				],
				items: [],
				json_fields: {
					고객이름: 'name',
					연락처: 'phone',
					등록일: 'created_at',
					수정일: 'updated_at',
					등록상담사: 'counselor',
					계약상태: 'interest_product_status',
				},
			},
		}
	},
	async created() {
		await this.me()
		await this.users()
		await this.clients()
	},
	filters: {
		current_status(value) {
			if (!value) return ''
			let data = ''
			if (value === 'db') {
				data = 'DB등록'
			} else if (value === 'consultingWait') {
				data = '상담대기'
			} else if (value === 'consultingComplete') {
				data = '상담완료'
			} else if (value === 'contractWish') {
				data = '계약가망'
			} else if (value === 'contractWait') {
				data = '계약대기'
			} else if (value === 'contractComplete') {
				data = '계약완료'
			}
			return data
		},
	},
	methods: {
		async me() {
			await this.$store
				.dispatch('me')
				.then(() => {})
				.catch(() => {})
		},
		async users() {
			let input = {
				role: 3,
			}
			await this.$store.dispatch('users', input).then(res => {
				let li = ['전체']
				res.users.forEach(el => {
					li.push(el.name)
				})
				this.counselor.items = li
			})
		},
		current_status(value) {
			if (!value) return ''
			let data = ''
			if (value === 'db') {
				data = 'DB등록'
			} else if (value === 'consultingWait') {
				data = '상담대기'
			} else if (value === 'consultingComplete') {
				data = '상담완료'
			} else if (value === 'contractWish') {
				data = '계약가망'
			} else if (value === 'contractWait') {
				data = '계약대기'
			} else if (value === 'contractComplete') {
				data = '계약완료'
			}
			return data
		},
		async clients() {
			let input = {
				business: this.$store.state.meData.business.id,
			}
			await this.$store.dispatch('clients', input).then(res => {
				let li = []
				for (let i = 0; i < res.clients.length; i++) {
					let obj = {}
					obj = res.clients[i]
					obj['counselor'] = res.clients[i].users_permissions_user === null ? '' : res.clients[i].users_permissions_user.name
					obj['contract_product'] = res.clients[i].customDatas ? res.clients[i].customDatas.contract_product : ''
					let li2 = []
					for (let j = 0; j < res.clients[i].products.length; j++) {
						if (res.clients[i].products[j].status === 'uncontracted') {
							li2.push(res.clients[i].products[j].title)
						}
					}
					obj['interest_product_value'] = li2[0]
					obj['interest_product_items'] = li2
					obj['interest_product_status'] =
						res.clients[i].customDatas && res.clients[i].contractStatus === 'contractComplete'
							? this.current_status(res.clients[i].contractStatus) + '_' + res.clients[i].customDatas.contract_product.name
							: this.current_status(res.clients[i].contractStatus) + '_' + li2[0]
					li.push(obj)
				}
				this.table.items = li
			})
		},
		change_select(item, index) {
			this.table.items[index].interest_product_status =
				this.table.items[index].contractStatus + '_' + this.table.items[index].interest_product_value
		},
		click_search() {
			let input = {}
			if (this.date.check) {
				if (this.date.start.date !== '') {
					input['updated_at_gte'] = this.$moment(this.date.start.date)
					input['updated_at_lte'] = this.$moment(this.date.end.date).add(1, 'day')
				}
			} else {
				if (this.date.start.date !== '') {
					input['created_at_gte'] = this.$moment(this.date.start.date)
					input['created_at_lte'] = this.$moment(this.date.end.date).add(1, 'day')
				}
			}
			if (this.search_keyword.value === '고객이름') {
				input['name'] = this.search_keyword.input
			} else {
				input['phone'] = this.search_keyword.input
			}
			if (this.status.value !== '전체') {
				input['contractStatus'] =
					this.status.value === 'DB등록'
						? 'db'
						: this.status.value === '상담대기'
						? 'consultingWait'
						: this.status.value === '상담완료'
						? 'consultingComplete'
						: this.status.value === '계약가망'
						? 'contractWish'
						: this.status.value === '계약대기'
						? 'contractWait'
						: 'contractComplete'
			}
			this.$store.dispatch('clients', input).then(res => {
				if (this.counselor.value === '전체') {
					let li = []
					for (let i = 0; i < res.clients.length; i++) {
						let obj = {}
						obj = res.clients[i]
						obj['counselor'] = res.clients[i].users_permissions_user ? res.clients[i].users_permissions_user.name : ''
						obj['contract_product'] = res.clients[i].customDatas ? res.clients[i].customDatas.contract_product : ''
						let li2 = []
						for (let j = 0; j < res.clients[i].products.length; j++) {
							if (res.clients[i].products[j].status === 'uncontracted') {
								li2.push(res.clients[i].products[j].title)
							}
						}
						obj['interest_product_value'] = li2[0]
						obj['interest_product_items'] = li2
						obj['interest_product_status'] =
							res.clients[i].customDatas && res.clients[i].contractStatus === 'contractComplete'
								? this.current_status(res.clients[i].contractStatus) + '_' + res.clients[i].customDatas.contract_product.name
								: this.current_status(res.clients[i].contractStatus) + '_' + li2[0]
						li.push(obj)
					}
					this.table.items = li
				} else {
					let result = res.clients.filter(x => {
						if (x.users_permissions_user) {
							return x.users_permissions_user.name === this.counselor.value
						}
					})
					let li = []
					for (let i = 0; i < result.length; i++) {
						let obj = {}
						obj = result[i]
						obj['counselor'] = result[i].users_permissions_user ? result[i].users_permissions_user.name : ''
						obj['contract_product'] = result[i].customDatas ? result[i].customDatas.contract_product : ''
						let li2 = []
						for (let j = 0; j < result[i].products.length; j++) {
							if (result[i].products[j].status === 'uncontracted') {
								li2.push(result[i].products[j].title)
							}
						}
						obj['interest_product_value'] = li2[0]
						obj['interest_product_items'] = li2
						obj['interest_product_status'] =
							result[i].customDatas && result[i].contractStatus === 'contractComplete'
								? this.current_status(result[i].contractStatus) + '_' + result[i].customDatas.contract_product.name
								: this.current_status(result[i].contractStatus) + '_' + li2[0]
						li.push(obj)
					}
					this.table.items = li
				}
			})
		},
		click_clear() {
			this.clients()
			this.search_keyword.input = ''
			this.search_keyword.value = '고객이름'
			this.status.value = '전체'
			this.date = {
				value: '전체',
				start: {
					date: '',
				},
				end: {
					date: '',
				},
				check: false,
			}
			this.counselor.value = '전체'
		},
		excelExport() {
			document.getElementById('clientExcel').click()
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
		client_detail(item) {
			// this.$router.push({ name: `clientDetail`, params: { data: item } })
			this.$router.push({ path: `client/${item.id}`, params: { data: item } })
		},
	},
}
</script>

<style lang="scss" scoped>
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
</style>
<style lang="scss">
.table_style3 > .v-data-table__wrapper {
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
			}
		}
	}
}

.table_style3 > .v-data-table__wrapper > table {
	tbody {
		tr {
			td:not(:last-of-type) {
				border-right: 1px solid #d1d1d1;
			}
			td:last-of-type {
				padding: 0px !important;
			}
			td {
				height: 50px;
				background-color: #ffffff !important;
			}
			td:nth-child(1) {
				text-align: center !important;
			}
		}
	}
}
.table_style3 {
	.v-data-footer {
		border: none !important;
	}
}
.table_box3 {
	div {
		.v-data-table__wrapper::-webkit-scrollbar {
			width: 12px;
			height: 12px;
		}
	}
}
.table_box3 {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-thumb {
			background-color: #ced4d7;
			border-radius: 10px;
			background-clip: padding-box;
			border: 2px solid transparent;
		}
	}
}
.table_box3 {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-track {
			background-color: transparent;
			border-radius: 10px;
		}
	}
}

.table_style3 .v-data-footer {
	border-top: unset !important;
}
</style>
