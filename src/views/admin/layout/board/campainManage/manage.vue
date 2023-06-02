<template>
	<div>
		<div>
			<v-layout align-center mb-4 class="padding_24px whith_header">
				<div class="main_title">
					설문관리
				</div>
				<div class="router_title ml-3">
					캡페인 관리 > 설문관리
				</div>
			</v-layout>

			<v-layout wrap :class="'wrapper margin-setting mb-4'" class="mx-8" justify-center>
				<v-flex
					lg5
					xs12
					class="mr-4"
					style="
    border: 1px solid;
    border-radius: 5px;
		background-color:#f9f9fb !important
"
				>
					<v-layout align-center class="pa-2" style="background-color:white; border-radius: 5px;">
						<div class="slash mr-1"></div>
						<span class="title_Font-Qus"> 설문관리 </span>
						<v-spacer></v-spacer>
						<span class="info-text" style="width:fit-content;">
							※ 해당 설문으로 상담사가 입력하여 고객을 등록합니다.
						</span>
					</v-layout>
					<!-- <v-flex xs12> -->
					<!-- new version -->
					<!-- <v-layout v-if="modeChange === false" column :class="'make-questions mt-0 rounded'"> -->
					<!-- 질문 생성/수정 모듈 -->
					<making-questions :draggableDisable="true" :questions="questions" />
					<!-- </v-layout> -->
					<!-- </v-flex> -->
				</v-flex>
				<v-flex
					lg5
					xs12
					class="ml-4"
					style="
    border: 1px solid;
    border-radius: 5px;"
				>
					<v-layout align-center class="pa-2" style="background-color:white; border-radius: 5px;">
						<div class="slash mr-1"></div>
						<span class="title_Font-Qus"> 미리보기 </span>
					</v-layout>
					<!-- viewport && 순서 바꾸기 -->
					<div class="qus-card " style="overflow-y: hidden; height: auto; border-radius:5px">
						<div class="pre-viewport rounded pt-6 mx-3">
							<v-layout justify-center>
								<v-img
									class="ml-2"
									:src="`${require(`@/assets/images/ico/상담고객정보입력.png`)}`"
									width="150"
									height="150"
									contain
								></v-img>
								<!-- <v-icon style="font-size:10rem; !important" color="primary">mdi-account-details-outline</v-icon> -->
							</v-layout>
							<v-layout justify-center>
								부가정보입력
							</v-layout>
							<v-layout v-for="(item, i) in $store.state.questions" class="viewport-item" :key="i" justify-center>
								<!-- <div v-if="item.type === 'location'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[2].txtfield.value }}</p>
									<div class="mt-2">
										<select-box :sel="searchsel_city1" @change="loc_firstSelect"></select-box>
									</div>
									<div>
										<select-box :sel="searchsel_city2" :disabled="searchsel_city2.disabled" @change="loc_twoSelect"></select-box>
									</div>
									<div>
										<select-box :sel="searchsel_city3" :disabled="searchsel_city3.disabled"></select-box>
									</div>
								</div> -->
								<div v-if="item.qusDatas[0].title.selectBox.value === '단일 선택'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[0].title.txtfield.value }}</p>
									<!-- <pre class="visitexplain">{{ item.qusDatas[0].title.txtfield.value }}</pre> -->
									<v-radio-group v-model="locationSelected" hideDetails row>
										<div v-for="(option, i) in item.qusDatas[0].content" :key="i" class="mb-2">
											<v-divider class="mb-2"></v-divider>
											<v-radio
												:color="$store.state.PointColor1"
												:label="option.txtfield.value"
												:value="option.txtfield.value"
												:ripple="false"
												class="focusColorButton"
											></v-radio>
											<div v-if="option.value === '기타' && locationSelected === '기타'">
												<txtField v-model="txt.value" :txtField="txt" class="mt-5 focusColor" />
											</div>
										</div>
									</v-radio-group>
								</div>
								<div v-else-if="item.qusDatas[0].title.selectBox.value === '다중 선택'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[0].title.txtfield.value }}</p>
									<div class="checkbox-frame" v-for="(item, i) in item.qusDatas[0].content" :key="i">
										<checkBoxIcon2
											:label="item.txtfield.value"
											:color="$store.state.PointColor1"
											style="border-bottom:1px;"
											class="focusColorButton"
										/>
									</div>
								</div>
								<div v-else-if="item.qusDatas[0].title.selectBox.value === '목록 선택박스'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[0].title.txtfield.value }}</p>
									<selectBox_qus :items="item.qusDatas[0].content.map(x => x.txtfield.value)"></selectBox_qus>
								</div>
								<div v-else-if="item.qusDatas[0].title.selectBox.value === '단답 입력'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[0].title.txtfield.value }}</p>
									<txtField v-model="txt.value" :txtField="txt" class="pt-0 bizInput mr-1" style="height:27px; margin:auto" />
								</div>
								<div v-else-if="item.qusDatas[0].title.selectBox.value === '파일 업로드'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[0].title.txtfield.value }}</p>
									<v-layout>
										<txtField v-model="txt.value" :txtField="txt" class="pt-0 bizInput mr-1" style="height:27px; margin:auto" />
										<btn btn_txt="파일첨부" :btn="addBtn2" @click="copyQus(index)" class="mr-2" />
									</v-layout>
								</div>
								<div v-else-if="item.qusDatas[0].title.selectBox.value === '긴문장 입력'" class="width300">
									<p class="surveyName">{{ i + 1 }}. {{ item.qusDatas[0].title.txtfield.value }}</p>
									<v-textarea outlined value=""></v-textarea>
								</div>
								<div v-else-if="item.qusDatas[0].title.selectBox.value === '파일업로드(jpg, png, pdf)'">
									<pre class="visitexplain">{{ item.qusDatas[0].txtfield.value }}</pre>
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
						v-if="this.idData === ''"
						:btn="bottomBtn"
						:class="'check_btn small_action_btn'"
						:style="`background-color:${$store.state.PointColor2}`"
						:btn_txt="'저장'"
						@click="checkDatas('create')"
					></btn>
					<btn
						v-else
						:btn="bottomBtn"
						:class="'check_btn small_action_btn'"
						:style="`background-color:${$store.state.PointColor2}`"
						:btn_txt="'수정'"
						@click="checkDatas()"
					></btn>
				</v-flex>
			</v-layout>
		</div>
		<sweetAlert :dialog="sweetInfo" />
		<sweet-alert :dialog="sweetDialog" @click="clickSave()" />
		<sweet-alert :dialog="sweetDialog2" @click="clickSave2()" />
	</div>
