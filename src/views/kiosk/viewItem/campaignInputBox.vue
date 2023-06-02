<template>
	<div>
		<div class="wrapper">
			<!-- 날짜 선택 --------- start -->
			<v-layout align-center class="header_search">
				<v-layout class="search_wrap">
					<v-flex md2 sm3 xs12>
						<txtField class="search_box" v-model="search_project" :txtField="search" @enter="InputBoxes_call()"></txtField>
					</v-flex>
					<!-- <v-layout justify-end>
						<v-btn class="search_btn" color="#5d19ff" @click="InputBoxes_call()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
					</v-layout> -->
				</v-layout>
			</v-layout>
			<!-- 날짜 선택 ----------- end -->

			<!-- 서브 헤더 --------- start -->
			<v-layout wrap class="mt-5" align-center>
				<v-icon color="#9D9DB7">
					<!-- mdi-magnify -->
					mdi-circle-small
				</v-icon>
				<span class="sub_header">문항 관리 </span>
			</v-layout>
			<!-- 서브 헤더 ----------- end -->

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12>
					<datatable
						:datatable="table.datatable"
						class="tbl-type01"
						:detailClick="detailClick"
						excelUseYn="true"
						:search="search_project"
						excelType="inputBox"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>
		<v-layout justify-end align-items-center class="">
			<btn
				:btn="addBtn"
				:class="'small_action_btn  new_pj'"
				:style="`background-color:${$store.state.PointColor2}`"
				:btn_txt="'신규등록'"
				@click="detailClick()"
			></btn>
		</v-layout>

		<!-- 사용자 생성/수정 alert ------ start -->
		<QusDialog
			:setdialog="edit_dialog"
			:validation_chceck="validation_chceck"
			:add_project="add_project"
			:delete_project="delete_project"
		/>
		<!-- 사용자 생성/수정 alert ------ end -->
		<!-- 저장 확인 팝업 -->

		<download-excel
			class="btn btn-default"
			:id="reserveUsersInfo.phone"
			:data="reserveUsersInfo.datatable.items"
			style="display:none"
			:fields="reserveUsersInfo.json_fields"
			type="text/csv;charset=utf8"
			worksheet="My Worksheet"
			:name="reserveUsersInfo.name + '_' + reserveUsersInfo.phone"
		>
		</download-excel>
	</div>
</template>

