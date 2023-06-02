<template>
	<div style="width:100%; padding:0 37px; display:grid">
		<v-layout class="header_title">
			<v-flex xs5 class="d-flex align-center">
				<div class="slash mr-1"></div>
				<span>통계 관리</span>
			</v-flex>
			<v-flex xs7 class="d-flex align-center justify-end">
				<div style="min-width:261px !important;" class="search_select">
					<selectBox :sel="bizSelect" @change="reserveChange" />
				</div>
			</v-flex>
		</v-layout>
		<reportTable
			class="pb-4"
			v-if="bizSelect.value.reservedays.filter(x => x.type === 'c').length > 0"
			:tableleft="table5"
			:subtable="table5_sub"
			:subtable_object="table5_sub_object"
			:options="options5"
			:series="series5"
			:termEndpicker="termEndpicker5"
			:termStartpicker="termStartpicker5"
			@click="termStartpicker5Click"
		></reportTable>
		<reportTable
			v-if="bizSelect.value.reservedays.filter(x => x.type === 'd').length > 0"
			:tableleft="table1"
			:options="options1"
			:series="series1"
			:chart_open="true"
			:termEndpicker="termEndpicker1"
			:termStartpicker="termStartpicker1"
			type="reserveCustomer"
			@click="termStartpicker1Click"
		></reportTable>
		<reportTable
			v-if="bizSelect.value.reservedays.filter(x => x.type === 'd').length > 0"
			:tableleft="table2"
			:options="options2"
			:series="series2"
			:chart_open="true"
			type="visitCustomer"
			:termEndpicker="termEndpicker2"
			:termStartpicker="termStartpicker2"
			@click="termStartpicker2Click"
		></reportTable>
		<reportTable
			class="pb-4"
			v-if="bizSelect.value.reservedays.filter(x => x.type === 'd').length > 0"
			:tableleft="table3"
			:counselorTimes="counselorTimes"
			:subtable="table3_sub"
			:subtable_object="table3_sub_object"
			:options="options3"
			:series="series3"
			:chart_open="true"
			type="counselor"
			:termEndpicker="termEndpicker3"
			:termStartpicker="termStartpicker3"
			@click="termStartpicker3Click"
		></reportTable>
		<reportTable
			v-if="bizSelect.value.events.length > 0"
			:tableleft="table4"
			:options="options4"
			:series="series4"
			:termEndpicker="termEndpicker4"
			:termStartpicker="termStartpicker4"
			@click="termStartpicker4Click"
		></reportTable>

		<v-layout>
			<reportTable
				:tableleft="table6"
				:options="options6"
				:series="series6"
				class="donutChart3 mb-8"
				:termEndpicker="termEndpicker6"
				:termStartpicker="termStartpicker6"
				@click="termStartpicker6Click"
			></reportTable>
		</v-layout>
	</div>
</template>

<script>
import reportTable from '../viewItem/reportTable'
import { selectBox } from '@/components'

