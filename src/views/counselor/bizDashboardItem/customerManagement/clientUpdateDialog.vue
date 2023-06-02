<template>
	<v-dialog v-model="setdialog.open" persistent fullscreen>
		<div style="height:auto; min-height: 100%; background-color:#ffffff; ">
			<div style="position:fixed; width:100%; top:0; z-index:1;">
				<div style="width:100% " class="counselor_header">
					<v-layout align-center style="height:100%">
						<div @click="logo_click()">
							<v-img src="@/assets/images/image/counselor_logo.png"></v-img>
						</div>

						<div icon dark @click="logoutClick()" style="cursor:pointer" class="ml-auto">
							<v-img src="@/assets/images/ico/ico_logout.png" width="20"></v-img>
						</div>
					</v-layout>
				</div>
			</div>

			<v-layout class="tab_name_bar" style="position:fixed; width:100%; top:60px">
				<div class="header_left_btn">
					<v-btn icon x-large>
						<v-icon @click="click_close">
							mdi-chevron-left
						</v-icon>
					</v-btn>
				</div>
				<span style="margin-left:40px;">
					고객정보
				</span>
			</v-layout>
			<div class="px-6 mb-5" wrap style="padding-top: 130px; padding-bottom: 60px;">
				<div class="qr_name_type mb-7">
					고객 정보 확인 및 수정이 가능합니다.
				</div>
				<v-layout wrap>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								기본 정보
							</div>
						</v-layout>
						<v-layout wrap class="mt-1 customer_add_box">
							<v-flex xs12 class="mt-1">
								<v-layout wrap align-center>
									<v-flex xs2 style="font-size:12px; text-align:center;"> 고객명</v-flex>
									<v-flex xs4 class="pl-2" style="font-size:12px;">
										<txtField
											class="pt-0 bizInput"
											v-model="userData_1.name.value"
											:txtField="userData_1.name"
											style="height:27px; margin:auto"
										></txtField>
									</v-flex>
									<v-flex xs2 style="font-size:12px; text-align:center;"> 연락처</v-flex>
									<v-flex xs4 class="pl-2" style="font-size:12px;">
										<txtField
											class="pt-0 bizInput"
											v-model="userData_1.phone.value"
											:txtField="userData_1.phone"
											style="height:27px; margin:auto"
										></txtField
									></v-flex>
								</v-layout>
							</v-flex>
							<v-flex xs12>
								<v-layout wrap align-center class="mt-2">
									<v-flex xs2 style="font-size:12px; text-align:center;"> 성별</v-flex>
									<v-flex xs4 class="pl-2" style="font-size:12px;">
										<select-box class="select_box_ico mt-2" :sel="userData_1.sex"></select-box>
									</v-flex>
									<v-flex xs2 style="font-size:12px; text-align:center;"> 연령대</v-flex>
									<v-flex xs4 class="pl-2" style="font-size:12px;">
										<select-box class="select_box_ico mt-2 " :sel="userData_1.age"></select-box>
									</v-flex>
								</v-layout>
							</v-flex>
							<v-flex xs12>
								<v-layout wrap align-center class="mt-2">
									<v-flex xs2 style="font-size:12px; text-align:center;"> 지역</v-flex>
									<v-flex xs10 class="pl-2" style="font-size:12px; display:flex;">
										<select-box
											class="select_box_ico mt-2 mr-1"
											style="width:33%;"
											:sel="$store.state.searchsel_city1"
											@change="loc_firstSelect"
										></select-box>
										<select-box
											class="select_box_ico mt-2 mr-1"
											style="width:33%;"
											:sel="$store.state.searchsel_city2"
											@change="loc_twoSelect"
										></select-box>
										<select-box class="select_box_ico mt-2 " style="width:33%;" :sel="$store.state.searchsel_city3"></select-box>
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								관심상품 정보
							</div>
						</v-layout>

						<v-layout wrap class="mt-2 customer_add_box">
							<v-flex xs12>
								<v-layout wrap align-center>
									<v-flex xs2 style="font-size:12px; text-align:center;"> 대분류</v-flex>
									<v-flex xs10 class="pl-2" style="font-size:12px;">
										<select-box class="select_box_ico mt-2 " :sel="product_2.aCate"></select-box>
									</v-flex>
								</v-layout>
							</v-flex>
							<v-flex xs12>
								<v-layout wrap align-center class="mt-2">
									<v-flex xs2 style="font-size:12px; text-align:center;"> 중분류</v-flex>
									<v-flex xs10 class="pl-2" style="font-size:12px;">
										<select-box class="select_box_ico mt-2 " :sel="product_2.bCate"></select-box>
									</v-flex>
								</v-layout>
							</v-flex>
							<v-flex xs12>
								<v-layout wrap align-center class="mt-2">
									<v-flex xs2 style="font-size:12px; text-align:center;"> 상품</v-flex>
									<v-flex xs10 class="pl-2" style="font-size:12px;">
										<select-box class="select_box_ico mt-2 " :sel="product_2.list"></select-box>
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								고객 상태
							</div>
						</v-layout>

						<v-layout wrap class="mt-2 customer_add_box">
							<v-flex xs12>
								<v-layout wrap align-center>
									<v-flex xs2 style="font-size:12px; text-align:center;"> 상태</v-flex>
									<v-flex xs4 class="pl-2" style="font-size:12px;">
										<select-box class="select_box_ico mt-2 " :sel="product_2.status"></select-box>
									</v-flex>
									<v-flex xs2 style="font-size:12px; text-align:center;"> 유입경로</v-flex>
									<v-flex xs4 class="pl-2" style="font-size:12px;">
										<select-box class="select_box_ico mt-2 " :sel="product_2.type"></select-box>
									</v-flex>
								</v-layout>
							</v-flex>
							<v-flex xs12>
								<v-layout wrap align-center class="mt-2">
									<v-flex xs2 style="font-size:12px; text-align:center;"> 특이사항</v-flex>
									<v-flex xs10 class="pl-2" style="font-size:12px;">
										<v-textarea
											class="text_field_bottom"
											outlined
											rows="3"
											:value="product_2.comments"
											v-model="product_2.comments"
											style="border-radius:10px;font-size:12px;"
										></v-textarea>
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								고객 이력
							</div>
						</v-layout>
					</v-flex>
					<v-layout class="mt-1 mb-2">
						<v-data-table
							class="dashboard_detail_table"
							style="border:1px solid #DDDDDD;"
							height="130px"
							mobile-breakpoint="0"
							:headers="table1.headers"
							:items="table1.items"
							:disable-sort="false"
							:fixed-header="true"
							:hide-default-footer="true"
						>
						</v-data-table>
					</v-layout>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								알림톡 발송 이력
							</div>
						</v-layout>
					</v-flex>
					<v-layout class="mt-1 mb-2">
						<v-data-table
							class="dashboard_detail_table"
							style="border:1px solid #DDDDDD;"
							height="130px"
							:headers="table2.headers"
							mobile-breakpoint="0"
							:items="table2.items"
							:disable-sort="false"
							:fixed-header="true"
							:hide-default-footer="true"
						>
						</v-data-table>
					</v-layout>
				</v-layout>
			</div>

			<v-layout style="position:fixed; width:100%; bottom:0px; z-index:2;">
				<v-btn style="font-weight:bold; border-radius:0px;" width="50%" height="40" @click="click_update">
					확인
				</v-btn>
				<v-btn style="font-weight:bold; border-radius:0px;" color="primary2" dark depressed width="50%" height="40" @click="click_update()">
					저장
				</v-btn>
			</v-layout>
			<!-- 저장 불가 팝업 -->
			<!-- <sweet-alert :dialog="sweetDialog_info" /> -->
			<comfirmDialog :dialog="comfirmDialog_info" />
		</div>
	</v-dialog>
