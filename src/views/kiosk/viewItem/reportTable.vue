<template>
	<v-layout wrap class="mt-5" :class="tableleft.subContent ? 'chart_wrap_sub' : 'chart_wrap'">
		<v-layout>
			<v-flex xs4 class="mt-4 mr-8">
				<div class="d-flex align-center">
					<v-icon color="#9D9DB7">
						<!-- mdi-magnify -->
						mdi-circle-small
					</v-icon>
					<span class="sub_header">{{ tableleft.title }} </span>
				</div>
				<div class="d-flex align-center">
					<apexcharts
						height="160"
						:width="tableleft.title === '외부 설문 현황' ? '400' : '360'"
						type="donut"
						:options="options"
						:key="keyData"
						:series="series"
						:class="series.length >= 3 ? 'series_position' : ''"
					></apexcharts>
					<div
						class="donut_center"
						:class="tableleft.title === '외부 설문 현황' ? 'donut_center3' : ''"
						v-if="series.length > 1 && series.length < 3"
					>
						<div>{{ series[0] }}({{ series[0] ? seriesPer(series[0]).toFixed(0) : 0 }}%)</div>
						<div style="color:#7674AA">{{ series[1] }}({{ series[1] ? seriesPer(series[1]).toFixed(0) : 0 }}%)</div>
					</div>
					<div v-if="series.length >= 3" style="color:#B5B3E5" class="donut_center2">
						<div>{{ series[0] }}({{ series[0] ? seriesPer(series[0]).toFixed(0) : 0 }}%)</div>
						<div style="color:#7674AA">{{ series[1] }}({{ series[1] ? seriesPer(series[1]).toFixed(0) : 0 }}%)</div>
						{{ series[2] }}({{ series[2] ? seriesPer(series[2]).toFixed(0) : 0 }}%)
					</div>
					<div class="donut_table">
						<table class="chart_table">
							<tr v-for="(tabletitle, i) in tableleft.tableTitle" :key="i">
								<th style="background:#F5F5F5; font-weight:normal">{{ tabletitle }}</th>
								<th :key="keyData">{{ tableleft.tableCount[i] }}</th>
							</tr>
						</table>
					</div>
				</div>
			</v-flex>
			<v-flex xs8 class="mt-4">
				<div class="header_search2 d-flex align-center mb-3 mr-5">
					<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_1'" style="margin-left:15px !important">
						<DatepickerDialog :picker="termStartpicker" :disabledata="disabledata"></DatepickerDialog
					></v-flex>
					<span class="mx-1"> ~ </span>
					<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'search_date_2'">
						<DatepickerDialog :picker="termEndpicker" :disabledata="disabledata" :allowed_dates="termCustomer"></DatepickerDialog
					></v-flex>
					<v-layout class="search_wrap">
						<v-flex class="search_select ml-2">
							<selectBox :sel="searchsel" @change="selectDays" :class="'searchSel'"></selectBox>
						</v-flex>
						<v-btn class="search_btn ml-2" color="#5d19ff" @click="$emit('click', $event)"><v-icon>mdi-magnify</v-icon>조회</v-btn>
						<v-btn small class="excel_btn mr-2" @click="clickExport()"><img src="@/assets/images/excel-img2.png" />엑셀파일 다운로드</v-btn>
						<v-btn small class="excel_btn mr-2  ml-0" v-if="chart_open" @click="click_chart()">
							{{ chart.open ? '그래프 접기' : '그래프 보기' }}
						</v-btn>
						<!-- 대표 테이블 excel -->
					</v-layout>
				</div>
				<div class="mr-5">
					<datatable :datatable="tableleft" class="mb-3"></datatable>
				</div>
				<div v-if="counselorTimes" class="mr-5">
					<datatable v-if="counselorTimes.items.length > 0" :datatable="counselorTimes" class="mb-3"></datatable>
				</div>

				<div id="chart" v-if="chart.open">
					<apexcharts type="line" height="350" :options="chart.chartOptions" :series="chart.series"></apexcharts>
				</div>
			</v-flex>
		</v-layout>
		<v-flex v-for="(table, i) in subtable_object ? subtable_object.subtable : subtable" :key="i">
			<div :class="i === 0 ? 'mt-10' : 'mt-4'">
				<v-icon color="#9D9DB7">
					mdi-circle-small
				</v-icon>
				<span class="sub_header" style="width:450px !important;">{{ table.title }} </span>
			</div>
			<v-layout v-if="subtable && table.subOptions">
				<v-flex xs4 class="d-flex align-center justify-center">
					<div>
						<apexcharts
							:options="table.subOptions"
							:series="table.subSeries.data"
							:key="table.subOptions.labels.length > 0 ? i + '_' + table.subOptions.labels[0] + table.title + table.name : table.name"
						></apexcharts>
						<div class="mt-2" style="text-align:center; font-weight:bold">{{ table.name }}</div>
					</div>
				</v-flex>
				<v-flex xs8>
					<datatable :datatable="table" class="chart-table mr-5" @click="changeChart($event, table)"></datatable>
				</v-flex>
			</v-layout>
			<v-layout v-else-if="subtable">
				<datatable :datatable="table" class="ml-5 mr-5"></datatable>
			</v-layout>
			<!-- subtable excel -->
		</v-flex>
		<download-excel
			class="btn btn-default"
			:id="`excel-down-${tableleft.title}`"
			:data="multiple_excel"
			style="display:none"
			type="text/csv;charset=utf8"
			worksheet="My Worksheet"
			:name="excel_title"
		>
		</download-excel>
	</v-layout>
