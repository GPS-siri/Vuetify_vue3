<template>
	<div style="width:100%">
		<v-layout align-center mb-4>
			<div class="main_title">
				출/퇴근 리스트
			</div>
			<div class="router_title ml-3">
				근태관리 > 출퇴근리스트
			</div>
		</v-layout>
		<div style="border-top:2px solid #b6b6b6;">
			<v-layout style="border-bottom:0.5px solid #b6b6b6;" align-center>
				<v-flex xs2 px-3 py-2 style="background-color:#f5f4f4;">전체 상담사</v-flex>
				<v-flex xs4 px-3 py-2>{{ allCounselor }}명</v-flex>
				<v-flex xs2 px-3 py-2 style="background-color:#f5f4f4;">일자선택</v-flex>
				<v-flex px-2 xs4>
					<div class="date_picker">
						<v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
							<template v-slot:activator="{ on, attrs }">
								<v-text-field
									v-model="date"
									prepend-inner-icon="mdi-calendar"
									readonly
									v-bind="attrs"
									v-on="on"
									outlined
									dense
									hide-details="false"
								></v-text-field>
							</template>

							<v-date-picker v-model="date" :allowed-dates="allowed_datesStart" scrollable> </v-date-picker>
						</v-dialog>
					</div>
				</v-flex>
			</v-layout>
			<v-layout style="border-bottom:0.5px solid #b6b6b6;">
				<v-flex xs2 px-3 py-2 style="background-color:#f5f4f4;">출근</v-flex>
				<v-flex xs2 px-3 py-2>{{ work }}명</v-flex>
				<v-flex xs2 px-3 py-2 style="background-color:#f5f4f4;">퇴근</v-flex>
				<v-flex xs2 px-3 py-2>{{ endWork }}명</v-flex>
				<v-flex xs2 px-3 py-2 style="background-color:#f5f4f4;">연차 및 반차</v-flex>
				<v-flex xs2 px-3 py-2>{{ holiDay }}명</v-flex>
			</v-layout>
		</div>
		<div style="border-top:1px solid #b6b6b6; border-bottom:1px solid #b6b6b6; margin-top:7vh;">
			<v-layout align-center mt-6>
				<v-layout align-center class="search_box">
					<v-flex xs6>
						<v-layout align-center>
							<v-flex xs1>
								검색어
							</v-flex>
							<v-flex xs4 mr-2>
								<v-select
									dense
									v-model="search_keyword.value"
									placeholder="검색어 입력"
									hideDetails
									:items="search_keyword.items"
									outlined
								></v-select>
							</v-flex>
							<v-flex xs4>
								<v-text-field dense v-model="search_keyword.input" hideDetails outlined></v-text-field>
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex xs6>
						<v-layout align-center>
							<v-flex xs1>
								상태
							</v-flex>
							<v-flex xs5>
								<v-select dense v-model="status_Keyword.value" hideDetails :items="status_Keyword.items" outlined></v-select>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</v-layout>
			<v-layout class="mt-8 pb-5 search_btn" justify-center align-center>
				<v-btn color="primary" style="width:120px; height:35px;" @click="searchAction()">
					검색
				</v-btn>
				<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="clearData()">
					초기화
				</v-btn>
			</v-layout>
		</div>
		<div class="mt-5">
			<v-layout justify-space-between align-center>
				<v-flex xs6>
					<span style="font-size:12px;"> 검색결과 총 {{ table.items.length }} 건 </span>
				</v-flex>
				<v-flex style="text-align: -webkit-right; ">
					<v-layout align-center style="width:450px; justify-content:right;">
						<v-btn small rounded outlined color="primary" @click="$router.push({ name: '/attendanceManagementList' })">
							출/퇴근 리스트보기
						</v-btn>
						<span style="font-size:12px; margin-left:10px; margin-right:10px;">
							|
						</span>
						<v-btn small outlined class="btn-style" color="green" @click="excelExport()">
							<img src="@/assets/images/excel-img2.png" />
							엑셀파일 다운로드
						</v-btn>
					</v-layout>
				</v-flex>
			</v-layout>
			<v-data-table
				:headers="table.headers"
				:items="table.items"
				show-select
				v-model="selected"
				item-key="userId"
				class="elevation-0 table_style_2 mt-2"
				:footer-props="{
					['items-per-page-options']: [10, 20, 30, 40, 50],
				}"
			>
				<template v-slot:[`item.data3`]="{ item }">
					<v-layout align-center justify-center>
						{{ item.data3 }}
						<v-icon v-if="item.data3 !== '-'" small class="ml-1" @click="gotoWorkDialogOpen(item)">mdi-pencil-circle</v-icon>
					</v-layout>
				</template>
				<template v-slot:[`item.data4`]="{ item }">
					<v-layout align-center justify-center>
						{{ item.data4 }}
						<v-icon v-if="item.data4 !== '-'" small class="ml-1" @click="leaveWorkDialogOpen(item)">mdi-pencil-circle</v-icon>
					</v-layout>
				</template>

				<template v-slot:[`item.data5`]="{ item }">
					<div>
						{{ item.data5 }}
					</div>
				</template>
				<template v-slot:[`item.data6`]="{ item }">
					<v-layout justify-center>
						<v-switch color="primary" :disabled="item.data7" value :input-value="item.data6" @click="goToWorkStatus(item)"></v-switch>
					</v-layout>
				</template>
				<template v-slot:[`item.data7`]="{ item }">
					<v-layout justify-center>
						<v-switch
							color="primary"
							:disabled="!item.data6 || item.data5.includes('휴가') || item.data5.includes('반차')"
							value
							:input-value="item.data7"
							@click="leaveWorkStatus(item)"
						></v-switch>
					</v-layout>
				</template>
			</v-data-table>
			<download-excel
				class="btn btn-default"
				id="clientExcel"
				:data="selected"
				style="display:none"
				:fields="table.json_fields"
				type="text/csv;charset=utf8"
				worksheet="My Worksheet"
				name="테스트"
			>
			</download-excel>
		</div>
		<v-dialog v-model="editGotoworkDialog" persistent width="400">
			<div class="create_wrap_lay">
				<div class="px-8 py-4" style="background:#2d1c71; color:white;">
					<v-layout>
						<span style="font-weight:bold;">{{ editGotoworkData.title }}</span>
						<v-spacer />
						<v-icon @click="close()" class="title-icon" color="white">mdi-close</v-icon>
					</v-layout>
				</div>
				<v-container style="font-size:0.75rem;">
					<v-layout style="border-top:2px solid #b6b6b6; border-bottom:0.5px solid #b6b6b6;" align-center>
						<v-flex xs4 px-3 py-2 style="background-color:#f5f4f4; ">상담사</v-flex>
						<v-flex xs8 px-3 py-2>{{ editGotoworkData.counselor }}</v-flex>
					</v-layout>
					<v-layout style="border-bottom:0.5px solid #b6b6b6;">
						<v-flex xs4 px-3 py-2 style="background-color:#f5f4f4;">선택일자</v-flex>
						<v-flex xs8 px-3 py-2>{{ $moment().format('YYYY-MM-DD') }}</v-flex>
					</v-layout>
					<v-layout v-if="editGotoworkData.status === 'goto'" style="border-bottom:0.5px solid #b6b6b6;">
						<v-flex xs4 px-3 py-2 style="background-color:#f5f4f4;">출근시간</v-flex>
						<v-flex xs8 px-3 py-2
							><v-dialog ref="startTimeDialog" v-model="startTimeDialog" :return-value.sync="startTime" persistent width="290px">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										class="time_picker"
										dense
										v-model="startTime"
										hide-details="false"
										outlined
										readonly
										v-bind="attrs"
										v-on="on"
									></v-text-field>
								</template>
								<v-time-picker
									v-if="startTimeDialog"
									:max="editGotoworkData.item.data4 === '-' ? '' : $moment(editGotoworkData.item.data4).format('HH:mm')"
									v-model="startTime"
									full-width
								>
									<v-spacer></v-spacer>
									<v-btn text color="primary" @click="startTimeDialog = false">
										Cancel
									</v-btn>
									<v-btn text color="primary" @click="$refs.startTimeDialog.save(startTime)">
										OK
									</v-btn>
								</v-time-picker>
							</v-dialog></v-flex
						>
					</v-layout>
					<v-layout v-if="editGotoworkData.status === 'leave'" style="border-bottom:0.5px solid #b6b6b6;">
						<v-flex xs4 px-3 py-2 style="background-color:#f5f4f4;">퇴근시간</v-flex>
						<v-flex xs8 px-3 py-2
							><v-dialog ref="endTimeDialog" v-model="endTimeDialog" :return-value.sync="endTime" persistent width="290px">
								<template v-slot:activator="{ on, attrs }">
									<v-text-field
										class="time_picker"
										dense
										hide-details="false"
										v-model="endTime"
										outlined
										readonly
										v-bind="attrs"
										v-on="on"
									></v-text-field>
								</template>
								<v-time-picker
									v-if="endTimeDialog"
									:min="$moment(editGotoworkData.item.data3).format('HH:mm')"
									v-model="endTime"
									full-width
								>
									<v-spacer></v-spacer>
									<v-btn text color="primary" @click="endTimeDialog = false">
										Cancel
									</v-btn>
									<v-btn text color="primary" @click="$refs.endTimeDialog.save(endTime)">
										OK
									</v-btn>
								</v-time-picker>
							</v-dialog></v-flex
						>
					</v-layout>
				</v-container>
				<v-layout class="mt-4 pb-4" justify-center align-center>
					<v-btn color="primary" style="width:120px; height:35px;" @click="goToworkTimeCheck()">
						저장
					</v-btn>
					<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="close()">
						취소
					</v-btn>
				</v-layout>
			</div>
		</v-dialog>
		<saveDialog :dialog="downloadDialogStatus" :activeSave="downloadActiveSave"></saveDialog>
		<saveDialog :dialog="saveDialogStatus" :activeSave="activeSave"></saveDialog>
	</div>