export default {
	components: {
		reportTable,
		selectBox,
	},
	data() {
		return {
			bizSelect: {
				filter: true,
				value: {
					reservedays: [],
					events: [],
				},
				items: [],
				returnObject: true,
				itemText: 'title',
				class: 'searchSel',
				hideDetail: true,
				outlined: true,
			},
			termStartpicker1: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termEndpicker1: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termStartpicker2: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termEndpicker2: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termStartpicker3: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termEndpicker3: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termStartpicker4: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termEndpicker4: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termStartpicker5: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termEndpicker5: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termStartpicker6: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			termEndpicker6: {
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},
			dataForExcel: [],
			dayDatatable: {
				disableSort: true,
				headers: [],
				itemPerPage: -1,
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			daypicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			termDatatable: {
				disableSort: true,
				headers: [],
				itemPerPage: -1,
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			termStartpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			termEndpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			// 알림톡 전송현황

			messageDatatable: {
				disableSort: true,
				headers: [],
				itemPerPage: -1,
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				class: 'max-width-table',
			},
			messageStartpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			messageEndpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			searchTxt: '',
			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },

			json_fields1: {},
			json_fields2: {},
			json_fields3: {},

			datedisable: true,

			login: '',

			hideDisagree: {
				class: '',
				dark: true,
				color: '',
				width: '100',
			},
			groups: [],
			screenWidth: window.innerWidth,
			reservedayItem: [], //reserveday 데이터
			selData: '',
			reserve: {},
			termDataTitle: [],
			topSelect: {
				value: '',
				hideDetail: true,
				outlined: true,
			},
			options1: {
				width: 360,
				dataLabels: {
					enabled: false,
				},
				colors: ['#3B3A5A', '#B5B3E5'],
				labels: ['예약 완료', '잔여예약'],
				fill: {
					colors: ['#3B3A5A', '#B5B3E5'],
				},
				plotOptions: {
					pie: {
						expandOnClick: false,
						donut: {
							size: '60%',
							labels: {
								show: false,
							},
						},
					},
				},
				legend: {
					markers: {
						radius: 0,
					},
				},
			},
			series1: [0, 0],
			options2: {
				width: 360,
				height: 180,
				dataLabels: {
					enabled: false,
				},
				colors: ['#3B3A5A', '#B5B3E5'],
				labels: ['방문고객', '미방문'],
				fill: {
					colors: ['#3B3A5A', '#B5B3E5'],
				},
				plotOptions: {
					pie: {
						expandOnClick: false,
						donut: {
							size: '60%',
							labels: {
								show: false,
							},
						},
					},
				},
				legend: {
					markers: {
						radius: 0,
					},
				},
			},
			series2: [0, 0],
			options3: {
				width: 360,
				height: 180,
				dataLabels: {
					enabled: false,
				},
				colors: ['#3B3A5A', '#B5B3E5'],
				labels: ['상담완료', '미처리'],
				fill: {
					colors: ['#3B3A5A', '#B5B3E5'],
				},
				plotOptions: {
					pie: {
						expandOnClick: false,
						donut: {
							size: '60%',
							labels: {
								show: false,
							},
						},
					},
				},
				legend: {
					markers: {
						radius: 0,
					},
				},
			},
			series3: [0, 0],
			sub_options3: {
				name: '',
				chart: {
					width: 380,
					type: 'pie',
				},
				legend: {
					show: false,
				},
				labels: [],
			},
			sub_series3: {
				name: 'sub_chart',
				data: [],
			},
			options4: {
				width: 360,
				height: 180,
				dataLabels: {
					enabled: false,
				},
				colors: ['#3B3A5A', '#B5B3E5'],
				labels: ['남은수량', '참여수량'],
				fill: {
					colors: ['#3B3A5A', '#B5B3E5'],
				},
				plotOptions: {
					pie: {
						expandOnClick: false,
						donut: {
							size: '60%',
							labels: {
								show: false,
							},
						},
					},
				},
				legend: {
					markers: {
						radius: 0,
					},
				},
			},
			series4: [0, 0],
			options5: {
				width: 360,
				height: 180,
				dataLabels: {
					enabled: false,
				},
				colors: ['#3B3A5A', '#B5B3E5'],
				labels: ['전체 수집 DB', '거점 수집 DB'],
				fill: {
					colors: ['#3B3A5A', '#B5B3E5'],
				},
				plotOptions: {
					pie: {
						expandOnClick: false,
						donut: {
							size: '60%',
							labels: {
								show: false,
							},
						},
					},
				},
				legend: {
					markers: {
						radius: 0,
					},
				},
			},
			sub_options5: {
				name: '',
				chart: {
					width: 380,
					type: 'pie',
				},
				legend: {
					show: false,
				},
				labels: [],
			},
			sub_series5: {
				name: 'sub_chart',
				data: [],
			},
			series5: [0, 0],
			options6: {
				width: 360,
				height: 180,
				dataLabels: {
					enabled: false,
				},
				colors: ['#3B3A5A', '#7674AA', '#B5B3E5'],
				labels: ['알림톡', 'LMS', 'SMS'],
				fill: {
					colors: ['#3B3A5A', '#7674AA', '#B5B3E5'],
				},
				plotOptions: {
					pie: {
						expandOnClick: false,
						donut: {
							size: '60%',
							labels: {
								show: false,
							},
						},
					},
				},
				legend: {
					markers: {
						radius: 0,
					},
				},
			},
			series6: [0, 0, 0],
			table1: {
				class: '',
				title: '예약 고객 현황',
				subContent: false,

				headers: [
					{ text: '구분', value: 'title' },
					{ text: '설정 고객 수', value: 'setCustomer' },
					{ text: '예약 고객 수', value: 'resCustomer' },
					{ text: '예약 가능 수', value: 'availableCustomer' },
				],
				items: [],
				itemPerPage: -1,
				hidedefaultfooter: true,
				tableTitle: ['설정 고객 수', '예약 고객 수', '잔여 예약 수'],
				tableCount: [0, 0, 0],
			},
			table2: {
				class: '',
				title: '방문 고객 현황',
				subContent: false,
				headers: [
					{ text: '구분', value: 'title' },
					{ text: '예약 고객 수', value: 'resCustomer' },
					{ text: '방문 고객 수', value: 'visitCustomer' },
					{ text: '미방문 고객 수', value: 'novisitCustomer' },
					{ text: '현장등록 고객 수', value: 'directCustomer' },
				],
				items: [],
				itemPerPage: -1,
				hidedefaultfooter: true,
				tableTitle: ['예약 고객 수', '방문 고객 수', '미방문 고객', '현장등록'],
				tableCount: [0, 0, 0, 0],
			},
			counselorTimes: {
				class: 'chart-table',
				subContent: true,
				headers: [
					{ text: '구분', value: 'title' },
					{ text: '상담사1', value: 'test1' },
					{ text: '상담사2', value: 'test2' },
					{ text: '상담사3', value: 'test3' },
				],
				items: [],
				itemPerPage: -1,
				hidedefaultfooter: true,
			},
			table3: {
				class: '',
				title: '상담사별 상담 현황',
				subContent: true,
				headers: [
					{ text: '구분', value: 'title' },
					{ text: '상담사1', value: 'test1' },
					{ text: '상담사2', value: 'test2' },
					{ text: '상담사3', value: 'test3' },
				],
				items: [],
				totalVisit: [],
				itemPerPage: -1,
				hidedefaultfooter: true,
				tableTitle: ['상담 예약 수', '상담 완료 수', '상담 미처리'],
				tableCount: [0, 0, 0],
			},
			table3_sub: [
				{
					title: '방문 상담 항목별 현황',
					subContent: true,
					headers: [
						{ text: '문항', value: 'title' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '합계', value: 'total' },
					],
					items: [
						{ string: '연령대', value: 'test1' },
						{ string: '거주지', value: 'test2' },
						{ string: '관심타입', value: 'test3' },
						{ string: '청약통장', value: 'test20' },
						{ string: '청약유형', value: 'test21' },
						{ string: '주택소유여부', value: 'test23' },
						{ string: '분양목적', value: 'test24' },
					],
					itemPerPage: -1,
					hidedefaultfooter: true,
				},
			],
			table3_sub_object: { subtable: [] },
			table4: {
				class: '',
				title: '이벤트 참여 현황',
				subContent: false,
				headers: [
					{ text: '구분', value: 'title' },
					{ text: '설정 상품 수', value: 'test4' },
					{ text: '수령 상품 수', value: 'test5' },
					{ text: '잔여 상품 수', value: 'test6' },
				],
				itemPerPage: -1,
				items: [],
				hidedefaultfooter: true,
				tableTitle: ['설정 상품 수', '수령 상품 수', '잔여 상품 수'],
				tableCount: [0, 0, 0],
			},
			table5: {
				class: '',
				title: '외부 설문 현황',
				subContent: true,
				headers: [
					{ text: '구분', value: 'title' },
					{ text: '거점1', value: 'test7' },
					{ text: '거점2', value: 'test8' },
					{ text: '거점3', value: 'test9' },
					{ text: '거점4', value: 'test10' },
					{ text: '거점5', value: 'test11' },
				],
				items: [],
				hidedefaultfooter: true,
				itemPerPage: -1,
				tableTitle: ['전체 수집 DB', '거점 수집 DB'],
				tableCount: [0, 0],
			},
			table5_sub: [
				{
					title: '거점 설문 항목별 현황',
					headers: [
						{ text: '문항', value: 'title' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '답변항목', value: 'answer' },
						{ text: '합계', value: 'total' },
					],
					itemPerPage: -1,
					items: [],
					hidedefaultfooter: true,
				},
			],
			table5_sub_object: { subtable: [] },
			table6: {
				class: '',
				title: '알림톡 발송 현황',
				subContent: false,
				itemPerPage: -1,
				headers: [
					{ text: '알림톡', value: 'test12' },
					{ text: 'LMS(장문)', value: 'test13' },
					{ text: 'SMS(단문)', value: 'test14' },
				],
				items: [],
				hidedefaultfooter: true,
				tableTitle: ['전체 발송 수', '알림톡 발송', 'LMS(장문) 발송', 'SMS(단문) 발송'],
				tableCount: [0, 0, 0],
			},
		}
	},
	watch: {
		selData() {
			this.setGroupData()
		},
	},
	computed: {
		// companionNum() {
		// 	/// 셀렉트박스 클릭
		// 	if (this.companion.value !== '동반자 없음') {
		// 		return ' 외' + this.companion.value
		// 	} else return ''
		// },
		nowWidth() {
			window.addEventListener('resize', () => {
				this.screenWidth = window.innerWidth
			})
			let boolean
			if (this.screenWidth < 900) {
				boolean = true
			} else {
				boolean = false
			}

			return boolean
		},
	},
	async created() {
		this.setTime()
		this.reservedays()
	},
	methods: {
		termStartpicker1Click() {
			this.reserveusersRangeCountBoard()
		},
		termStartpicker2Click() {
			this.reserveusersCount()
		},
		termStartpicker3Click() {
			this.visitListCount()
		},
		termStartpicker4Click() {
			if (this.termStartpicker4.date === this.termEndpicker4.date) this.EventCount()
			else this.EventCountRange()
		},
		termStartpicker5Click() {
			this.campainListCount()
		},
		termStartpicker6Click() {
			if (this.termStartpicker6.date === this.termEndpicker6.date) this.alertCount()
			else this.alertCountRange()
		},
		async visitListCount() {
			const data = {
				sdate: this.termStartpicker3.date,
				edate: this.termEndpicker3.date,
				business: this.bizSelect.value.id,
			}
			await this.$store.dispatch('visitListCount', data).then(res => {
				this.table3_sub = []
				if (this.termStartpicker3.date === this.termEndpicker3.date) {
					this.counselorTimes.headers = res.data.visitListCount.count.headers_times
					this.counselorTimes.items = res.data.visitListCount.count.items_times
					this.table3.class = ''
					this.table3.headers = res.data.visitListCount.count.header_chart
					if (res.data.visitListCount.count.item_chart.length === 2) this.table3.items = []
					else this.table3.items = res.data.visitListCount.count.item_chart
				} else {
					this.counselorTimes.items = []
					this.table3.class = 'chart-table'
					this.table3.headers = res.data.visitListCount.count.header_chart_range
					this.table3.items = res.data.visitListCount.count.item_chart_range
				}
				this.series3 = [res.data.visitListCount.count.stat9, res.data.visitListCount.count.stat2]
				this.table3.tableCount = [
					res.data.visitListCount.count.total,
					res.data.visitListCount.count.stat9,
					res.data.visitListCount.count.stat2,
				]
				for (let index = 0; index < res.data.visitListCount.count.reservedayCount; index++) {
					this.table3_sub.push({
						title: res.data.visitListCount.count['headers_' + index + '_title'],
						headers: res.data.visitListCount.count['headers_' + index],
						items: res.data.visitListCount.count['items_' + index],
						hidedefaultfooter: true,
					})

					// 수정
					let list = []
					let list2 = []
					let idx = 0
					while (
						this.table3_sub[index].items &&
						this.table3_sub[index].items.length > 0 &&
						this.table3_sub[index].items[0][idx] !== undefined
					) {
						list.push(this.table3_sub[index].items[0][idx])
						list2.push(this.table3_sub[index].items[0][`${idx}_label`])
						idx++
					}
					this.table3_sub[index]['subSeries'] = {
						name: 'sub_chart',
						data: list,
					}
					this.table3_sub[index]['subOptions'] = {
						name: '',
						chart: {
							width: 380,
							type: 'pie',
						},
						legend: {
							show: false,
						},
						labels: list2,
					}
					// 쉊ㅇ 끝

					this.table3_sub[index]['name'] = this.table3_sub[index].items[0].List
					console.log(this.sub_options3.name)
				}
				let table3_sub_object = JSON.parse(JSON.stringify(this.table3_sub))
				this.table3_sub_object.subtable = table3_sub_object

				console.log(this.table3_sub)
				for (let index = 0; index < res.data.visitListCount.count.reservedayCount; index++) {
					let list = []
					let list2 = []
					let idx = 0
					while (this.table3_sub[index].items[0][idx] !== undefined) {
						list.push(this.table3_sub[index].items[0][idx])
						list2.push(this.table3_sub[index].items[0][`${idx}_label`])
						idx++
					}
					this.sub_series3.data = list
					this.sub_options3.labels = list2
					console.log(this.sub_series3.data)
					console.log(this.sub_options3.labels)
				}
				this.table3.sucessVisit = res.data.visitListCount.count.item_chart_range_sucess
			})

			await this.$store.dispatch('reserveusersCount', data).then(res => {
				this.table3.totalVisit = res.data.reserveusersCount.count.items //상담사에서 총 방문자 정보
			})
		},
		campainListCount() {
			const data = {
				sdate: this.termStartpicker5.date,
				edate: this.termEndpicker5.date,
				business: this.bizSelect.value.id,
			}
			this.$store.dispatch('campainListCount', data).then(res => {
				let tableCount = []
				this.table5_sub = []
				if (this.termStartpicker5.date === this.termEndpicker5.date) {
					this.table5.class = ''
					this.table5.headers = res.data.campainListCount.count.header_chart
					this.table5.items = res.data.campainListCount.count.item_chart
					for (let index = 0; index < res.data.campainListCount.count.header_chart.length; index++) {
						// 수정
						let sublist = []
						let sublist2 = []
						// let idx = 0
						// while (res.data.campainListCount.count['items_' + index][0][idx] !== undefined) {
						// 	sublist.push(res.data.campainListCount.count['items_' + index][0][idx])
						// 	sublist2.push(res.data.campainListCount.count['items_' + index][0][`${idx}_label`])
						// 	idx++
						// }

						// 쉊ㅇ 끝

						this.table5_sub.push({
							title: res.data.campainListCount.count['headers_' + index + '_title'],
							headers: res.data.campainListCount.count['headers_' + index],
							items: res.data.campainListCount.count['items_' + index],
							hidedefaultfooter: true,
							subOptions: {
								name: '',
								chart: {
									width: 380,
									type: 'pie',
								},
								legend: {
									show: false,
								},
								labels: sublist2,
							},
							subSeries: {
								name: 'sub_chart',
								data: sublist,
							},
							name: res.data.campainListCount.count['items_' + index][0].List,
						})

						for (let index2 = 0; index2 < res.data.campainListCount.count.header_chart[index].subCount; index2++) {
							// 수정
							let sublist = []
							let sublist2 = []
							// let idx = 0
							// while (res.data.campainListCount.count['items_sub' + index2 + '_' + index][0][idx] !== undefined) {
							// 	sublist.push(res.data.campainListCount.count['items_sub' + index2 + '_' + index][0][idx])
							// 	sublist2.push(res.data.campainListCount.count['items_sub' + index2 + '_' + index][0][`${idx}_label`])
							// 	idx++
							// }

							// 쉊ㅇ 끝

							this.table5_sub.push({
								title: res.data.campainListCount.count['headers_sub' + index2 + '_title_' + index],
								headers: res.data.campainListCount.count['headers_sub' + index2 + '_' + index],
								items: res.data.campainListCount.count['items_sub' + index2 + '_' + index],
								hidedefaultfooter: true,
								subOptions: {
									name: '',
									chart: {
										width: 380,
										type: 'pie',
									},
									legend: {
										show: false,
									},
									labels: sublist2,
								},
								subSeries: {
									name: 'sub_chart',
									data: sublist,
								},
								name: res.data.campainListCount.count['items_sub' + index2 + '_' + index][0].List,
							})
						}

						// // 수정
						// 				let sublist = []
						// 				let sublist2 = []
						// 				let idx = 0
						// 				while (res.data.campainListCount.count['items_sub' + index2 + '_' + index][0][idx] !== undefined) {
						// 					sublist.push(res.data.campainListCount.count['items_sub' + index2 + '_' + index][0][idx])
						// 					sublist2.push(res.data.campainListCount.count['items_sub' + index2 + '_' + index][0][`${idx}_label`])
						// 					idx++
						// 				}

						// 				// 쉊ㅇ 끝
					}
					console.log(this.table5_sub)

					for (let index = 0; index < this.table5_sub.length; index++) {
						let sublist = []
						let sublist2 = []
						let idx = 0

						while (this.table5_sub[index].items[0][idx] !== undefined) {
							sublist.push(this.table5_sub[index].items[0][idx])
							sublist2.push(this.table5_sub[index].items[0][`${idx}_label`])
							idx++
						}
						this.table5_sub[index].subOptions.labels = sublist2
						this.table5_sub[index].subSeries.data = sublist
					}

					let table5_sub_object = JSON.parse(JSON.stringify(this.table5_sub))
					this.table5_sub_object.subtable = table5_sub_object

					this.options5.labels = ['전체 거점 DB', '거점 수집 DB']
					this.series5 = [0, 0]
					this.table5.tableCount = [0, 0]
					tableCount = res.data.campainListCount.count.item_chart_range.map(x => x.Sum)
					for (let i = 0; i < tableCount.length; i++) {
						this.table5.tableCount[0] += tableCount[i]
						this.series5[0] += tableCount[i]
						if (i !== 0) {
							this.table5.tableCount[1] += tableCount[i]
							this.series5[1] += tableCount[i]
						}
					}
				} else {
					this.table5.class = 'chart-table'
					this.table5.headers = res.data.campainListCount.count.header_chart_range
					this.table5.items = res.data.campainListCount.count.item_chart_range
					for (let index = 0; index < res.data.campainListCount.count.header_chart.length; index++) {
						this.table5_sub.push({
							title: res.data.campainListCount.count['headers_' + index + '_title'],
							headers: res.data.campainListCount.count['headers_' + index],
							items: res.data.campainListCount.count['items_' + index],
							hidedefaultfooter: true,
						})
						for (let index2 = 0; index2 < res.data.campainListCount.count.header_chart[index].subCount; index2++) {
							this.table5_sub.push({
								title: res.data.campainListCount.count['headers_sub' + index2 + '_title_' + index],
								headers: res.data.campainListCount.count['headers_sub' + index2 + '_' + index],
								items: res.data.campainListCount.count['items_sub' + index2 + '_' + index],
								hidedefaultfooter: true,
							})
						}
					}
					this.options5.labels = ['전체 거점 DB', '거점 수집 DB']
					tableCount = res.data.campainListCount.count.item_chart_range.map(x => x.Sum)
					this.series5 = [0, 0]
					this.table5.tableCount = [0, 0]
					for (let i = 0; i < tableCount.length; i++) {
						this.table5.tableCount[0] += tableCount[i]
						this.series5[0] += tableCount[i]
						if (i !== 0) {
							this.table5.tableCount[1] += tableCount[i]
							this.series5[1] += tableCount[i]
						}
					}
				}
			})
		},
		alertCount() {
			const data = {
				date: this.termStartpicker4.date,
				business: this.bizSelect.value.id,
			}
			this.$store.dispatch('alertCount', data).then(res => {
				this.table6.class = ''
				this.series6 = [
					res.data.alertCount.count.items.map(x => x.talk).reduce((a, b) => a + b),
					res.data.alertCount.count.items.map(x => x.lms).reduce((a, b) => a + b),
					res.data.alertCount.count.items.map(x => x.sms).reduce((a, b) => a + b),
				]
				this.table6.tableCount = [
					res.data.alertCount.count.items.map(x => x.talk).reduce((a, b) => a + b) +
						res.data.alertCount.count.items.map(x => x.sms).reduce((a, b) => a + b) +
						res.data.alertCount.count.items.map(x => x.lms).reduce((a, b) => a + b),
					res.data.alertCount.count.items.map(x => x.talk).reduce((a, b) => a + b),
					res.data.alertCount.count.items.map(x => x.lms).reduce((a, b) => a + b),
					res.data.alertCount.count.items.map(x => x.sms).reduce((a, b) => a + b),
				]
				this.table6.headers = res.data.alertCount.count.headers
				this.table6.items = res.data.alertCount.count.items
			})
		},
		totalCount(arr) {
			let sum = 0
			for (let index = 0; index < arr.length; index++) {
				if (arr[index]) sum += arr[index]
			}
			return sum
		},
		reserveusersRangeCountBoard() {
			const data = {
				sdate: this.termStartpicker1.date,
				edate: this.termEndpicker1.date,
				business: this.bizSelect.value.id,
			}

			this.$store.dispatch('reserveusersRangeCountBoard', data).then(res => {
				this.table1.class = 'chart-table'
				if (this.termStartpicker1.date === this.termEndpicker1.date) {
					this.table1.tableCount = [
						this.totalCount(res.data.reserveusersRangeCountBoard.count.items.map(x => x.total)),
						this.totalCount(res.data.reserveusersRangeCountBoard.count.items.map(x => x.Sum)),
						this.totalCount(res.data.reserveusersRangeCountBoard.count.items.map(x => x.total)) -
							this.totalCount(res.data.reserveusersRangeCountBoard.count.items.map(x => x.Sum)),
					]
					this.series1 = [
						this.totalCount(res.data.reserveusersRangeCountBoard.count.items.map(x => x.Sum)),
						this.totalCount(res.data.reserveusersRangeCountBoard.count.items.map(x => x.total)) -
							this.totalCount(res.data.reserveusersRangeCountBoard.count.items.map(x => x.Sum)),
					]
				} else {
					this.series1 = [res.data.reserveusersRangeCountBoard.count.items[1].Sum, res.data.reserveusersRangeCountBoard.count.items[2].Sum]
					this.table1.tableCount = [
						res.data.reserveusersRangeCountBoard.count.items[0].Sum,
						res.data.reserveusersRangeCountBoard.count.items[1].Sum,
						res.data.reserveusersRangeCountBoard.count.items[2].Sum,
					]
				}
				this.table1.headers = res.data.reserveusersRangeCountBoard.count.headers
				this.table1.items = res.data.reserveusersRangeCountBoard.count.items
			})
		},
		reserveusersCount() {
			const data = {
				sdate: this.termStartpicker2.date,
				edate: this.termEndpicker2.date,
				business: this.bizSelect.value.id,
			}
			this.$store.dispatch('reserveusersCount', data).then(res => {
				this.table2.class = 'chart-table'
				if (this.termStartpicker2.date === this.termEndpicker2.date) {
					this.table2.tableCount = [
						this.totalCount(res.data.reserveusersCount.count.items.map(x => x.total)),
						this.totalCount(res.data.reserveusersCount.count.items.map(x => x.visit)),
						this.totalCount(res.data.reserveusersCount.count.items.map(x => x.reserve)),
						this.totalCount(res.data.reserveusersCount.count.items.map(x => x.directTotal)),
					]
					this.series2 = [
						this.totalCount(res.data.reserveusersCount.count.items.map(x => x.visit)),
						this.totalCount(res.data.reserveusersCount.count.items.map(x => x.reserve)),
					]
				} else {
					this.series2 = [res.data.reserveusersCount.count.items[1].Sum, res.data.reserveusersCount.count.items[2].Sum]
					this.table2.tableCount = [
						res.data.reserveusersCount.count.items[0].Sum,
						res.data.reserveusersCount.count.items[1].Sum,
						res.data.reserveusersCount.count.items[2].Sum,
						res.data.reserveusersCount.count.items[3].Sum,
					]
				}
				this.table2.headers = res.data.reserveusersCount.count.headers
				this.table2.items = res.data.reserveusersCount.count.items
			})
		},
		alertCountRange() {
			const data = {
				sdate: this.termStartpicker6.date,
				edate: this.termEndpicker6.date,
				business: this.bizSelect.value.id,
			}
			this.$store.dispatch('alertCountRange', data).then(res => {
				this.table6.class = 'chart-table'
				this.series6 = [
					res.data.alertCountRange.count.items[0].Sum,
					res.data.alertCountRange.count.items[1].Sum,
					res.data.alertCountRange.count.items[2].Sum,
				]
				this.table6.tableCount = [
					res.data.alertCountRange.count.items[0].Sum +
						res.data.alertCountRange.count.items[1].Sum +
						res.data.alertCountRange.count.items[2].Sum,
					res.data.alertCountRange.count.items[0].Sum,
					res.data.alertCountRange.count.items[1].Sum,
					res.data.alertCountRange.count.items[2].Sum,
				]
				this.table6.headers = res.data.alertCountRange.count.headers
				this.table6.items = res.data.alertCountRange.count.items
			})
		},
		EventCount() {
			const data = {
				date: this.termStartpicker4.date,
				business: this.bizSelect.value.id,
			}
			this.$store.dispatch('eventCount', data).then(res => {
				this.table4.class = ''
				this.series4 = [res.data.eventCount.count.existNumber, res.data.eventCount.count.winnerNumber]
				this.table4.tableCount = [
					res.data.eventCount.count.total,
					res.data.eventCount.count.winnerNumber,
					res.data.eventCount.count.existNumber,
				]
				this.table4.headers = res.data.eventCount.count.headers
				this.table4.items = res.data.eventCount.count.items
			})
		},
		EventCountRange() {
			const data = {
				sdate: this.termStartpicker4.date,
				edate: this.termEndpicker4.date,
				business: this.bizSelect.value.id,
			}
			this.$store.dispatch('eventCountRange', data).then(res => {
				this.table4.class = 'chart-table'
				this.series4 = [
					res.data.eventCountRange.count.total - res.data.eventCountRange.count.receipt,
					res.data.eventCountRange.count.receipt,
				]
				this.table4.tableCount = [
					res.data.eventCountRange.count.total,
					res.data.eventCountRange.count.receipt,
					res.data.eventCountRange.count.total - res.data.eventCountRange.count.receipt,
				]
				this.table4.headers = res.data.eventCountRange.count.headers
				this.table4.items = res.data.eventCountRange.count.items
			})
		},
		reserveChange() {
			this.$store.state.report_reserve = this.bizSelect.value
			if (this.bizSelect.value.reservedays.filter(x => x.type === 'c').length > 0) this.campainListCount()
			if (this.bizSelect.value.reservedays.filter(x => x.type === 'd').length > 0) {
				this.reserveusersRangeCountBoard()
				this.reserveusersCount()
				this.visitListCount()
			}
			if (this.bizSelect.value.events.length > 0) this.EventCount()
			this.alertCount()
		},

		disabledata() {
			this.datedisable = false
		},
		clickExport1() {
			document.getElementById('csv-download1').click()
		},
		clickExport2() {
			document.getElementById('csv-download2').click()
		},
		clickExport3() {
			document.getElementById('messageReport').click()
		},

		reservedays() {
			const data = {}
			this.$store
				.dispatch('businesses', data)
				.then(res => {
					this.bizSelect.items = res.data.businesses.sort()
					this.bizSelect.value = res.data.businesses[0]
					this.$store.state.report_reserve = res.data.businesses[0]
					if (this.bizSelect.value.reservedays.filter(x => x.type === 'c').length > 0) this.campainListCount()
					if (this.bizSelect.value.reservedays.filter(x => x.type === 'd').length > 0) {
						this.reserveusersRangeCountBoard()
						this.reserveusersCount()
						this.visitListCount()
					}

					if (this.bizSelect.value.events.length > 0) this.EventCount()
					this.alertCount()
				})
				.catch(() => {})
		},
		setTime() {
			// 일별별 날짜 셋팅
			this.daypicker.date = this.$moment(new Date()).format('YYYY-MM-DD')
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			// 기간별 날짜 셋팅
			this.termStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
			this.messageStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.messageEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
		},
	},
}
</script>

<style lang="scss">
.chart-table {
	.v-data-table {
		.v-data-table__wrapper {
			// max-width: 1115px;
			.v-data-table-header {
				th {
					width: 120px;
					max-width: 120px;
				}
			}
		}
	}
}
</style>
