<template>
	<div style="width:100%; ">
		<div class="mt-3" style="border-top:2px solid #b6b6b6;">
			<div class="d-flex align-center" style="border-bottom:0.5px solid #b6b6b6;">
				<div class="d-flex align-center" style="width:800px;">
					<div class="product_detail_body_title d-flex align-center">업로드 양식</div>
					<div class="product_detail_body_text" style="width:auto; cursor:pointer;" @click="excelExport()">엘셀 양식 다운로드 ⤓</div>
				</div>
			</div>
			<div class="d-flex align-center" style="border-bottom:0.5px solid #b6b6b6; ">
				<div class="product_detail_body_title d-flex align-center">엑셀 업로드</div>
				<div class="product_detail_body_text" style="width:auto; cursor:pointer;" @click="click_open_dialog">
					엘셀 대량등록 ⤒
				</div>
			</div>
		</div>
		<div class="d-flex align-center pt-5" style="border-top: 1px solid #eaeaea;">
			<div class="product_detail_title">
				등록 성공 리스트|
			</div>
			<div class="product_detail_title ml-2">
				총 {{ this.parseCsv === null ? '0' : this.parseCsv.length }}건 중 {{ this.upload_sucesses }}건 등록
			</div>
			<div class="product_detail_subtitle ml-2">({{ $moment().format('YYYY-MM-DD HH:mm') }})</div>
		</div>
		<div class="table_box2 mt-3">
			<v-data-table
				:headers="table.headers"
				:items="table.items"
				item-key="name"
				class="elevation-0 table_style2 mt-2"
				:footer-props="{
					['items-per-page-text']: ``,
				}"
			>
				<template v-slot:[`item.update`]="{ item }">
					<v-btn small outlined color="#3A258F" class="btn-style ml-1" style="width:40px; height:35px;" @click="click_open_dialog2(item)">
						삭제
					</v-btn>
				</template>

				<template v-slot:[`item.status`]="{ item }">
					<div>
						{{ item.status === 'contractcompleted' ? '계약완료' : '미계약' }}
					</div>
				</template>
				<template v-slot:[`item.created_at`]="{ item }">
					<div>
						{{ $moment(item.created_at).format('YYYY-MM-DD HH:mm') }}
					</div>
				</template>
				<template v-slot:[`item.updated_at`]="{ item }">
					<div>
						{{ $moment(item.updated_at).format('YYYY-MM-DD HH:mm') }}
					</div>
				</template>
			</v-data-table>
		</div>
		<div v-if="testBoolean">
			<vue-csv-import
				v-for="(data, index) in importArr"
				:key="index"
				id="csvimport"
				inputClass="inputclasstest"
				style="display:none"
				v-model="parseCsv"
				:map-fields="mapfields"
				:autoMatchFields="true"
				:autoMatchIgnoreCase="true"
			>
			</vue-csv-import>
		</div>

		<!-- <download-excel
			class="btn btn-default"
			id="clientExcel"
			style="display:none"
			:data="table.none"
			:fields="table.json_fields_down"
			type="csv"
			worksheet="My Worksheet"
			name="업로드 양식.xls"
		>
		</download-excel> -->

		<saveDialog :dialog="save_dialog" :activeSave="active_save" />
		<saveDialog :dialog="save_dialog2" :activeSave="active_save2" />
	</div>
</template>

<script>
import { VueCsvImport } from 'vue-csv-import'
// import downloadExcel from 'vue-json-excel'
import { saveDialog } from '@/components'

