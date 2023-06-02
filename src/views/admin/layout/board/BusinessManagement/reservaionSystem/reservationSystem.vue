<template>
	<div style="width:100%;">
		<!-- 검색 영역 -->
		<v-layout align-center class="header_search">
			<v-flex class="search_select ml-4" style="max-width:260px !important" lg3 md3 sm3 xs12>
				<selectBox :sel="searchsel" class="searchSel" style="font-size:12px" @change="change_business"></selectBox>
			</v-flex>
			<v-layout justify-end>
				<v-flex class="mr-3" style="max-width:200px;">
					<txtField v-model="search.value" :txtField="search" class="search_box_admin" @enter="searchActive"></txtField>
				</v-flex>
				<v-btn class="search_btn" color="#5d19ff" elevation="0" @click="searchActive"><v-icon>mdi-magnify</v-icon>조회</v-btn>
			</v-layout>
		</v-layout>

		<v-layout class="mt-4">
			<!-- 데이터 테이블 -->
			<v-flex xs5 class="pr-5">
				<datatable :search="search_project" :datatable="table" class="table_header" @click="detailClick"></datatable>
			</v-flex>

			<!-- 정보 입력 영역 -->
			<v-flex xs7 class="pl-5">
				<v-layout wrap class="mt-5 sub_font" style="border-left: 0px solid #d1d1d1; border-right: 0px solid #d1d1d1;">
					<!-- 정보 입력 ( 왼쪽 ) -->
					<v-flex xs6>
						<v-flex
							xs12
							v-for="(left, index) in left_items"
							:key="index"
							class="pa-0 table_all_gray"
							:class="left.type === 'datatable' ? 'mt-6' : 'border_side'"
							wrap
							style="min-height:55px; border-bottom: 1px solid #d1d1d1;"
						>
							<v-layout style="height:100%; min-height:55px;">
								<v-flex xs3 align-self-start style="text-align:center; width:179px" class="pt-4">
									<v-flex>
										{{ left.title }}
									</v-flex>
								</v-flex>

								<!-- 리스트 아이템 start  -->
								<!-- txtfield  -->
								<v-flex xs9 v-if="left.type === 'txtfield'" class="item_content_border px-2 table_right_white">
									<v-flex xs12 align-self-center>
										<txtFieldStyle
											class="pt-4 bizInput"
											v-model="left.txtfield.value"
											:txtField="left.txtfield"
											style="height:27px; margin:auto"
										></txtFieldStyle>
									</v-flex>
								</v-flex>

								<!-- selectBox -->
								<v-flex xs9 v-if="left.type === 'selectBox'" class="item_content_border px-2 table_right_white">
									<v-flex xs12 align-self-center>
										<selectBoxStyle class="pt-4" :sel="left.selectBox" @change="change_selectBox(left, index)"></selectBoxStyle>
									</v-flex>
								</v-flex>

								<!-- 기간 설정 -->
								<v-flex xs9 v-if="left.type === 'date_range'" class="item_content_border px-2 table_right_white">
									<div class="display_flex pt-3">
										<DatepickerDialog :picker="left.start_date" :disabledata="disabledata"></DatepickerDialog>
										<span class="mx-4 align_items_center"> ~ </span>
										<DatepickerDialog
											:picker="left.end_date"
											:disabledata="disabledata"
											:allowed_dates="val => allowe_date(val, left)"
										></DatepickerDialog>
									</div>
								</v-flex>

								<!-- 시간설정 -->
								<v-flex xs9 v-if="left.type === 'time_range'" class="item_content_border px-2 table_right_white">
									<v-flex xs12 align-self-center wrap class="display_flex pt-3">
										<!-- <div class="display_flex pt-3"> -->
										<v-flex xs7 align-self-center class="display_flex">
											<selectBoxStyle :sel="left.selectBox_start" @change="timeChange(left, 'start')"></selectBoxStyle>
											<span class="mx-2 mt-1"> ~ </span>
											<selectBoxStyle :sel="left.selectBox_end" @change="timeChange(left, 'end')"></selectBoxStyle>
										</v-flex>
										<v-flex xs5 align-self-center class="display_flex">
											<span class="ml-5 mr-3 mt-1 flex_shrink0">단위</span>
											<selectBoxStyle :sel="left.selectBox_unit" @change="selTimeChange"></selectBoxStyle>
										</v-flex>
									</v-flex>
								</v-flex>

								<!-- 공통제외시간 -->
								<v-flex xs9 v-if="left.type === 'radio_select'" class="item_content_border px-2 table_right_white">
									<div class="display_flex pt-3">
										<v-radio-group
											v-model="left.radios.radioSelected"
											hide-details
											row
											class="small_radio_admin mt-0 pt-1"
											style="width:100%;"
										>
											<!-- <div v-for="(radio, i) in left.radios.items" :key="i"> -->
											<v-radio
												v-for="(radio, i) in left.radios.items"
												:key="i"
												class="mb-0"
												:label="radio.label"
												:value="radio.value"
												color="admin_blue"
												:ripple="false"
												@change="radio_change(left, radio)"
											></v-radio>
											<!-- </div> -->
											<!-- </v-layout> -->
										</v-radio-group>

										<selectBoxStyle class="pl-6" :sel="left.selectBox" @change="change()"></selectBoxStyle>
									</div>
								</v-flex>

								<!-- 리스트 아이템 end -->
							</v-layout>
						</v-flex>
					</v-flex>

					<!-- 일별 상세설정 ( 오른쪽 ) -->
					<v-flex xs6>
						<v-flex
							xs12
							class="pa-0 table_all_gray"
							:class="'border_side'"
							wrap
							style="height:100%; border-bottom: 1px solid #d1d1d1; border-left: none;"
						>
							<v-layout style="height:100%;">
								<v-flex xs3 align-self-start style="text-align:center; width:179px" class="pt-4">
									<v-flex>
										{{ right_item.title }}
									</v-flex>
								</v-flex>

								<!-- 리스트 아이템 start  -->
								<v-flex xs9 class="item_content_border px-2 table_right_white">
									<v-date-picker
										class="reservation_select"
										width="100%"
										no-title
										locale="ko"
										v-model="right_item.date"
										:allowed-dates="allowedDates_right"
										@input="selDatePicker"
									></v-date-picker>
									<!-- color="primary2" -->
									<!-- :day-format="dayFormat" -->
									<!-- @change="availableTimes" -->

									<v-flex xs12>
										<v-layout wrap v-if="right_item.date" class="px-8 delete_time_layout">
											<!-- 선택날짜 -->
											<v-flex xs3>선택일</v-flex>
											<v-flex xs8 class="delete_date">{{ right_item.date | date_dateName }}</v-flex>

											<!-- 제외할 시간 선택 -->
											<v-flex xs3 class="mt-4">시간선택</v-flex>
											<v-flex xs8 class="mt-3">
												<selectBoxStyle :sel="selTime" @change="selTimeRange()"></selectBoxStyle>
											</v-flex>

											<!-- 제외할 시간 내  제외 가능 시간 리스트 -->
											<v-flex offset-xs4> </v-flex>
										</v-layout>
									</v-flex>
								</v-flex>

								<!-- 리스트 아이템 end -->
							</v-layout>
						</v-flex>
					</v-flex>
				</v-layout>

				<div class="d-flex justify-end align-item-center pt-6">
					<v-btn
						v-if="$store.state.meData.role ? $store.state.meData.role.name === 'Authenticated' : false"
						color="#0500b7"
						dark
						height="26"
						width="113"
						@click="click_save()"
						>생성 및 저장</v-btn
					>
				</div>
			</v-flex>
		</v-layout>
		<!--저장 불 -->
		<sweet-alert :dialog="sweetDialog_info" />
		<!-- 저장 확인 -->
		<sweet-alert :dialog="sweetDialog_confirm" @click="save_active" />
		<!-- 저장 완료 -->
		<sweet-alert :dialog="sweetDialog_done" />
	</div>
