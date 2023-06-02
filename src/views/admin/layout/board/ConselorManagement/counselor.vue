<template>
	<div style="width:100%; ">
		<v-layout align-center>
			<div class="main_title">
				상담사 리스트
			</div>
			<div class="router_title ml-3">
				상담사 관리 > 상담사 리스트
			</div>
		</v-layout>
		<!-- <v-layout wrap>
				<v-flex xs12 style="background-color:green;">
					s
					<v-layout>
						<v-flex xs4 style="background-color:blue;">ss</v-flex>
						<v-flex sx8 style="background-color:white;">ss</v-flex>
					</v-layout>
				</v-flex>
				<v-flex xs12 style="background-color:red;"> ss</v-flex>
				<v-flex xs6 style="background-color:yellow;"> ss</v-flex>
				<v-flex xs6 style="background-color:gray;"> ss</v-flex>
				<v-flex xs12 style="background-color:purple;"> ss</v-flex>
			</v-layout> -->
		<div class="mt-10">
			<v-layout align-center>
				<v-layout align-center class="search_box">
					<div class="search_title">
						검색어
					</div>
					<div class="search_body">
						<div style="width:200px" class="ml-3">
							<v-select
								class="search_select"
								v-model="search_keyword.value"
								hideDetails
								:items="search_keyword.items"
								outlined
								@change="search_keyword.input = ''"
								placeholder="검색어 입력"
							></v-select>
						</div>
						<div style="width:200px;" class="ml-3">
							<v-text-field
								class="text_field"
								:disabled="search_keyword.value ? false : true"
								v-model="search_keyword.input"
								hideDetails
								outlined
								style="font-size:12px;"
							></v-text-field>
						</div>
					</div>
				</v-layout>
			</v-layout>
			<v-layout align-center class="mt-3">
				<v-layout align-center class="search_box">
					<div class="search_title">
						등록일
					</div>
					<div class="search_body2">
						<div class="ml-3">
							<v-btn
								:outlined="date.value === '오늘' ? false : true"
								:color="date.value === '오늘' ? 'primary' : ''"
								@click="changeDate('오늘')"
							>
								오늘
							</v-btn>
							<v-btn
								:outlined="date.value === '1주일' ? false : true"
								class="ml-2"
								:color="date.value === '1주일' ? 'primary' : ''"
								@click="changeDate('1주일')"
							>
								1주일
							</v-btn>
							<v-btn
								:outlined="date.value === '15일' ? false : true"
								class="ml-2"
								:color="date.value === '15일' ? 'primary' : ''"
								@click="changeDate('15일')"
							>
								15일
							</v-btn>
							<v-btn
								:outlined="date.value === '1개월' ? false : true"
								class="ml-2"
								:color="date.value === '1개월' ? 'primary' : ''"
								@click="changeDate('1개월')"
							>
								1개월
							</v-btn>
							<v-btn
								:outlined="date.value === '3개월' ? false : true"
								class="ml-2"
								:color="date.value === '3개월' ? 'primary' : ''"
								@click="changeDate('3개월')"
							>
								3개월
							</v-btn>
							<v-btn
								:outlined="date.value === '전체' ? false : true"
								class="ml-2"
								:color="date.value === '전체' ? 'primary' : ''"
								@click="changeDate('전체')"
							>
								전체
							</v-btn>
						</div>
						<div class="d-flex align-center date_picker ml-3" style="width:150px">
							<DatepickerDialog :picker="date.start"></DatepickerDialog>
						</div>
						<div class="d-flex align-center mx-1">~</div>
						<div class="d-flex align-center date_picker" style="width:150px">
							<DatepickerDialog :picker="date.end" :allowed_dates="allowed_datesEnd"></DatepickerDialog>
						</div>
					</div>
				</v-layout>
			</v-layout>
			<v-layout align-center class="mt-3">
				<v-layout align-center class="search_box">
					<div class="search_title">
						상태
					</div>
					<div>
						<div style="width:200px" class="ml-3">
							<v-select
								class="search_select"
								v-model="status_keyword.value"
								hideDetails
								:items="status_keyword.items.counselorStatusOption"
								outlined
							></v-select>
						</div>
					</div>
					<v-layout align-center class="search_body">
						<div class="ml-5" style="width:60px; font-size:12px">
							팀구분
						</div>
						<div style="width:200px" class="ml-3">
							<v-select
								class="search_select"
								v-model="team_keyword.value"
								hideDetails
								:items="team_keyword.items"
								outlined
								@change="changeTeam()"
								return-object
							></v-select>
						</div>
						<div style="width:200px" class="ml-3">
							<v-select
								class="search_select"
								v-model="ranks_keyword.value"
								hideDetails
								:items="ranks_keyword.items"
								outlined
								return-object
							></v-select>
						</div>
					</v-layout>
				</v-layout>
			</v-layout>
		</div>
		<v-layout class="mt-8 pb-5 search_btn" justify-center align-center>
			<v-btn color="primary" style="width:120px; height:35px;" @click="filter_search()">
				검색
			</v-btn>
			<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="search_reset()">
				초기화
			</v-btn>
		</v-layout>
		<div class="mt-5">
			<v-layout align-center>
				<div style="font-size:12px;">검색결과 총 {{ table.items.length }} 건</div>
				<span class="ml-3" style="font-size:12px">|</span>
				<div class="ml-3" style="font-size:12px" v-if="counselor_goal.goalActive === true">
					목표 {{ counselor_goal.goalCount }}건 ({{ counselor_goal.goalStart }} ~ {{ counselor_goal.goalEnd }})
				</div>
				<v-btn small outlined class="ml-2 btn-style" @click="createGoal()">
					목표설정
				</v-btn>
				<setGoal :setdialog="newgoal" :goalEdit="updateSystem" :goalData="counselor_goal_dialog" />
				<v-layout justify-end align-center>
					<v-btn small outlined class="btn-style" @click="setStatus()">
						상담사 상태관리
					</v-btn>
					<counselorStatus
						:setdialog="counselor_status"
						:statusData="set_counselor_status"
						@save_complete="save_complete2"
						:counselor_selected="counselor_status"
					/>
					<v-btn small outlined class="btn-style ml-2" @click="teamSet()">
						팀 관리/변경
					</v-btn>
					<teamSetting :setdialog="team_setting" :propsData="counselor_status.selected" @save_complete="save_complete" />
					<span class="ml-3">|</span>
					<v-btn small outlined color="#00B241" class="btn-style ml-3" style="border:1px solid #00B241" @click="excelExport()">
						<img src="@/assets/images/excel-img2.png" />
						엑셀저장
					</v-btn>
				</v-layout>
			</v-layout>
			<v-data-table
				class="counselor_table mt-3"
				v-model="counselor_status.selected"
				:headers="table.headers"
				:items="table.items"
				show-select
				:footer-props="{
					['items-per-page-text']: ``,
				}"
			>
				<!-- 상담사 -->
				<template v-slot:[`item.name`]="{ item }">
					<div style="text-decoration: underline; cursor:pointer;" @click="counselorShow(item)">
						{{ item.name }}
					</div>
				</template>
				<!-- 상태 -->
				<template v-slot:[`item.counselorStatus`]="{ item }">
					<div style="display:flex; justifiy-content:center;">
						<v-select
							class="search_select"
							style="width:110px"
							v-model="item.counselorStatus"
							hideDetails
							:items="set_counselor_status.counselorStatusOption"
							@change="statusUpdate(item)"
							outlined
						></v-select>
					</div>
				</template>
				<!-- 팀구분 -->
				<template v-slot:[`item.team`]="{ item }">
					<v-layout wrap style="height: 100%;">
						<v-flex xs6 class="border_right text_center">
							<div class="pr-4" style="width:100%; text-align: start;">
								{{ item.team }}
							</div>
						</v-flex>
						<v-flex xs6 class="text_center">
							<div class="pl-4" style="width:100%; text-align: start;">
								{{ item.rank }}
							</div>
						</v-flex>
					</v-layout>
				</template>

				<!-- 목표 달성률 -->
				<template v-slot:[`item.goal_per`]="{ item }">
					<v-layout wrap style="height: 100%;">
						<v-flex xs6 class="border_right text_center">
							<div class="pr-4" style="width:100%; text-align: start;">
								{{ item.goal_per.split('_')[0] }}
							</div>
						</v-flex>
						<v-flex xs6 class="text_center">
							<div class="pl-4" style="width:100%; text-align: start;">
								{{ item.goal_per.split('_')[1] }}
							</div>
						</v-flex>
					</v-layout>
				</template>

				<!-- 목표 활성화 -->
				<template v-slot:[`item.goalActive`]="{ item }">
					<div style="display:flex; justifiy-content:center;">
						<v-select
							class="search_select"
							style="width:110px"
							v-model="item.status"
							hideDetails
							:items="goal_select_items"
							@change="change_table_goalActive(item)"
							outlined
						></v-select>
					</div>
				</template>
			</v-data-table>

			<download-excel
				class="btn btn-default"
				id="counselor_list_Excel"
				:data="counselor_status.selected"
				style="display:none"
				:fields="table.json_fields"
				type="text/csv;charset=utf8"
				worksheet="My Worksheet"
				name="상담사 리스트.xls"
			>
			</download-excel>
		</div>
	</div>
