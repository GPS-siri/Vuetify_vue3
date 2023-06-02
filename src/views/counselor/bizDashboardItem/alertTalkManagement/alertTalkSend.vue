<template>
	<v-dialog v-model="sendDialog.open" persistent content-class="alert-modal" max-width="400">
		<v-layout class="alert_header" align-center>
			<div class="main-title">
				{{ sendDialog.business.title }}
			</div>
			<v-btn icon @click="sendDialog.open = false" dark class="pr-8" style="color:black;">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-layout>
		<span class="alert_header2">선택한 알림톡을 발송합니다.</span>
		<v-layout v-for="(options, i) in sendlist" :key="i">
			<div class="mt-6 alert_content" style="border:0">
				<span>{{ options.title }}</span>
				<v-select hideDetails dense outlined color="primary2" class="mt-2 search_select_type"></v-select>
			</div>
		</v-layout>
		<v-layout style="margin-top: 110px;">
			<div class="alert_content" style="border:0">
				<span>개별 발송</span>
				<div class="mt-2 pa-3 alert_content" style="margin:0">
					<div>
						<span>고객명</span>
						<v-text-field class="mt-1 text_field" hideDetails outlined></v-text-field>
					</div>
					<div class="my-3">
						<span>연락처</span>
						<v-text-field class="mt-1 text_field" hideDetails outlined></v-text-field>
					</div>
				</div>
			</div>
		</v-layout>
		<v-layout align-center class="mt-6">
			<div class="alert_header2" style="font-size:14px">
				※ 발송건수
			</div>
			<div class="ml-2">
				<v-text-field class="talk_text_field" style="width:80px;" hideDetails outlined></v-text-field>
			</div>
		</v-layout>
		<v-layout align-center class="mt-6">
			<div class="alert_header2" style="font-size:14px">
				※ 예상금액
			</div>
			<div class="ml-2">
				<v-text-field class="talk_text_field" style="width:80px;" hideDetails outlined disabled></v-text-field>
			</div>
			<div class="ml-1 alert_header2" style="font-size:14px; padding:0">
				원 / 건당 8.5원 (VAT별도)
			</div>
		</v-layout>
		<v-layout align-center class="mt-4">
			<div class="alert_header2" style="font-size:14px; padding-right:25px">
				※ 발송 비용은 최종 발송 건수에 따라 월별 이용료에 합산되어 청구됩니다.
			</div>
		</v-layout>
		<v-layout class="mt-5">
			<v-btn class="alert_bottom" style="background:#fff;" @click="sendDialog.open = false">이전</v-btn>
			<v-btn class="alert_bottom" style="background:#633EFD; color:#fff;" @click="checkSend()">다음</v-btn>
		</v-layout>
		<alertDialog :dialogInfo="dialogInfo" />
	</v-dialog>
</template>

<script>
import alertDialog from './alertTalkDialog.vue'

export default {
	data() {
		return {
			dialogInfo: {
				open: false,
				business: {
					title: '알림톡 발송',
					header: '아래 선택 그룹에 알림톡을 발송합니다.',
				},
				table_header: ['선택 그룹', '건수'],
				meData: { created_at: '', name: '' },
				bizData: [],
				productsList: [],
			},
			alertConfirm: {
				open: false,
				title: '',
				content: '건의 알림톡 등록이 완료되었습니다.',
			},
			sendlist: [
				{
					title: '발송그룹 선택',
					items: {},
				},
				{
					title: '이벤트 참여고객',
					items: {},
				},
			],
		}
	},
	components: {
		alertDialog,
	},
	props: {
		sendDialog: Object,
	},
	created() {},
	methods: {
		checkSend() {
			this.dialogInfo.open = true
		},
	},
}
</script>
<style lang="scss">
.alert-modal {
	background-color: white;
	border-radius: 0 41px 0px 26px !important;
	align-self: start;
	padding: 0px;
}
.alert_header {
	height: 50px;
	.main-title {
		padding-left: 25px;
		color: black;
		font-size: 14px;
		font-weight: bold;
		margin-right: auto;
	}
}
.alert_header2 {
	padding-left: 25px;
	font-size: 13px;
	color: #633efd;
}
.alert_content {
	width: 100%;
	margin: 0 25px;
	font-size: 12px;
	border: 1px solid #333333;
	border-radius: 6px;
}
.alert_bottom {
	width: 50%;
	height: 50px;
	border-top: 1px solid black;
	border-radius: 0 !important;
}
.talk_text_field {
	margin-left: 10px;
	div {
		.v-input__slot {
			min-height: 30px !important;
			height: 30px;
			padding: 0 10px !important;
		}
	}
}
</style>
