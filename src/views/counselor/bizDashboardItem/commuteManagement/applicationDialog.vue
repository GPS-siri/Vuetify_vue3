<template>
	<v-dialog v-model="dialog.open" persistent content-class="qr-modal-type" max-width="400">
		<div v-if="step === 0">
			<v-layout class="qr-header" align-center>
				<div class="main-title-type mr-1">
					휴무신청
				</div>
				<div class="qr_name_type mr-auto">
					{{ $store.state.meData.name }} {{ $store.state.meData.team ? $store.state.meData.team.title : '-' }}
					{{ $store.state.meData.rank ? $store.state.meData.rank.title : '-' }}
				</div>
				<v-btn icon @click="dialog.open = false" class="pr-8">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<div class="qr-layout px-6" wrap>
				<v-card class="px-6 py-1 mb-6" style="line-height: 1.5;">
					<v-radio-group
						class="radio_group_style"
						style="font-size:0.75rem;"
						v-model="detail_data.radio_select"
						row
						column
						:disabled="current_type === 'update' && dialog.date.result !== 'waiting'"
					>
						<v-layout>
							<v-flex xs3 style="text-align: left; font-weight:500;font-size: 0.75rem;">유형 선택</v-flex>
							<v-flex class="radioStyle">
								<div>
									<v-radio label="휴무" value="vacation"></v-radio>
								</div>
							</v-flex>
							<v-flex class="radioStyle">
								<div>
									<v-radio class="vacationDialog" label="오전반차" value="morningVacation"></v-radio>
								</div>
							</v-flex>
							<v-flex class="radioStyle">
								<div>
									<v-radio label="오후반차" value="afternoonVacation"></v-radio>
								</div>
							</v-flex>
						</v-layout>
					</v-radio-group>

					<v-layout style="width:100%;">
						<v-flex xs3 style="text-align: left; font-weight:500; font-size: 0.75rem;">날짜 선택</v-flex>
						<v-flex class="radioStyle">
							<div>
								<DatepickerDialog
									:picker="startPicker"
									:allowed_dates="allowed_datesStart"
									:disable="current_type === 'update' && dialog.date.result !== 'waiting'"
									class="super_dense"
								></DatepickerDialog>
							</div>
						</v-flex>
					</v-layout>
					<v-layout style="width:100%;" mt-2>
						<v-flex xs3 style="text-align: left; font-weight:500; font-size: 0.75rem;">휴무 사유</v-flex>
						<v-flex class="radioStyle">
							<div>
								<txtField class="pt-0 bizInput" v-model="txtfield.value" :txtField="txtfield" style="height:27px; margin:auto"></txtField>
							</div>
						</v-flex>
					</v-layout>
					<v-layout class="dash_style my-2"> </v-layout>

					<v-layout v-if="current_type === 'create'" mb-1 mt-1>
						<v-flex xs3 style="text-align: left; font-weight:500; font-size: 0.75rem;">휴무 내용</v-flex>
						<div style=" font-size: 12px;">
							{{ startPicker.date | moment('YYYY-MM-DD') }}
							{{ detail_data.radio_select ? `[${vacation_filter(detail_data.radio_select)}]` : '' }}
						</div>
					</v-layout>
					<v-layout v-if="current_type === 'update'" mb-1 mt-1 wrap>
						<v-flex xs3 style="text-align: left; font-weight:500; font-size: 0.75rem;">처리 상태</v-flex>
						<v-flex xs9 style=" font-size: 12px; text-align: left;">
							{{ vacation_result_filter(dialog.date.result) }}
						</v-flex>
						<v-flex xs3 style="text-align: left; font-weight:500; font-size: 0.75rem;"></v-flex>
						<v-flex xs9 mt-1>
							<v-textarea
								height="50"
								style="font-size:12px;"
								v-model="detail_data.textAreaStatus"
								:disabled="detail_data.textAreaStatus ? true : false"
								placeholder="반려시 반려 사유가 들어갑니다."
								hide-details
								filled
								no-resize
							></v-textarea>
						</v-flex>
					</v-layout>
				</v-card>
			</div>
			<v-layout style="width:100%" v-if="current_type === 'create'">
				<v-btn style="font-weight:bold; border-radius:0px;" width="50%" max-width="200px" height="40" @click="dialog.open = false">
					취소
				</v-btn>
				<v-btn
					style="font-weight:bold; border-radius:0px;"
					color="primary2"
					dark
					depressed
					width="50%"
					max-width="200px"
					height="40"
					@click="dataCheck()"
				>
					승인요청
				</v-btn>
			</v-layout>
			<v-layout style="width:100%" v-else-if="current_type === 'update' && dialog.date.result !== 'waiting'">
				<v-btn style="font-weight:bold; border-radius:0px;" width="100%" max-width="400px" height="40" @click="dialog.open = false">
					확인
				</v-btn>
			</v-layout>
			<v-layout style="width:100%" v-else>
				<v-btn style=" border-radius:0px;" color="#BFBFBF" depressed width="50%" max-width="200px" height="40" @click="step = 1">
					휴무신청 취소
				</v-btn>
				<v-btn
					style="font-weight:bold; border-radius:0px;"
					color="primary2"
					dark
					width="50%"
					max-width="200px"
					height="40"
					@click="dataCheck()"
				>
					저장
				</v-btn>
			</v-layout>

			<sweet-alert :dialog="sweetDialog_info" />
			<comfirmDialog :dialog="comfirmDialog_info" />
		</div>
		<div v-else-if="step === 1">
			<v-layout class="qr-header" align-center>
				<div class="main-title-type mr-auto">
					휴무신청 취소
				</div>
				<v-btn icon @click="dialog.open = false" class="pr-8">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<div class="qr-layout px-6" wrap>
				<div class="mt-3" style="font-size:20px; text-align:center; font-weight:bold">
					아래 휴무 일정을 취소 하시겠습니까?
				</div>
				<v-img width="60" style="margin: 30px auto 10px;" src="@/assets/images/ico/ico_question.png"></v-img>
				<div class="mx-3 mb-1" style="font-size:9px; text-align:start;">
					※ 휴무 정보
				</div>
				<v-layout wrap class="py-2 px-3 mb-5" style="border:1px solid #333333">
					<v-flex xs12>
						<v-layout wrap>
							<v-flex xs3 class="vacation_text">
								휴무 신청일
							</v-flex>
							<v-flex xs9 class="vacation_text">
								{{ dayCheck3(dialog.date.created_at) }}
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12>
						<v-layout wrap>
							<v-flex xs3 class="vacation_text">
								휴무일
							</v-flex>
							<v-flex xs9 class="vacation_text">
								{{ dayCheck2(dialog.date.date) }}
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs12>
						<v-layout wrap>
							<v-flex xs3 class="vacation_text">
								휴무유형
							</v-flex>
							<v-flex xs9 class="vacation_text">
								{{ vacation_filter(dialog.date.status) }}
							</v-flex>
						</v-layout>
					</v-flex>
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
					@click="click_vacation_cancle()"
				>
					확인
				</v-btn>
			</v-layout>

			<sweet-alert :dialog="sweetDialog_info" />
			<comfirmDialog :dialog="comfirmDialog_info" />
		</div>
	</v-dialog>
