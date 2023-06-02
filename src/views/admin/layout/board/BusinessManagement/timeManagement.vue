<template>
	<div>
		<!-- 메인 타이틀 -->
		<v-layout align-center class="padding_24px whith_header">
			<div class="main_title">
				상담예약시간 관리
			</div>
			<div class="router_title ml-3">
				사업지관리 > 상담예약시간 관리
			</div>

			<v-btn class="ml-auto" color="primary" style="width:120px; height:35px;" @click="save_check()">
				저장
			</v-btn>
		</v-layout>

		<!-- 컨텐츠 전체 컨테이너 -->
		<v-layout class="padding_24px overflow_max_height" style="display:block">
			<!--  파트별 컨테이너 - 사업지 기본 정보  -->
			<v-layout wrap class="part_container">
				<!-- 파트명 -->
				<v-flex xs12 class="container_header">
					상담예약시간 설정
				</v-flex>
				<!-- 내용 컨테이너 -->
				<v-flex xs12 class="container_content">
					<v-layout wrap class="content_layout">
						<!-- 시작일  -->
						<v-flex xs6 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
							<v-flex xs4 class="content_title">
								시작일
							</v-flex>

							<!-- 내용  -->
							<v-flex xs8 class="content_wrap">
								<!-- textfield -->
								<div style="width:200px">
									<DatepickerDialog :picker="startDate" :disable="true" :allowed_dates="allowed_dates_start"></DatepickerDialog>
								</div>
							</v-flex>
						</v-flex>

						<!-- 종료일  -->
						<v-flex xs6 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
							<v-flex xs4 class="content_title">
								종료일
							</v-flex>

							<!-- 내용  -->
							<v-flex xs8 class="content_wrap">
								<!-- textfield -->
								<div style="width:200px">
									<DatepickerDialog :picker="endDate" :disable="true" :allowed_dates="allowed_dates_end"></DatepickerDialog>
								</div>
							</v-flex>
						</v-flex>

						<!-- 상담운영시간  -->
						<v-flex xs12 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
							<v-flex xs2 class="content_title">
								상담운영시간
							</v-flex>

							<!-- 내용  -->

							<v-flex xs10 class="content_wrap">
								<v-layout wrap class="display_inlineFlex">
									<v-select
										class="search_select"
										v-model="startTime.value"
										hideDetails
										:items="startTime.items"
										outlined
										style="width:200px"
									></v-select>

									<span class="mx-3" style="align-self: center;">~</span>

									<v-select
										class="search_select"
										v-model="endTime.value"
										hideDetails
										:items="endTime.items"
										outlined
										style="width:200px"
									></v-select>
								</v-layout>
							</v-flex>
						</v-flex>

						<!-- 상담시간단위(분)  -->
						<v-flex xs12 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
							<v-flex xs2 class="content_title">
								상담시간단위(분)
							</v-flex>

							<!-- 내용  -->
							<v-flex xs10 class="content_wrap">
								<!-- textfield -->
								<v-layout wrap class="display_inlineFlex">
									<v-select
										class="search_select"
										v-model="time_unit.value"
										hideDetails
										:items="time_unit.items"
										outlined
										style="width:200px"
									></v-select>

									<span class="content_info">
										※ 상담시간단위 최대 120분까지 가능
									</span>
								</v-layout>
							</v-flex>
						</v-flex>

						<!-- 상담시간범위  -->
						<v-flex xs12 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
							<v-flex xs2 class="content_title">
								상담시간범위
							</v-flex>

							<!-- 내용  -->
							<v-flex xs10 class="content_wrap">
								<!-- textfield -->
								<v-layout wrap class="display_inlineFlex">
									<v-select
										class="search_select"
										v-model="time_range.value"
										hideDetails
										:items="time_range.items"
										outlined
										style="width:200px"
									></v-select>
									<span class="content_info">
										※ 최대 120분까지 가능하며 1타임이 60분으로 설정되어 있을때, 최대 선택가능 타임은 2타임
									</span>
								</v-layout>
							</v-flex>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-layout>

		<saveDialog :dialog="save_dialog" :activeSave="activeSave" />
	</div>
