<template>
	<v-dialog v-model="dialog.open" :return-value.sync="date" persistent width="25vw">
		<v-layout class="dialog_header" :style="`background-color:${$store.state.primary}; height:45px`" align-center>
			관리자 소속회사 추가
			<v-btn class="ml-auto" icon @click="dialog.open = false" dark>
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-layout>
		<v-layout class="padding_30px" wrap style=" background-color:white">
			<!-- 회사명 -->
			<v-flex xs12 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0; border-top: 1px solid #aaaaaa;">
				<v-flex xs4 class="content_title">
					회사명
				</v-flex>

				<!-- 내용  -->
				<v-flex xs8 class="content_wrap">
					<v-layout wrap style="display:block">
						<v-text-field class="text_field" v-model="dialog.name" hideDetails outlined style="width:80%; min-width:200px;"> </v-text-field>
					</v-layout>
				</v-flex>
			</v-flex>

			<v-flex xs12 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
				<v-flex xs4 class="content_title">
					사업자등록번호
				</v-flex>

				<!-- 내용  -->
				<v-flex xs8 class="content_wrap">
					<v-layout wrap style="display:block">
						<v-text-field
							class="text_field"
							v-model="dialog.companyNumber"
							hideDetails
							outlined
							maxlength="13"
							style="width:80%; min-width:200px;"
							@keyup="businessNumCheck(dialog.companyNumber)"
						>
						</v-text-field>
					</v-layout>
				</v-flex>
			</v-flex>

			<!-- 첨부파일 -->
			<v-flex xs12 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
				<v-flex xs4 class="content_title">
					사업자등록증
				</v-flex>

				<!-- 내용  -->
				<v-flex xs8 class="content_wrap">
					<v-layout wrap align-center class="display_inlineFlex">
						<v-flex xs12>
							<v-btn color="primary" style="border-radius:20px" outlined @click="fileUpload()">
								파일첨부
							</v-btn>
						</v-flex>

						<v-flex v-if="dialog.file && dialog.file.name" xs12 class="mt-1">
							<v-chip outlined color="#7d7d7d" close @ @click:close="reset_file()">
								{{ dialog.file && dialog.file.name ? dialog.file.name : '' }}
							</v-chip>
						</v-flex>
					</v-layout>
				</v-flex>

				<input
					type="file"
					style="display:none;"
					id="constructor_add_file_upload"
					@change="fileUploadChange"
					accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
				/>
			</v-flex>
		</v-layout>
		<v-layout style="background-color:white; padding:0px 30px 30px; " align-center justify-center>
			<v-btn elevation="0" height="35" width="120" class="ml-3" style="font-weight:bold;" color="primary" @click="activeSave()">
				{{ dialog.btnTxt }}</v-btn
			>
			<v-btn elevation="0" height="35" width="120" class="ml-3" style="font-weight:bold" outlined @click="dialog.open = false"> 취소</v-btn>
		</v-layout>
	</v-dialog>
</template>

<script>
export default {
	components: {},
	props: {
		dialog: Object,
		activeSave: Function,
	},
	data() {
		return {
			date: new Date().toISOString().substr(0, 10),
		}
	},
	methods: {
		businessNumCheck(item) {
			//사업지 번호 체크
			let value = item.replace(/[^0-9.]/g, '').replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')

			this.dialog.companyNumber = value
		},

		fileUpload() {
			document.getElementById(`constructor_add_file_upload`).click()
		},
		reset_file() {
			this.dialog.file = {
				id: null,
				file: null,
				name: '',
				url: '',
				fileUpload: false,
			}
		},
		fileUploadChange(val) {
			this.dialog.file.file = val.target.files[0]
			this.dialog.file.name = val.target.files[0].name
			this.dialog.file.fileUpload = true
		},

		download() {
			const url = process.env.VUE_APP_BACKEND_URL + this.dialog.file.url
			const link = document.createElement('a')
			link.href = url
			link.target = '_blank'
			link.download = this.dialog.file.name
			link.click()
			link.remove()
			window.URL.revokeObjectURL(url)
		},
	},
}
</script>

<style lang="scss">
.whiteBack {
	background-color: white;
}
.samplePicker {
	background-color: white;
}
</style>