</template>

<script>
// import downloadExcel from 'vue-json-excel'
import { saveDialog } from '@/components'
export default {
	components: { saveDialog },
	methods: {
		gotoWorkDialogOpen(item) {
			this.editGotoworkData = {
				title: '출근 시간변경',
				counselor: item.data1,
				status: 'goto',
				item: item,
			}
			this.editGotoworkDialog = true
		},
		leaveWorkDialogOpen(item) {
			this.editGotoworkData = {
				title: '출근 시간변경',
				counselor: item.data1,
				status: 'leave',
				item: item,
			}
			this.editGotoworkDialog = true
		},
		goToworkTimeCheck() {
			if (this.editGotoworkData.status === 'goto') {
				if (this.startTime === '') {
					this.saveDialogStatus = {
						open: true,
						content: '시간을 입력해주세요.',
						cancelBtnTxt: '확인',
						cancelBtn: true,
					}
				} else {
					this.saveDialogStatus = {
						open: true,
						content: '저장하시겠습니까?',
						cancelBtnTxt: '취소',
						cancelBtn: true,
						btnTxt: '저장',
						activeBtn: true,
					}
				}
			} else if (this.editGotoworkData.status === 'leave') {
				if (this.endTime === '') {
					this.saveDialogStatus = {
						open: true,
						content: '시간을 입력해주세요.',
						cancelBtnTxt: '확인',
						cancelBtn: true,
					}
				} else {
					this.saveDialogStatus = {
						open: true,
						content: '저장하시겠습니까?',
						cancelBtnTxt: '취소',
						cancelBtn: true,
						btnTxt: '저장',
						activeBtn: true,
					}
				}
			}
		},

		allowed_datesStart(val) {
			val = this.$moment().format('YYYY-MM-DD') >= val
			return val
		},
		activeSave() {
			let today = this.$moment(this.date).format('YYYY-MM-DD')
			if (this.editGotoworkData.status === 'goto') {
				const data = {
					id: this.editGotoworkData.item.id,
					startWork: this.$moment(today + ' ' + this.startTime),
				}
				this.updateGotoworkAction(data)
			} else if (this.editGotoworkData.status === 'leave') {
				const data = {
					id: this.editGotoworkData.item.id,
					endWork: this.$moment(today + ' ' + this.endTime),
				}
				this.updateGotoworkAction(data)
			}
			this.editGotoworkDialog = false
			this.saveDialogStatus.open = false
		},
		downloadActiveSave() {
			document.getElementById('clientExcel').click()
			this.downloadDialogStatus.open = false
		},
		close() {
			this.editGotoworkDialog = false
		},
		updateGotoworkAction(data) {
			this.$store
				.dispatch('updateGotowork', data)
				.then(() => {
					let userViewData = {
						business: this.$store.state.meData.business.id,
						date: this.$moment(this.date).format('YYYY-MM-DD'),
						role: 3,
					}
					this.usersView(userViewData)
				})
				.catch(err => {
					console.log({ err })
				})
		},
		deleteGotoworkAction(data) {
			this.$store
				.dispatch('deleteGotowork', data)
				.then(() => {
					let userViewData = {
						business: this.$store.state.meData.business.id,
						date: this.$moment(this.date).format('YYYY-MM-DD'),
						role: 3,
					}
					this.usersView(userViewData)
				})
				.catch(err => {
					console.log({ err })
				})
		},
		goToWorkStatus(status) {
			if (status.data6) {
				const data = {
					id: status.id,
				}
				this.deleteGotoworkAction(data)
			} else {
				const data = {
					date: this.$moment(this.date).format('YYYY-MM-DD'),
					users_permissions_user: status.userId,
					business: this.$store.state.meData.business.id,
					status: 'startWork',
				}
				if (this.$moment().format('YYYY-MM-DD') === this.date) {
					data.startWork = this.$moment()
				} else {
					data.startWork = this.$moment(this.date)
				}

				this.createGotoworkAction(data)
			}
		},
		leaveWorkStatus(status) {
			if (status.data7) {
				const data = {
					id: status.id,
					users_permissions_user: status.userId,
					endWork: null,
					status: 'startWork',
				}
				this.updateGotoworkAction(data)
			} else {
				if (this.$moment(this.date).format('YYYY-MM-DD') === this.$moment(this.$moment().format('YYYY-MM-DD')).format('YYYY-MM-DD')) {
					const data = {
						id: status.id,
						users_permissions_user: status.userId,

						endWork: this.$moment(),
						status: 'endWork',
					}
					this.updateGotoworkAction(data)
				} else {
					const data = {
						id: status.id,
						users_permissions_user: status.userId,
						endWork: this.$moment(this.date),
						status: 'endWork',
					}
					this.updateGotoworkAction(data)
				}
			}
		},
		createGotoworkAction(data) {
			this.$store
				.dispatch('createGotowork', data)
				.then(() => {
					let userViewData = {
						business: this.$store.state.meData.business.id,
						date: this.$moment(this.date).format('YYYY-MM-DD'),
						role: 3,
					}
					this.usersView(userViewData)
				})
				.catch(err => {
					console.log({ err })
				})
		},
		clearData() {
			this.search_keyword = {
				value: '상담사 이름',
				items: ['상담사 이름', '연락처'],
				input: '',
			}
			let data = {
				business: this.$store.state.meData.business.id,
				date: this.$moment(this.date).format('YYYY-MM-DD'),
				role: 3,
			}
			this.usersView(data)
		},
		searchAction() {
			let data = {
				business: this.$store.state.meData.business.id,
				date: this.$moment(this.date).format('YYYY-MM-DD'),
				role: 3,
			}
			if (this.search_keyword.value === '상담사 이름') {
				data.name = this.search_keyword.input
			} else {
				data.phone = this.search_keyword.input
			}
			// if (this.status_Keyword.value === '전체') {
			// 	data.status = ''
			// } else
			if (this.status_Keyword.value === '출근') {
				data.status = 'startWork'
			} else if (this.status_Keyword.value === '정상') {
				data.status = 'endWork'
			} else if (this.status_Keyword.value === '연차') {
				data.status = 'vacation'
			} else if (this.status_Keyword.value === '오전반차') {
				data.status = 'morningVacation'
			} else if (this.status_Keyword.value === '오후반차') {
				data.status = 'afternoonVacation'
			} else if (this.status_Keyword.value === '미확인') {
				data.status = 'none'
			}
			this.usersView(data)
		},
		timeCheck(start, end) {
			const moment = require('moment')
			let timeData = ''
			let hour = parseInt(moment.duration(this.$moment(end).diff(this.$moment(start))).asMinutes() / 60)
			let minute = parseInt(moment.duration(this.$moment(end).diff(this.$moment(start))).asMinutes() % 60)
			if (minute === 0) {
				timeData = hour + '시간'
			} else {
				timeData = hour + '시간' + minute + '분'
			}
			return timeData
		},
		usersView(data) {
			this.$store
				.dispatch('users', data)
				.then(res => {
					let list = []
					let workCount = 0
					let endWorkCount = 0
					let holiDayCount = 0
					res.users.forEach(element => {
						let listData = {}
						listData.userId = element.id
						listData.data1 = element.name
						listData.data2 = element.phone
						if (element.gotoworks.length > 0) {
							listData.id = element.gotoworks[0].id
							listData.data3 =
								element.gotoworks[0].startWork !== null ? this.$moment(element.gotoworks[0].startWork).format('YYYY-MM-DD HH:mm:ss') : '-'
							listData.data4 =
								element.gotoworks[0].endWork !== null ? this.$moment(element.gotoworks[0].endWork).format('YYYY-MM-DD HH:mm:ss') : '-'
							listData.data5 =
								element.gotoworks[0].status === 'endWork'
									? '퇴근'
									: element.gotoworks[0].status === 'afternoonVacation'
									? '오후반차'
									: element.gotoworks[0].status === 'morningVacation'
									? '오전반차'
									: element.gotoworks[0].status === 'vacation'
									? '휴가'
									: '출근'
							if (element.gotoworks[0].status === 'vacation') {
								listData.data6 = true
								listData.data7 = true
								listData.data8 = '-'
							} else {
								listData.data6 = true
								listData.data7 = element.gotoworks[0].endWork ? true : false
							}

							if (element.gotoworks[0].startWork && element.gotoworks[0].endWork) {
								listData.data8 = this.timeCheck(element.gotoworks[0].startWork, element.gotoworks[0].endWork)
							}
							if (element.gotoworks[0].status === 'startWork') {
								workCount = workCount + 1
							}
							if (element.gotoworks[0].status === 'endWork') {
								endWorkCount = endWorkCount + 1
							}
							if (
								element.gotoworks[0].status === 'afternoonVacation' ||
								element.gotoworks[0].status === 'morningVacation' ||
								element.gotoworks[0].status === 'vacation'
							) {
								holiDayCount = holiDayCount + 1
							}
						} else {
							listData.data3 = '-'
							listData.data4 = '-'
							listData.data5 = '미확인'
							listData.data8 = '-'
						}

						list.push(listData)
					})
					this.allCounselor = list.length
					this.work = workCount
					this.endWork = endWorkCount
					this.holiDay = holiDayCount
					if (this.status_Keyword.value === '전체') {
						this.table.items = list
					} else {
						let arrayData = []
						arrayData = list.filter(x => x.data5 === this.status_Keyword.value)
						this.table.items = arrayData
					}
				})
				.catch(err => {
					console.log({ err })
				})
		},
		excelExport() {
			if (this.selected.length > 0) {
				this.downloadDialogStatus = {
					open: true,
					content: '엑셀 다운로드를 받으시겠습니까?',
					cancelBtnTxt: '취소',
					cancelBtn: true,
					btnTxt: '다운로드',
					activeBtn: true,
				}
				// document.getElementById('clientExcel').click()
			} else {
				this.downloadDialogStatus = {
					open: true,
					content: '엑셀 다운로드 받을 상담사를 선택해주세요.',
					cancelBtnTxt: '확인',
					cancelBtn: true,
				}
			}
		},
	},
	watch: {
		date() {
			this.$refs.dialog.save(this.date)
			this.search_keyword = {
				value: '',
				items: ['상담사 이름', '연락처'],
				input: '',
			}
			const data = {
				business: this.$store.state.meData.business.id,
				date: this.$moment(this.date).format('YYYY-MM-DD'),
				role: 3,
			}
			this.usersView(data)
		},
	},
	data() {
		return {
			startTimeDialog: false,
			endTimeDialog: false,
			startTime: '',
			endTime: '',
			saveDialogStatus: {
				open: false,
				content: '저장하시겠습니까?',
				btnTxt: '저장',
			},
			downloadDialogStatus: {
				open: false,
				content: '저장하시겠습니까?',
				btnTxt: '저장',
			},
			editGotoworkDialog: false,
			editGotoworkData: {
				title: '',
				counselor: '',
				status: '',
			},
			modal: false,
			date: this.$moment().format('YYYY-MM-DD'),
			selected: [],
			allCounselor: 0,
			work: 0,
			endWork: 0,
			holiDay: 0,
			table: {
				headers: [
					{ text: '상담사', value: 'data1', align: 'center', width: '15%' },
					{ text: '연락처', value: 'data2', align: 'center', width: '15%' },
					{ text: '출근시간', value: 'data3', align: 'center', width: '15%' },
					{ text: '퇴근시간', value: 'data4', align: 'center', width: '15%' },
					{ text: '상태', value: 'data5', align: 'center', width: '10%' },
					{ text: '출근', value: 'data6', align: 'center', width: '10%' },
					{ text: '퇴근', value: 'data7', align: 'center', width: '10%' },
					{ text: '근무시간', value: 'data8', align: 'center', width: '10%' },
				],
				headerCheck: false,
				items: [],
				select_items: [],
				json_fields: {
					상담사: 'data1',
					연락처: 'data2',
					출근시간: 'data3',
					퇴근시간: 'data4',
					상태: 'data5',
					// 출근: 'data6',
					// 퇴근: 'data7',
					근무시간: 'data8',
				},
			},
			search_keyword: {
				value: '',
				items: ['상담사 이름', '연락처'],
				input: '',
			},
			status_Keyword: {
				value: '전체',
				items: ['전체', '출근', '정상', '연차', '오전반차', '오후반차', '미확인'],
			},
			status: {
				value: '전체',
				items: ['전체', '미계약', '계약완료'],
			},
		}
	},
	created() {
		const meDataCheck = setInterval(() => {
			let ok = 0
			ok += 1
			if (this.$store.state.meData.business) {
				const data = {
					business: this.$store.state.meData.business.id,
					date: this.$moment(this.date).format('YYYY-MM-DD'),
					role: 3,
				}
				this.usersView(data)
				clearInterval(meDataCheck)
			} else if (ok === 5) {
				clearInterval(meDataCheck)
			}
		}, 1000)
	},
}
</script>
<style lang="scss" scoped>
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