</template>

<script>
import uploadImages from 'vue-upload-drop-images' // 파일 업로드 패키지
import { btn, makingQuestions, sweetAlert, txtField, checkBoxIcon2, selectBox_qus } from '@/components'
// import location1 from '../../../../../utils/location1'
// import location2 from '../../../../../utils/location2'
export default {
	components: {
		btn,
		makingQuestions,
		sweetAlert,
		checkBoxIcon2,
		selectBox_qus,
		uploadImages,
		txtField,
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
			handler() {},
		},
	},
	created() {
		this.$store.state.loading = true
		let ok = 0
		let interval = setInterval(() => {
			ok = ok + 1
			if (this.$store.state.meData) {
				const data = {
					business: this.$store.state.meData.business.id,
				}
				this.inputBoxesView(data)
				clearInterval(interval)
			}
			if (ok === 5) {
				clearInterval(interval)
				this.$store.state.loading = false
				this.$router.push({ name: 'adminLogin' })
			}
		}, 1000)
	},
	methods: {
		typeCheck(val) {
			if (val === 10) {
				return '단일 선택'
			} else if (val == 11) {
				return '다중 선택'
			} else if (val == 12) {
				return '목록 선택박스'
			} else if (val == 20) {
				return '단답 입력'
			} else if (val == 21) {
				return '긴문장 입력'
			} else if (val == 22) {
				return '파일 업로드'
			}
		},
		inputBoxesView(data) {
			this.$store.dispatch('inputBoxes', data).then(res => {
				if (res.inputBoxes.length > 0) {
					this.inputboxData = res.inputBoxes[0]
					this.idData = res.inputBoxes[0].id
					let inputDataArr = []
					res.inputBoxes[0].categories.sort((a, b) => a.listorder - b.listorder)
					for (let index = 0; index < res.inputBoxes[0].categories.length; index++) {
						const element = res.inputBoxes[0].categories[index]
						element.category_details.sort((a, b) => a.listorder - b.listorder)
					}

					res.inputBoxes[0].categories.forEach((element, index) => {
						let qusDatas = {
							id: element.id,
							title: {
								// 설문 질문
								txtfield: {
									value: element.codename,
									maxlength: '255',
									disable: element.fixYn,
									outlined: true,
									hideDetail: true,
									errorMessage: '',
									autocomplete: 'off',
									placeholder: '직접입력',
								},
								// 설문타입
								selectBox: {
									value: this.typeCheck(element.type),
									disable: false,
									errorMessage: '',
									hideDetail: true,
									items: ['단답 입력', '긴문장 입력', '단일 선택', '다중 선택', '목록 선택박스', '파일 업로드'],
									inputItems: [],
									outlined: true,
									class: 'small_font bizInput',
									placeholder: '유형',
								},
								required: element.musthave,
								fixed: element.fixYn,
							},
							content: [],
						}

						let qusData = JSON.parse(JSON.stringify(qusDatas))
						inputDataArr.push({ qusDatas: [qusData] })
						element.category_details.forEach(el => {
							inputDataArr[index].qusDatas[0].content.push({
								id: el.id,
								txtfield: {
									value: el.detailname,
									maxlength: '255',
									disable: element.fixYn,
									outlined: true,
									hideDetail: true,
									errorMessage: '',
									autocomplete: 'off',
									placeholder: '직접입력',
								},
							})
						})
					})

					this.$store.state.questions = inputDataArr
				}
				this.$store.state.loading = false
			})
		},
		checkDatas(type) {
			// if (!this.titleTxt.value) {
			// 	this.sweetInfo.title = '제목 입력'
			// 	this.sweetInfo.content = `제목을 입력해주세요.`
			// 	return (this.sweetInfo.open = true)
			// }
			let ok = 0
			this.$store.state.questions.forEach((el, qusIndex) => {
				if (el.qusDatas[0].title.txtfield.value === '') {
					ok += 1
					this.sweetDialog.open = false
					this.sweetInfo.title = '필수 값 입력'
					this.sweetInfo.content = `문항 ${qusIndex + 1}의 필수값을 입력해주세요.`
					return (this.sweetInfo.open = true)
				}
				el.qusDatas[0].content.forEach(el2 => {
					if (!el2.txtfield.value) {
						ok += 1
						this.sweetDialog.open = false
						this.sweetInfo.title = '필수 값 입력'
						this.sweetInfo.content = `문항 ${qusIndex + 1}의 필수값을 입력해주세요.`
						return (this.sweetInfo.open = true)
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
				name: this.$store.state.meData.business.groupName + '부가정보',
				business: this.$store.state.meData.business.id,
				status: 1,
			}
			this.$store.dispatch('createInputBox', data).then(res => {
				let typeNumber
				this.$store.state.questions.forEach((el, index) => {
					if (el.qusDatas[0].title.selectBox.value === '단일 선택') typeNumber = 10
					else if (el.qusDatas[0].title.selectBox.value == '다중 선택') typeNumber = 11
					else if (el.qusDatas[0].title.selectBox.value == '목록 선택박스') typeNumber = 12
					else if (el.qusDatas[0].title.selectBox.value == '단답 입력') typeNumber = 20
					else if (el.qusDatas[0].title.selectBox.value == '긴문장 입력') typeNumber = 21
					else if (el.qusDatas[0].title.selectBox.value == '파일 업로드') typeNumber = 22
					const data = {
						input_box: res.createInputBox.inputBox.id,
						code: Math.random()
							.toString(36)
							.substring(2, 11),
						codename: el.qusDatas[0].title.txtfield.value,
						// contents: el.qusDatas[2].txtfield.value,
						type: typeNumber,
						stat: 1,
						listorder: index + 1,
						// explain: el.qusDatas[3].txtfield.value,
						musthave: el.qusDatas[0].title.required,
						fixYn: el.qusDatas[0].title.fixed,
						// tag: el.type,
					}
					this.$store.dispatch('createCategory', data).then(res => {
						if (
							res.createCategory.category.type === 10 ||
							res.createCategory.category.type === 11 ||
							res.createCategory.category.type === 12
						) {
							el.qusDatas[0].content
								.map(x => x.txtfield.value)
								.forEach((list, listIndex) => {
									const data = {
										code: res.createCategory.category.code,
										detailcode: Math.random()
											.toString(36)
											.substring(2, 11),
										detailname: list,
										listorder: listIndex + 1,
										stat: 1,
										category: res.createCategory.category.id,
									}
									this.$store.dispatch('createCategoryDetail', data).then(() => {
										if (index === this.$store.state.questions.length - 1) {
											const data = {
												business: this.$store.state.meData.business.id,
											}
											this.inputBoxesView(data)
											this.$store.state.loading = false
										}
									})
								})
						}
					})
				})
			})
			this.sweetDialog2.open = false
			// const data = {
			// 	name: this.$store.state.meData.business.groupName + '부가정보',
			// 	business: this.$store.state.meData.business.id,
			// 	status: 1,
			// }
			// this.$store.dispatch('createInputBox', data).then(res => {
			// 	let typeNumber

			// 	this.$store.state.questions.forEach((el, index) => {
			// 		if (el.qusDatas[0].title.selectBox.value === '단일 선택') typeNumber = 10
			// 		else if (el.qusDatas[0].title.selectBox.value == '다중 선택') typeNumber = 11
			// 		else if (el.qusDatas[0].title.selectBox.value == '목록 선택박스') typeNumber = 12
			// 		else if (el.qusDatas[0].title.selectBox.value == '단답 입력') typeNumber = 20
			// 		else if (el.qusDatas[0].title.selectBox.value == '긴문장 입력') typeNumber = 21
			// 		else if (el.qusDatas[0].title.selectBox.value == '파일 업로드') typeNumber = 22
			// 		const data = {
			// 			input_box: res.createInputBox.inputBox.id,
			// 			code: Math.random()
			// 				.toString(36)
			// 				.substring(2, 11),
			// 			codename: el.qusDatas[0].title.txtfield.value,
			// 			// contents: el.qusDatas[2].txtfield.value,
			// 			type: typeNumber,
			// 			stat: 1,
			// 			listorder: index + 1,
			// 			// explain: el.qusDatas[3].txtfield.value,
			// 			musthave: el.qusDatas[0].required,
			// 			// tag: el.type,
			// 		}
			// 		this.$store.dispatch('createCategory', data).then(res => {
			// 			if (
			// 				res.createCategory.category.type === 10 ||
			// 				res.createCategory.category.type === 11 ||
			// 				res.createCategory.category.type === 12
			// 			) {
			// 				el.qusDatas[0].content
			// 					.map(x => x.txtfield.value)
			// 					.forEach((list, listIndex) => {
			// 						const data = {
			// 							code: res.createCategory.category.code,
			// 							detailcode: Math.random()
			// 								.toString(36)
			// 								.substring(2, 11),
			// 							detailname: list,
			// 							listorder: listIndex + 1,
			// 							stat: 1,
			// 							category: res.createCategory.category.id,
			// 						}
			// 						this.$store.dispatch('createCategoryDetail', data).then(() => {})
			// 					})
			// 			}
			// 			if (index === this.$store.state.questions.length - 1) {
			// 				this.setdialog.dialog = false
			// 				this.sweetDialog2.open = false
			// 				this.$store.state.loading = false
			// 			}
			// 		})
			// 	})
			// })
		},
		clickSave() {
			this.$store.state.loading = true
			// if (this.setdialog.type === 'create') {
			// 	this.$store.state.loading = true
			// 	const data = {
			// 		name: 'test',
			// 		business: this.$store.state.meData.business.id,
			// 		status: 1,
			// 	}
			// 	this.$store.dispatch('createInputBox', data).then(res => {
			// 		let typeNumber
			// 		this.$store.state.questions.forEach((el, index) => {
			// 			if (el.qusDatas[0].title.selectBox.value === '단일 선택') typeNumber = 10
			// 			else if (el.qusDatas[0].title.selectBox.value == '다중 선택') typeNumber = 11
			// 			else if (el.qusDatas[0].title.selectBox.value == '목록 선택박스') typeNumber = 12
			// 			else if (el.qusDatas[0].title.selectBox.value == '단답 입력') typeNumber = 20
			// 			else if (el.qusDatas[0].title.selectBox.value == '긴문장 입력') typeNumber = 21
			// 			else if (el.qusDatas[0].title.selectBox.value == '파일 업로드') typeNumber = 22
			// 			const data = {
			// 				input_box: res.createInputBox.inputBox.id,
			// 				code: Math.random()
			// 					.toString(36)
			// 					.substring(2, 11),
			// 				codename: el.qusDatas[0].title.txtfield.value,
			// 				// contents: el.qusDatas[2].txtfield.value,
			// 				type: typeNumber,
			// 				stat: 1,
			// 				listorder: index + 1,
			// 				// explain: el.qusDatas[3].txtfield.value,
			// 				musthave: el.qusDatas[0].required,
			// 				// tag: el.type,
			// 			}
			// 			this.$store.dispatch('createCategory', data).then(res => {
			// 				if (
			// 					res.createCategory.category.type === 10 ||
			// 					res.createCategory.category.type === 11 ||
			// 					res.createCategory.category.type === 12
			// 				) {
			// 					el.qusDatas[0].content
			// 						.map(x => x.txtfield.value)
			// 						.forEach((list, listIndex) => {
			// 							const data = {
			// 								code: res.createCategory.category.code,
			// 								detailcode: Math.random()
			// 									.toString(36)
			// 									.substring(2, 11),
			// 								detailname: list,
			// 								listorder: listIndex + 1,
			// 								stat: 1,
			// 								category: res.createCategory.category.id,
			// 							}
			// 							this.$store.dispatch('createCategoryDetail', data).then(() => {})
			// 						})
			// 				}
			// 				if (index === this.$store.state.questions.length - 1) {
			// 					this.setdialog.dialog = false
			// 					this.sweetDialog.open = false
			// 					// this.sweetDialog2.open = false
			// 					this.$store.state.loading = false
			// 				}
			// 			})
			// 		})
			// 	})
			// } else
			let arr1 = this.inputboxData.categories.filter(x => x.id).map(x => x.id)
			let arr2 = this.$store.state.questions.filter(x => x.qusDatas[0].id).map(x => x.qusDatas[0].id)
			let deleteCategory = []
			for (let index = 0; index < arr1.length; index++) {
				if (arr2.indexOf(arr1[index]) === -1) {
					deleteCategory.push(arr1[index])
				}
			}
			deleteCategory.forEach(el => {
				this.$store.dispatch('updateCategory', { id: el, input_box: null })
			})

			let arr3 = this.inputboxData.categories.filter(x => x.id && (x.type === 12 || x.type === 11 || x.type === 10))

			let arr3Ids = []
			for (let index = 0; index < arr3.length; index++) {
				arr3Ids.push(...arr3[index].category_details.map(x => x.id))
			}
			let arr4 = this.$store.state.questions.filter(
				x =>
					x.qusDatas[0].id &&
					(x.qusDatas[0].title.selectBox.value === '단일 선택' ||
						x.qusDatas[0].title.selectBox.value === '다중 선택' ||
						x.qusDatas[0].title.selectBox.value === '목록 선택박스'),
			)
			let arr4Ids = []
			for (let index = 0; index < arr4.length; index++) {
				arr4Ids.push(...arr4[index].qusDatas[0].content.filter(x => x.id).map(x => x.id))
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
				id: this.idData,
				name: this.$store.state.meData.business.groupName + ' 부가정보',
				business: this.$store.state.meData.business.id,
				status: 1,
			}
			this.$store.dispatch('updateInputBox', data).then(res => {
				let typeNumber
				this.$store.state.questions.forEach((el, index) => {
					if (el.qusDatas[0].title.selectBox.value === '단일 선택') typeNumber = 10
					else if (el.qusDatas[0].title.selectBox.value == '다중 선택') typeNumber = 11
					else if (el.qusDatas[0].title.selectBox.value == '목록 선택박스') typeNumber = 12
					else if (el.qusDatas[0].title.selectBox.value == '단답 입력') typeNumber = 20
					else if (el.qusDatas[0].title.selectBox.value == '긴문장 입력') typeNumber = 21
					else if (el.qusDatas[0].title.selectBox.value == '파일 업로드') typeNumber = 22
					const data = {
						input_box: res.updateInputBox.inputBox.id,
						code: Math.random()
							.toString(36)
							.substring(2, 11),
						codename: el.qusDatas[0].title.txtfield.value,
						// contents: el.qusDatas[2].txtfield.value,
						type: typeNumber,
						stat: 1,
						listorder: index + 1,
						// explain: el.qusDatas[3].txtfield.value,
						musthave: el.qusDatas[0].title.required,
						fixYn: el.qusDatas[0].title.fixed,
						// tag: el.type,
					}
					if (el.qusDatas[0].id) {
						data.id = el.qusDatas[0].id
						this.$store.dispatch('updateCategory', data).then(res => {
							if (
								res.updateCategory.category.type === 10 ||
								res.updateCategory.category.type === 11 ||
								res.updateCategory.category.type === 12
							) {
								el.qusDatas[0].content.forEach((list, listIndex) => {
									const data = {
										code: res.updateCategory.category.code,
										detailcode: Math.random()
											.toString(36)
											.substring(2, 11),
										detailname: list.txtfield.value,
										listorder: listIndex + 1,
										stat: 1,
										category: res.updateCategory.category.id,
									}
									if (list.id) {
										data.id = list.id
										this.$store.dispatch('updateCategoryDetail', data).then(() => {
											if (index === this.$store.state.questions.length - 1) {
												const data = {
													business: this.$store.state.meData.business.id,
												}
												this.inputBoxesView(data)
												this.$store.state.loading = false
											}
										})
									} else {
										this.$store.dispatch('createCategoryDetail', data).then(() => {
											if (index === this.$store.state.questions.length - 1) {
												const data = {
													business: this.$store.state.meData.business.id,
												}
												this.inputBoxesView(data)
												this.$store.state.loading = false
											}
										})
									}
								})
							} else {
								this.$store.state.loading = false
							}
						})
					} else {
						this.$store.dispatch('createCategory', data).then(res => {
							if (
								res.createCategory.category.type === 10 ||
								res.createCategory.category.type === 11 ||
								res.createCategory.category.type === 12
							) {
								el.qusDatas[0].content
									.map(x => x.txtfield.value)
									.forEach((list, listIndex) => {
										const data = {
											code: res.createCategory.category.code,
											detailcode: Math.random()
												.toString(36)
												.substring(2, 11),
											detailname: list,
											listorder: listIndex + 1,
											stat: 1,
											category: res.createCategory.category.id,
										}

										this.$store.dispatch('createCategoryDetail', data).then(() => {
											if (index === this.$store.state.questions.length - 1) {
												const data = {
													business: this.$store.state.meData.business.id,
												}
												this.inputBoxesView(data)
												this.$store.state.loading = false
											}
										})
									})
							}
						})
					}
				})
			})
			this.sweetDialog.open = false
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
			idData: '',
			addBtn2: {
				class: 'makingBtn',
				small: true,
				width: '70px',
				color: 'primary',
			},
			selectBox: {
				value: '목록 선택박스',
				disable: false,
				errorMessage: '',
				hideDetail: true,
				items: ['단답 입력', '긴문장 입력', '단일 선택', '다중 선택', '목록 선택박스', '파일 업로드'],
				inputItems: [],
				outlined: true,
				class: 'small_font bizInput',
				placeholder: '유형',
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
				open: false,
				title: '문항 저장',
				content: `작성한 문항을
저장합니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
			},
			questions: [],
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
.search_box_type {
	width: auto !important;
	height: 26px !important;

	.v-input__slot {
		height: 26px !important;
		min-height: 26px !important;
	}
	padding: 0 10px !important;
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
.title_Font-Qus {
	font-size: 13px;
}
.info-text {
	font-size: 11px;
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
	height: 70%;

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
