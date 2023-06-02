<template>
	<v-dialog v-model="setdialog.dialog" persistent width="800">
		<div class="counselor_create_wrap" style="height:100%">
			<div class="px-8 py-4" style="background:#2d1c71; color:white;">
				<v-layout>
					<span>{{ setdialog.title }}</span>
					<v-spacer />
					<v-icon @click="close()" class="title-icon" color="white">mdi-close</v-icon>
				</v-layout>
			</div>
			<div class="mx-10 mt-5 mb-6">
				<v-layout class="goal_header py-3" align-center>
					<v-icon class="ml-4" color="red">mdi-alert-circle-outline</v-icon>
					<div class="ml-3 mr-10" style="font-size:12px; font-weight:300">
						상담사들의 팀 및 직급 관리를 할 수 있습니다.
					</div>
				</v-layout>
				<v-layout class="mt-3">
					<div style="width:50%">
						팀 관리
						<div class="team_wrap mt-1">
							<div
								v-for="(team, index) in team_set.items"
								:key="index + 'q'"
								:class="
									index === Number(team_set.index)
										? 'd-flex align-center items_text pl-3 team_check'
										: 'd-flex align-center items_text pl-3'
								"
								@click="selectTeam(index)"
							>
								{{ team }}
							</div>
						</div>
						<div class="d-flex align-center mt-1">
							<div style="width:230px;">
								<v-text-field class="team_text" outlined hideDetails v-model="team_set.add"></v-text-field>
							</div>
							<v-btn outlined class="d-flex align-center justify-center team_btn ml-1" @click="createTeam()">생성</v-btn>
							<v-btn outlined class="d-flex align-center justify-center team_btn ml-1" @click="editTeam(team_set.add)">수정</v-btn>
							<v-btn outlined class="d-flex align-center justify-center team_btn ml-1" @click="removeTeam(team_set.add)">삭제</v-btn>
						</div>
					</div>
					<div style="width:50%">
						직급 관리
						<div class="team_wrap mt-1">
							<div
								v-for="(counselor, index) in counselor_set.items"
								:key="index"
								:class="
									index === Number(counselor_set.index)
										? 'd-flex align-center items_text pl-3 team_check'
										: 'd-flex align-center items_text pl-3'
								"
								@click="selectCounselor(index)"
							>
								{{ counselor }}
							</div>
						</div>
						<div class="d-flex align-center mt-1">
							<div style="width:230px;">
								<v-text-field class="team_text" outlined hideDetails v-model="counselor_set.add"></v-text-field>
							</div>
							<v-btn outlined class="d-flex align-center justify-center team_btn ml-1" @click="createCounselor()">생성</v-btn>
							<v-btn outlined class="d-flex align-center justify-center team_btn ml-1" @click="editCounselor(counselor_set.add)"
								>수정</v-btn
							>
							<v-btn outlined class="d-flex align-center justify-center team_btn ml-1" @click="removeCounselor(counselor_set.add)"
								>삭제</v-btn
							>
						</div>
					</div>
				</v-layout>
			</div>
			<v-data-table
				class="counselor_table2 mt-3 mx-10"
				v-model="table.selected"
				:headers="table.headers1"
				:items="table.items1"
				show-select
				hide-default-footer
				:footer-props="{
					['items-per-page-text']: ``,
				}"
			>
			</v-data-table>
			<v-layout align-center justify-center class="mt-3">
				<v-btn class="status_btn2" color="primary" @click="click_team_apply">
					팀/직급 적용
				</v-btn>
			</v-layout>
			<v-data-table
				class="counselor_table3 mt-3 mx-10"
				:headers="table.headers2"
				:items="table.items2"
				hide-default-footer
				:footer-props="{
					['items-per-page-text']: ``,
				}"
			>
				<template v-slot:[`item.del`]="{ item, index }">
					<v-btn small outlined color="#3A258F" class="btn-style ml-1" style="width:40px; height:35px;" @click="click_delet(item, index)">
						삭제
					</v-btn>
				</template>
			</v-data-table>
			<v-layout class="mt-8 pb-10" justify-center align-center>
				<v-btn color="primary" style="width:120px; height:35px;" @click="click_save">
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
			table: {
				headers1: [
					{ text: '팀', value: 'team_data', align: 'center', width: '85px' },
					{ text: '직급', value: 'rank_data', align: 'center', width: '85px' },
					{ text: '이름', value: 'name', align: 'center', width: '85px' },
					{ text: '연락처', value: 'phone', align: 'center', width: '100px' },
					{ text: '등록일', value: 'created_at', align: 'center', width: '135px' },
				],
				headers2: [
					{ text: '삭제', value: 'del', align: 'center', width: '55px' },
					{ text: '팀', value: 'team_data', align: 'center', width: '85px' },
					{ text: '직급', value: 'rank_data', align: 'center', width: '85px' },
					{ text: '이름', value: 'name', align: 'center', width: '85px' },
					{ text: '연락처', value: 'phone', align: 'center', width: '100px' },
					{ text: '등록일', value: 'created_at', align: 'center', width: '135px' },
				],
				headerCheck: false,
				items1: [],
				items2: [],
				selected: [],
			},
			team_set: {
				click: false,
				all_list: [], //모든 팀정보
				items: [],
				add: '',
				index: '-1',
			},
			counselor_set: {
				click: false,
				items: [],
				add: '',
				index: '-1',
			},
			select_list: [],
		}
	},
	props: {
		setdialog: Object,
		propsData: Array,
	},
	watch: {
		setdialog: {
			deep: true,
			async handler() {
				if (this.setdialog.dialog) {
					this.$store.state.loading = true
					await this.teams()
					await this.props_data()
					this.$store.state.loading = false
				}
			},
		},
	},
	methods: {
		props_data() {
			for (let i = 0; i < this.propsData.length; i++) {
				this.propsData[i]['team_data'] = this.propsData[i].team.split('_')[0]
				this.propsData[i]['rank_data'] = this.propsData[i].team.split('_')[1]
			}
			this.table.items1 = this.propsData
		},
		async teams() {
			let input = {
				business: this.$store.state.meData.business.id,
			}
			await this.$store.dispatch('teams', input).then(res => {
				this.team_set.all_list = res.teams
				let li = []
				for (let i = 0; i < res.teams.length; i++) {
					li.push(res.teams[i].title)
				}
				this.team_set.items = li
			})
		},
		close() {
			this.setdialog.dialog = false
			this.team_set.add = ''
			this.team_set.index = '-1'
			this.counselor_set.add = ''
			this.counselor_set.index = '-1'
			this.counselor_set.items = []
			this.table.items2 = []
		},
		createTeam() {
			if (this.team_set.add === '') return alert('팀 명을 입력해주세요')
			let input = {
				title: this.team_set.add,
				business: this.$store.state.meData.business.id,
			}
			this.$store.dispatch('createTeam', input).then(() => {
				this.teams()
				this.team_set.add = ''
				this.team_set.index = '-1'
			})
		},
		selectTeam(index) {
			let li = []
			for (let i = 0; i < this.team_set.all_list[index].ranks.length; i++) {
				li.push(this.team_set.all_list[index].ranks[i].title)
			}
			this.counselor_set.items = li
			this.team_set.add = this.team_set.items[index]
			this.team_set.index = index
			this.counselor_set.add = ''
			this.counselor_set.index = '-1'
		},
		editTeam() {
			let input = {
				id: this.team_set.all_list[this.team_set.index].id,
				title: this.team_set.add,
			}
			this.$store.dispatch('updateTeam', input).then(() => {
				this.teams()
				this.team_set.add = ''
				this.team_set.index = '-1'
			})
		},
		removeTeam() {
			let input = {
				id: this.team_set.all_list[this.team_set.index].id,
			}
			this.$store.dispatch('deleteTeam', input).then(() => {
				this.teams()
				this.team_set.add = ''
				this.team_set.index = '-1'
			})
		},
		createCounselor() {
			if (this.counselor_set.add === '') {
				return alert('직급명을 입력해주세요.')
			}
			let input = {
				title: this.counselor_set.add,
				business: this.$store.state.meData.business.id,
				team: this.team_set.all_list[this.team_set.index].id,
			}
			this.$store.dispatch('createRank', input).then(async () => {
				await this.teams()
				this.selectTeam(this.team_set.index)
				this.counselor_set.add = ''
				this.counselor_set.index = '-1'
			})
		},
		selectCounselor(index) {
			this.counselor_set.add = this.counselor_set.items[index]
			this.counselor_set.index = index
		},
		editCounselor() {
			let input = {
				title: this.counselor_set.add,
				id: this.team_set.all_list[this.team_set.index].ranks[this.counselor_set.index].id,
			}
			this.$store.dispatch('updateRank', input).then(async () => {
				await this.teams()
				this.selectTeam(this.team_set.index)
				this.counselor_set.add = ''
				this.counselor_set.index = '-1'
			})
		},
		removeCounselor() {
			let input = {
				id: this.team_set.all_list[this.team_set.index].ranks[this.counselor_set.index].id,
			}
			this.$store.dispatch('deleteRank', input).then(async () => {
				await this.teams()
				this.selectTeam(this.team_set.index)
				this.counselor_set.add = ''
				this.counselor_set.index = '-1'
			})
		},
		click_team_apply() {
			if (this.team_set.add === '') {
				alert('팀을 선택해주세요')
				return
			}
			if (this.counselor_set.add === '') {
				alert('직급을 선택해주세요')
				return
			}
			if (this.table.selected.length === 0) {
				alert('상담사를 선택해주세요')
			}
			let li = JSON.parse(JSON.stringify(this.table.selected))
			for (let i = 0; i < li.length; i++) {
				li[i].team_data = this.team_set.add
				li[i].rank_data = this.counselor_set.add
				li[i].team = this.team_set.add + '_' + this.counselor_set.add
				li[i]['del'] = ''
			}
			this.table.items2 = li
		},
		click_delet(item, index) {
			this.table.items2.splice(index, 1)
		},
		click_save() {
			if (this.table.items2.length > 0) {
				for (let i = 0; i < this.table.items2.length; i++) {
					let input = {
						id: this.table.items2[i].id,
						team: this.team_set.all_list[this.team_set.index].id,
						rank: this.team_set.all_list[this.team_set.index].ranks[this.counselor_set.index].id,
					}
					this.$store.dispatch('updateUser', input).then(() => {
						this.close()
						this.$emit('save_complete')
					})
				}
			} else {
				this.close()
				this.$emit('save_complete')
			}
		},
	},
}
</script>

