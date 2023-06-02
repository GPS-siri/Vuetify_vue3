<template>
	<div style="width:100%;">
		<div :class="$vuetify.breakpoint.xs ? '' : 'wrapper'">
			<div class="notice-sample" v-if="$route.name === 'sample1'">
				※ 현 데이터를 샘플 이므로 변경 되지 않습니다.
			</div>
			<v-layout wrap>
				<v-flex class="pa-2" xs12>
					<v-layout wrap align-center>
						<v-flex lg3 md4 sm12 xs12 offset-lg9 offset-md8 class="my-5" v-if="$route.name !== 'sample1'">
							<selectBox v-if="sel.items != []" :sel="selCampaign" @change="changeCampaign" class="ml-2" />
						</v-flex>
						<v-flex xs12>
							<v-layout align-center wrap>
								<div class="mr-3">| 설문항목별 현황 :</div>
								<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'my-2 ml-5 mr-2'" lg2 md2 sm7 xs12>
									<DatepickerDialog
										:picker="campStartpicker"
										:disabledata="disabledata"
										@input="campaignRangeCount(sel.value)"
									></DatepickerDialog>
								</v-flex>
								<span class="mx-3"> ~ </span>
								<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'my-2 mr-5 ml-2'" lg2 md2 sm12 xs12>
									<DatepickerDialog
										:picker="campEndpicker"
										:disabledata="disabledata"
										:allowed_dates="termCampaign"
										@input="campaignRangeCount(sel.value)"
									></DatepickerDialog
								></v-flex>

								<btn
									:btn="hideDisagree"
									:style="`background-color:${$store.state.PointColor2}`"
									@click="clickExport5"
									:class="$vuetify.breakpoint.xs ? '' : 'ml-3'"
									btn_txt="Excel"
								></btn>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-flex>
				<!-- 캠페인 항목 통계 -->
				<v-card :class="i === 0 ? 'pa-2' : 'my-4 pa-2'" v-for="(camp, i) in campaigns" :key="i">
					<v-layout class="ml-3">
						<span class="mr-3">{{ i + 1 }}. {{ camp.title }} </span>
					</v-layout>
					<v-layout>
						<v-flex xs12>
							<datatable :datatable="camp" class="tbl-type01"> </datatable>
						</v-flex>
					</v-layout>
				</v-card>

				<download-excel
					:data="dataForExcel"
					id="campaign-download"
					style="display:none"
					:name="campStartpicker.date + ' ~ ' + campEndpicker.date + '_' + selCampaign.value + ' 설문항목별 현황'"
				/>
			</v-layout>
		</div>
	</div>
</template>

