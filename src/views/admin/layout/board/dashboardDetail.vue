<template>
	<div>
		<v-layout align-center class="my-6">
			<div class="mr-4 dashboard-text">
				실시간 현황
			</div>
			<v-btn color="point1" dark class="mr-auto" @click="reload()">
				새로고침
				<v-icon>mdi-refresh</v-icon>
			</v-btn>
			<div class="mr-4 dashboard-text">
				사업지명 :
			</div>
			<div class="dashboard-text">
				{{ businessData.title }}
			</div>
		</v-layout>
		<v-layout class="mb-16">
			<v-flex xs3 v-for="(card, i) in cards" :key="i">
				<v-card class="dashboard-card elevation-0" :style="i === cards.length - 1 ? 'margin-right: 0px' : ''">
					<div class="mb-2" style="color:#7D7D7D;">
						{{ card.title }}
					</div>
					<div v-for="(type, typeIndex) in card.type" :key="typeIndex">
						{{ type.title }}
						<span class="ml-2 point5--text cards-value-text"> {{ type.value }}{{ cardText(i) }} </span>
					</div>
				</v-card>
			</v-flex>
		</v-layout>
		<div class="mb-4">
			<div class="mr-auto dashboard-text">
				기간별 현황
			</div>
			<v-layout align-center class="my-2">
				<div style="width:150px">
					<DatepickerDialog :picker="startPicker" @input="realRangeTimeCount"></DatepickerDialog>
				</div>
				<div class="mx-2">
					~
				</div>
				<div style="width:150px">
					<DatepickerDialog :picker="endPicker" @input="realRangeTimeCount" :allowed_dates="allowed_datesEnd"></DatepickerDialog>
				</div>
				<div class="ml-4" style="width:100px">
					<v-select v-model="day" hideDetails dense :items="days" label="날짜 단위" outlined @change="dayChange"></v-select>
				</div>
			</v-layout>
			<v-card class="dashboard-card-2 elevation-0" :key="cardKey">
				<div style="font-size:14px;">{{ startPicker.date }} ~ {{ endPicker.date }}</div>
				<v-layout class="mt-4" style="justify-content: space-between; width:70%">
					<div class="dashboard-info-text">
						상담사:
						<span class="success--text"> {{ businessData.counselors.length }} </span>명
					</div>
					<div class="dashboard-info-text" v-if="businessData.clients">
						등록고객:
						<span class="success--text"> {{ businessData.clients.length }} </span>명
					</div>
					<div class="dashboard-info-text" v-if="businessData.clients">
						계약고객:
						<span class="success--text"> {{ businessData.clients.filter(x => x.contractStatus === '계약완료').length }} </span>명
					</div>
					<div class="dashboard-info-text" v-if="businessData.clients">
						<v-layout>
							잔여세대:
							<v-layout
								class="ml-2"
								v-for="(product, i) in businessData.product
									.map(x => x.PD_Type)
									.filter((v, i) => businessData.product.map(x => x.PD_Type).indexOf(v) === i)"
								:key="i"
							>
								<div class="primary--text">
									{{ product }}
								</div>
								: [
								<div class="point1--text">
									{{
										businessData.product.filter(x => x.PD_Type === product).length -
											businessData.clients.filter(x => x.contractStatus === '계약완료').length
									}}
								</div>
								]세대
								<span
									class="ml-2"
									v-show="
										i !==
											businessData.product.map(x => x.PD_Type).filter((v, i) => businessData.product.map(x => x.PD_Type).indexOf(v) === i)
												.length -
												1
									"
									>/</span
								>
							</v-layout>
						</v-layout>
					</div>
				</v-layout>
			</v-card>
		</div>
		<v-layout wrap class="mt-8 mb-4">
			<v-flex xs7>
				<v-layout align-center class="mb-4">
					<div class="mr-auto dashboard-text">
						상담사 현황
					</div>
				</v-layout>
				<v-data-table
					:options="{ itemsPerPage: 5 }"
					:headers="headers"
					:items="desserts"
					class="elevation-0 dashboard-table"
					:key="tableCount"
				>
					<template v-slot:[`item.clients`]="{ item }">
						<div v-if="businessData.clients">
							{{ businessData.clients.filter(x => x.users_permissions_user.id === item.users_permissions_user.id).length }}
						</div>
						<div v-else>
							0
						</div>
					</template>
					<template v-slot:[`item.successClients`]="{ item }">
						<div v-if="businessData.clients">
							{{
								businessData.clients.filter(
									x => x.users_permissions_user.id === item.users_permissions_user.id && x.contractStatus === '계약완료',
								).length
							}}
						</div>
						<div v-else>
							0
						</div>
					</template>
				</v-data-table>
			</v-flex>
			<v-flex xs4 offset-xs1>
				<v-layout align-center class="mb-4">
					<div class="mr-auto dashboard-text">
						고객 현황
					</div>
				</v-layout>
				<v-data-table :headers="headers2" :items="desserts2" class="elevation-0 dashboard-table" :key="tableCount" hide-default-footer>
					<template v-slot:[`item.successClients`]="{ item }">
						<div v-if="item.clients">
							{{ item.clients.filter(x => x.contractStatus === '계약완료').length }}
						</div>
					</template>
				</v-data-table>
			</v-flex>
		</v-layout>
		<v-layout align-center>
			<v-btn @click="$router.push({ name: 'dashboard' })" color="primary">
				대쉬보드 목록
			</v-btn>
		</v-layout>
	</div>
