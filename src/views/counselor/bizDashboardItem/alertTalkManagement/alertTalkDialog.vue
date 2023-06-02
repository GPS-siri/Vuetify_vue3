<template>
	<v-dialog v-model="dialogInfo.open" persistent content-class="alert-modal" max-width="400">
		<div v-if="dialogInfo.addnew">
			<v-layout class="alert_header" align-center>
				<div class="main-title">
					{{ dialogInfo.business.title }}
				</div>
				<v-btn icon @click="dialogInfo.open = false" dark class="pr-8" style="color:black;">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<span class="alert_header2">{{ dialogInfo.business.header }}</span>
			<v-layout>
				<v-flex xs12 class="alert_content mt-5">
					<div class="alert_table">
						<div style="width:40%; text-align:center">{{ dialogInfo.table_header[0] }}</div>
						<div style="width:60%; text-align:center">{{ dialogInfo.table_header[1] }}</div>
					</div>
					<div v-for="(table, i) in dialogInfo.addtalk" :key="i" class="alert_table_item">
						<div style="width:40%; text-align:center">{{ table.type }}</div>
						<div style="width:60%; text-align:center">{{ table.title }}</div>
					</div>
				</v-flex>
			</v-layout>
			<v-layout class="mt-7">
				<v-btn class="alert_bottom" style="background:#fff;" @click="dialogInfo.open = false">이전</v-btn>
				<v-btn class="alert_bottom" style="background:#633EFD; color:#fff;" @click="alertSave()">확인</v-btn>
			</v-layout>
			<comfirmDialog :dialog="alertConfirm" />
		</div>
		<div v-if="dialogInfo.preview">
			<v-layout class="alert_header" align-center>
				<div class="main-title">
					{{ dialogInfo.business.title }}
				</div>
				<v-btn icon @click="dialogInfo.open = false" dark class="pr-8" style="color:black;">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-layout>
			<span class="alert_header2">{{ dialogInfo.business.header }}</span>
			<v-layout>
				<v-flex xs12 class="alert_content mt-5" style="border:1px solid #DFD800">
					<div>
						<div class="preview_header">{{ dialogInfo.content_header }}</div>
						<div class="pa-4">{{ dialogInfo.content }}</div>
					</div>
				</v-flex>
			</v-layout>
			<v-layout class="mt-7">
				<v-btn class="alert_bottom" style="background:#633EFD; color:#fff; width:100%" @click="dialogInfo.open = false">확인</v-btn>
			</v-layout>
			<comfirmDialog :dialog="alertConfirm" />
		</div>
	</v-dialog>
</template>

<script>
import { comfirmDialog } from '@/components'
export default {
	data() {
		return {
			alertConfirm: {
				open: false,
				title: '',
				content: '',
			},
			messages_id: [],
		}
	},
	components: {
		comfirmDialog,
	},
	props: {
		dialogInfo: Object,
	},
	async created() {
		await this.me()
		await this.user()
	},
	methods: {
		me() {
			this.$store.dispatch('me').then()
		},
		user() {
			let data = {
				id: this.$store.state.meData.id,
			}
			this.$store.dispatch('users', data).then(res => {
				res.users[0].messages.forEach(el => {
					this.messages_id.push(el.id)
				})
			})
		},
		alertSave() {
			this.$store.state.loading = true
			this.alertConfirm.content = `${this.dialogInfo.addtalk.length}건의 알림톡 등록이 완료되었습니다.`
			// 1번 메세지 업데이트
			//  1 - 기존 메시지 호출  - 메시지에 있는 유저들 아이디 뽑아서 + 내거
			//  2 - 메세지 업데이트

			// 2번 유저 업데이트[]
			let alert_id = this.messages_id.concat(this.dialogInfo.addtalk.map(el => el.id))
			let userid = {
				id: this.$store.state.meData.id,
				messages: alert_id,
			}
			this.$store.dispatch('updateUser', userid).then(() => {
				this.$store.state.loading = false
				this.dialogInfo.open = false
				this.alertConfirm.open = true
			})
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
.alert_table {
	height: 50px;
	display: flex;
	align-items: center;
}
.alert_table_item {
	height: 55px;
	display: flex;
	align-items: center;
	border-bottom: 1px solid #dddddd;
}
.alert_table_item:nth-last-child(1) {
	border-bottom: 0;
}
.alert_bottom {
	width: 50%;
	height: 50px !important;
	border-top: 1px solid black;
	border-radius: 0 !important;
}
.preview_header {
	text-align: center;
	background: #f6ee00;
	height: 40px;
	line-height: 40px;
}
</style>
