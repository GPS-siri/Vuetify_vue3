<template>
	<div class="pa-4">
		<v-layout align-center class="my-6">
			<div class="ml-auto">
				<v-select
					@change="selectBizTitle"
					hideDetails
					dense
					:items="businessList.map(x => x.title)"
					v-model="businessData"
					label="사업지 선택"
					outlined
				></v-select>
			</div>
		</v-layout>
		<v-layout class="mt-4">
			<v-flex lg7 xs12>
				<v-layout wrap>
					<v-flex lg12 xs12>
						<span class="title_font">
							| 예약설정
						</span>
					</v-flex>
				</v-layout>

				<v-layout wrap class="pa-4 title_font">
					<v-flex xs12>
						<v-layout wrap align-center>
							<div class="mr-7">
								{{ pickers[0].title }}
							</div>
							<v-flex xs3>
								<DatepickerDialog
									:picker="pickers[0].picker"
									:disable="pickers[0].picker.disable"
									:allowed_dates="allowed_dates_start"
									@change="changeStartDate"
								/>
							</v-flex>
							<div class="ml-6 mr-4">
								{{ pickers[1].title }}
							</div>
							<v-flex xs3>
								<DatepickerDialog
									@change="selTimeChange"
									:picker="pickers[1].picker"
									:disable="pickers[1].picker.disable"
									:allowed_dates="allowed_dates_end"
								/>
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex lg12 xs12>
						<v-layout align-center class="title_font mt-4">
							<div class="mr-4">
								시간범위*
							</div>
							<v-flex lg3 xs12>
								<select-box @change="selStartClick" :sel="selStart" v-model="selStart.value"></select-box>
							</v-flex>
							<div class="mx-2">~</div>
							<v-flex lg3 xs12>
								<select-box @change="selEndClick" :sel="selEnd" v-model="selEnd.value"></select-box>
							</v-flex>
							<div class="ml-6 mr-4">
								시간단위(분)
							</div>
							<v-flex lg3 xs12>
								<select-box @change="selTimeChange" :sel="selTimeTerm" v-model="selTimeTerm.value"></select-box>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
		<v-layout>
			<v-btn color="primary" class="ml-auto" @click="saveReserve">
				적용하기
			</v-btn>
		</v-layout>
	</div>
</template>

