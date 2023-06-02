<template>
	<v-dialog v-model="setDialog.dialog" persistent width="500">
		<div class="create_wrap_lay">
			<div class="px-8 py-4" style="background:#2d1c71; color:white;">
				<v-layout>
					<span style="font-weight:bold;">상담사 연차 직접설정</span>
					<v-spacer />
					<v-icon @click="close()" class="title-icon" color="white">mdi-close</v-icon>
				</v-layout>
			</div>
			<v-container style="font-size:0.75rem; background-color:white;">
				<v-layout style="border-top:2px solid #b6b6b6; border-bottom:0.5px solid #b6b6b6;" align-center mb-1>
					<v-flex xs4 px-3 pt-3 style="background-color:#f5f4f4; height:44px;">상담사 검색</v-flex>
					<v-flex xs8 px-3 py-2
						><div class="notice_change_div">
							<v-layout align-center>
								<v-text-field
									class="text_field_1 search_select_small mr-1"
									v-model="search_keyword.input"
									hideDetails
									outlined
								></v-text-field>
							</v-layout>
							<!-- <v-select
								class="search_select_small mr-1"
								v-model="status_selectBox.value"
								hideDetails
								:items="status_selectBox.items"
								outlined
							></v-select> -->
							<v-btn small outlined rounded @click="searchActive()">
								검색
							</v-btn>
						</div></v-flex
					>
				</v-layout>
				<div style="max-height:20vh; overflow:auto; font-size:0.75rem;" class="mx-3">
					<v-radio-group v-model="vacationUser" row style="margin-top: 0;">
						<v-layout v-for="(user, index) in userList" :key="index" my-1>
							<v-flex xs1>
								<v-radio class="goal_select_1 mr-4" label="" :value="user.id"></v-radio>
							</v-flex>
							<v-flex class="font_style_max" xs2>
								{{ user.name }}
							</v-flex>
							<v-flex
								class="
								font_style_max
								"
								xs4
							>
								{{ user.phone }}
							</v-flex>
							<v-flex class="font_style_max" xs3>
								{{ user.team ? user.team.title : '-' }}
							</v-flex>
							<v-flex
								class="
								font_style_max
								"
								xs2
							>
								{{ user.role.name === 'counselor' ? '상담사' : '관리자' }}
							</v-flex>
						</v-layout>
					</v-radio-group>
				</div>
				<v-layout style="border-top:2px solid #b6b6b6; border-bottom:0.5px solid #b6b6b6; height:47px;" align-center>
					<v-flex xs4 px-3 pt-3 style="background-color:#f5f4f4; height:44px; ">일자선택</v-flex>
					<v-flex xs8 px-3 py-2>
						<div class="d-flex align-center date_picker" style="width:150px">
							<DatepickerDialog :picker="date"></DatepickerDialog>
						</div>
					</v-flex>
				</v-layout>
				<v-layout style="border-bottom:0.5px solid #b6b6b6;">
					<v-flex xs4 px-3 py-2 style="background-color:#f5f4f4;">구분</v-flex>
					<v-flex xs8 px-3 class="radioStyle">
						<div class="d-flex align-center ml-2 mt-1" style="height:25px">
							<v-radio-group v-model="row" row>
								<v-radio class="goal_select_1 mr-4" label="연차" value="vacation"></v-radio>
								<v-radio class="goal_select_1 mr-4" label="오전반차" value="morningVacation"></v-radio>
								<v-radio class="goal_select_1" label="오후반차" value="afternoonVacation"></v-radio>
							</v-radio-group>
						</div>
					</v-flex>
				</v-layout>

				<v-layout v-if="setDialog.status === 'leave'" style="border-bottom:0.5px solid #b6b6b6;">
					<v-flex xs4 px-3 py-2 style="background-color:#f5f4f4;">퇴근시간</v-flex>
					<v-flex xs8 px-3 py-2> </v-flex>
				</v-layout>
			</v-container>
			<v-layout class="mt-4 pb-4" justify-center align-center>
				<v-btn color="primary" style="width:120px; height:35px;" @click="actionSave()">
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
import { DatepickerDialog } from '@/components'

