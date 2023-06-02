<template>
	<!-- <div>
		ss
	</div> -->
	<div style="height:100vh;">
		<!-- <v-layout>
			<v-flex mr-2 mb-4 style="width:500px;">
				<v-layout justify-center style="background-color:black; ">
					<span style="color:white; font-size:0.5rem; font-weight:bold;">
						{{ dashboardData.dong }}
					</span>
				</v-layout>
			</v-flex>
		</v-layout>
		<v-layout>
			<v-flex style="margin-top:auto; margin-right:40px; width:300px;">
				<v-layout v-for="(f, idx) in dashboardData.floor" :key="idx" wrap style="border:1px solid black;">
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
		</v-layout> -->
		<v-layout>
			<v-flex>
				<v-layout mb-10 justify-center>
					<div style="margin-right:40px; width:300px;" v-for="(d, index) in dashboardData" :key="index" mr-2 mb-4>
						<v-layout wrap style="background-color:black; place-content: center;">
							<span style="color:white; font-size:0.5rem; font-weight:bold;"> {{ d.dong }} 동 </span>
						</v-layout>
					</div>
				</v-layout>
				<!-- <v-layout style="margin-top:auto;">

					<v-layout>
						<v-flex v-for="(te, idx) in testData" :key="idx" :style="true ? 'border-bottom:1px solid black;' : ''">

							<v-layout v-for="(t, i) in te" :key="i">
								<v-flex style="text-align: center; width:10px; font-size:0.75rem; border:1px solid black;">
									{{ t.data4 }}
								</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-layout> -->
			</v-flex>
		</v-layout>
		<v-layout justify-center>
			<div v-for="(d, index) in dashboardData" :key="index" style="margin-top:auto; margin-right:40px; width:300px;">
				<v-layout v-for="(f, idx) in d.floor" :key="idx" wrap :style="idx === d.floor.length - 1 ? 'border-bottom:1px solid black;' : ''">
					<v-flex
						v-for="(d1, i) in d.floor[d.floor.length - 1].data.length"
						:key="i"
						:style="styleReturn(f.data.filter(x => x.data4.includes('0' + (i + 1)))[0])"
					>
						<v-layout justify-center>
							<v-flex
								v-if="f.data.filter(x => x.data4.includes('0' + (i + 1)))[0]"
								xs12
								style="text-align: center; width:10px; font-size:0.75rem; border:1px solid black;"
								:style="areaStyle(f.data.filter(x => x.data4.includes('0' + (i + 1)))[0])"
							>
								{{ f.data.filter(x => x.data4.includes('0' + (i + 1)))[0].data4 }}
							</v-flex>
							<v-flex v-else xs12 style="text-align: center; width:10px; font-size:0.75rem; height:19px;"> </v-flex>
						</v-layout>
						<v-layout justify-center>
							<v-flex
								v-if="f.data.filter(x => x.data4.includes('0' + (i + 1)))[0]"
								xs12
								style="text-align: center; width:10px; font-size:0.5rem; border:1px solid black; border-top:0px; border-bottom:0px;"
							>
								<!-- {{ f.data.filter(x => x.data4.includes('0' + (i + 1)))[0].status === 'uncontracted' ? '계약 대기' : '계약 완료' }} -->
								{{ reserveStatus(f.data.filter(x => x.data4.includes('0' + (i + 1)))[0]) }}
							</v-flex>

							<v-flex
								v-else
								style="text-align: center; width:10px; font-size:0.5rem; border:1px solid black; border-top:0px; border-bottom:0px;"
							></v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
			</div>
		</v-layout>
	</div>
</template>

<script>
export default {
	props: {
		areaArr: Array,
		dashboardData: Array,
	},
	data() {
		return {
			color: ['#FFFBEF', '#EBF4FF', '#EBFFEC', '#FFFEEB', '#FFF3EB', '#FFFBFE', '#ECECEC'],
		}
	},
	computed: {},
	methods: {
		areaStyle(val) {
			if (val) {
				if (this.reserveStatus(val) === 'ㅤ') {
					let color = this.areaArr.filter(x => x.area === val.data1)[0].color
					return `background-color:${color}; color:black;`
				}
			}
		},
		styleReturn(val) {
			if (val) {
				if (val.status === 'contractcompleted') {
					return 'background-color:#3a258f; color:white;'
				} else {
					if (val.reservations.length !== 0) {
						return 'background-color:red; color:white;'
					} else {
						return this.styleReversedMessage(val)
					}
				}
			}
		},
		styleReversedMessage(val) {
			if (val.clients.length !== 0) {
				for (let index = 0; index < val.clients.length; index++) {
					const element = val.clients[index]
					let targetData = element.customDatas.add_info.filter(x => x.codeName === '고객상태')
					if (targetData.length !== 0) {
						if (targetData[0].value === '계약가망') {
							return 'background-color:yellow; '
						} else {
							return ''
						}
					} else {
						return ''
					}
				}
			} else {
				return ''
			}
		},
		reserveStatus(val) {
			if (val.status === 'contractcompleted') {
				return '계약완료'
			} else {
				if (val.reservations.length !== 0) {
					return '상담예정'
				} else {
					return this.reversedMessage(val)
				}
			}
		},
		reversedMessage(val) {
			if (val.clients.length !== 0) {
				for (let index = 0; index < val.clients.length; index++) {
					const element = val.clients[index]
					let targetData = element.customDatas.add_info.filter(x => x.codeName === '고객상태')
					if (targetData.length !== 0) {
						return targetData[0].value
					} else {
						return 'ㅤ'
					}
				}
			} else {
				return 'ㅤ'
			}
		},
	},
	created() {},
}
</script>

<style></style>
