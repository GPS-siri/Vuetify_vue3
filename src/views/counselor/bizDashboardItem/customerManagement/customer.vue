<template>
	<div class="counselor_container ">
		<div class="sticky_wrap_type">
			<div class="top_sticky_header">
				<v-layout justify-center align-center class="tab_name_bar">
					<div class="header_left_btn">
						<v-btn icon x-large @click="to_bizDashboard()">
							<v-icon>
								mdi-chevron-left
							</v-icon>
						</v-btn>
						<div style="align-self:center">
							고객관리
						</div>
					</div>
					<v-btn color="#633efd" class="ml-auto white--text" height="30" width="84" style="border-radius:20px;" @click="click_add_client()">
						고객 등록
					</v-btn>
				</v-layout>
			</div>
			<v-layout justify-center class="basic_content">
				<div class="py-3 px-2 basic_content_wrap">
					<v-layout class="mt-3 mb-2 mx-3">
						<v-text-field
							class="client_label"
							density="compact"
							variant="solo"
							label="이름/휴대폰번호로 검색하세요 "
							append-icon="mdi-magnify"
							color="#633efd"
							single-line
							hide-details
							v-model="datas.input"
							@click:append="change_select()"
						></v-text-field>
					</v-layout>
					<v-layout class="mt-3 mx-3 mb-2" style="font-size:12px;">
						분류
					</v-layout>
					<v-layout wrap align-baselineclass="mt-3" style="font-size:12px;">
						<v-flex xs4 class="pr-2">
							<select-box class="select_box_ico " :sel="selectBoxs.select_1"></select-box>
						</v-flex>
						<v-flex xs4 class="pr-2">
							<select-box class="select_box_ico " :sel="selectBoxs.select_2"></select-box>
						</v-flex>
						<v-flex xs4>
							<select-box class="select_box_ico" :sel="selectBoxs.select_3"></select-box>
						</v-flex>
						<v-flex xs4 class="pr-2">
							<select-box class="select_box_ico " :sel="selectBoxs.select_4"></select-box>
						</v-flex>
						<v-flex xs4 class="pr-2">
							<select-box class="select_box_ico" :sel="selectBoxs.select_5"></select-box>
						</v-flex>
						<v-flex xs4 text-end>
							<v-btn
								color="#633efd"
								class="ml-auto white--text"
								height="30"
								width="90"
								style="border-radius:10px;"
								@click="click_search_filter()"
							>
								적용
							</v-btn>
						</v-flex>
					</v-layout>
					<v-divider class="my-5"></v-divider>
					<v-layout class="mt-2 mb-2 mx-2">
						<div class="manage_table_result">
							검색결과 <span class="ml-2">{{ items.length }}</span> 건
						</div>
					</v-layout>
					<v-data-table
						:headers="headers"
						:items="items"
						mobile-breakpoint="100"
						class="elevation-0 dashboard-table table_font customer_dataTable"
						:footer-props="{ itemsPerPageText: '' }"
					>
						<template v-slot:[`item.name`]="{ item }">
							<div style="text-decoration: underline; cursor:pointer;" @click="click_user_detail(item)">
								{{ item.name }}
							</div>
						</template>
						<template v-slot:[`item.created_at`]="{ item }">
							<div>
								{{ $moment(item.created_at).format('YYYY-MM-DD HH:mm') }}
							</div>
						</template>
					</v-data-table>
					<v-layout justify-end>
						<v-btn small outlined class="excel-btn-style ml-3" style="background-color:white" color="green" @click="excelExport()">
							<img src="@/assets/images/excel-img2.png" />
							엑셀저장
						</v-btn>
					</v-layout>
					<download-excel
						class="btn btn-default"
						id="clientmangage_Excel"
						:data="items"
						style="display:none"
						:fields="json_fields"
						type="text/csv;charset=utf8"
						worksheet="My Worksheet"
						name="등록고객관리 리스트"
					/>
				</div>
				<clientUpdateDialog :setdialog="setdialog" />
				<clientAddDialog :dialog="setAddDialog" />
			</v-layout>
		</div>
	</div>