export default {
	components: {
		VueCsvImport,
		// downloadExcel,
		saveDialog,
	},
	async created() {
		await this.me()
		await this.businesses()
	},

	mounted() {},
	methods: {
		async me() {
			await this.$store
				.dispatch('me')
				.then(() => {})
				.catch(() => {})
		},
		active_save2() {
			if (this.save_dialog2.data.status === 'contractcompleted') {
				alert('계약완료된 상품은 삭제할수가없습니다.')
				return
			}
			this.$store.state.loading = true
			let input = {
				id: this.save_dialog2.id,
				business: null,
			}
			this.$store.dispatch('updateProduct', input).then(res => {
				let index = this.table.items.findIndex(x => x.id === res.updateProduct.product.id)
				this.table.items.splice(index, 1)
				this.save_dialog2.open = false
				this.$store.state.loading = false
			})
		},
		excelExport() {
			var data = this.table.json_fields_down
			var pom = document.createElement('a')
			var blob = new Blob(['\ufeff' + data], { type: 'text/csv;charset=utf-8;' })
			var url = URL.createObjectURL(blob)
			pom.href = url
			pom.setAttribute('download', '파일다운.csv')
			pom.click()
			// document.getElementById('clientExcel').click()
		},
		click_open_dialog() {
			this.save_dialog.open = true
			this.save_dialog.content = '파일을 업로드 하시겠습니까?'
			this.save_dialog.btnTxt = '확인'
			this.save_dialog.cancelBtn = true
			this.save_dialog.cancelBtnTxt = '취소'
		},
		click_open_dialog2(item) {
			this.save_dialog2.id = item.id
			this.save_dialog2.data = item
			this.save_dialog2.open = true
			this.save_dialog2.content = '상품을 삭제 하시겠습니까?'
			this.save_dialog2.btnTxt = '확인'
			this.save_dialog2.cancelBtn = true
			this.save_dialog2.cancelBtnTxt = '취소'
		},
		active_save() {
			this.save_dialog.open = false
			this.$store.state.loading = true
			this.parseCsv = null
			let idx = this.importArr.length - 1
			document.getElementsByClassName('form-check-input')[idx].click()
			document.getElementsByClassName('inputclasstest')[idx].click()
			console.log(1)
			var interval = setInterval(async () => {
				document.getElementsByClassName('btn-primary')[idx].click()
				if (this.parseCsv !== null) {
					console.log(22)
					clearInterval(interval)
					let li = []
					let num = 0
					for (let i = 0; i < this.parseCsv.length; i++) {
						let obj = {}
						obj['title'] = ''
						console.log(this.parseCsv)
						for (let j = 0; j < this.mapfields.length; j++) {
							if (this.mapfields[j] !== '계약상태') {
								obj['data' + (j + 1)] = this.parseCsv[i][this.mapfields[j]]
								if (j === 0) {
									obj.title = this.parseCsv[i][this.mapfields[j]]
								} else {
									obj.title = obj.title + '_' + this.parseCsv[i][this.mapfields[j]]
								}
							} else {
								obj['status'] = this.parseCsv[i][this.mapfields[j]]
							}
						}
						let input = {
							title: obj.title,
							data1: obj.data1,
							data2: obj.data2,
							data3: obj.data3,
							data4: obj.data4,
							data5: obj.data5,
							data6: obj.data6,
							data7: obj.data7,
							status: obj.status === 'TRUE' ? 'contractcompleted' : 'uncontracted',
							editHistory: [],
							business: this.$store.state.meData.business.id,
						}
						await this.$store.dispatch('createProduct', input).then(res => {
							obj['id'] = res.createProduct.product.id
							obj['created_at'] = res.createProduct.product.created_at
							obj['updated_at'] = res.createProduct.product.updated_at
							obj['status'] = res.createProduct.product.status
							obj['editHistory'] = res.createProduct.product.editHistory
							num++
						})
						li.push(obj)
						if (this.parseCsv.length - 1 === i) {
							this.$store.state.loading = false
						}
					}
					this.upload_sucesses = num
					this.table.items = li
					this.importArr.push(1)
					this.$store.state.loading = false
				}
			}, 1000)
		},
		businesses() {
			this.$store.dispatch('businesses').then(res => {
				if (res.businesses[0].product.length > 0) {
					res.businesses[0].product.forEach((el, index) => {
						this.mapfields.push(el.name)
						// this.mapfields = [...this.mapfields, el.name]
						this.$set(this.mapfields, index, el.name)
						// this.table.json_fields_down[el.name] = `data${index + 1}`
						this.table.json_fields_down.push(el.name)
						let obj = {
							text: `#{${el.name}}`,
							value: `data${index + 1}`,
							align: 'center',
							width: '200px',
						}
						this.table.headers.push(obj)
						if (res.businesses[0].product.length - 1 === index) {
							this.testBoolean = true
						}
					})
					this.table.headers.add_header_count = res.businesses[0].product.length
					this.table.headers.push({
						text: `계약상태`,
						value: `status`,
						align: 'center',
						width: '200px',
					})
					this.table.json_fields_down.push(`계약상태`)
					this.mapfields.push(`계약상태`)
					this.table.json_fields_down.join()
				}
			})
		},
	},
	data() {
		return {
			importArr: [1],
			testBoolean: false,
			parseCsv: null,
			mapfields: [],
			upload_sucesses: 0,
			table: {
				headers: [
					{ text: '수정', value: 'update', align: 'center', width: '87px' },
					{ text: '상품명', value: 'title', align: 'center', width: '250px' },
					{ text: '상품번호', value: 'id', align: 'center', width: '100px' },
					{ text: '상태', value: 'status', align: 'center', width: '200px' },
					{ text: '등록일', value: 'created_at', align: 'center', width: '200px' },
					{ text: '수정일', value: 'updated_at', align: 'center', width: '200px' },
				],
				items: [],
				none: [{ title: '' }], // 빈배열의 양식 다운 data
				json_fields_down: [],
			},
			save_dialog: {
				//  저장 dialog
				open: false,
				content: '수정한 내용을 저장하시겠습니까?',
				btnTxt: '저장',
				activeBtn: true,
			},
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
	font-size: 12px;
}

.product_detail_subtitle {
	font-size: 10px;
}
.search_btn {
	border-bottom: 1px solid #eaeaea;
}
.product_detail_body_title {
	background-color: #f5f4f4;
	width: 200px;
	height: 36px;
	padding-left: 10px;
}
.product_detail_body_text {
	font-size: 12px;
	font-weight: 100;
	margin-left: 10px;
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
.product_body2 {
	display: flex;
	align-items: center;
	width: 200px;
	height: 184px;
	border: 1px solid #333333;
	border-radius: 5px;
}
.table_style2 > .v-data-table__wrapper {
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
					left: 87px;
					z-index: 2 !important;
					border-left: 1px solid #d1d1d1;
				}
				th:nth-child(3) {
					position: sticky;
					left: 337px;
					z-index: 2 !important;
				}
				th:nth-child(4) {
					position: sticky;
					left: 437px;
					z-index: 2 !important;
				}
				th:nth-child(5) {
					position: sticky;
					left: 637px;
					z-index: 2 !important;
				}
				th:nth-child(6) {
					position: sticky;
					left: 837px;
					z-index: 2 !important;
				}
			}
		}
	}
}

