<template>
	<div style="width:100%; margin:0 37px; display:grid;">
		<v-layout align-center class="header_title">
			<!--  타이틀  -->
			<v-flex xs10>
				<v-layout align-center>
					<div class="slash mr-1"></div>
					<span class="">
						친구톡 관리
					</span>
				</v-layout>
			</v-flex>
		</v-layout>
		<v-tabs :color="$store.state.PointColor1" background-color="#F4F8FD" v-model="tab" class="reservationTab" slider-size="1">
			<!-- :color="$store.state.PointColor2" -->
			<v-tab v-for="(tab, i) in tabs" :ripple="false" :key="i"> {{ tab }}</v-tab>
		</v-tabs>
		<v-tabs-items v-model="tab" style="margin-top:20px; ">
			<v-tab-item style="padding-top:20px;">
				<messageTemplate></messageTemplate>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<messageSend ref="terms" :tab_change="tab_change"></messageSend>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<messageSentList></messageSentList>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<messageReport></messageReport>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<messageUnsubscribe></messageUnsubscribe>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import messageTemplate from '../viewItem/messageTemplate.vue'
import messageSend from '../viewItem/messageSend.vue'
import messageSentList from '../viewItem/messageSentList.vue'
import messageUnsubscribe from '../viewItem/messageUnsubscribe.vue'
import messageReport from '../viewItem/messageReport.vue'
export default {
	components: {
		messageTemplate,
		messageSend,
		messageSentList,
		messageUnsubscribe,
		messageReport,
	},
	mounted() {},
	async created() {
		await this.medata()
		await this.businesses_simple()
	},

	methods: {
		async medata() {
			await this.$store
				.dispatch('me')
				.then(async () => {})
				.catch(() => {
					this.$cookies.remove('xi-t')
					window.open(
						'https://sso.gsenc.com/sso/std/chkTokenRedirect.jsp?ru=https://crm-admin.xi.co.kr/loginCheck?redirect=/KIOSK',
						'_self',
					)
					// this.$router.push('/').catch(() => {})
				})
		},

		async businesses_simple() {
			// 프로젝트 리스트 호출
			let variable = { show: true }

			if (this.$store.state.meData.role.id === '1') {
				variable = { show: true }
			} else if (this.$store.state.meData.role.id === '3') {
				variable = { show: true, users: [this.$store.state.meData.id] }
			}
			this.$store.dispatch('businesses_simple', variable).then(res => {
				let data = res.data.businesses
				// data.sort((a, b) => {
				// 	return a.id - b.id
				// })
				this.$store.state.businesses_list_system.items = data.map(el => {
					return { text: el.title, value: { id: el.id, phone: el.phone } }
				})
				this.$store.state.businesses_list_system.value = this.$store.state.businesses_list_system.items[0].value
				this.$store.state.businesses_lists = res.data.businesses
			})
		},

		viewDay({ date }) {
			this.focus = date
			this.type = 'day'
		},
		getEventColor(event) {
			return event.color
		},
		setToday() {
			this.focus = ''
		},

		showEvent({ nativeEvent, event }) {
			const open = () => {
				this.selectedEvent = event
				this.selectedElement = nativeEvent.target
				requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)))
			}

			if (this.selectedOpen) {
				this.selectedOpen = false
				requestAnimationFrame(() => requestAnimationFrame(() => open()))
			} else {
				open()
			}

			nativeEvent.stopPropagation()
		},
		updateRange({ start, end }) {
			const events = []

			const min = new Date(`${start.date}T00:00:00`)
			const max = new Date(`${end.date}T23:59:59`)
			const days = (max.getTime() - min.getTime()) / 86400000
			const eventCount = this.rnd(days, days + 20)

			for (let i = 0; i < eventCount; i++) {
				const allDay = this.rnd(0, 3) === 0
				const firstTimestamp = this.rnd(min.getTime(), max.getTime())
				const first = new Date(firstTimestamp - (firstTimestamp % 900000))
				const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
				const second = new Date(first.getTime() + secondTimestamp)

				events.push({
					name: this.names[this.rnd(0, this.names.length - 1)],
					start: first,
					end: second,
					color: this.colors[this.rnd(0, this.colors.length - 1)],
					timed: !allDay,
				})
			}

			this.events = events
		},
		rnd(a, b) {
			return Math.floor((b - a + 1) * Math.random()) + a
		},
		sample() {},
		change() {
			// 상단 셀렉트 박스 change
			this.$refs.terms.terms_call()
		},
		tab_change(tab) {
			this.tab = tab
		},
	},
	data() {
		return {
			tab: 0, // tab
			tabs: ['친구톡 템플릿 관리', '친구톡 발송 관리', '친구톡 발송 결과', '친구톡 발송 통계', '수신 거부 리스트'],
		}
	},
}
</script>
<style lang="scss" scoped>
.left_dashboard {
	background-color: white;
	border-radius: 1vh;
}
</style>
<style lang="scss"></style>
