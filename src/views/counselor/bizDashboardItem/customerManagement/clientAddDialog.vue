<template>
	<v-dialog v-model="dialog.open" persistent content-class="qr-modal-type" max-width="400">
		<div v-if="step === 0">
			<v-layout class="qr-header" align-center>
				<div class="main-title-type mr-auto">
					고객등록
				</div>

				<v-btn icon @click="dialog.open = false" class="pr-8">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<div class="px-6 mb-5" wrap>
				<div class="qr_name_type mb-7">
					STEP 1 고객정보 입력
				</div>
				<v-layout wrap class="customer_add_box">
					<v-flex xs10 style="font-size:14px;">
						개인정보 수집 및 이용, 제공에 관한 동의
					</v-flex>
					<v-flex xs2 style="text-align:end;" v-if="userData_1.agree_info_detail">
						<v-icon @click="userData_1.agree_info_detail = false">mdi-chevron-up</v-icon>
					</v-flex>
					<v-flex xs2 v-else style="text-align:end;">
						<v-icon @click="userData_1.agree_info_detail = true">mdi-chevron-down</v-icon>
					</v-flex>
					<v-flex>
						<v-checkbox
							class="customer_radio"
							label="동의하기"
							v-model="userData_1.agree"
							:color="$store.state.PointColor1"
							on-icon="mdi-check-circle"
							off-icon="mdi-check-circle-outline"
							dense
						>
						</v-checkbox>
					</v-flex>
					<v-flex v-if="userData_1.agree_info_detail" xs10 style="font-size:12px; padding:0 0 0 30px;">
						[필수] 개인정보 수집 및 이용에 관한 동의
					</v-flex>
					<v-flex
						v-if="userData_1.agree_info_detail"
						xs2
						style="font-size:12px; text-align:end; text-decoration: underline; cursor:pointer;"
					>
						보기
					</v-flex>
					<v-flex v-if="userData_1.agree_info_detail" xs10 style="font-size:12px; padding:0 0 0 30px;">
						[필수] 개인정보 제3자 제공 동의
					</v-flex>
					<v-flex
						v-if="userData_1.agree_info_detail"
						xs2
						style="font-size:12px; text-align:end; text-decoration: underline; cursor:pointer;"
					>
						보기
					</v-flex>
				</v-layout>
				<v-layout align-center class="mt-2">
					<div class="client-subTitle pl-2">
						고객
					</div>
				</v-layout>
				<v-layout class="mt-1">
					<txtField
						class="pt-0 bizInput"
						v-model="userData_1.name.value"
						:txtField="userData_1.name"
						style="height:27px; margin:auto"
					></txtField>
				</v-layout>
				<v-layout align-center class="mt-2">
					<div class="client-subTitle pl-2">
						연락처
					</div>
				</v-layout>
				<v-layout class="mt-1">
					<txtField
						class="pt-0 bizInput"
						v-model="userData_1.name.value"
						:txtField="userData_1.name"
						style="height:27px; margin:auto"
					></txtField>
				</v-layout>
				<v-layout wrap>
					<v-flex xs6 class="pr-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								성별
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="userData_1.sex"></select-box>
						</v-layout>
					</v-flex>
					<v-flex xs6 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								연령대
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="userData_1.age"></select-box>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout align-center class="mt-2">
					<div class="client-subTitle pl-2">
						지역
					</div>
				</v-layout>
				<v-layout class="mt-1">
					<select-box class="select_box_ico mr-1" :sel="$store.state.searchsel_city1" @change="loc_firstSelect"></select-box>
					<select-box class="select_box_ico mr-1" :sel="$store.state.searchsel_city2" @change="loc_twoSelect"></select-box>
					<select-box class="select_box_ico " :sel="$store.state.searchsel_city3"></select-box>
				</v-layout>
			</div>

			<v-layout style="width:100%">
				<v-btn
					style="font-weight:bold; border-radius:0px;"
					color="primary2"
					dark
					width="100%"
					max-width="400px"
					height="40"
					@click="click_next_1()"
				>
					다음
				</v-btn>
			</v-layout>
		</div>
		<div v-else-if="step === 1">
			<v-layout class="qr-header" align-center>
				<div class="main-title-type mr-auto">
					고객등록
				</div>

				<v-btn icon @click="dialog.open = false" class="pr-8">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<div class="px-6" wrap>
				<div class="qr_name_type mb-7">
					STEP 2 상담(서비스)항목 선택
				</div>
				<v-layout wrap>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								대분류
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="product_2.aCate"></select-box>
						</v-layout>
					</v-flex>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								중분류
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="product_2.bCate"></select-box>
						</v-layout>
					</v-flex>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								상품선택
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="product_2.list"></select-box>
						</v-layout>
					</v-flex>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								고객상태
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="product_2.status"></select-box>
						</v-layout>
					</v-flex>
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle pl-2">
								고객정보
							</div>
						</v-layout>
					</v-flex>
					<v-layout wrap class="customer_add_box mb-5">
						<v-flex xs12 class="py-1">
							<v-layout wrap>
								<v-flex xs2 style="font-size:12px;"> 고객명</v-flex>
								<v-flex xs6 class="pl-2" style="font-size:12px;">{{ userData_1.name }}</v-flex>
								<v-flex xs4 style="font-size:12px;">{{ phone_bar(userData_1.phone) }}</v-flex>
							</v-layout>
						</v-flex>
						<v-flex xs12 style="border-top:1px solid #DDDDDD" class="py-1">
							<v-layout wrap>
								<v-flex xs2 style="font-size:12px;"> </v-flex>
								<v-flex xs10 class="pl-2" style="font-size:12px;"
									>{{ $store.state.searchsel_city1.value }}{{ '  ' }} {{ $store.state.searchsel_city2.value }} {{ '  '
									}}{{ $store.state.searchsel_city3.value }}</v-flex
								>
							</v-layout>
						</v-flex>
						<v-flex xs12 style="border-top:1px solid #DDDDDD" class="py-1">
							<v-layout wrap v-for="(data, index) in product_2.list.value" :key="index + 'q'">
								<v-flex v-if="index === 0" xs2 style="font-size:12px;"> 관심상품</v-flex>
								<v-flex v-else xs2 class="pl-2" style="font-size:12px;"> </v-flex>
								<v-flex xs10 class="pl-2" style="font-size:12px;">{{ data }}</v-flex>
							</v-layout>
						</v-flex>
						<v-flex xs12 style="border-top:1px solid #DDDDDD" class="py-1">
							<v-layout wrap>
								<v-flex xs2 style="font-size:12px;"> 특이사항</v-flex>
								<v-flex xs10 class="pl-2" style="font-size:12px;">
									<v-textarea
										class="text_field_bottom"
										outlined
										rows="3"
										:value="product_2.comments"
										v-model="product_2.comments"
										style="border-radius:10px;font-size:12px;"
									></v-textarea
								></v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-layout>
			</div>

			<v-layout style="width:100%">
				<v-btn style="font-weight:bold; border-radius:0px;" width="50%" max-width="200px" height="40" @click="step = 0">
					이전
				</v-btn>
				<v-btn
					style="font-weight:bold; border-radius:0px;"
					color="primary2"
					dark
					depressed
					width="50%"
					max-width="200px"
					height="40"
					@click="click_next_2()"
				>
					다음
				</v-btn>
			</v-layout>
		</div>
		<div v-else-if="step === 2">
			<v-layout class="qr-header" align-center>
				<div class="main-title-type mr-auto">
					고객등록
				</div>

				<v-btn icon @click="dialog.open = false" class="pr-8">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<div class="px-6" wrap>
				<div class="qr_name_type mb-7">
					STEP 3 등록 정보 확인
				</div>
				<v-flex xs12 class="pl-1">
					<v-layout align-center class="mt-2">
						<div class="client-subTitle">
							고객정보
						</div>
					</v-layout>
				</v-flex>
				<v-layout wrap class="customer_add_box mb-5">
					<v-flex xs12 class="py-1">
						<v-layout wrap>
							<v-flex xs2 style="font-size:12px;"> 고객명</v-flex>
							<v-flex xs10 class="pl-2" style="font-size:12px;">{{ userData_1.name }}</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 class="py-1">
						<v-layout wrap>
							<v-flex xs2 style="font-size:12px;"> 연락처</v-flex>
							<v-flex xs10 class="pl-2" style="font-size:12px;">{{ phone_bar(userData_1.phone) }}</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 style="border-top:1px solid #DDDDDD" class="py-1">
						<v-layout wrap>
							<v-flex xs2 style="font-size:12px;"> 성별</v-flex>
							<v-flex xs10 class="pl-2" style="font-size:12px;">{{ userData_1.sex.value }} / {{ userData_1.age.value }}</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 style="border-top:1px solid #DDDDDD" class="py-1">
						<v-layout wrap>
							<v-flex xs2 style="font-size:12px;"> 지역</v-flex>
							<v-flex xs10 class="pl-2" style="font-size:12px;"
								>{{ $store.state.searchsel_city1.value }}{{ '  ' }} {{ $store.state.searchsel_city2.value }} {{ '  '
								}}{{ $store.state.searchsel_city3.value }}</v-flex
							>
						</v-layout>
					</v-flex>
					<v-flex xs12 style="border-top:1px solid #DDDDDD" class="py-1">
						<v-layout wrap v-for="(data, index) in product_2.list.value" :key="index + 'q'">
							<v-flex v-if="index === 0" xs2 style="font-size:12px;"> 관심상품</v-flex>
							<v-flex v-else xs2 class="pl-2" style="font-size:12px;"> </v-flex>
							<v-flex xs10 class="pl-2" style="font-size:12px;">{{ data }}</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 style="border-top:1px solid #DDDDDD" class="py-1">
						<v-layout wrap>
							<v-flex xs2 style="font-size:12px;"> 고객상태</v-flex>
							<v-flex xs10 class="pl-2" style="font-size:12px;">{{ product_2.status.value }}</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 style="border-top:1px solid #DDDDDD" class="py-1">
						<v-layout wrap>
							<v-flex xs2 style="font-size:12px;"> 특이사항</v-flex>
							<v-flex xs10 class="pl-2" style="font-size:12px;">
								<v-textarea
									class="text_field_bottom"
									outlined
									disabled
									rows="3"
									:value="product_2.comments"
									v-model="product_2.comments"
									style="border-radius:10px;font-size:12px;"
								></v-textarea
							></v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12 style="border-top:1px solid #DDDDDD" class="py-1">
						<v-layout wrap>
							<v-flex xs2 style="font-size:12px;"> 등록일시</v-flex>
							<v-flex xs10 class="pl-2" style="font-size:12px;">{{ dayCheck($moment()) }}</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</div>

			<v-layout style="width:100%">
				<v-btn style="font-weight:bold; border-radius:0px;" width="50%" max-width="200px" height="40" @click="step = 1">
					이전
				</v-btn>
				<v-btn
					style="font-weight:bold; border-radius:0px;"
					color="primary2"
					dark
					depressed
					width="50%"
					max-width="200px"
					height="40"
					@click="click_save()"
				>
					작성완료
				</v-btn>
			</v-layout>
		</div>
		<sweet-alert :dialog="sweetDialog_info" />
		<comfirmDialog :dialog="comfirmDialog_info" />
	</v-dialog>
