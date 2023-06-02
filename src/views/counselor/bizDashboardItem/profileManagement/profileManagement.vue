<template>
	<div>
		<div class="counselor_container">
			<div class="sticky_wrap_type">
				<div class="top_sticky_header">
					<v-layout justify-center align-center class="tab_name_bar">
						<div class="header_left_btn">
							<v-btn icon x-large @click="to_bizDashboard()">
								<v-icon>
									mdi-chevron-left
								</v-icon>
							</v-btn>
							<div style="align-self:center">
								프로필 관리
							</div>
						</div>
						<v-btn rounded depressed small color="#633efd" class="ml-auto white--text" @click="openPreview()">
							미리보기
						</v-btn>
					</v-layout>
				</div>
				<v-layout justify-center class="pa-5 basic_content profile_manage_wrap" wrap>
					<v-flex xs12 class="manage_title">홍보영역 구성하기</v-flex>

					<!-- 프로필 사진 -->
					<v-flex xs12 class="mb-4">
						<v-flex xs12 class="part_title">프로필사진 올리기</v-flex>
						<v-flex xs12 class="display_flex">
							<v-text-field
								class="manage_input"
								readonly
								hideDetails
								dense
								:autofocus="false"
								outlined
								maxlength="255"
								flat
								color="primary2"
								v-model="profile_img.value"
								autocomplete="off"
							></v-text-field>

							<v-btn depressed class="profile_addBtn" @click="input_click('main_img_input')">
								추가하기
							</v-btn>

							<input
								type="file"
								style="display:none;"
								id="main_img_input"
								@change="fileUploadChange($event, 'profile')"
								accept="image/jpeg,image/gif,image/png"
							/>
						</v-flex>
						<v-flex xs12 class="pt-1">
							<div class="input_guide">권장사이즈 : 720 x720 / 지원파일 : jpg, png, gif</div>
						</v-flex>
					</v-flex>
					<!-- 프로필 end-->

					<!-- 메인배너 -->
					<v-flex xs12 class="mb-4">
						<v-flex xs12 class="part_title">메인배너 꾸미기</v-flex>
						<v-layout wrap class="mb-2">
							<v-flex xs3 v-for="(banner, index) in main_banner" :key="'img' + index">
								<div class="add_card">
									<v-img :src="banner.url"></v-img>
									<v-btn icon tile color="black" class="banner_deleteBtn" x-small @click="delete_banner(index)">
										<v-icon> mdi-close</v-icon>
									</v-btn>
								</div>
							</v-flex>

							<v-flex xs3 v-for="index in main_banner.length > 4 ? 1 : 4 - main_banner.length" :key="'add' + index">
								<div class="add_card" @click="input_click('main_banner_input')">
									<v-icon large color="#c4c4c4">
										mdi-plus
									</v-icon>
								</div>
							</v-flex>
						</v-layout>

						<v-flex xs12 class="display_flex">
							<v-text-field
								class="manage_input"
								readonly
								hideDetails
								dense
								:autofocus="false"
								outlined
								maxlength="255"
								flat
								color="primary2"
								v-model="main_banner_add.value"
								autocomplete="off"
							></v-text-field>

							<v-btn depressed class="profile_addBtn" @click="input_click('main_banner_input')">
								추가하기
							</v-btn>

							<input
								type="file"
								style="display:none;"
								id="main_banner_input"
								multiple
								@change="fileUploadChange($event, 'banner')"
								accept="image/jpeg,image/gif,image/png"
							/>
						</v-flex>
						<v-flex xs12 class="pt-1">
							<div class="input_guide">권장사이즈 : 720 x 960 ~ 1280 / 지원파일 : jpg, png, gif</div>
						</v-flex>
					</v-flex>
					<!-- 메인배너 end -->

					<!-- 소개/안내/소셜미디어 -->
					<v-flex xs12 class="mb-4" v-for="(category, index) in text_item" :key="'category' + index">
						<v-flex xs12 class="part_title mb-3">{{ category.title }}</v-flex>

						<v-layout wrap class="part_title" v-for="(input, idx) in category.items" :key="'input' + idx">
							<v-flex xs3 class="display_flex profile_input_title"> {{ input.title }}</v-flex>
							<!-- 타입별 input 구분 -->

							<!-- textarea -->
							<v-flex xs9 class="display_flex" v-if="input.type === 'textarea'">
								<v-textarea
									:rows="input.row"
									class="manage_input"
									outlined
									hideDetails
									dense
									no-resize
									v-model="input.value"
									color="primary2"
								></v-textarea>
							</v-flex>

							<!-- textfield -->
							<v-flex xs9 class="display_flex" v-else-if="input.type === 'textfield'">
								<v-text-field
									class="manage_input"
									hideDetails
									dense
									:autofocus="false"
									outlined
									maxlength="255"
									flat
									color="primary2"
									v-model="input.value"
									autocomplete="off"
								></v-text-field>
							</v-flex>

							<!-- count -->
							<v-flex xs9 class="display_flex" v-else-if="input.type === 'count'">
								<v-flex xs4 class="display_flex">
									<v-text-field
										class="manage_input pr-2"
										hideDetails
										dense
										:autofocus="false"
										outlined
										maxlength="255"
										flat
										color="primary2"
										v-model="input.value1"
										autocomplete="off"
									></v-text-field>
								</v-flex>
								<v-flex xs4 class="display_flex">
									<v-text-field
										class="manage_input pr-2"
										hideDetails
										dense
										:autofocus="false"
										outlined
										maxlength="255"
										flat
										color="primary2"
										v-model="input.value2"
										autocomplete="off"
									></v-text-field>
								</v-flex>
								<v-flex xs4 class="display_flex">
									<v-text-field
										class="manage_input"
										hideDetails
										dense
										:autofocus="false"
										outlined
										maxlength="255"
										flat
										color="primary2"
										v-model="input.value3"
										autocomplete="off"
									></v-text-field>
								</v-flex>
							</v-flex>
						</v-layout>
					</v-flex>
					<!-- 소개/안내/소셜미디어 end -->
				</v-layout>
			</div>
		</div>

		<!-- footer -->
		<v-layout justify-center wrap class="profile_footer">
			<v-flex xs6>
				<v-btn block tile class="profile_endBtn" @click="to_bizDashboard()">
					확인
				</v-btn>
			</v-flex>
			<v-flex xs6>
				<v-btn block tile dark color="primary2" class="profile_saveBtn" @click="open_saveDialog()">
					저장
				</v-btn>
			</v-flex>
		</v-layout>

		<!--  저장 확인 -->
		<comfirmDialog :dialog="comfirmDialog" :activeClick="activeClick" />

		<!-- 저장  완료 -->
		<comfirmDialog :dialog="doneDialog" />

		<!-- 저장  불가 -->
		<comfirmDialog :dialog="alertDialog" />

		<previewDialog :dialog="preveiwDialog" :profile_img="profile_img" :main_banner="main_banner" :text_item="text_item" />
	</div>
