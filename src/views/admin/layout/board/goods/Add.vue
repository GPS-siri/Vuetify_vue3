<template>
	<div style="width:100%; ">
		<v-layout align-center>
			<div class="main_title">
				상품 등록
			</div>
			<div class="router_title ml-3">
				상품 관리 > 상품 등록
			</div>
		</v-layout>
		<div class="mt-10" style="width:100%">
			<v-tabs color="primary" background-color="white" v-model="tab" active-class="active_tab" class="reservationTab top_slide_tab">
				<v-tab v-for="(tab, i) in tabs" :key="i" :ripple="false"> {{ tab }}</v-tab>
			</v-tabs>
			<v-tabs-items id="management-tab" v-model="tab" style="">
				<v-tab-item style="padding-top:20px;">
					<muchAdd @updated="updatad" />
				</v-tab-item>
				<v-tab-item style="padding-top:20px;">
					<singleAdd :propsData="tab" />
				</v-tab-item>
			</v-tabs-items>
		</div>
	</div>
</template>

<script>
import muchAdd from './muchAdd.vue'
import singleAdd from './singleAdd.vue'
export default {
	components: {
		muchAdd,
		singleAdd,
	},
	created() {},
	mounted() {},
	methods: {
		updatad(item) {
			this.tab = 1
			this.$store.state.loading = true
			setTimeout(() => {
				this.propsData = item
				this.$store.state.loading = false
			}, 500)
		},
	},
	data() {
		return {
			tab: 0, // tab
			tabs: ['상품 대량등록', '상품등록'],
			propsData: { tab: '' },
			updated_data: false,
		}
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
.table_box {
	// width: 1550px;
}
.btn-style {
	box-shadow: none;
	background-color: #ffffff;
	border: 1px solid #9a9c9b;
	border-radius: 5px;
}
</style>
<style lang="scss">
.reservationTab2 > div > div.v-slide-group__wrapper > div > div.v-tabs-slider-wrapper {
	.v-tabs-slider-wrapper {
		position: absolute !important;
		bottom: auto !important;
		color: red !important;
	}
}
</style>
