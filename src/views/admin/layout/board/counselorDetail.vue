<template>
	<div>
		<v-layout align-center class="my-6">
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
		<div class="mr-auto dashboard-text mt-12">
			상담사 정보
		</div>
		<div class="card-layout mt-1">
			<v-layout wrap>
				<v-flex xs3 v-for="(card, i) in cardData" :key="i">
					<v-layout align-center class="mb-4">
						<div class="card-text">
							{{ card.text }}
						</div>
						<div class="card-value ml-4" v-if="i === 4">
							{{ $moment(card.value).format('YYYY-MM-DD HH:mm') }}
						</div>
						<div class="card-value ml-4" v-else-if="card.text !== '상태'">
							{{ card.value }}
						</div>
						<div v-else class="ml-4">
							<v-layout align-center>
								<v-btn
									v-if="card.value === 'waiting' || card.value === 'disallowed'"
									small
									outlined
									color="primary"
									@click="updateCounselor(card.value)"
									>승인</v-btn
								>
								<v-btn v-else small class="ml-2" dark color="#202840" @click="updateCounselor(card.value)">승인취소</v-btn>
							</v-layout>
						</div>
					</v-layout>
				</v-flex>
			</v-layout>
		</div>
		<v-layout align-center class="mb-8 mt-12">
			<div class="mr-auto dashboard-text">
				상담사 등록고객
			</div>
			<div>
				<v-text-field
					:autofocus="false"
					label="Search"
					solo
					dark
					class="ml-4 search-textfiled"
					hideDetails
					maxlength="255"
					append-icon="mdi-magnify"
					flat
					dense
					clearable
					v-model="search"
					autocomplete="off"
				></v-text-field>
			</div>
		</v-layout>
		<v-data-table :search="search" :headers="headers" :items="desserts" class="elevation-0 dashboard-table">
			<template v-slot:[`item.pricePaper`]="{ item }">
				<v-btn v-if="item.pricePaper" dark color="primary" icon @click="download(item.pricePaper)">
					<v-icon>
						mdi-file
					</v-icon>
				</v-btn>
			</template>
		</v-data-table>
		<v-layout justify-end>
			<v-btn dark color="black" class="mr-auto" @click="$router.push({ name: 'counselor' })">
				상담사 목록
			</v-btn>
			<v-btn color="point3" dark @click="excelExport">
				엑셀저장
			</v-btn>
		</v-layout>
		<download-excel
			class="btn btn-default"
			id="counselorDetailExcel"
			:data="desserts"
			style="display:none"
			:fields="json_fields"
			type="csv; charset=utf-8;"
			worksheet="My Worksheet"
			:name="startPicker.date + '~' + endPicker.date + '_' + cardData[0].value + '_' + cardData[1].value + '_상담사 등록고객'"
		>
		</download-excel>
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
			json_fields: {
				이름: 'name',
				휴대전화번호: 'phoneExcel',
				성별: 'sex',
				생년월일: 'birthday',
				희망평형: 'customDatas.PD_Type',
				고객성향: 'like',
				계약여부: 'contractStatus',
				첨부파일: 'pricePaperUrl',
			},
			cardData: [
				{ text: '이름', value: '' },
				{ text: '휴대전화번호', value: '' },
				{ text: '이메일', value: '' },
				{ text: '회사명', value: '' },
				{ text: '등록일', value: '' },
				{ text: '등록사업지', value: '' },
				{ text: '상태', value: '' },
			],
			search: '',
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

			headers: [
				{
					text: '이름',
					align: 'center',
					value: 'name',
				},
				{ text: '휴대전화번호', value: 'phone', align: 'center' },
				{ text: '성별', value: 'sex', align: 'center' },
				{ text: '생년월일', value: 'birthday', align: 'center' },
				{ text: '희망평형', value: 'customDatas.PD_Type', align: 'center' },
				{ text: '고객성향', value: 'like', align: 'center' },
				{ text: '계약여부', value: 'contractStatus', align: 'center' },
				{ text: '첨부파일', value: 'pricePaper', align: 'center' },
			],
			desserts: [],
			counselorData: {},
			businessId: null,
			userId: null,
		}
	},
	created() {
		this.counselor()
	},
	methods: {
		download(item) {
			const url = process.env.VUE_APP_BACKEND_URL + item.url
			const link = document.createElement('a')
			link.href = url
			link.target = '_blank'
			link.download = item.name
			link.click()
			link.remove()
			window.URL.revokeObjectURL(url)
		},
		clients() {
			const data = {
				business: this.businessId,
				users_permissions_user: this.userId,
				updated_at_gte: this.startPicker.date + 'T00:00:00.000Z',
				updated_at_lte: this.endPicker.date + 'T23:59:59.000Z',
			}
			this.$store.dispatch('clients', data).then(res => {
				this.desserts = res.clients
				this.desserts.forEach(el => {
					el.phoneExcel = el.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
					if (el.pricePaper) {
						el.pricePaperUrl = process.env.VUE_APP_BACKEND_URL + el.pricePaper.url
					}
				})
			})
		},
		chagneText2(text) {
			if (text === 'waiting') {
				return '승인'
			} else if (text === 'allowed') {
				return '승인취소'
			} else if (text === 'disallowed') {
				return '승인'
			}
		},
		updateCounselor(value) {
			var result = confirm(`${this.cardData[0].value} - 상담사를 ${this.chagneText2(value)} 하시겠습니까?`)
			if (result) {
				const data = {
					id: this.$route.params.id,
				}
				if (value === 'waiting') {
					data.status = 'allowed'
				} else if (value === 'allowed') {
					data.status = 'disallowed'
				} else if (value === 'disallowed') {
					data.status = 'allowed'
				}
				this.$store.dispatch('updateCounselor', data).then(() => {
					alert('상담사의 상태가 변경되었습니다.')
					this.counselor()
				})
			}
		},
		counselor() {
			const data = {
				id: this.$route.params.id,
			}
			this.$store.dispatch('counselor', data).then(res => {
				this.counselorData = res.counselor
				this.cardData[0].value = res.counselor.users_permissions_user.name
				this.cardData[1].value = res.counselor.users_permissions_user.phone
				this.cardData[2].value = res.counselor.users_permissions_user.email
				this.cardData[3].value = res.counselor.users_permissions_user.companyName
				this.cardData[4].value = res.counselor.created_at
				this.cardData[5].value = res.counselor.business.title
				this.cardData[6].value = res.counselor.status
				this.businessId = res.counselor.business.id
				this.userId = res.counselor.users_permissions_user.id
				this.clients()
			})
		},
		cancelCounselor() {},
		accessCounselor() {},
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
			this.clients()
		},
		excelExport() {
			document.getElementById('counselorDetailExcel').click()
		},
		allowed_datesEnd(val) {
			if (this.startPicker.date === '') {
				return val
			} else {
				val = this.$moment().format('YYYY-MM-DD') >= val
			}
			return val
		},
		realRangeTimeCount() {
			this.clients()
		},
	},
}
</script>
