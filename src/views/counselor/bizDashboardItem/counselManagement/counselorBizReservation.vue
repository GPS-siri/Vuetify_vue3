<template>
	<div class="counselor_container">
		<div class="sticky_wrap_type">
			<div class="top_sticky_header">
				<v-layout justify-center class="tab_name_bar">
					<div class="header_left_btn">
						<v-btn icon x-large @click="to_bizDashboard()">
							<v-icon>
								mdi-chevron-left
							</v-icon>
						</v-btn>
						<div style="align-self:center">
							상담관리
						</div>
					</div>
					<v-btn color="primary2" class="ml-auto white--text header_btn" depressed @click="add_reservation_open()">신규등록</v-btn>
				</v-layout>
			</div>
			<v-layout justify-center class="basic_content_min_height">
				<div class="pb-4 basic_content_wrap">
					<!-- 상단 필터 -->
					<div>
						<v-text-field
							:autofocus="false"
							class="search-textfiled"
							placeholder="이름/휴대폰번호 검색하세요"
							hideDetails
							maxlength="255"
							append-icon="mdi-magnify"
							flat
							dense
							color="primary2"
							v-model="search"
							@keydown.enter="reservations()"
							@click:append="reservations()"
							autocomplete="off"
						></v-text-field>
						<v-layout align-center class="mx-5 mt-3 pb-4 filter_wrap " wrap>
							<v-flex xs12 class="mb-2">일정현황</v-flex>
							<v-flex xs12 class="display_flex">
								<div style="width:115px">
									<DatepickerDialog
										:picker="startPicker"
										@input="realRangeTimeCount('date_change')"
										class="super_dense"
										:allowed_dates="allowed_datesStart"
									></DatepickerDialog>
								</div>
								<div class="mx-2">
									~
								</div>
								<div style="width:115px" class="mr-1">
									<DatepickerDialog :picker="endPicker" @input="realRangeTimeCount('date_change')" class="super_dense"></DatepickerDialog>
								</div>

								<div style="width:100px" class="ml-auto">
									<v-select
										v-model="day"
										hideDetails
										dense
										:items="days"
										outlined
										@change="dayChange"
										class="super_dense"
										color="primary2"
									></v-select>
								</div>
							</v-flex>
						</v-layout>
					</div>
					<!-- 일정 리스트 -->
					<div class="list_content px-5 pt-4">
						<!-- 월별  -->
						<div class="list_month" v-for="(month, i) in month_item" :key="i + '_month'">
							<div class="month_name">
								{{ month.month }}
							</div>
							<div v-for="(date, index) in month.items" :key="index + '_date'">
								<div class="list_date">
									<!--  일별 -->
									<div class="date_name">
										{{ date.date }}
									</div>
									<!-- 시간별 -->
									<div class="list_time">
										<div
											class="time_name"
											v-for="(time, idx) in date.items"
											:class="date.expand_id === time.id ? 'expand_time' : ''"
											:key="idx + 'time'"
											@click="expand_row(date, time)"
										>
											{{ time.time }}
										</div>
									</div>
								</div>

								<v-expand-transition>
									<div v-show="date.expand" class="expand_date">
										<v-layout wrap class="expand_row_wrap">
											<v-flex xs12 class="exapand_row" v-for="(expand_data, idx_ex) in date.expand_data" :key="idx_ex + '_ex'">
												<v-flex xs3 class="expand_title">{{ expand_data.type }}</v-flex>
												<v-flex xs9 class="expand_content">{{ expand_data.value }}</v-flex>
											</v-flex>
											<v-flex xs12 class="expand_button_wrap">
												<v-btn class="expand_btn mr-auto" depressed fab dark color="#8a56ac" small> <v-icon> mdi-phone</v-icon></v-btn>
												<v-btn class="expand_btn mr-auto" rounded depressed dark color="#633efd" @click="edit_reservation_open(date)"
													>일정변경</v-btn
												>
												<v-btn class="expand_btn mr-auto" rounded depressed dark color="black" @click="delete_reservation_open(date)"
													>일정삭제</v-btn
												>
												<v-btn class="expand_btn" rounded depressed dark color="#fd723e" @click="change_reservation_open(date)"
													>처리완료</v-btn
												>
											</v-flex>
										</v-layout>
									</div>
								</v-expand-transition>
							</div>
						</div>
					</div>
				</div>
			</v-layout>
		</div>
		<editResevationDialog :dialog="edit_reservation" :doneDialog="doneDialog" />
		<deleteResevationDialog :dialog="delete_reservation" :doneDialog="doneDialog" />
		<comfirmDialog :dialog="doneDialog" />
		<comfirmDialog :dialog="status_Dialog" :activeClick="statusChangeDone" />
	</div>
