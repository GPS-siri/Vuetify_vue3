<template>
	<v-dialog v-model="setdialog.dialog" max-width="1440" persistent content-class="qus-dialog">
		<div class="create_wrap display_inline_block">
			<div class="project_title px-5" :style="`background-color:${$store.state.PointColor2}`">
				<!-- text -->
				<h2 style="font-size:15px">문항 {{ setdialog.type === 'create' ? '생성' : '수정' }}</h2>
				<v-spacer />
				<!-- icon -->
				<v-icon @click="setdialog.dialog = false" class="title-icon" color="white">mdi-close</v-icon>
			</div>

			<v-layout class="mx-8 mt-6 mb-2" wrap>
				<v-flex xs6>
					<v-layout align-center>
						<div class="slash mr-1"></div>
						<span class="title_Font-Qus"> 문항작성 </span>
						<v-spacer></v-spacer>
						<span class="info-text" style="margin-right: 37px; width:fit-content;">
							※ 문항유형 : 객관식(단일, 복수선택), 주관식, 파일업로드(jpg, png, pdf)
						</span>
					</v-layout>
				</v-flex>
				<v-flex xs6>
					<v-layout align-center class="ml-4">
						<div class="slash mr-1"></div>
						<span class="title_Font-Qus"> 미리보기 </span>
					</v-layout>
				</v-flex>
			</v-layout>

			<v-layout wrap :class="'wrapper margin-setting mb-4'" class="mx-8">
				<v-flex lg6 xs12 class="pr-4">
					<v-flex xs12>
						<!-- new version -->
						<v-layout v-if="modeChange === false" column :class="'make-questions mr-5 mt-0 rounded'">
							<!-- 질문 생성/수정 모듈 -->
							<making-questions :draggableDisable="true" />
						</v-layout>
					</v-flex>
				</v-flex>
				<v-flex lg6 xs12 class="pl-4">
					<!-- viewport && 순서 바꾸기 -->
					<div class="pre-viewport rounded" style="overflow-y: hidden; 	height: 69vh;">
						<v-layout justify-center align-center class="qus-title-box2 mt-3">
							<div class="qus-title-text" style="width:100px; white-space: nowrap;">
								프로젝트명
								<span>
									(필수)
								</span>
							</div>
							<v-flex class="ml-2">
								<select-box class="project_select_box" :sel="qus_select"></select-box>
							</v-flex>
						</v-layout>
						<v-layout justify-center align-center class="qus-title-box mt-3">
							<div class="qus-title-text" style="width:100px;">
								제목
								<span>
									(필수)
								</span>
							</div>
							<v-flex class="ml-2">
								<txtField class="search_box_type" v-model="titleTxt.value" :txtField="titleTxt"></txtField>
							</v-flex>
						</v-layout>
						<div class="pre-viewport rounded pt-6 mx-3" style="height:59vh !important;">
							<v-layout v-for="(item, i) in $store.state.questions" class="viewport-item" :key="i" justify-center>
								<div v-if="item.type === 'location'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[2].txtfield.value }}</p>
									<div class="mt-2">
										<select-box :sel="$store.state.searchsel_city1_location_defalut" @change="loc_firstSelect_defalut"></select-box>
									</div>
									<div>
										<select-box
											:sel="$store.state.searchsel_city2_location_defalut"
											:disabled="$store.state.searchsel_city2_location_defalut.disabled"
											@change="loc_twoSelect_defalut"
										></select-box>
									</div>
									<div>
										<select-box
											:sel="$store.state.searchsel_city3_location_defalut"
											:disabled="$store.state.searchsel_city3_location_defalut.disabled"
										></select-box>
									</div>
								</div>
								<div v-else-if="item.qusDatas[0].selectBox.value === '객관식(단일선택)'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[2].txtfield.value }}</p>
									<pre class="visitexplain">{{ item.qusDatas[3].txtfield.value }}</pre>
									<v-radio-group v-model="locationSelected" hideDetails>
										<div v-for="(option, i) in item.qusDatas[4].lists" :key="i" class="mb-2">
											<v-divider class="mb-2"></v-divider>
											<v-radio
												:color="$store.state.PointColor1"
												:label="option.value"
												:value="option.value"
												:ripple="false"
												class="focusColorButton"
											></v-radio>
											<div v-if="option.value === '기타' && locationSelected === '기타'">
												<txtField v-model="txt.value" :txtField="txt" class="mt-5 focusColor" />
											</div>
										</div>
									</v-radio-group>
								</div>
								<div v-else-if="item.qusDatas[0].selectBox.value === '객관식(복수선택)'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[2].txtfield.value }}</p>
									<pre class="visitexplain">{{ item.qusDatas[3].txtfield.value }}</pre>
									<div class="checkbox-frame" v-for="(item, i) in item.qusDatas[4].lists" :key="i">
										<checkBoxIcon2 :check="item" :color="$store.state.PointColor1" style="border-bottom:1px;" class="focusColorButton" />
									</div>
								</div>
								<div v-else-if="item.qusDatas[0].selectBox.value === '주관식'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[2].txtfield.value }}</p>
									<pre class="visitexplain">{{ item.qusDatas[3].txtfield.value }}</pre>
									<txtField v-model="txt.value" :txtField="txt" class="mt-5 focusColor" />
								</div>
								<div v-else-if="item.qusDatas[0].selectBox.value === '파일업로드(jpg, png, pdf)'">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[2].txtfield.value }}</p>
									<pre class="visitexplain">{{ item.qusDatas[3].txtfield.value }}</pre>
									<v-divider class="mt-2 mb-3"></v-divider>
									<upload-images
										:uploadMsg="uploadImagesOptions.uploadMsg"
										clearAll=" "
										@changed="handleImages"
										class="imgUploads direction-row"
									/>
								</div>
							</v-layout>
						</div>
					</div>
				</v-flex>
			</v-layout>
			<v-layout class="mt-4 mb-5 mx-8">
				<v-flex sm12 style="text-align:end;">
					<btn v-if="setdialog.type !== 'create'" class="mr-2" btn_txt="복제" :btn="addBtn" @click="checkDatas('copy')"></btn>
					<btn
						:btn="bottomBtn"
						:class="'check_btn small_action_btn'"
						:style="`background-color:${$store.state.PointColor2}`"
						:btn_txt="'저장'"
						@click="checkDatas()"
					></btn>
				</v-flex>
			</v-layout>
		</div>
		<sweetAlert :dialog="sweetInfo" />
		<sweet-alert :dialog="sweetDialog" @click="clickSave()" />
		<sweet-alert2 :dialog="sweetDialog2" @click="clickSave2()" />
	</v-dialog>