</template>
<script>
import { txtField } from '@/components/index.js'
import { DatepickerDialog, sweetAlert, comfirmDialog } from '@/components'

export default {
	components: { txtField, DatepickerDialog, sweetAlert, comfirmDialog },

	watch: {
		dialog: {
			deep: true,
			handler() {
				if (this.dialog.open) {
					console.log(this.dialog.date)
					if (this.dialog.date) {
						this.current_type = 'update'
						this.startPicker.date = this.dialog.date.date
						this.detail_data = {
							radio_select: this.dialog.date.status,
							textAreaStatus: this.dialog.date.comment,
						}
						this.txtfield.value = this.dialog.date.reason
						if (this.dialog.date.result !== 'waiting') {
							this.txtfield.disable = true
						} else {
							this.txtfield.disable = false
						}
					} else {
						this.current_type = 'create'
						this.startPicker.date = ''
						this.detail_data = {
							radio_select: '',
							textAreaStatus: '',
						}
						this.txtfield.value = ''
						this.txtfield.disable = false
					}
				}
			},
		},
	},
	methods: {
		allowed_datesStart(val) {
			return (
				this.$moment()
					.add('d', 3)
					.format('YYYY-MM-DD') <= val
			)
		},
		test(val) {
			val.comment = ''
			if (val.dialogType === 'etc') {
				val.textAreaStatus = false
			} else {
				val.textAreaStatus = true
			}
		},
		dataCheck() {
			if (!this.startPicker.date) {
				this.sweetDialog_info.open = true
				this.sweetDialog_info.title = '날짜 선택에러'
				this.sweetDialog_info.content = '날짜를 선택해주세요.'
				return
			} else if (!this.detail_data.radio_select) {
				this.sweetDialog_info.open = true
				this.sweetDialog_info.title = '휴무 유형에러'
				this.sweetDialog_info.content = '휴무 유형을 선택해주세요.'
				return
			} else if (!this.txtfield.value) {
				this.sweetDialog_info.open = true
				this.sweetDialog_info.title = '휴무 사유에러'
				this.sweetDialog_info.content = '휴무 사유를 입력해주세요.'
				return
			} else {
				this.actionSave()
			}
		},
		async actionSave() {
			const data = {
				vacationDate: this.$moment(this.startPicker.date).format('YYYY-MM-DD'),
				type: this.detail_data.radio_select,
				status: 'waiting',
				users_permissions_user: this.$store.state.meData.id,
				reason: this.txtfield.value,
			}
			if (this.current_type === 'create') {
				await this.createVacationAction(data)
			} else {
				await this.updateVacationAction(data)
			}
		},
		async createVacationAction(data) {
			this.$store.state.loading = true
			await this.$store
				.dispatch('createVacation', data)
				.then(() => {
					this.$store.state.loading = false
					this.dialog.open = false
					this.comfirmDialog_info.content = '휴무신청이 완료 되었습니다.'
					this.comfirmDialog_info.open = true
					this.$emit('update')
				})
				.catch(err => {
					console.log({ err })
				})
		},
		async updateVacationAction(data) {
			data.id = this.dialog.date.id
			this.$store.state.loading = true
			await this.$store
				.dispatch('updateVacation', data)
				.then(() => {
					this.dialog.open = false
					this.$store.state.loading = false
					this.comfirmDialog_info.content = '휴무일정 수정이 완료 되었습니다.'
					this.comfirmDialog_info.open = true
					this.$emit('update')
				})
				.catch(err => {
					console.log({ err })
				})
		},
		async click_vacation_cancle() {
			let data = {
				id: this.dialog.date.id,
				users_permissions_user: null,
			}
			this.$store.state.loading = true
			await this.$store
				.dispatch('updateVacation', data)
				.then(() => {
					this.dialog.open = false
					this.$store.state.loading = false
					this.comfirmDialog_info.content = '휴무일정 취소가 완료 되었습니다.'
					this.comfirmDialog_info.open = true
					this.$emit('update')
				})
				.catch(err => {
					console.log({ err })
				})
		},

		vacation_filter(val) {
			if (val === 'vacation') {
				return '휴무'
			} else if (val === 'morningVacation') {
				return '오전반차'
			} else if (val === 'afternoonVacation') {
				return '오후반차'
			}
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
			return this.$moment(val).format('gg.MM.DD') + ' ' + this.dayOfTheWeek(this.$moment(val).format('e'))
		},
		dayCheck2(val) {
			return this.$moment(val).format('gggg년 MM월 DD일') + ' ' + this.dayOfTheWeek(this.$moment(val).format('e'))
		},
		dayCheck3(val) {
			return this.$moment(val).format('gggg년 MM월 DD일') + ' ' + this.$moment(val).format('hh:mm')
		},
	},
	data() {
		return {
			step: 0,
			current_type: 'create',
			holydayType: 'morningVacation',
			detail_data: {
				radio_select: '',
				textAreaStatus: '',
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
			startPicker: {
				class: 'super_dense',
				date: '',
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
		checkData: {
			type: Array,
			default: () => {
				return []
			},
		},
	},
	created() {},
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
