<template>
	<div>
		<div class="menu_title">대시보드</div>
		<v-layout @click="viewStatus = !viewStatus">범례</v-layout>
		<v-carousel class="dashboardCarousel" hide-delimiters v-if="viewStatus" style="height:100vh;">
			<v-carousel-item v-for="(item, i) in dashboardData" :key="i" style="height:100vh;">
				<Carouselitems :dashboardData="item" :testData="testData"></Carouselitems>
			</v-carousel-item>
		</v-carousel>
		<!-- <div v-else>
			<v-layout>
				<v-flex v-for="(d, index) in dong" :key="index" mr-2 mb-4 style="width:500px;">
					<v-layout justify-center style="background-color:black; ">
						<span style="color:white; font-size:0.5rem; font-weight:bold;">
							{{ d }}
						</span>
					</v-layout>
				</v-flex>
			</v-layout>
			<v-layout>
				<v-flex v-for="(d, index) in totalDashboardData" :key="index" style="margin-top:auto; margin-right:10px; width:300px;">
					<v-layout v-for="(f, idx) in d.floor" :key="idx" wrap style="border:1px solid black;">
						<v-flex v-for="(d, i) in f.data" :key="i">
							<v-layout justify-center>
								<v-flex xs12 style="text-align: center; width:10px; font-size:0.75rem; border:1px solid black; border-top:0px;"
									>{{ d.data4 }}
								</v-flex>
							</v-layout>
							<v-layout justify-center>
								<v-flex
									xs12
									style="text-align: center; width:10px; font-size:0.5rem; border:1px solid black; border-top:0px; border-bottom:0px;"
									>계약완료</v-flex
								>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</div> -->
	</div>
</template>

<script>
import Carouselitems from './carousel_items.vue'
export default {
	components: {
		Carouselitems,
	},
	methods: {
		productView() {
			const data = {}
			this.$store
				.dispatch('productList', data)
				.then(res => {
					// console.log(res.products)
					this.productData = []
					this.productData = res.products
					this.dataResult()
				})
				.catch(err => {
					console.log({ err })
				})
		},
		dataResult() {
			let arr = []
			let dong = Array.from(new Set(this.productData.map(x => x.data2)))
			let testData = []
			for (let index = 0; index < dong.length; index++) {
				const element = dong[index]
				let data = {}
				data.hosu = []
				let dongData = this.productData.filter(x => x.data2 === element)

				// let floorData = Array.from(new Set(dongData.map(x => x.data3)))
				let hosuTest = Array.from(new Set(dongData.map(x => x.data4.slice(-2))))
				let hosuData = hosuTest.sort(function(a, b) {
					if (Number(a) > Number(b)) return 1
					if (Number(a) === Number(b)) return 0
					if (Number(a) < Number(b)) return -1
				})
				console.log(hosuData)

				for (let idx = 0; idx < hosuData.length; idx++) {
					const el = hosuData[idx]
					console.log(element)
					console.log(el)
					// console.log(this.productData.filter(x => x.data4.includes(el)))

					testData.push(
						this.productData
							.filter(x => x.data2 === element && x.data4.includes(el))
							.sort((b, a) => {
								if (Number(a.data4) > Number(b.data4)) return 1
								if (Number(a.data4) === Number(b.data4)) return 0
								if (Number(a.data4) < Number(b.data4)) return -1
							}),
					)
					data.dong = element
					data.hosu.push(this.productData.filter(x => x.data2 === element && x.data4.includes(el)))
				}
				floorData = floorData.sort(function(b, a) {
					if (Number(a) > Number(b)) return 1
					if (Number(a) === Number(b)) return 0
					if (Number(a) < Number(b)) return -1
				})
				data.floor = []
				for (let idx = 0; idx < floorData.length; idx++) {
					const el = floorData[idx]
					let hosuData = this.productData.filter(x => x.data2 === element && x.data3 === el)
					data.dong = element
					data.floor.push({
						floor: el,
						data: hosuData.sort((a, b) => {
							if (a.data4 > b.data4) return 1
							if (a.data4 === b.data4) return 0
							if (a.data4 < b.data4) return -1
						}),
					})
				}
				arr.push(data)
				// }
				console.log(testData)
				// console.log(arr)
				this.testData = testData
				this.totalDashboardData = arr
				this.chunk(arr, 5)
				this.$store.state.loading = false
			}
		},
		chunk(data = [], size = 1) {
			const arr = []

			for (let i = 0; i < data.length; i += size) {
				arr.push(data.slice(i, i + size))
			}
			this.dashboardData = arr
		},
	},
	created() {
		this.$store.state.loading = true
		this.productView()
	},
	data() {
		return {
			testData: [],
			viewStatus: true,
			colors: ['primary', 'secondary', 'yellow darken-2', 'red', 'orange'],
			model: 0,
			dashboardData: [],
			totalDashboardData: [],
			// dong: ['101동', '102동', '103동', '104동', '105동', '106'],
			// floor: [15, 16, 17, 15, 17],
			// type: [
			// 	['84a', '102a'],
			// 	['84a', '102a'],
			// 	['84a', '102a'],
			// 	['84a', '102a'],
			// 	['84a', '102a'],
			// ],
			// ho: [
			// 	[1, 2, 3, 4],
			// 	[1, 2, 3, 4],
			// 	[1, 2, 3, 4],
			// 	[1, 2, 3, 4],
			// 	[1, 2, 3, 4],
			// ],
			productData: [],
		}
	},
}
</script>

<style>
/* #app > div > div.dashboard_lay > div > div.flex.lg10.xs12 > div > div > div.v-window.v-item-group.theme--dark.v-carousel > div > div.v-window-item > div */
.v-window.dashboardCarousel.v-item-group.theme--dark.v-carousel > div > div.v-window-item > div {
	height: 100vh !important;
}
</style>