<script>
import { selectBox, DatepickerDialog } from '@/components'
import changeTime from '../../../../utils/timeRange2.js'
export default {
	components: {
		selectBox,
		DatepickerDialog,
	},
	methods: {
		saveReserve() {
			const index = this.businessList.map(x => x.title).indexOf(this.businessData)
			const data = {
				id: this.businessList[index].reserveday.id,
				splitMinute: this.selTimeTerm.value,
				timeRange: this.selStart.value + '/' + this.selEnd.value,
				sdate: this.pickers[0].picker.date + 'T00:00:00.000Z',
				edate: this.pickers[1].picker.date + 'T00:00:00.000Z',
			}
			this.$store.dispatch('updateReserveday', data).then(() => {
				alert(`${this.businessList[index].title} 사업지 - 예약관리가 적용되었습니다.`)
				this.businesses()
			})
		},
		selectBizTitle() {
			const index = this.businessList.map(x => x.title).indexOf(this.businessData)
			this.businessList[index].reserveday
			this.pickers[0].picker.date = this.$moment(this.businessList[index].reserveday.sdate).format('YYYY-MM-DD')
			this.pickers[1].picker.date = this.$moment(this.businessList[index].reserveday.edate).format('YYYY-MM-DD')
			this.selStart.value = this.businessList[index].reserveday.timeRange.split('/')[0]
			this.selEnd.value = this.businessList[index].reserveday.timeRange.split('/')[1]
			this.selTimeTerm.value = this.businessList[index].reserveday.splitMinute
			this.selTimeChange(this.selTimeTerm.value)
		},
		selStartClick() {
			if (this.selTimeTerm.value === '30') {
				let idx = this.tiems.indexOf(this.selStart.value)
				this.selEnd.items = this.tiems.slice(idx)
			} else {
				let idx = changeTime.indexOf(this.selStart.value)
				this.selEnd.items = changeTime.slice(idx)
			}
		},
		selEndClick() {
			if (this.selTimeTerm.value === '30') {
				let idx = this.tiems.indexOf(this.selEnd.value)
				this.selStart.items = this.tiems.slice(0, idx)
			} else {
				let idx = changeTime.indexOf(this.selEnd.value)
				this.selStart.items = changeTime.slice(0, idx)
			}
		},
		changeStartDate(index) {
			if (this.pickers[0].picker.date === '') {
				this.pickers[1].picker.disable = true
			} else {
				this.pickers[1].picker.disable = false
			}
			if (index === 2) {
				this.timePicker1 = true
			} else if (index === 3) {
				this.timePicker2 = true
			}
			this.selTimeChange()
		},
		selTimeChange(val) {
			if (val === '30') {
				this.selStart.value = '09:00'
				this.selEnd.value = '20:00'
				this.selStart.items = this.tiems
				this.selEnd.items = this.tiems
			} else {
				this.selStart.value = '09:00'
				this.selEnd.value = '20:00'
				this.selStart.items = changeTime
				this.selEnd.items = changeTime
			}
		},
		allowed_dates_start(val) {
			if (this.pickers[1].picker.date !== '') {
				val = this.pickers[1].picker.date > val
				return val
			} else {
				return val
			}
		},
		allowed_dates_end(val) {
			if (this.pickers[0].picker.date !== '') {
				val = this.pickers[0].picker.date < val
				return val
			} else {
				return val
			}
		},
		businesses() {
			this.$store.dispatch('businesses').then(res => {
				this.businessList = res.businesses
				if (res.businesses.length > 0) {
					this.businessData = res.businesses.map(x => x.title)[0]
					this.selectBizTitle()
				}
			})
		},
	},
	data() {
		return {
			tiems: [
				'08:00',
				'08:30',
				'09:00',
				'09:30',
				'10:00',
				'10:30',
				'11:00',
				'11:30',
				'12:00',
				'12:30',
				'13:00',
				'13:30',
				'14:00',
				'14:30',
				'15:00',
				'15:30',
				'16:00',
				'16:30',
				'17:00',
				'17:30',
				'18:00',
				'18:30',
				'19:00',
				'19:30',
				'20:00',
				'20:30',
				'21:00',
				'21:30',
				'22:00',
				'22:30',
				'23:00',
				'23:30',
			],
			businessData: '',
			businessList: [],
			pickers: [
				{
					title: '시작일*',
					picker: {
						menu: false,
						menu2: true,
						date: '',
						date2: '',
						errorMessage: '',
						hideDetail: true,
						disable: false,
					},
					required: true,
				},
				{
					title: '종료일*',
					picker: {
						menu: false,
						menu2: false,
						date: '',
						date2: '',
						errorMessage: '',
						hideDetail: true,
						disable: false,
					},
					required: true,
				},
			],
			selStart: { value: changeTime[1], errorMessage: '', hideDetail: true, items: changeTime, inputItems: [], outlined: true },
			selEnd: {
				value: changeTime[changeTime.length - 7],
				errorMessage: '',
				hideDetail: true,
				items: changeTime,
				inputItems: [],
				outlined: true,
			},
			selTimeTerm: {
				value: '60',
				errorMessage: '',
				hideDetail: true,
				items: ['30', '60'],
				inputItems: [],
				outlined: true,
			},
		}
	},
	created() {
		this.businesses()
	},
}
</script>

<style lang="scss">
.title_font {
	font-size: 0.75rem;
	font-weight: bold;
}
.radioTime {
	.v-label {
		font-size: 0.75rem !important;
	}
}
</style>