</template>
<script>
import { DatepickerDialog } from '@/components'
export default {
	components: {
		DatepickerDialog,
	},
	data() {
		return {
			cardKey: 0,
			businessData: {
				counselors: [],
			},
			startPicker: {
				date: this.$moment()
					.subtract(6, 'days')
					.format('YYYY-MM-DD'),
			},
			endPicker: {
				date: this.$moment().format('YYYY-MM-DD'),
			},
			day: '7일',
			days: ['30일', '21일', '14일', '7일'],
			businessList: [],
			cards: [
				{
					title: '상품현황',
					type: [],
				},
				{
					title: '상담사 현황',
					type: [],
				},
				{
					title: '등록고객 현황',
					type: [],
				},
				{
					title: '계약고객 현황',
					type: [],
				},
				{
					title: '잔여상품 현황',
					type: [],
				},
			],
			headers: [
				{
					text: '상담사',
					align: 'center',
					value: 'users_permissions_user.name',
				},
				{ text: '휴대전화번호', value: 'users_permissions_user.phone', align: 'center' },
				{ text: '등록고객', value: 'clients', align: 'center' },
				{ text: '계약고객', value: 'successClients', align: 'center' },
			],
			headers2: [
				{
					text: '고객성향',
					align: 'center',
					value: 'like',
				},
				{ text: '등록건수', value: 'client', align: 'center' },
				{ text: '계약건수', value: 'success', align: 'center' },
			],
			desserts: [],
			desserts2: [],
			tableCount: 0,
		}
	},
	created() {
		this.business()
	},
	methods: {
		reload() {
			this.business()
		},
		cardText(index) {
			if (index === 0 || index === 4) {
				return '세대'
			} else if (index === 1 || index === 2 || index === 3) {
				return '명'
			}
		},
		clients() {
			const data = {
				business: this.$route.params.id,
				updated_at_gte: this.startPicker.date + 'T00:00:00.000Z',
				updated_at_lte: this.endPicker.date + 'T23:59:59.000Z',
			}
			this.$store
				.dispatch('clients', data)
				.then(res => {
					this.businessData.clients = res.clients
					const likes = {
						S: { client: 0, success: 0 },
						A: { client: 0, success: 0 },
						B: { client: 0, success: 0 },
						C: { client: 0, success: 0 },
						D: { client: 0, success: 0 },
					}
					res.clients.forEach((el, index) => {
						likes[el.like].client += 1
						if (el.contractStatus === '계약완료') likes[el.like].success += 1
						if (index === res.clients.length - 1) {
							this.desserts2.push({
								like: 'S',
								client: likes['S'].client,
								success: likes['S'].success,
							})
							this.desserts2.push({
								like: 'A',
								client: likes['A'].client,
								success: likes['A'].success,
							})
							this.desserts2.push({
								like: 'B',
								client: likes['B'].client,
								success: likes['B'].success,
							})
							this.desserts2.push({
								like: 'C',
								client: likes['C'].client,
								success: likes['C'].success,
							})
							this.desserts2.push({
								like: 'D',
								client: likes['D'].client,
								success: likes['D'].success,
							})
							this.businessData.product
								.map(x => x.PD_Type)
								.filter((v, i) => this.businessData.product.map(x => x.PD_Type).indexOf(v) === i)
								.forEach((el, index) => {
									this.cards[0].type.push({ title: el, value: this.businessData.product.filter(x => x.PD_Type === el).length })
									if (index === 0) {
										this.cards[1].type.push({ title: '현황', value: this.desserts.length })
									}
									this.cards[2].type.push({
										title: el,
										value: this.businessData.clients.filter(x => x.customDatas.PD_Type === el).length,
									})
									this.cards[3].type.push({
										title: el,
										value: this.businessData.clients.filter(x => x.customDatas.PD_Type === el && x.contractStatus === '계약완료').length,
									})
									this.cards[4].type.push({
										title: el,
										value:
											this.businessData.product.filter(x => x.PD_Type === el).length -
											this.businessData.clients.filter(x => x.customDatas.PD_Type === el && x.contractStatus === '계약완료').length,
									})
								})
						}
					})
					this.cardKey += 1
				})
				.catch(err => {
					console.log({ err })
				})
		},
		business() {
			const data = {
				id: this.$route.params.id,
			}
			this.$store.dispatch('business', data).then(res => {
				this.businessData = res.business
				this.desserts = res.business.counselors
				this.clients()
			})
		},
		dayChange(val) {
			if (this.days[0] === val) {
				this.startPicker = {
					date: this.$moment()
						.subtract(30, 'days')
						.format('YYYY-MM-DD'),
				}
				this.endPicker = {
					date: this.$moment().format('YYYY-MM-DD'),
				}
			} else if (this.days[1] === val) {
				this.startPicker = {
					date: this.$moment()
						.subtract(21, 'days')
						.format('YYYY-MM-DD'),
				}
				this.endPicker = {
					date: this.$moment().format('YYYY-MM-DD'),
				}
			} else if (this.days[2] === val) {
				this.startPicker = {
					date: this.$moment()
						.subtract(14, 'days')
						.format('YYYY-MM-DD'),
				}
				this.endPicker = {
					date: this.$moment().format('YYYY-MM-DD'),
				}
			} else if (this.days[3] === val) {
				this.startPicker = {
					date: this.$moment()
						.subtract(7, 'days')
						.format('YYYY-MM-DD'),
				}
				this.endPicker = {
					date: this.$moment().format('YYYY-MM-DD'),
				}
			}
		},
		allowed_datesEnd(val) {
			if (this.startPicker.date === '') {
				return val
			} else {
				val = this.$moment().format('YYYY-MM-DD') >= val
			}
			return val
		},
		realRangeTimeCount() {},
	},
}
</script>
