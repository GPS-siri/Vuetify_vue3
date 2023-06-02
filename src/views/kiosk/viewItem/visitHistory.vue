<template>
	<div class="visit_wrap">
		<div class="project_title px-5" :style="`background-color:${$store.state.PointColor2}`">
			<h2 style="font-size:15px">고객이력 조회</h2>
			<v-spacer />
		</div>
		<div class="visit_content" style="margin-top:68px">
			<v-layout align-center justify-end>
				<txtField
					class="search_box mr-3"
					v-mask="mask"
					v-model="search_number"
					:txtField="search_number_input"
					@keyup.enter="click_number_search()"
				></txtField>
				<v-btn class="search_btn" color="#323153" @click="click_number_search()"><v-icon>mdi-magnify</v-icon>검색</v-btn>
			</v-layout>
			<v-layout align-center class="header_title" style="border:none">
				<div class="slash mr-1"></div>
				{{ visitTitle[0] }}
				<txtField class="search_box" v-model="visit_search1" :txtField="search_input"></txtField>
				<v-spacer></v-spacer>
				<div class="visit_user pt-3 pr-3 pl-3 mt-4">{{ nameShow() }} 님 / {{ phoneShow($route.params.phone) }}</div>
			</v-layout>
			<datatable :search="visit_search1" :datatable="visitTable1" class="visit_table"></datatable>
		</div>
		<div class="visit_content mt-4">
			<v-layout align-center class="header_title" style="border:none">
				<div class="slash mr-1"></div>
				{{ visitTitle[1] }}
				<txtField class="search_box" v-model="visit_search2" :txtField="search_input"></txtField>
			</v-layout>
			<datatable :search="visit_search2" :datatable="visitTable2" class="visit_table"></datatable>
		</div>
		<div class="visit_content mt-4">
			<v-layout align-center class="header_title" style="border:none">
				<div class="slash mr-1"></div>
				{{ visitTitle[2] }}
				<txtField class="search_box" v-model="visit_search3" :txtField="search_input"></txtField>
			</v-layout>
			<datatable :search="visit_search3" :datatable="visitTable3" class="visit_table"></datatable>
		</div>
		<div class="visit_content mt-4 mb-8">
			<v-layout align-center class="header_title" style="border:none">
				<div class="slash mr-1"></div>
				{{ visitTitle[3] }}
				<txtField class="search_box" v-model="visit_search4" :txtField="search_input"></txtField>
			</v-layout>
			<datatable :search="visit_search4" :datatable="visitTable4" class="visit_table"></datatable>
		</div>
	</div>
</template>

<script>
import { txtField, datatable } from '@/components/index.js'

export default {
	components: {
		txtField,
		datatable,
	},
	data() {
		return {
			reserveusersDatas: [],
			search_number: '',
			mask: '###########',
			search_number_input: {
				// clearable: true,
				outlined: true,
				backCol: 'white',
				placeholder: '전화번호를 입력하세요',
			},
			visit_search1: '',
			visit_search2: '',
			visit_search3: '',
			visit_search4: '',
			search_input: {
				clearable: true,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				placeholder: '검색어를 입력하세요',
			},
			visitTitle: ['견본주택 방문 예약 이력', '홍보관 방문 예약 이력', '이벤트 참여 이력', '알림톡 발송 이력'],
			visitTable1: {
				headers: [
					{ text: '방문예약명', value: 'title' },
					{ text: '예약일시', width: '200px', value: 'created_at_time' },
					{ text: '방문일시', width: '200px', value: 'rdate' },
					{ text: '상태', width: '100px', value: 'status' },
					{ text: '처리일시', width: '200px', value: 'updated_at_time' },
				],
				items: [],
				noweditting: '',
				hidedefaultfooter: false,
			},
			visitTable2: {
				headers: [
					{ text: '방문예약명', value: 'title' },
					{ text: '방문일시', width: '200px', value: 'rdate' },
					{ text: '상태', width: '100px', value: 'status' },
					{ text: '처리일시', width: '200px', value: 'updated_at_time' },
				],
				items: [],
				noweditting: '',
				hidedefaultfooter: false,
			},
			visitTable3: {
				headers: [
					{ text: '이벤트명', value: 'eventTitle' },
					{ text: '참여일시', width: '200px', value: 'created_at_time' },
					{ text: '참여결과', width: '200px', value: 'winner' },
					{ text: '상태', width: '100px', value: 'receipt' },
					{ text: '수령일', width: '200px', value: 'receiptDate' },
				],
				items: [],
				noweditting: '',
				hidedefaultfooter: false,
			},
			visitTable4: {
				headers: [
					{ text: '프로젝트', value: 'message_1' },
					{ text: '제목', value: 'subject_1' },
					{ text: '발송일시', width: '200px', value: 'created_at_time' },
					{ text: '발송결과', width: '100px', value: 'failover' },
					{ text: '대체문자', width: '200px', value: 'fsubject_1' },
					{ text: '발송형태', width: '100px', value: 'type_history' },
				],
				items: [],
				noweditting: '',
				hidedefaultfooter: false,
			},
		}
	},
	methods: {
		nameShow() {
			if (this.reserveusersDatas.length > 0) return this.reserveusersDatas[0].name
			else if (this.visitTable4.items.length > 0) return this.visitTable4.items[0].recvname_1
			else if (this.visitTable3.items.length > 0) return this.visitTable3.items[0].name
		},
		phoneShow(data) {
			if (data.length === 11) {
				return data.substring(0, 3) + '-' + data.substring(3, 7) + '-' + data.substring(7, 12)
			} else {
				return data
			}
		},
		reserveusers() {
			this.$store.state.loading = true
			const data = {
				phone: this.$route.params.phone,
				state: 'reserve',
			}
			this.$store.dispatch('reserveusers_noToken', data).then(res => {
				this.visitTable1.items = res.data.reserveusers.filter(x => x.reserveType === 'day')
				this.visitTable2.items = res.data.reserveusers.filter(x => x.reserveType === 'direct')
				this.reserveusersDatas = res.data.reserveusers
				this.$store.state.loading = false
			})
		},
		sendMessages() {
			this.$store.state.loading = true
			const data = {
				receiver_1: this.$route.params.phone,
			}
			this.$store.dispatch('sendMessages_noToken', data).then(res => {
				this.visitTable4.items = res.data.sendMessages
				this.$store.state.loading = false
			})
		},
		eventJoins() {
			this.$store.state.loading = true
			const data = {
				phone: this.$route.params.phone,
			}
			this.$store.dispatch('eventJoins_noToken', data).then(res => {
				this.visitTable3.items = res.data.eventJoins
				this.$store.state.loading = false
			})
		},
		click_number_search() {
			this.$router.push({ path: `/visithistory/${this.search_number}` })
			this.first_call()
		},
		first_call() {
			if (this.$route.params.phone) {
				this.eventJoins()
				this.sendMessages()
				this.reserveusers()
				this.search_number = ''
			}
		},
	},
	created() {
		this.first_call()
	},
}
</script>

<style lang="scss"></style>
