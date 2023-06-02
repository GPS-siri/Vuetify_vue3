<template>
	<div class="systemDiv">
		<v-layout>
			<v-flex md12 sm12 xs12 :style="$vuetify.breakpoint.lgAndUp ? 'text-align: -webkit-center;' : ''">
				<breadcrumbs class="titleCrumb" title="System" style="width:90px"></breadcrumbs>
			</v-flex>
		</v-layout>
		<v-layout wrap style="height:60%">
			<!-- 로고 업로드  -->
			<!-- <v-flex xs7 v-if="$vuetify.breakpoint.lg"></v-flex> -->
			<v-flex lg3 md12 sm12 xs12 class="mt-2 pa-2" offset-lg2 style="text-align:-webkit-center; align-self: center;">
				<!-- 미리보기  -->
				<!-- <v-card class="py-10"> -->
				<div class="logoDiv pa-4">
					<v-img style="border-radius: 20px;" v-if="$store.state.logoUrl" contain width="100%" height="100%" :lazy-src="images" />
					<span v-else> Upload logo </span>
				</div>
				<!-- 업로드 버튼 -->
				<div>
					<btn class="mt-3" btn_txt="logo change" :btn="logoBtn" @click="imageUploadClick()"></btn>
				</div>
				<!-- </v-card> -->
			</v-flex>

			<v-file-input
				id="logoFile"
				style="display:none;"
				accept="image/*"
				v-model="file.title"
				outlined
				@change="fileUpload(file)"
			></v-file-input>
			<!-- 컬러 선택 -->
			<v-flex lg6 md12 sm12 xs12 style="align-self: center;">
				<v-layout wrap>
					<!--컬러피커 -->
					<v-flex class="pa-3" lg4 md4 sm6 xs12 v-for="(picker, i) in colorPickers" :key="i">
						<colorPicker :color_picker="picker.color_picker" :value="picker.value"></colorPicker>
					</v-flex>
					<!-- 적용 버튼 -->
					<v-flex xs12 class="btnFlex mb-5 pa-3">
						<btn :btn="resetBtn" btn_txt="Reset" class="mr-3" @click="reset()"></btn>
						<btn :btn="applyBtn" btn_txt="Apply" @click="apply()"> </btn>
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
		<alertModal2 :setdialog="alertModal" />
	</div>
</template>

<script>
import { breadcrumbs, colorPicker, btn, alertModal2 } from '@/components/index'
export default {
	components: { colorPicker, btn, alertModal2, breadcrumbs },
	data() {
		return {
			images: '', // 미리보기
			imageData: {},
			file: {
				title: null,
				outlined: true,
				src: [],
			},
			logoBtn: {
				//로고 업로드 버튼
				dark: true,
				color: this.$store.state.PointColor2,
			},
			resetBtn: {
				// 리셋버튼
				dark: true,
				color: this.$store.state.PointColor2,
			},
			applyBtn: {
				//적용버튼
				dark: true,
				color: this.$store.state.PointColor3,
			},
			colorPickers: [
				//컬러 피커
				{
					color_picker: {
						title: '',
						text: 'MainColor 1',
					},
					color: { color: '' },
					value: { value: this.$store.state.PointColor1 },
				},
				{
					color_picker: {
						title: '',
						text: 'MainColor 2',
					},
					color: { color: '' },
					value: { value: this.$store.state.PointColor2 },
				},
				{
					color_picker: {
						title: '',
						text: 'MainColor 3',
					},
					color: { color: '' },
					value: { value: this.$store.state.PointColor3 },
				},
			],
			alertModal: {
				dialog: false,
				text: '',
			},
		}
	},
	created() {
		this.groups()
		setTimeout(() => {
			this.images = this.$store.state.logoUrl
		}, 1000)
	},
	methods: {
		fileUpload(val) {
			/// 파일업로드
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
				file: val.title,
			}
			this.$store.dispatch('fileUpload', data).then(res => {
				this.images = this.$store.state.backServer + res.data.upload.url
				this.imageData = res
			})
		},
		imageUploadClick() {
			document.getElementById('logoFile').click()
		},
		apply() {
			let colors = []
			this.colorPickers.forEach(e => {
				colors.push(e.value.value)
			})
			let logoUrl
			if (Object.keys(this.imageData).length !== 0) {
				logoUrl = this.imageData.data.upload.id
			} else {
				logoUrl = null
			}
			const data = {
				id: this.$store.state.meData.group.id,
				logo: logoUrl,
				color: colors,
			}
			this.$store
				.dispatch('updateGroup', data)
				.then(() => {
					this.groups()
					this.alertModal.dialog = true
					this.alertModal.text = '저장되었습니다.'
				})
				.catch(() => {})
		},

		groups() {
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
			}
			this.$store
				.dispatch('groups', data)
				.then(res => {
					this.$store.state.groupData = res.data.groups[0]
					if (res.data.groups[0].logo) {
						this.$store.state.logoUrl = this.$store.state.backServer + res.data.groups[0].logo.url
						this.images = this.$store.state.backServer + res.data.groups[0].logo.url
					} else {
						this.$store.state.logoUrl = '/image/logo_transparent.png'
					}
					if (res.data.groups[0].color) {
						res.data.groups[0].color.forEach((e, i) => {
							this.$store.state['PointColor' + (i + 1)] = e
						})
						document.documentElement.style.setProperty('--point1-color', this.$store.state.PointColor1)
						document.documentElement.style.setProperty('--point3-color', this.$store.state.PointColor3)
					}
					this.logoBtn.color = this.$store.state.PointColor2
					this.resetBtn.color = this.$store.state.PointColor2
					this.applyBtn.color = this.$store.state.PointColor3
				})
				.catch(() => {})
		},
		reset() {
			this.images = '/image/logo_transparent.png'
			this.imageData = {}
			this.colorPickers = [
				//컬러 피커
				{
					color_picker: {
						title: '',
						text: 'MainColor 1',
					},
					color: { color: '' },
					value: { value: '#202840' },
				},
				{
					color_picker: {
						title: '',
						text: 'MainColor 2',
					},
					color: { color: '' },
					value: { value: '#202840' },
				},
				{
					color_picker: {
						title: '',
						text: 'MainColor 3',
					},
					color: { color: '' },
					value: { value: '#F2B705' },
				},
			]
		},
	},
}
</script>
<style lang="scss">
.systemDiv {
	width: 100%;
	padding: 20px;
	height: 100%;
}
.logoDiv {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 200px;
	height: 200px;
	border: 1px solid lightgrey;
	border-radius: 20px;
}
.btnFlex {
	text-align: end;
	margin-top: 20px;
}
</style>
