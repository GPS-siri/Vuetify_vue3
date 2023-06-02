<template>
	<div>
		<div :class="$vuetify.breakpoint.smAndDown ? '' : 'wrapper'">
			<!-- --- 등록 버튼 --- -->
			<v-layout>
				<btn btn_txt="생성" :btn="addBtn" @click="clickAddBtn" v-if="showAdd & (addCount > 0)" />
			</v-layout>
			<!-- --- 데이터 테이블 --- -->
			<v-layout wrap>
				<v-flex class="mt-4 " lg6 xs12>
					<edit-modalFlex
						:setdialog="editmodal"
						:clickSaveBtn="clickSaveBtn"
						:reserveAllow="reserveAllow"
						:reserveAllow2="reserveAllow2"
						:reserveAllowStart="reserveAllowStart"
						:setStratRange="setStratRange"
						:setNotimes="setStratRange"
						:alertModal="SetDialogAlertModal"
						:cancelBack="cancelBack"
					/>
				</v-flex>
				<v-flex class="px-4" :lg6="editmodal.dialog" :lg12="!editmodal.dialog">
					<datatable :datatable="datatable" class="tbl-type01 sort_lay" :clickEditBtn="clickEditBtn" :clickDeleteBtn="clickDeleteBtn">
					</datatable> </v-flex
			></v-layout>
		</div>
		<alertModal :setdialog="alertModal" :clickDeleteBtnModal="deleteAccount" />
	</div>
</template>

