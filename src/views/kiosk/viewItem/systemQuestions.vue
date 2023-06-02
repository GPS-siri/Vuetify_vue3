<template>
	<div>
		<div class="wrapper">
			<v-layout wrap>
				<!-- 수집 항목 관리 --- start -->
				<v-flex xs9>
					<v-layout wrap align-center>
						<div class="slash mr-1"></div>
						<span class="sub_header">수집 항목 관리 </span>
					</v-layout>

					<v-layout wrap>
						<v-flex xs5 class="pr-2">
							<!-- 대분류 코드 --- start -->
							<v-flex class="border_all_wrap">
								<v-layout wrap class="mt-5" align-center>
									<v-icon color="#9D9DB7">
										mdi-circle-small
									</v-icon>
									<span class="sub_header">분류명 </span>
									<div class="all-counselor ml-auto">
										· 전체 코드:
										<span class="count mr-2">
											{{ table_code.datatable.items.length }}
										</span>
										· 사용:
										<span class="count mr-2">
											{{ table_code.datatable.items.filter(x => x.useYn.value === '사용').length }}
										</span>
										· 미사용:
										<span class="count">
											{{ table_code.datatable.items.filter(x => x.useYn.value === '미사용').length }}
										</span>
									</div>
								</v-layout>

								<datatable
									:datatable="table_code.datatable"
									class="tbl-type01 border_all table_top"
									:detailClick="detailClick"
									:applyclick="applyclick"
								>
								</datatable>

								<div class="border_btn_wrap">
									<txtField class="search_box ml-0" v-model="table_basic_code" :txtField="txtField_code"></txtField>
									<btn
										:btn="addBtn"
										:class="'small_action_btn ml-1'"
										:style="`background-color:${$store.state.PointColor2}`"
										:btn_txt="'추가'"
										@click="add_items('code')"
									></btn>
									<btn
										:btn="addBtn"
										:class="'small_action_btn ml-auto'"
										:style="`background-color:${$store.state.PointColor2}`"
										:btn_txt="'모두 적용'"
										@click="save_all(table_code.datatable.items)"
									></btn>
								</div>
							</v-flex>
							<!-- 대분류 코드 --- end -->
						</v-flex>
						<v-flex xs7 class="px-2">
							<!-- 선택 항목--- start -->
							<v-layout wrap class="mt-5" align-center>
								<v-icon color="#9D9DB7">
									mdi-circle-small
								</v-icon>
								<span class="sub_header">선택 항목 </span>
							</v-layout>
							<div class="border_all_top system_camp_wrap mt-5">
								<div class="system_question_detail" style="font-size:13px; font-weight:bold; height:515px; oveflow:auto;">
									<!-- 대분류 분류명  -->
									<v-layout class="pa-0 table_all_gray " wrap style="min-height:55px; border-bottom: 1px solid #d1d1d1;">
										<v-flex xs3 align-self-center style="text-align:center; width:179px">
											<v-flex>
												{{ selected_system.items[0].title }}
											</v-flex>
										</v-flex>

										<v-flex xs9 class="sub_text px-2 table_right_white">
											<v-layout wrap align-center style="height:100%">
												<v-flex xs4 align-self-center class="pr-1">
													<!-- 대분류명 -->
													<txtField
														class="pt-0 bizInput"
														v-model="selected_system.items[0].value"
														:txtField="selected_system.items[0].txtfield"
														style="height:27px; margin:auto"
													></txtField>
												</v-flex>
												<!-- 타입 -->
												<v-flex xs4 class="pl-1" style="padding-top:10px;" align-self-center>
													<select-box
														:disable="!selected_system.items[0].value"
														:sel="selected_system.items[0].selectBox"
														@change="change_detail_type"
													></select-box>
												</v-flex>
												<v-flex xs4 align-self-center>
													<v-radio-group
														:disabled="!selected_system.items[0].value"
														v-model="selected_system.items[0].radio"
														row
														hide-details
														class="pl-1 system-radio-label mb-2 ml-2"
													>
														<v-radio hide-details color="MainColor2" label="필수" :value="true"></v-radio>
														<v-radio hide-details color="MainColor2" label="선택" :value="false"></v-radio>
													</v-radio-group>
												</v-flex>
											</v-layout>
										</v-flex>
									</v-layout>
									<!-- 세부 항목  -->
									<v-layout class="pa-0 table_all_gray" style="hegiht:459px;" wrap>
										<v-flex xs3 align-self-center style="text-align:center; width:179px">
											<v-flex>
												{{ selected_system.items[1].title }}
											</v-flex>
										</v-flex>

										<v-flex xs9 class="sub_text px-2 table_right_white" style="overflow: auto;height: 459px;">
											<!--	<v-flex x8 align-self-center >
												<txtField
													class="pt-0 bizInput"
													v-model="detail.value"
													:txtField="detail"
													style="height:27px; margin:auto"
												></txtField>
											</v-flex> -->

											<v-layout wrap align-center v-for="(detail, i) in selected_system.items[1].details" :key="i">
												<v-flex xs1>
													<div class="text-center">
														<div>
															<v-btn
																class="contentArrow"
																color="grey"
																outlined
																elevation="0"
																width="14"
																height="14"
																x-small
																icon
																@click="upContent(i)"
															>
																<v-icon color="black">mdi-chevron-up</v-icon>
															</v-btn>
														</div>
														<div>
															<v-btn
																class="contentArrow"
																color="grey"
																outlined
																width="14"
																height="14"
																icon
																x-small
																elevation="0"
																@click="downContent(i)"
															>
																<v-icon color="black">mdi-chevron-down</v-icon>
															</v-btn>
														</div>
													</div>
												</v-flex>
												<v-flex xs7 align-self-center>
													<txtField
														class="pt-0 bizInput"
														v-model="detail.value"
														:txtField="detail"
														style="height:27px; margin:auto"
													></txtField>
												</v-flex>
												<v-flex xs4 class="pl-1">
													<v-radio-group v-model="detail.required" row class="system-radio-label mb-2" hide-details>
														<v-radio color="MainColor2" hide-details label="사용" :value="true"></v-radio>
														<v-radio color="MainColor2" hide-details label="미사용" :value="false"></v-radio>
													</v-radio-group>
												</v-flex>
											</v-layout>
											<v-layout class="ml-10" v-if="selected_system.items[0].value">
												<v-btn text color="MainColor2" @click="addContent()" class="addContent">
													+ 보기추가
												</v-btn>
												<v-btn
													v-if="selected_system.items[1].details.filter(x => x.etc).length === 0"
													text
													color="MainColor2"
													class="addContent"
													@click="addEtcContent()"
												>
													+ 기타 보기 추가
												</v-btn>
											</v-layout>
										</v-flex>
									</v-layout>
								</div>
							</div>
							<div class="mt-3" style="display:flex;">
								<btn
									:btn="addBtn"
									:disabled="!selected_system.items[0].value"
									:class="'small_action_btn ml-auto'"
									color="primary"
									:btn_txt="'항목 저장'"
									@click="save_content()"
								></btn>
								<!-- @click="save_all()" -->
							</div>
							<!-- 선택 항목--- end -->
						</v-flex>
					</v-layout>
				</v-flex>
				<!-- 수집 항목 관리 --- end -->

				<!-- 수집 유형 관리 --- start -->
				<v-flex xs3 class="pl-2">
					<v-layout wrap align-center>
						<div class="slash mr-1"></div>
						<span class="sub_header">수집 유형 관리 </span>
					</v-layout>

					<v-layout wrap class="mt-5" align-center>
						<v-icon color="#9D9DB7">
							mdi-circle-small
						</v-icon>
						<span class="sub_header">수집 유형 </span>
						<div class="all-counselor ml-auto">
							· 전체 코드:
							<span class="count mr-2">
								{{ table_collection.datatable.items.length }}
							</span>
							· 사용:
							<span class="count mr-2">
								{{ table_collection.datatable.items.filter(x => x.useYn.value === '사용').length }}
							</span>
							· 미사용:
							<span class="count">
								{{ table_collection.datatable.items.filter(x => x.useYn.value === '미사용').length }}
							</span>
						</div>
					</v-layout>
					<v-layout wrap class="border_all_wrap system_camp_wrap right">
						<datatable :datatable="table_collection.datatable" class="tbl-type01 border_all table_top" :applyclick="applyclick">
						</datatable>

						<div class="border_btn_wrap ">
							<txtField class="search_box ml-0" v-model="table_basic_collection" :txtField="txtField_collection"></txtField>
							<btn
								:btn="addBtn"
								:class="'small_action_btn ml-1'"
								:style="`background-color:${$store.state.PointColor2}`"
								:btn_txt="'추가'"
								@click="add_items('collection')"
							></btn>
						</div>
					</v-layout>
					<div class="mt-3" style="display:flex;">
						<btn
							:btn="addBtn"
							:disabled="!selected_system.items[0].value"
							:class="'small_action_btn ml-auto'"
							:style="`background-color:${$store.state.PointColor2}`"
							:btn_txt="'유형 저장'"
							@click="save_all(table_collection.datatable.items)"
						></btn>
					</div>
				</v-flex>
				<!-- 수집 유형 관리 --- end -->
			</v-layout>
		</div>

		<!-- sweetAlet - ${}를 입력해주세요, 완료 팝업 -->
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<sweetAlert :dialog="sweetDialog2" @click="update_system_content()" />
		<sweetAlert :dialog="sweetInfo" />
	</div>