<style lang="scss">
.team_wrap {
	border: 1px solid #707070;
	width: 350px;
	height: 130px;
	overflow: auto;
	font-size: 14px;
}
.items_text {
	height: 25px;
	font-weight: 300;
	cursor: pointer;
}
.items_text:hover {
	background: #f2f2f2;
}
.team_text {
	div {
		.v-input__slot {
			min-height: 25px !important;
			height: 25px !important;
			border-radius: 0;
			padding: 0 10px !important;
			font-size: 14px;
		}
	}
}
.team_btn {
	width: 36px;
	min-width: 36px !important;
	height: 25px !important;
	font-size: 14px;
	font-weight: 300;
	border: 1px solid #707070;
	border-radius: 0;
}
.team_check {
	background: #f2f2f2;
}
.counselor_table2 {
	.v-data-table__wrapper {
		border-bottom: 0;
		table {
			border-bottom: 1px solid #c4c4c4;
			thead {
				background: #e8e8e8;
				tr {
					th {
						height: 50px;
						border-top: 1px solid #7d7d7d !important;
						border-bottom: 1px solid #7d7d7d !important;
					}
					th:nth-last-child(1) {
						border-right: 0;
					}
				}
			}
		}
	}
}
.counselor_table2 {
	.v-data-table__wrapper {
		table {
			tbody {
				tr {
					td {
						height: 50px;
					}
					td:nth-last-child(1) {
						border-right: 0;
					}
				}
			}
		}
	}
}
.counselor_table2 {
	.v-data-footer {
		border: none !important;
	}
}
.counselor_table3 {
	.v-data-table__wrapper {
		border-bottom: 0;
		table {
			border-bottom: 1px solid #c4c4c4;
			thead {
				background: #3a258f;
				tr {
					th {
						height: 50px;
						border-top: 1px solid #7d7d7d !important;
						border-bottom: 1px solid #7d7d7d !important;
						color: #ffffff !important;
					}
					th:nth-last-child(1) {
						border-right: 0;
					}
				}
			}
		}
	}
}
.counselor_table3 {
	.v-data-table__wrapper {
		table {
			tbody {
				tr {
					td {
						height: 50px;
					}
					td:nth-last-child(1) {
						border-right: 0;
					}
					td:nth-child(1) {
						border-right: 0;
						padding: 0px !important;
					}
				}
			}
		}
	}
}
.counselor_table3 {
	.v-data-footer {
		border: none !important;
	}
}
.status_btn2 {
	width: 100px;
	height: 25px !important;
	border-radius: 25px;
	font-weight: 350;
	margin: 0 auto;
}
</style>
