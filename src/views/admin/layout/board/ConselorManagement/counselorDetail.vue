<template>
	<div style="width:100%; ">
		<div>
			<v-layout align-center>
				<v-icon class="mr-2" @click="back()" color="#3a258f">mdi-chevron-left-circle-outline</v-icon>
				<div class="main_title">
					상담사 상세정보
				</div>
				<div class="router_title ml-3">
					상담사 관리 > 상담사 리스트 > 상담사 상세
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
			<div class="mt-6 mb-12" style="border-top:1px solid #AAAAAA; font-size:14px">
				<v-layout align-center style="border-bottom:1px solid #E0E0E0; height:38px;">
					<v-flex px-2 py-2 xs2 style="background-color: #f4f4f4; ">
						상담사 이름
					</v-flex>
					<v-flex px-2 py-2 style="" xs4>
						{{ detail_data.name ? detail_data.name : '-' }}
					</v-flex>
					<v-flex px-2 py-2 xs2 style="background: #f4f4f4; ">
						계좌정보(은행)
					</v-flex>
					<v-flex px-2 py-2 style="" xs4>
						{{ detail_data.account ? detail_data.account : '-' }}
						({{ detail_data.bank ? detail_data.bank : '-' }})
					</v-flex>
				</v-layout>
				<v-layout align-center style="border-bottom:1px solid #E0E0E0; height:38px;">
					<v-flex px-2 py-2 xs2 style="background: #f4f4f4;  ">
						휴대전화번호
					</v-flex>
					<v-flex px-2 py-2 style="" xs4>
						{{ detail_data.phone ? detail_data.phone : '-' }}
					</v-flex>
					<v-flex px-2 py-2 xs2 style="background: #f4f4f4;  ">
						이메일
					</v-flex>
					<v-flex px-2 py-2 style="" xs4>
						{{ detail_data.email ? detail_data.email : '-' }}
						<v-btn outlined class="px-8 py-1" style="height:25px" @click="passwordChange()">비밀번호 변경</v-btn>
						<changePassword :setdialog="setPassword" :passwordData="detail_data" />
					</v-flex>
				</v-layout>
				<v-layout style="border-bottom:1px solid #E0E0E0; height:37px;">
					<v-flex px-2 py-2 xs2 style="background: #f4f4f4;">
						회사명
					</v-flex>
					<v-flex px-2 py-2 style="" xs4>
						{{ detail_data.companyName ? detail_data.companyName : '-' }}
					</v-flex>
					<v-flex px-2 py-2 xs2 style="background: #f4f4f4;">
						팀구분
					</v-flex>
					<v-flex px-2 xs4 style="align-self:center">
						<v-layout>
							<div class="mr-1" style="width:130px; ">
								<v-select
									class="detail_select"
									v-model="detail_team.value"
									:items="detail_team.items"
									hideDetails
									outlined
									return-object
									@change="teams_selected()"
								></v-select>
							</div>
							<div style="width:130px">
								<v-select
									class="detail_select"
									v-model="detail_ranks.value"
									:items="detail_ranks.items"
									hideDetails
									return-object
									outlined
								></v-select>
							</div>
							<v-btn class="ml-2" color="primary" style="width:60px; height:25px;" @click="detail_change()">
								적용
							</v-btn>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout align-center style="border-bottom:1px solid #E0E0E0; height:38px;">
					<v-flex px-2 py-2 xs2 style="background: #f4f4f4; ; ">
						등록일
					</v-flex>
					<v-flex px-2 py-2 style=" " xs4>
						{{ detail_data.created_at ? detail_data.created_at : '-' }}
					</v-flex>
					<v-flex px-2 py-2 xs2 style="background: #f4f4f4; ">
						퇴사일
					</v-flex>
					<v-flex px-2 py-2 style=" " xs4>
						{{ detail_data.fireDate ? detail_data.fireDate : '-' }}
					</v-flex>
				</v-layout>
			</div>
		</div>

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
								v-model="detailSearch_keyword.value"
								hideDetails
								:items="detailSearch_keyword.items"
								outlined
								@change="detailSearch_keyword.input = ''"
								placeholder="검색어 입력"
							></v-select>
						</div>
						<div style="width:200px;" class="ml-3">
							<v-text-field
								class="text_field"
								:disabled="detailSearch_keyword.value ? false : true"
								v-model="detailSearch_keyword.input"
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
								v-model="detailStatus_keyword.value"
								hideDetails
								:items="detailStatus_keyword.items"
								outlined
							></v-select>
						</div>
					</div>
					<v-layout align-center class="search_body">
						<div class="ml-5" style="width:60px; font-size:12px">
							고객성향
						</div>
						<div style="width:200px" class="ml-3">
							<v-select
								class="search_select"
								v-model="like_keyword.value"
								hideDetails
								:items="like_keyword.items"
								outlined
								return-object
							></v-select>
						</div>
					</v-layout>
				</v-layout>
			</v-layout>
		</div>
		<v-layout class="mt-8 pb-5 search_btn" justify-center align-center>
			<v-btn color="primary" style="width:120px; height:35px;" @click="detailFilter_search()">
				검색
			</v-btn>
			<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="detailSearch_reset()">
				초기화
			</v-btn>
		</v-layout>

		<div class="mt-5">
			<v-layout align-center>
				<div style="font-size:12px">검색결과 총 {{ clientTable.items.length }} 건</div>
				<v-layout justify-end align-center>
					<span class="ml-3">|</span>
					<v-btn small outlined color="#00B241" class="btn-style ml-3" style="border:1px solid #00B241" @click="excelExport2()">
						<img src="@/assets/images/excel-img2.png" />
						엑셀저장
					</v-btn>
				</v-layout>
			</v-layout>
			<v-data-table
				class="counselor_table mt-3"
				v-model="clientTable.selected"
				:headers="clientTable.headers"
				:items="clientTable.items"
				show-select
				:footer-props="{
					['items-per-page-text']: ``,
				}"
			>
				<!-- 계약상태 -->
				<template v-slot:[`item.contractStatus`]="{ item }">
					<v-layout wrap style="height: 100%;">
						<v-flex xs6 class="border_right text_center">
							<div class="pr-4" style="width:100%; text-align: start;">
								{{ tableStatus(item.contractStatus.split('/')[0]) }}
							</div>
						</v-flex>
						<v-flex xs6 class="text_center">
							<div class="pl-4" style="width:100%; text-align: start;">
								<v-select
									v-if="item.contractStatus.split('/')[0] === 'contractComplete'"
									class="search_select"
									style="font-size:12px"
									v-model="item.contractStatus.split('/')[1]"
									hideDetails
									:items="item.products ? item.products : []"
									outlined
									item-text="title"
								></v-select>
								<v-select
									v-else
									class="search_select"
									style="font-size:12px"
									v-model="item.products[0]"
									hideDetails
									:items="item.products ? item.products : []"
									outlined
									item-text="title"
								></v-select>
							</div>
						</v-flex>
					</v-layout>
				</template>
				<!-- 첨부파일 -->
				<template v-slot:[`item.pricePaper`]="{ item }">
					<v-layout wrap style="height: 100%;">
						<v-flex class="text_center">
							<div
								v-for="data in item.pricePaper"
								:key="data.name"
								class="pr-4"
								style="width:100%; text-align: start; cursor:pointer;"
								@click="pdfdown(data)"
							>
								{{ data.name }}
							</div>
						</v-flex>
					</v-layout>
				</template>
			</v-data-table>

			<download-excel
				class="btn btn-default"
				id="client_list_Excel"
				:data="clientTable.selected"
				style="display:none"
				:fields="clientTable.json_fields"
				type="text/csv;charset=utf8"
				worksheet="My Worksheet"
				name="상담사 고객 리스트.xls"
			>
			</download-excel>
		</div>
	</div>