</template>
<script>
import clientUpdateDialog from './clientUpdateDialog.vue'
import clientAddDialog from './clientAddDialog.vue'
import { selectBox } from '@/components/index.js'
export default {
	components: { clientUpdateDialog, clientAddDialog, selectBox },
	data() {
		return {
			setdialog: {
				open: false,
				data: {},
			},
			setAddDialog: {
				open: false,
				data: {},
			},
			datas: {
				input: '',
				value1: '', // 이름
				value2: '', // 휴대전화
			},
			selectBoxs: {
				select_1: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '대분류',
					value: '',
					items: ['전체', 'DB등록', '상담대기', '상담완료', '계약가망', '계약대기', '계약완료'],
				},
				select_2: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '중분류',
					value: '',
					items: ['전체', 'DB등록', '상담대기', '상담완료', '계약가망', '계약대기', '계약완료'],
				},
				select_3: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '상품선택',
					value: '',
					items: ['전체', 'DB등록', '상담대기', '상담완료', '계약가망', '계약대기', '계약완료'],
				},
				select_4: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '고객상태',
					value: '',
					items: ['전체', 'DB등록', '상담대기', '상담완료', '계약가망', '계약대기', '계약완료'],
				},
				select_5: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '유입경로',
					value: '',
					items: ['전체', 'DB등록', '상담대기', '상담완료', '계약가망', '계약대기', '계약완료'],
				},
			},
			json_fields: {
				이름: 'name',
				연락처: 'phone',
				등록일: 'created_at',
				상태: 'status',
			},
			headers: [
				{
					text: '이름',
					align: 'center',
					value: 'name',
					width: '20%',
				},
				{ text: '연락처', value: 'phone', align: 'center', width: '30%' },
				{ text: '등록일', value: 'created_at', align: 'center', width: '25%' },
				{ text: '상태', value: 'status', align: 'center', width: '25%' },
			],
			items: [],
			origin_items: [],
		}
	},
	async created() {
		this.$store.state.loading = true
		await this.me()
		// 기존의 모든 리스트 호출
		await this.clients()

		this.$store.state.loading = false
	},
	methods: {
		click_add_client() {
			this.setAddDialog.open = true
		},
		click_search_filter() {},
		current_status2(value) {
			if (!value) return ''
			let data = ''
			if (value === 'DB등록') {
				data = 'db'
			} else if (value === '상담대기') {
				data = 'consultingWait'
			} else if (value === '상담완료') {
				data = 'consultingComplete'
			} else if (value === '계약가망') {
				data = 'contractWish'
			} else if (value === '계약대기') {
				data = 'contractWait'
			} else if (value === '계약완료') {
				data = 'contractComplete'
			}
			return data
		},
		async me() {
			await this.$store
				.dispatch('me')
				.then(() => {})
				.catch(() => {})
		},
		async clients() {
			let input = {
				users_permissions_user: this.$store.state.meData.id,
			}
			await this.$store.dispatch('clients', input).then(res => {
				this.items = res.clients
			})
		},
		click_user_detail(item) {
			this.setdialog.data = item
			this.setdialog.open = true
		},
		async change_select() {
			let input = {
				users_permissions_user: this.$store.state.meData.id,
			}

			if (isNaN(this.datas.input)) {
				input['name'] = this.datas.input
			} else {
				input['phone'] = this.datas.input
			}
			this.$store.state.loading = true
			await this.$store.dispatch('clients', input).then(res => {
				this.items = JSON.parse(JSON.stringify(res.clients))
				this.origin_items = JSON.parse(JSON.stringify(res.clients))
				this.$store.state.loading = false
			})
		},
		excelExport() {
			document.getElementById('clientmangage_Excel').click()
		},
		to_bizDashboard() {
			// 뒤로가기 버튼
			this.$router.push({
				name: 'counselorBizDashboard',
				params: { id: this.$route.params.id },
			})
		},
	},
}
</script>
<style lang="scss">
.client-card {
	padding: 16px;
	width: 100%;
	background-color: #ffffff;
	border-radius: 22px !important;
}
.client-icon {
	font-size: 60px !important;
	transform: scaleX(-1);
}
.client-title {
	font-size: 16px;
	color: #333333;
}
.date_picker_type {
	div {
		div {
			.v-input__slot {
				padding: 0px 3px 0px 5px !important;
				min-height: 25px !important;
				height: 25px !important;
				background-color: #ffffff !important;
				.v-input__append-inner {
					margin-top: 0px !important;
					div {
						.v-icon {
							font-size: 20px;
							margin-top: 3px;
							color: #633efd;
						}
					}
				}
			}
		}
	}
}
.search_select_type {
	div {
		.v-input__slot {
			height: 25px !important;
			max-height: 25px !important;
			min-height: 25px !important;
			padding: 0px 8px !important;
			background-color: #ffffff !important;
			div {
				.v-select__selection {
					font-size: 0.75rem;
				}
				.v-input__append-inner {
					margin-top: 1px !important;
				}
			}
		}
	}
}
.client_label {
	div {
		div {
			div {
				.v-label {
					font-size: 0.75rem;
				}
			}
		}
	}
}
.table_font {
	div {
		table {
			thead {
				tr {
					th {
						font-size: 0.9rem !important;
						padding: 0px 10px !important;
					}
				}
			}
			tbody {
				tr {
					td {
						font-size: 0.75rem !important;
						padding: 0px !important;
					}
				}
			}
		}
	}
}
</style>
