<template>
	<v-dialog v-model="dialog.open" persistent content-class="qr-modal-type" max-width="400">
		<v-layout class="dialog_header_reservaition" align-center>
			<div class="main-title-type mr-auto">
				일정삭제
			</div>

			<v-btn icon @click="dialog.open = false" class="pr-8">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-layout>
		<div wrap>
			<div class="px-4">
				<div class="mt-8 confirm_dailog_content">
					아래 일정을 삭제 하시겠습니까?
				</div>
				<v-img width="60" style="margin: 30px auto 0px;" :src="image_type()"></v-img>

				<div class="display_flex pl-1 mt-3 mb-2">
					<div class="item_guide ml-0">
						※ 예약 정보
					</div>
				</div>
				<v-layout wrap class="customer_add_box_reservation mb-10">
					<!-- 고객정보 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;">예약자</v-flex>
							<v-flex xs6 style="font-size:12px;">{{ dialog.data.name }}</v-flex>
							<v-flex xs4 style="font-size:12px;">{{ phone_bar(dialog.data.phone) }}</v-flex>
							<v-flex offset-xs2 xs10 class="mt-2" style="font-size:12px;"
								>{{ $store.state.searchsel_city1.value }}{{ '  ' }} {{ $store.state.searchsel_city2.value }} {{ '  '
								}}{{ $store.state.searchsel_city3.value }}</v-flex
							>
						</v-layout>
					</v-flex>
					<!-- 예약 항목 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;">예약 항목</v-flex>
							<v-flex xs10 style="font-size:12px; white-space:pre-wrap">{{ dialog.data.name }}</v-flex>
						</v-layout>
					</v-flex>

					<!-- 일시 -->
					<v-flex xs12 style="border-top:1px solid #DDDDDD">
						<v-layout wrap class="px-3 py-2">
							<v-flex xs2 style="font-size:12px;"> 일시</v-flex>
							<v-flex xs10 style="font-size:12px;">{{ dialog.data.date_time }}</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</div>
			<v-layout wrap>
				<v-flex xs6>
					<v-btn
						style="border-top:1px solid black !important; border-radius:0px;"
						color="white"
						depressed
						block
						height="50"
						tile
						@click="dialog.open = false"
					>
						취소
					</v-btn>
				</v-flex>
				<v-flex xs6>
					<v-btn style="font-weight:bold; " color="primary2" dark depressed block height="50" tile @click="click_btn()">
						확인
					</v-btn>
				</v-flex>
			</v-layout>
		</div>
	</v-dialog>
</template>
<script>
export default {
	props: {
		dialog: Object,
		doneDialog: Object,
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
			return require('@/assets/images/ico/ico_question.png')
		},

		click_btn() {
			this.dialog.open = false

			this.doneDialog.open = true
			this.doneDialog.content = '일정이 삭제 되었습니다'
		},
		phone_bar(val) {
			if (val) {
				return val.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
			} else {
				return val
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