</template>
<script>
import previewDialog from './previewDialog.vue'
import { comfirmDialog } from '@/components'
// import changeTime from '../../../../utils/timeRange2.js'
// import tiems from '../../../../utils/times'
export default {
	components: {
		// counselorFooter,
		comfirmDialog,
		previewDialog,
	},
	data() {
		return {
			profile_img: {
				id: '',
				file: {},
				url: '',
				value: '',
			},
			main_banner_add: { file: [], url: '', value: '' },
			main_banner: [],

			text_item: [
				// 0
				{
					title: '소개글 작성하기',
					items: [
						{
							type: 'textarea',
							title: '메인 소개글',
							row: '1',
							value: '',
						},
						{
							type: 'textarea',
							title: '상세 소개글',
							row: '4',
							value: '',
						},
						{
							type: 'textfield',
							title: '버튼명',
							value: '',
						},
					],
				},
				// 1
				{
					title: '실적 작성하기',
					items: [
						{
							type: 'textarea',
							title: '소개글',
							row: '1',
							value: '',
						},
						{
							type: 'count',
							title: '실적건수',
							value1: '',
							value2: '',
							value3: '',
						},
					],
				},
				// 2
				{
					title: '구독안내 작성하기',
					items: [
						{
							type: 'textarea',
							title: '소개글',
							row: '1',
							value: '',
						},

						{
							type: 'textfield',
							title: '버튼명',
							value: '',
						},
					],
				},
				// 3
				{
					title: '소셜미디어 정보',
					items: [
						{
							type: 'textfield',
							name: 'sns_kakao',
							title: 'kakao',
							value: '',
						},
						{
							type: 'textfield',
							name: 'sns_facebook',
							title: '페이스북',
							value: '',
						},

						{
							type: 'textfield',
							name: 'sns_twitter',
							title: '트위터',
							value: '',
						},
						{
							type: 'textfield',
							name: 'sns_youtube',
							title: '유튜브',
							value: '',
						},
						{
							type: 'textfield',
							name: 'sns_instagram',
							title: '인스타',
							value: '',
						},
					],
				},
			],
			comfirmDialog: {
				// 저장 확인 팝업
				open: false,
				title: '',
				content: `프로필 정보를 저장하시겠습니까?`,
				type: 'question',
			},

			doneDialog: {
				// 저장 완료 팝업
				open: false,
				title: '',
				content: `프로필 정보를 저장하였습니다.`,
			},

			alertDialog: {
				// 저장 불가 팝업
				open: false,
				content: ``,
				detail: '',
				type: 'alert',
			},

			preveiwDialog: {
				open: true,
			},
		}
	},

	async created() {
		if (this.$route.query && this.$route.query.tab) {
			this.tab = 1
			if (this.$route.query.status === 'waiting') {
				this.status_filter.value = 'waiting'
			}
		}

		this.$store.state.loading = true
		await this.me()
	},
	mounted() {
		this.$store.state.footerMobileStatus = false
	},
	destroyed() {
		this.$store.state.footerMobileStatus = true
	},
	methods: {
		async me() {
			await this.$store
				.dispatch('me')
				.then(async res => {
					if (res.personalPage) {
						await this.personalPage(res.personalPage)
					}
				})
				.catch(() => {
					this.$router.push({ name: 'block' })
				})
			this.$store.state.loading = false
		},
		async personalPage(id) {
			let variable = {
				id: id,
			}
			await this.$store.dispatch('personalPage', variable).then(res => {
				let data = res.personalPage
				this.profile_img.id = data.profileImg ? data.profileImg.id : ''
				this.profile_img.url = data.profileImg ? process.env.VUE_APP_BACKEND_URL + data.profileImg.url : ''
				this.profile_img.value = data.profileImg ? data.profileImg.name : ''
				this.text_item[0].items[0].value = data.introduction_title
				this.text_item[0].items[1].value = data.introduction_content
				this.text_item[0].items[2].value = data.introduction_button
				this.text_item[1].items[0].value = data.count_title
				this.text_item[1].items[1].value1 = data.counsel_count
				this.text_item[1].items[1].value2 = data.client_count
				this.text_item[1].items[1].value3 = data.contract_count
				this.text_item[2].items[0].value = data.subscribe_title
				this.text_item[2].items[1].value = data.subscribe_button
				this.text_item[3].items = data.sns
				data.mainBanner.forEach(el => {
					el.url = process.env.VUE_APP_BACKEND_URL + el.url
				})
				this.main_banner = data.mainBanner
			})
		},
		to_bizDashboard() {
			// 뒤로가기 버튼
			this.$router.push({
				name: 'counselorBizDashboard',
				params: { id: this.$route.params.id },
			})
		},

		fileUploadChange(e, target) {
			if (target === 'profile') {
				let img = new Image()
				img.src = window.URL.createObjectURL(e.target.files[0])

				img.onload = () => {
					// - 권장 사이즈 : 720px*720px
					if (img.width !== 720 || img.height !== 720) {
						return this.open_disable_dialog({ content: '이미지 업로드 불가', detail: `720px * 720px 이미지를 업로드해주세요.` })
					} else {
						this.profile_img.value = e.target.files[0].name
						this.profile_img.file = e.target.files[0]
						this.profile_img.url = URL.createObjectURL(e.target.files[0])
						this.profile_img.id = ''
					}
				}
			} else if (target === 'banner') {
				let img = new Image()
				img.src = window.URL.createObjectURL(e.target.files[0])

				img.onload = () => {
					// - 권장 사이즈 : 720px*720px
					if (img.width !== 720 || !(img.height >= 960 && img.height <= 1280)) {
						return this.open_disable_dialog({ content: '이미지 업로드 불가', detail: `720px * 960px ~ 1280px 이미지를 업로드해주세요.` })
					} else {
						this.main_banner_add.value = e.target.files[0].name + (e.target.files.length > 1 ? `외 ${e.target.files.length - 1}개` : '')
						this.main_banner_add.file = e.target.files[0]
						this.main_banner_add.url = URL.createObjectURL(e.target.files[0])

						for (let index = 0; index < e.target.files.length; index++) {
							this.main_banner.push({
								url: URL.createObjectURL(e.target.files[index]),
								file: e.target.files[index],
							})
						}
					}
				}
			}
		},
		input_click(id) {
			document.getElementById(id).click()
		},
		open_disable_dialog(data) {
			this.alertDialog.open = true
			this.alertDialog.content = data.content
			this.alertDialog.detail = data.detail
		},
		delete_banner(index) {
			this.main_banner.splice(index, 1)
		},

		open_saveDialog() {
			this.comfirmDialog.open = true
		},

		async activeClick() {
			this.comfirmDialog.open = false

			// 프로필이미지 업로드
			let mainImg = this.profile_img.id
			if (!mainImg && this.profile_img.value) {
				let input = {
					files: this.profile_img.file,
				}
				await this.$store.dispatch('upload', input).then(res => {
					mainImg = res.data[0].id
					this.profile_img.id = res.data[0].id
				})
			}

			// 배너이미지 업로드
			for (let index = 0; index < this.main_banner.length; index++) {
				if (!this.main_banner[index].id) {
					let input = {
						files: this.main_banner[index].file,
					}

					await this.$store.dispatch('upload', input).then(res => {
						this.main_banner[index]['id'] = res.data[0].id
					})
				}
			}

			let mainBanner = this.main_banner.map(el => el.id)

			this.$store.state.loading = true

			if (this.$store.state.meData.personalPage) {
				await this.updatePersonalPage(this.$store.state.meData.personalPage, mainImg, mainBanner)
			} else {
				await this.createPersonalPage(mainImg, mainBanner)
			}
		},

		async createPersonalPage(mainImg, mainBanner) {
			let variable = {
				profileImg: mainImg,
				introduction_title: this.text_item[0].items[0].value,
				introduction_content: this.text_item[0].items[1].value,
				introduction_button: this.text_item[0].items[2].value,
				count_title: this.text_item[1].items[0].value,
				counsel_count: this.text_item[1].items[1].value1,
				client_count: this.text_item[1].items[1].value2,
				contract_count: this.text_item[1].items[1].value3,
				subscribe_title: this.text_item[2].items[0].value,
				subscribe_button: this.text_item[2].items[1].value,
				sns: this.text_item[3].items,
				user: this.$store.state.meData.id,
				mainBanner: mainBanner,
				phone: this.$store.state.meData.phone,
			}
			await this.$store.dispatch('createPersonalPage', variable).then(async res => {
				await this.updateUser(res.createPersonalPage.personalPage.id)
				await this.me()
			})
		},

		async updatePersonalPage(id, mainImg, mainBanner) {
			let variable = {
				id: id,
				profileImg: mainImg,
				introduction_title: this.text_item[0].items[0].value,
				introduction_content: this.text_item[0].items[1].value,
				introduction_button: this.text_item[0].items[2].value,
				count_title: this.text_item[1].items[0].value,
				counsel_count: this.text_item[1].items[1].value1,
				client_count: this.text_item[1].items[1].value2,
				contract_count: this.text_item[1].items[1].value3,
				subscribe_title: this.text_item[2].items[0].value,
				subscribe_button: this.text_item[2].items[1].value,
				sns: this.text_item[3].items,
				user: this.$store.state.meData.id,
				mainBanner: mainBanner,
				phone: this.$store.state.meData.phone,
			}
			await this.$store.dispatch('updatePersonalPage', variable).then(() => {
				this.$store.state.loading = false
			})
		},

		async updateUser(personalPage_id) {
			let input = {
				id: this.$store.state.meData.id,
				personalPage: personalPage_id,
			}
			await this.$store.dispatch('updateUser', input).then(() => {})
		},
		openPreview() {
			this.preveiwDialog.open = true
		},
	},
}
</script>
<style lang="scss"></style>
