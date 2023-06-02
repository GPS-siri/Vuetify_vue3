<template>
	<v-dialog v-model="dialog.open" persistent content-class="qr-modal-type" max-width="400">
		<v-layout class="qr-header" align-center>
			<div class="main-title-type">
				{{ dialog.title }}
			</div>
			<v-btn icon @click="dialog.open = false" class="pr-8">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-layout>
		<div wrap>
			<div class="px-10">
				<div class="mt-1 confirm_dailog_content">
					{{ dialog.content }}
				</div>
				<v-img width="60" style="margin: 30px auto 0px;" :src="image_type()"></v-img>
				<!-- 상세 내용 -->
				<div class="mt-3 confirm_dailog_detail">
					{{ dialog.detail }}
				</div>
			</div>
			<v-btn
				class="mt-10"
				style="font-weight:bold; "
				color="primary2"
				dark
				depressed
				width="100%"
				max-width="400"
				height="50"
				tile
				@click="click_btn()"
			>
				확인
			</v-btn>
		</div>
	</v-dialog>
</template>
<script>
export default {
	props: {
		dialog: Object,
		activeClick: Function,
	},
	components: {},
	methods: {
		dayOfTheWeek(val) {
			if (val === '0') {
				return '(일)'
			} else if (val === '1') {
				return '(월)'
			} else if (val === '2') {
				return '(화)'
			} else if (val === '3') {
				return '(수)'
			} else if (val === '4') {
				return '(목)'
			} else if (val === '5') {
				return '(금)'
			} else if (val === '6') {
				return '(토)'
			}
		},
		dayCheck(val) {
			return (
				this.$moment(val).format('gggg-MM-DD') +
				' ' +
				this.dayOfTheWeek(this.$moment(val).format('e')) +
				' ' +
				this.$moment(val).format('hh:mm:ss')
			)
		},
		image_type() {
			if (this.dialog.type && this.dialog.type === 'question') {
				return require('@/assets/images/ico/ico_question.png')
			} else if (this.dialog.type && this.dialog.type === 'alert') {
				return require('@/assets/images/ico/ico_exclamation.png')
			} else if (this.dialog.type && this.dialog.type === 'customer_question') {
				return require('@/assets/images/ico/ico_exclamation.png')
			} else {
				return require('@/assets/images/ico/ico_check.png')
			}
		},

		click_btn() {
			if (this.dialog.type && this.dialog.type === 'question') {
				this.activeClick()
			} else {
				this.dialog.open = false
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
		font-size: 14px;
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
</style>
