<template>
	<div style="width:100%; margin:0 37px">
		<v-layout align-center class="header_title">
			<!--  타이틀  -->
			<v-flex xs10>
				<v-layout align-center>
					<div class="slash mr-1"></div>
					<span class="admin_title">
						지점 관리
					</span>
				</v-layout>
			</v-flex>
		</v-layout>
		<v-tabs :color="$store.state.PointColor1" background-color="#F4F8FD" v-model="tab" class="reservationTab mt-5" slider-size="1">
			<v-tab v-for="(tab, i) in tabs" :key="i" :ripple="false"> {{ tab }}</v-tab>
		</v-tabs>
		<v-tabs-items id="management-tab" v-model="tab" style="">
			<v-tab-item style="padding-top:20px;">
				<business></business>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<goodsManagement></goodsManagement>
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<reservationSystem />
			</v-tab-item>
			<v-tab-item style="padding-top:20px;">
				<noticeManagement></noticeManagement>
			</v-tab-item>
		</v-tabs-items>
	</div>
</template>

<script>
import business from './business/business.vue'
import goodsManagement from './goods/goodsManagement.vue'
import reservationSystem from './reservaionSystem/reservationSystem.vue'
import noticeManagement from './notice/noticeManagement.vue'

export default {
	components: {
		business,
		noticeManagement,
		goodsManagement,
		reservationSystem,
	},
	mounted() {},
	methods: {},
	data() {
		return {
			tab: 0, // tab
			tabs: ['지점 관리', '상품 관리', '예약설정관리', '공지사항 관리'],
		}
	},

	created() {},
}
</script>
<style lang="scss"></style>
