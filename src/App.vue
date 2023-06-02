<template>
	<v-app>
		<router-view></router-view>

		<v-dialog
			v-model="$store.state.loading"
			fullscreen
			overlay-color="transparent"
			transition="dialog-center-transition"
			content-class="mainloadingBar"
		>
			<!-- style="background-color: rgba(255, 255, 255, 0.5);" -->
			<v-container fluid fill-height>
				<v-layout justify-center align-center>
					<v-progress-circular indeterminate :size="100" :width="5" color="grey lighten-1"> </v-progress-circular>
				</v-layout>
			</v-container>
		</v-dialog>
	</v-app>
</template>

<script>
export default {
	name: 'App',
	components: {},
	watch: {
		// to, form
		$route() {
			if (window.location.pathname.includes('counselor')) {
				if (
					window.location.pathname.includes('clientManagement') ||
					window.location.pathname.includes('login') ||
					window.location.pathname.includes('register')
				) {
					this.$store.state.headerMobileStatus = true
					this.$store.state.footerMobileStatus = false
				} else {
					this.$store.state.headerMobileStatus = true
					this.$store.state.footerMobileStatus = true
				}
			} else {
				this.$store.state.headerMobileStatus = false
				this.$store.state.footerMobileStatus = false
			}
			// if (to.path !== form.path) this.$store.state.data(this.$store.state.$route.params.index)
		},
	},
	data() {
		return {
			loading: false,
			mobileHeight: 0,
		}
	},
	created() {
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
<style lang="scss">
@import '@/assets/css/global.scss';
.personal_drawer .nav_profile {
	padding: 28px 28px 20px;
	background: no-repeat center/cover url(./assets/images/image/personal_photo.png);
}
</style>
