<template>
	<v-dialog v-model="setdialog.dialog" max-width="700px">
		<v-card class="dialog-alert">
			<!-- title -->
			<div class="title" :style="`background-color:${$store.state.PointColor2}`">
				<!-- text -->
				<h2>Alert</h2>
				<v-spacer />
				<!-- icon -->
				<v-icon @click="setdialog.dialog = false" class="title-icon" large>mdi-close</v-icon>
			</div>

			<!-- dialog-content -->
			<div class="dialog-content">
				<div>
					{{ setdialog.text }}
				</div>
				<selectBox3 :sel="setdialog.sel" v-if="setdialog.sel" @change="chage" class="ml-0 mt-5"></selectBox3>
				<!-- bottom -->
				<div class="bottom">
					<v-layout justify-end v-if="$route.name === 'COUNSELORPAGE'">
						<btn btn_txt="CANCEL" :btn="cancelBtn" @click="clickCancel"></btn>
						<btn :btn_txt="setdialog.btnText ? setdialog.btnText : 'LOGOUT'" class="ml-2" :btn="saveBtn" @click="clickDeleteBtnModal"></btn>
					</v-layout>
					<v-layout justify-end v-else>
						<btn btn_txt="CANCEL" :btn="cancelBtn" @click="clickCancel"></btn>
						<btn
							:btn_txt="setdialog.btnText ? setdialog.btnText : 'DELETE'"
							class="ml-2"
							:btn="saveBtn"
							@click="clickDeleteBtnModal"
							:disabled="setdialog.disabled"
						></btn>
					</v-layout>
				</div>
			</div>
		</v-card>
	</v-dialog>
</template>

<script>
import { btn, selectBox3 } from '@/components/index'

export default {
	data() {
		return {
			cancelBtn: {
				dark: true,
				class: 'cancel',
			},
			saveBtn: {
				dark: true,
				class: 'save',
			},
		}
	},
	created() {},
	methods: {
		clickCancel() {
			this.setdialog.dialog = false
		},
		chage() {
			this.setdialog.disabled = false
		},
		sample() {},
	},
	props: {
		setdialog: Object,
		clickDeleteBtnModal: Function,
	},
	components: {
		btn,
		selectBox3,
	},
}
</script>

<style lang="scss">
.dialog-alert {
	.title {
		height: 60px;
		display: flex;
		align-items: center;
		padding: 0 25px;

		h2 {
			color: white;
		}

		.title-icon {
			color: white;
		}
	}

	.dialog-content {
		padding: 40px;
		font-weight: bold;
	}
	.bottom {
		display: flex;
		margin-top: 20px;
	}
}
</style>
