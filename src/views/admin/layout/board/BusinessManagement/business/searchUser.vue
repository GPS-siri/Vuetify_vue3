<template>
	<v-dialog v-model="setdialog.dialog" persistent max-width="745">
		<div class="create_wrap">
			<div class="project_title px-5" :style="`background-color:#F3F3F3`">
				<h2 style="font-size:15px; color:#1A1816;">직원 검색</h2>
				<v-flex class="search_select mr-1 ml-7 " style="max-width:100px;">
					<selectBox :sel="searchsel1" :class="'searchSel'" style="font-size:12px" @change="getTeam()"></selectBox>
				</v-flex>
				<v-flex class="search_select mr-1 " style="max-width:87px;">
					<selectBox :sel="searchsel2" :class="'searchSel'" style="font-size:12px" @change="getRank()"></selectBox>
				</v-flex>
				<v-flex class="search_select mr-1 " style="max-width:80px;">
					<selectBox :sel="searchsel3" :class="'searchSel'" style="font-size:12px"> </selectBox>
				</v-flex>
				<v-flex class="search_select mr-1 " style="max-width:120px;">
					<selectBox :sel="searchsel4" :class="'searchSel'" style="font-size:12px"></selectBox>
				</v-flex>
				<v-flex class="" style="max-width:118px;">
					<txtField class="bizInput" style="background-color:#fff;" v-model="txtfield.value" :txtField="txtfield"></txtField>
				</v-flex>
				<v-flex class="ml-3" style="max-width:68px;">
					<v-btn class="search_btn" color="#5d19ff" @click="getSearch()" elevation="0"><v-icon>mdi-magnify</v-icon>조회</v-btn>
				</v-flex>
			</div>

			<v-layout class="ml-8 mt-8 mr-14" wrap>
				<v-flex xs12>
					<v-layout align-center>
						<div class="slash mr-1"></div>
						<span class="title_font">
							직원 정보
						</span>
					</v-layout>
					<div class="mt-2 sub_font ">
						<v-layout wrap align-center justify-center>
							<v-flex xs6 v-for="(left, index) in leftInfoTop" :key="index">
								<v-layout>
									<v-flex xs4 class="dialog_table">
										<v-layout align-center class="nomal-info">
											<v-flex class="info_title">
												{{ left.title }}
											</v-flex>
										</v-layout>
									</v-flex>

									<v-flex class="nomal-input px-2" xs8>
										<txtField class="bizInput" v-model="left.value" :txtField="left.txtfield"></txtField>
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
					</div>
				</v-flex>
			</v-layout>
			<v-layout wrap class="pt-10">
				<v-flex xs12 class="ml-auto mb-8">
					<v-layout justify-center>
						<v-btn @click="setdialog.dialog = false" dense width="100" height="26" dark color="#5B5B5B" class="mr-3">취소</v-btn>
						<v-btn @click="businessAdd" dense width="100" height="26" dark color="#0500B7">저장</v-btn>
					</v-layout>
				</v-flex>
			</v-layout>
		</div>
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<sweetAlert :dialog="sweetInfo" />
	</v-dialog>
</template>

