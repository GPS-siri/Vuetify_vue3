<template>
	<div>
		<!-- <div class="menu_title">대시보드</div> -->
		<v-layout>
			<v-flex xs4>
				<v-layout wrap mb-4 style="font-size: 0.75rem;" align-center>
					<v-flex xs3> 계약상태</v-flex>
					<v-flex xs3>
						<div style="width:10px; height:10px; background-color:red; display: inline-flex;  border:1px solid black;"></div>
						상담예정 : {{ consulting }} 건
						<v-icon style="margin-bottom: 1px;" small @click="refreshAction()">mdi-refresh</v-icon>
					</v-flex>
					<v-flex xs3>
						<div style="width:10px; height:10px; background-color:yellow; display: inline-flex;  border:1px solid black;"></div>
						계약가망 : {{ contractHope }} 건
					</v-flex>
					<v-flex xs3>
						<div style="width:10px; height:10px; background-color:#3a258f; display: inline-flex;  border:1px solid black;"></div>
						계약완료 : {{ complete }} 건
					</v-flex>
					<v-flex xs3>평형</v-flex>
					<v-flex xs3 v-for="(area, index) in areaArr" :key="index">
						<div :style="`width:10px; height:10px; background-color:${area.color}; display: inline-flex; border:1px solid black;`"></div>
						{{ area.area }} : {{ area.count }}({{ area.remainingCount }})
					</v-flex>
				</v-layout>
			</v-flex>
			<v-spacer></v-spacer>
			<v-flex style="text-align: right;">
				<v-icon v-if="$route.path !== '/fullScreen'" @click="fullScreenAction()">mdi-fullscreen</v-icon>
				<v-icon v-else @click="smallScreenAction()">mdi-fullscreen-exit</v-icon>
			</v-flex>
		</v-layout>

		<v-carousel class="dashboardCarousel" hide-delimiters v-model="carouselValue" v-if="viewStatus" style="height:100vh;">
			<v-carousel-item v-for="(item, i) in dashboardData" :key="i" style="height:100vh;">
				<Carouselitems :dashboardData="item" :areaArr="areaArr"></Carouselitems>
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
		smallScreenAction() {
			this.chunk(this.totalDashboardData, 5)
			this.$router.push('/MANAGER')
		},

		fullScreenAction() {
			this.chunk(this.totalDashboardData, 6)
			this.$router.push('/fullScreen')
		},
		refreshAction() {
			this.$store.state.loading = true
			this.productView()
			this.reservationsView()
		},
		reservationsView() {
			const data = {
				date: this.$moment().format('YYYY-MM-DD'),
			}
			this.$store
				.dispatch('reservations', data)
				.then(res => {
					this.consulting = res.reservations.length
				})
				.catch(err => {
					console.log({ err })
				})
		},
		productView() {
			const data = {
				reservationDate: this.$moment().format('YYYY-MM-DD'),
			}
			this.$store
				.dispatch('productList', data)
				.then(res => {
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
			let areaData = Array.from(new Set(this.productData.map(x => x.data1)))
			this.complete = this.productData.filter(x => x.status === 'contractcompleted').length
			this.contractHope = 0
			for (let index = 0; index < this.productData.length; index++) {
				const element = this.productData[index]
				if (element.clients.length !== 0) {
					for (let index = 0; index < element.clients.length; index++) {
						const el = element.clients[index]
						let targetData = el.customDatas.add_info.filter(x => x.codeName === '고객상태')
						if (targetData.length !== 0) {
							if (targetData[0].value === '계약가망') {
								this.contractHope += 1
							}
						}
					}
				}
			}
			let areaArr = []
			for (let index = 0; index < areaData.length; index++) {
				const element = areaData[index]

				areaArr.push({
					count: this.productData.filter(x => x.data1 === element).length,
					remainingCount: this.productData.filter(x => x.data1 === element && x.status !== 'contractcompleted').length,
					area: element,
					color: this.colors[index],
				})
			}

			for (let index = 0; index < dong.length; index++) {
				const element = dong[index]

				let data = {}
				// data.hosu = []
				let dongData = this.productData.filter(x => x.data2 === element)
				let floorData = Array.from(new Set(dongData.map(x => x.data3)))
				// let hosuTest = Array.from(new Set(dongData.map(x => x.data4.slice(-2))))
				// let hosuData = hosuTest.sort(function(a, b) {
				// 	if (Number(a) > Number(b)) return 1
				// 	if (Number(a) === Number(b)) return 0
				// 	if (Number(a) < Number(b)) return -1
				// })
				// console.log(hosuData)

				// for (let idx = 0; idx < hosuData.length; idx++) {
				// 	const el = hosuData[idx]
				// 	console.log(element)
				// 	console.log(el)
				// 	// console.log(this.productData.filter(x => x.data4.includes(el)))

				// 	testData.push(
				// 		this.productData
				// 			.filter(x => x.data2 === element && x.data4.includes(el))
				// 			.sort((b, a) => {
				// 				if (Number(a.data4) > Number(b.data4)) return 1
				// 				if (Number(a.data4) === Number(b.data4)) return 0
				// 				if (Number(a.data4) < Number(b.data4)) return -1
				// 			}),
				// 	)
				// 	data.dong = element
				// 	data.hosu.push(this.productData.filter(x => x.data2 === element && x.data4.includes(el)))
				// }
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
				// console.log(arr)

				this.areaArr = areaArr
				this.totalDashboardData = arr
				if (this.$route.path === '/fullScreen') {
					this.chunk(arr, 6)
				} else {
					this.chunk(arr, 5)
				}

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
	watch: {
		dashboardData() {
			if (this.first) {
				let idx = this.dashboardData.length - 1
				this.first = false
				setInterval(() => {
					if (idx === this.carouselValue) {
						this.carouselValue = 0
					} else {
						this.carouselValue += 1
					}
				}, 7000)
			}
		},
	},
	created() {
		this.$store.state.loading = true
		this.productView()
		this.reservationsView()
	},
	data() {
		return {
			first: true,
			carouselValue: 0,
			colors: ['#FFFBEF', '#EBF4FF', '#EBFFEC', '#FFFEEB', '#FFF3EB', '#FFFBFE', '#ECECEC'],
			consulting: 0,
			contractHope: 0,
			complete: 0,
			viewStatus: true,
			areaArr: [],
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
