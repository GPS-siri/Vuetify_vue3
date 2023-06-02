<template>
	<v-dialog v-model="dialog.open" :return-value.sync="date" persistent width="60vw">
		<v-layout class="dialog_header" :style="`background-color:${$store.state.primary}; height:45px`" align-center>
			게시글 {{ dialog.type === 'add' ? '등록' : '수정' }}
			<v-btn class="ml-auto" icon @click="dialog.open = false" dark>
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-layout>
		<v-layout class="padding_30px" wrap style=" background-color:white">
			<v-flex xs12 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0; border-top: 1px solid #aaaaaa;">
				<v-flex xs2 class="content_title">
					제목
				</v-flex>

				<!-- 내용  -->
				<v-flex xs10 class="content_wrap">
					<v-layout wrap style="display:block">
						<v-text-field class="text_field" v-model="dialog.title" hideDetails outlined style="width:40%; min-width:200px;">
						</v-text-field>
					</v-layout>
				</v-flex>
			</v-flex>

			<!-- 공개여부 -->
			<v-flex xs6 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
				<v-flex xs4 class="content_title">
					공개여부
				</v-flex>

				<!-- 내용  -->
				<v-flex xs8 class="content_wrap">
					<v-layout wrap class="display_inlineFlex">
						<v-radio-group v-model="dialog.showYn" class="radio-group radio_align mt-0" row hideDetails>
							<v-radio class="mr-7" color="primary" label="공개" :value="true"></v-radio>
							<v-radio color="primary" label="비공개" :value="false"></v-radio>
						</v-radio-group>
					</v-layout>
				</v-flex>
			</v-flex>

			<!-- 공지고정 -->
			<v-flex xs6 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
				<v-flex xs4 class="content_title">
					공지고정
				</v-flex>

				<!-- 내용  -->
				<v-flex xs8 class="content_wrap">
					<v-layout wrap class="display_inlineFlex">
						<v-checkbox class="ml-0 mt-0 check_align" label="고정 공지글" v-model="dialog.fixYn" hideDetails></v-checkbox>
					</v-layout>
				</v-flex>
			</v-flex>

			<!-- 첨부파일 -->
			<v-flex xs12 class="display_flex business-text" style="border-bottom: 1px solid #e0e0e0;">
				<v-flex xs2 class="content_title">
					첨부파일
				</v-flex>

				<!-- 내용  -->
				<v-flex xs10 class="content_wrap">
					<v-layout wrap align-center class="display_inlineFlex">
						<v-btn color="#999999" style="border-radius:10px" outlined @click="fileUpload()">
							파일찾기
						</v-btn>
						<span class="dialog_file_name" @click="download()">
							{{ dialog.file && dialog.file.name ? dialog.file.name : '' }}
						</span>
					</v-layout>
				</v-flex>

				<input
					type="file"
					style="display:none;"
					id="notice_file_upload"
					@change="fileUploadChange"
					accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
				/>
			</v-flex>

			<!-- 에디터 -->
			<v-flex xs12 class="mt-4">
				<quill-editor
					style="height:360px; width:100%; display:inline-block"
					ref="myQuillEditor"
					v-model="dialog.content"
					:options="editorOption"
					@blur="onEditorBlur($event)"
					@focus="onEditorFocus($event)"
					@ready="onEditorReady($event)"
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
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
	components: {
		quillEditor,
	},
	props: {
		dialog: Object,
		activeSave: Function,
	},
	data() {
		return {
			date: new Date().toISOString().substr(0, 10),
			off: 0,
			content: '<h2>I am Example</h2>',
			editorOption: {
				modules: {
					toolbar: [
						['bold', 'italic', 'underline', 'strike'], // <strong>, <em>, <u>, <s>
						[{ list: 'ordered' }, { list: 'bullet' }],
						[{ script: 'sub' }, { script: 'super' }], // <sub>, <sup>
						[{ indent: '-1' }, { indent: '+1' }], // class제어
						// [{ direction: 'rtl' }], //class 제어
						[{ size: ['small', false, 'large', 'huge'] }], //class 제어 - html로 되도록 확인
						[{ font: [] }], // 글꼴 class로 제어
						[{ color: [] }, { background: [] }], //style="color: rgb(230, 0, 0);", style="background-color: rgb(230, 0, 0);"
						[{ align: [] }], // class
						// ["clean"],
						['link', 'image'],
					],
				},
			},
		}
	},
	methods: {
		onEditorBlur() {},
		onEditorFocus() {},
		onEditorReady() {},
		onEditorChange({ html }) {
			this.content = html
		},
		fileUpload() {
			document.getElementById(`notice_file_upload`).click()
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
