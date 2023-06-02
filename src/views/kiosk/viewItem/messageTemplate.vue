<template>
	<div>
		<div class="wrapper">
			<!-- 검색 --------- start -->
			<v-layout align-center class="header_search">
				<v-layout class="search_wrap" justify-end>
					<!-- 이름 검색 -->

					<v-flex md2 sm3 xs12 class="ml-3 mr-auto">
						<selectBox :sel="business_selectBox" @change="change_project"></selectBox>
					</v-flex>

					<v-flex md2 sm3 xs12>
						<txtField class="search_box_type_friendTalk" v-model="search_name" :txtField="search" @enter="messageTemplates"></txtField>
					</v-flex>
					<v-btn class="search_btn" color="#5d19ff" @click="messageTemplates()"><v-icon>mdi-magnify</v-icon>조회</v-btn>
				</v-layout>
			</v-layout>
			<!-- 검색 ----------- end -->

			<!-- 서브 헤더 --------- start -->
			<v-layout wrap class="mt-5" align-center>
				<v-icon color="#9D9DB7">
					<!-- mdi-magnify -->
					mdi-circle-small
				</v-icon>
				<span class="sub_header">친구톡 템플릿 관리</span>
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
						:previewClick="previewClick"
						excelUseYn="true"
						excelType="freind_talk_tamplate_excel"
					>
					</datatable>
				</v-flex>
			</v-layout>
			<!-- --- 데이터 테이블 -------- end -->
		</div>
		<v-layout justify-end align-items-center class="">
			<btn
				:btn="addBtn"
				:class="'small_action_btn'"
				:style="`background-color:${$store.state.PointColor2}`"
				:btn_txt="'친구톡 템플릿 등록하기'"
				@click="add_friend_talk()"
			></btn>
		</v-layout>

		<!-- 친구톡 자세히 보기 alert -->
		<editmessageDetailDialog :setdialog="detail_dialog" :validation_chceck="validation_chceck" :open_disable_dialog="open_disable_dialog" />
		<!-- 미리보기 팝업  -->
		<previewfriendTalk :setdialog="preview_dialog" />

		<!-- sweetAlet - ${}를 입력해주세요, 완료 팝업 -->
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<sweetAlert :dialog="sweetInfo" />
	</div>
</template>