export default {
	components: { DatepickerDialog },
	methods: {
		searchActive() {
			const data = {
				business: this.$store.state.meData.business.id,
				role: 3,
			}
			if (this.search_keyword.input !== '') {
				data.name = this.search_keyword.input
			}
			this.usersView(data)
		},
		close() {
			this.setDialog.dialog = false
		},
		actionSave() {
			if (this.userList.length === 0) {
				return alert('상담사를 선택해주세요.')
			} else {
				if (this.userList.filter(x => x.id === this.vacationUser)[0].vacations) {
					let duplicateCheck = this.userList
						.filter(x => x.id === this.vacationUser)[0]
						.vacations.filter(x => x.vacationDate === this.date.date)
						.filter(x => x.status !== 'disagree').length
					if (duplicateCheck === 0) {
						const data = {
							vacationDate: this.$moment(this.date.date).format('YYYY-MM-DD'),
							type: this.row,
							status: 'admin',
							users_permissions_user: this.vacationUser,
							adminId: this.$store.state.meData.username,
							adminName: this.$store.state.meData.name,
							viewStatus: true,
						}
						this.createVacationAction(data)
					} else {
						alert('이미 신청한 휴가가 존재 합니다.')
					}
				} else {
					const data = {
						vacationDate: this.$moment(this.date.date).format('YYYY-MM-DD'),
						type: this.row,
						status: 'admin',
						users_permissions_user: this.vacationUser,
						adminId: this.$store.state.meData.username,
						adminName: this.$store.state.meData.name,
						viewStatus: true,
					}
					this.createVacationAction(data)
				}
			}
		},
		createVacationAction(data) {
			this.$store
				.dispatch('createVacation', data)
				.then(res => {
					const data1 = {
						date: this.$moment(this.date.date).format('YYYY-MM-DD'),
						users_permissions_user: this.vacationUser,
					}
					// if (item.data7 === '연차') {
					// 	data.status = 'vacation'
					// } else if (item.data7 === '병가') {
					// 	data.status = 'sick'
					// } else if (item.data7 === '오후반차') {
					// 	data.status = 'afternoonVacation'
					// } else if (item.data7 === '오전반차') {
					// 	data.status = 'morningVacation'
					// } else if (item.data7 === '기타') {
					// 	data.status = 'etc'
					// }
					data1.status = data.type
					data1.business = this.$store.state.meData.business.id
					data1.vacation = res.createVacation.vacation.id
					this.createGotoworkAction(data1)
					this.setDialog.dialog = false
				})
				.catch(err => {
					console.log({ err })
				})
		},
		createGotoworkAction(data) {
			this.$store
				.dispatch('createGotowork', data)
				.then(() => {})
				.catch(err => {
					console.log({ err })
				})
		},
		usersView(data) {
			this.$store
				.dispatch('users', data)
				.then(res => {
					this.userList = res.users
				})
				.catch(err => {
					console.log({ err })
				})
		},
	},
	data() {
		return {
			vacationUser: 0,
			row: 'vacation',
			search_keyword: {
				// 이름 / 연락처 / 이메일 필터
				value: '상담사 이름',
				items: ['상담사 이름', '연락처'],
				input: '',
			},
			userList: [],
			date: {
				date: this.$moment().format('YYYY-MM-DD'),
			},
		}
	},
	props: {
		setDialog: Object,
	},
	created() {
		const data = {
			business: this.$store.state.meData.business.id,
			role: 3,
		}
		this.usersView(data)
	},
}
</script>

<style lang="scss">
.create_wrap_lay {
	background: white;
	height: 'auto' !important;
}

.radioStyle > div > div > div > div.v-input__slot > div > div.v-radio.goal_select_1.theme--light > label {
	font-size: 12px;
}
.font_style_max {
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
}
</style>