<script>
import { btn, datatable, txtField } from '@/components/index.js'
import html2canvas from 'html2canvas'
import downloadExcel from 'vue-json-excel'
import QusDialog from './QusDialog'
export default {
	components: { btn, downloadExcel, datatable, txtField, QusDialog },
	data() {
		return {
			searchActive: false,
			qusDatas: [
				{
					title: '문항유형',
					selectBox: {
						value: '객관식(단일선택)',
						disable: false,
						errorMessage: '',
						hideDetail: true,
						items: ['객관식(단일선택)', '객관식(복수선택)', '주관식', '파일업로드(jpg, png, pdf)'],
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
						placeholder: '유형',
					},
					radio: true,
				},
				{
					title: '분류(필수)',
					txtfield: {
						value: '',
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '직접입력',
					},
					selectBox: {
						value: '',
						disable: false,
						errorMessage: '',
						hideDetail: true,
						items: [],
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
						placeholder: '유형',
					},
				},
				{
					title: '질문(필수)',
					txtfield: {
						value: '',
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '메인 질문내용',
					},
				},
				{
					title: '설명(선택)',
					txtfield: {
						value: '',
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '질문내용 보충 텍스트',
					},
				},
				{
					title: '보기',
					lists: [
						{
							type: 'text',
							value: '',
							required: true,
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
						},
						{
							type: 'text',
							value: '',
							required: true,
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
						},
						{
							type: 'text',
							value: '',
							required: true,
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
						},
					],
				},
			],
			dateChice: true,
			datedisable: true,
			// --- 데이터 테이블 데이터 --``
			table: {
				datatable: {
					headers: [
						{ text: '프로젝트명', value: 'project_name' },
						{ text: '문항명', value: 'inputBox_name' },
						{ text: '생성일', value: 'created_at' },
						{ text: '최종 수정일', value: 'updated_at' },
						{ text: '적용 캠페인', value: 'reserveday' },
						{ text: '진행기간  ', value: 'range' },
						{ text: '비고', align: 'center', value: 'etc_detail', width: '10%' },
					],
					items: [],
					hidedefaultfooter: false,
					noweditting: '',
					// title: x.name,
					onlyAgree: false,
					// inputboxId: x.id,
				},
				filter: [],
				json_fields: {},
			},

			// --- 삭제 모달 ---

			reserveUsersInfo: {
				dialog: false,
				reserveList: [],
				datatable: {
					headers: [],
					items: [],
				},
				name: '',
				phone: '',
				json_fields: {},
			},

			// 날짜/검색 데이터
			searchsel: { value: '오늘', errorMessage: '', hideDetail: true, items: ['오늘', '이번 주', '이번 달'], outlined: true },
			searchsel_type: { value: '이름', errorMessage: '', hideDetail: true, items: ['이름', '연락처'], outlined: true },
			search_project: '',
			search: {
				placeholder: '검색어를 입력하세요.',
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},

			termStartpicker: {
				// datePicker
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},

			termEndpicker: {
				// datePicker
				date: this.$moment().format('YYYY-MM-DD'),
				errorMessage: '',
				class: 'whiteBack defalut-date-picker-setting',
				menu: false,
			},

			edit_dialog: {
				// 수정/추가 다이어로그
				dialog: false,
				type: 'create',
				id: '',
				items: [
					//0
					{
						title: '아이디',
						id: 'email_name',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '아이디를 입력하세요.',
						},
						required: true,
					},
					//1
					{
						title: '이름',
						id: 'username',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '15',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '이름을 입력하세요',
						},
						required: false,
					},
					//2
					{
						title: '휴대폰 번호',
						id: 'phone',
						value: '',
						type: 'txtfield',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '휴대폰 번호를 입력하세요',
						},
						required: true,
					},
					//3
					{
						title: '권한',
						id: 'auth',
						value: '',
						type: 'selectBox',
						selectBox: {
							value: '',
							disable: false,
							errorMessage: '',
							hideDetail: true,
							items: ['슈퍼마스터', '분양소장', '분양기획'],
							inputItems: [],
							outlined: true,
							class: 'small_font bizInput',
							placeholder: '권한을 선택하세요.',
						},
						required: false,
					},
					//4
					{
						title: '프로젝트',
						id: 'project',
						value: '',
						type: 'selectBox',
						selectBox: {
							value: '',
							disable: false,
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							class: 'small_font bizInput',
							placeholder: '프로젝트를 선택하세요.',
						},
						btn: true,
						required: false,
					},
					//5
					{
						title: '상태',
						id: 'businesses',
						value: '',
						type: 'chips',

						chips: [],
						btn: true,
						required: false,
					},
				],
			},
			addBtn: {
				// 추가 버튼
				dark: true,
				width: 100,
			},
		}
	},

	created() {
		// this.$store.state.loading = true
		// this.first_InputBoxes_call()
	},
	watch: {
		edit_dialog: {
			deep: true,
			handler() {
				if (!this.edit_dialog.dialog) {
					if (this.searchActive) this.InputBoxes_call()
					else this.first_InputBoxes_call()
				}
			},
		},
	},
	methods: {
		first_InputBoxes_call() {
			this.$store.state.loading = true
			this.$store.dispatch('inputboxes_list', { name: '' }).then(res => {
				let inputBoxesData = res.data.inputBoxes
				inputBoxesData.forEach(el => {
					el['inputBox_name'] = el.name
					el['range'] = true
					el['sdate'] = el.reservedays[0] ? el.reservedays[0].sdate : el.events[0] ? el.events[0].start : '-'
					el['edate'] = el.reservedays[0] ? el.reservedays[0].edate : el.events[0] ? el.events[0].end : '-'
					for (let index = 0; index < el.events.length; index++) {
						const event = el.events[index]
						el['reservedays'].push(event)
					}
					if (el.business !== null) {
						el['project_name'] = el.business.title
					}
				})
				this.set_table_data(inputBoxesData)
				this.$store.state.loading = false
			})
		},
		InputBoxes_call() {
			let variable = {
				name: this.search_project,
			}

			this.$store.state.loading = true
			this.$store
				.dispatch('inputboxes_list', variable)
				.then(res => {
					this.searchActive = true
					let inputBoxesData = res.data.inputBoxes
					inputBoxesData.forEach(el => {
						el['inputBox_name'] = el.name
						el['range'] = true
						el['sdate'] = el.reservedays[0] ? el.reservedays[0].sdate : el.events[0] ? el.events[0].start : '-'
						el['edate'] = el.reservedays[0] ? el.reservedays[0].edate : el.events[0] ? el.events[0].end : '-'

						for (let index = 0; index < el.events.length; index++) {
							const event = el.events[index]
							el['reservedays'].push(event)
						}
					})
					this.set_table_data(inputBoxesData)
					this.$store.state.loading = false
				})
				.catch(() => {
					this.$store.state.loading = false
				})
		},
		set_table_data(inputBoxesData) {
			let headers = [
				{ text: '프로젝트명', value: 'project_name' },
				{ text: '문항명', value: 'inputBox_name' },
				{ text: '생성일', value: 'created_at' },
				{ text: '최종 수정일', value: 'updated_at' },
				{ text: '적용 캠페인', value: 'reserveday' },
				{ text: '진행기간  ', value: 'range' },
				{ text: '비고', align: 'center', value: 'etc_detail', width: '10%' },
			]
			let tableItems = {
				datatable: {
					headers: headers,
					items: inputBoxesData,
					// hidedefaultfooter: false,
					noweditting: '',
					title: '테스트 타이틀',
					onlyAgree: false,
					// inputboxId: x.id,
				},
				// json_fields: exportField,
			}
			this.table = tableItems
		},
		saveImg(fileName) {
			const canvas = this.$refs.qaLists
			html2canvas(canvas).then(canvas => {
				var Image = canvas.toDataURL('image/jpeg')
				this.downloadURL(Image, fileName + '.jpg')
			})
		},
		downloadURL(url, name) {
			var link = document.createElement('a')
			link.download = name
			link.href = url
			document.body.appendChild(link)
			link.click()
			this.$store.state.loading = false
			this.imgInfo = false
		},

		disabledata() {
			this.datedisable = false
		},
		//엑셀 저장
		clickExport(table) {
			this.table.datatable.items.forEach(element => {
				element.phone = element.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
			})
			document.getElementById(table.datatable.title).click()
		},
		// 셀렉트 박스 선택된 값 테이블 적용

		async setdate() {
			let today = new Date()
			let before = new Date(today.setDate(today.getDate() - 7))
			let after = new Date(today.setDate(today.getDate() + 7))
			this.termStartpicker.date = this.$moment(before).format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment(after).format('YYYY-MM-DD')
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
				this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment()
					.add(7, 'd')
					.format('YYYY-MM-DD')
			} else if (date === '이번 달') {
				this.termStartpicker.date = this.$moment()
					.startOf('month')
					.format('YYYY-MM-DD')
				this.termEndpicker.date = this.$moment()
					.endOf('month')
					.format('YYYY-MM-DD')
			}
		},

		select_type() {
			this.search_project = ''
		},
		detailClick(item) {
			if (item) {
				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'edit'
				this.edit_dialog.item = item
			} else {
				// 신규 생성
				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'create'
				this.edit_dialog.id = ''
				this.$store.state.questions = []
				this.dafalutActive('name')
				// this.dafalutActive('location')
				this.dafalutActive('locationType')
				this.dafalutActive('age')
				this.dafalutActive('sex')
				this.dafalutActive('qualification')
				this.dafalutActive('homeOwnership')
				this.dafalutActive('bankBook')
				this.dafalutActive('purpose')
				this.dafalutActive('subscribe')
				this.dafalutActive('floor')
				this.dafalutActive('houseAcreage')
			}
			this.edit_dialog.items[4].selectBox.items = this.able_projects()
		},
		dafalutActive(val) {
			let qusData = JSON.parse(JSON.stringify(this.qusDatas))
			if (val === 'name') {
				qusData[0].selectBox.value = '주관식'
				qusData[1].txtfield.value = '이름'
				qusData[2].txtfield.value = '고객님의 정확한 실명을 입력해주세요.'
			} else if (val === 'location') {
				qusData[0].selectBox.value = '주관식'
				qusData[1].txtfield.value = '지역'
				qusData[2].txtfield.value = '고객님의 현재 거주지역을 선택해 주세요.'
			} else if (val === 'age') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '나이'
				qusData[2].txtfield.value = '고객님의 연령대를 선택해 주세요.'
				const datas = ['20대', '30대', '40대', '50대', '60대 이상']
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						type: 'text',
						value: datas[index],
						required: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			} else if (val === 'sex') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '성별'
				qusData[2].txtfield.value = '고객님의 성별을 선택해 주세요.'
				const datas = ['남자', '여자']
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						type: 'text',
						value: datas[index],
						required: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			} else if (val === 'qualification') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '청약자격'
				qusData[2].txtfield.value = '고객님의 청약 자격을 선택해 주세요.'
				const datas = [
					'특별공급(기관추천)',
					'특별공급(이전기관)',
					'특별공급(다자녀가구)',
					'특별공급(신혼부부)',
					'특별공급(생애최초)',
					'특별공급(노부모부양)',
					'특별공급(국가유공자)',
					'특별공급(외국인)',
					'1순위(해당)',
					'1순위(기타)',
					'1순위',
					'2순위(해당)',
					'2순위(기타)',
					'2순위',
					'무순위',
				]
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						type: 'text',
						value: datas[index],
						required: true,
						maxlength: '255',
						outlined: true,
						readonly: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			} else if (val === 'homeOwnership') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '주택소유여부'
				qusData[2].txtfield.value = '고객님의 주택 소유여부를 선택해 주세요.'
				const datas = ['무주택', '유주택']
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						type: 'text',
						value: datas[index],
						required: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			} else if (val === 'bankBook') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '청약통장 보유여부'
				qusData[2].txtfield.value = '고객님의 청약통장 보유여부를 선택해 주세요.'
				const datas = ['있다', '없다']
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						type: 'text',
						value: datas[index],
						required: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			} else if (val === 'purpose') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '구매목적'
				qusData[2].txtfield.value = '고객님의 구매목적을 선택해 주세요.'
				const datas = ['투자', '실거주', '투자+실거주', '증여', '기타']
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						type: 'text',
						value: datas[index],
						required: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			} else if (val === 'subscribe') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '청약의사'
				qusData[2].txtfield.value = '고객님의 청약의사를 선택해 주세요.'
				const datas = ['있다', '없다', '고민중이다']
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						type: 'text',
						value: datas[index],
						required: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			} else if (val === 'floor') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '선호하는 층수'
				qusData[2].txtfield.value = '고객님의 선호하는 층수를 선택해 주세요.'
				const datas = ['1층', '저층(5층이하)', '중층(6-10층)', '기준층(11-20층)', '고층(21층 이상)', '테라스', '펜트하우스', '층수 무관']
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						type: 'text',
						value: datas[index],
						required: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			} else if (val === 'houseAcreage') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '선호하는 평형'
				qusData[2].txtfield.value = '고객님의 선호하는 평형를 선택해 주세요.'
				const datas = ['59A', '59B', '84A', '84B', '114A', '114B']
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						val: 'houseAcreage',
						type: 'text',
						value: datas[index],
						value2: null,
						required: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			} else if (val === 'locationType') {
				qusData[0].selectBox.value = '객관식(단일선택)'
				qusData[1].txtfield.value = '나의거주지역'
				qusData[2].txtfield.value = '고객님의 거주지역을 선택해 주세요.'
				const datas = [
					'서울시',
					'광명시',
					'수원시',
					'인천광역시',
					'울산시',
					'김포시',
					'전북시',
					'충주시',
					'고양시',
					'전남시',
					'청주시',
					'성남시',
					'전주시',
					'수도권이외',
				]
				const selectItmes = [
					'main_1',
					'main_2',
					'main_3',
					'main_4',
					'main_5',
					'main_6',
					'sub_1',
					'sub_2',
					'sub_3',
					'sub_4',
					'sub_5',
					'sub_6',
					'sub_7',
					'sub_etc',
				]
				let listsArray = []
				for (let index = 0; index < datas.length; index++) {
					listsArray.push({
						val: 'locationType',
						type: 'text',
						value: datas[index],
						value2: selectItmes[index],
						required: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					})
				}
				qusData[4].lists = listsArray
			}
			if (this.$store.state.questions.map(x => x.type).indexOf(val) === -1) {
				this.$store.state.questions.push({
					type: val,
					qusDatas: qusData,
				})
			} else {
				const index = this.$store.state.questions.map(x => x.type).indexOf(val)
				this.$store.state.questions.splice(index, 1)
			}
		},
		validation_chceck() {
			// 빈값 체크
			if (this.edit_dialog.items[0].value.length === 0) {
				return alert('아이디를 입력해주세요.')
			} else if (this.edit_dialog.items[1].value.length === 0) {
				return alert('이름을 입력해주세요.')
			} else if (this.edit_dialog.items[2].value.length === 0) {
				return alert('휴대폰 번호를 입력해주세요.')
			} else if (this.edit_dialog.items[3].selectBox.value.length === 0) {
				return alert('권한을 선택해주세요.')
			}
			this.sweetDialog.open = true
			if (this.edit_dialog.type === 'create') {
				this.sweetDialog.title = '사용자 생성'
				this.sweetDialog.content = `사용자를 생성합니다.`
			} else {
				this.sweetDialog.title = '사용자 정보 저장'
				this.sweetDialog.content = `변경된 내용을
저장합니다.`
			}
		},
		add_project() {
			// 프로젝트 추가
			if (this.edit_dialog.items[4].selectBox.value.length === 0) {
				return alert('프로젝트를 선택해주세요.')
			}
			let selected = JSON.parse(JSON.stringify(this.edit_dialog.items[4].selectBox.value))
			this.edit_dialog.items[5].chips.push(selected)
			this.edit_dialog.items[4].selectBox.items = this.able_projects()
			this.edit_dialog.items[4].selectBox.value = ''
		},
		delete_project() {
			// 프로젝트 삭제
			this.edit_dialog.items[4].selectBox.items = this.able_projects()
		},
		async create_user() {
			let role = ''

			if (this.edit_dialog.items[3].selectBox.value === '슈퍼마스터') {
				role = 1
			} else if (this.edit_dialog.items[3].selectBox.value === '분양소장') {
				role = 3
			} else if (this.edit_dialog.items[3].selectBox.value === '분양기획') {
				role = 4
			}

			let businesses = this.edit_dialog.items[5].chips.map(el => el.id)

			let variable = {
				email: `${this.edit_dialog.items[0].value}@xi.com`,
				username: this.edit_dialog.items[1].value,
				password: this.edit_dialog.items[0].value,
				role: role, // 3:partner  3: marketing
				confirmed: true,
				language: 'ko',
				phone: this.edit_dialog.items[2].value,
				businesses: businesses,
			}
			await this.$store
				.dispatch('createUser', variable)
				.then(async () => {
					this.$store.state.loading = true
					await this.first_InputBoxes_call()
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
				})
				.catch(() => {
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
				})
		},
		async update_user() {
			let role = ''

			if (this.edit_dialog.items[3].selectBox.value === '슈퍼마스터') {
				role = 1
			} else if (this.edit_dialog.items[3].selectBox.value === '분양소장') {
				role = 3
			} else if (this.edit_dialog.items[3].selectBox.value === '분양기획') {
				role = 4
			}

			let businesses = this.edit_dialog.items[5].chips.map(el => el.id)

			let variable = {
				id: this.edit_dialog.id,
				email: `${this.edit_dialog.items[0].value}@xi.com`,
				username: this.edit_dialog.items[1].value,
				role: role, // 3:partner  3: marketing
				confirmed: true,
				language: 'ko',
				phone: this.edit_dialog.items[2].value,
				businesses: businesses,
			}
			await this.$store
				.dispatch('updateUser', variable)
				.then(async () => {
					this.$store.state.loading = true
					await this.first_InputBoxes_call()
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
				})
				.catch(() => {
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
				})
		},

		able_projects() {
			// 팝업 - 프로젝트 셀렉트 박스 아이템 세팅

			let able = this.$store.state.businesses_lists.filter(
				el => this.edit_dialog.items[5].chips.findIndex(item => item.id === el.id) === -1,
			)

			let able_map = able.map(el => {
				return { value: { id: el.id, title: el.title }, text: el.title }
			})
			return able_map
		},
	},
}
</script>
<style lang="scss" scoped>
.wrapper {
	margin: 0px !important;
}
</style>
<style lang="scss">
.surveyChoice {
	font-size: 18px;
	font-weight: bold;
	margin-right: 10px;
}
.surveyTitle {
	font-size: 18px;
	font-weight: bold;
	margin-top: 20px;
}

.filterFlex {
	padding: 20px 20px 58px 0px;
}
.filterBox {
	background: white;
	height: 100%;
	border: 2px solid #e1e1e1;
	border-radius: 5px;
}
.filterHead {
	margin: 0px !important;
	padding: 14px;
	border-bottom: 1.5px solid #e1e1e1;
}
.filterLayout {
	padding: 14.8px;
	// border-bottom: 1.5px solid #e1e1e1;`
}
.checkboxLinebreak {
	line-break: anywhere;
}
.qaLists-dialog {
	opacity: 0;
	width: 100%;
	background-color: white !important;
}
</style>
