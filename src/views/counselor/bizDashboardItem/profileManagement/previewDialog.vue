<template>
	<v-dialog v-model="dialog.open" persistent content-class="qr-modal-type" max-width="400">
		<v-layout class="qr-header position_relative" align-center>
			<div class="main-title-type">
				홍보페이지 미리보기
			</div>
			<v-btn icon @click="dialog.open = false" class="dialog_close">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-layout>
		<div class="pa-3 pb-10 preview_container">
			<div class="preview_wrap">
				<v-layout align-center class="personal_header">
					<v-btn icon @click="drawer = true">
						<v-icon>
							mdi-menu
						</v-icon>
					</v-btn>
				</v-layout>

				<!-- left nav -->
				<v-navigation-drawer class="personal_drawer" absolute floating v-model="drawer" height="auto">
					<v-img
						class="nav_close"
						contain
						height="20px"
						:src="`${require(`@/assets/images/ico/personal_close.png`)}`"
						@click="drawer = false"
					></v-img>

					<div class="nav_profile" :style="`background-image:${require(`@/assets/images/ico/personal_photo.png`)};`">
						<v-img class="nav_profile_img" height="110px" width="110px" :src="profile.img"></v-img>
						<div class="profile_title">{{ profile.title }}</div>

						<div class="profile_contact">
							<v-img
								class="profile_contact_item mr-6"
								v-for="(contact, index) in profile.contact"
								:key="index"
								height="43px"
								width="43px"
								:src="`${require(`@/assets/images/ico/personal_${contact}.png`)}`"
								@click="click_contact(contact)"
							></v-img>
						</div>
					</div>

					<v-list dense rounded dark class="profile_list">
						<v-list-item class="profile_list_item" v-for="(list, index) in profile_lists" :key="index" link>
							<div>
								<v-img
									class="mr-5 ml-3"
									height="17px"
									contain
									width="17px"
									:src="`${require(`@/assets/images/ico/personal_${list.img}.png`)}`"
								></v-img>
							</div>

							<v-list-item-content>
								<v-list-item-title>{{ list.title }}</v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</v-list>

					<div class="sns_list">
						<v-img
							class="mr-1"
							height="25"
							v-for="(sns, index) in sns_items.filter(el => el.value)"
							:key="index"
							contain
							:src="`${require(`@/assets/images/ico/${sns.name}.png`)}`"
							@click="click_sns(sns)"
						></v-img>
					</div>
				</v-navigation-drawer>

				<!-- 메인 이미지 -->
				<div v-if="mainImg_items.length > 0">
					<v-carousel :show-arrows="false" :hide-delimiters="true" :continuous="false" height="auto">
						<v-carousel-item v-for="(item, i) in mainImg_items" :key="i" eager>
							<v-img contain :src="item.url" eager></v-img>
						</v-carousel-item>
					</v-carousel>
				</div>

				<!-- 소개글 -->
				<div class="personal_intro">
					<div class="personal_intro_title">{{ intro_title }}</div>
					<div class="personal_intro_content">{{ intro_content }}</div>
					<v-btn class="personal_applyBtn" block rounded depressed color="#132641" dark>
						{{ intro_button }}
					</v-btn>
				</div>
				<!-- 계약 / 클라이언트 건수  -->
				<div class="personal_count">
					<div class="personal_count_title">{{ count_title }}</div>

					<div class="personal_count_item" v-for="(count, index) in counts" :key="index">
						<v-img contain height="60px" :src="`${require(`@/assets/images/ico/${count.img}.png`)}`"></v-img>
						<div class="personal_count_number">
							{{ count.count + '+' }}
						</div>

						<div class="personal_count_name">
							{{ count.name }}
						</div>
					</div>
				</div>
				<!-- 신청 안내  -->
				<div class="personal_apply">
					<div class="personal_apply_content">{{ apply_content }}</div>
					<v-btn class="personal_applyBtn" color="black" block rounded depressed dark>
						{{ apply_button }}
					</v-btn>
				</div>

				<!-- 이벤트 -->
				<div v-if="events_items.length > 0">
					<v-carousel :show-arrows="false" :hide-delimiters="true" :continuous="false" height="auto">
						<v-carousel-item v-for="(item, i) in events_items" :key="i" class="event_item love_pink" eager>
							<div class="event_item_wrap">
								<v-avatar class="event_item_profile_img" size="35">
									<img :src="item.profile_img" />
								</v-avatar>

								<div class="event_item_info">
									<p class="event_item_name">{{ item.name }}</p>
									<p class="event_item_date">{{ item.date }}</p>
								</div>
							</div>
							<p class="event_item_content" v-if="item.content">{{ item.content }}</p>

							<v-img :src="item.src" class="event_item_img" eager></v-img>
						</v-carousel-item>
					</v-carousel>
				</div>

				<!-- 포스트 -->
				<div v-if="posts_items.length > 0">
					<v-carousel :show-arrows="false" :hide-delimiters="true" :continuous="false" height="auto">
						<v-carousel-item v-for="(item, i) in posts_items" :key="i" class="event_item love_sky" eager>
							<div class="event_item_wrap">
								<v-avatar class="event_item_profile_img" size="35">
									<img :src="item.profile_img" />
								</v-avatar>

								<div class="event_item_info">
									<p class="event_item_name">{{ item.name }}</p>
									<p class="event_item_date">{{ item.date }}</p>
								</div>
							</div>
							<p class="event_item_content" v-if="item.content">{{ item.content }}</p>

							<v-img :src="item.src" class="event_item_img" eager></v-img>
						</v-carousel-item>
					</v-carousel>
				</div>

				<!-- 홍보페이지 footer -->
				<div class="personal_footer">
					<div class="sns_list">
						<v-img
							class="ml-1"
							height="25"
							v-for="(sns, index) in sns_items.filter(el => el.value)"
							:key="index"
							contain
							:src="`${require(`@/assets/images/ico/${sns.name}.png`)}`"
							@click="click_sns(sns)"
						></v-img>
					</div>
					<div class="company_name">{{ company_info.name }}</div>
					<div class="company_info">
						<p class="info_detail">{{ company_info.address }}</p>
						<p class="info_detail">{{ 'TEL. ' + company_info.tel }}</p>
						<p class="info_detail">{{ 'FAX. ' + company_info.fax }}</p>
					</div>
				</div>
			</div>
		</div>
		<v-btn style="font-weight:bold; " color="primary2" dark depressed width="100%" max-width="400" height="50" tile @click="click_btn()">
			확인
		</v-btn>
	</v-dialog>
