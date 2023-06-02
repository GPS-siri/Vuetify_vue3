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
					<div class="menu_tab d-flex align-center pl-5">{{ tablemenu[0] }}</div>
					<div class="d-flex align-center ml-2" style="height:25px">{{ setdialog.selected.length }} 명</div>
				</v-layout>
				<v-layout align-center class="table_menu">
					<div class="menu_tab d-flex align-center pl-5">{{ tablemenu[1] }}</div>
					<div style="width:100px" class="ml-2">
						<v-select
							class="status_select"
							v-model="status_keyword.value"
							hideDetails
							:items="statusData.counselorStatusOption"
							outlined
						></v-select>
					</div>
					<v-btn class="status_btn ml-1" outlined @click="optionEdit()">
						상태옵션수정
					</v-btn>
				</v-layout>
			</div>
			<div class="goal_table mx-5 mt-3" v-if="status_keyword.edit">
				<v-layout align-center class="table_menu" style="background:#f4f4f4">
					<div>
						<div class="pl-5 d-flex align-center" style="width:120px; min-height:36px;">
							{{ tablemenu[2] }}
						</div>
					</div>
					<div style="width:280px; min-height:36px; background:white">
						<v-btn
							v-for="(optionitems, index) in statusData.counselorStatusOption"
							:key="index"
							class="ml-2 mt-1 mb-1 px-1"
							outlined
							style="height:25px; font-size:12px; border-radius:25px; text-transform: initial !important"
							android:textAllCaps="false"
						>
							{{ optionitems }}
							<v-icon
								v-if="optionitems !== '재직' && optionitems !== '퇴사'"
								color="#C4C4C4"
								class="select_option ml-1"
								@click="optionDelete(index)"
								>mdi-close-circle</v-icon
							>
						</v-btn>
					</div>
				</v-layout>
				<v-layout align-center class="table_menu">
					<div class="menu_tab d-flex align-center pl-5">{{ tablemenu[3] }}</div>
					<div style="width:100px" class="ml-2">
						<v-text-field class="status_text" outlined hideDetails v-model="status_keyword.add"></v-text-field>
					</div>
					<v-btn color="primary" class="ml-1" style="width:55px; height:25px; border-radius:25px" @click="addOption()">
						추가
					</v-btn>
				</v-layout>
			</div>
			<v-layout class="mt-8 pb-10" justify-center align-center>
				<v-btn color="primary" style="width:120px; height:35px;" @click="saveStatus()">
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
	components: {},
	data() {
		return {
			tablemenu: ['선택 상담사', '상태변경', '선택옵션 값', '옵션추가'],
			status_keyword: {
				edit: false,
				delete: true,
				value: '',
				add: '',
			},
			statusData: [],
		}
	},
	props: {
		setdialog: Object,
		counselor_selected: Object,
	},
	watch: {
		setdialog: {
			deep: true,
			async handler() {
				if (this.setdialog.dialog) {
					this.systems()
					this.$store.state.loading = false
				}
			},
		},
	},
	methods: {
		async systems() {
			let data = {
				business: this.$store.state.meData.business.id,
			}
			await this.$store
				.dispatch('systems', data)
				.then(res => {
					let users_data = res.systems
					if (users_data.length > 0) {
						this.statusData = users_data.find(x => x.type === 'counselorStatus')
					}

					this.$store.state.loading = false
				})
				.catch(err => {
					console.log(err)
					this.$store.state.loading = false
				})
		},
		optionEdit() {
			this.status_keyword.edit = !this.status_keyword.edit
		},
		optionDelete(index) {
			this.statusData.counselorStatusOption.splice(index, 1)
		},
		addOption() {
			if (this.status_keyword.add === '') {
				return alert('옵션명을 입력해주세요.')
			} else {
				this.statusData.counselorStatusOption.push(this.status_keyword.add)
			}
			this.status_keyword.add = ''
		},
		async saveStatus() {
			if (!this.status_keyword.value) {
				return alert('상태를 선택해주세요.')
			}

			this.$store.state.loading = true

			const data = {
				id: this.statusData.id,
				counselorStatusOption: this.statusData.counselorStatusOption,
			}

			await this.$store
				.dispatch('updateSystem', data)
				.then(() => {
					// this.save_dialog.open = true
					// this.save_dialog.content = '성공적으로 저장했습니다.'
					// this.save_dialog.btnTxt = '확인'
				})
				.catch(err => {
					alert('오류가 발생했습니다.')

					console.log({ err })
					this.$store.state.loading = false
				})
			for (let i = 0; i < this.counselor_selected.selected.length; i++) {
				let status = {
					id: this.counselor_selected.selected[i].id,
					counselorStatus: this.status_keyword.value,
				}
				await this.$store
					.dispatch('updateUser', status)
					.then(() => {
						// this.save_dialog.open = true
						// this.save_dialog.content = '성공적으로 저장했습니다.'
						// this.save_dialog.btnTxt = '확인'
						this.status_keyword.value = ''
					})
					.catch(err => {
						alert('오류가 발생했습니다.')

						console.log({ err })
						this.$store.state.loading = false
					})
			}
			this.$emit('save_complete')

			this.setdialog.dialog = false
			this.status_keyword.edit = false
		},
		close() {
			this.setdialog.dialog = false
			this.status_keyword.edit = false
			this.status_keyword.value = ''
			this.systems()
		},
	},
}
</script>

<style lang="scss">
.status_select {
	div {
		.v-input__slot {
			font-size: 14px;
			min-height: 25px !important;
			height: 25px !important;
		}
		div {
			.v-input__append-inner {
				margin-top: 0;
			}
		}
	}
}
.status_btn {
	width: 100px;
	height: 25px !important;
	border: 1px solid #3a258f;
	border-radius: 25px;
	color: #3a258f !important;
	font-weight: 350;
}
.status_text {
	div {
		.v-input__slot {
			min-height: 25px !important;
			height: 25px;
			padding: 0 10px !important;
			font-size: 14px;
		}
	}
}
.select_option {
	font-size: 14px !important;
}
</style>