</template>

<script>
import uploadImages from 'vue-upload-drop-images' // 파일 업로드 패키지
import { selectBox, btn, txtField, checkBoxIcon2, makingQuestions, sweetAlert, sweetAlert2 } from '@/components'
import location1 from '../../../utils/location1'
import location2 from '../../../utils/location2'
export default {
	components: {
		selectBox,
		btn,
		uploadImages,
		txtField,
		checkBoxIcon2,
		makingQuestions,
		sweetAlert,
		sweetAlert2,
	},
	props: {
		setdialog: Object,
		validation_chceck: Function,
		add_project: Function,
		delete_project: Function,
	},
	watch: {
		setdialog: {
			deep: true,
			handler() {
				this.systems()
				if (this.setdialog.type === 'edit') {
					this.getBusiness()
					if (this.setdialog.item.business !== null) {
						this.qus_select.value = this.setdialog.item.business
					} else {
						this.qus_select.value = null
					}
					const data = {
						id: this.setdialog.item.id,
					}
					this.$store.dispatch('inputboxes', data).then(res => {
						this.inputboxData = res.data.inputBoxes[0].categories
						const data = JSON.parse(JSON.stringify(res.data.inputBoxes[0]))

						this.titleTxt.value = data.name
						this.$store.state.questions = []
						if (data.categories.map(x => x.tag).indexOf('name') > -1) this.$store.state.check_name = true
						else this.$store.state.check_name = false
						if (data.categories.map(x => x.tag).indexOf('location') > -1) {
							this.$store.state.check_location = true
							if (data.categories[data.categories.map(x => x.tag).indexOf('location')].defalutLocation) {
								this.$store.state.searchsel_city1_location_defalut.value = data.categories[
									data.categories.map(x => x.tag).indexOf('location')
								].defalutLocation.split('_')[0]
								this.loc_firstSelect_defalut(
									data.categories[data.categories.map(x => x.tag).indexOf('location')].defalutLocation.split('_')[0],
								)
								if (data.categories[data.categories.map(x => x.tag).indexOf('location')].defalutLocation.split('_')[1]) {
									this.$store.state.searchsel_city2_location_defalut.value = data.categories[
										data.categories.map(x => x.tag).indexOf('location')
									].defalutLocation.split('_')[1]
								}
								if (data.categories[data.categories.map(x => x.tag).indexOf('location')].defalutLocation.split('_')[2]) {
									this.loc_twoSelect_defalut(
										data.categories[data.categories.map(x => x.tag).indexOf('location')].defalutLocation.split('_')[1],
									)
									this.$store.state.searchsel_city3_location_defalut.value = data.categories[
										data.categories.map(x => x.tag).indexOf('location')
									].defalutLocation.split('_')[2]
								}
							} else {
								this.$store.state.searchsel_city1_location_defalut.value = '서울특별시'
								this.$store.state.searchsel_city2_location_defalut.items = location1['서울특별시'].sort()
								this.$store.state.searchsel_city2_location_defalut.value = '강남구'
								this.$store.state.searchsel_city3_location_defalut.items = location2['서울특별시']['강남구'].sort()
								this.$store.state.searchsel_city3_location_defalut.value = '개포제1동'
							}
						} else this.$store.state.check_location = false
						if (data.categories.map(x => x.tag).indexOf('age') > -1) this.$store.state.check_age = true
						else this.$store.state.check_age = false
						if (data.categories.map(x => x.tag).indexOf('sex') > -1) this.$store.state.check_sex = true
						else this.$store.state.check_sex = false
						if (data.categories.map(x => x.tag).indexOf('qualification') > -1) this.$store.state.check_qualification = true
						else this.$store.state.check_qualification = false
						if (data.categories.map(x => x.tag).indexOf('homeOwnership') > -1) this.$store.state.check_homeOwnership = true
						else this.$store.state.check_homeOwnership = false
						if (data.categories.map(x => x.tag).indexOf('bankBook') > -1) this.$store.state.check_bankBook = true
						else this.$store.state.check_bankBook = false
						if (data.categories.map(x => x.tag).indexOf('purpose') > -1) this.$store.state.check_purpose = true
						else this.$store.state.check_purpose = false
						if (data.categories.map(x => x.tag).indexOf('subscribe') > -1) this.$store.state.check_subscribe = true
						else this.$store.state.check_subscribe = false
						if (data.categories.map(x => x.tag).indexOf('floor') > -1) this.$store.state.check_floor = true
						else this.$store.state.check_floor = false
						if (data.categories.map(x => x.tag).indexOf('houseAcreage') > -1) this.$store.state.check_houseAcreage = true
						else this.$store.state.check_houseAcreage = false
						data.categories
							.sort((a, b) => {
								if (a.listorder > b.listorder) return 1
								if (a.listorder === b.listorder) return 0
								if (a.listorder < b.listorder) return -1
							})
							.forEach((el, elIndex) => {
								let qusData = JSON.parse(JSON.stringify(this.qusDatas))
								if (el.type === 10) qusData[0].selectBox.value = '객관식(단일선택)'
								else if (el.type === 11) qusData[0].selectBox.value = '객관식(복수선택)'
								else if (el.type === 20) qusData[0].selectBox.value = '주관식'
								else if (el.type === 21) qusData[0].selectBox.value = '파일업로드(jpg, png, pdf)'
								qusData.id = el.id
								qusData[0].radio = el.musthave
								qusData[1].txtfield.value = el.codename
								qusData[2].txtfield.value = el.contents
								qusData[3].txtfield.value = el.explain
								let list = []
								for (let index = 0; index < el.category_details.length; index++) {
									if (el.tag === 'qualification')
										list.push({
											id: el.category_details[index].id,
											type: 'text',
											value: el.category_details[index].detailname,
											required: true,
											maxlength: '255',
											outlined: true,
											hideDetail: true,
											errorMessage: '',
											autocomplete: 'off',
											placeholder: '',
											readonly: true,
										})
									else {
										const data = {
											id: el.category_details[index].id,
											type: 'text',
											value: el.category_details[index].detailname,
											required: true,
											maxlength: '255',
											outlined: true,
											hideDetail: true,
											errorMessage: '',
											autocomplete: 'off',
											placeholder: '',
										}
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
										if (el.category_details[index].etc) {
											if (selectItmes.includes(el.category_details[index].etc)) {
												data.value2 = el.category_details[index].etc
												data.val = 'locationType'
											} else {
												data.value2 = el.category_details[index].etc
												data.val = 'houseAcreage'
											}
										}
										list.push(data)
									}
								}
								qusData[4].lists = list.sort((a, b) => {
									if (a.listorder > b.listorder) return 1
									if (a.listorder === b.listorder) return 0
									if (a.listorder < b.listorder) return -1
								})
								this.$store.state.questions.push({
									type: el.tag,
									qusDatas: qusData,
								})
								if (elIndex === data.categories.length - 1) {
									this.$store.state.questions.forEach(el => {
										if (el.type === 'content') {
											el.qusDatas[1].selectBox.items = this.$store.state.systemsDatas.map(x => x.title)
										}
									})
								}
							})
					})
				} else {
					this.$store.state.check_name = true
					this.$store.state.check_sex = true
					this.$store.state.check_age = true
					this.$store.state.check_location = false
					this.$store.state.check_qualification = true
					this.$store.state.check_homeOwnership = true
					this.$store.state.check_bankBook = true
					this.$store.state.check_purpose = true
					this.$store.state.check_subscribe = true
					this.$store.state.check_floor = true
					this.$store.state.check_houseAcreage = true
					this.$store.state.searchsel_city1_location_defalut.value = '서울특별시'
					this.$store.state.searchsel_city2_location_defalut.items = location1['서울특별시'].sort()
					this.$store.state.searchsel_city2_location_defalut.value = '강남구'
					this.$store.state.searchsel_city3_location_defalut.items = location2['서울특별시']['강남구'].sort()
					this.$store.state.searchsel_city3_location_defalut.value = '개포제1동'
					this.getBusiness()
					this.qus_select.value = null
					this.titleTxt.value = ''
				}
			},
		},
	},
	created() {
		this.searchsel_city2.items = location1['서울특별시'].sort()
		this.searchsel_city3.items = location2['서울특별시']['강남구'].sort()
	},
	methods: {
		loc_firstSelect_defalut(val) {
			this.$store.state.searchsel_city2_location_defalut.items = location1[val].sort()
			this.$store.state.searchsel_city2_location_defalut.value = ''
			this.$store.state.searchsel_city3_location_defalut.value = ''
		},
		loc_twoSelect_defalut(val) {
			this.$store.state.searchsel_city3_location_defalut.value = ''
			this.$store.state.searchsel_city3_location_defalut.items = location2[this.$store.state.searchsel_city1_location_defalut.value][
				val
			].sort()
		},
		getBusiness() {
			const data = {
				show: true,
			}
			this.$store.dispatch('businesses', data).then(res => {
				this.businessData = res.data.businesses
				this.qus_select.items = res.data.businesses
			})
		},
		loc_firstSelect(val) {
			this.searchsel_city2.items = location1[val].sort()
			this.searchsel_city2.value = ''
			this.searchsel_city3.value = ''
		},
		loc_twoSelect(val) {
			this.searchsel_city3.value = ''
			this.searchsel_city3.items = location2[this.searchsel_city1.value][val].sort()
		},
		systems() {
			const data = {
				type: 'mainCategory',
				useYn: true,
			}
			this.$store.dispatch('systems', data).then(res => {
				this.$store.state.systemsDatas = res.data.systems
			})
		},
		checkDatas(type) {
			if (!this.qus_select.value) {
				this.sweetInfo.title = '프로젝트 입력'
				this.sweetInfo.content = `프로젝트를 선택해주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.titleTxt.value) {
				this.sweetInfo.title = '제목 입력'
				this.sweetInfo.content = `제목을 입력해주세요.`
				return (this.sweetInfo.open = true)
			}
			if (this.$store.state.questions.map(x => x.type).indexOf('houseAcreage') > -1) {
				const lists = this.$store.state.questions[this.$store.state.questions.map(x => x.type).indexOf('houseAcreage')].qusDatas[4].lists
				for (let index = 0; index < lists.length; index++) {
					if (!lists[index].value || !lists[index].value2) {
						this.sweetInfo.title = '선호하는 평형'
						this.sweetInfo.content = `선호하는 평형의 보기 값을 완성해주세요.`
						return (this.sweetInfo.open = true)
					}
				}
			}
			let ok = 0
			this.$store.state.questions.forEach((el, qusIndex) => {
				el.qusDatas.forEach((el2, index) => {
					if (index === 1 || index === 2) {
						if (!el2.txtfield.value) {
							ok += 1
							this.sweetDialog.open = false
							this.sweetInfo.title = '필수 값 입력'
							this.sweetInfo.content = `문항 ${qusIndex + 1}의 필수값을 입력해주세요.`
							return (this.sweetInfo.open = true)
						}
					}
				})
				if (qusIndex === this.$store.state.questions.length - 1) {
					if (ok === 0) {
						if (type) this.sweetDialog2.open = true
						else this.sweetDialog.open = true
					}
				}
			})
		},
		clickSave2() {
			this.$store.state.loading = true
			const data = {
				name: this.sweetDialog2.addcopy.value,
				status: 1,
			}
			this.$store.dispatch('createInputBox', data).then(res => {
				let typeNumber
				this.$store.state.questions.forEach((el, index) => {
					if (el.qusDatas[0].selectBox.value === '객관식(단일선택)') typeNumber = 10
					else if (el.qusDatas[0].selectBox.value == '객관식(복수선택)') typeNumber = 11
					else if (el.qusDatas[0].selectBox.value == '주관식') typeNumber = 20
					else if (el.qusDatas[0].selectBox.value == '파일업로드(jpg, png, pdf)') typeNumber = 21
					const data = {
						input_box: res.data.createInputBox.inputBox.id,
						code: Math.random()
							.toString(36)
							.substring(2, 11),
						codename: el.qusDatas[1].txtfield.value,
						contents: el.qusDatas[2].txtfield.value,
						type: typeNumber,
						stat: 1,
						listorder: index + 1,
						explain: el.qusDatas[3].txtfield.value,
						musthave: el.qusDatas[0].radio,
						tag: el.type,
						defalutLocation:
							this.$store.state.searchsel_city1_location_defalut.value +
							'_' +
							this.$store.state.searchsel_city2_location_defalut.value +
							'_' +
							this.$store.state.searchsel_city3_location_defalut.value,
					}
					this.$store.dispatch('createCategory', data).then(res => {
						if (res.data.createCategory.category.type === 10 || res.data.createCategory.category.type === 11) {
							el.qusDatas[4].lists.forEach((list, listIndex) => {
								const data = {
									code: res.data.createCategory.category.code,
									detailcode: Math.random()
										.toString(36)
										.substring(2, 11),
									detailname: list.value,
									listorder: listIndex + 1,
									stat: 1,
									category: res.data.createCategory.category.id,
								}
								if (list.value2) data.etc = list.value2
								this.$store.dispatch('createCategoryDetail', data).then(() => {})
							})
						}
						if (index === this.$store.state.questions.length - 1) {
							this.setdialog.dialog = false
							this.sweetDialog2.open = false
							this.$store.state.loading = false
						}
					})
				})
			})
		},
		clickSave() {
			this.$store.state.loading = true
			if (this.setdialog.type === 'create') {
				const data = {
					name: this.titleTxt.value,
					status: 1,
					business: this.qus_select.value.id,
				}
				this.$store.dispatch('createInputBox', data).then(res => {
					let typeNumber
					this.$store.state.questions.forEach((el, index) => {
						if (el.qusDatas[0].selectBox.value === '객관식(단일선택)') typeNumber = 10
						else if (el.qusDatas[0].selectBox.value == '객관식(복수선택)') typeNumber = 11
						else if (el.qusDatas[0].selectBox.value == '주관식') typeNumber = 20
						else if (el.qusDatas[0].selectBox.value == '파일업로드(jpg, png, pdf)') typeNumber = 21
						const data = {
							input_box: res.data.createInputBox.inputBox.id,
							code: Math.random()
								.toString(36)
								.substring(2, 11),
							codename: el.qusDatas[1].txtfield.value,
							contents: el.qusDatas[2].txtfield.value,
							type: typeNumber,
							stat: 1,
							listorder: index + 1,
							explain: el.qusDatas[3].txtfield.value,
							musthave: el.qusDatas[0].radio,
							tag: el.type,
							defalutLocation:
								this.$store.state.searchsel_city1_location_defalut.value +
								'_' +
								this.$store.state.searchsel_city2_location_defalut.value +
								'_' +
								this.$store.state.searchsel_city3_location_defalut.value,
						}
						this.$store.dispatch('createCategory', data).then(res => {
							if (res.data.createCategory.category.type === 10 || res.data.createCategory.category.type === 11) {
								el.qusDatas[4].lists.forEach((list, listIndex) => {
									const data = {
										code: res.data.createCategory.category.code,
										detailcode: Math.random()
											.toString(36)
											.substring(2, 11),
										detailname: list.value,
										listorder: listIndex + 1,
										stat: 1,
										category: res.data.createCategory.category.id,
									}
									if (list.value2) data.etc = list.value2
									if (list.selectBox) data.etc = list.selectBox.value
									this.$store.dispatch('createCategoryDetail', data).then(() => {})
								})
							}
							if (index === this.$store.state.questions.length - 1) {
								this.setdialog.dialog = false
								this.sweetDialog.open = false
								this.$store.state.loading = false
							}
						})
					})
				})
			} else {
				let arr1 = this.inputboxData.filter(x => x.id).map(x => x.id)
				let arr2 = this.$store.state.questions.filter(x => x.qusDatas.id).map(x => x.qusDatas.id)
				let deleteCategory = []
				for (let index = 0; index < arr1.length; index++) {
					if (arr2.indexOf(arr1[index]) === -1) {
						deleteCategory.push(arr1[index])
					}
				}
				deleteCategory.forEach(el => {
					this.$store.dispatch('updateCategory', { id: el, input_box: null })
				})

				let arr3 = this.inputboxData.filter(x => x.id && (x.type === 11 || x.type === 10))
				let arr3Ids = []
				for (let index = 0; index < arr3.length; index++) {
					arr3Ids.push(...arr3[index].category_details.map(x => x.id))
				}
				let arr4 = this.$store.state.questions.filter(
					x =>
						x.qusDatas.id && (x.qusDatas[0].selectBox.value === '객관식(단일선택)' || x.qusDatas[0].selectBox.value === '객관식(복수선택)'),
				)
				let arr4Ids = []
				for (let index = 0; index < arr4.length; index++) {
					arr4Ids.push(...arr4[index].qusDatas[4].lists.filter(x => x.id).map(x => x.id))
				}
				let deleteCategoryDetail = []
				for (let index = 0; index < arr3Ids.length; index++) {
					if (arr4Ids.indexOf(arr3Ids[index]) === -1) {
						deleteCategoryDetail.push(arr3Ids[index])
					}
				}
				deleteCategoryDetail.forEach(el => {
					this.$store.dispatch('updateCategoryDetail', { id: el, category: null }).then(() => {})
				})

				const data = {
					id: this.setdialog.item.id,
					name: this.titleTxt.value,
					business: this.qus_select.value.id,
				}
				this.$store.dispatch('updateInputBox', data)
				let typeNumber
				this.$store.state.questions.forEach((el, index) => {
					if (el.qusDatas[0].selectBox.value === '객관식(단일선택)') typeNumber = 10
					else if (el.qusDatas[0].selectBox.value == '객관식(복수선택)') typeNumber = 11
					else if (el.qusDatas[0].selectBox.value == '주관식') typeNumber = 20
					else if (el.qusDatas[0].selectBox.value == '파일업로드(jpg, png, pdf)') typeNumber = 21
					const data = {
						code: Math.random()
							.toString(36)
							.substring(2, 11),
						codename: el.qusDatas[1].txtfield.value,
						contents: el.qusDatas[2].txtfield.value,
						type: typeNumber,
						stat: 1,
						listorder: index + 1,
						explain: el.qusDatas[3].txtfield.value,
						musthave: el.qusDatas[0].radio,
						tag: el.type,
						defalutLocation:
							this.$store.state.searchsel_city1_location_defalut.value +
							'_' +
							this.$store.state.searchsel_city2_location_defalut.value +
							'_' +
							this.$store.state.searchsel_city3_location_defalut.value,
					}
					if (el.qusDatas.id) {
						data.id = el.qusDatas.id
						this.$store.dispatch('updateCategory', data).then(res => {
							if (res.data.updateCategory.category.type === 10 || res.data.updateCategory.category.type === 11) {
								el.qusDatas[4].lists.forEach((list, listIndex) => {
									const data = {
										code: res.data.updateCategory.category.code,
										detailcode: Math.random()
											.toString(36)
											.substring(2, 11),
										detailname: list.value,
										listorder: listIndex + 1,
										stat: 1,
										category: res.data.updateCategory.category.id,
									}
									if (list.value2) data.etc = list.value2
									if (list.selectBox) data.etc = list.selectBox.value
									if (list.id) {
										data.id = list.id
										this.$store.dispatch('updateCategoryDetail', data).then(() => {})
									} else {
										this.$store.dispatch('createCategoryDetail', data).then(() => {})
									}
								})
							}
							if (index === this.$store.state.questions.length - 1) {
								this.setdialog.dialog = false
								this.sweetDialog.open = false
								this.$store.state.loading = false
							}
						})
					} else {
						data.input_box = this.setdialog.item.id
						this.$store.dispatch('createCategory', data).then(res => {
							if (res.data.createCategory.category.type === 10 || res.data.createCategory.category.type === 11) {
								el.qusDatas[4].lists.forEach((list, listIndex) => {
									const data = {
										code: res.data.createCategory.category.code,
										detailcode: Math.random()
											.toString(36)
											.substring(2, 11),
										detailname: list.value,
										listorder: listIndex + 1,
										stat: 1,
										category: res.data.createCategory.category.id,
									}
									if (list.value2) data.etc = list.value2
									if (list.selectBox) data.etc = list.selectBox.value
									this.$store.dispatch('createCategoryDetail', data).then(() => {})
								})
							}
							if (index === this.$store.state.questions.length - 1) {
								this.setdialog.dialog = false
								this.sweetDialog.open = false
								this.$store.state.loading = false
							}
						})
					}
				})
			}
		},

		handleImages(files) {
			let fileArr = files
			if (fileArr.length > 3) {
				fileArr.pop()
				this.alertModal3.text = '이미지는 3개까지만 등록 가능합니다.'
				this.alertModal3.dialog = true
			}
		},
	},
	data() {
		return {
			businessData: [],
			qus_select: {
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
			searchsel_city1: {
				value: '서울특별시',
				errorMessage: '',
				hideDetail: true,
				items: [
					'서울특별시',
					'부산광역시',
					'인천광역시',
					'대구광역시',
					'대전광역시',
					'광주광역시',
					'울산광역시',
					'세종특별자치시',
					'경기도',
					'강원도',
					'충청북도',
					'충청남도',
					'전라북도',
					'전라남도',
					'경상북도',
					'경상남도',
					'제주특별자치도',
				],
				outlined: true,
				class: 'small_font bizInput',
			},
			searchsel_city2: {
				value: '강남구',
				disabled: true,
				errorMessage: '',
				hideDetail: true,
				items: [],
				outlined: true,
				class: 'small_font bizInput',
			},
			searchsel_city3: {
				value: '개포제1동',
				disabled: true,
				errorMessage: '',
				disable: false,
				hideDetail: true,
				items: [],
				outlined: true,
				class: 'small_font bizInput',
			},
			inputboxData: [],
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
			sweetInfo: {
				open: false,
				title: '',
				content: ``,
				modalIcon: 'info',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},
			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '문항 저장',
				content: `작성한 문항을
저장합니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
			},
			sweetDialog2: {
				// 저장 확인 팝업
				addcopy: {
					value: '',
					maxlength: '255',
					outlined: true,
					hideDetail: true,
					placeholder: '복사할 문항 제목을 입력해주세요.',
					errorMessage: '',
					autocomplete: 'off',
				},
				open: false,
				title: '전체 문항복제',
				setTitle: '문항 복제 완료',
				copyBefore: '복제 합니다',
				copyAfter: '복제가 완료 되었습니다',
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '복제',
				modalIcon: 'success',
			},
			titleTxt: {
				height: '26px',
				value: '',
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				placeholder: '문항제목을 입력하세요.',
			},
			bottomBtn: {
				color: '',
				dark: true,
				width: 100,
				height: 40,
			},
			api: '',
			preveTitle: '',
			modeChange: false, // old / new version mode change 스위치 v-model
			uploadImagesOptions: {
				max: 3,
				uploadMsg: '이미지를 등록해주세요.',
				fileError: '이미지 파일만 등록 할 수 있습니다.',
			},
			selectedTime: '',
			inputStatus: false,
			locationSelected: '',
			draggableDisable: false,
			// viewport 예시 옵션들
			txt: {
				value: '',
				maxlength: '255',
				outlined: true,

				hideDetail: false,
				errorMessage: '',
			},
			addBtn: {
				dark: true,
				color: '#9A9C9B',
				small: true,
				width: '100px',
				outlined: true,
			},
		}
	},
}
</script>