<script>
import { txtField, sweetAlert } from '@/components'
import { selectBox } from '@/components/index.js'
export default {
	components: {
		txtField,
		sweetAlert,
		selectBox,
	},
	props: {
		setdialog: Object,
	},
	data() {
		return {
			sweetInfo: {
				open: false,
				title: '',
				content: ``,
				modalIcon: 'info',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},
			sweetDialog: {
				open: false,
				title: '지점 저장',
				content: `지점 정보를
저장합니다`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
			},
			termCollection: '',
			termThirdParties: '',
			searchsel1: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: [],
				outlined: true,
				placeholder: '지점',
				returnObject: true,
				itemText: 'title',
			},
			searchsel2: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: [],
				outlined: true,
				placeholder: '부서',
				returnObject: true,
				itemText: 'title',
			},
			searchsel3: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: [],
				outlined: true,
				placeholder: '직급',
				returnObject: true,
				itemText: 'title',
			},
			searchsel4: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: ['이름', '연락처'],
				outlined: true,
			},
			txtfield: {
				value: '',
				maxlength: '255',
				outlined: true,
				hideDetail: true,
				errorMessage: '',
				autocomplete: 'off',
				placeholder: '',
			},
			searchData: {},
			leftInfoTop: [
				{
					value: '',
					title: '이름',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
						disable: true,
					},
					required: true,
				},
				{
					value: '',
					title: '연락처',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
						disable: true,
					},
					required: true,
				},
				{
					value: '',
					title: '지점',
					txtfield: {
						maxlength: '15',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						disable: true,
					},
					required: false,
				},
				{
					value: '',
					title: '부서',
					txtfield: {
						maxlength: '15',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
						disable: true,
					},
					required: false,
				},
				{
					title: '직급',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
						disable: true,
					},

					required: true,
				},
				{
					title: '이메일',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
						disable: true,
					},

					required: true,
				},
			],
		}
	},
	methods: {
		reset() {
			this.setdialog.dialog = false
		},
		async getBusiness() {
			await this.$store.dispatch('businesses').then(res => {
				this.searchsel1.items = res.businesses
				this.searchsel1.value = ''
				this.searchsel2.items = []
				this.searchsel2.value = ''
				this.searchsel3.items = []
				this.searchsel3.value = ''
				this.searchsel4.value = ''
			})
		},
		getTeam() {
			let input = {
				business: this.searchsel1.value.id,
			}
			this.$store.dispatch('teams', input).then(res => {
				this.searchsel2.items = res.teams
				this.searchsel3.items = []
				this.searchsel3.value = ''
				this.searchsel4.value = ''
			})
		},
		getRank() {
			let input = {
				business: this.searchsel1.value.id,
				team: this.searchsel2.value.id,
			}
			this.$store.dispatch('ranks', input).then(res => {
				this.searchsel3.items = res.ranks
				this.searchsel4.value = ''
			})
		},
		getSearch() {
			let input = {
				business: this.searchsel1.value.id,
				team: this.searchsel2.value.id,
				rank: this.searchsel3.value.id,
				role: '1', //관리자
			}
			if (this.searchsel4.value === '이름') {
				input.name = this.txtfield.value
			} else if (this.searchsel4.value === '연락처') {
				input.phone = this.txtfield.value
			} else {
				alert('이름 / 연락처를 선택후 조회해주세요')
				return
			}
			this.$store.dispatch('users', input).then(res => {
				this.searchData = res.users[0]
				this.leftInfoTop[0].value = res.users[0].name
				this.leftInfoTop[1].value = res.users[0].phone
				this.leftInfoTop[2].value = res.users[0].business.title
				this.leftInfoTop[3].value = res.users[0].team.title
				this.leftInfoTop[4].value = res.users[0].rank.title
				this.leftInfoTop[5].value = res.users[0].email
			})
		},

		businessAdd() {
			this.$emit('searchUserData', this.searchData)
			this.setdialog.dialog = false
		},
	},
	watch: {
		setdialog: {
			deep: true,
			handler() {
				if (this.setdialog.dialog) {
					this.leftInfoTop[0].value = ''
					this.leftInfoTop[1].value = ''
					this.leftInfoTop[2].value = ''
					this.leftInfoTop[3].value = ''
					this.leftInfoTop[4].value = ''
					this.leftInfoTop[5].value = ''
					this.txtfield.value = ''
					this.getBusiness()
				}
			},
		},
	},
}
</script>

<style lang="scss">
.terms-content-filed2 {
	white-space: pre-line;
	font-size: 12px;
	max-height: 118px;
	min-height: 118px;
	// overflow: auto;
	border: 1px solid #d1d1d1;
}
.counselorTable {
	.v-data-table__wrapper {
		margin-top: 8px !important;
		border: 1px solid #d1d1d1;
		border-bottom: none;
		border-top: none;
	}
}
.counselorTable > .v-data-table > .v-data-table__wrapper > table {
	border: none !important;
	thead {
		border-top: 1px solid #d1d1d1;
		border-bottom: 1px solid #d1d1d1;
		tr {
			th:not(:last-of-type) {
				border: none !important;
				text-align: center !important;
			}
		}
	}
}
.counselorTable > .v-data-table > .v-data-table__wrapper > table {
	tbody {
		tr {
			height: 40px !important;
			td:not(:last-of-type) {
				border-top: none !important;
				border-right: none !important;
				text-align: center !important;
			}
		}
	}
}
.all-counselor {
	font-weight: bold;
	color: #535353;
	font-size: 14px;
	.count {
		color: #e89000;
	}
}
</style>
