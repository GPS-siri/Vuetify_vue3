<template>
	<v-dialog v-model="dialog.open" persistent content-class="qr-modal-type" max-width="400">
		<!-- 이름/ 전화번호/ 주소 입력 -->
		<div v-if="step === 0">
			<v-layout class="dialog_header_reservaition" align-center>
				<div class="main-title-type mr-auto">
					{{ dialog.edit ? '일정변경' : '일정 작성하기' }}
				</div>

				<v-btn icon @click="dialog.open = false" class="pr-8">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<div class="px-6 mb-15 dialog_content_container" wrap>
				<div class="qr_name_type mb-7">
					STEP 1 고객정보 입력
				</div>
				<v-layout wrap class="customer_add_box">
					<v-flex xs10 style="font-size:14px; font-weight:500">
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
							on-icon="mdi-check-circle"
							off-icon="mdi-check-circle-outline"
							dense
							color="primary2"
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
					<v-flex v-if="userData_1.agree_info_detail" xs10 class="mt-2" style="font-size:12px; padding:0 0 0 30px;">
						[필수] 개인정보 제3자 제공 동의
					</v-flex>
					<v-flex
						v-if="userData_1.agree_info_detail"
						xs2
						class="mt-2"
						style="font-size:12px; text-align:end; text-decoration: underline; cursor:pointer;"
					>
						보기
					</v-flex>
				</v-layout>
				<v-layout align-center class="mt-2">
					<div class="client-subTitle">
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
					<div class="client-subTitle">
						연락처
					</div>
				</v-layout>
				<v-layout class="mt-1">
					<txtField
						class="pt-0 bizInput"
						v-model="userData_1.phone.value"
						:txtField="userData_1.phone"
						style="height:27px; margin:auto"
					></txtField>
				</v-layout>
				<v-layout wrap>
					<v-flex xs6 class="pr-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle">
								성별
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="userData_1.sex"></select-box>
						</v-layout>
					</v-flex>
					<v-flex xs6 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle">
								연령대
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="userData_1.age"></select-box>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout align-center class="mt-2">
					<div class="client-subTitle">
						지역
					</div>
				</v-layout>
				<v-layout class="mt-1" wrap>
					<v-flex xs4 class="pr-1">
						<select-box class="select_box_ico " :sel="$store.state.searchsel_city1" @change="loc_firstSelect"></select-box>
					</v-flex>
					<v-flex xs4 class="pr-1">
						<select-box class="select_box_ico" :sel="$store.state.searchsel_city2" @change="loc_twoSelect"></select-box>
					</v-flex>
					<v-flex xs4>
						<select-box class="select_box_ico " :sel="$store.state.searchsel_city3"></select-box>
					</v-flex>
				</v-layout>
			</div>

			<v-layout style="width:100%">
				<v-btn
					style="font-weight:bold; border-radius:0px;"
					color="primary2"
					dark
					width="100%"
					max-width="400px"
					height="51"
					@click="click_next_1()"
				>
					다음
				</v-btn>
			</v-layout>
		</div>

		<!-- 상품 선택 -->
		<div v-else-if="step === 1">
			<v-layout class="dialog_header_reservaition" align-center>
				<div class="main-title-type mr-auto">
					{{ dialog.edit ? '일정변경' : '일정 작성하기' }}
				</div>

				<v-btn icon @click="dialog.open = false" class="pr-8">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<div class="px-6 dialog_content_container" wrap>
				<div class="qr_name_type mb-7">
					STEP 2 상담(서비스)항목 선택
				</div>
				<v-layout wrap>
					<!-- 제목 -->
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle">
								제목
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<txtField
								class="pt-0 bizInput"
								v-model="product_2.title.value"
								:txtField="product_2.title"
								style="height:27px; margin:auto"
							></txtField>
						</v-layout>
					</v-flex>

					<!-- 대분류 -->
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle">
								대분류
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="product_2.aCate"></select-box>
						</v-layout>
					</v-flex>
					<!-- 중분류 -->
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle">
								중분류
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="product_2.bCate"></select-box>
						</v-layout>
					</v-flex>
					<!-- 항분류 -->
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle">
								항목
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<select-box class="select_box_ico " :sel="product_2.list"></select-box>
						</v-layout>
					</v-flex>
					<!-- 특이사항 -->
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-2">
							<div class="client-subTitle">
								특이사항
							</div>

							<div class="item_guide">
								※ 고객님이 선택하신 카테고리의 서비스(상품) 목록입니다.
							</div>
						</v-layout>
						<v-layout class="mt-1">
							<v-textarea
								rows="1"
								class="manage_input"
								outlined
								hideDetails
								dense
								no-resize
								v-model="product_2.memo"
								color="primary2"
							></v-textarea>
						</v-layout>
					</v-flex>
					<!-- 일정정보-->
					<v-flex xs12 class="pl-1">
						<v-layout align-center class="mt-6 mb-2">
							<div class="client-subTitle">
								일정정보
							</div>
							<div class="item_guide">
								※ 고객님의 예약 정보입니다
							</div>
						</v-layout>
					</v-flex>
					<v-layout wrap class="customer_add_box_reservation mb-5">
						<!-- 제목 -->
						<v-flex xs12>
							<v-layout wrap class="px-3 py-2">
								<v-flex xs2 style="font-size:12px;"> 제목</v-flex>
								<v-flex xs10 style="font-size:12px;">{{ product_2.title.value }}</v-flex>
							</v-layout>
						</v-flex>
						<!-- 고객정보 -->
						<v-flex xs12 style="border-top:1px solid #DDDDDD">
							<v-layout wrap class="px-3 py-2">
								<v-flex xs2 style="font-size:12px;"> 고객</v-flex>
								<v-flex xs6 style="font-size:12px;">{{ userData_1.name.value }}</v-flex>
								<v-flex xs4 style="font-size:12px;">{{ phone_bar(userData_1.phone.value) }}</v-flex>
								<v-flex offset-xs2 xs10 class="mt-2" style="font-size:12px;"
									>{{ $store.state.searchsel_city1.value }}{{ '  ' }} {{ $store.state.searchsel_city2.value }} {{ '  '
									}}{{ $store.state.searchsel_city3.value }}</v-flex
								>
							</v-layout>
						</v-flex>
						<!-- 선택 항목 -->
						<v-flex xs12 style="border-top:1px solid #DDDDDD">
							<v-layout wrap class="px-3 py-2">
								<v-flex xs2 style="font-size:12px;">항목</v-flex>
								<v-flex xs10 style="font-size:12px; white-space:pre-wrap">{{ userData_1.name.value }}</v-flex>
							</v-layout>
						</v-flex>
						<!-- 특이사항 -->
						<v-flex xs12 style="border-top:1px solid #DDDDDD">
							<v-layout wrap class="px-3 py-2">
								<v-flex xs2 style="font-size:12px;"> 특이사항</v-flex>
								<v-flex xs10 style="font-size:12px; white-space:pre-wrap">{{ product_2.memo }}</v-flex>
							</v-layout>
						</v-flex>
						<!-- 일시 -->
						<v-flex xs12 style="border-top:1px solid #DDDDDD">
							<v-layout wrap class="px-3 py-2">
								<v-flex xs2 style="font-size:12px;"> 일시</v-flex>
								<v-flex xs10 style="font-size:12px;">{{ date_select.select_date }}</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-layout>
			</div>

			<v-layout style="width:100%">
				<v-btn
					color="white"
					style="border-top:1px solid black !important; border-radius:0px;"
					width="50%"
					max-width="200px"
					height="51"
					@click="step = 0"
				>
					이전
				</v-btn>
				<v-btn
					style="font-weight:bold; border-radius:0px;"
					color="primary2"
					dark
					depressed
					width="50%"
					max-width="200px"
					height="51"
					@click="step = 2"
				>
					다음
				</v-btn>
			</v-layout>
		</div>

		<!-- 시간 선택 -->
		<div v-else-if="step === 2">
			<v-layout class="dialog_header_reservaition" align-center>
				<div class="main-title-type mr-auto">
					{{ dialog.edit ? '일정변경' : '일정 작성하기' }}
				</div>

				<v-btn icon @click="dialog.open = false" class="pr-8">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<div class="px-6 dialog_content_container" wrap>
				<div class="qr_name_type">
					{{ dialog.edit ? `기존일정 : 2023년 2월16일 (목) 10:00` : 'STEP 3 날짜 및 시간 선택' }}
				</div>

				<!-- 날짜 선택 -->
				<div class="datepicker_wrap mt-2">
					<div class="datepicker_title">
						날짜 선택
					</div>
					<v-date-picker
						color="primary2"
						class="reserve-datepicker reservation_select"
						width="100%"
						no-title
						locale="ko"
						v-model="date_select.date"
						:day-format="dayFormat"
						@change="availableTimes"
						:allowed-dates="allowedDates"
					></v-date-picker>
				</div>

				<div class="reservation_item_title mt-4 ml-1 mb-2">
					시간 선택
				</div>

				<div class="reservation_time_wrap">
					<div class="reservation_time"><v-btn class="time_btn" depressed block dark color="primary2">10:00</v-btn></div>
					<div class="reservation_time"><v-btn class="time_btn" depressed block outlined color="primary2">10:00</v-btn></div>
					<div class="reservation_time"><v-btn class="time_btn" depressed block outlined color="primary2">10:00</v-btn></div>
					<div class="reservation_time"><v-btn class="time_btn" depressed block outlined color="primary2">10:00</v-btn></div>
					<div class="reservation_time"><v-btn class="time_btn" depressed block outlined color="primary2">10:00</v-btn></div>
					<div class="reservation_time"><v-btn class="time_btn" depressed block outlined color="primary2">10:00</v-btn></div>
					<div class="reservation_time"><v-btn class="time_btn" depressed block outlined color="primary2">10:00</v-btn></div>
					<div class="reservation_time"><v-btn class="time_btn" disabled depressed block color="primary2">10:00</v-btn></div>
				</div>

				<!-- 일정 정보 -->
				<div class="display_flex pl-1 mt-5 mb-2">
					<div class="reservation_item_title">
						일정정보
					</div>

					<div class="item_guide">
						※ 고객님의 예약 정보입니다
					</div>
				</div>
				<v-layout wrap class="customer_add_box_reservation mb-5">
					<!-- 제목 -->
					<v-flex xs12>
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;"> 제목</v-flex>
							<v-flex xs10 style="font-size:12px;">{{ product_2.title.value }}</v-flex>
						</v-layout>
					</v-flex>
					<!-- 고객정보 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;"> 고객</v-flex>
							<v-flex xs6 style="font-size:12px;">{{ userData_1.name.value }}</v-flex>
							<v-flex xs4 style="font-size:12px;">{{ phone_bar(userData_1.phone.value) }}</v-flex>
							<v-flex offset-xs2 xs10 class="mt-2" style="font-size:12px;"
								>{{ $store.state.searchsel_city1.value }}{{ '  ' }} {{ $store.state.searchsel_city2.value }} {{ '  '
								}}{{ $store.state.searchsel_city3.value }}</v-flex
							>
						</v-layout>
					</v-flex>
					<!-- 선택 항목 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;">항목</v-flex>
							<v-flex xs10 style="font-size:12px; white-space:pre-wrap">{{ userData_1.name.value }}</v-flex>
						</v-layout>
					</v-flex>
					<!-- 특이사항 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;"> 특이사항</v-flex>
							<v-flex xs10 style="font-size:12px; white-space:pre-wrap">{{ product_2.memo }}</v-flex>
						</v-layout>
					</v-flex>
					<!-- 일시 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;"> 일시</v-flex>
							<v-flex xs10 style="font-size:12px;">{{ date_select.select_date }}</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</div>

			<v-layout style="width:100%">
				<v-btn
					style="border-top:1px solid black !important; border-radius:0px;"
					color="white"
					width="50%"
					max-width="200px"
					height="51"
					@click="back_click()"
				>
					{{ dialog.edit ? '취소' : '이전' }}
				</v-btn>
				<v-btn
					style="font-weight:bold; border-radius:0px;"
					color="primary2"
					dark
					depressed
					width="50%"
					max-width="200px"
					height="51"
					@click="step = 3"
					>다음
				</v-btn>
			</v-layout>
		</div>

		<!-- 작성완료 -->
		<div v-else-if="step === 3">
			<v-layout class="dialog_header_reservaition" align-center>
				<div class="main-title-type mr-auto">
					{{ dialog.edit ? '일정변경' : '일정 작성하기' }}
				</div>

				<v-btn icon @click="dialog.open = false" class="pr-8">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<div class="px-6 dialog_content_container" wrap>
				<div class="qr_name_type">
					{{ dialog.edit ? `기존일정 : 2023년 2월16일 (목) 10:00` : 'STEP 4 작성 완료' }}
				</div>

				<!-- 일정 정보 -->
				<div class="display_flex pl-1 mt-5 mb-2">
					<div v-if="!dialog.edit" class="reservation_item_title">
						일정정보
					</div>

					<div v-else class="item_guide ml-0">
						※ 변경 예약 정보
					</div>
				</div>
				<v-layout wrap class="customer_add_box_reservation mb-5">
					<!-- 제목 -->
					<v-flex xs12>
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;"> 제목</v-flex>
							<v-flex xs10 style="font-size:12px;">{{ product_2.title.value }}</v-flex>
						</v-layout>
					</v-flex>
					<!-- 고객정보 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;"> 고객</v-flex>
							<v-flex xs6 style="font-size:12px;">{{ userData_1.name.value }}</v-flex>
							<v-flex xs4 style="font-size:12px;">{{ phone_bar(userData_1.phone.value) }}</v-flex>
							<v-flex offset-xs2 xs10 class="mt-2" style="font-size:12px;"
								>{{ $store.state.searchsel_city1.value }}{{ '  ' }} {{ $store.state.searchsel_city2.value }} {{ '  '
								}}{{ $store.state.searchsel_city3.value }}</v-flex
							>
						</v-layout>
					</v-flex>
					<!-- 선택 항목 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;">항목</v-flex>
							<v-flex xs10 style="font-size:12px; white-space:pre-wrap">{{ userData_1.name.value }}</v-flex>
						</v-layout>
					</v-flex>
					<!-- 특이사항 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;"> 특이사항</v-flex>
							<v-flex xs10 style="font-size:12px; white-space:pre-wrap">{{ product_2.memo }}</v-flex>
						</v-layout>
					</v-flex>
					<!-- 일시 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;"> 일시</v-flex>
							<v-flex xs10 style="font-size:12px;">{{ date_select.select_date }}</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</div>

			<v-layout style="width:100%">
				<v-btn
					style="border-top:1px solid black !important; border-radius:0px;"
					color="white"
					width="50%"
					max-width="200px"
					height="51"
					@click="step = 2"
				>
					이전
				</v-btn>
				<v-btn
					style="font-weight:bold; border-radius:0px;"
					color="primary2"
					dark
					depressed
					width="50%"
					max-width="200px"
					height="51"
					@click="save_data()"
				>
					{{ dialog.edit ? `확인` : '작성완료' }}
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
import location2 from '../../../..//utils/location2'
import {
	//  DatepickerDialog,
	sweetAlert,
	comfirmDialog,
} from '@/components'