</template>
<script>
import { DatepickerDialog, comfirmDialog } from '@/components'
import editResevationDialog from './editResevationDialog'
import deleteResevationDialog from './deleteResevationDialog'

// import changeTime from '../../../../utils/timeRange2.js'
// import tiems from '../../../../utils/times'
export default {
	components: {
		DatepickerDialog,
		editResevationDialog,
		deleteResevationDialog,
		comfirmDialog,
		// counselorFooter,
	},
	data() {
		return {
			month_item: [],

			search: '',
			startPicker: {
				class: 'super_dense',
				date: '',
			},
			endPicker: {
				class: 'super_dense',
				date: '',
			},
			day: '이번달',
			days: ['이번달', '지난달', '다음달'],

			edit_reservation: {
				// 추가/수정 팝업
				open: false,
				edit: false,
				edit_id: null,
			},

			doneDialog: {
				// 저장 완료 팝업
				open: false,
				title: '',
				content: ``,
			},
			status_Dialog: {
				// 처리 완료 확인 팝업
				open: false,
				title: '',
				content: `해당 일정을 완료 처리 하시겠습니까?`,
				type: 'question',
				data: {
					id: null,
				},
			},
			delete_reservation: {
				// 일정 삭제 팝업
				open: false,
				data: {
					id: null,
					name: '',
					phone: '',
					address: '',
					date_time: '',
				},
			},
		}
	},
	async created() {
		this.date_setting()

		await this.me()
		await this.business()
	},

	methods: {
		async me() {
			await this.$store
				.dispatch('me')
				.then(res => {
					if (res.role.name !== 'counselor') {
						this.$router.push({ name: 'block' })
						sessionStorage.removeItem('here-t')
					}
				})
				.catch(err => {
					console.log({ err })
					this.$router.push({ name: 'block' })
				})
		},

		allowedDates(val) {
			if (this.able_date.start <= val && this.able_date.end >= val && this.$moment().format('YYYY-MM-DD') <= val) return val
		},
		reservations(date_change) {
			const data = {
				users_permissions_user: this.$store.state.meData.id,
				business: this.$store.state.business.id,
			}

			// 전체기간 조회
			if (this.day !== '전체') {
				data['date_gte'] = this.startPicker.date
				data['date_lte'] = this.$moment(this.endPicker.date).format('YYYY-MM-DD')
			}
			// 데이트피커 변경시 조회
			if (date_change) {
				data['date_gte'] = this.startPicker.date
				data['date_lte'] = this.$moment(this.endPicker.date).format('YYYY-MM-DD')
			}
			this.$store.state.loading = true
			this.$store.dispatch('reservations', data).then(res => {
				let items = res.reservations.filter(item => item.name.indexOf(this.search) > -1 || item.phone.indexOf(this.search) > -1)

				let month_diff = this.$moment(this.endPicker.date).diff(this.$moment(this.startPicker.date), 'months') + 1

				let group_month = []
				for (let index = 0; index < month_diff; index++) {
					// 월 별로 그룹 짓기
					let month = this.$moment(this.startPicker.date)
						.add(index, 'months')
						.format('YYYY-MM')
					let month_item = items.filter(el => this.$moment(el.date).format('YYYY-MM') === month)
					if (month_item.length > 0) {
						// 날짜 별로 그룹 짓기
						let dates = [...new Set(month_item.map(item => item.date))].sort((a, b) => {
							return new Date(a) - new Date(b)
						})

						// 날짜별 그룹 데이터
						let group_date = []
						for (let idx = 0; idx < dates.length; idx++) {
							let date_items = month_item.filter(el => el.date === dates[idx])

							let group_time = []
							// 각 일자의 예약 시간으로 아이템 소분화
							for (let idx_item = 0; idx_item < date_items.length; idx_item++) {
								let times = date_items[idx_item].times.split(',')
								let time_item = times.map(el => {
									return {
										time: el,
										...date_items[idx_item],
									}
								})
								group_time = group_time.concat(time_item)
							}

							group_time = group_time.sort((a, b) => {
								return a.time.localeCompare(b.time)
							})
							group_date.push({
								date: this.$moment(dates[idx]).format('MM월 DD일'),

								items: group_time,

								expand: false,
								expand_id: null,
								expand_data: [
									// 0
									{
										type: '제목',
										value: '',
									},
									// 1
									{
										type: '작성일',
										value: '',
									},
									// 2
									{
										type: '예약일',
										value: '',
									},
									// 3
									{
										type: '고객명',
										value: '',
									},
									// 4
									{
										type: '연락처',
										value: '',
									},
									// 5
									{
										type: '메모',
										value: '',
									},
									// 6
									{
										type: '항목',
										value: '',
									},
									// 7
									{
										type: '고객상태',
										value: '',
									},
								],
							})
						}
						// 월별 그룹 데이터
						group_month.push({
							month: this.$moment(month).format('YYYY년 MM월'),
							items: group_date,
						})
					}
				}

				this.month_item = group_month
				items.forEach(el => {
					// 예약 일시
					el['times_text'] = `${this.$moment(el.date).format('YY.MM.DD')} ${el.times ? el.times.split(',').join(' / ') : ''}`
				})

				this.table_items = items
				this.expanded = []
				this.$store.state.loading = false
			})
		},
		excelExport() {
			document.getElementById('cunselmangage_Excel').click()
		},
		allowed_datesEnd(val) {
			if (this.startPicker.date === '') {
				return val
			} else {
				val = this.$moment().format('YYYY-MM-DD') >= val
			}
			return val
		},
		allowed_datesStart(val) {
			if (this.endPicker.date === '') {
				return val
			} else {
				val = this.endPicker.date >= val
			}
			return val
		},

		realRangeTimeCount(date_change) {
			if (this.startPicker.date > this.endPicker.date) {
				this.startPicker.date = this.$moment(this.endPicker.date)
					.subtract(1, 'day')
					.format('YYYY-MM-DD')
			}
			if (this.startPicker.date && this.endPicker.date) {
				this.reservations(date_change)
			}
		},

		dayChange(val) {
			let month = this.$moment()
			if (this.days[0] === val) {
				// 이번달
				this.startPicker.date = this.get_lastDay(month).first_day
				this.endPicker.date = this.get_lastDay(month).last_day
			} else if (this.days[1] === val) {
				// 지난달
				month = this.$moment().subtract(1, 'month')
				this.startPicker.date = this.get_lastDay(month).first_day
				this.endPicker.date = this.get_lastDay(month).last_day
			} else if (this.days[2] === val) {
				// 다음달
				month = this.$moment().add(1, 'month')
				this.startPicker.date = this.get_lastDay(month).first_day
				this.endPicker.date = this.get_lastDay(month).last_day
			}
			this.reservations()
		},
		async business() {
			await this.$store.dispatch('business', { id: this.$route.params.id, type: 'reservationTime' }).then(res => {
				this.$store.state.business = res.business

				// 상담물건 세팅
				// this.create_reservation.product_types = res.business.product.map(el => {
				// 	return {
				// 		name: el.name,
				// 		value: '',
				// 		items: [],
				// 		type: el.value,
				// 	}
				// })

				// 상담 예약 가능 날짜 세팅
				// let time_system = res.business.systems[0]
				// this.able_date = {
				// 	start: time_system.reservationTimeStartDate,
				// 	end: time_system.reservationTimeEndDate,
				// }
				this.reservations()
			})
		},

		to_bizDashboard() {
			// 뒤로가기 버튼
			this.$router.push({
				name: 'counselorBizDashboard',
				params: { id: this.$route.params.id },
			})
		},

		phoneCheck(item) {
			//전화번호 체크
			let value = item
				.replace(/[^0-9.]/g, '')
				.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
				.replace('--', '-')
			this.create_reservation.phone = value
		},

		get_lastDay(date) {
			let year = date.format('YYYY')
			let month = date.format('MM')
			let lastDay = new Date(year, month, 0).getDate()

			let range = {
				first_day: `${year}-${month}-01`,
				last_day: `${year}-${month}-${lastDay}`,
			}

			return range
		},
		date_setting() {
			this.get_lastDay(this.$moment())

			this.startPicker.date = this.get_lastDay(this.$moment()).first_day
			this.endPicker.date = this.get_lastDay(this.$moment()).last_day
		},
		async expand_row(date, time) {
			if (date.expand_id === time.id) {
				date.expand = false
				date.expand_id = null
			} else {
				this.month_item.forEach(el => {
					el.items.forEach(async date_item => {
						if (date_item.date === date.date) {
							date_item.expand_id = time.id
						} else {
							date_item.expand = false
							date_item.expand_id = null
						}
					})
				})
				let data = { id: date.expand_id }
				this.$store.state.loading = true
				await this.$store
					.dispatch('reservation', data)
					.then(res => {
						let reservation = res.reservation

						let moment_ko = require('moment')
						moment_ko.locale('ko')

						let ko_date_created = moment_ko(reservation.created_at).format('dd')
						let ko_date_date = moment_ko(reservation.date).format('dd')

						date.expand_data[0].value = reservation.title
						date.expand_data[1].value = this.$moment(reservation.created_at).format(`YYYY-MM-DD (${ko_date_created}) HH:mm`)
						date.expand_data[2].value = this.$moment(
							`${reservation.date} ${reservation.times ? reservation.times.split(',')[0] : ''}`,
						).format(`YYYY-MM-DD (${ko_date_date}) HH:mm`)
						date.expand_data[3].value = reservation.name
						date.expand_data[4].value = reservation.phone
						date.expand_data[5].value = reservation.memo
						let products = ''

						reservation.products.forEach((prod, index) => {
							let row = `${prod.data1}, ${prod.data2}, ${prod.data3}`
							products += row
							if (index < reservation.products.length - 1) {
								products += '\n'
							}
						})
						date.expand_data[6].value = products

						let status
						if (reservation.status === 'waiting') {
							status = '예약'
						} else if (reservation.status === 'complete') {
							status = '처리 완료'
						} else if (reservation.status === 'incomplete') {
							status = '미완료'
						} else if (reservation.status === 'cancel') {
							status = '예약취소'
						}
						date.expand_data[7].value = status

						date.expand = true

						this.$store.state.loading = false
					})
					.catch(() => {
						this.$store.state.loading = false
					})
			}
		},
		add_reservation_open() {
			this.edit_reservation.edit = false
			this.edit_reservation.edit_id = null
			this.edit_reservation.open = true
		},

		edit_reservation_open(date) {
			this.edit_reservation.edit = true
			this.edit_reservation.edit_id = date.expand_id
			this.edit_reservation.open = true
		},
		delete_reservation_open(date) {
			this.delete_reservation.id = date.expand_id
			this.delete_reservation.open = true
		},
		change_reservation_open(date) {
			this.status_Dialog.id = date.expand_id
			this.status_Dialog.open = true
		},
		statusChangeDone() {
			this.status_Dialog.id = null
			this.status_Dialog.open = false

			this.doneDialog.open = true
			this.doneDialog.content = '일정을 완료 처리 하였습니다.'
		},
	},
}
</script>
<style lang="scss"></style>
