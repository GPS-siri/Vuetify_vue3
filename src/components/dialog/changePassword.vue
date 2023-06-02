<template>
	<v-dialog v-model="setdialog.dialog" persistent width="440">
		<div class="counselor_create_wrap" style="height:100%">
			<div class="px-8 py-4" style="background:#2d1c71; color:white;">
				<v-layout>
					<span>{{ setdialog.title }}</span>
					<v-spacer />
					<v-icon @click="close()" class="title-icon" color="white">mdi-close</v-icon>
				</v-layout>
			</div>
			<div class="mx-5 mt-5 mb-6">
				<v-layout class="goal_header py-3" align-center justify-center>
					<v-icon class="ml-4" color="red">mdi-alert-circle-outline</v-icon>
					<div class="ml-3 mr-10" style="font-size:12px; font-weight:300">
						여러명의 상담사 상태를 수정할 수 있으며, 상태옵션값을 수정할 수 있습니다.
					</div>
				</v-layout>
			</div>
			<div class="goal_table mx-5">
				<v-layout align-center class="table_menu">
					<div class="menu_tab d-flex align-center pl-3">상담사 이름</div>
					<div class="d-flex align-center ml-2" style="height:25px">{{ passwordData.name }}</div>
				</v-layout>
				<v-layout align-center class="table_menu">
					<div class="menu_tab d-flex align-center pl-3">상담사 아이디</div>
					<div class="d-flex align-center ml-2" style="height:25px">{{ passwordData.email }}</div>
				</v-layout>
			</div>
			<div class="goal_table mt-4 mx-5">
				<v-layout align-center class="table_menu">
					<div class="menu_tab d-flex align-center pl-3">새 비밀번호</div>
					<div class="d-flex align-center ml-2" style="height:25px">
						<v-text-field class="setnewpassword" v-model="newPassword" type="password" hideDetails outlined></v-text-field>
					</div>
				</v-layout>
				<v-layout align-center class="table_menu">
					<div class="menu_tab d-flex align-center pl-3">새 비밀번호 확인</div>
					<div class="d-flex align-center ml-2" style="height:25px">
						<v-text-field class="setnewpassword" v-model="checkPassword" type="password" hideDetails outlined></v-text-field>
					</div>
				</v-layout>
			</div>
			<v-layout class="mt-8 pb-10" justify-center align-center>
				<v-btn color="primary" style="width:120px; height:35px;" @click="savePassword()">
					저장
				</v-btn>
				<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="close()">
					취소
				</v-btn>
			</v-layout>
		</div>
	</v-dialog>
</template>

<script>
export default {
	props: {
		setdialog: Object,
		passwordData: Object,
	},
	data() {
		return {
			newPassword: '',
			checkPassword: '',
		}
	},
	methods: {
		savePassword() {
			if (this.newPassword !== this.checkPassword) {
				alert('비밀번호가 일치하지 않습니다.')
			} else if (this.newPassword.length < 8) {
				alert('비밀번호는 8자리 이상으로 설정해주세요')
			} else {
				let savePassword = { id: this.passwordData.id, password: this.newPassword }

				this.$store.state.loading = true
				this.$store
					.dispatch('updateUser', savePassword)
					.then(() => {
						this.passwordData.password = this.newPassword
						this.$store.state.loading = false
					})
					.catch(err => {
						alert('오류가 발생했습니다.')

						console.log({ err })
						this.$store.state.loading = false
					})
				this.setdialog.dialog = false
			}
		},
		close() {
			this.setdialog.dialog = false
			this.newPassword = ''
			this.checkPassword = ''
		},
	},
}
</script>

<style lang="scss">
.setnewpassword {
	div {
		.v-input__slot {
			height: 25px !important;
			min-height: 25px !important;
		}
	}
}
</style>