</template>
<script>
export default {
	props: {
		dialog: Object,
		profile_img: Object,
		main_banner: Array,
		text_item: Array,
	},
	watch: {
		dialog: {
			deep: true,
			handler() {
				if (this.dialog.open) {
					this.drawer = false

					this.profile.img = this.profile_img.url
					this.profile.title = this.text_item[0].items[0].value
					this.profile.phone = this.$store.state.meData.phone

					this.mainImg_items = this.main_banner

					// 소개글 데이터
					this.intro_title = this.text_item[0].items[0].value
					this.intro_content = this.text_item[0].items[1].value
					this.intro_button = this.text_item[0].items[2].value

					// 실적 데이터
					this.count_title = this.text_item[1].items[0].value
					this.counts[0].count = this.text_item[1].items[1].value1 ? this.text_item[1].items[1].value1 : ''
					this.counts[1].count = this.text_item[1].items[1].value2 ? this.text_item[1].items[1].value2 : ''
					this.counts[2].count = this.text_item[1].items[1].value3 ? this.text_item[1].items[1].value3 : ''

					// 구독 안내 데이터
					this.apply_content = this.text_item[2].items[0].value
					this.apply_button = this.text_item[2].items[1].value

					this.sns_items = this.text_item[3].items
				}
			},
		},
	},
	data() {
		return {
			// 프로필 네비게이션 드로어
			drawer: false,
			profile: {
				img: '',
				title: '',
				phone: '',
				contact: ['call', 'link', 'sms'],
			},
			profile_lists: [
				{ title: 'Home', img: 'home' },
				{ title: '상담신청하기', img: 'users' },
				{ title: '구독신청하기', img: 'calendar' },
			],

			// 메인 이미지 배너
			mainImg_items: [],

			// 소개글 데이터
			intro_title: '',
			intro_content: '',
			intro_button: '',
			// 실적 데이터
			count_title: '',

			counts: [
				{
					name: '누적 상담 수',
					count: '',
					img: 'personal_total',
				},

				{
					name: '관리 클라리언트',
					count: '',
					img: 'personal_client',
				},

				{
					name: '월 평균 계약 수',
					count: '',
					img: 'personal_contract',
				},
			],

			// 구독 안내 데이터
			apply_content: '',
			apply_button: '',

			// 이벤트 데이터
			events_items: [
				{
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					name: '이름',
					date: '10 Dec',
					content: '이벤트 설명',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
				{
					name: '이름',
					date: '10 Dec',
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
				{
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					name: '이름',
					date: '10 Dec',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
				{
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					name: '이름',
					date: '10 Dec',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
				{
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					name: '이름',
					date: '10 Dec',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
			],

			// 포스트 데이터
			posts_items: [
				{
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					name: '이름',
					date: '10 Dec',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
				{
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					name: '이름',
					date: '10 Dec',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
				{
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					name: '이름',
					date: '10 Dec',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
				{
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					name: '이름',
					date: '10 Dec',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
				{
					profile_img: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
					name: '이름',
					date: '10 Dec',
					src: 'https://cdn.9oodnews.com/news/photo/202112/13087_18946_2229.jpg',
				},
			],

			// sns 정보
			sns_items: [],

			// 하단 푸터
			company_info: {
				name: 'Sales-lab.here',
				address: '서울시 강남구 영동대로 416, 3층(대치동, KT&G타워)',
				tel: '02 3484 7896',
				fax: '02 3484 7989',
			},
		}
	},
	components: {},
	methods: {
		click_btn() {
			this.dialog.open = false
		},
		click_contact(contact) {
			if (contact === 'sms') {
				location.href = `sms:${this.profile.phone}`
			} else if (contact === 'call') {
				window.open(`tel:${this.profile.phone}`)
			}
		},
		click_sns(sns) {
			window.open(sns.value)
		},
	},
}
</script>
<style lang="scss">
.qr-code {
	width: 100%;
}
.qr-text {
	font-size: 14px;
	color: #828282;
}
.qr-modal-type {
	background-color: white;
	border-radius: 0px 41px 0px 41px !important;
	padding: 0px;
}
.qr-header {
	height: 50px;
	.main-title-type {
		padding-left: 30px;
		// color: white;
		font-size: 14px;
		font-weight: bold;
		margin-right: auto;
	}
}
.qr_name_type {
	font-size: 12px;
	color: #633efd;
}
.qr_info_type {
	font-size: 12px;
	color: #633efd;
	text-align: center;
}
</style>