.table_style_2 > .v-data-table__wrapper {
	overflow: overlay;
	table {
		border-right: 1px solid #d1d1d1;
		border-left: 1px solid #d1d1d1;
		border-bottom: 1px solid #d1d1d1;
		thead {
			tr {
				z-index: 1;
				th:not(:last-of-type) {
					border-right: 1px solid #d1d1d1;
				}
				th {
					text-align: center !important;
					color: #333333;
					height: 53px;
					border-top: 1px solid #7d7d7d !important;
					border-bottom: 1px solid #7d7d7d !important;
					background-color: #f5f5f5 !important;
				}
			}
		}
	}
}

.table_style_2 > .v-data-table__wrapper > table {
	tbody {
		tr {
			td:not(:last-of-type) {
				border-right: 1px solid #d1d1d1;
			}
			td {
				height: 50px;
				text-align: center !important;
				background-color: #ffffff !important;
			}
		}
	}
}

.table_box {
	div {
		.v-data-table__wrapper::-webkit-scrollbar {
			width: 12px;
			height: 12px;
		}
	}
}
.table_box {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-thumb {
			background-color: #ced4d7;
			border-radius: 10px;
			background-clip: padding-box;
			border: 2px solid transparent;
		}
	}
}
.table_box {
	div {
		.v-data-table__wrapper::-webkit-scrollbar-track {
			background-color: transparent;
			border-radius: 10px;
			box-shadow: inset 0px 0px 5px white;
			margin-left: 990px;
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
.time_picker {
	div {
		div {
			.v-input__slot {
				min-height: 35px !important;
				height: 35px !important;
			}
		}
	}
}
.create_wrap_lay {
	background: white;
	height: 'auto' !important;
}
</style>