<script>
import { datatable, DatepickerDialog, btn, selectBox } from '@/components/index.js'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		downloadExcel,
		datatable,
		DatepickerDialog,
		btn,
		selectBox,
	},
	props: {
		selData: String,
	},
	data() {
		return {
			dataForExcel: [],

			searchTxt: '',
			/// 캠페인별 통계
			campDatatable: {
				headers: [],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
				itemPerPage: 10,
			},
			campStartpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			campEndpicker: {
				date: '',
				errorMessage: '',
				class: 'whiteBack',
				menu: false,
			},
			// selectBox
			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			selCampaign: { value: '', errorMessage: '', hideDetail: true, items: [], code: [], outlined: true, label: '거점 홍보명' },
			selVisit: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },

			datedisable: true,
			reservedayItem: [],
			campaigns: [],
			login: '',

			hideDisagree: {
				class: '',
				dark: true,
				color: '',
				width: '100',
			},
			screenWidth: window.innerWidth,
		}
	},
	watch: {
		selData() {
			this.setGroupData()
		},
	},
	computed: {
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
	created() {
		this.setTime()
		if (this.$route.name !== 'sample1') {
			this.setGroupData() // 페이지 데이터 set api 호출
		} else {
			this.campaigns = [
				{
					title: '서비스 유형',
					class: 'max-width-table',
					items: [
						{
							List: '분양대행',
							'21-10-21': 0,
							'21-10-22': 1,
							'21-10-23': 0,
							'21-10-24': 1,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 2,
						},
						{
							List: '제품 세일즈(자동차, 가전 등)',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '컨설팅',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '의료업',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '전시, 공연 기획',
							'21-10-21': 0,
							'21-10-22': 1,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 1,
						},
						{
							List: '광고업',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '공공기관 및 유관 기간',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '기타',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
					],
					headers: [
						{ text: 'List', value: 'List' },
						{ text: '21-10-21', value: '21-10-21' },
						{ text: '21-10-22', value: '21-10-22' },
						{ text: '21-10-23', value: '21-10-23' },
						{ text: '21-10-24', value: '21-10-24' },
						{ text: '21-10-25', value: '21-10-25' },
						{ text: '21-10-26', value: '21-10-26' },
						{ text: '21-10-27', value: '21-10-27' },
						{ text: 'Sum', value: 'Sum' },
					],
				},
				{
					title: '솔루션 형태',
					class: 'max-width-table',
					items: [
						{
							List: '자체개발',
							'21-10-21': 0,
							'21-10-22': 1,
							'21-10-23': 0,
							'21-10-24': 1,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 2,
						},
						{
							List: '서비스 구매',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '서비스 임대',
							'21-10-21': 0,
							'21-10-22': 1,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 1,
						},
						{
							List: '서비스 대행',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '필요하지만 사용하고 있지 않다',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
					],
					headers: [
						{ text: 'List', value: 'List' },
						{ text: '21-10-21', value: '21-10-21' },
						{ text: '21-10-22', value: '21-10-22' },
						{ text: '21-10-23', value: '21-10-23' },
						{ text: '21-10-24', value: '21-10-24' },
						{ text: '21-10-25', value: '21-10-25' },
						{ text: '21-10-26', value: '21-10-26' },
						{ text: '21-10-27', value: '21-10-27' },
						{ text: 'Sum', value: 'Sum' },
					],
				},
				{
					title: '요구기능',
					class: 'max-width-table',
					items: [
						{
							List: '제택 근무가 가능한 전화상담 시스템',
							'21-10-21': 0,
							'21-10-22': 1,
							'21-10-23': 0,
							'21-10-24': 1,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 2,
						},
						{
							List: '설문 및 상담에 대한 자유로운 항목 구성 및 확장성',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '예약 상세 설정(예외일시 설정, 시간대별 인원 설정, 분단위 세부 시간 설정 등)',
							'21-10-21': 0,
							'21-10-22': 1,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 1,
						},
						{
							List: '방문시 비대면 예약확인 및 상담신청',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '방문, 예약, 상담, 상담대기 현황에 대한 실시간 대시보드',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '전화상담, 설문조사, 방문예약, 상담이력을 통합관리하는 통계 시스템',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
						{
							List: '기타',
							'21-10-21': 0,
							'21-10-22': 0,
							'21-10-23': 0,
							'21-10-24': 0,
							'21-10-25': 0,
							'21-10-26': 0,
							'21-10-27': 0,
							Sum: 0,
						},
					],
					headers: [
						{ text: 'List', value: 'List' },
						{ text: '21-10-21', value: '21-10-21' },
						{ text: '21-10-22', value: '21-10-22' },
						{ text: '21-10-23', value: '21-10-23' },
						{ text: '21-10-24', value: '21-10-24' },
						{ text: '21-10-25', value: '21-10-25' },
						{ text: '21-10-26', value: '21-10-26' },
						{ text: '21-10-27', value: '21-10-27' },
						{ text: 'Sum', value: 'Sum' },
					],
				},
			]
			this.dataForExcel = [
				{ ' ': ' ', '  ': ' ', '   ': ' ', '    ': ' ', '     ': ' ', '      ': ' ', '       ': ' ', '        ': ' ', '         ': ' ' },
				{ ' ': '설문항목별 통계자료 :' },
				{},
				{ ' ': '서비스 유형별 통계자료 :' },
				{
					' ': 'List',
					'  ': '21-10-21',
					'   ': '21-10-22',
					'    ': '21-10-23',
					'     ': '21-10-24',
					'      ': '21-10-25',
					'       ': '21-10-26',
					'        ': '21-10-27',
					'         ': 'Sum',
				},
				{ ' ': '분양대행', '  ': 0, '   ': 1, '    ': 0, '     ': 1, '      ': 0, '       ': 0, '        ': 0, '         ': 2 },
				{
					' ': '제품 세일즈(자동차, 가전 등)',
					'  ': 0,
					'   ': 0,
					'    ': 0,
					'     ': 0,
					'      ': 0,
					'       ': 0,
					'        ': 0,
					'         ': 0,
				},
				{ ' ': '컨설팅', '  ': 0, '   ': 0, '    ': 0, '     ': 0, '      ': 0, '       ': 0, '        ': 0, '         ': 0 },
				{ ' ': '의료업', '  ': 0, '   ': 0, '    ': 0, '     ': 0, '      ': 0, '       ': 0, '        ': 0, '         ': 0 },
				{ ' ': '전시, 공연 기획', '  ': 0, '   ': 1, '    ': 0, '     ': 0, '      ': 0, '       ': 0, '        ': 0, '         ': 1 },
				{ ' ': '광고업', '  ': 0, '   ': 0, '    ': 0, '     ': 0, '      ': 0, '       ': 0, '        ': 0, '         ': 0 },
				{
					' ': '공공기관 및 유관 기간',
					'  ': 0,
					'   ': 0,
					'    ': 0,
					'     ': 0,
					'      ': 0,
					'       ': 0,
					'        ': 0,
					'         ': 0,
				},
				{ ' ': '기타', '  ': 0, '   ': 0, '    ': 0, '     ': 0, '      ': 0, '       ': 0, '        ': 0, '         ': 0 },
				{},
				{ ' ': '솔루션 형태별 통계자료 :' },
				{
					' ': 'List',
					'  ': '21-10-21',
					'   ': '21-10-22',
					'    ': '21-10-23',
					'     ': '21-10-24',
					'      ': '21-10-25',
					'       ': '21-10-26',
					'        ': '21-10-27',
					'         ': 'Sum',
				},
				{ ' ': '자체개발', '  ': 0, '   ': 1, '    ': 0, '     ': 1, '      ': 0, '       ': 0, '        ': 0, '         ': 2 },
				{ ' ': '서비스 구매', '  ': 0, '   ': 0, '    ': 0, '     ': 0, '      ': 0, '       ': 0, '        ': 0, '         ': 0 },
				{ ' ': '서비스 임대', '  ': 0, '   ': 1, '    ': 0, '     ': 0, '      ': 0, '       ': 0, '        ': 0, '         ': 1 },
				{ ' ': '서비스 대행', '  ': 0, '   ': 0, '    ': 0, '     ': 0, '      ': 0, '       ': 0, '        ': 0, '         ': 0 },
				{
					' ': '필요하지만 사용하고 있지 않다',
					'  ': 0,
					'   ': 0,
					'    ': 0,
					'     ': 0,
					'      ': 0,
					'       ': 0,
					'        ': 0,
					'         ': 0,
				},
				{},
				{ ' ': '요구기능별 통계자료 :' },
				{
					' ': 'List',
					'  ': '21-10-21',
					'   ': '21-10-22',
					'    ': '21-10-23',
					'     ': '21-10-24',
					'      ': '21-10-25',
					'       ': '21-10-26',
					'        ': '21-10-27',
					'         ': 'Sum',
				},
				{
					' ': '제택 근무가 가능한 전화상담 시스템',
					'  ': 0,
					'   ': 1,
					'    ': 0,
					'     ': 1,
					'      ': 0,
					'       ': 0,
					'        ': 0,
					'         ': 2,
				},
				{
					' ': '설문 및 상담에 대한 자유로운 항목 구성 및 확장성',
					'  ': 0,
					'   ': 0,
					'    ': 0,
					'     ': 0,
					'      ': 0,
					'       ': 0,
					'        ': 0,
					'         ': 0,
				},
				{
					' ': '예약 상세 설정(예외일시 설정, 시간대별 인원 설정, 분단위 세부 시간 설정 등)',
					'  ': 0,
					'   ': 1,
					'    ': 0,
					'     ': 0,
					'      ': 0,
					'       ': 0,
					'        ': 0,
					'         ': 1,
				},
				{
					' ': '방문시 비대면 예약확인 및 상담신청',
					'  ': 0,
					'   ': 0,
					'    ': 0,
					'     ': 0,
					'      ': 0,
					'       ': 0,
					'        ': 0,
					'         ': 0,
				},
				{
					' ': '방문, 예약, 상담, 상담대기 현황에 대한 실시간 대시보드',
					'  ': 0,
					'   ': 0,
					'    ': 0,
					'     ': 0,
					'      ': 0,
					'       ': 0,
					'        ': 0,
					'         ': 0,
				},
				{
					' ': '전화상담, 설문조사, 방문예약, 상담이력을 통합관리하는 통계 시스템',
					'  ': 0,
					'   ': 0,
					'    ': 0,
					'     ': 0,
					'      ': 0,
					'       ': 0,
					'        ': 0,
					'         ': 0,
				},
				{ ' ': '기타', '  ': 0, '   ': 0, '    ': 0, '     ': 0, '      ': 0, '       ': 0, '        ': 0, '         ': 0 },
			]
		}
	},
	methods: {
		loginData() {
			this.login = this.$store.state.meData.role.name
		},
		// Datepicker 날짜 disable

		termCampaign(val) {
			let start = this.$moment(this.campStartpicker.date).format('YYMMDD')
			val = this.$moment(val).format('YYMMDD') > start
			return val
		},
		disabledata() {
			this.datedisable = false
		},

		clickExport5() {
			document.getElementById('campaign-download').click()
		},

		setGroupData() {
			this.$store.state.loading = true
			this.$store
				.dispatch('groups')
				.then(res => {
					// groups data 저장
					this.groups = res.data.groups
					res.data.groups.forEach(o => {
						if (o.isuse === 0 || o.isuse === 1) {
							this.sel.items.push(o.groupcode)
						}
					})
					// if (this.$store.state.meData.role.name === 'partner') {
					this.sel.value = this.$store.state.meData.group.groupcode

					this.reservedays(this.sel.value)
					this.campainCount(this.sel.value)

					setTimeout(() => {
						this.inputCampExcelData()
					}, 500)
				})
				.catch(() => {})
		},
		setTime() {
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			// 기간별 날짜 셋팅

			this.campStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.campEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
		},

		campaignRangeCount() {
			this.campStartpicker.menu = false
			this.campEndpicker.menu = false
			this.campainCount(this.sel.value)
			if (this.selCampaign.value) {
				this.changeCampaign()
			}
			setTimeout(() => {
				this.inputCampExcelData()
			}, 500)
		},
		reservedays(groupcode) {
			const data = {
				groupcode: groupcode,
				status: 1,
			}
			this.$store.dispatch('reservedays', data).then(res => {
				let items = []
				let code = []
				if (res.data.reservedays[0]) {
					res.data.reservedays.forEach(e => {
						if (e.business) {
							if (e.business.id === this.selData) {
								items.push(e.title)
								code.push(e.code)
							}
						}
					})
					this.selCampaign.items = items
					this.selCampaign.code = code
					this.selCampaign.value = items[0]
				} else {
					this.selCampaign.items = items
				}
				this.reservedayItem = res.data.reservedays
				this.changeCampaign()
				this.$store.state.loading = false
			})
		},
		clickDeleteBtn() {},
		clickEditBtn() {},

		changeCampaign() {
			this.$store.state.loading = true
			let selvalue = this.selCampaign.items.findIndex(e => e === this.selCampaign.value)
			if (selvalue !== -1) {
				const data = {
					groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
					sdate: this.campStartpicker.date,
					edate: this.campEndpicker.date,
					code: this.selCampaign.code[selvalue],
				}
				this.$store
					.dispatch('campainListCount', data)
					.then(res => {
						this.campaigns = res.data.campainListCount.count
						this.campaigns.forEach(element => {
							element.class = 'max-width-table'
						})
						this.inputCampExcelData()
						this.$store.state.loading = false
					})
					.catch(() => {
						alert('오류가 발생하였습니다. & 설문이 없는 거점 홍보 입니다.')
						this.$store.state.loading = false
					})
			} else {
				this.campaigns = []
			}
		},
		campainCount(groupcode) {
			const data = {
				groupcode: groupcode,
				sdate: this.campStartpicker.date,
				edate: this.campEndpicker.date,
			}
			this.$store
				.dispatch('campainCount', data)
				.then(res => {
					this.campDatatable.headers = res.data.campainCount.count.headers
					this.campDatatable.items = res.data.campainCount.count.items
				})
				.catch(() => {})
		},
		test() {
			document.getElementById('testdown').click()
		},
		inputCampExcelData() {
			let excelDatas = []
			let excelTitle = { ' ': '설문항목별 통계자료 :' }
			let excelSet = {}
			let excelHeader = {}
			let headBlank = ''
			/// col 기준 값에 빈칸 삽입,캠페인 통계 헤더 text 삽입
			this.campDatatable.headers.forEach(e => {
				headBlank = headBlank + ' '
				excelSet[headBlank] = ' '
				excelHeader[headBlank] = e.text
			})
			excelDatas.push(excelSet)
			excelDatas.push(excelTitle)
			// excelDatas.push(excelHeader)
			/// 캠페인 통계 아이템 삽입

			// 항목별 아이템 삽입
			if (this.selCampaign.value) {
				this.campaigns.forEach(e => {
					excelDatas.push({})
					let itemTitle = { ' ': e.title + '별 통계자료 :' }
					excelDatas.push(itemTitle)
					excelDatas.push(excelHeader)
					e.items.forEach(item => {
						let campCountItem = {}
						let headBlank = ''
						for (var key in item) {
							headBlank = headBlank + ' '
							campCountItem[headBlank] = item[key]
						}
						excelDatas.push(campCountItem)
					})
				})
			}
			this.dataForExcel = excelDatas
		},
	},
}
</script>
<style lang="scss">
.exportAlign {
	text-align: right;
}
.sort_lay {
	.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
		width: 100%;
	}
}
</style>