</template>

<script>
import { DatepickerDialog, setGoal, counselorStatus, teamSetting } from '@/components'
import downloadExcel from 'vue-json-excel'
import axios from 'axios'
export default {
	components: { DatepickerDialog, downloadExcel, setGoal, counselorStatus, teamSetting },
	created() {
		// this.$store.state.loading = true
		// let ok = 0
		// let interval = setInterval(async () => {
		// 	ok += 1
		// 	if (this.$store.state.meData.business) {
		// 		clearInterval(interval)
		// 		await this.teams()
		// 		await this.systems()
		// 		await this.users()
		// 	}
		// 	if (ok === 5) {
		// 		clearInterval(interval)
		// 		this.$store.state.loading = false
		// 		alert('다시 로그인 후 확인해 주세요')
		// 	}
		// }, 1000)
		this.$store.state.loading = true
		// meData에 사업지 정보 있나 확인

		let interval = setInterval(async () => {
			if (this.$store.state.meData.business) {
				clearInterval(interval)
				await this.teams()
				await this.systems()
				await this.users()
			}
		}, 1000)

		// 5초동안 없을 시 오류 alert
		setTimeout(() => {
			if (!this.$store.state.meData.business) {
				clearInterval(interval)
				this.$store.state.loading = false
				alert('다시 로그인 후 확인해 주세요')
			}
			this.$store.state.loading = false
		}, 5000)
	},
	mounted() {},

	methods: {
		tableStatus(val) {
			if (val === 'db') {
				return 'DB등록'
				// filtered = filtered.filter(el => el.contractStatus_origin === 'db')
			}
			if (val === 'consultingWait') {
				return '상담대기'
			}
			if (val === 'consultingComplete') {
				return '상담완료'
			}
			if (val === 'contractWish') {
				return '계약가망'
			}
			if (val === 'contractWait') {
				return '계약대기'
			}
			if (val === 'contractComplete') {
				return '계약완료'
			}
		},
		detail_change() {
			this.$store.state.loading = true

			const data = {
				id: this.detail_data.id,
				team: this.detail_data.value,
				rank: this.detail_data.value_rank,
			}
			this.$store
				.dispatch('updateUser', data)
				.then(() => {
					// this.save_dialog.open = true
					// this.save_dialog.content = '성공적으로 저장했습니다.'
					// this.save_dialog.btnTxt = '확인'

					this.users()
				})
				.catch(err => {
					alert('오류가 발생했습니다.')

					console.log({ err })
					this.$store.state.loading = false
				})
		},
		passwordChange() {
			this.setPassword.dialog = true
		},
		counselorShow(item) {
			this.detail_data = JSON.parse(JSON.stringify(item))
			this.detail_data.created_at = this.$moment(this.detail_data.created_at).format('YYYY-MM-DD')

			if (this.detail_data.counselorStatus === '퇴사') {
				this.detail_data.fireDate = this.$moment().format('YYYY-MM-DD')
			} else {
				this.detail_data.fireDate = '-'
			}

			if (item.team_origin && item.rank) {
				this.detail_data.value = item.team_origin.id
				this.detail_data.value_rank = item.rank.id
			} else {
				this.detail_data.value = ''
				this.detail_data.value_rank = ''
			}
			this.$router.push({ path: `counselor/${item.id}`, params: { data: item } })
		},
		createGoal() {
			this.newgoal.dialog = !this.newgoal.dialog

			this.counselor_goal_dialog.goalActive = this.counselor_goal.goalActive
			this.counselor_goal_dialog.goalCount = this.counselor_goal.goalCount
			this.counselor_goal_dialog.goalStart.date = this.counselor_goal.goalStart
			this.counselor_goal_dialog.goalEnd.date = this.counselor_goal.goalEnd
		},
		setStatus() {
			if (this.counselor_status.selected.length === 0) {
				alert('상담사를 선택해주세요.')
			} else {
				this.counselor_status.dialog = !this.counselor_status.dialog
			}
		},
		teamSet() {
			if (this.counselor_status.selected.length === 0) {
				alert('상담사를 선택해주세요.')
			} else {
				this.team_setting.dialog = !this.team_setting.dialog
			}
		},
		allowed_datesEnd(val) {
			if (this.date.start === '') {
				return val
			} else {
				val = this.$moment().format('YYYY-MM-DD') >= val
			}
			return val
		},
		changeDate(value) {
			this.date.value = value
			if (value === '오늘') {
				this.date.start.date = this.$moment().format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '1주일') {
				this.date.start.date = this.$moment()
					.subtract(7, 'days')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '15일') {
				this.date.start.date = this.$moment()
					.subtract(15, 'days')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '1개월') {
				this.date.start.date = this.$moment()
					.subtract(1, 'month')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '3개월') {
				this.date.start.date = this.$moment()
					.subtract(3, 'month')
					.format('YYYY-MM-DD')
				this.date.end.date = this.$moment().format('YYYY-MM-DD')
			} else if (value === '전체') {
				this.date.start.date = ''
				this.date.end.date = ''
			}
		},
		changeTeam() {
			if (this.team_keyword.value.value !== 'all' && this.team_keyword.value.ranks) {
				let item = [{ value: 'all', text: '전체' }]

				this.team_keyword.value.ranks.forEach(el => {
					item.push({
						value: el.id,
						text: el.title,
					})
				})

				this.ranks_keyword.items = item
				this.ranks_keyword.value = item[0]
			} else {
				let item = [{ value: 'all', text: '전체' }]
				this.ranks_keyword.items = item
				this.ranks_keyword.value = item[0]
			}
		},
		filter_search() {
			// 검색 버튼 클릭
			let variable = {
				role: 3,
				business: this.$store.state.meData.business.id,
				name: this.search_keyword.value === '상담사 이름' ? this.search_keyword.input : '',
				phone: this.search_keyword.value === '연락처' ? this.search_keyword.input : '',
			}

			// 상태
			if (this.status_keyword.value !== '전체') {
				variable['counselorStatus'] = this.status_keyword.value
			}
			// 팀구분

			if (this.team_keyword.value.value !== 'all') {
				variable['team'] = this.team_keyword.value.value
			}
			//팀 -직위
			if (this.ranks_keyword.value.value !== 'all') {
				variable['rank'] = this.ranks_keyword.value.value
			}

			if (this.date.value === '전체' && this.date.start.date) {
				// 생성일
				variable['created_at_gte'] = this.$moment(this.date.start.date)
				variable['created_at_lte'] = this.$moment(this.date.end.date).add(1, 'day')
			} else if (this.date.value !== '전체') {
				variable['created_at_gte'] = this.$moment(this.date.start.date)
				variable['created_at_lte'] = this.$moment(this.date.end.date).add(1, 'day')
			}

			this.users(variable)
		},
		detailData_table() {
			let clientData = {
				id: this.detail_data.id,
			}
			this.$store.state.loading = true
			this.$store
				.dispatch('users', clientData)
				.then(res => {
					let client_item = res.users
					client_item[0].clients.forEach(el => {
						el.created_at = this.$moment(el.created_at).format('YYYY-MM-DD HH:mm:ss')
						// 계약상태
						el['contractStatus_origin'] = el.contractStatus
						el['contractStatus'] =
							(el.contractStatus ? el.contractStatus : '') +
							'/' +
							(el.customDatas.contract_product ? el.customDatas.contract_product.name : '')
					})

					this.clientTable.items = client_item[0].clients
					this.clientTable.items2 = client_item[0].clients

					this.$store.state.loading = false

					this.teams_selected()
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		search_reset() {
			this.search_keyword.value = ''
			this.search_keyword.input = ''
			this.date.value = '전체'
			this.date.start.date = null
			this.date.end.date = null
			this.status_keyword.value = '전체'
			this.team_keyword.value = { value: 'all', text: '전체' }
			this.ranks_keyword.value = { value: 'all', text: '전체' }
			this.users()
		},
		detailSearch_reset() {
			this.detailSearch_keyword.value = ''
			this.detailSearch_keyword.input = ''
			this.date.value = '오늘'
			this.date.start.date = this.$moment().format('YYYY-MM-DD')
			this.date.end.date = this.$moment().format('YYYY-MM-DD')
			this.detailStatus_keyword.value = '전체'
			this.like_keyword.value = '전체'
		},
		excelExport() {
			document.getElementById('counselor_list_Excel').click()
		},
		excelExport2() {
			document.getElementById('client_list_Excel').click()
		},
		async teams() {
			let team = {
				business: this.$store.state.meData.business.id,
			}

			await this.$store
				.dispatch('teams', team)
				.then(res => {
					let item = [{ value: 'all', text: '전체' }]
					let item2 = []
					let item3 = []
					res.teams.forEach(el => {
						item.push({
							value: el.id,
							text: el.title,
							ranks: el.ranks,
						})
					})
					res.teams.forEach(el => {
						item2.push({
							value: el.id,
							text: el.title,
						})
						el.ranks.forEach(el => {
							item3.push({
								value: el.id,
								text: el.title,
							})
						})
					})
					this.detail_ranks.items = item3
					this.detail_team.items = item2
					this.detail_team.value = item2[0]
					this.team_keyword.items = item
					this.team_keyword.value = item[0]

					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		async teams_selected(value) {
			let team = {
				id: this.detail_data.value,
			}

			this.$store.state.loading = true
			await this.$store
				.dispatch('teams', team)
				.then(res => {
					let item3 = []
					// if (res.teams.length > 0) {
					res.teams[0]?.ranks.forEach(el => {
						item3.push({
							value: el.id,
							text: el.title,
						})
					})
					// }
					this.detail_ranks.items = item3

					if (value) {
						this.detail_data.value_rank = ''
					}
					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		async users(variable) {
			let input
			if (variable) {
				// 필터된 데이터 호출 시 variable
				input = variable
			} else {
				// 전체 데이터 호출 시 variable
				input = {
					business: this.$store.state.meData.business.id,
					role: 3,
				}
			}

			this.$store.state.loading = true
			await this.$store
				.dispatch('users', input)
				.then(res => {
					let result = res.users
					if (result.length !== 0) {
						let users_item = []
						if (variable && variable.team) {
							result.forEach(x => {
								if (this.team_keyword.value.text === '전체') {
									users_item.push(x)
								} else if (x.team && x.team.title === this.team_keyword.value.text) {
									if (this.ranks_keyword.value.text === '전체') {
										users_item.push(x)
									} else {
										if (x.rank && x.rank.title === this.ranks_keyword.value.text) {
											users_item.push(x)
										}
									}
								}
							})
						} else {
							users_item = result
						}
						if (users_item.length === 0) {
							this.table.items = []
						}
						users_item.forEach((el, index) => {
							// 팀구분
							el['team_origin'] = el.team
							el['team'] = el.team ? el.team.title : ''
							el['rank'] = el.rank ? el.rank.title : ''

							// 등록고객
							el['client_num'] = el.clients && el.clients.length > 0 ? el.clients.length : ''

							// 총 계약고객
							let complete = el.clients.filter(client => client.contractStatus === 'contractComplete')
							el['contract_num'] = complete.length > 0 ? complete.length : ''

							el.created_at = this.$moment(el.created_at).format('YYYY-MM-DD HH:mm:ss')

							// 목표 달성률
							let goal_complete = el.clients.filter(
								item =>
									this.$moment(item.created_at).isBetween(this.counselor_goal.goalStart, this.counselor_goal.goalEnd, undefined, '[]') &&
									item.contractStatus === 'contractComplete',
							)

							let percent = (goal_complete.length / this.counselor_goal.goalCount) * 100
							let completeRate = goal_complete.length - this.counselor_goal.goalCount

							el['goal_per'] =
								(percent ? percent.toFixed(1) + '%' : '') +
								'_' +
								(goal_complete.length ? goal_complete.length : '') +
								(goal_complete.length && completeRate < 0 ? '(' + completeRate + ')' : completeRate >= 0 ? '(+' + completeRate + ')' : '')
							// 목표 활성화
							if (el.goalActive) {
								el['status'] = '활성'
							} else {
								el['status'] = '비활성'
							}
							if (users_item.length - 1 === index) {
								if (users_item) {
									this.table.items = users_item
								}
							}
						})
					} else {
						this.table.items = []
					}

					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		async systems(businessId) {
			let data = {
				business: businessId,
			}
			await this.$store
				.dispatch('systems', data)
				.then(res => {
					let users_data = res.systems
					if (users_data.length > 0) {
						users_data.forEach(el => {
							if (users_data.goalActive) {
								el['status'] = '활성'
							} else {
								el['status'] = '비활성'
							}
						})
						this.counselor_goal = users_data.find(x => x.type === 'goal')

						this.set_counselor_status = JSON.parse(JSON.stringify(users_data.find(x => x.type === 'counselorStatus')))

						this.status_keyword.items = JSON.parse(JSON.stringify(users_data.find(x => x.type === 'counselorStatus')))
						this.status_keyword.items.counselorStatusOption.unshift('전체')
					}

					this.$store.state.loading = false
				})
				.catch(err => {
					console.log(err)
					this.$store.state.loading = false
				})
		},
		async change_table_goalActive(item) {
			// 테이블에서 상태값 변경
			this.$store.state.loading = true
			let variable = {
				id: item.id,
			}
			// 상태 값 정의

			if (item.status === '활성') {
				variable['goalActive'] = true
			} else if (item.status === '비활성') {
				variable['goalActive'] = false
			}

			this.$store.state.loading = true

			this.$store
				.dispatch('updateUser', variable)
				.then(() => {
					// this.save_dialog.open = true
					// this.save_dialog.content = '성공적으로 저장했습니다.'
					// this.save_dialog.btnTxt = '확인'

					this.$store.state.loading = false
				})
				.catch(err => {
					alert('오류가 발생했습니다.')

					console.log({ err })
					this.$store.state.loading = false
				})
		},
		updateSystem() {
			this.$store.state.loading = true

			const data = {
				id: this.counselor_goal.id, // 시스템 아이디
				type: 'goal',
				goalShow: this.counselor_goal_dialog.goalShow,
				goalActive: this.counselor_goal_dialog.goalActive,
				goalCount: Number(this.counselor_goal_dialog.goalCount),
				goalStart: this.counselor_goal_dialog.goalStart.date,
				goalEnd: this.counselor_goal_dialog.goalEnd.date,
			}
			this.$store
				.dispatch('updateSystem', data)
				.then(() => {
					// this.save_dialog.open = true
					// this.save_dialog.content = '성공적으로 저장했습니다.'
					// this.save_dialog.btnTxt = '확인'
					this.$store.state.loading = false
					this.newgoal.dialog = false

					if (this.counselor_goal_dialog.goalActive === true) {
						this.counselor_goal.goalShow = true
					} else {
						this.counselor_goal.goalShow = false
					}
					this.counselor_goal.goalActive = this.counselor_goal_dialog.goalActive
					this.counselor_goal.goalCount = this.counselor_goal_dialog.goalCount
					this.counselor_goal.goalStart = this.counselor_goal_dialog.goalStart.date
					this.counselor_goal.goalEnd = this.counselor_goal_dialog.goalEnd.date

					this.users()
				})
				.catch(err => {
					alert('오류가 발생했습니다.')

					console.log({ err })
					this.$store.state.loading = false
				})
		},
		statusUpdate(item) {
			this.$store.state.loading = true

			const data = {
				id: item.id,
				counselorStatus: item.counselorStatus,
			}
			this.$store
				.dispatch('updateUser', data)
				.then(() => {
					// this.save_dialog.open = true
					// this.save_dialog.content = '성공적으로 저장했습니다.'
					// this.save_dialog.btnTxt = '확인'

					this.users()
				})
				.catch(err => {
					alert('오류가 발생했습니다.')

					console.log({ err })
					this.$store.state.loading = false
				})
		},
		save_complete() {
			this.$store.state.loading = true
			this.users()
			this.$store.state.loading = false
		},
		save_complete2() {
			this.$store.state.loading = true
			this.users()
			this.systems()
			this.$store.state.loading = false
		},
		pdfdown(item) {
			axios({
				url: process.env.VUE_APP_BACKEND_URL + item.url,
				method: 'GET',
				responseType: 'blob',
			}).then(response => {
				var fileURL = window.URL.createObjectURL(new Blob([response.data]))
				var fileLink = document.createElement('a')

				fileLink.href = fileURL
				fileLink.setAttribute('download', item.name)
				document.body.appendChild(fileLink)

				fileLink.click()
			})
		},
	},
	data() {
		return {
			setPassword: {
				dialog: false,
				title: '비밀번호 변경',
			},
			counselor_detail: {
				dialog: false,
				value: '',
			},
			detail_data: {
				value: '',
				value_rank: '',
			},
			newgoal: {
				dialog: false,
				title: '목표설정',
			},
			counselor_status: {
				dialog: false,
				title: '상담사 상태관리',
				selected: [],
			},
			team_setting: {
				dialog: false,
				title: '팀 관리/변경',
			},
			set_counselor_status: {},
			counselor_goal: {
				goalActive: false,
			},
			counselor_goal_dialog: {
				goalShow: false,
				goalActive: false,
				goalCount: '',
				goalStart: {
					date: this.$moment().format('YYYY-MM-DD'),
				},
				goalEnd: {
					date: this.$moment().format('YYYY-MM-DD'),
				},
			},
			goal_select_items: ['활성', '비활성'],
			table: {
				headers: [
					{ text: '상담사', value: 'name', align: 'center', width: '100px' },
					{ text: '연락처', value: 'phone', align: 'center', width: '120px' },
					{ text: '등록일', value: 'created_at', align: 'center', width: '140px' },
					{ text: '상태', value: 'counselorStatus', align: 'center', width: '90px' },
					{ text: '팀구분', value: 'team', align: 'center', width: '170px' },
					{ text: '등록고객', value: 'client_num', align: 'center', width: '90px' },
					{ text: '총 계약고객', value: 'contract_num', align: 'center', width: '90px' },
					{ text: '목표 달성률', value: 'goal_per', align: 'center', width: '120px' },
					{ text: '목표 활성화', value: 'goalActive', align: 'center', width: '90px' },
				],
				headerCheck: false,
				items: [],
				selected: [],
				json_fields: {
					상담사: 'name',
					연락처: 'phone',
					등록일: 'created_at',
					상태: 'counselorStatus',
					팀구분: 'team',
					등록고객: 'client_num',
					총계약고객: 'contract_num',
					목표달성률: 'goal_per',
					목표활성화: 'status',
				},
			},
			clientTable: {
				headers: [
					{ text: '고객이름', value: 'name', align: 'center', width: '150px' },
					{ text: '연락처', value: 'phone', align: 'center', width: '150px' },
					{ text: '등록일', value: 'created_at', align: 'center', width: '150px' },
					{ text: '고객성향', value: 'like', align: 'center', width: '80px' },
					{ text: '계약상태', value: 'contractStatus', align: 'center', width: '260px' },
					{ text: '첨부파일', value: 'pricePaper', align: 'center', width: '330px' },
				],
				headerCheck: false,
				items: [],
				selected: [],
				json_fields: {
					고객이름: 'name',
					연락처: 'phone',
					등록일: 'created_at',
					고객성향: 'like',
					계약상태: 'contractStatus',
					첨부파일: 'pricePaper',
				},
			},
			search_keyword: {
				value: '',
				items: ['상담사 이름', '연락처'],
				input: '',
			},
			detailSearch_keyword: {
				value: '',
				items: ['고객이름', '연락처'],
				input: '',
			},
			status_keyword: {
				value: '전체',
				items: [],
				input: '',
			},
			detailStatus_keyword: {
				value: '전체',
				items: ['전체', 'DB등록', '상담대기', '상담완료', '계약가망', '계약대기', '계약완료'],
			},
			detail_team: {
				value: {},
				items: [],
				input: '',
			},
			detail_ranks: {
				value: {},
				items: [],
				input: '',
			},
			like_keyword: {
				value: '전체',
				items: ['전체', 'S', 'A', 'B', 'C', 'D'],
			},
			team_keyword: {
				value: { value: 'all', text: '전체' },
				items: [{ value: 'all', text: '전체' }],
				input: '',
			},
			ranks_keyword: {
				value: { value: 'all', text: '전체' },
				items: [{ value: 'all', text: '전체' }],
				input: '',
			},
			date: {
				value: '전체',
				start: {
					date: '',
				},
				end: {
					date: '',
				},
			},
		}
	},
}
</script>
<style lang="scss" scoped>
.detail_item {
	width: 170px;
	height: 36px;
	background: #f4f4f4;
	border-bottom: 1px solid #e0e0e0;
}
.main_title {
	font-size: 20px;
}
.router_title {
	font-size: 12px;
	font-weight: 100;
}
.search_box {
	width: 800px;
}
.search_title {
	width: 100px;
	font-size: 12px;
}
.search_body {
	display: flex;
	align-items: center;
	width: 600px;
}
.search_body2 {
	display: flex;
	align-items: center;
}
.search_btn {
	border-bottom: 1px solid #eaeaea;
}

.btn-style {
	box-shadow: none;
	background-color: #ffffff;
	border: 1px solid #9a9c9b;
	border-radius: 5px;
}
</style>
<style lang="scss">
.search_select {
	div {
		.v-input__slot {
			height: 35px !important;
			max-height: 35px !important;
			min-height: 35px !important;
			div {
				.v-input__append-inner {
					margin-top: 6px;
				}
			}
		}
	}
}
.text_field {
	width: 193px;
	margin-left: 10px;
	div {
		.v-input__slot {
			min-height: 35px !important;
			height: 35px;
			padding: 0 10px !important;
		}
	}
}
.date_picker {
	div {
		div {
			.v-input__slot {
				min-height: 35px !important;
				height: 35px !important;
			}
		}
	}
}

.counselor_table {
	.v-data-table__wrapper {
		border-bottom: 0;
		table {
			border-bottom: 1px solid #c4c4c4;
			thead {
				background: #f3f3f3;
				tr {
					th {
						width: 200px;
						height: 50px;
						text-align-last: center;
						border-top: 1px solid #7d7d7d !important;
						border-bottom: 1px solid #7d7d7d !important;
						border-right: 1px solid #c4c4c4;
					}
					th:nth-last-child(1) {
						border-right: 0;
					}
				}
			}
			tbody {
				tr {
					td {
						text-align-last: center;
					}
				}
			}
		}
	}
}
.counselor_table {
	.v-data-table__wrapper {
		table {
			tbody {
				tr {
					td {
						height: 50px;
						border-right: 1px solid #c4c4c4;
					}
					td:nth-last-child(1) {
						border-right: 0;
					}
				}
			}
		}
	}
}
.counselor_table {
	.v-data-footer {
		border: none !important;
	}
}
.detail_select {
	div {
		.v-input__slot {
			height: 25px !important;
			max-height: 25px !important;
			min-height: 25px !important;
			font-size: 13px;
			div {
				.v-input__append-inner {
					margin-top: 1px;
				}
			}
		}
	}
}
</style>