</template>
<script>
import { saveDialog, DatepickerDialog } from '@/components'
export default {
	components: {
		saveDialog,
		DatepickerDialog,
	},
	data() {
		return {
			startDate: {
				// 시작일
				date: this.$moment().format('YYYY-MM-DD'),
			},
			endDate: {
				// 종료일
				date: this.$moment().format('YYYY-MM-DD'),
			},

			startTime: {
				// 시작시간
				value: '09:00',
				items: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'],
				input: '',
			},

			endTime: {
				// 종료시간
				value: '17:00',
				items: ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],
				input: '',
			},

			// 시간 리스트
			time_list: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'],

			time_unit: {
				//상담시간단위
				value: 60,
				items: [30, 60, 120],
				input: '',
			},

			time_range: {
				//상담시간 범위
				value: '1타임',
				items: ['1타임', '2타임', '3타임', '4타임', '5타임', '6타임'],
				input: '',
			},

			system_exist_Yn: false, // 상담예약시간 관리 데이터 존재 유무 판단
			system_data: {}, // 상담예약시간 관리 데이터 존재 유무 판단

			save_dialog: {
				open: false,
				content: '저장하시겠습니까?',
				btnTxt: '저장',
				activeBtn: true,
			},
		}
	},
	watch: {
		startTime: {
			deep: true,
			handler() {
				let time_lists = []
				this.time_list.forEach(el => {
					if (Number(el.split(':')[0]) > Number(this.startTime.value.split(':')[0])) {
						time_lists.push(el)
					}
				})

				this.endTime.items = time_lists
				if (Number(this.startTime.value.split(':')[0]) >= Number(this.endTime.value.split(':')[0])) {
					this.endTime.value = time_lists[0]
				}
			},
		},

		time_unit: {
			deep: true,
			handler() {
				let max_range = 120 / this.time_unit.value

				let range_item = []
				for (let index = 0; index < max_range; index++) {
					range_item.push(index + 1 + '타임')
				}
				this.time_range.items = range_item
				if (this.time_range.items.indexOf(this.time_range.value) === -1) {
					this.time_range.value = '1타임'
				}
			},
		},
	},
	mounted() {
		this.$store.state.loading = true

		// meData에 사업지 정보 있나 확인
		let interval = setInterval(() => {
			if (this.$store.state.meData.business) {
				this.systems(this.$store.state.meData.business.id)
				clearInterval(interval)
			}
		}, 1000)

		// 5초동안 없을 시 오류 alert
		setTimeout(() => {
			if (!this.$store.state.meData.business) {
				clearInterval(interval)
				this.$store.state.loading = false
				alert('다시 로그인 후 확인해 주세요')
			}
			this.$store.state.loading = false
		}, 5000)
	},
	methods: {
		systems(businessId) {
			const data = {
				business: businessId,
				type: 'reservationTime',
			}
			this.$store
				.dispatch('systems', data)
				.then(res => {
					if (res.systems.length > 0) {
						let data = res.systems[0]

						this.system_data = data

						this.startDate.date = data.reservationTimeStartDate
						this.endDate.date = data.reservationTimeEndDate
						this.startTime.value = data.reservationTimeStartTime
						this.endTime.value = data.reservationTimeEndTime
						this.time_range.value = data.reservationTimeMaxSelect + '타임'
						this.time_unit.value = Number(data.reservationTimeSplitTime)

						this.system_exist_Yn = true
					}
					this.$store.state.loading = false
				})
				.catch(err => {
					console.log(err)
					this.$store.state.loading = false
				})
		},
		allowed_dates_start(val) {
			let today = this.$moment(new Date()).format('YYYY-MM-DD')
			if (today !== '') {
				val = today <= val
				return val
			} else {
				return val
			}
		},

		allowed_dates_end(val) {
			if (this.startDate.date !== '') {
				val = this.startDate.date < val
				return val
			} else {
				return val
			}
		},
		save_check() {
			this.save_dialog.open = true
			this.save_dialog.content = '저장하시겠습니까?'
			this.save_dialog.btnTxt = '저장'
		},
		activeSave() {
			if (this.save_dialog.btnTxt === '저장') {
				this.save_dialog.open = false

				if (this.system_exist_Yn) {
					this.updateSystem()
				} else {
					this.createSystem()
				}
			} else {
				this.save_dialog.open = false
			}
		},
		createSystem() {
			this.$store.state.loading = true

			const data = {
				type: 'reservationTime',
				business: this.$store.state.meData.business.id,
				reservationTimeStartTime: this.startTime.value,
				reservationTimeEndTime: this.endTime.value,
				reservationTimeSplitTime: String(this.time_unit.value),
				reservationTimeMaxSelect: this.time_range.value.replace('타임', ''),
			}
			this.$store
				.dispatch('createSystem', data)
				.then(() => {
					this.save_dialog.open = true
					this.save_dialog.content = '성공적으로 저장했습니다.'
					this.save_dialog.btnTxt = '확인'
					this.$store.state.loading = false
				})
				.catch(err => {
					alert('오류가 발생했습니다.')
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		updateSystem() {
			this.$store.state.loading = true

			const data = {
				id: this.system_data.id,
				type: 'reservationTime',
				reservationTimeStartTime: this.startTime.value,
				reservationTimeEndTime: this.endTime.value,
				reservationTimeSplitTime: String(this.time_unit.value),
				reservationTimeMaxSelect: this.time_range.value.replace('타임', ''),
			}
			this.$store
				.dispatch('updateSystem', data)
				.then(() => {
					this.save_dialog.open = true
					this.save_dialog.content = '성공적으로 저장했습니다.'
					this.save_dialog.btnTxt = '확인'
					this.$store.state.loading = false
				})
				.catch(err => {
					alert('오류가 발생했습니다.')

					console.log({ err })
					this.$store.state.loading = false
				})
		},
	},
}
</script>
<style lang="scss">
.notice_title {
	white-space: nowrap;
	width: 180px;
	text-overflow: clip;
}
.product-table {
	border-radius: 16px;
	border: 1px solid #cecece;
}
.business-text {
	font-size: 14px;
}
</style>
