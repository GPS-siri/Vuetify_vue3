<template>
	<div style="width:100%">
		<v-tabs color="primary" background-color="white" v-model="tab" class="reservationTab">
			<v-tab v-for="(tab, i) in tabs" :key="i" :ripple="false"> {{ tab }}</v-tab>
		</v-tabs>
		<v-tabs-items id="management-tab" v-model="tab" style="">
			<v-tab-item style="padding-top:20px;">
				<campaignReservation />
			</v-tab-item>
			<v-tab-item style="padding-top:20px;" v-show="false"> </v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import campaignReservation from './campaignReservation'

export default {
	components: {
		campaignReservation,
	},
	mounted() {},
	methods: {
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
	},
	data() {
		return {
			tab: 0, // tab
			tabs: ['예약관리'],
			// tabs: ['설문 관리', '예약관리'],
		}
	},
	created() {
		this.tab = this.$route.params.tab
	},
}
</script>
<style lang="scss" scoped>
.left_dashboard {
	background-color: white;
	border-radius: 1vh;
}
.reservationTab {
	.v-tabs-bar .v-tab {
		font-size: 20px;
	}
	.v-tabs-bar .v-tab::before {
		background: none;
	}
}
</style>
<style></style>