</template>

<script>
import { DatepickerDialog, changePassword } from '@/components'
import downloadExcel from 'vue-json-excel'
import axios from 'axios'
export default {
	components: { DatepickerDialog, downloadExcel, changePassword },
	created() {
		this.$store.state.loading = true

		let interval = setInterval(async () => {
			if (this.$store.state.meData.business) {
				clearInterval(interval)
				await this.teams()
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
		back() {
			this.$router.push({ name: 'counselor' })
		},
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
		//팀변경
		detail_change() {
			this.$store.state.loading = true

			const data = {
				id: this.detail_data.id,
				team: this.detail_team.value.value,
				rank: this.detail_ranks.value.value,
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

		detailFilter_search() {
			// 검색 버튼 클릭
			// let filtered = JSON.parse(JSON.stringify(this.clientTable.items2))
			const input = {
				id: this.detail_data.id,
			}
			// 검색어
			if (this.detailSearch_keyword.input) {
				if (this.detailSearch_keyword.value === '고객이름') {
					input.clientName = this.detailSearch_keyword.input
				}
				if (this.detailSearch_keyword.value === '연락처') {
					input.clientPhone = this.detailSearch_keyword.input
				}
				// this.detailSearch_keyword.value === '연락처' ? this.detailSearch_keyword.input : ''
			}
			// 등록일

			// 상태
			if (this.detailStatus_keyword.value === 'DB등록') {
				input.clientStatus = 'db'
			}
			if (this.detailStatus_keyword.value === '상담대기') {
				input.clientStatus = 'consultingWait'
			}
			if (this.detailStatus_keyword.value === '상담완료') {
				input.clientStatus = 'consultingComplete'
			}
			if (this.detailStatus_keyword.value === '계약가망') {
				input.clientStatus = 'contractWish'
			}
			if (this.detailStatus_keyword.value === '계약대기') {
				input.clientStatus = 'contractWait'
			}
			if (this.detailStatus_keyword.value === '계약완료') {
				input.clientStatus = 'contractComplete'
			}
			if (this.date.start.date !== '') {
				input.clientStartCreated_at = this.$moment(this.date.start.date)
			}
			if (this.date.end.date !== '') {
				input.clientEndCreated_at = this.$moment(this.date.end.date).add(1, 'd')
			}
			// 고객성향
			if (this.like_keyword.value === 'S') {
				input.clientLike = 'S'
			}
			if (this.like_keyword.value === 'A') {
				input.clientLike = 'A'
			}
			if (this.like_keyword.value === 'B') {
				input.clientLike = 'B'
			}
			if (this.like_keyword.value === 'C') {
				input.clientLike = 'C'
			}
			if (this.like_keyword.value === 'D') {
				input.clientLike = 'D'
			}
			this.$store
				.dispatch('users', input)
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
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},

		detailSearch_reset() {
			this.detailSearch_keyword.value = ''
			this.detailSearch_keyword.input = ''
			this.date.value = '전체'
			this.date.start.date = null
			this.date.end.date = null
			this.detailStatus_keyword.value = '전체'
			this.like_keyword.value = '전체'
			this.detailFilter_search()
		},

		excelExport2() {
			document.getElementById('client_list_Excel').click()
		},

		async teams_selected(value, rank) {
			let team = {
				id: value ? value : this.detail_team.value.value,
			}
			this.$store.state.loading = true
			await this.$store
				.dispatch('teams', team)
				.then(res => {
					let item3 = []
					res.teams[0]?.ranks.forEach(el => {
						item3.push({
							value: el.id,
							text: el.title,
						})
					})
					this.detail_ranks.items = item3
					if (rank) {
						this.detail_ranks.value = { value: rank.id, text: rank.text }
					} else {
						this.detail_ranks.value = item3[0]
					}
					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},
		async users() {
			let input

			input = {
				id: this.$route.params.id,
			}

			this.$store.state.loading = true
			await this.$store
				.dispatch('users', input)
				.then(res => {
					let item = res.users[0]
					this.detail_data = JSON.parse(JSON.stringify(item))
					this.detail_data.created_at = this.$moment(this.detail_data.created_at).format('YYYY-MM-DD')

					if (this.detail_data.counselorStatus === '퇴사') {
						this.detail_data.fireDate = this.$moment().format('YYYY-MM-DD')
					} else {
						this.detail_data.fireDate = '-'
					}
					if (item.team) {
						this.detail_team.value = { text: item.team.title, value: item.team.id }
						this.teams_selected(item.team.id, item.rank)
					}

					res.users[0].clients.forEach(el => {
						el.created_at = this.$moment(el.created_at).format('YYYY-MM-DD HH:mm:ss')
						// 계약상태
						el['contractStatus_origin'] = el.contractStatus
						el['contractStatus'] =
							(el.contractStatus ? el.contractStatus : '') +
							'/' +
							(el.customDatas.contract_product ? el.customDatas.contract_product.name : '')
					})

					this.clientTable.items = res.users[0].clients
					this.clientTable.items2 = res.users[0].clients

					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
		},

		async teams() {
			let team = {
				business: this.$store.state.meData.business.id,
			}

			await this.$store
				.dispatch('teams', team)
				.then(res => {
					let item2 = []

					res.teams.forEach(el => {
						item2.push({
							value: el.id,
							text: el.title,
						})
					})
					this.detail_team.items = item2

					this.$store.state.loading = false
				})
				.catch(err => {
					console.log({ err })
					this.$store.state.loading = false
				})
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
			detail_data: {
				value: '',
				value_rank: '',
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

			detailSearch_keyword: {
				value: '',
				items: ['고객이름', '연락처'],
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