export default {
	components: { sweetAlert, comfirmDialog, selectBox, txtField },

	data() {
		return {
			step: 2,

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
					placeholder: '',
					color: 'primary2',
				},

				phone: {
					value: '',
					maxlength: '255',
					outlined: true,
					hideDetail: true,
					errorMessage: '',
					autocomplete: 'off',
					color: 'primary2',
					placeholder: '',
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
					items: ['남', '여'],
					color: 'primary2',
					itemColor: 'primary2',
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
					color: 'primary2',
					itemColor: 'primary2',
				},
			},
			product_2: {
				//step2
				title: {
					value: '',
					maxlength: '255',
					outlined: true,
					hideDetail: true,
					errorMessage: '',
					autocomplete: 'off',
					placeholder: '',
					color: 'primary2',
				},
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
					color: 'primary2',
					itemColor: 'primary2',
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
					color: 'primary2',
					itemColor: 'primary2',
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
					color: 'primary2',
					itemColor: 'primary2',
				},
				memo: '',
				comments: '',
			},

			date_select: {
				date: '',
				select_date: '',
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
		doneDialog: Object,
	},
	watch: {
		dialog: {
			deep: true,
			handler() {
				if (this.dialog.open) {
					if (this.dialog.edit) {
						this.step = 2
					} else {
						this.step = 0
					}
				}
			},
		},
	},
	created() {},
	methods: {
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
			} else if (!this.userData_1.name.value) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '이름을 입력해주세요'
				this.comfirmDialog_info.open = true
			} else if (!this.userData_1.phone.value) {
				this.comfirmDialog_info.type = 'customer_question'
				this.comfirmDialog_info.content = '연락처를 입력해주세요'
				this.comfirmDialog_info.open = true
			} else if (!phone_check.test(this.userData_1.phone.value)) {
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
		async availableTimes() {},
		dayFormat(day) {
			const arr = day.split('-')
			return Number(arr[arr.length - 1])
		},
		allowedDates(val) {
			// if (this.able_date.start <= val && this.able_date.end >= val && this.$moment().format('YYYY-MM-DD') <= val) return val
			return val
		},
		save_data() {
			this.dialog.open = false
			if (this.dialog.edit) {
				this.doneDialog.open = true
				this.doneDialog.content = '일정 변경이 완료되었습니다'
			} else {
				this.doneDialog.open = true
				this.doneDialog.content = '일정 작성이 완료 되었습니다'
			}
		},
		back_click() {
			if (this.dialog.edit) {
				this.dialog.open = false
			} else {
				this.step = 1
			}
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
