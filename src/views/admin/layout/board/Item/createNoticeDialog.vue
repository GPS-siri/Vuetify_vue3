<template>
	<v-dialog v-model="dialog.open" persistent content-class="notice-modal" max-width="400">
		<v-layout justify-end class="mb-2">
			<v-btn icon @click="dialog.open = false" color="black">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-layout>
		<v-layout align-center class="mb-4">
			<div class="notice-title" style="width:50px;">제 목</div>
			<v-text-field
				hideDetails
				:autofocus="false"
				outlined
				type="text"
				maxlength="255"
				dense
				v-model="datas.title"
				autocomplete="off"
			></v-text-field>
		</v-layout>
		<v-layout class="mb-4" align-center>
			<div class="notice-title" style="width:50px;">내용</div>
			<v-textarea
				hideDetails
				no-resize
				:autofocus="false"
				outlined
				type="text"
				maxlength="255"
				dense
				v-model="datas.content"
				autocomplete="off"
			></v-textarea>
		</v-layout>
		<v-layout align-center class="mb-8">
			<div class="notice-title" style="width:66px;">첨부파일</div>
			<v-text-field
				hideDetails
				:autofocus="false"
				readonly
				outlined
				type="text"
				maxlength="255"
				prepend-inner-icon="mdi-paperclip"
				dense
				v-model="datas.fileName"
				autocomplete="off"
			></v-text-field>
			<input type="file" style="display:none;" id="createNoticeDialog_file_upload" @change="fileUpload" />
			<v-btn elevation="0" height="40" width="100" class="ml-3" color="point1" @click="clickUpload()">
				<span style="color:white;	font-weight: bold;"> 파일첨부 </span>
			</v-btn>
		</v-layout>
		<v-layout justify-end>
			<v-btn elevation="0" height="40" width="100" color="primary" dark @click="addNotice">
				공지사항 추가
			</v-btn>
		</v-layout>
	</v-dialog>
</template>
<script>
export default {
	props: {
		dialog: Object,
	},
	data() {
		return {
			datas: {
				title: '',
				content: '',
				file: {
					name: '',
				},
				fileName: '',
			},
		}
	},
	watch: {
		dialog: {
			deep: true,
			handler() {
				if (this.dialog.id) {
					this.datas.title = this.dialog.item.title
					this.datas.content = this.dialog.item.content
					if (this.dialog.item.file) {
						this.datas.file = this.dialog.item.file
						this.datas.fileName = this.dialog.item.file.name
					}
				} else {
					this.datas.title = ''
					this.datas.content = ''
					this.datas.file = { name: '' }
					this.datas.fileName = ''
				}
			},
		},
	},
	methods: {
		addNotice() {
			if (!this.datas.title) alert('제목을 입력해 주세요.')
			if (!this.datas.content) alert('내용을 입력해 주세요.')
			if (this.datas.fileName) {
				const data = {
					files: this.datas.file,
				}
				this.$store.dispatch('upload', data).then(res => {
					if (this.dialog.id) {
						this.updateNotice(res.data[0])
					} else {
						this.createNotice(res.data[0])
					}
				})
			} else {
				if (this.dialog.id) {
					this.updateNotice()
				} else {
					this.createNotice()
				}
			}
		},
		createNotice(file) {
			let data = {
				title: this.datas.title,
				content: this.datas.content,
				business: this.dialog.businessId,
			}
			if (this.datas.fileName) {
				data.file = file.id
			}
			this.$store.dispatch('createNotice', data).then(() => {
				this.dialog.open = false
			})
		},
		updateNotice(file) {
			let data = {
				id: this.dialog.id,
				title: this.datas.title,
				content: this.datas.content,
				business: this.dialog.businessId,
			}
			if (this.datas.fileName) {
				data.file = file.id
			}
			this.$store.dispatch('updateNotice', data).then(() => {
				this.dialog.open = false
			})
		},
		fileUpload(val) {
			this.datas.file = val.target.files[0]
			this.datas.fileName = val.target.files[0].name
		},
		clickUpload() {
			document.getElementById(`createNoticeDialog_file_upload`).click()
		},
	},
}
</script>