<style lang="scss">
.qus-title-text {
	font-size: 13px;
	font-weight: bold;

	span {
		font-weight: 400;
	}
}
.project_select_box {
	height: 26px !important;
	min-height: 26px !important;
}
.search_box_type {
	width: auto !important;
	height: 26px !important;

	.v-input__slot {
		height: 26px !important;
		min-height: 26px !important;
	}
	font-size: 13px;
	font-weight: bold;
	.v-btn__content {
		color: #fff;
	}
}
.qus-title-box {
	border-top: 1px solid #dddddd;
	border-left: 1px solid #dddddd;
	border-right: 1px solid #dddddd;
	margin-top: 12px !important;
	margin-left: 12px !important;
	margin-right: 12px !important;
	border-radius: 6px 6px 0px 0px;
	padding: 20px;
	height: 70px;
	background-color: #f5f5f5;
}
.qus-title-box2 {
	border-top: 1px solid #dddddd;
	border-left: 1px solid #dddddd;
	border-right: 1px solid #dddddd;
	border-bottom: 1px solid #dddddd;
	margin-top: 12px !important;
	margin-left: 12px !important;
	margin-right: 12px !important;
	border-radius: 6px 6px 6px 6px;
	padding: 20px;
	height: 70px;
	background-color: #f5f5f5;
}
.title_Font-Qus {
	font-size: 20px;
	font-weight: bold;
}
.divider {
	background-color: #fdc85a;
	min-height: 9px;
}
.draggable-switch {
	margin-right: 20px;
	margin-top: 2px;
}
.mt-20 {
	margin-top: 20px;
}
/* .datatable-setting {
	// min-width: 800px !important;
} */
.datatable-setting2 {
	// min-width: 760px !important;
	margin-bottom: 20px;
}
.detail-table-item {
	width: 30%;
	padding: 15px 0 15px 25px;
}
.sortable-ghost {
	/* background-color: #fdc85a; */
	background-color: #ffe1a4;
}
.margin-setting {
	margin: 0 40px 40px !important;
}
.pre-viewport {
	border-radius: 6px;
	padding: 0px 15px 10px 15px;
	/* margin-top: 12px !important; */
	height: 69vh;
	overflow-x: hidden;
	overflow-y: auto;
	background-color: white;
	border: 1px solid #e0e0e0;

	.viewport-item {
		.v-select__slot {
			height: 27px !important;
		}
		.width300 {
			width: 300px;
		}
		padding: 10px 0px;
		// border-bottom: 0.5px dashed #e0e0e0;
	}
}
.make-questions {
	/* padding: 0px 15px 10px 15px; */
	/* padding-bottom: 10px; */
	/* min-height: 600px; */
	background-color: white;
	border: 1px solid #e0e0e0;

	.viewport-item {
		.width300 {
			width: 300px;
		}
		padding: 10px 0px;
		// border-bottom: 0.5px dashed #e0e0e0;
	}
}
.checkbox-frame {
	display: flex;
	flex-direction: row;
	border-bottom: 1px solid rgba(0, 0, 0, 0.12);
	padding-bottom: 8px;
}
.viewport-picker {
	display: flex;
}
.font-white {
	color: white;
}
.font-green {
	color: #4caf50;
}
.font-red {
	color: #ff5252;
}
.imgUploads {
	min-width: 300px;
	display: flex !important;
	flex-wrap: nowrap !important;
	flex-direction: row !important;
	padding-top: 20px;
	padding-right: 50px;
	height: 80%;

	.imgsPreview {
		display: contents !important;
		.imageHolder {
			div {
				display: none !important;
			}

			.plus {
				display: none !important;
			}
		}
	}
}
.mobileSetting {
	padding: 1vh;
}
.qus-dialog {
	overflow-y: auto;
}
</style>