</template>
<script>
import { selectBox, txtField } from '@/components/index.js'
import location1 from '../../../../utils/location1'
import location2 from '../../../../utils/location1'
import {
	//  DatepickerDialog,
	sweetAlert,
	comfirmDialog,
} from '@/components'

export default {
	components: { sweetAlert, comfirmDialog, selectBox, txtField },

	data() {
		return {
			step: 0,

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
					placeholder: '고객명',
				},
				phone: {
					value: '',
					maxlength: '255',
					outlined: true,
					hideDetail: true,
					errorMessage: '',
					autocomplete: 'off',
					placeholder: '연락처',
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
				comments: '',
			},
			txtfield: {
				value: '',
				maxlength: '255',
				outlined: true,
				hideDetail: true,
				errorMessage: '',
				autocomplete: 'off',
				placeholder: '',
				disable: false,
			},
			sweetDialog_info: {
				// 저장 불가 팝업
				open: false,
				title: '',
				content: ``,
				buttonType: 'oneBtn',
				saveBtnText: '저장',
				cancelBtnText: '확인',
				modalIcon: 'info',
			},
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
			applicationCancleDialog: {
				// 저장 불가 팝업
				open: false,
				title: '휴무신청 취소',
				content: `휴무일정 취소가 완료 되었습니다.`,
				buttonType: 'oneBtn',
				saveBtnText: '저장',
				cancelBtnText: '확인',
				modalIcon: 'info',
			},
		}
	},
	props: {
		dialog: Object,
	},
	watch: {
		dialog: {
			deep: true,
			handler() {
				// if (this.dialog.open) {
				// }
			},
		},
	},
	created() {},
	methods: {
		dayOfTheWeek(val) {
			if (val === '0') {
				return '(일)'
			} else if (val === '1') {
				return '(월)'
			} else if (val === '2') {
				return '(화)'
			} else if (val === '3') {
				return '(수)'
			} else if (val === '4') {
				return '(목)'
			} else if (val === '5') {
				return '(금)'
			} else if (val === '6') {
				return '(토)'
			}
		},
		dayCheck(val) {
			return (
				this.$moment(val).format('gggg년 MM월 DD일') +
				' ' +
				this.dayOfTheWeek(this.$moment(val).format('e')) +
				' ' +
				this.$moment(val).format('hh:mm')
			)
		},
		phone_bar(val) {
			if (val) {
				return val.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
			} else {
				return val
			}
		},
		click_next_1() {
			let phone_check = /01[016789][^0][0-9]{2,3}[0-9]{3,4}/
			if (!this.userData_1.agree) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '개인정보 수집및 이용 제공에 관한 동의해주세요'
				this.comfirmDialog_info.open = true
			} else if (!this.userData_1.name) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '이름을 입력해주세요'
				this.comfirmDialog_info.open = true
			} else if (!this.userData_1.phone) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '연락처를 입력해주세요'
				this.comfirmDialog_info.open = true
			} else if (!phone_check.test(this.userData_1.phone)) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '잘못된 연락처입니다.'
				this.comfirmDialog_info.open = true
			} else if (!this.userData_1.sex.value) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '성별을 선택해주세요'
				this.comfirmDialog_info.open = true
			} else if (!this.userData_1.age.value) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '연령대을 선해주세요'
				this.comfirmDialog_info.open = true
			} else if (
				!this.$store.state.searchsel_city1.value ||
				!this.$store.state.searchsel_city2.value ||
				!this.$store.state.searchsel_city3.value
			) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '지역을 선해주세요'
				this.comfirmDialog_info.open = true
			} else {
				this.step = 1
			}
		},
		click_next_2() {
			if (!this.product_2.status) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '고객 상태를 선택하세요'
				this.comfirmDialog_info.open = true
			} else {
				this.step = 2
			}
		},
		async click_save() {
			let input = {
				business: this.$store.state.meData.business.id,
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
			}
			console.log(input)
			// await this.$store
			// 	.dispatch('createClient', input)
			// 	.then(() => {
			// 		this.$router.push({
			// 			name: 'counselorBizDashboard',
			// 			params: { id: this.$store.state.meData.business.id },
			// 		})
			// 		this.comfirmDialog_info.type = ''
			// 		this.comfirmDialog_info.content = '고객 등록이 완료 되었습니다.'
			// 		this.comfirmDialog_info.open = true
			// 		this.dialog.open = false
			// 		this.$store.state.loading = false
			// 	})
			// 	.catch(() => {
			// 		this.$store.state.loading = false
			// 	})
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

		vacation_result_filter(val) {
			if (val === 'waiting') {
				return '승인대기'
			} else if (val === 'agree' || val === 'admin') {
				return '승인완료'
			} else if (val === 'disagree') {
				return '승인거절'
			}
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
	},
}
</script>
<style lang="scss">
.qr-code {
	width: 100%;
}
.qr-text {
	font-size: 14px;
	color: #828282;
}
.qr_name_type {
	font-size: 12px;
	color: #633efd;
}
.qr-modal-type {
	background-color: white;
	border-radius: 0px 41px 0px 41px !important;
	padding: 0px;
}
.qr-header {
	height: 50px;
	.main-title-type {
		padding-left: 30px;
		// color: black;
		font-size: 14px;
		font-weight: bold;
	}
}

.flex.radioStyle > div > div {
	margin-right: 0px !important;
}

.flex.radioStyle > div > div > label {
	font-size: 0.75rem;
}
.radio_group_style {
	.v-input__control {
		.v-messages {
			display: none;
		}
	}
}
.dash_style {
	border-bottom: 1px dashed #707070;
}
.vacation_text {
	text-align: start;
	font-size: 12px;
}
</style>
