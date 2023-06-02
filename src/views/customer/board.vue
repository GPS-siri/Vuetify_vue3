<template>
	<div>
		<div
			style="margin-bottom: 60px; overflow-y:auto; background-color:#f3f3f3;"
			:style="`height:${calc_height()}px; ${$store.state.headerMobileStatus ? 'margin-top: 60px;' : ''}`"
		>
			<router-view></router-view>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			mobileHeight: 0,
		}
	},
	async created() {
		this.mobileHeight = window.innerHeight || document.body.clientHeight
		if (window.location.pathname.includes('counselor')) {
			this.$store.state.mobileStatus = true
		} else {
			this.$store.state.mobileStatus = false
		}
	},
	methods: {
		calc_height() {
			if (this.$store.state.headerMobileStatus && this.$store.state.footerMobileStatus) {
				return this.mobileHeight - 120
			} else if (this.$store.state.headerMobileStatus || this.$store.state.footerMobileStatus) {
				return this.mobileHeight - 60
			} else {
				return this.mobileHeight
			}
		},
	},
}
</script>

<style lang="scss" scoped>
.dashboardNoScroll {
	background-color: white;
	overflow-y: auto;
	overflow-x: hidden;
}
.dashboardNoScroll::-webkit-scrollbar {
	width: 0px;
	display: none !important; /* Chrome, Safari, Opera */
}
.alertDiv {
	background-color: #f4f8fd;
	overflow-y: scroll;
	box-shadow: -3px 0px 5px #dfdfdf;
}
.alertDiv::-webkit-scrollbar {
	width: 0px;
	display: none !important; /* Chrome, Safari, Opera */
}
.chatDiv {
	background-color: #f4f8fd;
	box-shadow: -3px 0px 5px #dfdfdf;
}
</style>

<style lang="scss">
.dashboard_lay {
	background-color: var(--point1-color);
	height: 100vh;
	.mainboard_lay {
		padding: 24px;
		background-color: white;
		height: 100vh;
		overflow-y: auto;
		overflow-x: hidden;
	}
}
</style>