<script>
// import { VueCsvImport } from 'vue-csv-import'
import { btn, datatable, selectBox, txtField, sweetAlert, previewfriendTalk, editmessageDetailDialog } from '@/components/index.js'
export default {
	components: {
		btn,
		datatable,
		selectBox,
		txtField,
		sweetAlert,
		previewfriendTalk,
		editmessageDetailDialog,
		// VueCsvImport,
	},
	data() {
		return {
			dateChice: true,
			datedisable: true,

			business_selectBox: {
				// 프로젝트 셀렉트박스
				value: '',
				disable: false,
				errorMessage: '',
				hideDetail: true,
				items: [],
				inputItems: [],
				outlined: true,
				filter: true,
				class: 'small_font bizInput dense_selectBox',
				placeholder: '프로젝트를 선택하세요.',
			},

			// --- 데이터 테이블 데이터 --``
			table: {
				datatable: {
					class: 'datatablehover3',
					headers: [],
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

			//검색 데이터
			search_name: '',
			search: {
				placeholder: '템플릿 명을 입력하세요.',
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},

			preview_dialog: {
				// 미리포기 다이어로그
				dialog: false,
				title: '',
				content: ``,
				url: '',
				buttons: [],
			},

			detail_dialog: {
				// 친구톡 템플릿 자세히 보기 다이어로그
				dialog: false,
				type: 'create',
				id: null,
				left_items: [
					// 0
					{
						title: '프로젝트 선택',
						id: 'title',
						type: 'selectBox',
						selectBox: {
							value: '',
							errorMessage: '',
							hideDetail: true,
							items: [],
							outlined: true,
							filter: true,
							class: 'small_font bizInput',
						},
					},

					// 1
					{
						title: '템플릿 제목',
						id: 'title',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
						},
						info: '※ 대체문자 발송시 고객에게 노출되는 제목입니다.',
					},
					// 2
					{
						title: '템플릿 유형',
						id: 'category',
						type: 'radios_group',
						value: '',
						radios: {
							radioSelected: 'nomal',
							items: [
								{ label: '일반대량발송', value: 'nomal' },
								{ label: '변수적용 대량발송', value: 'function' },
							],
						},
					},
					// 3
					{
						title: '템플릿 분류',
						id: 'type',
						type: 'radios_group',
						value: '',
						radios: {
							radioSelected: 'ad',
							items: [
								{ label: '광고', value: 'ad' },
								{ label: '단순알림(공지)', value: 'notice' },
							],
						},
					},
					// 4
					{
						title: '템플릿 형태',
						id: 'talk_type',
						type: 'radios_group',
						value: '',
						radios: {
							radioSelected: 'text',
							items: [
								{ label: '텍스트형', value: 'text' },
								{ label: '이미지형', value: 'img' },
								{ label: '와이드 이미지형', value: 'wideImg' },
							],
						},
					},
					// 5
					{
						title: '이미지 선택',
						id: 'mainImg',

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
						file: { file: {}, url: '' },
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							readonly: true,
							placeholder: '※ jpg / 500kb이하',
							append_close: true,
						},
					},

					// 6
					{
						title: '이미지 링크',
						id: 'imgUrl',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: false,
							disable: true,
						},
					},
					// 7
					{
						title: '버튼정보',
						id: 'buttons',
						type: 'buttons',

						selectBox: {
							value: '웹링크',
							errorMessage: '',
							hideDetail: true,
							items: [
								{
									value: '웹링크',
									text: '웹링크',
								},
							],
							outlined: true,
							class: 'small_font bizInput',
						},
						value_type: '웹링크',
						txtfield_type: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '',
							readonly: true,
						},

						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
						},
						buttons: [],
					},
				],

				middle_items: {
					content: '',
					guide: '※ ㅁ+한자키 유형의 이모티콘만 삽입이 가능합니다.',
				},
				items: [
					//0
					{
						title: '이미지 선택',
						id: 'lmsImg',
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
						file: { file: {}, url: '' },
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							readonly: true,
							append_close: true,
							placeholder: '※ jpg / 200kb이하',
						},
					},
					// 1
					{
						title: '내용',
						id: 'lmsContent',
						type: 'textarea',
						value: ``,
						guide: '※ ㅁ+한자키 유형의 이모티콘만 삽입이 가능합니다.',
					},
				],
			},
			sweetInfo: {
				//  저장불가 팝업
				open: false,
				title: '버튼 추가 불가',
				content: ``,
				modalIcon: 'info',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},

			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '친구톡 템플릿 저장',
				content: `친구톡 템플릿을 저장합니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '확인',
				modalIcon: 'success',
			},

			addBtn: {
				// 추가 버튼
				dark: true,
			},
		}
	},
	async created() {
		this.$store.state.loading = true
		await this.medata()
		await this.reservedays_call()
		await this.messageTemplates()
		this.$store.state.loading = false
	},
	computed: {},
	methods: {
		async medata() {
			await this.$store.dispatch('me').then(() => {})
		},
		async reservedays_call() {
			// 프로젝트 리스트 호출
			let data = {
				show: true,
			}

			if (this.$store.state.meData.role.id !== '1') {
				data['users'] = [this.$store.state.meData.id]
			}
			await this.$store.dispatch('businesses_simple', data).then(res => {
				let data = res.data.businesses
				// data.sort((a, b) => {
				// 	return a.id - b.id
				// })
				let items = data.map(el => {
					return { text: el.title, value: { id: el.id } }
				})

				items.unshift({ text: '전체', value: { id: 'all' } })
				this.business_selectBox.items = items
				this.business_selectBox.value = items[0].value
			})
		},

		async messageTemplates() {
			// 약관 내역 호출
			let variable = {}

			if (this.$store.state.meData.role.id !== '1') {
				if (this.business_selectBox.value.id !== 'all') {
					variable['business'] = this.business_selectBox.value.id
				} else {
					variable['business_in'] = this.business_selectBox.items.map(el => el.value.id)
				}
			} else {
				if (this.business_selectBox.value.id !== 'all') {
					variable['business'] = this.business_selectBox.value.id
				}
			}

			if (this.search_name) {
				variable['title'] = this.search_name
			}
			this.$store.state.loading = true
			await this.$store.dispatch('messageTemplates', variable).then(res => {
				let messageTemplates_data = res.data.messageTemplates
				messageTemplates_data.forEach(el => {
					// 엑셀용 데이터 세팅 == start
					switch (el.category) {
						case 'nomal':
							el['category_text'] = '일반대량발송'
							break
						case 'function':
							el['category_text'] = '변수적용 대량발송'
							break
					}
					switch (el.type) {
						case 'notice':
							el['type_text'] = '단순알림(공지)'
							break
						case 'ad':
							el['type_text'] = '광고'
							break
					}
					switch (el.form) {
						case 'text':
							el['form_text'] = '텍스트형'
							break
						case 'img':
							el['form_text'] = '이미지형'
							break
						case 'wideImg':
							el['form_text'] = '와이드 이미지형'
							break
					}
					el['buttons_text'] = JSON.stringify(el.button)
					el['mainImg_url'] = el.mainImg && el.mainImg.url ? process.env.VUE_APP_CUSTOMER_URL + el.mainImg.url : ''
					el['lmsImg_url'] = el.lmsImg && el.lmsImg.length > 0 ? process.env.VUE_APP_CUSTOMER_URL + el.lmsImg[0].url : ''
					el['created_at_detail'] = this.$moment(el.created_at).format('YYYY-MM-DD HH:mm:ss')
					// 엑셀용 데이터 세팅 == end
				})

				this.set_table_data(messageTemplates_data)
				this.$store.state.loading = false
			})
		},

		set_table_data(term_data) {
			let headers = [
				{ text: '템플릿 명', value: 'title', width: '35%' },
				{ text: '유형', value: 'category_text', width: '20%' },
				{ text: '등록일', value: 'created_at_detail', width: '25%' },
				{ text: '비고', align: 'center', value: 'etc_detail_preview' },
			]
			let tableItems = {
				datatable: {
					class: 'datatablehover3',
					headers: headers,
					items: term_data,
					noweditting: '',
					title: '테스트 타이틀',
					onlyAgree: false,
				},
			}
			this.table = tableItems
		},

		detailClick(item) {
			if (item.business) {
				let project_value = this.$store.state.businesses_list_system.items.filter(el => el.value.id === item.business.id)

				if (project_value.length > 0) {
					this.detail_dialog.left_items[0].selectBox.value = project_value[0].value
				} else {
					this.detail_dialog.left_items[0].selectBox.value = ''
				}
			} else {
				this.detail_dialog.left_items[0].selectBox.value = ''
			}
			this.detail_dialog.left_items[0].selectBox.items = this.$store.state.businesses_list_system.items

			this.detail_dialog.left_items[1].value = item.title
			this.detail_dialog.left_items[2].radios.radioSelected = item.category
			this.detail_dialog.left_items[3].radios.radioSelected = item.type
			this.detail_dialog.left_items[4].radios.radioSelected = item.form
			this.detail_dialog.left_items[5].value = item.mainImg && item.mainImg.name ? item.mainImg.name : ''
			this.detail_dialog.left_items[5].file.file = {}
			this.detail_dialog.left_items[5].file.url =
				item.mainImg && item.mainImg.url ? process.env.VUE_APP_CUSTOMER_URL + item.mainImg.url : ''
			this.detail_dialog.left_items[5].txtfield.placeholder =
				this.detail_dialog.left_items[4].radios.radioSelected === 'wideImg' ? '※ jpg / 2mb이하' : '※ jpg / 500kb이하'

			this.detail_dialog.left_items[6].value = item.imgurl ? item.imgurl : ''
			this.detail_dialog.left_items[6].txtfield.disable = item.form === 'text' ? true : false
			this.detail_dialog.left_items[6].txtfield.readonly = item.form === 'text' ? true : false
			let buttons = []
			item.button.forEach(el => {
				let button = {
					type: {
						name: el.linkTypeName,
						type: el.linkType,
						value: el.name,
					},
				}

				if (el.linkPc || el.linkIos) {
					button['value1'] = {
						name: el.linkPc ? 'PC' : 'ios',
						type: el.linkPc ? 'linkPc' : 'linkIos',
						value: el.linkPc ? el.linkPc : el.linkIos,
					}
				}

				if (el.linkMo || el.linkAnd) {
					button['value2'] = {
						name: el.linkMo ? 'Moblie' : 'ios',
						type: el.linkMo ? 'linkMo' : 'linkAnd',
						value: el.linkMo ? el.linkMo : el.linkAnd,
					}
				}
				buttons.push(button)
			})
			this.detail_dialog.left_items[7].buttons = buttons
			this.detail_dialog.middle_items.content = item.content

			this.detail_dialog.items[0].value = item.lmsImg && item.lmsImg.length > 0 ? item.lmsImg[0].name : ''
			this.detail_dialog.items[0].file.file = {}
			this.detail_dialog.items[0].file.url =
				item.lmsImg && item.lmsImg.length > 0 ? process.env.VUE_APP_CUSTOMER_URL + item.lmsImg[0].url : ''
			this.detail_dialog.items[1].value = item.lmsContent.replace('(광고)\n\n', '').replace('\n\n※무료수신거부 : 080-877-8912', '')
			this.detail_dialog.type = 'edit'
			this.detail_dialog.dialog = true
			this.detail_dialog.id = item.id
		},
		previewClick(item) {
			// 미리보기 클릭

			let preview_buttons = item.button ? item.button : []

			preview_buttons.map(el => {
				return { text: el.name }
			})

			this.preview_dialog.title = item.title
			this.preview_dialog.content = item.content
			this.preview_dialog.buttons = preview_buttons
			this.preview_dialog.url = item.mainImg ? process.env.VUE_APP_CUSTOMER_URL + item.mainImg.url : ''
			this.preview_dialog.dialog = true
		},
		validation_chceck() {
			// 저장 버튼 클릭 시 빈값 체크
			let emoji = /[\u{1F004}-\u{1F9E6}]|[\u{1F600}-\u{1F9D0}]/gu
			if (!this.detail_dialog.left_items[1].value) {
				this.sweetInfo.title = '템플릿 제목'
				this.sweetInfo.content = `템플릿 제목을 입력해주세요.`
				return (this.sweetInfo.open = true)
			} else if (this.detail_dialog.left_items[4].radios.radioSelected !== 'text' && !this.detail_dialog.left_items[5].value) {
				this.sweetInfo.title = '이미지 미선택'
				this.sweetInfo.content = `친구톡 이미지를 업로드해주세요`
				return (this.sweetInfo.open = true)
			} else if (!this.detail_dialog.middle_items.content) {
				this.sweetInfo.title = '친구톡 내용 미입력'
				this.sweetInfo.content = `친구톡 내용을 입력해주세요`
				return (this.sweetInfo.open = true)
			} else if (this.detail_dialog.middle_items.content.match(emoji)) {
				this.sweetInfo.title = '이모티콘 사용불가'
				this.sweetInfo.content = `${this.detail_dialog.middle_items.content.match(emoji).join(', ')} 이모티콘은 사용할 수 없습니다.`
				return (this.sweetInfo.open = true)
			} else if (!this.detail_dialog.items[1].value) {
				this.sweetInfo.title = '대체문자 내용 미입력'
				this.sweetInfo.content = `대체문자 내용을 입력해주세요`
				return (this.sweetInfo.open = true)
			} else if (this.detail_dialog.items[1].value.match(emoji)) {
				this.sweetInfo.title = '이모티콘 사용불가'
				this.sweetInfo.content = `${this.detail_dialog.items[1].value.match(emoji).join(', ')} 이모티콘은 사용할 수 없습니다.`
				return (this.sweetInfo.open = true)
			} else {
				this.sweetDialog.open = true
			}
		},

		async clickSave() {
			// 저장 확인 버튼클릭
			this.$store.state.loading = true
			this.sweetDialog.open = false

			let mainImg
			let lmsImg
			if (this.detail_dialog.left_items[4].radios.radioSelected !== 'text') {
				if (this.detail_dialog.left_items[5].file.file.name) {
					// 메인 이미지 업로드
					await this.$store
						.dispatch('upload', { file: this.detail_dialog.left_items[5].file.file })
						.then(res => {
							mainImg = res.data[0].id
						})
						.catch(() => {})
				}
			}
			if (this.detail_dialog.items[0].file.file.name) {
				// lms 이미지 업로드
				await this.$store
					.dispatch('upload', { file: this.detail_dialog.items[0].file.file })
					.then(res => {
						lmsImg = res.data[0].id
					})
					.catch(() => {})
			}
			if (this.detail_dialog.type === 'create') {
				await this.createMessageTemplate(mainImg, lmsImg)
			} else {
				await this.updateMessageTemplate(mainImg, lmsImg)
			}
		},
		async createMessageTemplate(mainImg, lmsImg) {
			// 템플릿 생성

			let buttons = []

			this.detail_dialog.left_items[7].buttons.forEach((el, index) => {
				let button = {
					ordering: index + 1,
					name: el.type.value,
					linkType: el.type.type,
					linkTypeName: el.type.name,
					text: el.type.value,
				}

				if (el.value1) {
					button[el.value1.type] = el.value1.value
				}
				if (el.value2) {
					button[el.value2.type] = el.value2.value
				}
				buttons.push(button)
			})

			let variable = {
				title: this.detail_dialog.left_items[1].value,
				category: this.detail_dialog.left_items[2].radios.radioSelected,
				type: this.detail_dialog.left_items[3].radios.radioSelected,
				form: this.detail_dialog.left_items[4].radios.radioSelected,
				mainImg: mainImg,
				button: buttons,
				content: this.detail_dialog.middle_items.content,
				lmsContent:
					this.detail_dialog.left_items[3].radios.radioSelected === 'ad'
						? '(광고)\n\n' + this.detail_dialog.items[1].value + '\n\n※무료수신거부 : 080-877-8912'
						: this.detail_dialog.items[1].value,
				lmsImg: lmsImg,
				business: this.detail_dialog.left_items[0].selectBox.value.id,
				imgurl: this.detail_dialog.left_items[4].radios.radioSelected === 'text' ? '' : this.detail_dialog.left_items[6].value,
			}

			await this.$store.dispatch('createMessageTemplate', variable).then(() => {
				this.$store.state.loading = false
				this.detail_dialog.dialog = false
				this.messageTemplates()
			})
		},
		async updateMessageTemplate(mainImg, lmsImg) {
			// 템플릿 수정

			let buttons = []

			this.detail_dialog.left_items[7].buttons.forEach((el, index) => {
				let button = {
					ordering: index + 1,
					name: el.type.value,
					linkType: el.type.type,
					linkTypeName: el.type.name,
					text: el.type.value,
				}

				if (el.value1) {
					button[el.value1.type] = el.value1.value
				}
				if (el.value2) {
					button[el.value2.type] = el.value2.value
				}
				buttons.push(button)
			})
			if (this.detail_dialog.left_items[4].radios.radioSelected === 'text') {
				mainImg = null
			} else if (!this.detail_dialog.left_items[5].value) {
				mainImg = null
			}

			if (!this.detail_dialog.items[0].value) {
				lmsImg = null
			}

			let variable = {
				id: this.detail_dialog.id,
				title: this.detail_dialog.left_items[1].value,
				category: this.detail_dialog.left_items[2].radios.radioSelected,
				type: this.detail_dialog.left_items[3].radios.radioSelected,
				form: this.detail_dialog.left_items[4].radios.radioSelected,
				mainImg: mainImg,
				button: buttons,
				content: this.detail_dialog.middle_items.content,
				lmsContent:
					this.detail_dialog.left_items[3].radios.radioSelected === 'ad'
						? '(광고)\n\n' + this.detail_dialog.items[1].value + '\n\n※무료수신거부 : 080-877-8912'
						: this.detail_dialog.items[1].value,
				lmsImg: lmsImg,
				business: this.detail_dialog.left_items[0].selectBox.value.id,
				imgurl: this.detail_dialog.left_items[4].radios.radioSelected === 'text' ? '' : this.detail_dialog.left_items[6].value,
			}

			await this.$store.dispatch('updateMessageTemplate', variable).then(() => {
				this.$store.state.loading = false
				this.detail_dialog.dialog = false
				this.messageTemplates()
			})
		},
		add_friend_talk() {
			// 친구톡 등록하기 버튼 클릭
			this.detail_dialog.dialog = true
			this.detail_dialog.type = 'create'
			this.detail_dialog.id = null

			this.detail_dialog.left_items[0].selectBox.items = this.$store.state.businesses_list_system.items
			this.detail_dialog.left_items[0].selectBox.value = this.$store.state.businesses_list_system.items[0].value

			this.detail_dialog.left_items.forEach((el, index) => {
				if (index === 1) {
					el.value = 'GS건설 자이'
				} else {
					el.value = ''
				}
				if (el.type === 'radios_group') {
					el.radios.radioSelected = el.radios.items[0].value
				} else if (el.type === 'fileinput') {
					el.file = { file: {}, url: '' }
					el.placeholder = '※ jpg / 500kb이하'
				} else if (el.type === 'buttons') {
					el.buttons = []
				}
			})
			this.detail_dialog.left_items[6].txtfield.readonly = true
			this.detail_dialog.left_items[6].txtfield.disable = true

			this.detail_dialog.middle_items.content = ''

			this.detail_dialog.items.forEach(el => {
				el.value = ''
				if (el.type === 'fileinput') {
					el.file = { file: {}, url: '' }
				}
			})
		},

		open_disable_dialog(data) {
			// 불가 팝업 열기

			this.sweetInfo.title = data.title
			this.sweetInfo.content = data.content
			this.sweetInfo.open = true
		},

		change_project() {
			// 프로젝트 변경
			this.search_name = ''
			this.filter_active = false
			this.messageTemplates()
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
