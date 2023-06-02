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
							출/퇴근관리
						</div>
					</div>
					<v-btn color="#633efd" class="ml-auto white--text counselor_qr_type" @click="openQr()">
						출·퇴근 QR
						<v-img
							class="ml-2"
							src="@/assets/images/ico/ico_scanner.png"
							style="cursor:pointer; display:inline-block"
							max-width="35"
							width="35"
						></v-img>
					</v-btn>
				</v-layout>
			</div>
			<v-layout justify-center class="basic_content">
				<div class="py-3 px-2 basic_content_wrap">
					<v-layout align-center class="date_filter_holyday mt-1 mx-1">
						<div>
							<DatepickerDialog
								:picker="startPicker"
								:allowed_dates="allowed_datesStart"
								class="super_dense"
								@input="headerCheckAction(startPicker.date, endPicker.date)"
							></DatepickerDialog>
						</div>
						<div class="mx-2">
							~
						</div>
						<div>
							<DatepickerDialog
								:picker="endPicker"
								:allowed_dates="allowed_datesEnd"
								class="super_dense"
								@input="headerCheckAction(startPicker.date, endPicker.date)"
							></DatepickerDialog>
						</div>
						<div class="ml-auto">
							<v-btn style="background-color:#633efd; font-size:0.8rem;" dark rounded depressed @click="click_holy()" height="25"
								>휴무신청</v-btn
							>
						</div>
					</v-layout>
					<v-layout style="font-size:0.75rem; justify-content: left; color:#633efd;" mb-2>
						※ 휴무일 3일전에 신청해주세요
					</v-layout>
					<v-layout wrap>
						<v-layout py-1 align-center style="background-color:#633efd; border-radius:5px; color:white; height:auto; font-size: 0.75rem;">
							<v-flex style="text-align: center;" xs3>일자</v-flex>
							<v-flex style="text-align: center;" xs2>출근</v-flex>
							<v-flex style="text-align: center;" xs2>퇴근</v-flex>
							<v-flex style="text-align: center;" xs3>근무시간</v-flex>
							<v-flex style="text-align: center;" xs2>휴무여부</v-flex>
						</v-layout>
					</v-layout>
					<div v-for="(date, index) in workDate" :key="index">
						<v-layout style="font-size: 0.75rem;" align-center>
							<v-flex
								py-1
								my-1
								mr-1
								style="text-align: center; background-color:white; border-radius:5px; color:black;"
								:style="$moment().format('YYYY-MM-DD') === date.date ? 'color:#633efd; font-weight:bold;' : ''"
								xs3
								>{{ dayCheck(date.date) }}</v-flex
							>
							<v-flex py-1 my-1 style="text-align: center; background-color:white; border-radius:5px; color:black;" xs9>
								<v-layout align-center>
									<v-flex style="text-align: center;" xs3>{{ date.startWork ? $moment(date.startWork).format('HH:mm') : '-' }}</v-flex>
									<v-flex style="text-align: center;" xs3>{{ date.endWork ? $moment(date.endWork).format('HH:mm') : '-' }}</v-flex>
									<v-flex style="text-align: center;" xs3>{{
										date.startWork && date.endWork ? timeCheck(date.startWork, date.endWork) : '-'
									}}</v-flex>
									<v-flex v-if="date.result && date.date < $moment().format('gggg-MM-DD')" style="text-align: center;" xs3>
										<v-btn style="background-color:#B1B1B1; font-size:0.8rem;" dark rounded depressed height="30" width="80">{{
											vacation_filter(date.status)
										}}</v-btn>
									</v-flex>
									<v-flex v-else-if="date.result && date.result === 'waiting'" style="text-align: center;" xs3>
										<v-btn
											style="background-color:#FD913E; font-size:0.8rem;"
											dark
											rounded
											depressed
											height="30"
											width="80"
											@click="click_status_detail(date)"
										>
											승인대기
										</v-btn>
									</v-flex>
									<v-flex v-else-if="date.result && date.result === 'disagree'" style="text-align: center;" xs3>
										<v-btn
											style="background-color:#FD3E3E; font-size:0.8rem;"
											dark
											rounded
											depressed
											height="30"
											width="80"
											@click="click_status_detail(date)"
										>
											승인거절
										</v-btn>
									</v-flex>
									<v-flex v-else-if="date.result && (date.result === 'agree' || date.result === 'admin')" style="text-align: center;" xs3>
										<v-btn
											style="background-color:#633EFD; font-size:0.8rem;"
											dark
											rounded
											depressed
											height="30"
											width="80"
											@click="click_status_detail(date)"
										>
											승인완료
										</v-btn>
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
						<!--  -->
					</div>
				</div>
			</v-layout>
		</div>
		<QRcode :dialogQr="dialogQr" />
		<applicationDialogVue :dialog="applicationDialog" :checkData="dialogData" @update="update"></applicationDialogVue>
		<disagreeDialogVue :dialog="disagreeDialog" :checkData="disagreeArrData"></disagreeDialogVue>
	</div>
