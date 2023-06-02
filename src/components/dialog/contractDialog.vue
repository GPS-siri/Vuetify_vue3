<template>
	<v-dialog v-model="setdialog.dialog" persistent width="548">
		<div class="create_wrap">
			<div class="px-8 py-4" style="background:#2d1c71; color:white;">
				<v-layout>
					<span>{{ setdialog.title }}</span>
					<v-spacer />
					<v-icon @click="close()" class="title-icon" color="white">mdi-close</v-icon>
				</v-layout>
			</div>
			<div class="mt-3 px-3">
				<div class="d-flex align-center " style=" border-top:2px solid #b6b6b6; border-bottom:0.5px solid #b6b6b6;">
					<div class="product_detail_body_title2 d-flex align-center justify-center" style="width:30%; border-right:1px solid #E0E0E0;">
						계약 완료 상품명
					</div>
					<div class="product_detail_body_title2 d-flex align-center justify-center" style="width:20%; border-right:1px solid #E0E0E0;">
						상담사
					</div>
					<div class="product_detail_body_title2 d-flex align-center justify-center" style="width:20%; border-right:1px solid #E0E0E0;">
						고객
					</div>
					<div class="product_detail_body_title2 d-flex align-center justify-center" style="width:30%; ">계약일시</div>
				</div>
				<div class="d-flex align-center " style="border-bottom:0.5px solid #b6b6b6;">
					<div class="product_detail_body_text2 d-flex align-center justify-center" style="width:30%; border-right:1px solid #E0E0E0;">
						{{ setdialog.data.title ? setdialog.data.title : '' }}
					</div>
					<div class="product_detail_body_text2 d-flex align-center justify-center" style="width:20%; border-right:1px solid #E0E0E0;">
						{{ setdialog.data.users_permissions_user ? setdialog.data.users_permissions_user.name : '' }}
					</div>
					<div class="product_detail_body_text2 d-flex align-center justify-center" style="width:20%; border-right:1px solid #E0E0E0;">
						{{ setdialog.data.contractorName ? setdialog.data.contractorName : '' }}
					</div>
					<div class="product_detail_body_text2 d-flex align-center justify-center" style="width:30%; ">
						{{ setdialog.data.contractDate ? $moment(setdialog.data.contractDate).format('YYYY-DD-MM hh:mm:ss') : '' }}
					</div>
				</div>
			</div>
			<v-layout class="mt-8" justify-center align-center>
				<v-btn outlined style="width:120px; height:35px;" @click="close()">
					확인
				</v-btn>
			</v-layout>
		</div>
	</v-dialog>
</template>

<script>
export default {
	components: {},
	data() {
		return {}
	},
	props: {
		setdialog: Object,
	},
	methods: {
		close() {
			this.setdialog.dialog = false
		},
	},
}
</script>

<style lang="scss">
.product_detail_body_title2 {
	background-color: #f5f4f4;
	height: 36px;
}
.product_detail_body_text2 {
	font-size: 12px;
	height: 36px;
}
.create_wrap {
	background: white;
	height: 228px;
}
</style>
