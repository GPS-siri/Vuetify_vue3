<template>
	<div class="counselor_container">
		<div class="sticky_wrap_type">
			<div class="top_sticky_header">
				<v-layout class="tab_name_bar">
					<div class="header_left_btn">
						<v-btn icon x-large @click="toAlertTalk()">
							<v-icon>
								mdi-chevron-left
							</v-icon>
						</v-btn>
						<div style="align-self:center">
							알림톡 관리 > 신규 등록
						</div>
					</div>
				</v-layout>
			</div>
			<v-layout justify-center class="basic_content">
				<div class="pb-4 basic_content_wrap">
					<v-text-field
						:autofocus="false"
						class="alert-textfiled"
						placeholder="알림톡 제목"
						v-model="search_alert2"
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
								v-model="alertSelectBox.value"
								dense
								outlined
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
						v-model="talkData.selected"
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
						<v-btn color="#F3AF0E" dark class="mr-5 white--text" @click="checkAlert()">
							알림톡 담기
						</v-btn>
					</div>
				</div>
			</v-layout>
		</div>
		<alertDialog :dialogInfo="dialogInfo" />
	</div>
</template>

<script>
import alertDialog from './alertTalkDialog.vue'

export default {
	components: {
		alertDialog,
	},
	async created() {
		this.$store.state.loading = true
		await this.alertTalkType()
		await this.alertTalkTable()
	},
	data() {
		return {
			search_alert2: '',
			talkData: {
				header: [
					{ text: '알림톡 유형', value: 'type', align: 'center', width: '30%' },
					{ text: '알림톡 제목', value: 'title', align: 'center', width: '50%' },
					{ text: '비고', value: 'etc', align: 'center', width: '20%' },
				],
				items: [],
				selected: [],
			},
			dialogInfo: {
				open: false,
				addnew: false,
				preview: false,
				business: {
					title: '알림톡 등록',
					header: '선택한 알림톡을 담습니다.',
				},
				addtalk: [],
				content_header: '',
				content: '',
				table_header: ['유형', '제목'],
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
		detailClick(item) {
			this.dialogInfo.open = true
			this.dialogInfo.addnew = false
			this.dialogInfo.preview = true
			this.dialogInfo.content = item.message
			this.dialogInfo.content_header = item.title
		},
		alertTalkTable() {
			let variable = {}

			if (this.search_alert2) {
				variable['tplCodeStr'] = this.search_alert2
			}
			if (this.alertSelectBox.value !== '전체') {
				variable['type'] = this.alertSelectBox.value
			}
			this.$store.dispatch('messages', variable).then(res => {
				let data = res.messages
				data.forEach(el => {
					el['title'] = el.tplCodeStr
				})
				this.talkData.items = data
				this.$store.state.loading = false
			})
		},
		toAlertTalk() {
			this.$router.push({
				name: 'alertTalk',
				params: { id: this.$route.params.id },
			})
		},
		checkAlert() {
			if (this.talkData.selected.length === 0) {
				return alert('알림톡을 선택해주세요.')
			} else {
				this.dialogInfo.open = true
				this.dialogInfo.addnew = true
				this.dialogInfo.preview = false
				this.dialogInfo.addtalk = this.talkData.selected
			}
			console.log(this.dialogInfo.addtalk)
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
.alert-textfiled {
	padding: 0px 20px;
	.v-input__slot {
		padding: 10px 10px 5px 10px;
	}
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
