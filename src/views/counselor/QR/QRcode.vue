<template>
	<v-dialog v-model="dialogQr.open" persistent content-class="qr-modal-type" max-width="400">
		<v-layout class="qr-header" align-center>
			<div class="main-title-type">
				출근(퇴근) 등록하기
			</div>
			<v-btn icon @click="dialogQr.open = false" class="pr-8">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-layout>
		<div wrap>
			<div class="px-10">
				<div class="qr_name_type mt-6">
					{{ dialogQr.meData.name }} {{ dialogQr.meData.team ? dialogQr.meData.team.title : '-' }}
					{{ dialogQr.meData.rank ? dialogQr.meData.rank.title : '-' }}
				</div>
				<div class="qr_name_type mt-1">
					{{ dayCheck(dialogQr.meData.created_at) }}
				</div>
				<vue-qrcode :value="dialogQr.code" class="qr-code" />
				<div class="qr_info_type" style="color:#633efd">QR리더기에 스캔하면,</div>
				<div class="qr_info_type mb-8" style="color:#633efd">출/퇴근 등록이 완료 됩니다.</div>
			</div>

			<v-btn
				style="font-weight:bold; "
				color="primary2"
				dark
				depressed
				width="100%"
				max-width="400"
				height="40"
				@click="dialogQr.open = false"
			>
				확인
			</v-btn>
		</div>
	</v-dialog>
</template>
<script>
import VueQrcode from 'vue-qrcode'
export default {
	props: {
		dialogQr: Object,
	},
	components: {
		VueQrcode,
	},
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