</template>

<script>
import {
	selectBox,
	txtField,
	// sweetAlert,
	comfirmDialog,
} from '@/components'
import location1 from '../../../../utils/location1'
import location2 from '../../../../utils/location2'

export default {
	components: {
		// sweetAlert,
		txtField,
		selectBox,
		comfirmDialog,
	},
	data() {
		return {
			comfirmDialog_info: {
				// 저장 불가 팝업
				open: false,
				title: '',
				content: `휴무일정 취소가 완료 되었습니다.`,
				buttonType: 'oneBtn',
				saveBtnText: '저장',
				cancelBtnText: '확인',
				modalIcon: 'info',
			},
			userData_1: {
				// step1
				agree_info_detail: false,
				agree: false,
				name: {
					value: '',
					maxlength: '255',
					outlined: true,
					hideDetail: true,
					errorMessage: '',
					autocomplete: 'off',
					placeholder: '직접입력',
				},
				phone: {
					value: '',
					maxlength: '255',
					outlined: true,
					hideDetail: true,
					errorMessage: '',
					autocomplete: 'off',
					placeholder: '직접입력',
				},
				sex: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '성별',
					value: '',
					items: ['남자', '여자'],
				},
				age: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '연령대',
					value: '',
					items: ['10대', '20대', '30대', '40대', '50대', '60대이상'],
				},
			},
			product_2: {
				//step2
				aCate: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '대분류',
					value: '',
					items: ['남', '여'],
				},
				bCate: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '중분류',
					value: '',
					items: ['남', '여'],
				},
				list: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '상품선택',
					value: '',
					multiple: true,
					items: ['남', '여'],
				},
				status: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '고객상태',
					value: '',
					items: ['DB등록', '상담대기', '상담완료', '계약가망', '계약대기', '계약완료'],
				},
				type: {
					disable: false,
					errorMessage: '',
					hideDetail: true,
					inputItems: [],
					outlined: true,
					class: 'small_font bizInput',
					placeholder: '유입경로',
					value: '',
					items: ['DB등록', '상담대기', '상담완료', '계약가망', '계약대기', '계약완료'],
				},
				comments: '',
			},
			table1: {
				headers: [
					{
						text: '이력항목',
						value: 'name',
						align: 'center',
					},
					{
						text: '등록일',
						value: 'created_at',
						align: 'center',
					},
					{
						text: '비고',
						value: 'etc',
						align: 'center',
					},
				],
				items: [
					{ name: '상담사 총 인원', dep2: '', goods: '-', customer: '' },
					{ name: '출근', dep2: '', goods: '-', customer: '' },
					{ name: '출근 미확인', dep2: '', goods: '-', customer: '' },
					{ name: '연차신청', dep2: '', goods: '-', customer: '' },
					{ name: '오늘 연차 및 반차 인원', dep2: '', goods: '-', customer: '' },
				],
			},
			table2: {
				headers: [
					{
						text: '발송항목',
						value: 'name',
						align: 'center',
					},
					{
						text: '발송일시',
						value: 'all',
						align: 'created_at',
					},
					{
						text: '결과',
						value: 'result',
						align: 'center',
						width: '25%',
					},
				],
				items: [
					{ name: '상담사 총 인원', dep2: '', goods: '-', customer: '' },
					{ name: '출근', dep2: '', goods: '-', customer: '' },
					{ name: '출근 미확인', dep2: '', goods: '-', customer: '' },
					{ name: '연차신청', dep2: '', goods: '-', customer: '' },
					{ name: '오늘 연차 및 반차 인원', dep2: '', goods: '-', customer: '' },
				],
			},
		}
	},
	props: {
		setdialog: Object,
		save_end: Function,
	},
	async created() {},
	watch: {
		setdialog: {
			deep: true,
			async handler() {
				if (this.setdialog.open) {
					this.$store.state.loading = true
					await this.me()
					await this.client_detail()
					// await this.businesses()
					// await this.first_productList()
					this.$store.state.loading = false
				} else this.click_close()
			},
		},
	},
	filters: {
		birth(value) {
			return value.substr(2, 2) + '.' + value.substr(4, 2) + '.' + value.substr(6, 2)
		},
	},
	methods: {
		async client_detail() {
			let input = {
				id: this.setdialog.data.id,
			}
			this.$store.state.loading = true
			this.$store.dispatch('clients', input).then(res => {
				this.userData_1.name.value = res.clients[0].name
				this.userData_1.phone.value = res.clients[0].phone
				this.userData_1.sex.value = res.clients[0].sex
				this.userData_1.age.value = res.clients[0].age
				this.$store.state.searchsel_city1.value = res.clients[0].address.split('_')[0]
				this.loc_firstSelect(res.clients[0].address.split('_')[0])
				this.$store.state.searchsel_city2.value = res.clients[0].address.split('_')[1]
				this.loc_twoSelect(res.clients[0].address.split('_')[1])
				this.$store.state.searchsel_city3.value = res.clients[0].address.split('_')[2]
				this.product_2.status.value = this.current_status(res.clients[0].contractStatus)
				this.product_2.comments = res.clients[0].comment
				// 유입경로,관심상품,고객이력,알림톡발송이력 필요
				this.$store.state.loading = false
			})
		},
		loc_firstSelect(val) {
			this.$store.state.searchsel_city2.items = location1[val].sort()
			this.$store.state.searchsel_city2.value = ''
			this.$store.state.searchsel_city3.value = ''
		},
		loc_twoSelect(val) {
			this.$store.state.searchsel_city3.value = ''
			this.$store.state.searchsel_city3.items = location2[this.$store.state.searchsel_city1.value][val].sort()
		},
		logoutClick() {
			sessionStorage.removeItem('here-t')
			this.$router.push({ name: 'counselorLogin' })
		},
		logo_click() {
			if (this.$store.state.meData.business && this.$store.state.meData.business.id) {
				if (
					this.$route.name !== 'counselorLogin' &&
					this.$route.name !== 'counselorRegister' &&
					this.$route.name !== 'counselorBizDashboard'
				) {
					this.$router.push({
						name: 'counselorBizDashboard',
						params: { id: this.$store.state.meData.business.id },
					})
				}
			}
		},

		async me() {
			await this.$store
				.dispatch('me')
				.then(() => {})
				.catch(() => {})
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
		typeCheck(val) {
			if (val === 10) {
				return '단일 선택'
			} else if (val == 11) {
				return '다중 선택'
			} else if (val == 12) {
				return '목록 선택박스'
			} else if (val == 20) {
				return '단답 입력'
			} else if (val == 21) {
				return '긴문장 입력'
			} else if (val == 22) {
				return '파일 업로드'
			}
		},

		// async first_productList() {
		// 	this.$store.state.loading = true

		// 	let input = {
		// 		business: this.$store.state.meData.business.id,
		// 	}
		// 	await this.$store
		// 		.dispatch('productList', input)
		// 		.then(res => {
		// 			let data1_list = []
		// 			res.products.forEach(el => {
		// 				if (el.data1) {
		// 					data1_list.push(el.data1)
		// 				}
		// 			})
		// 			let uniqueArr = data1_list.filter((element, index) => {
		// 				return data1_list.indexOf(element) === index
		// 			})
		// 			let clear_li = {
		// 				value: '',
		// 				items: uniqueArr,
		// 			}

		// 			this.product_list.data1 = clear_li
		// 			this.$store.state.loading = false
		// 		})
		// 		.catch(err => {
		// 			this.$store.state.loading = false
		// 			console.log({ err })
		// 		})
		// },
		// businesses() {
		// 	this.$store.state.loading = true

		// 	this.$store.dispatch('businesses').then(res => {
		// 		if (res.businesses[0].product.length > 0) {
		// 			this.product_title = res.businesses[0].product
		// 			this.$store.state.loading = false
		// 		}
		// 	})
		// },

		async click_update() {
			let input = {
				id: this.setdialog.data.id,
				name: this.userData_1.name.value,
				phone: this.userData_1.phone.value,
				sex: this.userData_1.sex.value,
				age: this.userData_1.age.value,
				address:
					this.$store.state.searchsel_city1.value +
					'_' +
					this.$store.state.searchsel_city2.value +
					'_' +
					this.$store.state.searchsel_city3.value,
				products: [],
				contractStatus: this.current_status2(this.product_2.status.value),
				comment: this.product_2.status.comments,
				// 유입경로,관심상품,고객이력,알림톡발송이력 필요
			}
			console.log(input)
			// await this.$store
			// 	.dispatch('createUpdate', input)
			// 	.then(() => {
			// 		this.$router.push({
			// 			name: 'counselorBizDashboard',
			// 			params: { id: this.$store.state.meData.business.id },
			// 		})
			// 		this.comfirmDialog_info.type = ''
			// 		this.comfirmDialog_info.content = '고객 수정이 완료 되었습니다.'
			// 		this.comfirmDialog_info.open = true
			// 		this.dialog.open = false
			// 		this.$store.state.loading = false
			// 	})
			// 	.catch(() => {
			// 		this.$store.state.loading = false
			// 	})
		},
		click_close() {
			this.setdialog.open = false
		},
	},
}
</script>

<style lang="scss">
.product_hover:hover {
	background-color: #633efd;
	color: #ffffff;
	cursor: pointer;
}
.product_focus {
	background-color: #633efd;
	color: #ffffff;
	cursor: pointer;
}
.product_disabled {
	color: #c4c4c4 !important;
}
.text_field_bottom {
	div {
		.v-text-field__details {
			display: none;
		}
	}
}
</style>