</template>

<script>
import { btn, datatable, selectBox, txtField, sweetAlert } from '@/components/index.js'
export default {
	components: {
		btn,
		datatable,
		selectBox,
		txtField,

		sweetAlert,
	},
	data() {
		return {
			dateChice: true,
			datedisable: true,

			table_basic: {
				// --- 기본 수집 항목 table--``
				datatable: {
					class: 'datatablehover3',
					headers: [
						{ text: 'No.', width: '71px', value: 'No' },
						{ text: '분류명', value: 'title' },
						{ text: '사용여부', width: '147px', value: 'useYn' },
						{ text: '비고', value: 'etc_apply_edit', width: '180px', align: 'center' },
					],
					items: [],
					hidedefaultfooter: true,
					noweditting: '',
					// title: x.name,
					onlyAgree: false,
					// inputboxId: x.id,
					height: '22.1vh',
				},
				filter: [],
				json_fields: {},
			},
			table_code: {
				// --- 대분류코드 table--``
				datatable: {
					class: 'datatablehover3',
					headers: [
						{ text: 'No.', width: '71px', value: 'No' },
						{ text: '분류명', value: 'title' },
						{ text: '사용여부', width: '147px', value: 'useYn' },
						{ text: '비고', value: 'etc_apply_edit', width: '180px', align: 'center' },
					],
					items: [],
					hidedefaultfooter: true,
					noweditting: '',
					// title: x.name,
					onlyAgree: false,
					// inputboxId: x.id,
					height: '474px',
				},
				filter: [],
				json_fields: {},
			},
			table_collection: {
				// --- 수집 유형 table--``
				datatable: {
					class: 'datatablehover3',
					headers: [
						{ text: 'No.', width: '71px', value: 'No' },
						{ text: '유형명', value: 'title' },
						{ text: '사용여부', width: '147px', value: 'useYn' },
						{ text: '비고', value: 'etc_apply', align: 'center' },
					],
					items: [],
					hidedefaultfooter: true,
					noweditting: '',
					// title: x.name,
					onlyAgree: false,
					// inputboxId: x.id,
					height: '474px',
				},
				filter: [],
				json_fields: {},
			},

			table_basic_normal: '', // 기본 수집 항목 추가명
			table_basic_code: '', // 대분류 코드 추가명
			table_basic_collection: '', // 수집 유형 항목 추가명
			txtField_normal: {
				// 기본 수집 항목 텍스트 필드
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				placeholder: '분류명 입력',
			},
			txtField_code: {
				// 대분류 코드  텍스트 필드
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				placeholder: '분류명 입력',
			},
			txtField_collection: {
				// 수집 유형 항목 텍스트 필드
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				placeholder: '유형 입력',
			},
			selected_system: {
				// 선택항목
				items: [
					//0
					{
						title: '분류명',
						id: 'email_name',
						type: 'txtfield',
						value: '',
						txtfield: {
							readonly: true,
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '분류명',
						},
						selectBox: {
							value: '객관식(단일선택)',
							disable: false,
							errorMessage: '',
							hideDetail: true,
							items: ['객관식(단일선택)', '객관식(복수선택)'],
							inputItems: [],
							outlined: true,
							class: 'small_font bizInput',
							placeholder: '유형',
						},
						radio: true,
					},
					//1
					{
						title: '세부항목',
						details: [],
					},
				],
			},
			reserveUsersInfo: {
				dialog: false,
				reserveList: [],
				datatable: {
					class: 'datatablehover3',
					headers: [],
					items: [],
				},
				name: '',
				phone: '',
				json_fields: {},
			},

			sweetInfo: {
				//  업데이트 완료
				open: false,
				title: '업데이트 완료',
				content: `알림톡 업데이트가
완료되었습니다.`,
				modalIcon: 'info',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},
			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '알림톡 가져오기',
				content: `선택하신 알림톡을 
가져옵니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
				item: [],
				type: '',
			},
			sweetDialog2: {
				// 저장 확인 팝업
				open: false,
				title: '알림톡 가져오기',
				content: `선택하신 알림톡을 
가져옵니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
				item: [],
				type: '',
			},

			addBtn: {
				// 추가 버튼
				dark: true,
			},
		}
	},
	async created() {
		this.$store.state.loading = true
		await this.systems_call()
		this.$store.state.loading = false
	},
	computed: {},
	methods: {
		save_content() {
			this.sweetDialog2.title = '항목 저장'
			this.sweetDialog2.content = `변경(추가)된 항목을
저장합니다`
			this.sweetDialog2.open = true
			this.sweetDialog2.item = {
				id: this.selected_system.id,
				selectType: this.selected_system.items[0].selectBox.value,
				content: this.selected_system.items[1].details,
			}
		},
		addContent() {
			this.selected_system.items[1].details.push({
				type: 'text',
				value: '',
				required: true,
				maxlength: '255',
				outlined: true,
				hideDetail: true,
				errorMessage: '',
				autocomplete: 'off',
				placeholder: '',
			})
		},
		addEtcContent() {
			this.selected_system.items[1].details.push({
				etc: true,
				type: 'text',
				value: '기타',
				required: true,
				readonly: true,
				maxlength: '255',
				outlined: true,
				hideDetail: true,
				errorMessage: '',
				autocomplete: 'off',
				placeholder: '',
			})
		},
		upContent(i) {
			if (i !== 0) {
				const arr = this.selected_system.items[1].details
				const item = arr.splice(i, 1)
				arr.splice(i - 1, 0, item[0])
				this.selected_system.items[1].details = arr
			}
		},
		downContent(i) {
			const data = this.selected_system.items[1].details
			if (i !== data.length - 1) {
				var selectData = data.splice(i, 1)
				data.splice(i + 1, 0, selectData[0])
				this.selected_system.items[1].details = data
			}
		},
		async systems_call(type) {
			// 항목 내역 호출
			let variable = {
				type: type,
			}

			this.$store.dispatch('systems', variable).then(res => {
				let systems_data = res.data.systems
				systems_data.forEach(el => {
					el.useYn = {
						value: el.useYn === true ? '사용' : '미사용',
						disable: false,
						errorMessage: '',
						hideDetail: true,
						items: ['사용', '미사용'],
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput no_min_height',
						placeholder: '',
					}
				})

				let code_items = systems_data.filter(el => el.type === 'mainCategory')
				let collection_items = systems_data.filter(el => el.type === 'collection')
				this.table_code.datatable.items = code_items
				this.table_collection.datatable.items = collection_items
			})
		},

		change_detail_type() {},

		detailClick(item) {
			this.selected_system.id = item.id
			this.selected_system.items[0].value = item.title
			this.selected_system.items[0].selectBox.value = item.selectType ? item.selectType : '객관식(단일선택)'
			if (item.content.length > 0) {
				this.selected_system.items[1].details = item.content
			} else {
				this.selected_system.items[1].details = []
			}
		},

		add_items(type) {
			// 추가 버튼 클릭

			// 미입력 체크
			if (type === 'normal') {
				if (!this.table_basic_normal) {
					this.sweetInfo.title = '분류명 입력'
					this.sweetInfo.content = '분류명을 입력해주세요.'
					return (this.sweetInfo.open = true)
				}
			} else if (type === 'code') {
				if (!this.table_basic_code) {
					this.sweetInfo.title = '분류명 입력'
					this.sweetInfo.content = '분류명을 입력해주세요.'
					return (this.sweetInfo.open = true)
				}
			} else if (type === 'collection') {
				if (!this.table_basic_collection) {
					this.sweetInfo.title = '유형 입력'
					this.sweetInfo.content = '유형을 입력해주세요.'
					return (this.sweetInfo.open = true)
				}
			}

			// 추가
			let useYn_setting = {
				value: '사용',
				disable: false,
				errorMessage: '',
				hideDetail: true,
				items: ['사용', '미사용'],
				inputItems: [],
				outlined: true,
				class: 'small_font bizInput no_min_height',
				placeholder: '',
			}
			if (type === 'normal') {
				this.table_basic.datatable.items.push({
					title: this.table_basic_normal,
					useYn: useYn_setting,
					type: 'nomal',
					new: true,
				})
				this.table_basic_normal = ''
			} else if (type === 'code') {
				this.table_code.datatable.items.push({
					title: this.table_basic_code,
					useYn: useYn_setting,
					type: 'mainCategory',
					new: true,
				})
				this.table_basic_code = ''
			} else if (type === 'collection') {
				this.table_collection.datatable.items.push({
					title: this.table_basic_collection,
					useYn: useYn_setting,
					type: 'collection',
					new: true,
				})
				this.table_basic_collection = ''
			}
		},
		applyclick(item) {
			// 데이터테이블 적용 클릭
			this.save_open(item, 'apply')
		},
		save_open(item, type) {
			// 저장 팝업 열기
			if (type === 'apply') {
				this.sweetDialog.item = [item]
			} else {
				this.sweetDialog.item = item
			}
			this.sweetDialog.type = type
			this.sweetDialog.title = '항목 저장'
			this.sweetDialog.content = `변경(추가)된 항목을
저장합니다`
			this.sweetDialog.open = true
		},
		save_all(item) {
			// 항목 전체 저장
			let new_items = item.filter(el => el.new)
			this.save_open(new_items, 'save_all')
		},
		clickSave() {
			if (this.sweetDialog.item.length > 0) {
				// 개별 적용
				if (this.sweetDialog.item[0].new) {
					this.create_system()
				} else {
					this.update_system()
				}
			} else {
				this.sweetDialog.open = false
			}
		},

		async create_system() {
			this.sweetDialog.item.forEach(async (el, index) => {
				let variable = {
					title: el.title,
					type: el.type,
					useYn: el.useYn.value === '사용' ? true : false,
					content: {},
				}

				this.$store.state.loading = true

				await this.$store
					.dispatch('createSystem', variable)
					.then(async () => {
						if (index === this.sweetDialog.item.length - 1) {
							await this.systems_call()
							this.sweetDialog.open = false
							this.$store.state.loading = false
						}
					})
					.catch(() => {
						// this.sweetInfo.title = '오류 발생'
						// this.sweetInfo.content = `오류가 발생했습니다.`

						// this.sweetInfo.open = true
						this.sweetDialog.open = false
						// 	await this.terms_call()

						this.$store.state.loading = false
					})
			})
		},
		async update_system_content() {
			const el = this.sweetDialog2.item
			let variable = {
				id: el.id,
				selectType: el.selectType,
				content: el.content ? el.content : [],
			}

			this.$store.state.loading = true

			await this.$store
				.dispatch('updateSystem', variable)
				.then(async () => {
					await this.systems_call()
					this.sweetDialog2.open = false
					this.$store.state.loading = false
				})
				.catch(() => {
					this.sweetDialog2.open = false

					this.$store.state.loading = false
				})
		},
		async update_system() {
			this.sweetDialog.item.forEach(async (el, index) => {
				let variable = {
					id: el.id,
					title: el.title,
					type: el.type,
					useYn: el.useYn.value === '사용' ? true : false,
					content: el.content ? el.content : [],
				}

				this.$store.state.loading = true

				await this.$store
					.dispatch('updateSystem', variable)
					.then(async () => {
						if (index === this.sweetDialog.item.length - 1) {
							await this.systems_call()
							this.sweetDialog.open = false
							this.$store.state.loading = false
						}
					})
					.catch(() => {
						// this.sweetInfo.title = '오류 발생'
						// this.sweetInfo.content = `오류가 발생했습니다.`

						// this.sweetInfo.open = true
						this.sweetDialog.open = false
						// 	await this.terms_call()

						this.$store.state.loading = false
					})
			})
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