<script>
import { datatable, btn, alertModal } from '@/components/index.js'
export default {
	components: {
		datatable,
		btn,
		alertModal,
		// txtField,
	},
	data() {
		return {
			addCount: 0,
			originalData: '',
			prevTitle: '',
			// --- 데이터 테이블 데이터 --``
			datatable: {
				headers: [
					{ text: '거점 홍보명', value: 'title' },
					{ text: '거점 홍보 URL', value: 'campCode' },
					{ text: '이미지', value: 'mainimg' },
					{ text: '시작일', align: 'center', value: 'sdate' },
					{ text: '종료일', align: 'center', value: 'edate' },
					{ text: '최대예약', align: 'center', value: 'maxcount' },
					{ text: '비고', width: '200', align: 'center', value: 'action' },
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
					// 0
					{
						title: '사업지 선택',
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
					// 1
					{
						title: '사업지 코드',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							disable: true,
							autocomplete: 'off',
						},
						essential: true,
					},
					// 2
					{
						title: '거점 홍보명',
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
					// 3
					{
						title: '메인이미지',
						value: '',
						fileinput: {
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							readonly: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_메인이미지.png',
							},
						},
					},
					// 4
					{
						title: '버튼 텍스트',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							autocomplete: 'off',
							tooltip: {
								url: '/image/tooltip/4.방문예약_버튼텍스트.png',
							},
						},
					},
					// 5
					{
						title: '시작일',
						value: '',
						picker: {
							date: '',
							errorMessage: '',
							hideDetail: false,
							class: 'txtField',
						},
						essential: true,
					},
					// 6
					{
						title: '종료일',
						value: '',
						picker: {
							date: '',
							errorMessage: '',
							hideDetail: false,
							class: 'txtField',
						},
						essential: true,
					},
					// 7
					{
						title: '총 참여인원',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							onlyNumber: true,
							autocomplete: 'off',
							tooltip: {
								url: '/image/tooltip/3.캠페인_총참여인원.png',
							},
						},
						essential: true,
					},
					// 8
					{
						title: '설문선택',
						sel: {
							value: '',
							errorMessage: '',
							hideDetail: false,
							items: [],
							inputItems: [],
							outlined: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_설문선택.png',
							},
						},
						essential: true,
					},
					// 9
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
					// 10
					{
						title: '중복 참여 여부',
						swit: {
							value: false,
							errorMessage: '',
							hideDetail: false,
							truelabel: '중복 참여 가능',
							falselabel: '중복 참여 불가능',
							tooltip: {
								url: '/image/tooltip/03_캠페인_중복참여여부.png',
							},
						},
						essential: true,
					},
					// 11
					{
						title: '완료 링크',
						value: 'https://pf.kakao.com/_IgBkj/friend',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: false,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '형식 예: https://www.google.com',
							tooltip: {
								url: '/image/tooltip/3.캠페인_완료링크.png',
							},
						},
					},
					// 12
					{
						title: '인증 방식',
						check: {
							class: 'sliceCheck',
							value: false,
							trueLabel: '카카오 로그인 허용',
							falseLabel: '카카오 로그인 미허용',
							tooltip: {
								url: '/image/tooltip/3.캠페인_인증방식.png',
							},
						},
						required: false,
					},
					// 13
					{
						title: '정보 표시',
						value: '',
						check: {
							class: 'sliceCheck',
							value: false,
							label: '시간단위',
							trueLabel: '표시',
							falseLabel: '숨김',
							tooltip: {
								url: '/image/tooltip/3.캠페인_정보표시.png',
							},
						},
					},
					//14
					{
						title: '무기명 참여',
						value: '',
						check: {
							class: 'sliceCheck',
							value: false,
							label: '시간단위',
							trueLabel: '허용',
							falseLabel: '비허용',
							tooltip: {
								url: '/image/tooltip/3.캠페인_무기명참여.png',
							},
						},
					},
					//15
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
							tooltip: {
								url: '/image/tooltip/3.캠페인_모집단.png',
							},
						},
					},
					// 16
					{
						title: '참여 허용된 전화번호',
						value: '',
						csvImport: false,
						area: {
							noresize: true,
							readonly: true,
							outlined: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_참여허용된 전화번호.png',
							},
						},
					},
					// 17
					{
						title: '이벤트 설정',
						value: '',
						disable: false,
						sel: {
							value: '',
							errorMessage: '',
							hideDetail: false,
							items: [],
							inputItems: [],
							outlined: true,
							tooltip: {
								url: '/image/tooltip/3.캠페인_이벤트 설정.png',
							},
						},
					},
					// 18
					// {
					// 	title: '참여자 알림톡 받기',
					// 	value: '',
					// 	disable: false,
					// 	check: {
					// 		class: 'sliceCheck',
					// 		value: false,
					// 		label: '시간단위',
					// 		trueLabel: '허용',
					// 		falseLabel: '비허용',
					// 		hideDetail: true,
					// 		tooltip: {
					// 			url: '',
					// 		},
					// 		txtfield: {
					// 			value: '',
					// 			maxlength: '13',
					// 			outlined: true,
					// 			hideDetail: true,
					// 			errorMessage: '',
					// 			autocomplete: 'off',
					// 			placeholder: '알림톡 받을 전화번호 입력',
					// 		},
					// 	},
					// },
				],
			},

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
			business: [], //사업지 데이터
			reservedaysData: [],

			SetDialogAlertModal: {
				dialog: false,
				reddot: true,
				text: '정말로 지우시겠습니까?',
				onceDone: false,
			},
			showAdd: true, // add버튼 보이기
			eventsList: [],
		}
	},
	created() {
		this.inputboxes()
		this.events()
		this.businesses()
		this.setGroupData()
	},
	methods: {
		events() {
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
				status: 1,
			}
			this.$store.dispatch('events', data).then(res => {
				this.eventsList = res.data.events
				this.editmodal.items[17].sel.items = res.data.events.map(data => data.title)
				this.editmodal.items[17].sel.items.unshift('없음')
			})
		},

		createReservedayAws(data) {
			this.$store.dispatch('createReservedayAws', data).then(() => {})
		},
		updateReservedayAws(data) {
			this.$store.dispatch('updateReservedayAws', data).then(() => {})
		},
		setStratRange() {},
		setGroupData() {
			this.reservedays(this.$store.state.meData.group.groupcode)
			this.sel.value = this.$store.state.meData.group.groupcode
		},
		reservedays(groupcode) {
			this.$store.state.loading = true
			const data = {
				type: 'c',
				groupcode: groupcode,
				status: 1,
			}
			this.$store
				.dispatch('reservedays', data)
				.then(res => {
					let QRadded = res.data.reservedays
					QRadded.forEach(e => {
						e.enterQR = e.code
						e.counselQR = e.code
						e.campCode = e.code
					})
					this.datatable.items = res.data.reservedays
					this.reservedaysData = res.data.reservedays
					this.originalData = JSON.stringify(res.data.reservedays)
					this.refineAPI()
					this.applyTable()
					this.addCount = this.$store.state.meData.visit - res.data.reservedays.length
					this.$store.state.loading = false
				})
				.catch(() => {
					this.$store.state.loading = false
				})
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
					this.editmodal.items[8].sel.items = inputPast
					this.editmodal.items[8].sel.inputItems = inputItem
					this.editmodal.items[15].sel.items = inputPast
					this.editmodal.items[15].sel.inputItems = inputItem
				})
				.catch(() => {})
		},
		businesses() {
			const data = {
				show: true,
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
			}
			this.$store.dispatch('businesses', data).then(res => {
				this.business = res.data.businesses
				// let filterType = this.sel.value
				let inputSels = []
				let inputItem = []
				this.business.forEach(item => {
					// 	if (item.groupcode === filterType) {
					inputItem.push({ name: item.title, id: item.id })
					inputSels.push(item.title)
					// 		inputPast.push(item.name)
					// 	}
				})
				this.editmodal.items[0].sel.items = inputSels
				this.editmodal.items[0].sel.inputItems = inputItem
			})
		},
		createReserveday(imageData) {
			/// 설문선택 셀렉트 박스 value로 id 찾아 입력

			let status = 1
			let inputName = this.editmodal.items[8].sel.value
			let inputindex
			let inputId
			let event
			this.eventsList.forEach(element => {
				if (element.title === this.editmodal.items[17].sel.value) {
					event = element.id
				}
			})
			if (inputName === '') {
				inputId = null
				status = 2
			} else if (inputName === '없음') {
				inputId = null
			} else if (inputName !== '없음') {
				inputindex = this.editmodal.items[8].sel.inputItems.findIndex(e => e.name === inputName)
				inputId = this.editmodal.items[8].sel.inputItems[inputindex].id
			}
			let business
			if (this.editmodal.items[0].sel.value) {
				let businessindex = this.editmodal.items[0].sel.inputItems.findIndex(e => e.name === this.editmodal.items[0].sel.value)
				business = this.editmodal.items[0].sel.inputItems[businessindex].id
			}
			let inputType = this.editmodal.items[9].sel.value
			let inputTypeSelect
			if (inputType === '드래그') {
				inputTypeSelect = '1'
			} else if (inputType === '슬라이드') {
				inputTypeSelect = '2'
			}

			let populationValue = this.editmodal.items[15].sel.value
			let populationindex
			let populationId
			if (populationValue === '없음') {
				populationId = ''
			} else {
				populationindex = this.editmodal.items[15].sel.inputItems.findIndex(e => e.name === populationValue)
				populationId = this.editmodal.items[15].sel.inputItems[populationindex].id
			}

			const data = {
				groupcode: this.editmodal.items[1].value,
				title: this.editmodal.items[2].value,
				sdate: new Date(this.editmodal.items[5].picker.date),
				edate: new Date(this.editmodal.items[6].picker.date),
				maxcount: Number(this.editmodal.items[7].value),
				input_box: inputId,
				type: 'c',
				duplicate: this.editmodal.items[10].swit.value,
				status: status,
				inputBoxType: inputTypeSelect,
				endLink: this.editmodal.items[11].value,
				population: populationId,
				AccessPhones: this.editmodal.items[16].value === '' ? '' : JSON.parse(this.editmodal.items[16].value),
				btnText: this.editmodal.items[4].value,
				business: business,
				kakaoLogin: this.editmodal.items[12].check.value,
				showInfo: this.editmodal.items[13].check.value,
				tplCode: [
					'',
					'TG_0649',
					'',
					'',
					'',
					'',
					'',
					'',
					'',
					'TG_6026', // 내가받을 알림톡
				],
				noUserData: this.editmodal.items[14].check.value,
				// selfAlert: this.editmodal.items[18].check.txtfield.value,
			}
			if (event) {
				data.event = event
			} else {
				data.event = null
			}
			if (this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.QRlogo = imageData.data.multipleUpload[1].id
			} else if (this.$store.state.uploadFileData.file && !this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data.upload.id
			} else if (!this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.QRlogo = imageData.data.upload.id
			}
			data.loginType = 'phone'
			this.$store
				.dispatch('createReserveday', data)
				.then(() => {
					this.$store.state.loading = false
					this.reservedays(data.groupcode)
					this.datatable.breakpoint = !this.datatable.breakpoint
					this.editmodal.dialog = false
					this.datatable.headers.push({ text: '비고', width: '200', align: 'center', value: 'action' })
				})
				.catch(() => {
					alert('생성 허용치를 초과하였습니다.')
					this.$store.state.loading = false
				})
		},
		updateReserveday(id, imageData) {
			/// 설문선택 셀렉트 박스 value로 id 찾아 입력
			let status = 1
			let inputName = this.editmodal.items[8].sel.value
			let inputindex
			let inputId
			let event
			this.eventsList.forEach(element => {
				if (element.title === this.editmodal.items[17].sel.value) {
					event = element.id
				}
			})
			if (inputName === '') {
				inputId = null
				status = 2
			} else if (inputName === '없음') {
				inputId = null
			} else if (inputName !== '없음') {
				inputindex = this.editmodal.items[8].sel.inputItems.findIndex(e => e.name === inputName)
				inputId = this.editmodal.items[8].sel.inputItems[inputindex].id
			}

			let business
			if (this.editmodal.items[0].sel.value) {
				let businessindex = this.editmodal.items[0].sel.inputItems.findIndex(e => e.name === this.editmodal.items[0].sel.value)
				business = this.editmodal.items[0].sel.inputItems[businessindex].id
			}

			let inputType = this.editmodal.items[9].sel.value
			let inputTypeSelect
			if (inputType === '드래그') {
				inputTypeSelect = '1'
			} else if (inputType === '슬라이드') {
				inputTypeSelect = '2'
			}
			let populationValue = this.editmodal.items[15].sel.value
			let populationindex
			let populationId
			if (populationValue === '없음') {
				populationId = ''
			} else {
				populationindex = this.editmodal.items[15].sel.inputItems.findIndex(e => e.name === populationValue)
				populationId = this.editmodal.items[15].sel.inputItems[populationindex].id
			}

			const data = {
				id: id,
				groupcode: this.editmodal.items[1].value,
				title: this.editmodal.items[2].value,
				sdate: new Date(this.editmodal.items[5].picker.date),
				edate: new Date(this.editmodal.items[6].picker.date),
				maxcount: Number(this.editmodal.items[7].value),
				input_box: inputId,
				type: 'c',
				duplicate: this.editmodal.items[10].swit.value,
				status: status,
				inputBoxType: inputTypeSelect,
				endLink: this.editmodal.items[11].value,
				population: populationId,
				AccessPhones: this.editmodal.items[16].value === '' ? '' : JSON.parse(this.editmodal.items[16].value),
				btnText: this.editmodal.items[4].value,
				business: business,
				kakaoLogin: this.editmodal.items[12].check.value,
				showInfo: this.editmodal.items[13].check.value,
				noUserData: this.editmodal.items[14].check.value,
				// selfAlert: this.editmodal.items[18].check.txtfield.value,
			}
			if (event) {
				data.event = event
			} else {
				data.event = null
			}
			if (this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data.multipleUpload[0].id
				data.QRlogo = imageData.data.multipleUpload[1].id
			} else if (this.$store.state.uploadFileData.file && !this.$store.state.uploadFileQrlogo.file) {
				data.mainimg = imageData.data.upload.id
			} else if (!this.$store.state.uploadFileData.file && this.$store.state.uploadFileQrlogo.file) {
				data.QRlogo = imageData.data.upload.id
			}
			this.$store
				.dispatch('updateReserveday', data)
				.then(() => {
					this.$store.state.loading = false
					this.datatable.breakpoint = !this.datatable.breakpoint

					this.editmodal.dialog = false
					this.reservedays(data.groupcode)
				})
				.catch(() => {
					this.$store.state.loading = false
				})
		},
		deleteReserveday(id) {
			const data = {
				id: id,
				groupcode: this.$store.state.datatableItem.groupcode,
				title: this.$store.state.datatableItem.title,
				status: 99,
				type: 'c',
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
			this.$store
				.dispatch('reserveday', data)
				.then(res => {
					this.editmodal.title = '캠페인 관리'
					this.editmodal.dialog = !this.editmodal.dialog
					this.datatable.breakpoint = !this.datatable.breakpoint

					this.editmodal.items[0].sel.value = res.data.reserveday.area
					if (res.data.reserveday.business) {
						this.editmodal.items[0].sel.value = res.data.reserveday.business.title
					}
					this.editmodal.items[1].value = res.data.reserveday.groupcode
					this.editmodal.items[2].value = res.data.reserveday.title
					this.prevTitle = res.data.reserveday.title

					if (res.data.reserveday.mainimg) {
						this.editmodal.items[3].value = res.data.reserveday.mainimg.name
					} else {
						this.editmodal.items[3].value = ''
					}
					if (res.data.reserveday.btnText) {
						this.editmodal.items[4].value = res.data.reserveday.btnText
					} else {
						this.editmodal.items[4].value = '시작하기'
					}
					this.editmodal.items[5].picker.date = this.$moment(res.data.reserveday.sdate).format('YYYY-MM-DD')
					this.editmodal.items[6].picker.date = this.$moment(res.data.reserveday.edate).format('YYYY-MM-DD')
					this.editmodal.items[7].value = String(res.data.reserveday.maxcount)
					// / inputbox Id 이용하여 Name 검색
					if (res.data.reserveday.input_box) {
						let inputValue = res.data.reserveday.input_box.id
						let inputindex = this.editmodal.items[8].sel.inputItems.findIndex(e => e.id === inputValue)
						let inputName = this.editmodal.items[8].sel.inputItems[inputindex].name

						this.editmodal.items[8].sel.value = inputName
					} else {
						this.editmodal.items[8].sel.value = '없음'
					}

					this.editmodal.items[9].sel.value = '드래그'

					this.editmodal.items[10].swit.value = res.data.reserveday.duplicate
					if (res.data.reserveday.endLink) {
						this.editmodal.items[11].value = res.data.reserveday.endLink
					} else {
						this.editmodal.items[11].value = ''
					}
					if (res.data.reserveday.kakaoLogin) {
						this.editmodal.items[12].check.value = res.data.reserveday.showInfo
					} else {
						this.editmodal.items[12].check.value = false
					}

					this.editmodal.items[13].check.value = res.data.reserveday.showInfo

					if (res.data.reserveday.noUserData) {
						this.editmodal.items[14].check.value = res.data.reserveday.noUserData
					} else {
						this.editmodal.items[14].check.value = false
					}

					if (res.data.reserveday.population) {
						let populationValue = res.data.reserveday.population
						let populationindex = this.editmodal.items[15].sel.inputItems.findIndex(e => e.id === populationValue)
						let populationName = this.editmodal.items[15].sel.inputItems[populationindex].name

						this.editmodal.items[15].sel.value = populationName
						this.editmodal.items[16].value = ''
						this.editmodal.items[15].disable = false
					} else {
						this.editmodal.items[15].disable = false
						this.editmodal.items[15].sel.value = '없음'
					}
					if (res.data.reserveday.accessPhones) {
						this.editmodal.items[16].value = res.data.reserveday.accessPhones.join(',')
						this.editmodal.items[16].csvImport = false
						this.editmodal.items[15].sel.value = '없음'
					} else {
						this.editmodal.items[16].csvImport = false
						this.editmodal.items[16].value = ''
					}
					if (res.data.reserveday.event) {
						this.editmodal.items[17].sel.value = res.data.reserveday.event.title
					} else {
						this.editmodal.items[17].sel.value = '없음'
					}
					// if (res.data.reserveday.selfAlert !== '' && res.data.reserveday.selfAlert) {
					// 	this.editmodal.items[18].check.value = true
					// 	this.editmodal.items[18].check.txtfield.value = res.data.reserveday.selfAlert
					// } else {
					// 	this.editmodal.items[18].check.value = false
					// }
					this.showAdd = !this.showAdd
				})
				.catch(() => {})
		},
		clickEditBtn() {
			this.reserveday(this.$store.state.meData.group.groupcode)
			this.SetDialogAlertModal.onceDone = false
		},
		clickSaveBtn() {
			this.$store.state.loading = true
			let ok = 0

			if (this.editmodal.items[0].sel.value === '') {
				ok += 1
				this.editmodal.items[0].sel.errorMessage = 'Please enter the required value (*).'
			} else {
				this.editmodal.items[0].sel.errorMessage = ''
			}
			if (this.editmodal.items[1].value === '') {
				ok += 1
				this.editmodal.items[1].txtfield.errorMessage = 'Please enter the required value (*).'
			} else {
				this.editmodal.items[1].txtfield.errorMessage = ''
			}
			if (this.editmodal.items[2].value === '') {
				ok += 1
				this.editmodal.items[2].txtfield.errorMessage = 'Please enter the required value (*).'
			} else {
				this.editmodal.items[2].txtfield.errorMessage = ''
			}
			if (this.editmodal.items[5].picker.date === '') {
				ok += 1
				this.editmodal.items[5].picker.errorMessage = 'Please enter the required value (*).'
			} else {
				this.editmodal.items[5].picker.errorMessage = ''
			}
			if (this.editmodal.items[6].picker.date === '') {
				ok += 1
				this.editmodal.items[6].picker.errorMessage = 'Please enter the required value (*).'
			} else {
				this.editmodal.items[6].picker.errorMessage = ''
			}
			if (this.editmodal.items[8].sel.value === '') {
				ok += 1
				this.editmodal.items[8].sel.errorMessage = 'Please enter the required value (*).'
			} else {
				this.editmodal.items[8].sel.errorMessage = ''
			}

			if (ok === 0) {
				if (this.datatable.noweditting !== -1) {
					if (this.$store.state.uploadFileData.file) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							file: this.$store.state.uploadFileData.file,
						}
						this.$store
							.dispatch('fileUpload', fileData)
							.then(res => {
								this.updateReserveday(this.$store.state.datatableItem.id, res)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					} else {
						this.updateReserveday(this.$store.state.datatableItem.id)
					}
				} else {
					if (this.$store.state.uploadFileData.file) {
						const fileData = {
							groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
							file: this.$store.state.uploadFileData.file,
						}
						this.$store
							.dispatch('fileUpload', fileData)
							.then(res => {
								this.createReserveday(res)
							})
							.catch(() => {
								this.$store.state.loading = false
							})
					} else {
						this.createReserveday()
					}
				}
			} else {
				this.$store.state.loading = false
			}
		},

		cancelBack() {
			if (this.showAdd == true) {
				this.datatable.headers.push({ text: '비고', width: '200', align: 'center', value: 'action' })
			}
			this.datatable.breakpoint = !this.datatable.breakpoint
			this.editmodal.dialog = false
			this.showAdd = true
		},
		clickAddBtn() {
			this.editmodal.title = '캠페인 등록'
			this.datatable.noweditting = -1
			this.editmodal.items[0].sel.value = ''
			this.editmodal.items[0].sel.value = ''
			this.editmodal.items[1].value = this.sel.value
			this.editmodal.items[2].value = ''
			this.editmodal.items[3].value = ''
			this.editmodal.items[4].value = '시작하기'
			this.editmodal.items[5].picker.date = ''
			this.editmodal.items[6].picker.date = ''
			this.editmodal.items[7].value = ''

			this.editmodal.items[8].sel.value = ''
			this.editmodal.items[9].sel.value = '드래그'

			this.editmodal.items[10].swit.value = false
			this.editmodal.items[11].value = ''
			this.editmodal.items[12].check.value = false
			this.editmodal.items[13].check.value = false
			this.editmodal.items[14].check.value = false

			this.editmodal.items[15].sel.value = '없음'
			this.editmodal.items[15].disable = false
			this.editmodal.items[16].value = ''
			this.editmodal.items[16].csvImport = false
			this.editmodal.items[17].sel.value = '없음'
			// this.editmodal.items[18].check.value = false
			// this.editmodal.items[18].check.txtfield.value = ''
			// this.messages()
			this.datatable.breakpoint = !this.datatable.breakpoint
			this.editmodal.dialog = !this.editmodal.dialog
			this.SetDialogAlertModal.onceDone = false
			if (this.editmodal.dialog) {
				this.datatable.headers.pop()
			} else {
				this.datatable.headers.push({ text: '비고', width: '200', align: 'center', value: 'action' })
			}
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
			let inputPast = []
			this.inputBoxes.forEach(item => {
				if (item.groupcode === filterType) {
					inputItem.push({ name: item.name, id: item.id })
					inputSels.push(item.name)
					inputPast.push(item.name)
				}
			})
			this.editmodal.items[8].sel.items = inputPast
			this.editmodal.items[8].sel.inputItems = inputItem

			// this.editmodal.items[10].sel.items = inputSels
			// this.editmodal.items[10].sel.inputItems = inputItem

			this.editmodal.items[15].sel.items = inputPast
			this.editmodal.items[15].sel.inputItems = inputItem

			// this.messages()
		},
		reserveAllow(val) {
			let start = this.$moment(this.editmodal.items[5].picker.date).format('YYMMDD')
			val = this.$moment(val).format('YYMMDD') > start
			return val
		},
		reserveAllowStart(val) {
			let start = this.$moment(this.editmodal.items[6].picker.date).format('YYMMDD')
			val = this.$moment(val).format('YYMMDD') < start
			return val
		},

		reserveAllow2(val) {
			let start = this.$moment(this.editmodal.items[5].picker.date).format('YYMMDD')
			let end = this.$moment(this.editmodal.items[6].picker.date).format('YYMMDD')
			if (!this.editmodal.items[6].picker.date) {
				return (val = null)
			} else {
				val = this.$moment(val).format('YYMMDD') >= start && this.$moment(val).format('YYMMDD') <= end
				return val
			}
		},
		setNotime() {
			// 시작 시간에 맞춰 끝나는 시간, 제외시간 select box 아이템 변화
			let sitem = this.editmodal.items[15].timeRange.startRange.items
			let value = this.editmodal.items[15].timeRange.startRange.value
			let eValue = this.editmodal.items[15].timeRange.endRange.value
			let endRangeItem = []
			let notimeItem = []
			sitem.forEach(e => {
				if (e > value) {
					endRangeItem.push(e)
				}
				if (e >= value && e <= eValue) {
					notimeItem.push(e)
				}
			})

			this.editmodal.items[15].timeRange.endRange.items = endRangeItem
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