</template>
<script>
import QRcode from '../../QR/QRcode.vue'
import { DatepickerDialog } from '@/components'
import applicationDialogVue from './applicationDialog.vue'
import disagreeDialogVue from './disagreeDialog.vue'
export default {
	data() {
		return {
			dialogQr: { open: false, code: '!', business: { title: '' }, meData: { created_at: this.$moment(), name: '' } },

			disagreeArrData: [],
			dialogData: [],
			applicationDialog: {
				open: false,
				type: 'application',
			},
			disagreeDialog: {
				open: false,
				type: 'application',
			},
			startPicker: {
				class: 'super_dense',
				date: this.$moment()
					.subtract(15, 'd')
					.format('YYYY-MM-DD'),
			},
			endPicker: {
				class: 'super_dense',
				date: this.$moment()
					.add(15, 'd')
					.format('YYYY-MM-DD'),
			},
			workDate: [],
			reservationStatus: false,
			vacation_input: 0,
		}
	},
	watch: {},
	methods: {
		vacation_filter(val) {
			if (val === 'vacation') {
				return '휴무'
			} else if (val === 'morningVacation') {
				return '오전반차'
			} else if (val === 'afternoonVacation') {
				return '오후반차'
			}
		},
		openQr() {
			this.dialogQr.open = true
			this.dialogQr.code = this.$store.state.meData.id
			this.dialogQr.meData = this.$store.state.meData
		},
		click_holy() {
			this.applicationDialog.meData = this.$store.state.meData.id
			this.applicationDialog.date = ''
			this.applicationDialog.open = true
		},
		click_status_detail(date) {
			this.applicationDialog.meData = this.$store.state.meData.id
			this.applicationDialog.date = date
			this.applicationDialog.open = true
		},
		to_bizDashboard() {
			// 뒤로가기 버튼
			this.$router.push({
				name: 'counselorBizDashboard',
				params: { id: this.$store.state.meData.business.id },
			})
		},
		systemsView(variable) {
			this.$store
				.dispatch('systems', variable)
				.then(res => {
					this.vacation_input = res.systems[0].vacationReservation
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
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
		timeCheck(start, end) {
			const moment = require('moment')
			let timeData = ''
			let hour = parseInt(moment.duration(this.$moment(end).diff(this.$moment(start))).asMinutes() / 60)
			let minute = parseInt(moment.duration(this.$moment(end).diff(this.$moment(start))).asMinutes() % 60)
			if (minute === 0) {
				timeData = hour + '시간'
			} else {
				timeData = hour + '시간' + minute + '분'
			}
			return timeData
		},
		headerCheckAction(startDate, endDate) {
			const moment = require('moment')
			let count = moment.duration(this.$moment(endDate).diff(this.$moment(startDate))).asDays() + 1
			let result = []
			for (let index = 0; index < count; index++) {
				let day = this.$moment(startDate)
					.add(index, 'd')
					.format('YYYY-MM-DD')
				result.push({
					date: day,
					startWork: '',
					endWork: '',
					workTime: '',
					status: '',
					checkBoxValue: false,
					comment: '',
					textAreaStatus: true,
				})
			}
			this.workDate = result
			const data = {
				business: this.$store.state.meData.business.id,
				date_gte: this.startPicker.date,
				date_lte: this.endPicker.date,
				id: this.$store.state.meData.id,
			}
			this.usersView(data)
		},
		allowed_datesEnd(val) {
			if (this.startPicker.date === '') {
				return val
			} else {
				val = this.$moment(this.startPicker.date).format('YYYY-MM-DD') <= val
			}
			return val
		},
		allowed_datesStart(val) {
			if (this.startPicker.date === '') {
				return val
			} else {
				val = this.$moment(this.endPicker.date).format('YYYY-MM-DD') >= val
			}
			return val
		},
		async usersView(data) {
			await this.$store
				.dispatch('users', data)
				.then(res => {
					// 출퇴근 기록
					let result_gotowork = res.users[0].gotoworks
					for (let i = 0; i < result_gotowork.length; i++) {
						let idx = this.workDate.findIndex(x => x.date === result_gotowork[i].date)
						let arr = this.workDate.filter(x => x.date === result_gotowork[i].date)
						if (arr.length > 0) {
							arr[0].startWork = result_gotowork[i].startWork
							arr[0].endWork = result_gotowork[i].endWork
						}
						this.workDate[idx] = arr[0]
					}

					let disagreeArr = []
					let result_vacations = res.users[0].vacations
					for (let i = 0; i < result_vacations.length; i++) {
						let idx = this.workDate.findIndex(
							x => x.date === result_vacations[i].vacationDate && x.status === 'waiting' && x.status === 'disagree',
						)
						let arr = this.workDate.filter(x => x.date === result_vacations[i].vacationDate)
						if (arr.length > 0) {
							// arr[0].startWork = result_vacations[i].startWork
							// arr[0].endWork = result_vacations[i].endWork
							arr[0].status = result_vacations[i].type
							arr[0].result = result_vacations[i].status
							arr[0].reason = result_vacations[i].reason
							arr[0].comment = result_vacations[i].comment
							arr[0].created_at = result_vacations[i].created_at
							arr[0].id = result_vacations[i].id
						}

						if (!result_vacations[i].viewStatus) {
							result_vacations[i].dialogType = result_vacations[i].type
							result_vacations[i].date = result_vacations[i].vacationDate
							disagreeArr.push(result_vacations[i])

							this.disagreeDialog.open = true
						}
						if (i === res.users[0].vacations.length - 1) {
							this.disagreeArrData = disagreeArr
						}
						this.workDate[idx] = arr[0]
					}

					console.log(this.workDate)
				})
				.catch(err => {
					console.log({ err })
				})
		},
		update() {
			const meDataCheck = setInterval(() => {
				let ok = 0
				ok += 1
				if (this.$store.state.meData.business) {
					this.headerCheckAction(this.startPicker.date, this.endPicker.date)
					const data1 = { business: this.$store.state.meData.business.id }
					this.systemsView(data1)
					clearInterval(meDataCheck)
				} else if (ok === 5) {
					clearInterval(meDataCheck)
				}
			}, 1000)
		},
	},
	created() {
		const meDataCheck = setInterval(() => {
			let ok = 0
			ok += 1
			if (this.$store.state.meData.business) {
				this.headerCheckAction(this.startPicker.date, this.endPicker.date)
				const data1 = { business: this.$store.state.meData.business.id }
				this.systemsView(data1)
				clearInterval(meDataCheck)
			} else if (ok === 5) {
				clearInterval(meDataCheck)
			}
		}, 1000)
	},
	components: {
		disagreeDialogVue,
		applicationDialogVue,
		DatepickerDialog,
		QRcode,
		// counselorFooter,
	},
}
</script>
<style lang="scss">
.contentCheckBox > div > div > div > div > i.theme--light.v-icon {
	color: #633efd;
}
.reserve-datepicker {
	.v-date-picker-table--date .v-btn {
		border-radius: 0px !important;
	}
	.theme--light.v-btn.v-btn--disabled {
		color: white !important;
		background-color: #b2b2b2 !important;
	}
}

.contentCheckBox > div {
	margin-top: 0px;
	padding-top: 0px;
}
.layout.date_filter_holyday.mt-1.mx-1.align-center > div.ml-1 > button {
	height: 30px;
}
</style>