</template>

<script>
import { DatepickerDialog, selectBox, datatable } from '@/components/index.js'
import VueApexCharts from 'vue-apexcharts'
import downloadExcel from 'vue-json-excel'

export default {
	components: {
		DatepickerDialog,
		selectBox,
		datatable,
		downloadExcel,
		apexcharts: VueApexCharts,
	},
	data() {
		return {
			keyData: 0,
			searchsel: { value: '오늘', errorMessage: '', hideDetail: true, items: ['오늘', '이번 주', '이번 달'], outlined: true },
			table: {
				datatable: {
					headers: [],
					items: [],
					// hidedefaultfooter: false,
					noweditting: '',
					title: '테스트 타이틀',
					onlyAgree: false,
					// inputboxId: x.id,
				},
				filter: [],
				json_fields: {},
			},
			multiple_excel: [],
			excel_title: '',
			chart: {
				open: false,
				series: [
					// {
					// 	name: '예약고객수',
					// 	type: 'column',
					// 	data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
					// },
					// {
					// 	name: '누적고객수',
					// 	type: 'line',
					// 	data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
					// },
					// {
					// 	name: '설정고객수',
					// 	type: 'line',
					// 	data: [600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600, 600],
					// },
				],
				chartOptions: {
					colors: ['#008ffb', '#f33', '#000'],
					fill: {
						colors: ['#008ffb', '#f33', '#000'],
					},
					chart: {
						height: 350,
						type: 'line',
						toolbar: {
							show: false,
						},
					},
					stroke: {
						width: 2,
					},
					// title: {
					// 	text: 'Traffic Sources',
					// },
					// dataLabels: {
					// 	enabled: true,
					// 	enabledOnSeries: [0, 1, 2],
					// 	// style: {
					// 	// 	marginRight: '20px',
					// 	// },
					// },

					labels: [
						'22-12-01',
						'22-12-02',
						'22-12-03',
						'22-12-04',
						'22-12-05',
						'22-12-06',
						'22-12-07',
						'22-12-08',
						'22-12-09',
						'22-12-10',
						'22-12-11',
						'22-12-12',
					],
					xaxis: {
						// type: 'datetime',
					},
					yaxis: [
						{
							title: {
								text: '',
							},
						},
					],
					tooltip: {
						shared: true,
						intersect: false,
						y: [{}, {}, {}],
					},
				},
			},
		}
	},
	props: {
		series: Array,
		options: Object,
		subSeries: Object,
		subOptions: Object,
		chart_open: Boolean,
		tableleft: Object,
		subtable: Array,
		subtable_object: Object,
		termStartpicker: Object,
		termEndpicker: Object,
		counselorTimes: Object,
		type: String,
	},
	watch: {
		series() {
			this.keyData += 1
		},
		tableleft: {
			deep: true,
			async handler() {
				this.chart.open = false
			},
		},
	},
	methods: {
		changeChart(data, table) {
			table.name = data.List
			let list = []
			let list2 = []
			let idx = 0
			while (data[idx] !== undefined) {
				list.push(data[idx])
				list2.push(data[`${idx}_label`])
				idx++
			}
			table.subSeries.data = list
			table.subOptions.labels = list2
		},
		click_chart() {
			this.chart.open = !this.chart.open
			let [li_1, result, result_color] = [[], [], []]
			for (let i = 1; i < this.tableleft.headers.length - 1; i++) {
				li_1.push(this.tableleft.headers[i].value)
			}
			for (let j = 0; j < this.tableleft.items.length; j++) {
				let [li_2, li_3] = [[], []]

				if (this.tableleft.items[j].List === '설정 고객 수') {
					for (let i = 0; i < li_1.length; i++) {
						li_2.push(this.tableleft.items[j][li_1[i]])
					}
					result_color.push('#000')
					result.push({ name: this.tableleft.items[j].List, type: 'line', data: li_2 })
				} else if (this.tableleft.items[j].List === '예약 고객 수') {
					if (this.type === 'reserveCustomer') {
						for (let i = 0; i < li_1.length; i++) {
							li_2.push(this.tableleft.items[j][li_1[i]])
							li_3.push(this.tableleft.items[j][li_1[i]])
						}
						for (let i = 1; i < li_3.length; i++) {
							li_3[i] = li_3[i - 1] + li_3[i]
						}
						result.push({ name: this.tableleft.items[j].List, type: 'column', data: li_2 })
						result_color.push('#008ffb')
						result.push({ name: '누적고객수', type: 'line', data: li_3 })
						result_color.push('#f33')
					}
				} else if (this.tableleft.items[j].List === '방문 고객 수') {
					for (let i = 0; i < li_1.length; i++) {
						li_2.push(this.tableleft.items[j][li_1[i]])
					}
					result.push({ name: '예약 방문 고객수', type: 'column', data: li_2 })
					result_color.push('#008ffb')
				} else if (this.tableleft.items[j].List === '현장 등록고객 수') {
					for (let i = 0; i < li_1.length; i++) {
						li_2.push(this.tableleft.items[j][li_1[i]])
					}
					result.push({ name: '현장 방문수', type: 'column', data: li_2 })
					result_color.push('#f33')
				}
			}
			if (this.type === 'visitCustomer') {
				let list = []
				for (let i = 0; i < result[0].data.length; i++) {
					list.push(result[0].data[i] + result[1].data[i])
				}
				result.push({ name: '방문고객수', type: 'line', data: list })
				result_color.push('#000')
			} else if (this.type === 'counselor') {
				// 총 방문인원
				let sub_res = []
				for (let j = 0; j < this.tableleft.totalVisit.length; j++) {
					let list3 = []
					if (this.tableleft.totalVisit[j].List === '방문 고객 수') {
						for (let i = 0; i < li_1.length; i++) {
							list3.push(this.tableleft.totalVisit[j][li_1[i]])
						}
						sub_res.push({ data: list3 })
					} else if (this.tableleft.totalVisit[j].List === '현장 등록고객 수') {
						for (let i = 0; i < li_1.length; i++) {
							list3.push(this.tableleft.totalVisit[j][li_1[i]])
						}
						sub_res.push({ data: list3 })
					}

					if (this.tableleft.totalVisit.length - 1 === j) {
						let list4 = []
						for (let i = 0; i < sub_res[0].data.length; i++) {
							list4.push(sub_res[0].data[i] + sub_res[1].data[i])
							if (sub_res[0].data.length - 1 === i) {
								result.push({ name: '방문총계', type: 'column', data: list4 })
								result_color.push('#008ffb')
							}
						}
					}
				}
				// 상담 완료
				let list = []
				for (let i = 0; i < li_1.length; i++) {
					let num = 0
					for (let j = 0; j < this.tableleft.sucessVisit.length; j++) {
						num = num + this.tableleft.sucessVisit[j][li_1[i]]
					}
					list.push(num)
					if (li_1.length - 1 === i) {
						result.push({ name: '상담완료', type: 'column', data: list })
						result_color.push('#000')
					}
				}
				// 상담률
				let list_percent = []
				for (let i = 0; i < result[0].data.length; i++) {
					if (result[0].data[i] === 0) {
						list_percent.push(0)
					} else {
						list_percent.push(Math.round((result[1].data[i] / result[0].data[i]) * 100))
					}
					if (result[0].data.length - 1 === i) {
						result.push({ name: '상담률', type: 'line', data: list_percent })
						result_color.push('#f33')
					}
				}
				// result_name = [
				// 	{
				// 		seriesName: '방문총계',
				// 	},
				// 	{
				// 		seriesName: '방문총계',
				// 		show: false,
				// 	},
				// 	{
				// 		opposite: true,
				// 		title: {
				// 			text: '상담률',
				// 		},
				// 		min: 0,
				// 		max: 100,
				// 		seriesName: '상담률',
				// 		labels: {
				// 			show: true,
				// 			formatter: val => {
				// 				return val + ' %'
				// 			},
				// 		},
				// 	},
				// ]
				// this.chart.chartOptions.yaxis = result_name

				// this.chart.chartOptions.dataLabels['formatter'] = (val, opts) => {
				// 	if (opts.seriesIndex === 2) {
				// 		return val + '%'
				// 	} else {
				// 		return val
				// 	}
				// }

				this.chart.chartOptions.tooltip.y[2] = {
					formatter: function(y) {
						if (typeof y !== 'undefined') {
							return y + ' %'
						}
						return y
					},
				}
			}

			this.chart.chartOptions.labels = li_1
			this.chart.series = result
			this.chart.chartOptions.colors = result_color
			this.chart.chartOptions.fill.colors = result_color
		},
		seriesPer(a) {
			if (this.series.length < 3) {
				return (a / (this.series[0] + this.series[1])) * 100
			} else if (this.series.length === 3) {
				return (a / (this.series[0] + this.series[1] + this.series[2])) * 100
			}
		},
		disabledata() {
			this.datedisable = false
		},

		termCustomer(val) {
			let start = this.$moment(this.termStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.termStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
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
		clickExport() {
			// excel 다운로드 -
			this.$store.state.loading = true

			this.excel_title = `${this.$store.state.report_reserve.title}_${this.$moment(this.termStartpicker.date).format(
				'YYYY-MM-DD',
			)}_${this.$moment(this.termEndpicker.date).format('YYYY-MM-DD')}_${this.tableleft.title} 리스트.xls`

			// 각 테이블의 header 를 최상위 header 의 item처럼 사용해서 보이게 하는 원리 -> 그래서 굵은 글씨의 header가 없음

			// 가장 길이가 큰 header 골라서 최상위 header 세팅  ( 최상위 header 는 빈칸으로 저장됨 )
			let main_headers = this.tableleft ? this.tableleft.headers : []
			let times_headers = this.counselorTimes ? this.counselorTimes.headers : []
			let sub_headers = this.subtable ? this.subtable[0].headers : []
			if (this.subtable) {
				//subtable 의 header 중 가장 긴 header 값 세팅
				let sub_hedaer_map = this.subtable.map(el => el.headers)

				let max_lengths = sub_hedaer_map.map(a => a.length)
				sub_headers = sub_hedaer_map[max_lengths.indexOf(Math.max(...max_lengths))]
			}

			// 메인, 시간별, subtable 의 중 header 의 길이가 가장 긴 걸로 기본 세팅
			let header_loop_number = Math.max(main_headers.length, times_headers.length, sub_headers.length)

			let excelDatas = [] // 저장 될 데이터 모일 곳

			let excelTitle = { ' ': `${this.tableleft.title}: ` }
			let excelSet = {}
			let headBlank = ''

			for (let index = 0; index < header_loop_number; index++) {
				headBlank = headBlank + ' '
				excelSet[headBlank] = ' '
			}

			excelDatas.push(excelSet)
			excelDatas.push(excelTitle)

			// 1번째 테이블 ( tableleft 테이블 )  세팅
			// 헤더
			let excelHeader_main = {}
			let headBlank_main = ''

			this.tableleft.headers.forEach(e => {
				headBlank_main = headBlank_main + ' '
				excelSet[headBlank_main] = ' '
				excelHeader_main[headBlank_main] = e.text
			})
			excelDatas.push(excelHeader_main)

			// 아이템
			let main_header_map = this.tableleft.headers.map(el => el.value)

			this.tableleft.items.forEach(item => {
				let main_item = {}
				let headBlank = ''

				for (let index = 0; index < main_header_map.length; index++) {
					headBlank = headBlank + ' '
					main_item[headBlank] = item[main_header_map[index]]
				}

				excelDatas.push(main_item)
			})

			if (this.counselorTimes && this.counselorTimes.items.length > 0) {
				// 2번째 테이블 ( counselorTimes 테이블 )  세팅
				// 헤더
				let excelTitle_times = { ' ': `시간대별 현황: ` }
				excelDatas.push({}) // 한줄 띄우기 위한 행추 가
				excelDatas.push(excelTitle_times) // 2번째 테이블 제목 행 추가

				let excelHeader_times = {}
				let headBlank_times = ''

				this.counselorTimes.headers.forEach(e => {
					headBlank_times = headBlank_times + ' '
					excelHeader_times[headBlank_times] = e.text
				})
				excelDatas.push(excelHeader_times)

				// 아이템
				let times_header_map = this.counselorTimes.headers.map(el => el.value)

				this.counselorTimes.items.forEach(item => {
					let times_item = {}
					let headBlank = ''

					for (let index = 0; index < times_header_map.length; index++) {
						headBlank = headBlank + ' '
						times_item[headBlank] = item[times_header_map[index]]
					}

					excelDatas.push(times_item)
				})
			}

			if (this.subtable) {
				// 3번째 테이블 ( subtable 테이블 )  세팅
				this.subtable.forEach(table => {
					// 헤더
					let excelTitle_sub = { ' ': `${table.title}: ` }
					excelDatas.push({}) // 한줄 띄우기 위한 행추 가
					excelDatas.push(excelTitle_sub) // 3번째 테이블의 각 제목 행 추가

					let excelHeader_sub = {}
					let headBlank_sub = ''

					table.headers.forEach(e => {
						headBlank_sub = headBlank_sub + ' '
						excelHeader_sub[headBlank_sub] = e.text
					})
					excelDatas.push(excelHeader_sub)

					// 아이템
					let sub_header_map = table.headers.map(el => el.value)

					table.items.forEach(item => {
						let sub_item = {}
						let headBlank = ''

						for (let index = 0; index < sub_header_map.length; index++) {
							headBlank = headBlank + ' '
							let content = ''
							if (sub_header_map[index].indexOf('_') > 0) {
								let answer_index = sub_header_map[index].split('_')[0]
								if (item[`${answer_index}_label`]) {
									content = `${item[`${answer_index}_label`]} \n ${item[`${answer_index}`]} (${
										item[`${answer_index}`] > 0 ? ((item[`${answer_index}`] / item['Sum']) * 100).toFixed(0) : 0
									})%`
								}
							} else if (sub_header_map[index] === 'noAnswer') {
								content = `무응답 \n ${item.noAnswer ? item.noAnswer : 0} (${
									item.noAnswer > 0 ? ((item.noAnswer / item['Sum']) * 100).toFixed(0) : 0
								})%`
							} else {
								content = item[sub_header_map[index]]
							}
							sub_item[headBlank] = content
						}

						excelDatas.push(sub_item)
					})
				})
			}

			// 데이터 세팅 후 1초 후 다운로드
			this.multiple_excel = excelDatas

			// 데이터 세팅 후 1초 후 다운로드
			setTimeout(() => {
				document.getElementById(`excel-down-${this.tableleft.title}`).click()
				this.$store.state.loading = false
			}, 1000)
			// 	})
			// }
		},
	},
}
</script>

<style lang="scss">
.excel_btn {
	height: 26px !important;
	box-shadow: none;
	background-color: #ffffff;
	border: 1px solid #9a9c9b;
	border-radius: 5px;
	margin-left: auto;
}
.apexcharts-legend {
	min-width: 158px;
	flex-flow: row !important;
	min-height: 20px;
	height: 30px;
	left: 212px !important;
	right: auto !important;
	padding: 0px !important;
}
.chart_table {
	width: 200px;
	position: absolute;
	top: 55px;
	left: 212px;
	font-size: 13px;
	font-weight: normal;
}
.chart-table .v-data-table .v-data-table__wrapper {
	max-width: 100% !important;
}
.series_position .apexcharts-legend {
	right: -13px !important;
}

.apexcharts-legend-text {
	font-size: 11px !important;
}
</style>
<style lang="scss" scoped>
.apexcharts-inner {
	position: relative;
}
.donut_center {
	position: absolute;
	top: 60px;
	left: 78px;
	font-size: 13px;
}
.donut_center2 {
	position: absolute;
	top: 45px;
	left: 69px;
	font-size: 13px;
}
.donut_center3 {
	position: absolute;
	top: 60px;
	left: 87px;
	font-size: 13px;
}
</style>
