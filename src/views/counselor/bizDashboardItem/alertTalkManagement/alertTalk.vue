<template>
	<div class="counselor_container">
		<div class="sticky_wrap_type">
			<div class="top_sticky_header">
				<v-layout class="tab_name_bar">
					<div class="header_left_btn">
						<v-btn icon x-large @click="to_bizDashboard()">
							<v-icon>
								mdi-chevron-left
							</v-icon>
						</v-btn>
						<div style="align-self:center">
							알림톡 관리
						</div>
					</div>
					<v-btn color="#633efd" class="ml-auto white--text alert_new" @click="alertNew()">신규등록</v-btn>
				</v-layout>
			</div>
			<v-layout justify-center class="basic_content">
				<div class="pb-4 basic_content_wrap">
					<v-text-field
						:autofocus="false"
						class="search-textfiled"
						placeholder="알림톡 제목"
						v-model="search_alert"
						hideDetails
						maxlength="255"
						append-icon="mdi-magnify"
						@click:append="alertTalkTable"
						@keyup.enter="alertTalkTable"
						flat
						dense
						color="primary2"
						autocomplete="off"
					></v-text-field>
					<v-layout align-center class="mx-5 mt-3 pb-4 select_wrap">
						<v-flex xs2>유형</v-flex>
						<v-flex xs7 class="mr-3">
							<v-select
								hideDetails
								dense
								outlined
								v-model="alertSelectBox.value"
								:items="alertSelectBox.items"
								color="primary2"
								class="search_select_type"
							></v-select>
						</v-flex>
						<v-flex xs3 style="text-align:end">
							<v-btn
								color="#633efd"
								class="ml-auto white--text alert_new"
								style="border-radius: 5px; height:25px !important"
								@click="alertTalkTable"
								>적용</v-btn
							>
						</v-flex>
					</v-layout>
					<v-layout class="mt-2 mb-3 mx-5">
						<div class="manage_table_result">
							검색결과 <span class="ml-2 mr-1" style="#633EFD">{{ talkData.items.length }}</span> 건
						</div>
					</v-layout>
					<v-data-table
						:headers="talkData.header"
						:items="talkData.items"
						mobile-breakpoint="100"
						show-select
						class="elevation-0 dashboard-table talk_table_font mx-5"
						:footer-props="{ itemsPerPageText: '' }"
					>
						<template v-slot:[`item.etc`]="{ item }">
							<v-layout justify-center>
								<v-btn small @click="detailClick(item)" :color="'#633EFD'" style="color:#fff" depressed>미리보기</v-btn>
							</v-layout>
						</template>
					</v-data-table>
					<div class="send_talk">
						<v-btn color="#F3AF0E" dark class="mr-5 white--text" @click="alertSendList()">
							발송하기
						</v-btn>
					</div>
				</div>
			</v-layout>
		</div>
		<alertTalkSend :sendDialog="sendDialog" />
		<alertDialog :dialogInfo="dialogInfo" />
	</div>
</template>

<script>
import alertTalkSend from './alertTalkSend.vue'
import alertDialog from './alertTalkDialog.vue'

export default {
	components: {
		alertTalkSend,
		alertDialog,
	},
	async created() {
		this.$store.state.loading = true
		await this.me()
		await this.alertTalkType()
		await this.alertTalkTable()
	},
	data() {
		return {
			dialogInfo: {
				open: false,
				addnew: false,
				preview: false,
				business: {
					title: '알림톡 미리보기',
					header: '알림톡 내용',
				},
				content_header: '',
				content: '',
				meData: { created_at: '', name: '' },
				bizData: [],
				productsList: [],
			},
			search_alert: '',
			talkData: {
				header: [
					{ text: '알림톡 유형', value: 'type', align: 'center', width: '30%' },
					{ text: '알림톡 제목', value: 'title', align: 'center', width: '50%' },
					{ text: '비고', value: 'etc', align: 'center', width: '15%' },
				],
				items: [],
			},
			sendDialog: {
				open: false,
				business: { title: '알림톡 발송' },
				meData: { created_at: '', name: '' },
				bizData: [],
				productsList: [],
			},
			alertSelectBox: {
				value: '전체',
				items: [],
			},
		}
	},
	methods: {
		alertTalkType() {
			let type = {
				type: 'talkType',
			}
			this.$store.dispatch('systems', type).then(res => {
				res.systems[0].counselorStatusOption.unshift('전체')
				this.alertSelectBox.items = res.systems[0].counselorStatusOption
			})
		},
		async me() {
			await this.$store.dispatch('me').then(() => {})
		},

		detailClick(item) {
			this.dialogInfo.open = true
			this.dialogInfo.preview = true
			this.dialogInfo.content = item.message
			this.dialogInfo.content_header = item.title
		},
		alertTalkTable() {
			const data = {
				users_permissions_users: this.$store.state.meData.id,
			}
			if (this.search_alert) {
				data['tplCodeStr'] = this.search_alert
			}
			if (this.alertSelectBox.value !== '전체') {
				data['type'] = this.alertSelectBox.value
			}
			this.$store.dispatch('messages', data).then(res => {
				let data = res.messages
				data.forEach(el => {
					el['title'] = el.tplCodeStr
				})
				this.talkData.items = data
				this.$store.state.loading = false
			})
		},
		to_bizDashboard() {
			// 뒤로가기 버튼
			this.$router.push({
				name: 'counselorBizDashboard',
				params: { id: this.$route.params.id },
			})
		},
		alertNew() {
			this.$router.push({
				name: 'alertTalkNew',
				params: { id: this.$route.params.id },
			})
		},
		alertSendList() {
			this.sendDialog.open = true
		},
	},
}
</script>

<style lang="scss">
.alert_new {
	align-self: center;
	border-radius: 30px;
	height: 30px !important;
	font-size: 12px !important;
}
.select_wrap {
	border-bottom: 1px solid #dedede;
	font-size: 12px;
}
.search_select_type {
	div {
		div {
			.v-input__append-inner {
				margin-top: 0 !important;
			}
		}
	}
}
.talk_table_font {
	div {
		table {
			thead {
				tr {
					th.text-start {
						div {
							div {
								display: none;
							}
						}
					}
					th {
						font-size: 0.8rem !important;
						padding: 0px 5px !important;
					}
				}
			}
			tbody {
				tr {
					td {
						font-size: 0.7rem !important;
						padding: 0px !important;
					}
				}
			}
		}
	}
}
.send_talk {
	text-align: end;
	button {
		height: 25px !important;
		font-size: 12px !important;
	}
}
</style>
