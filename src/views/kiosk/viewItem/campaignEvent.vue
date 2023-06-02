<template>
	<div>
		<div class="wrapper">
			<!-- 날짜 선택 --------- start -->
			<v-layout align-center class="header_search">
				<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2' : 'search_date_1'" lg2 md2 sm7 xs12>
					<DatepickerDialog :picker="termStartpicker" :disabledata="disabledata"></DatepickerDialog
				></v-flex>
				<span class="mx-1"> ~ </span>
				<v-flex :class="$vuetify.breakpoint.smAndDown ? 'my-2 ' : 'search_date_2'" lg2 md2 sm7 xs12>
					<DatepickerDialog :picker="termEndpicker" :disabledata="disabledata" :allowed_dates="termCustomer"></DatepickerDialog
				></v-flex>
				<v-layout class="search_wrap">
					<v-flex class="search_select ml-4" lg3 md3 sm3 xs12>
						<selectBox :sel="searchsel" @change="selectDays" :class="'searchSel'"></selectBox>
					</v-flex>
					<v-flex md2 sm3 xs12>
						<txtField class="search_box" v-model="search_project" :txtField="search"></txtField>
					</v-flex>
					<v-layout justify-end>
						<v-btn class="search_btn" color="#5d19ff" @click="events_call()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
						<v-btn class="search_btn" color="#5d19ff" @click="search_reset()">초기화</v-btn>
					</v-layout>
				</v-layout>
			</v-layout>
			<!-- 날짜 선택 ----------- end -->

			<!-- 서브 헤더 --------- start -->
			<v-layout wrap class="mt-5" align-center>
				<v-icon color="#9D9DB7">
					<!-- mdi-magnify -->
					mdi-circle-small
				</v-icon>
				<span class="sub_header">이벤트 관리 </span>
			</v-layout>
			<!-- 서브 헤더 ----------- end -->

			<!-- --- 데이터 테이블 -------- start -->
			<v-layout wrap>
				<!-- 테이블 -->
				<v-flex xs12>
					<datatable
						:search="search_project"
						:datatable="table.datatable"
						class="tbl-type01"
						:detailClick="detailClick"
						excelUseYn="true"
						@event_page="event_page"
						excelType="event"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>
		<v-layout justify-end align-items-center class="">
			<btn
				:btn="addBtn"
				:class="'small_action_btn new_pj'"
				:style="`background-color:${$store.state.PointColor2}`"
				:btn_txt="'신규등록'"
				@click="detailClick()"
			></btn>
		</v-layout>

		<!-- 이벤트 생성/수정 alert ------ start -->
		<edit-resereday-event-dialog :setdialog="edit_dialog" :validation_check="validation_check" />
		<!-- 이벤트 생성/수정 alert ------ start -->

		<!-- 저장 확인 팝업 -->
		<sweetAlert :dialog="sweetInfo" />
		<sweetAlert :dialog="sweetDialog" @click="clickSaveBtn()" />
		<QRDialog :setdialog="QRDialogData" />
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
import {
	btn,
	QRDialog,
	datatable,
	selectBox,
	txtField,
	DatepickerDialog,
	editReseredayEventDialog,
	sweetAlert,
} from '@/components/index.js'
import html2canvas from 'html2canvas'
import downloadExcel from 'vue-json-excel'
export default {
	components: { btn, QRDialog, downloadExcel, datatable, selectBox, txtField, DatepickerDialog, editReseredayEventDialog, sweetAlert },
	data() {
		return {
			dateChice: true,
			datedisable: true,
			// --- 데이터 테이블 데이터 --``
			table: {
				datatable: {
					headers: [
						{ text: '프로젝트명', value: 'project_name', width: '13%' },
						{ text: '이벤트명', value: 'title', width: '13%' },
						{ text: '문항명', value: 'camapign_relation', width: '13%' },
						{ text: '진행기간', value: 'range_event' },
						{ text: '상태', value: 'event_status', width: '10%' },
						{ text: '이벤트 정보', value: 'event_url' },
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
			QRDialogData: {
				code: '',
				title: '',
				dialog: false,
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
				dialog: false,
				title: '약간 관리 수정',
				imgFile: '',
				type: 'create',
				edit_item: null,
				items: [
					// 0
					{
						title: '프로젝트 선택',
						value: '',
						value2: '',
						disable: false,
						type: 'selectBox',
						selectBox: {
							value: '',
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							filter: true,
							returnObject: true,
							itemText: 'title',
							class: 'small_font bizInput',
						},
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							disable: true,
							errorMessage: '',
							autocomplete: 'off',
						},
					},

					// 1
					{
						title: '이벤트 제목',
						value: '',
						type: 'txtfield',
						txtfield: {
							placeholder: '예) 운정자이 시그니쳐 설문이벤트',
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
						},
						essential: true,
					},
					// 2
					{
						title: '메인이미지',
						value: '',
						type: 'fileinput',
						fileinput: {
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							readonly: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_메인이미지.png',
							},
						},
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							readonly: true,
							placeholder: '※ jpg,png / 500kb이하',
						},
					},
					// 3
					{
						title: '문항선택',
						type: 'selectBox',
						selectBox: {
							value: '',
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							filter: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_설문선택.png',
							},
							class: 'small_font bizInput',
						},
						essential: true,
					},
					// 4

					{
						title: '버튼 텍스트',
						value: '',
						type: 'txtfield',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							tooltip: {
								url: '/image/tooltip/4.방문예약_버튼텍스트.png',
							},
						},
					},
					// 5
					{
						title: '기간 설정',
						value: '',
						type: 'datePicker',

						startpicker: {
							// datePicker
							date: this.$moment().format('YYYY-MM-DD'),
							errorMessage: '',
							class: 'whiteBack defalut-date-picker-setting',
							menu: false,
						},

						endpicker: {
							// datePicker
							date: this.$moment().format('YYYY-MM-DD'),
							errorMessage: '',
							class: 'whiteBack defalut-date-picker-setting',
							menu: false,
						},

						essential: true,
					},
					// 6
					{
						title: '참여 인원 설정',
						value: 1000,
						type: 'radios',
						txtfield: {
							class: 'max_people',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							type: 'Number',
							max: 99999999,
							maxlength: 8,
							onlyNumber: true,
						},
						radios: {
							radioSelected: false,
							items: [
								{ label: '가능', value: true },
								{ label: '불가능', value: false },
							],
							color: '#202840',
						},
					},

					// 7
					{
						title: '참여 그룹 설정',
						type: 'excel',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							onlyNumber: true,
							autocomplete: 'off',
							readonly: true,
						},

						selectBox: {
							value: '',
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							filter: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_모집단.png',
							},
							class: 'small_font bizInput',
						},
					},
					// 8
					{
						title: '당첨 메시지',
						value: '[{상품명}]에 당첨되었습니다.',
						type: 'textarea',
					}, // 9
					{
						title: '낙첨 메시지',
						type: 'textarea',
						value: '아쉽게도 당첨되지 않았습니다.',
					},
					// 10
					{
						title: '알림톡 선택',
						value: '',
						disable: false,
						type: 'preview',
						selectBox: {
							value: '',
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							clearable: true,
							outlined: true,
							filter: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_모집단.png',
							},
							class: 'small_font bizInput',
						},
					},

					// 11
					{
						title: '완료 링크',
						value: 'https://pf.kakao.com/_IgBkj/friend',
						type: 'txtfield',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '형식 예: https://www.google.com',
							tooltip: {
								url: '/image/tooltip/3.캠페인_완료링크.png',
							},
						},
					},
				],
				datatable: {
					// 약관 다이어로그 데이터테이블
					headers: [
						{ text: '상품명', value: 'title_txtField' },
						{ text: '수량', value: 'number_txtField' },
						{ text: '비고', value: 'etc_capmaign', align: 'center', width: '260px' },
					],
					items: [],
					class: 'datatablehover3',
					hidedefaultfooter: true,
					itemPerPage: 100,
					page: 1,
					height: '39vh',
				},
				terms: {
					value: null,
					items: [],
					title: '',
					content: '',
					id: '',
					hideDetail: true,
					outlined: true,
				},
				failPrice: {
					value: '',
					apply: false,
				},
			},
			sweetInfo: {
				// 미입력 팝업
				open: false,
				title: '미입력 정보',
				content: `유형명을 입력해 주세요`,
				modalIcon: 'success',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},

			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '이벤트 정보 저장',
				content: `이벤트 내용을
저장합니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
			},

			addBtn: {
				// 추가 버튼
				dark: true,
				width: 100,
			},
		}
	},

	async created() {
		this.$store.state.loading = true
		await this.first_events_call()
		await this.getBusiness()
		await this.messages_call()
		await this.terms()

		this.$store.state.loading = false
	},
	computed: {},
	methods: {
		async first_events_call() {
			await this.$store
				.dispatch('events', {})
				.then(res => {
					let eventsData = res.data.events
					eventsData.forEach(el => {
						el['range_event'] = `${this.$moment(el.start).format('YYYY-MM-DD')} ~ ${this.$moment(el.end).format('YYYY-MM-DD')}`
						if (el.input_box) {
							el['camapign_relation'] = el.input_box.name
						}
						if (el.business) {
							el['project_name'] = el.business.title
						} else {
							el['project_name'] = ''
						}

						let date = this.$moment().format('YYYY-MM-DD')

						let beforeCheck = this.$moment(date).isBefore(this.$moment(el.start).format('YYYY-MM-DD'))
						let afterCheck = this.$moment(date).isAfter(this.$moment(el.end).format('YYYY-MM-DD'))
						if (beforeCheck) {
							el['event_status'] = '진행전'
						} else if (afterCheck) {
							el['event_status'] = '종료'
						} else {
							el['event_status'] = '진행중'
						}
					})
					this.set_table_data(eventsData)
				})
				.catch(() => {})
		},
		async search_reset() {
			this.$store.state.loading = true
			this.termStartpicker.date = this.$moment().format('YYYY-MM-DD')
			this.termEndpicker.date = this.$moment().format('YYYY-MM-DD')
			this.searchsel.value = '오늘'
			this.search_project = ''
			await this.first_events_call()
			this.$store.state.loading = false
		},
		events_call() {
			let variable = {
				created_at_gte: this.termStartpicker.date,
				created_at_lte: this.$moment(this.termEndpicker.date)
					.add(1, 'day')
					.format('YYYY-MM-DD'),
				title: this.search_project,
			}

			this.$store.state.loading = true
			this.$store
				.dispatch('events', variable)
				.then(res => {
					let eventsData = res.data.events

					eventsData.forEach(el => {
						el['range_event'] = `${this.$moment(el.start).format('YYYY-MM-DD')} ~ ${this.$moment(el.end).format('YYYY-MM-DD')}`
						if (el.input_box) {
							el['camapign_relation'] = el.input_box.name
						}

						let date = this.$moment().format('YYYY-MM-DD')

						let beforeCheck = this.$moment(date).isBefore(this.$moment(el.start).format('YYYY-MM-DD'))
						let afterCheck = this.$moment(date).isAfter(this.$moment(el.end).format('YYYY-MM-DD'))
						if (beforeCheck) {
							el['event_status'] = '진행전'
						} else if (afterCheck) {
							el['event_status'] = '종료'
						} else {
							el['event_status'] = '진행중'
						}
						el['project_name'] = el.business.title
					})

					this.set_table_data(eventsData)
					this.$store.state.loading = false
				})
				.catch(() => {
					this.$store.state.loading = false
				})
		},
		set_table_data(eventsData) {
			let headers = [
				{ text: '프로젝트명', value: 'project_name', width: '13%' },
				{ text: '이벤트명', value: 'title', width: '13%' },
				{ text: '문항명', value: 'camapign_relation', width: '13%' },
				{ text: '진행기간', value: 'range_event' },
				{ text: '상태', value: 'event_status', width: '10%' },
				{ text: '이벤트 정보', value: 'event_url' },
				{ text: '비고', align: 'center', value: 'etc_detail', width: '10%' },
			]
			let tableItems = {
				datatable: {
					headers: headers,
					items: eventsData,
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

		async getBusiness() {
			// 팝업 - 프로젝트 아이템 세팅용
			const data = {
				show: true,
			}
			await this.$store.dispatch('businesses_simple', data).then(res => {
				// let items = res.data.businesses.map(el => {
				// 	return { value: el.id, text: el.title }
				// })

				this.edit_dialog.items[0].selectBox.items = res.data.businesses
			})
		},

		async messages_call() {
			//  팝업 - 알림톡 선택 아이템 세팅
			this.$store.dispatch('messages', {}).then(res => {
				let items = res.data.messages.map(el => {
					return { value: el.id, text: el.tplCodeStr }
				})

				this.edit_dialog.items[10].selectBox.items = items
				this.edit_dialog.items[10].selectBox.inputItems = res.data.messages
			})
		},
		async terms() {
			const data = {
				show: true,
				stat: 1,
			}
			await this.$store.dispatch('terms', data).then(res => {
				this.edit_dialog.terms.items = res.data.terms
				this.edit_dialog.terms.value = res.data.terms[0]
				this.edit_dialog.terms.title = res.data.terms[0].title
				this.edit_dialog.terms.content = res.data.terms[0].content
				this.edit_dialog.terms.id = res.data.terms[0].id
			})
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
		async detailClick(item) {
			this.$store.state.uploadFileData.file = null
			if (item) {
				// 데이터 테이블 - 자세히보기 클릭

				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'edit'
				this.edit_dialog.id = item.id
				this.edit_dialog.edit_item = item

				if (item.term) {
					this.edit_dialog.terms.value = item.term
					this.edit_dialog.terms.title = item.term.title
					this.edit_dialog.terms.content = item.term.content
					this.edit_dialog.terms.id = item.term.id
				}

				this.edit_dialog.failPrice.value = item.failPrice
				this.edit_dialog.failPrice.apply = false
				this.edit_dialog.items[0].selectBox.value = item.business ? item.business : ''
				this.edit_dialog.items[0].value2 = item.business ? item.business.code : ''
				this.edit_dialog.items[1].value = item.title
				this.edit_dialog.items[2].value = item.eventImg ? item.eventImg.name : ''
				this.edit_dialog.items[3].selectBox.value = item.input_box ? item.input_box.id : ''
				this.edit_dialog.items[4].value = item.btnText
				this.edit_dialog.items[5].startpicker.date = this.$moment(item.start).format('YYYY-MM-DD')
				this.edit_dialog.items[5].endpicker.date = this.$moment(item.end).format('YYYY-MM-DD')
				this.edit_dialog.items[6].value = String(item.maxcount)
				this.edit_dialog.items[6].radios.radioSelected = item.duplicate ? true : false
				this.edit_dialog.items[7].value = item.accessPhones ? item.accessPhones : ''
				this.edit_dialog.items[7].selectBox.value = item.population ? item.population : '설정 해제'
				this.edit_dialog.items[8].value = item.winnerMessage
				this.edit_dialog.items[9].value = item.joinMessage

				console.log(item.endLink)
				this.edit_dialog.items[10].selectBox.value = item.message ? item.message.id : ''
				this.edit_dialog.items[11].value = item.endLink

				let table_items = []
				if (item.priceList) {
					item.priceList.forEach(el => {
						table_items.push({
							number_txtField: {
								value: String(el.winnerNumber),
								txtfield: {
									maxlength: '255',
									outlined: true,
									hideDetail: true,
									errorMessage: '',
									autocomplete: 'off',
								},
							},
							title_txtField: {
								value: el.product,
								txtfield: {
									maxlength: '255',
									outlined: true,
									hideDetail: true,
									errorMessage: '',
									autocomplete: 'off',
								},
							},

							etc_capmaign: el.useYn,
						})
					})
				}

				this.edit_dialog.datatable.items = table_items
			} else {
				// 신규 생성
				this.edit_dialog.dialog = true
				this.edit_dialog.type = 'create'
				this.edit_dialog.id = ''
				this.edit_dialog.edit_item = null
				this.edit_dialog.items[0].value2 = ''
				this.edit_dialog.terms.value = this.edit_dialog.terms.items[0]
				this.edit_dialog.terms.title = this.edit_dialog.terms.items[0].title
				this.edit_dialog.terms.content = this.edit_dialog.terms.items[0].content
				this.edit_dialog.terms.id = this.edit_dialog.terms.items[0].id
				this.edit_dialog.failPrice.value = ''
				this.edit_dialog.failPrice.apply = false

				this.edit_dialog.items.forEach(element => {
					if (element.type === 'txtfield') {
						if (element.title === '완료 링크') element.value = 'https://pf.kakao.com/_IgBkj/friend'
						else element.value = ''
					} else if (element.type === 'selectBox') {
						element.selectBox.value = ''
					} else if (element.type === 'fileinput') {
						element.value = ''
					} else if (element.type === 'datePicker') {
						element.startpicker.date = this.$moment().format('YYYY-MM-DD')
						element.endpicker.date = this.$moment().format('YYYY-MM-DD')
					} else if (element.type === 'radios') {
						element.value = '1000'
						element.radios.radioSelected = false
					} else if (element.type === 'radios_group') {
						element.value = ''
						element.radios.radioSelected = 'kakao'
					} else if (element.type === 'excel') {
						element.value = ''
						element.selectBox.value = ''
					} else if (element.type === 'preview') {
						element.value = ''
						element.selectBox.value = ''
					} else if (element.type === 'textarea') {
						if (element.title === '낙첨 메시지') element.value = '아쉽게도 당첨되지 않았습니다.'
						else element.value = '[{상품명}]에 당첨되었습니다.'
					}
				})
				this.edit_dialog.datatable.items = []
			}
			// this.edit_dialog.items[4].selectBox.items = this.able_projects()
		},
		validation_check() {
			// 빈값 체크
			let ok = true
			if (!this.edit_dialog.items[0].selectBox.value) {
				this.sweetInfo.content = `프로젝트를 선택해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[1].value) {
				this.sweetInfo.content = `이벤트 제목을 입력해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[2].value) {
				this.sweetInfo.content = `메인이미지를 등록해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[4].value) {
				this.sweetInfo.content = `버튼 텍스트를 입력해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[6].value) {
				this.sweetInfo.content = `참여인원을 입력해 주세요`
				ok = false
			} else if (!this.edit_dialog.items[10].selectBox.value) {
				this.sweetInfo.content = `알림톡을 선택해 주세요`
				ok = false
			}
			let num = 0
			for (let i = 0; i < this.edit_dialog.datatable.items.length; i++) {
				if (this.edit_dialog.datatable.items[i].etc_capmaign) {
					num = num + Number(this.edit_dialog.datatable.items[i].number_txtField.value)
				}
			}
			if (this.edit_dialog.items[6].value < num) {
				this.sweetInfo.title = `잘못된 입력`
				this.sweetInfo.content = `참여인원보다 상품수량이 많습니다.`
				ok = false
			}

			if (!ok) {
				return (this.sweetInfo.open = true)
			}
			// 빈값 없음
			this.sweetDialog.open = true
			if (this.edit_dialog.type === 'create') {
				this.sweetDialog.title = '이벤트 저장'
				this.sweetDialog.content = `이벤트 정보를
저장합니다`
			}
		},

		clickSaveBtn() {
			this.$store.state.loading = true

			if (this.edit_dialog.id) {
				if (this.$store.state.uploadFileData.file) {
					// 업데이트 - 파일 업로드
					this.$store
						.dispatch('upload', { file: this.$store.state.uploadFileData.file })
						.then(res => {
							this.updateEvent(this.edit_dialog.id, res)
						})
						.catch(() => {
							this.$store.state.loading = false
						})
					this.updateEvent()
				} else {
					// 업데이트 - 파일 업로드 없이
					this.updateEvent(this.edit_dialog.id)
				}
			} else {
				if (this.$store.state.uploadFileData.file) {
					// 생성 - 파일 업로드
					this.$store
						.dispatch('upload', { file: this.$store.state.uploadFileData.file })
						.then(res => {
							this.createEvent(res)
						})
						.catch(() => {
							this.$store.state.loading = false
						})
				} else {
					// 생성 - 파일 업로드 없이
					this.createEvent()
				}
			}
		},
		async createEvent(imageData) {
			// 캠페인 생성

			let price_items = []
			this.edit_dialog.datatable.items.forEach(el => {
				price_items.push({
					product: el.title_txtField.value,
					winnerNumber: Number(el.number_txtField.value),
					useYn: el.etc_capmaign,
				})
			})
			// console.log(price_items)
			const data = {
				title: this.edit_dialog.items[1].value,
				start: new Date(this.edit_dialog.items[5].startpicker.date),
				end: new Date(this.edit_dialog.items[5].endpicker.date),
				maxcount: Number(this.edit_dialog.items[6].value),
				input_box: this.edit_dialog.items[3].selectBox.value === '' ? null : this.edit_dialog.items[3].selectBox.value,
				duplicate: this.edit_dialog.items[6].radios.radioSelected,
				status: 1,
				endLink: this.edit_dialog.items[11].value,
				population:
					this.edit_dialog.items[7].selectBox.value && this.edit_dialog.items[7].selectBox.value !== '설정 해제'
						? this.edit_dialog.items[7].selectBox.value
						: null,
				accessPhones: this.edit_dialog.items[7].value ? this.edit_dialog.items[7].value : null,
				btnText: this.edit_dialog.items[4].value,
				business: this.edit_dialog.items[0].selectBox.value.id,

				//
				failPrice: this.edit_dialog.failPrice.apply ? this.edit_dialog.failPrice.value : '',
				joinMessage: this.edit_dialog.items[9].value,
				winnerMessage: this.edit_dialog.items[8].value,
				priceList: price_items,
				message: this.edit_dialog.items[10].selectBox.value,
				term: this.edit_dialog.terms.id,
			}

			if (this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.eventImg = imageData.data.multipleUpload[0].id
			} else if (this.$store.state.uploadFileData.file && !this.$store.state.uploadFileQrlogo.file) {
				data.eventImg = imageData.data[0].id
			}
			data.loginType = 'phone'
			await this.$store
				.dispatch('createEvent', data)
				.then(() => {
					this.$store.state.uploadFileData.file = null
					// 추가할 reservday group 없음
					this.$store.state.loading = false
					this.first_events_call()
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
				})
				.catch(() => {
					alert('생성 허용치를 초과하였습니다.')
					this.$store.state.loading = false
					this.sweetDialog.open = true
					this.edit_dialog.dialog = false
				})
		},
		async updateEvent(id, imageData) {
			let price_items = []
			this.edit_dialog.datatable.items.forEach(el => {
				// if (el.new || el.apply) {÷
				price_items.push({
					product: el.title_txtField.value,
					winnerNumber: Number(el.number_txtField.value),
					useYn: el.etc_capmaign,
				})
				// } else {
				// 	price_items.push(this.edit_dialog.edit_item.priceList[index])
				// }
			})
			const data = {
				id: id,
				title: this.edit_dialog.items[1].value,
				start: new Date(this.edit_dialog.items[5].startpicker.date),
				end: new Date(this.edit_dialog.items[5].endpicker.date),
				maxcount: Number(this.edit_dialog.items[6].value),
				input_box: this.edit_dialog.items[3].selectBox.value === '' ? null : this.edit_dialog.items[3].selectBox.value,
				duplicate: this.edit_dialog.items[6].radios.radioSelected,
				status: 1,
				endLink: this.edit_dialog.items[11].value,
				population:
					this.edit_dialog.items[7].selectBox.value && this.edit_dialog.items[7].selectBox.value !== '설정 해제'
						? this.edit_dialog.items[7].selectBox.value
						: null,
				accessPhones: this.edit_dialog.items[7].value ? this.edit_dialog.items[7].value : null,
				btnText: this.edit_dialog.items[4].value,
				business: this.edit_dialog.items[0].selectBox.value.id,

				failPrice: this.edit_dialog.failPrice.apply ? this.edit_dialog.failPrice.value : this.edit_dialog.edit_item.failPrice,
				joinMessage: this.edit_dialog.items[9].value,
				winnerMessage: this.edit_dialog.items[8].value,
				priceList: price_items,
				message: this.edit_dialog.items[10].selectBox.value,
				term: this.edit_dialog.terms.id,
			}

			if (this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.QRlogo = imageData.data.multipleUpload[1].id
			} else if (this.$store.state.uploadFileData.file && !this.$store.state.uploadFileQrlogo.file) {
				data.eventImg = imageData.data[0].id
			}
			await this.$store
				.dispatch('updateEvent', data)
				.then(() => {
					this.$store.state.uploadFileData.file = null
					// 추가할 reservday group 없음
					this.$store.state.loading = false
					this.first_events_call()
					this.edit_dialog.dialog = false
					this.sweetDialog.open = false
				})
				.catch(() => {
					alert('생성 허용치를 초과하였습니다.')
					this.$store.state.loading = false
					this.sweetDialog.open = true
					this.edit_dialog.dialog = false
				})
		},

		event_page(item, type) {
			// 데이터 테이블 캠페인 URL 클릭

			if (type === 'event_url_QR') {
				window.open(process.env.VUE_APP_CUSTOMER_URL + '/reserve_event/' + item.code)
			} else if (type === 'event_QR') {
				this.QRDialogData.dialog = true
				this.QRDialogData.code = process.env.VUE_APP_CUSTOMER_URL + '/reserve_event/' + item.code
				this.QRDialogData.title = item.title
			} else if (type === 'event_url_url') {
				window.navigator.clipboard.writeText(process.env.VUE_APP_CUSTOMER_URL + '/reserve_event/' + item.code).then(() => {
					this.sweetInfo.open = true
					this.sweetInfo.title = '복사 완료'
					this.sweetInfo.content = `ctrl + v로 url을 확인하세요.`
				})
			}
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
