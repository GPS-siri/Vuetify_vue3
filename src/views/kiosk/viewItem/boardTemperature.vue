<template>
	<div>
		<!-- <breadcrumbs title="방문예약 관리" :pageNavi="[{ text: 'HOME' }, { text: 'CONTROL' }, { text: 'Reservation' }]" /> -->
		<div :class="$vuetify.breakpoint.smAndDown ? '' : 'wrapper'">
			<!-- --- 등록 버튼 --- -->
			<v-layout>
				<btn btn_txt="생성" :btn="addBtn" @click="clickAddBtn" v-if="showAdd" />
				<v-spacer />
				<!-- <v-flex xs2 v-if="$store.state.meData.role.name !== 'partner'"
					><selectBox v-if="sel.items != []" :sel="sel" @change="applyTable"
				/></v-flex> -->
			</v-layout>
			<!-- --- 데이터 테이블 --- -->
			<v-layout wrap>
				<v-flex class="mt-4 " lg6 xs12>
					<!-- v-if="editmodal.dialog"  -->
					<editModalreserve
						:setdialog="editmodal"
						:clickSaveBtn="clickSaveBtn"
						:reserveAllow="reserveAllow"
						:reserveAllow2="reserveAllow2"
						:setStratRange="setStratRange"
						:setNotimes="setStratRange"
						:changeCommon="changeCommon"
						:alertModal="SetDialogAlertModal"
						:cancelBack="cancelBack"
					/>
				</v-flex>

				<v-flex class="px-4" :lg6="editmodal.dialog" :lg12="!editmodal.dialog">
					<datatable :datatable="datatable" class="tbl-type01 sort_lay" :clickEditBtn="clickEditBtn" :clickDeleteBtn="clickDeleteBtn">
					</datatable>
				</v-flex>
			</v-layout>
		</div>

		<alertModal :setdialog="alertModal" :clickDeleteBtnModal="deleteAccount" />
	</div>
</template>

