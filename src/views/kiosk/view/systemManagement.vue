<template>
	<div style="width:100%; margin:0 37px">
		<v-layout align-center class="header_title">
			<!--  타이틀  -->
			<v-flex xs10>
				<v-layout align-center>
					<div class="slash mr-1"></div>
					<span class="">
						시스템 관리
					</span>
				</v-layout>
			</v-flex>
			<!--  프로젝트 셀렉트박스  -->
			<v-flex xs2 align-self-end>
				<selectBox :sel="$store.state.businesses_list_system" @change="change" v-if="tab === 1"></selectBox>
			</v-flex>
		</v-layout>
		<v-tabs :color="$store.state.PointColor1" background-color="#F4F8FD" v-model="tab" class="reservationTab" slider-size="1">
			<!-- :color="$store.state.PointColor2" -->
			<v-tab v-for="(tab, i) in tabs" :ripple="false" :key="i"> {{ tab }}</v-tab>
		</v-tabs>
		<v-tabs-items v-model="tab" style="margin-top:20px; ">
			<v-tab-item style="padding-top:20px;">
				<systemUsers></systemUsers>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<systemTerms ref="terms"></systemTerms>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<systemTalk></systemTalk>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<systemQuestions></systemQuestions>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<campaginOption></campaginOption>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import systemUsers from '../viewItem/systemUsers.vue'
import systemTerms from '../viewItem/systemTerms.vue'
import systemTalk from '../viewItem/systemTalk.vue'
import systemQuestions from '../viewItem/systemQuestions.vue'
import campaginOption from '../viewItem/campaginOption.vue'
import { selectBox } from '@/components/index.js'
export default {
	components: {
		systemUsers,
		systemTerms,
		systemTalk,
		systemQuestions,
		campaginOption,
		selectBox,
	},
	mounted() {},
	async created() {
		await this.reservedays_call()
	},

	methods: {
		async reservedays_call() {
			// 프로젝트 리스트 호출

			this.$store.dispatch('businesses_simple', {}).then(res => {
				let data = res.data.businesses
				data.sort((a, b) => {
					return a.id - b.id
				})
				this.$store.state.businesses_list_system.items = data.map(el => {
					return { text: el.title, value: { id: el.id } }
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
	},
	data() {
		return {
			tab: 0, // tab
			tabs: ['사용자 관리', '약관 관리', '알림톡 관리', '항목 관리', '캠페인 옵션관리'],
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