.table_style2 > .v-data-table__wrapper > table {
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
				position: sticky;
				left: 0;
				z-index: 2 !important;
				border-left: 1px solid #d1d1d1;
				border-right: none;
			}
			td:nth-child(2) {
				position: sticky;
				left: 87px;
				z-index: 2 !important;
				border-left: 1px solid #d1d1d1;
			}
			td:nth-child(3) {
				position: sticky;
				left: 337px;
				z-index: 2 !important;
			}
			td:nth-child(4) {
				position: sticky;
				left: 437px;
				z-index: 2 !important;
			}
			td:nth-child(5) {
				position: sticky;
				left: 637px;
				z-index: 2 !important;
			}
			td:nth-child(6) {
				position: sticky;
				left: 837px;
				z-index: 2 !important;
			}
		}
	}
}
.table_style2 {
	.v-data-footer {
		border: none !important;
	}
}
.table_box2 {
	div {
		.v-data-table__wrapper::-webkit-scrollbar {
			width: 12px;
			height: 12px;
		}
	}
}
.table_box2 {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-thumb {
			background-color: #ced4d7;
			border-radius: 10px;
			background-clip: padding-box;
			border: 2px solid transparent;
		}
	}
}
.table_box2 {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-track {
			background-color: transparent;
			border-radius: 10px;
			box-shadow: inset 0px 0px 5px white;
			margin-left: 1040px;
		}
	}
}
</style>