<script>
import { datatable, btn, alertModal, editModalreserve } from '@/components/index.js'
import changeTime from '../../../utils/timeRange2.js'
export default {
	components: {
		datatable,
		btn,
		alertModal,
		editModalreserve,
	},
	data() {
		return {
			// --- 데이터 테이블 데이터 --``
			datatable: {
				headers: [
					{ text: '사업지명', value: 'title' },
					{ text: '상담사URL', sortable: false, value: 'counseler' },
					{ text: '사업지URL', sortable: false, value: 'code' },
					{ text: '동반고객URL', sortable: false, value: 'codeDirect' },
					{ text: '입장용 QR', sortable: false, value: 'enterQR' },
					{ text: '상담용 QR', sortable: false, value: 'counselQR' },
					{ text: '대기보드', sortable: false, value: 'board' },
					{ text: '이미지', sortable: false, value: 'mainimg' },
					{ text: '시작일', align: 'center', value: 'sdate' },
					{ text: '종료일', align: 'center', value: 'edate' },
					{ text: '최대예약', align: 'center', value: 'maxcount' },
					// { text: '예약알림', value: 'tplCode[0]' },
					// { text: '1일전알림', value: 'tplCode[1]' },
					{ text: '비고', width: '200', sortable: false, align: 'center', value: 'action' },
				],
				items: [],
				hidedefaultfooter: false,
				noweditting: '',
				breakpoint: false,
			},
			// --- 삭제 모달 ---
			alertModal: {
				dialog: false,
				text: '정말로 지우시겠습니까?',
			},
			// --- 수정, 등록 모달 ---
			editmodal: {
				dialog: false,
				title: '약간 관리 수정',
				imgFile: '',
				items: [
					{
						title: '대분류 지역',
						value: '',
						disable: false,
						sel: {
							value: '',
							errorMessage: '',
							hideDetail: false,
							items: ['서울', '경기', '충남', '충북', '강원도', '경북', '경남', '전북', '전남', '제주도'],
							inputItems: [],
							outlined: true,
						},
					},
					{
						title: '사업지 코드',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							disable: true,
						},
						essential: true,
					},
					{
						title: '사업지명',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							autocomplete: 'off',
						},
						essential: true,
					},

					{
						title: '메인이미지',
						value: '',
						fileinput: {
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							readonly: true,
						},
					},
					{
						title: '상담신청 사업지명',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							autocomplete: 'off',
						},
					},
					{
						title: '상담신청 이미지',
						value: '',
						fileinput: {
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							readonly: true,
						},
					},
					{
						title: '버튼 텍스트',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							autocomplete: 'off',
						},
					},
					{
						title: '시작일',
						value: '',
						picker: {
							menu: false,
							date: '',
							errorMessage: '',
							hideDetail: false,
							class: 'txtField',
						},
						essential: true,
					},
					{
						title: '종료일',
						value: '',
						picker: {
							menu: false,
							date: '',
							errorMessage: '',
							hideDetail: false,
							class: 'txtField',
						},
						essential: true,
					},

					// {
					// 	title: '방문예약알림',
					// 	value: '',
					// 	sel: {
					// 		value: '',
					// 		errorMessage: '',
					// 		hideDetail: false,
					// 		items: [],
					// 		outlined: true,
					// 	},
					// },
					// {
					// 	title: '1일전 알림',
					// 	value: '',
					// 	sel: {
					// 		value: '',
					// 		errorMessage: '',
					// 		hideDetail: false,
					// 		items: [],
					// 		outlined: true,
					// 	},
					// },
					// {
					// 	title: '취소알림',
					// 	value: '',
					// 	sel: {
					// 		value: '',
					// 		errorMessage: '',
					// 		hideDetail: false,
					// 		items: [],
					// 		outlined: true,
					// 	},
					// },
					// {
					// 	title: '상담신청',
					// 	value: '',
					// 	sel: {
					// 		value: '',
					// 		errorMessage: '',
					// 		hideDetail: false,
					// 		items: [],
					// 		outlined: true,
					// 	},
					// },
					// {
					// 	title: '내앞대기자',
					// 	value: '',
					// 	sel: {
					// 		value: '',
					// 		errorMessage: '',
					// 		hideDetail: false,
					// 		items: [],
					// 		outlined: true,
					// 	},
					// },
					// {
					// 	title: '대기알림',
					// 	value: '',
					// 	sel: {
					// 		value: '',
					// 		errorMessage: '',
					// 		hideDetail: false,
					// 		items: [],
					// 		outlined: true,
					// 	},
					// },
					// {
					// 	title: '상담석(호출)',
					// 	value: '',
					// 	sel: {
					// 		value: '',
					// 		errorMessage: '',
					// 		hideDetail: false,
					// 		items: [],
					// 		outlined: true,
					// 	},
					// },
					// {
					// 	title: '미처리',
					// 	value: '',
					// 	sel: {
					// 		value: '',
					// 		errorMessage: '',
					// 		hideDetail: false,
					// 		items: [],
					// 		outlined: true,
					// 	},
					// },
					// {
					// 	title: '온도 체크',
					// 	value: '',
					// 	sel: {
					// 		value: '',
					// 		errorMessage: '',
					// 		hideDetail: false,
					// 		items: [],
					// 		outlined: true,
					// 	},
					// },

					{
						title: '시간 범위',
						value: '',
						timeRange: {
							startRange: {
								value: '10:00',
								errorMessage: '',
								hideDetail: true,
								items: changeTime,
								outlined: true,
							},
							endRange: {
								value: '18:00',
								errorMessage: '',
								hideDetail: true,
								items: changeTime,
								outlined: true,
							},
							check: {
								class: 'sliceCheck',
								value: false,
								label: '시간단위',
								hideDetail: true,
							},
							timeSlice: {
								value: '',
								errorMessage: '',
								hideDetail: false,
								items: ['2분', '3분', '4분', '5분', '6분', '10분', '15분', '20분', '30분'],
								outlined: true,
								disable: true,
							},
						},
					},
					{
						title: '공통제외시간',
						maxtitle: '공통 Max Count',
						commonSet: true,
						selectBox: false,
						commonNotime: { value: '', errorMessage: '', hideDetail: false, items: [], outlined: true, autocomplete: 'off' },

						commonMaxconut: { value: '', errorMessage: '', hideDetail: false, items: [], outlined: true, autocomplete: 'off' },
						commonMaxconutTxt: {
							value: '',
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							onlyNumber: true,
							autocomplete: 'off',
						},
					},
					{
						title: '총 예약인원',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							disable: true,
							autocomplete: 'off',
						},
					},
					{
						title: 'Active 기간',
						notimetitle: '제외시간',
						maxtitle: '시간별 최대예약',
						value: '',
						// 제외 날짜
						pickerChip: {
							date: [],
							errorMessage: '',
							hideDetail: false,
							class: 'txtField',
							multiple: true,
							chips: [],
							nodaySetting: [],
							chipTxt: '',
						},
						// max count
						maxcount: {
							value: '',
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							onlyNumber: true,
							autocomplete: 'off',
						},
						/// 제외 시간 범위
						// 제외 시간
						selChip: {
							value: '',
							errorMessage: '',
							hideDetail: true,
							items: [],
							outlined: true,
							chips: [],
						},
					},
					{
						title: '설문선택',
						sel: {
							value: '',
							errorMessage: '',
							hideDetail: false,
							items: [],
							inputItems: [],
							outlined: true,
						},
						essential: true,
					},
					{
						title: '설문 타입',
						sel: {
							value: '',
							errorMessage: '',
							hideDetail: false,
							items: ['드래그', '슬라이드'],
							inputItems: [],
							outlined: true,
						},
						essential: true,
					},
					{
						title: '온도체크 설문',
						sel: {
							value: '',
							errorMessage: '',
							hideDetail: false,
							items: [],
							inputItems: [],
							outlined: true,
						},
					},
					{
						title: '완료 링크',
						value: 'https://pf.kakao.com/_IgBkj/friend',
						txtfield: {
							maxlength: '200',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							autocomplete: 'off',
						},
					},
					{
						title: '모집단',
						value: '',
						disable: false,
						sel: {
							value: '',
							errorMessage: '',
							hideDetail: false,
							items: [],
							inputItems: [],
							outlined: true,
						},
					},
					{
						title: '참여 허용된 전화번호',
						value: '',
						csvImport: false,
						area: {
							noresize: true,
							readonly: true,
							outlined: true,
							height: '5vh',
						},
					},
					{
						title: 'QR 로고',
						value: '',
						fileinput: {
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							readonly: true,
						},
					},
					{
						title: '브랜드 컬러',
						colorPicker: {
							title: '',
						},
						color: { color: '' },
						value: { value: this.$store.state.PointColor3 },
					},
					{
						title: '상담사 CommentTag',
						value: '',
						combobox: {},
					},
				],
			},
			//  active 날짜
			activedays: [],
			// --- 등록 버튼 ---
			addBtn: {
				class: '',
				width: '100',
				height: '38',
				dark: true,
				color: this.$store.state.PointColor2,
			},
			// 사업지 셀렉트 박스
			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			groups: [], // 그룹지 셀렉트박스를 위한 그룹지 데이터 저장
			inputBoxes: [], // 인풋박스 데이터 저장
			reservedaysData: [],

			SetDialogAlertModal: {
				dialog: false,
				reddot: true,
				text: '정말로 지우시겠습니까?',
				onceDone: false,
			},
			showAdd: true, // add 버튼 보이기
		}
	},
	created() {
		this.setGroupData()
		this.inputboxes()
		this.setNotime()
	},
	methods: {
		setStratRange() {
			this.setNotime()
			this.editmodal.items[12].pickerChip.chipTxt = ''
			// this.editmodal.items[12].pickerChip.date = []
			// this.editmodal.items[12].pickerChip.chips = []
			// this.editmodal.items[12].selChip.chips = []
			this.editmodal.items[12].selChip.chips.forEach(e => {
				e.noTime = []
			})
		},
		setGroupData() {
			// this.$store
			// 	.dispatch('groups')
			// 	.then(res => {
			// 		this.groups = res.data.groups
			// 		res.data.groups.forEach(o => {
			// 			if (o.isuse === 0 || o.isuse === 1) {
			// 				this.sel.items.push(o.groupcode)
			// 			}
			// 		})
			// 		if (this.$store.state.meData.role.name === 'partner') {
			// 			this.reservedays(this.$store.state.meData.group.groupcode)
			// 			this.sel.value = this.$store.state.meData.group.groupcode
			// 		} else {
			// 			this.reservedays()
			// 			this.sel.value = this.sel.items[0]
			// 		}
			// 	})
			// 	.catch(() => {})
			// if (this.$store.state.meData.role.name === 'partner') {
			this.reservedays(this.$store.state.meData.group.groupcode)
			this.sel.value = this.$store.state.meData.group.groupcode
			// } else {
			// 	this.reservedays()
			// 	this.sel.value = this.$store.state.meData.group.groupcode
			// }
		},
		reservedays(groupcode) {
			const data = {
				type: 'd',
				groupcode: groupcode,
				status: 1,
			}
			this.$store
				.dispatch('reservedays', data)
				.then(res => {
					// if (groupcode) {
					// 	// this.datatable.items = res.data.reservedays
					// 	let QRadded = res.data.reservedays
					// 	QRadded.forEach(e => {
					// 		e.enterQR = e.code
					// 		e.counselQR = e.code
					// 	})
					// 	this.datatable.items = QRadded
					// 	this.reservedaysData = QRadded
					// 	this.refineAPI()
					// 	this.applyTable()
					// } else {
					let QRadded = res.data.reservedays
					QRadded.forEach(e => {
						e.enterQR = e.code
						e.counselQR = e.code
						e.codeDirect = e.code
					})
					this.datatable.items = QRadded
					this.reservedaysData = QRadded
					this.refineAPI()
					this.applyTable()
					// }
				})
				.catch(() => {})
		},
		inputboxes() {
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
			}
			this.$store
				.dispatch('inputboxes', data)
				.then(res => {
					this.inputBoxes = res.data.inputBoxes
					let filterType = this.sel.value
					let result = this.reservedaysData.filter(item => {
						return item.groupcode === filterType
					})
					this.datatable.items = result
					/// 설문선택 셀렉트 박스 아이템을 inputbox 로 적용
					let inputSels = []
					let inputItem = []
					let inputPast = ['없음']
					this.inputBoxes.forEach(item => {
						if (item.groupcode === filterType) {
							inputItem.push({ name: item.name, id: item.id })
							inputSels.push(item.name)
							inputPast.push(item.name)
						}
					})
					this.editmodal.items[13].sel.items = inputSels
					this.editmodal.items[13].sel.inputItems = inputItem

					this.editmodal.items[15].sel.items = inputSels
					this.editmodal.items[15].sel.inputItems = inputItem

					this.editmodal.items[17].sel.items = inputPast
					this.editmodal.items[17].sel.inputItems = inputItem
				})
				.catch(() => {})
		},
		createReserveday(imageData) {
			/// 설문선택 셀렉트 박스 value로 id 찾아 입력
			let status = 1
			let inputName = this.editmodal.items[13].sel.value
			let inputindex = this.editmodal.items[13].sel.inputItems.findIndex(e => e.name === inputName)
			let inputId = this.editmodal.items[13].sel.inputItems[inputindex].id

			let tempcheckName = this.editmodal.items[15].sel.value
			let tempcheckindex
			let tempcheckId
			if (tempcheckName) {
				tempcheckindex = this.editmodal.items[15].sel.inputItems.findIndex(e => e.name === tempcheckName)
				tempcheckId = this.editmodal.items[15].sel.inputItems[tempcheckindex].id
			}
			let inputType = this.editmodal.items[14].sel.value
			let inputTypeSelect
			if (inputType === '드래그') {
				inputTypeSelect = '1'
			} else if (inputType === '슬라이드') {
				inputTypeSelect = '2'
			}
			let populationValue = this.editmodal.items[17].sel.value
			let populationindex
			let populationId
			if (populationValue === '없음') {
				populationId = ''
			} else {
				populationindex = this.editmodal.items[17].sel.inputItems.findIndex(e => e.name === populationValue)
				populationId = this.editmodal.items[17].sel.inputItems[populationindex].id
			}
			const data = {
				groupcode: this.editmodal.items[1].value,
				title: this.editmodal.items[2].value,
				sdate: new Date(this.editmodal.items[7].picker.date),
				edate: new Date(this.editmodal.items[8].picker.date),
				// tplCode: [
				// this.editmodal.items[9].sel.value,
				// this.editmodal.items[10].sel.value,
				// this.editmodal.items[11].sel.value,
				// this.editmodal.items[12].sel.value,
				// this.editmodal.items[13].sel.value,
				// this.editmodal.items[14].sel.value,
				// this.editmodal.items[15].sel.value,
				// this.editmodal.items[16].sel.value,
				// this.editmodal.items[17].sel.value,
				// ],
				input_box: inputId,
				nodaySetting: this.editmodal.items[12].selChip.chips,
				timeRange: this.editmodal.items[9].timeRange.startRange.value + ',' + this.editmodal.items[9].timeRange.endRange.value,
				maxcount: Number(this.editmodal.items[11].value),
				type: 'd',
				status: status,
				inputBoxType: inputTypeSelect,
				directInputBoxId: tempcheckId,
				endLink: this.editmodal.items[16].value,
				splitMinute: this.editmodal.items[9].timeRange.timeSlice.value.slice(0, -1),
				population: populationId,
				AccessPhones: this.editmodal.items[18].value === '' ? '' : JSON.parse(this.editmodal.items[18].value),
				area: this.editmodal.items[0].sel.value,
				consultingTitle: this.editmodal.items[4].value,
				btnText: this.editmodal.items[6].value,
				color: this.editmodal.items[20].value.value,
				commentTag: this.editmodal.items[21].value,
			}

			/// 이미지 3 개 모두 업로드
			if (this.$store.state.uploadFileData.file && this.$store.state.uploadFileDataDirect.file && this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.directimg = imageData.data.multipleUpload[1].id
				data.QRlogo = imageData.data.multipleUpload[2].id
				// 이미지 2개 업로드
			} else if (
				this.$store.state.uploadFileData.file &&
				this.$store.state.uploadFileDataDirect.file &&
				!this.$store.state.uploadFileQrlogo.file
			) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.directimg = imageData.data.multipleUpload[1].id
			} else if (
				this.$store.state.uploadFileData.file &&
				!this.$store.state.uploadFileDataDirect.file &&
				this.$store.state.uploadFileQrlogo.file
			) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.QRlogo = imageData.data.multipleUpload[1].id
			} else if (
				!this.$store.state.uploadFileData.file &&
				this.$store.state.uploadFileDataDirect.file &&
				this.$store.state.uploadFileQrlogo.file
			) {
				data.directimg = imageData.data.multipleUpload[0].id
				data.QRlogo = imageData.data.multipleUpload[1].id
			}
			/// 메인 이미지만 업로드
			else if (
				this.$store.state.uploadFileData.file &&
				!this.$store.state.uploadFileDataDirect.file &&
				!this.$store.state.uploadFileQrlogo.file
			) {
				data.mainimg = imageData.data.upload.id
			}
			// // 다이렉트 이미지만 업로드
			else if (
				!this.$store.state.uploadFileData.file &&
				this.$store.state.uploadFileDataDirect.file &&
				!this.$store.state.uploadFileQrlogo.file
			) {
				data.directimg = imageData.data.upload.id
			} else if (
				!this.$store.state.uploadFileData.file &&
				!this.$store.state.uploadFileDataDirect.file &&
				this.$store.state.uploadFileQrlogo.file
			) {
				data.QRlogo = imageData.data.upload.id
			}
			data.loginType = 'phone'
			this.$store
				.dispatch('createReserveday', data)
				.then(() => {
					this.$store.state.loading = false
					this.datatable.breakpoint = !this.datatable.breakpoint
					this.reservedays(data.groupcode)
					this.editmodal.dialog = false
				})
				.catch(() => {
					this.$store.state.loading = false
				})
		},
		updateReserveday(id, imageData) {
			/// 설문선택 셀렉트 박스 value로 id 찾아 입력
			let status = 1
			let inputName = this.editmodal.items[13].sel.value
			let inputindex = this.editmodal.items[13].sel.inputItems.findIndex(e => e.name === inputName)
			let inputId = this.editmodal.items[13].sel.inputItems[inputindex].id

			let tempcheckName = this.editmodal.items[15].sel.value
			let tempcheckindex
			let tempcheckId
			if (tempcheckName) {
				tempcheckindex = this.editmodal.items[15].sel.inputItems.findIndex(e => e.name === tempcheckName)
				tempcheckId = this.editmodal.items[15].sel.inputItems[tempcheckindex].id
			}
			let inputType = this.editmodal.items[14].sel.value
			let inputTypeSelect
			if (inputType === '드래그') {
				inputTypeSelect = '1'
			} else if (inputType === '슬라이드') {
				inputTypeSelect = '2'
			}
			let populationValue = this.editmodal.items[17].sel.value
			let populationindex
			let populationId
			if (populationValue === '없음') {
				populationId = ''
			} else {
				populationindex = this.editmodal.items[17].sel.inputItems.findIndex(e => e.name === populationValue)
				populationId = this.editmodal.items[17].sel.inputItems[populationindex].id
			}
			const data = {
				id: id,
				groupcode: this.editmodal.items[1].value,
				title: this.editmodal.items[2].value,
				sdate: new Date(this.editmodal.items[7].picker.date),
				edate: new Date(this.editmodal.items[8].picker.date),
				// tplCode: [
				// this.editmodal.items[9].sel.value,
				// this.editmodal.items[10].sel.value,
				// this.editmodal.items[11].sel.value,
				// this.editmodal.items[12].sel.value,
				// this.editmodal.items[13].sel.value,
				// this.editmodal.items[14].sel.value,
				// this.editmodal.items[15].sel.value,
				// this.editmodal.items[16].sel.value,
				// this.editmodal.items[17].sel.value,
				// ],
				input_box: inputId,
				nodaySetting: this.editmodal.items[12].selChip.chips,
				timeRange: this.editmodal.items[9].timeRange.startRange.value + ',' + this.editmodal.items[9].timeRange.endRange.value,
				maxcount: Number(this.editmodal.items[11].value),
				type: 'd',
				status: status,
				inputBoxType: inputTypeSelect,
				directInputBoxId: tempcheckId,
				endLink: this.editmodal.items[16].value,
				splitMinute: this.editmodal.items[9].timeRange.timeSlice.value.slice(0, -1),
				population: populationId,
				AccessPhones: this.editmodal.items[18].value === '' ? '' : JSON.parse(this.editmodal.items[18].value),
				area: this.editmodal.items[0].sel.value,
				consultingTitle: this.editmodal.items[4].value,
				btnText: this.editmodal.items[6].value,
				color: this.editmodal.items[20].value.value,
				commentTag: this.editmodal.items[21].value,
			}
			/// 이미지 3 개 모두 업로드
			if (this.$store.state.uploadFileData.file && this.$store.state.uploadFileDataDirect.file && this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.directimg = imageData.data.multipleUpload[1].id
				data.QRlogo = imageData.data.multipleUpload[2].id
				// 이미지 2개 업로드
			} else if (
				this.$store.state.uploadFileData.file &&
				this.$store.state.uploadFileDataDirect.file &&
				!this.$store.state.uploadFileQrlogo.file
			) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.directimg = imageData.data.multipleUpload[1].id
			} else if (
				this.$store.state.uploadFileData.file &&
				!this.$store.state.uploadFileDataDirect.file &&
				this.$store.state.uploadFileQrlogo.file
			) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.QRlogo = imageData.data.multipleUpload[1].id
			} else if (
				!this.$store.state.uploadFileData.file &&
				this.$store.state.uploadFileDataDirect.file &&
				this.$store.state.uploadFileQrlogo.file
			) {
				data.directimg = imageData.data.multipleUpload[0].id
				data.QRlogo = imageData.data.multipleUpload[1].id
			}
			/// 메인 이미지만 업로드
			else if (
				this.$store.state.uploadFileData.file &&
				!this.$store.state.uploadFileDataDirect.file &&
				!this.$store.state.uploadFileQrlogo.file
			) {
				data.mainimg = imageData.data.upload.id
			}
			// // 다이렉트 이미지만 업로드
			else if (
				!this.$store.state.uploadFileData.file &&
				this.$store.state.uploadFileDataDirect.file &&
				!this.$store.state.uploadFileQrlogo.file
			) {
				data.directimg = imageData.data.upload.id
			} else if (
				!this.$store.state.uploadFileData.file &&
				!this.$store.state.uploadFileDataDirect.file &&
				this.$store.state.uploadFileQrlogo.file
			) {
				data.QRlogo = imageData.data.upload.id
			}

			this.$store.dispatch('updateReserveday', data).then(() => {
				this.$store.state.loading = false
				this.datatable.breakpoint = !this.datatable.breakpoint
				this.reservedays(data.groupcode)
				this.editmodal.dialog = false
				this.showAdd = true
			})
		},
		deleteReserveday(id) {
			const data = {
				id: id,
				groupcode: this.$store.state.datatableItem.groupcode,
				title: this.$store.state.datatableItem.title,
				status: 9,
				type: 'd',
			}
			this.$store
				.dispatch('updateReserveday', data)
				.then(() => {
					this.reservedays(this.$store.state.datatableItem.groupcode)
				})
				.catch(() => {})
		},
		refineAPI() {
			this.datatable.items.forEach(element => {
				if (element.sdate) {
					var s = element.sdate.slice(0, 10)
					element.sdate = s
				}
				if (element.edate) {
					var e = element.edate.slice(0, 10)
					element.edate = e
				}

				// element.reservalarm = element.tplCode[1]
				// element.lastalarm = element.tplCode[2]
			})
		},
		deleteAccount() {
			this.deleteReserveday(this.$store.state.datatableItem.id)
			this.alertModal.dialog = false
		},
		clickDeleteBtn() {
			this.alertModal.dialog = true
		},
		reserveday() {
			const data = {
				id: this.$store.state.datatableItem.id,
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
			}
			this.$store.dispatch('reserveday', data).then(res => {
				this.editmodal.title = '방문예약 관리'
				this.datatable.breakpoint = !this.datatable.breakpoint
				this.editmodal.dialog = !this.editmodal.dialog
				this.editmodal.items[0].sel.value = res.data.reserveday.area
				this.editmodal.items[1].value = res.data.reserveday.groupcode
				this.editmodal.items[2].value = res.data.reserveday.title
				if (res.data.reserveday.mainimg) {
					this.editmodal.items[3].value = res.data.reserveday.mainimg.name
				} else {
					this.editmodal.items[3].value = ''
				}
				this.editmodal.items[4].value = res.data.reserveday.consultingTitle
				if (res.data.reserveday.directimg) {
					this.editmodal.items[5].value = res.data.reserveday.directimg.name
				} else {
					this.editmodal.items[5].value = ''
				}
				this.editmodal.items[6].value = res.data.reserveday.btnText
				this.editmodal.items[7].picker.date = this.$moment(res.data.reserveday.sdate).format('YYYY-MM-DD')
				this.editmodal.items[8].picker.date = this.$moment(res.data.reserveday.edate).format('YYYY-MM-DD')
				// if (res.data.reserveday.tplCode) {
				// 	this.editmodal.items[9].sel.value = res.data.reserveday.tplCode[0]
				// 	this.editmodal.items[10].sel.value = res.data.reserveday.tplCode[1]
				// 	this.editmodal.items[11].sel.value = res.data.reserveday.tplCode[2]
				// 	this.editmodal.items[12].sel.value = res.data.reserveday.tplCode[3]
				// 	this.editmodal.items[13].sel.value = res.data.reserveday.tplCode[4]
				// 	this.editmodal.items[14].sel.value = res.data.reserveday.tplCode[5]
				// 	this.editmodal.items[15].sel.value = res.data.reserveday.tplCode[6]
				// 	this.editmodal.items[16].sel.value = res.data.reserveday.tplCode[7]
				// 	this.editmodal.items[17].sel.value = res.data.reserveday.tplCode[8]
				// }
				// / inputbox Id 이용하여 Name 검색
				if (res.data.reserveday.input_box) {
					let inputValue = res.data.reserveday.input_box.id
					let inputindex = this.editmodal.items[13].sel.inputItems.findIndex(e => e.id === inputValue)
					let inputName = this.editmodal.items[13].sel.inputItems[inputindex].name
					this.editmodal.items[13].sel.value = inputName
				} else {
					this.editmodal.items[13].sel.value = ''
				}
				if (res.data.reserveday.timeRange) {
					this.editmodal.items[9].timeRange.startRange.value = res.data.reserveday.timeRange.split(',')[0]
					this.editmodal.items[9].timeRange.endRange.value = res.data.reserveday.timeRange.split(',')[1]
				}
				if (res.data.reserveday.splitMinute) {
					this.editmodal.items[9].timeRange.check.value = true
					this.editmodal.items[9].timeRange.timeSlice.value = res.data.reserveday.splitMinute + '분'
					this.editmodal.items[9].timeRange.timeSlice.disable = false
					this.editmodal.items[10].selectBox = false
					this.changeCommon()
				} else {
					this.editmodal.items[9].timeRange.check.value = false
					this.editmodal.items[9].timeRange.timeSlice.value = ''
					this.editmodal.items[9].timeRange.timeSlice.disable = true
					this.editmodal.items[10].selectBox = false
					this.setNotime()
				}
				this.editmodal.items[10].commonNotime.value = ''
				this.editmodal.items[10].commonMaxconut.value = ''
				this.editmodal.items[10].commonMaxconutTxt.value = ''
				this.editmodal.items[11].value = String(res.data.reserveday.maxcount)

				if (res.data.reserveday.nodaySetting) {
					let activeDays = this.getDateRangeData(this.editmodal.items[7].picker.date, this.editmodal.items[8].picker.date)
					// this.editmodal.items[12].pickerChip.date = res.data.reserveday.nodaySetting.map(x => x.date)
					// this.editmodal.items[12].pickerChip.chips = res.data.reserveday.nodaySetting.map(x => x.date)
					// this.editmodal.items[12].selChip.chips = res.data.reserveday.nodaySetting
					if (res.data.reserveday.nodaySetting.length === 0) {
						this.editmodal.items[12].pickerChip.chipTxt = ''
					}
					let formalLength = res.data.reserveday.nodaySetting.map(x => x.date).length
					let newLength = activeDays.length
					if (formalLength < newLength) {
						let nodaySet = []
						activeDays.forEach((day, i) => {
							let index = res.data.reserveday.nodaySetting.findIndex(e => e.date === day)
							if (index !== -1) {
								nodaySet.push(res.data.reserveday.nodaySetting[index])
								nodaySet[i].maxcount = ''
							} else {
								nodaySet.push({ date: day, noTime: [] })
								nodaySet[i].maxcount = ''
							}
						})
						this.editmodal.items[12].pickerChip.chips = activeDays
						this.editmodal.items[12].selChip.chips = nodaySet
					} else {
						this.editmodal.items[12].pickerChip.chips = res.data.reserveday.nodaySetting.map(x => x.date)
						this.editmodal.items[12].selChip.chips = res.data.reserveday.nodaySetting
					}
				}
				this.editmodal.items[12].pickerChip.chipTxt = ''

				// if (res.data.reserveday.inputBoxType) {
				// 	let inputType = Number(res.data.reserveday.inputBoxType) - 1
				// 	this.editmodal.items[14].sel.value = this.editmodal.items[14].sel.items[inputType]
				// } else {
				this.editmodal.items[14].sel.value = '드래그'
				// }
				if (res.data.reserveday.directInputBoxId) {
					let inputValue = res.data.reserveday.directInputBoxId
					let inputindex = this.editmodal.items[15].sel.inputItems.findIndex(e => e.id === inputValue)
					let inputName = this.editmodal.items[15].sel.inputItems[inputindex].name

					this.editmodal.items[15].sel.value = inputName
				} else {
					this.editmodal.items[15].sel.value = ''
				}
				if (res.data.reserveday.endLink) {
					this.editmodal.items[16].value = res.data.reserveday.endLink
				} else {
					this.editmodal.items[16].value = ''
				}

				if (res.data.reserveday.population) {
					let populationValue = res.data.reserveday.population
					let populationindex = this.editmodal.items[17].sel.inputItems.findIndex(e => e.id === populationValue)
					let populationName = this.editmodal.items[17].sel.inputItems[populationindex].name

					this.editmodal.items[17].sel.value = populationName
					this.editmodal.items[18].value = ''
					this.editmodal.items[17].disable = false
					// this.editmodal.items[18].csvImport = true
				} else {
					this.editmodal.items[17].disable = false
					this.editmodal.items[17].sel.value = '없음'
				}
				if (res.data.reserveday.accessPhones) {
					this.editmodal.items[18].value = res.data.reserveday.accessPhones.join(',')
					this.editmodal.items[18].csvImport = false
					this.editmodal.items[17].sel.value = '없음'
					// this.editmodal.items[17].disable = true
				} else {
					this.editmodal.items[18].csvImport = false
					this.editmodal.items[18].value = ''
				}

				if (res.data.reserveday.QRlogo) {
					this.editmodal.items[19].value = res.data.reserveday.QRlogo.name
				} else {
					this.editmodal.items[19].value = ''
				}
				this.editmodal.items[20].value.value = res.data.reserveday.color
				this.editmodal.items[21].value = res.data.reserveday.commentTag

				this.commonNotimeSet()
				this.showAdd = !this.showAdd
			})
		},
		clickEditBtn() {
			this.messages()
			this.reserveday()
			this.SetDialogAlertModal.onceDone = false
		},
		clickSaveBtn() {
			let ok = 0
			if (this.editmodal.items[1].value === '') {
				ok += 1
				return (this.editmodal.items[1].txtfield.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editmodal.items[1].txtfield.errorMessage = ''
			}
			if (this.editmodal.items[2].value === '') {
				ok += 1
				return (this.editmodal.items[2].txtfield.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editmodal.items[2].txtfield.errorMessage = ''
			}
			if (this.editmodal.items[7].picker.date === '') {
				ok += 1
				return (this.editmodal.items[7].picker.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editmodal.items[7].picker.errorMessage = ''
			}
			if (this.editmodal.items[8].picker.date === '') {
				ok += 1
				return (this.editmodal.items[8].picker.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editmodal.items[8].picker.errorMessage = ''
			}
			if (this.editmodal.items[13].sel.value === '') {
				ok += 1
				return (this.editmodal.items[13].sel.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editmodal.items[13].sel.errorMessage = ''
			}

			if (ok === 0) {
				this.$store.state.loading = true

				if (this.datatable.noweditting !== -1) {
					// 메인, 다이렉트, qrLogo 이미지 업로드
					if (
						this.$store.state.uploadFileData.file &&
						this.$store.state.uploadFileDataDirect.file &&
						this.$store.state.uploadFileQrlogo.file
					) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							files: [
								this.$store.state.uploadFileData.file,
								this.$store.state.uploadFileDataDirect.file,
								this.$store.state.uploadFileQrlogo.file,
							],
						}
						this.$store
							.dispatch('multipleUpload', fileData)
							.then(res => {
								const data = {}
								this.updateReserveday(this.$store.state.datatableItem.id, res)
								this.$store.commit('uploadFileData', data)
								this.$store.commit('uploadFileDataDirect', data)
								this.$store.commit('uploadFileQrlogo', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
						// 메인, 다이렉트 이미지 업로드
					} else if (
						this.$store.state.uploadFileData.file &&
						this.$store.state.uploadFileDataDirect.file &&
						!this.$store.state.uploadFileQrlogo.file
					) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							files: [this.$store.state.uploadFileData.file, this.$store.state.uploadFileDataDirect.file],
						}
						this.$store
							.dispatch('multipleUpload', fileData)
							.then(res => {
								const data = {}
								this.updateReserveday(this.$store.state.datatableItem.id, res)
								this.$store.commit('uploadFileData', data)
								this.$store.commit('uploadFileDataDirect', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
						// 메인, Qrlogo 이미지 업로드
					} else if (
						this.$store.state.uploadFileData.file &&
						!this.$store.state.uploadFileDataDirect.file &&
						this.$store.state.uploadFileQrlogo.file
					) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							files: [this.$store.state.uploadFileData.file, this.$store.state.uploadFileQrlogo.file],
						}
						this.$store
							.dispatch('multipleUpload', fileData)
							.then(res => {
								const data = {}
								this.updateReserveday(this.$store.state.datatableItem.id, res)
								this.$store.commit('uploadFileData', data)
								this.$store.commit('uploadFileQrlogo', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
						// uploadFileDataDirect, Qrlogo 이미지 업로드
					} else if (
						!this.$store.state.uploadFileData.file &&
						this.$store.state.uploadFileDataDirect.file &&
						this.$store.state.uploadFileQrlogo.file
					) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							files: [this.$store.state.uploadFileDataDirect.file, this.$store.state.uploadFileQrlogo.file],
						}
						this.$store
							.dispatch('multipleUpload', fileData)
							.then(res => {
								const data = {}
								this.updateReserveday(this.$store.state.datatableItem.id, res)
								this.$store.commit('uploadFileQrlogo', data)
								this.$store.commit('uploadFileDataDirect', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					}
					// 메인 이미지 업로드
					else if (
						this.$store.state.uploadFileData.file &&
						!this.$store.state.uploadFileDataDirect.file &&
						!this.$store.state.uploadFileQrlogo.file
					) {
						const filedata = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							file: this.$store.state.uploadFileData.file,
						}
						this.$store
							.dispatch('fileUpload', filedata)
							.then(res => {
								this.updateReserveday(this.$store.state.datatableItem.id, res)
								const data = {}
								this.$store.commit('uploadFileData', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					}
					// 다이렉트 이미지 업로드
					else if (
						!this.$store.state.uploadFileData.file &&
						this.$store.state.uploadFileDataDirect.file &&
						!this.$store.state.uploadFileQrlogo.file
					) {
						const filedata = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							file: this.$store.state.uploadFileDataDirect.file,
						}
						this.$store
							.dispatch('fileUpload', filedata)
							.then(res => {
								this.updateReserveday(this.$store.state.datatableItem.id, res)
								const data = {}
								this.$store.commit('uploadFileDataDirect', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					} // qrLogo 이미지 업로드
					else if (
						!this.$store.state.uploadFileData.file &&
						!this.$store.state.uploadFileDataDirect.file &&
						this.$store.state.uploadFileQrlogo.file
					) {
						const filedata = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							file: this.$store.state.uploadFileQrlogo.file,
						}
						this.$store
							.dispatch('fileUpload', filedata)
							.then(res => {
								this.updateReserveday(this.$store.state.datatableItem.id, res)
								const data = {}
								this.$store.commit('uploadFileQrlogo', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					} else {
						this.updateReserveday(this.$store.state.datatableItem.id)
					}
				} else {
					// 메인, 다이렉트 이미지 업로드
					if (
						this.$store.state.uploadFileData.file &&
						this.$store.state.uploadFileDataDirect.file &&
						this.$store.state.uploadFileQrlogo.file
					) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							files: [
								this.$store.state.uploadFileData.file,
								this.$store.state.uploadFileDataDirect.file,
								this.$store.state.uploadFileQrlogo.file,
							],
						}
						this.$store
							.dispatch('multipleUpload', fileData)
							.then(res => {
								const data = {}
								this.createReserveday(res)
								this.$store.commit('uploadFileData', data)
								this.$store.commit('uploadFileDataDirect', data)
								this.$store.commit('uploadFileQrlogo', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
						// 메인, 다이렉트 이미지 업로드
					} else if (
						this.$store.state.uploadFileData.file &&
						this.$store.state.uploadFileDataDirect.file &&
						!this.$store.state.uploadFileQrlogo.file
					) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							files: [this.$store.state.uploadFileData.file, this.$store.state.uploadFileDataDirect.file],
						}
						this.$store
							.dispatch('multipleUpload', fileData)
							.then(res => {
								const data = {}
								this.createReserveday(res)
								this.$store.commit('uploadFileData', data)
								this.$store.commit('uploadFileDataDirect', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
						// 메인, Qrlogo 이미지 업로드
					} else if (
						this.$store.state.uploadFileData.file &&
						!this.$store.state.uploadFileDataDirect.file &&
						this.$store.state.uploadFileQrlogo.file
					) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							files: [this.$store.state.uploadFileData.file, this.$store.state.uploadFileQrlogo.file],
						}
						this.$store
							.dispatch('multipleUpload', fileData)
							.then(res => {
								const data = {}
								this.createReserveday(res)
								this.$store.commit('uploadFileData', data)
								this.$store.commit('uploadFileQrlogo', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
						// uploadFileDataDirect, Qrlogo 이미지 업로드
					} else if (
						!this.$store.state.uploadFileData.file &&
						this.$store.state.uploadFileDataDirect.file &&
						this.$store.state.uploadFileQrlogo.file
					) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							files: [this.$store.state.uploadFileDataDirect.file, this.$store.state.uploadFileQrlogo.file],
						}
						this.$store
							.dispatch('multipleUpload', fileData)
							.then(res => {
								const data = {}
								this.createReserveday(res)
								this.$store.commit('uploadFileQrlogo', data)
								this.$store.commit('uploadFileDataDirect', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					}
					// 메인 이미지 업로드
					else if (
						this.$store.state.uploadFileData.file &&
						!this.$store.state.uploadFileDataDirect.file &&
						!this.$store.state.uploadFileQrlogo.file
					) {
						const filedata = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							file: this.$store.state.uploadFileData.file,
						}
						this.$store
							.dispatch('fileUpload', filedata)
							.then(res => {
								this.createReserveday(res)
								const data = {}
								this.$store.commit('uploadFileData', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					}
					// 다이렉트 이미지 업로드
					else if (
						!this.$store.state.uploadFileData.file &&
						this.$store.state.uploadFileDataDirect.file &&
						!this.$store.state.uploadFileQrlogo.file
					) {
						const filedata = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							file: this.$store.state.uploadFileDataDirect.file,
						}
						this.$store
							.dispatch('fileUpload', filedata)
							.then(res => {
								this.createReserveday(res)
								const data = {}
								this.$store.commit('uploadFileDataDirect', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					} // qrLogo 이미지 업로드
					else if (
						!this.$store.state.uploadFileData.file &&
						!this.$store.state.uploadFileDataDirect.file &&
						this.$store.state.uploadFileQrlogo.file
					) {
						const filedata = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							file: this.$store.state.uploadFileQrlogo.file,
						}
						this.$store
							.dispatch('fileUpload', filedata)
							.then(res => {
								this.createReserveday(res)
								const data = {}
								this.$store.commit('uploadFileDataDirect', data)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					} else {
						this.createReserveday()
					}
				}
			}
		},
		cancelBack() {
			this.datatable.breakpoint = !this.datatable.breakpoint
			this.editmodal.dialog = false
			this.showAdd = true
		},
		clickAddBtn() {
			this.editmodal.title = '방문예약 등록'
			this.datatable.noweditting = -1
			this.editmodal.items[0].sel.value = this.sel.value
			this.editmodal.items[1].value = this.sel.value
			this.editmodal.items[2].value = ''
			this.editmodal.items[3].value = ''
			this.editmodal.items[4].value = ''
			this.editmodal.items[5].value = ''
			this.editmodal.items[6].value, (this.editmodal.items[7].picker.date = '')
			this.editmodal.items[7].value = ''
			this.editmodal.items[8].picker.date = ''

			// this.editmodal.items[9].sel.value = ''
			// this.editmodal.items[10].sel.value = ''
			// this.editmodal.items[11].sel.value = ''
			// this.editmodal.items[12].sel.value = ''
			// this.editmodal.items[13].sel.value = ''
			// this.editmodal.items[14].sel.value = ''
			// this.editmodal.items[15].sel.value = ''
			// this.editmodal.items[16].sel.value = ''
			// this.editmodal.items[17].sel.value = ''

			this.editmodal.items[9].timeRange.startRange.value = '10:00'
			this.editmodal.items[9].timeRange.endRange.value = '18:00'
			this.editmodal.items[9].timeRange.check.value = false
			this.editmodal.items[9].timeRange.timeSlice.value = ''
			this.editmodal.items[9].timeRange.timeSlice.disable = true

			this.editmodal.items[10].selectBox = false
			this.editmodal.items[10].commonNotime.value = ''
			this.editmodal.items[10].commonMaxconut.value = ''
			this.editmodal.items[10].commonMaxconutTxt.value = '30'
			this.editmodal.items[11].value = ''

			this.editmodal.items[12].pickerChip.date = []
			this.editmodal.items[12].pickerChip.chips = []
			this.editmodal.items[12].pickerChip.chipTxt = ''
			this.editmodal.items[12].selChip.value = ''
			this.editmodal.items[12].selChip.chips = []
			this.editmodal.items[12].maxcount.value = ''
			this.editmodal.items[13].sel.value = ''
			this.editmodal.items[14].sel.value = '드래그'
			this.editmodal.items[15].sel.value = ''

			this.editmodal.items[16].value = ''

			this.editmodal.items[17].sel.value = '없음'
			this.editmodal.items[17].disable = false
			this.editmodal.items[18].value = ''
			this.editmodal.items[18].csvImport = false
			this.editmodal.items[19].value = ''
			this.editmodal.items[20].value.value = ''
			this.editmodal.items[21].value = ''
			this.datatable.breakpoint = !this.datatable.breakpoint
			this.editmodal.dialog = !this.editmodal.dialog
			this.SetDialogAlertModal.onceDone = false
			this.setNotime()
		},
		// 셀렉트 박스 선택된 값 테이블 적용
		applyTable() {
			let filterType = this.sel.value
			let result = this.reservedaysData.filter(item => {
				return item.groupcode === filterType
			})
			this.datatable.items = result
			/// 설문선택 셀렉트 박스 아이템을 inputbox 로 적용
			let inputSels = []
			let inputItem = []
			let inputPast = ['없음']
			this.inputBoxes.forEach(item => {
				if (item.groupcode === filterType) {
					inputItem.push({ name: item.name, id: item.id })
					inputSels.push(item.name)
					inputPast.push(item.name)
				}
			})
			this.editmodal.items[13].sel.items = inputSels
			this.editmodal.items[13].sel.inputItems = inputItem

			this.editmodal.items[15].sel.items = inputSels
			this.editmodal.items[15].sel.inputItems = inputItem

			this.editmodal.items[17].sel.items = inputPast
			this.editmodal.items[17].sel.inputItems = inputItem
			this.messages()
		},
		reserveAllow(val) {
			let start = this.$moment(this.editmodal.items[7].picker.date).format('YYMMDD')
			val = this.$moment(val).format('YYMMDD') > start
			return val
		},
		reserveAllow2(val) {
			let start = this.$moment(this.editmodal.items[7].picker.date).format('YYMMDD')
			let end = this.$moment(this.editmodal.items[8].picker.date).format('YYMMDD')
			if (!this.editmodal.items[8].picker.date) {
				return (val = null)
			} else {
				val = this.$moment(val).format('YYMMDD') >= start && this.$moment(val).format('YYMMDD') <= end
				return val
			}
		},
		setNotime() {
			// 시작 시간에 맞춰 끝나는 시간, 제외시간 select box 아이템 변화
			let sitem = this.editmodal.items[9].timeRange.startRange.items
			let value = this.editmodal.items[9].timeRange.startRange.value
			let eValue = this.editmodal.items[9].timeRange.endRange.value
			let endRangeItem = []
			let notimeItem = []
			let notimeItem2 = []
			sitem.forEach(e => {
				if (e > value) {
					endRangeItem.push(e)
				}
				if (e >= value && e < eValue) {
					notimeItem.push(e)
					notimeItem2.push(e)
				}
			})
			this.editmodal.items[12].selChip.items = notimeItem
			this.editmodal.items[10].commonNotime.items = JSON.parse(JSON.stringify(notimeItem2))
			this.editmodal.items[9].timeRange.endRange.items = endRangeItem
			let setData = this.editmodal.items[12].selChip.items.join(',')
			this.$store.state.selChips = setData

			let timeSet = this.editmodal.items[9].timeRange.timeSlice.value.slice(0, -1)
			if (timeSet) {
				let startRange = this.editmodal.items[9].timeRange.startRange.value
				let endRange = this.editmodal.items[9].timeRange.endRange.value

				// let startDay = startRange
				let commonTime = []
				let commonTime2 = []

				for (let index = 0; startRange < endRange; index++) {
					commonTime.push(startRange)
					commonTime2.push(startRange)
					startRange = this.$moment
						.utc(startRange, 'HH:mm')
						.add(timeSet, 'minutes')
						.format('HH:mm')
				}

				this.editmodal.items[10].commonNotime.items = commonTime
				this.editmodal.items[12].selChip.items = commonTime2
			}
			this.editmodal.items[12].selChip.items.push('날짜 제외')
		},
		messages() {
			/// 알림톡 item 생성
			const data = {
				groupcode: this.sel.value,
				stat: 0,
			}
			this.$store
				.dispatch('messages', data)
				.then(() => {
					// let msgCode = res.data.messages.map(x => x.tplCode)
					// this.editmodal.items[9].sel.items = msgCode
					// this.editmodal.items[10].sel.items = msgCode
					// this.editmodal.items[11].sel.items = msgCode
					// this.editmodal.items[12].sel.items = msgCode
					// this.editmodal.items[13].sel.items = msgCode
					// this.editmodal.items[14].sel.items = msgCode
					// this.editmodal.items[15].sel.items = msgCode
					// this.editmodal.items[16].sel.items = msgCode
					// this.editmodal.items[17].sel.items = msgCode
				})
				.catch(() => {})
		},
		changeCommon() {
			// 공통 max cout 아이템 적용
			let timeSet = this.editmodal.items[9].timeRange.timeSlice.value.slice(0, -1)
			let starndardTime = 60 / timeSet
			let maxcountitems = []

			for (let index = 1; index < 11; index++) {
				maxcountitems.push(starndardTime * index)
			}
			this.editmodal.items[10].commonMaxconut.items = maxcountitems

			let startRange = this.editmodal.items[9].timeRange.startRange.value
			let endRange = this.editmodal.items[9].timeRange.endRange.value

			// let startDay = startRange
			let commonTime = []

			for (let index = 0; startRange < endRange; index++) {
				commonTime.push(startRange)
				startRange = this.$moment
					.utc(startRange, 'HH:mm')
					.add(timeSet, 'minutes')
					.format('HH:mm')
			}

			this.editmodal.items[12].selChip.chips.forEach(e => {
				e.noTime = []
			})
			this.editmodal.items[10].commonNotime.items = commonTime
			this.editmodal.items[12].selChip.items = commonTime
		},
		commonNotimeSet() {
			let timeData = {}
			this.editmodal.items[12].selChip.chips.forEach(e => {
				e.noTime.forEach(time => {
					let notimeCheck = Object.keys(timeData).includes(time)
					if (notimeCheck === false) {
						timeData[time] = 0
					}
					{
						timeData[time] = timeData[time] + 1
					}
				})
			})
			for (var key in timeData) {
				if (timeData[key] === this.editmodal.items[12].selChip.chips.length) {
					let commonItemIndex = this.editmodal.items[12].selChip.items.findIndex(e => e === key)
					if (commonItemIndex !== -1) {
						this.editmodal.items[10].commonNotime.items.splice(commonItemIndex, 1)
					}
				}
			}
		},
		getDateRangeData(start, end) {
			// 두 날짜 사이 날짜 구하기
			let resultDays = []
			let startday = new Date(start)
			let endday = new Date(end)
			while (startday.getTime() <= endday.getTime()) {
				let month = startday.getMonth() + 1
				month = month < 10 ? '0' + month : month
				let day = startday.getDate()
				day = day < 10 ? '0' + day : day
				resultDays.push(startday.getFullYear() + '-' + month + '-' + day)
				startday.setDate(startday.getDate() + 1)
			}
			return resultDays
		},
	},
}
</script>

<style lang="scss">
.sort_lay {
	.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
		width: 100%;
	}
}
</style>

<style></style>
