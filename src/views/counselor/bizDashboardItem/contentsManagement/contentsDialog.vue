<template>
	<v-dialog v-model="dialog.open" persistent content-class="qr-modal-type" max-width="400">
		<v-layout class="qr-header position_relative" align-center wrap style="height: auto;">
			<v-flex xs12 d-flex align-center class="mt-4 mb-3">
				<div class="main-title-type ">
					{{ dialog.data.title }}
				</div>
				<v-btn icon @click="dialog.open = false" class="dialog_close">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-flex>
			<v-flex xs12 d-flex align-center justify-space-between style="padding: 0 30px;">
				<v-radio-group hide-details v-model="checkstat" row mandatory class="radio_group mt-0">
					<div class="radio_name">상태</div>
					<v-radio class="mr-16" :ripple="false" name="postsdialog" label="공개" :value="true"></v-radio>
					<v-radio :ripple="false" name="postsdialog" label="비공개" :value="false"></v-radio>
				</v-radio-group>
				<v-btn
					rounded
					color="#633efd"
					class="ml-auto white--text"
					style="align-self: center; font-size: 12px; max-height: 30px;"
					@click="confirm_dialog"
					>적용하기</v-btn
				>
			</v-flex>
		</v-layout>

		<div class="pt-6 pb-7 preview_container">
			<div v-if="dialog.data.postImg.length > 0" class=".posts_box" style="padding: 0 30px;">
				<v-img max-width="100%" src="@/assets/logo.png" lazy-src="@/assets/images/preview.jpg" alt="load"></v-img>
			</div>
			<div v-else class=".posts_box" style="padding: 0 30px;">
				<p class="posts_cont_empty" @click="check_status">
					이런! 문제가 발생했습니다! 이미지를 불러올 수 없습니다!
				</p>
			</div>
		</div>
		<v-btn
			@click="dialog.open = false"
			style="font-weight:bold; "
			color="primary2"
			dark
			depressed
			width="100%"
			max-width="400"
			height="50"
			tile
		>
			확인
		</v-btn>
		<comfirmDialog :dialog="sub_confirmDialog" />
		<comfirmDialog :dialog="sub_alertDialog" />
	</v-dialog>
</template>
<script>
import { comfirmDialog } from '@/components'
export default {
	props: {
		dialog: Object,
		listp: Array,
	},
	computed: {
		checkstat: {
			get: function() {
				return this.result
			},
			set: function(newv) {
				return (this.result = newv)
			},
		},
	},

	data() {
		return {
			result: this.check_rel_hide(this.dialog.data.users_permissions_users),
			// 프로필 네비게이션 드로어
			drawer: false,
			sub_confirmDialog: {
				// 확인하기
				open: false,
				title: '',
				content: `서비스 담당자에게 문의하십시오`,
				type: '',
			},
			sub_alertDialog: {
				open: false,
				title: '',
				content: '',
				type: 'alert',
			},
		}
	},
	components: {
		comfirmDialog,
	},
	mounted() {},
	methods: {
		check_status() {},
		confirm_dialog() {
			console.log(this.listp)
			console.log(this.checkstat)
			let rword = this.checkstat ? '공개' : '비공개'
			if (this.dialog.status === this.checkstat) {
				this.alert_dialog()
			} else {
				this.sub_confirmDialog.content = `포스트가 ${rword} 상태로 전환되었습니다.`
				this.sub_confirmDialog.open = true
			}
		},
		alert_dialog() {
			let cont = this.dialog.status ? '공개' : '비공개'
			this.sub_alertDialog.content = `이미 ${cont}되어 있는 포스트입니다.`
			this.sub_alertDialog.open = true
		},
		check_rel_hide(x) {
			if (x.length > 0) {
				for (let i of x) {
					i.id == this.dialog.budid
					return true
				}
			} else {
				return false
			}
		},
	},
}
</script>
<style lang="scss">
.qr-code {
	width: 100%;
}
.qr-text {
	font-size: 14px;
	color: #828282;
}
.qr-modal-type {
	background-color: white;
	border-radius: 0px 41px 0px 41px !important;
	padding: 0px;
}
.qr-header {
	height: 50px;
	.main-title-type {
		padding-left: 30px;
		// color: white;
		font-size: 16px;
		font-weight: bold;
		margin-right: auto;
	}
}
.qr_name_type {
	font-size: 12px;
	color: #633efd;
}
.qr_info_type {
	font-size: 12px;
	color: #633efd;
	text-align: center;
}

.radio_group {
	.radio_name {
		margin-right: 22px;
		font-size: 12px;
		line-height: 18px;
	}

	.v-input--selection-controls__input {
		width: 18px;
		max-width: 18px;
		max-height: 18px;
		height: 18px;
	}
	.v-label {
		font-size: 12px;
		line-height: 18px;
	}
}

.posts_box {
	max-width: 100%;
	.posts_cont {
		max-width: 100%;
	}
}
.posts_cont_empty {
	font-size: 18px;
	text-align: center;
	font-weight: 500;
	padding: 5px;
}
</style>