</template>

<script>
// import newProject from '../../../../kiosk/viewItem/newProject.vue'
import { DatepickerDialog, selectBox, txtField, txtFieldStyle, selectBoxStyle, datatable, sweetAlert } from '@/components/index.js'
let moment_ko = require('moment')
moment_ko.locale('ko')

export default {
	components: {
		DatepickerDialog,
		selectBox,
		txtField,
		txtFieldStyle,
		selectBoxStyle,
		// newProject,
		datatable,
		sweetAlert,
	},
	data() {
		return {
			//프로젝트 생성

			table: {
				headers: [
					{ text: '지점명', value: 'system_business_title' },
					{ text: '예약명', value: 'reservationTitle' },
					{ text: '진행기간', value: 'reservation_range' },
				],
				class: 'datatablehover3',
				items: [],
				noweditting: '',
				itemPerPage: 15,
				page: 1,
				pageCount: 0,
			},

			datedisable: true,

			searchsel: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				placeholder: '지점선택',
				items: [],
				outlined: true,
			},
			search: {
				value: '',
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
			search_project: '',

			left_items: [
				// 0
				{
					type: 'selectBox',
					value: '',
					title: '지점',
					selectBox: {
						value: '',
						class: 'inputSel',
						placeholder: '지점 선택',
						items: [],
					},
				},

				// 1
				{
					type: 'txtfield',
					value: '',
					title: '예약명',
					txtfield: {
						value: '',
						placeholder: '',
					},
				},
				// 2
				{
					type: 'selectBox',
					title: '이벤트 연결',
					selectBox: {
						value: '',
						class: 'inputSel',
						placeholder: '이벤트 선택',
						items: [],
					},
				},
				// 3
				{
					type: 'date_range',
					title: '진행기간',
					start_date: {
						date: this.$moment().format('YYYY-MM-DD'),
						errorMessage: '',
						class: 'whiteBack input_date defalut-date-picker-setting',
						menu: false,
					},
					end_date: {
						date: this.$moment()
							.add('7', 'days')
							.format('YYYY-MM-DD'),
						errorMessage: '',
						class: 'whiteBack input_date defalut-date-picker-setting',
						menu: false,
					},
				},
				// 4
				{
					type: 'time_range',
					title: '시간설정',
					selectBox_start: {
						value: '09:00',
						class: 'inputSel',
						placeholder: '',
						items: [],
					},
					selectBox_end: {
						value: '18:00',
						class: 'inputSel',
						placeholder: '',
						items: [],
					},
					selectBox_unit: {
						value: '60',
						class: 'inputSel',
						placeholder: '',
						items: [
							{ value: '15', text: '15분' },
							{ value: '30', text: '30분' },
							{ value: '60', text: '60분' },
						],
					},
				},
				// 5
				{
					type: 'radio_select',
					title: '공통제외시간',
					radios: {
						radioSelected: '',
						items: [
							{
								label: '시간제외',
								value: '1',
							},
							{
								label: '단위시간제외',
								value: '2',
							},
						],
					},
					selectBox: {
						value: '',
						class: 'inputSel',
						placeholder: '',
						items: [],
					},
				},
				// 6
				{
					type: 'selectBox',
					title: '예약확인 알림톡',
					selectBox: {
						value: '',
						class: 'inputSel',
						placeholder: '예약확인 알림톡 선택',
						items: [],
					},
				},
				// 7
				{
					type: 'selectBox',
					title: '예약변경 알림톡',
					selectBox: {
						value: '',
						class: 'inputSel',
						placeholder: '예약변경 알림톡 선택',
						items: [],
					},
				},
				// 8
				{
					type: 'selectBox',
					title: '예약취소 알림톡',
					selectBox: {
						value: '',
						class: 'inputSel',
						placeholder: '예약취소 알림톡 선택',
						items: [],
					},
				},
				// 9
				{
					type: 'selectBox',
					title: '1일전 리마인드',
					selectBox: {
						value: '',
						class: 'inputSel',
						placeholder: '1일전 리마인드 알림톡 선택',
						items: [],
					},
				},
				// 10
				{
					type: 'selectBox',
					title: '당일 리마인드',
					selectBox: {
						value: '',
						class: 'inputSel',
						placeholder: '당일 리마인드 알림톡 선택',
						items: [],
					},
				},
			],
			right_item: {
				title: '일별 상세설정',
				date: '',
				totalExceptionTime: [],
				exceptionTime: [],
				selectBox: {
					value: '',
					class: 'inputSel',
					placeholder: '',
					items: [],
				},
			},
			sweetDialog_info: {
				// 저장 불가 팝업
				open: false,
				title: '저장 불가',
				content: ``,
				buttonType: 'oneBtn',
				cancelBtnText: '확인',
				modalIcon: 'info',
			},

			save_id: '',
			sweetDialog_confirm: {
				// 저장 확인 팝업
				open: false,
				title: '예약관리',
				content: ``,
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				cancelBtnText: '취소',
				modalIcon: 'success',
			},

			sweetDialog_done: {
				// 저장 완료 팝업
				open: false,
				title: '',
				content: ``,
				buttonType: 'oneBtn',
				cancelBtnText: '확인',
				modalIcon: 'success',
			},

			selTime: {
				// 제외시간 선택
				value: '',
				class: 'inputSel',
				items: [],
			},
		}
	},
	filters: {
		date_dateName(val) {
			let moment_ko = require('moment')
			moment_ko.locale('ko')

			return moment_ko(val).format('YY-MM-DD (dd)')
		},
	},
	mounted() {},
	async created() {
		this.test()
		await this.businesses_title()
		await this.event_title()
		await this.messages_title()
		await this.systems_reservation()
		this.time_items_setting()
	},

	methods: {
		async test() {
			let name = []

			for (let index = 0; index < 9000; index++) {
				name.push({ phone: '0104937441' + index })
			}
			let variable = {
				name: name.map(el => el.phone),
			}
			console.log(name)
			await this.$store.dispatch('reservations', variable).then(res => {
				console.log(res)
			})
		},

		async businesses_title() {
			this.$store.state.loading = true
			const variable = {
				show: true,
			}
			await this.$store.dispatch('businesses_title', variable).then(res => {
				let data = res.businesses.map(el => {
					return {
						value: el.id,
						text: el.title,
					}
				})
				this.searchsel.items = data
				this.left_items[0].selectBox.items = data
			})
		},
		async event_title() {
			this.$store.state.loading = true
			const variable = {}
			await this.$store.dispatch('event_title', variable).then(res => {
				let data = res.events.map(el => {
					return {
						value: el.id,
						text: el.title,
					}
				})
				this.left_items[2].selectBox.value = ''
				this.left_items[2].selectBox.items = data

				this.$store.state.loading = false
			})
		},
		async messages_title() {
			const variable = {
				// show: true,
			}
			await this.$store.dispatch('messages_title', variable).then(res => {
				let data = res.messages.map(el => {
					return {
						value: el.id,
						text: el.tplCodeStr,
					}
				})

				this.left_items[6].selectBox.items = data
				this.left_items[7].selectBox.items = data
				this.left_items[8].selectBox.items = data
				this.left_items[9].selectBox.items = data
				this.left_items[10].selectBox.items = data
			})
		},
		async systems_reservation(callType) {
			const data = {
				type: 'reservationTime',
			}
			if (this.searchsel.value) {
				data['business'] = this.searchsel.value
			}
			if (callType === 'search') {
				data['reservationTitle'] = this.search.value
			}
			this.$store.state.loading = true
			await this.$store
				.dispatch('systems_reservation', data)
				.then(res => {
					let data = res.systems
					console.log(data)
					data.forEach(el => {
						el['system_business_title'] = el.business.title
						el['reservation_range'] = `${el.reservationTimeStartDate} ~ ${el.reservationTimeEndDate}`
					})

					this.table.items = data

					this.$store.state.loading = false
				})
				.catch(err => {
					console.log(err)
					this.$store.state.loading = false
				})
		},

		async system(id) {
			//  system 단일 호출
			const data = {
				id: id,
			}

			this.$store.state.loading = true

			await this.$store
				.dispatch('system', data)
				.then(res => {
					let data = res.system

					this.left_items[0].selectBox.value = data.business.id
					this.left_items[1].txtfield.value = data.reservationTitle
					this.left_items[2].selectBox.value = data.reservationEventId
					this.left_items[3].start_date.date = data.reservationTimeStartDate
					this.left_items[3].end_date.date = data.reservationTimeEndDate
					this.left_items[4].selectBox_start.value = data.reservationTimeStartTime
					this.left_items[4].selectBox_end.value = data.reservationTimeEndTime
					this.left_items[4].selectBox_unit.value = data.reservationTimeSplitTime
					this.left_items[5].radios.radioSelected = ''
					this.left_items[5].selectBox.value = ''

					this.left_items[6].selectBox.value = data.reservationTalks.confirmTalk
					this.left_items[7].selectBox.value = data.reservationTalks.changeTalk
					this.left_items[8].selectBox.value = data.reservationTalks.cancelTalk
					this.left_items[9].selectBox.value = data.reservationTalks.oneDayTalk
					this.left_items[10].selectBox.value = data.reservationTalks.reamindTalk

					this.save_id = id
					this.$store.state.loading = false
				})
				.catch(err => {
					console.log(err)
					this.$store.state.loading = false
				})
		},

		detailClick(item) {
			// 데이터테이블 행 클릭
			this.system(item.id)
		},

		allowe_date(val, left) {
			let start = this.$moment(left.start_date.date).format('YYMMDD')

			let startDate = new Date(left.start_date.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
		allowedDates_right(val) {
			let start = this.$moment(this.left_items[3].start_date.date).format('YYMMDD')
			let end = this.$moment(this.left_items[3].end_date.date).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') <= end && this.$moment(val).format('YYMMDD') >= start
			return val
		},
		selectDays(date) {
			if (date === '오늘') {
				this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (date === '이번 주') {
				this.termStartpicker.date = this.$moment()
					.subtract(7, 'd')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			} else if (date === '이번 달') {
				this.termStartpicker.date = this.$moment()
					.startOf('month')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment()
					.endOf('month')
					.format('YYYY-MM-DD')
			}
		},
		disabledata() {
			this.datedisable = false
		},
		change_business() {
			// 지점 셀렉트 박스 변경
			this.search.value = ''
			this.systems_reservation()
			this.clear_detail()
		},
		searchActive() {
			// 조회 클릭
			this.systems_reservation('search')
			this.clear_detail()
		},
		clear_detail() {
			// 상세정보 초기화
			this.left_items.forEach((el, index) => {
				if (el.type === 'selectBox') {
					el.selectBox.value = ''

					if (index === 2) {
						el.selectBox.items = []
					}
				} else if (el.type === 'txtfield') {
					el.txtfield.value = ''
				} else if (el.type === 'date_range') {
					el.start_date.date = this.$moment().format('YYYY-MM-DD')
					el.end_date.date = this.$moment().format('YYYY-MM-DD')
				} else if (el.type === 'time_range') {
					el.selectBox_start.value = ''
					el.selectBox_end.value = ''
					el.selectBox_unit.value = '60'
				} else if (el.type === 'radio_select') {
					el.radios.radioSelected = ''
				}
			})
		},

		time_items_setting() {
			// 시간 셀렉트박스 아이템 세팅
			let hour = []

			for (let index = 0; index < 24; index++) {
				if (index < 22 && index > 8) {
					hour.push(String(index).padStart(2, 0) + ':00')
				}
			}
			console.log(hour)

			this.left_items[4].selectBox_start.items = JSON.parse(JSON.stringify(hour))
			this.left_items[4].selectBox_end.items = JSON.parse(JSON.stringify(hour))
		},

		timeChange(left, type) {
			// 시간설정의 시간 변경
			if (type === 'start') {
				if (left.selectBox_end.value) {
					console.log(Number(left.selectBox_end.value.substr(0, 2)))
					if (Number(left.selectBox_end.value.substr(0, 2)) < Number(left.selectBox_start.value.substr(0, 2))) {
						left.selectBox_end.value = ''
					}
				}
			} else if (type === 'end') {
				if (left.selectBox_start.value) {
					if (Number(left.selectBox_end.value.substr(0, 2)) < Number(left.selectBox_start.value.substr(0, 2))) {
						left.selectBox_start.value = ''
					}
				}
			}
			this.selTimeChange()
		},
		click_save() {
			// 저장 클릭

			console.log('save click')
			let type = ''
			if (!this.save_id) {
				type = '생성'
			} else {
				type = '저장'
			}

			let ok = 0
			// if (!this.left_items[0].selectBox.value) {
			// 	this.sweetDialog_info.content = '지점을 선택해주세요.'
			// 	ok++
			// } else if (!this.left_items[1].txtfield.value) {
			// 	this.sweetDialog_info.content = '예약명을 입력해주세요.'
			// 	ok++
			// } else if (!this.left_items[3].start_date.date) {
			// 	this.sweetDialog_info.content = '진행기간을 선택해주세요.'
			// 	ok++
			// } else if (!this.left_items[3].end_date.date) {
			// 	this.sweetDialog_info.content = '진행기간을 선택해주세요.'
			// 	ok++
			// } else if (!this.left_items[4].selectBox_start.value) {
			// 	this.sweetDialog_info.content = '시간설정을 선택해주세요.'
			// 	ok++
			// } else if (!this.left_items[4].selectBox_end.value) {
			// 	this.sweetDialog_info.content = '시간설정을 선택해주세요.'
			// 	ok++
			// } else if (!this.left_items[6].selectBox.value) {
			// 	this.sweetDialog_info.content = '예약확인 알림톡을 선택해주세요.'
			// 	ok++
			// } else if (!this.left_items[7].selectBox.value) {
			// 	this.sweetDialog_info.content = '예약변경 알림톡을 선택해주세요.'
			// 	ok++
			// } else if (!this.left_items[8].selectBox.value) {
			// 	this.sweetDialog_info.content = '예약취소 알림톡을 선택해주세요.'
			// 	ok++
			// } else if (!this.left_items[9].selectBox.value) {
			// 	this.sweetDialog_info.content = '1일전 리마인드 알림톡을 선택해주세요.'
			// 	ok++
			// } else if (!this.left_items[10].selectBox.value) {
			// 	this.sweetDialog_info.content = '당일 리마인드 알림톡을 선택해주세요.'
			// 	ok++
			// }

			if (ok > 0) {
				return (this.sweetDialog_info.open = true)
			}
			this.sweetDialog_confirm.content = `예약정보를 ${type}합니다.`
			this.sweetDialog_confirm.open = true
		},
		save_active() {
			// 저장 실행
			this.sweetDialog_confirm.open = false
			console.log('저장 실행')

			if (!this.save_id) {
				//  system 단일 호출
				const system_variable = {
					business: this.left_items[0].selectBox.value,
					type: 'reservationTime',
				}

				this.$store.state.loading = true

				this.$store.dispatch('systems', system_variable).then(res => {
					if (res.systems.length > 0) {
						this.sweetDialog_info.open = true
						this.sweetDialog_info.content = '해당 지점에 이미 예약설정이 존재합니다.'

						this.$store.state.loading = false
					} else {
						this.createSystem()
					}
				})
			} else {
				this.updateSystem()
			}
		},
		createSystem() {
			// 생성
			this.$store.state.loading = true

			let reservationNodaySetting = []
			let reservationTalks = {
				confirmTalk: this.left_items[6].selectBox.value,
				changeTalk: this.left_items[7].selectBox.value,
				cancelTalk: this.left_items[8].selectBox.value,
				oneDayTalk: this.left_items[9].selectBox.value,
				reamindTalk: this.left_items[10].selectBox.value,
			}

			let data = {
				business: this.left_items[0].selectBox.value,
				type: 'reservationTime',
				reservationTimeStartTime: this.left_items[4].selectBox_start.value,
				reservationTimeEndTime: this.left_items[4].selectBox_end.value,
				reservationTimeSplitTime: this.left_items[4].selectBox_unit.value,
				reservationTimeStartDate: this.left_items[3].start_date.date,
				reservationTimeEndDate: this.left_items[3].end_date.date,
				reservationTitle: this.left_items[1].txtfield.value,
				reservationEventId: this.left_items[2].selectBox.value,
				reservationTalks: reservationTalks,
				reservationNodaySetting: reservationNodaySetting,
			}
			this.$store
				.dispatch('createSystem', data)
				.then(() => {
					let type = ''
					if (!this.save_id) {
						type = '생성'
					} else {
						type = '저장'
					}

					this.sweetDialog_done.title = `${type} 완료`
					this.sweetDialog_done.content = `예약정보를 ${type}완료 하였습니다.`
					this.sweetDialog_done.open = true

					this.save_id = ''
					this.searchsel.value = ''
					this.systems_reservation()
				})
				.catch(err => {
					alert('오류가 발생했습니다.')
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		updateSystem() {
			// 수정
			this.$store.state.loading = true

			let reservationNodaySetting = []
			let reservationTalks = {
				confirmTalk: this.left_items[6].selectBox.value,
				changeTalk: this.left_items[7].selectBox.value,
				cancelTalk: this.left_items[8].selectBox.value,
				oneDayTalk: this.left_items[9].selectBox.value,
				reamindTalk: this.left_items[10].selectBox.value,
			}

			let data = {
				id: this.save_id,
				business: this.left_items[0].selectBox.value,
				type: 'reservationTime',
				reservationTimeStartTime: this.left_items[4].selectBox_start.value,
				reservationTimeEndTime: this.left_items[4].selectBox_end.value,
				reservationTimeSplitTime: this.left_items[4].selectBox_unit.value,
				reservationTimeStartDate: this.left_items[3].start_date.date,
				reservationTimeEndDate: this.left_items[3].end_date.date,
				reservationTitle: this.left_items[1].txtfield.value,
				reservationEventId: this.left_items[2].selectBox.value,
				reservationTalks: reservationTalks,
				reservationNodaySetting: reservationNodaySetting,
			}
			this.$store
				.dispatch('updateSystem', data)
				.then(() => {
					let type = ''
					if (!this.save_id) {
						type = '생성'
					} else {
						type = '저장'
					}

					this.sweetDialog_done.title = `${type} 완료`
					this.sweetDialog_done.content = `예약정보를 ${type}완료 하였습니다.`
					this.sweetDialog_done.open = true

					this.save_id = ''
					this.searchsel.value = ''
					this.systems_reservation()
				})
				.catch(err => {
					alert('오류가 발생했습니다.')
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		change() {},
		change_selectBox(left, index) {
			console.log(left, index)
		},
		radio_change() {},
		timeSet() {
			this.left_items[5].selectBox.value = ''
			this.left_items[5].selectBox.items = []
		},
		selTimeChange() {
			this.timeSet()
			let startRange
			let endRange

			this.right_item.totalExceptionTime = []
			this.right_item.exceptionTime = []

			this.right_item.selectBox.value = ''
			this.right_item.selectBox.items = []

			this.right_item.date = ''
			startRange = this.left_items[4].selectBox_start.value
			endRange = this.left_items[4].selectBox_end.value
			let dateRange = this.$moment(this.left_items[3].end_date.date).diff(this.left_items[3].start_date.date, 'days')
			for (let index = 0; index < dateRange + 1; index++) {
				let date = this.$moment(this.left_items[3].start_date.date)
					.add(index, 'd')
					.format('YYYY-MM-DD')
				this.right_item.totalExceptionTime.push({
					date: date,
					times: [],
				})
			}
			for (let index = 0; startRange < endRange; index++) {
				this.right_item.selectBox.items.push(startRange)

				startRange = this.$moment
					.utc(startRange, 'HH:mm')
					.add(60, 'minutes')
					.format('HH:mm')
			}
			if (this.left_items[4].selectBox_unit.value !== '') {
				this.right_item.totalExceptionTime.forEach(element => {
					startRange = this.left_items[4].selectBox_start.value
					endRange = this.left_items[4].selectBox_end.value

					for (let index = 0; startRange < endRange; index++) {
						console.log(index)
						element.times.push({
							clock: startRange,
							radio: false,
						})
						startRange = this.$moment
							.utc(startRange, 'HH:mm')
							.add(this.left_items[4].selectBox_unit.value, 'minutes')
							.format('HH:mm')
					}
				})
			}
			console.log(this.right_item)
		},
		selDatePicker() {
			if (this.right_item.exceptionTime !== []) {
				let index = this.right_item.totalExceptionTime.findIndex(x => x.date === this.right_item.exceptionTime.date)
				this.right_item.totalExceptionTime[index] = this.right_item.exceptionTime
			}
			this.selTime.value = ''
			let idx = this.right_item.totalExceptionTime.findIndex(x => x.date === this.picker)
			this.right_item.exceptionTime = this.right_item.totalExceptionTime[idx]
			let startRange = this.left_items[4].selectBox_start.value
			let endRange = this.left_items[4].selectBox_end.value
			this.selTime.items = []
			for (let index = 0; startRange < endRange; index++) {
				this.selTime.items.push(startRange)

				startRange = this.$moment
					.utc(startRange, 'HH:mm')
					.add(60, 'minutes')
					.format('HH:mm')
			}
			this.selTime.items.push('날짜 제외')
			this.selTime.items.push('시간 초기화')
		},
		selTimeRange() {
			if (this.selTime.value === '날짜 제외') {
				this.right_item.exceptionTime.times.forEach(time => {
					time.maxCount = 0
					time.radio = true
				})
			} else if (this.selTime.value === '시간 초기화') {
				this.right_item.exceptionTime.times.forEach(time => {
					time.maxCount = this.selTermMax.value
					time.radio = false
				})
			}
		},
	},
}
</script>
<style lang="scss">
.left_dashboard {
	background-color: white;
	border-radius: 1vh;
}
.search_date_1 {
	max-width: 120px !important;
	margin-left: 40px;
}
.search_date_2 {
	max-width: 120px !important;
}
.search_wrap {
	height: 26px;
}
// 기간 별 버튼
.search_select {
	min-height: 26px !important;
	height: 26px !important;
	max-width: 110px !important;
}
//검색 버튼
.search_btn {
	width: 68px !important;
	height: 26px !important;
	margin-right: 10px !important;
	padding: 0 10px !important;
	font-size: 13px;
	font-weight: bold;
	.v-btn__content {
		color: #fff;
	}
}
.new_pj {
	// margin-top: -90px;
	width: 113px !important;
	height: 26px !important;
	background: #323153 !important;
	color: #fff !important;
}
</style>
