<template>
	<v-dialog v-model="setdialog.dialog" persistent max-width="1100">
		<div class="create_wrap">
			<div class="project_title px-5" :style="`background-color:#323153`">
				<h2 style="font-size:15px">{{ setdialog.title }}</h2>
				<v-spacer />
				<v-icon @click="reset()" class="title-icon" color="white">mdi-close</v-icon>
			</div>

			<v-layout class="ml-8 mt-8 mr-14" wrap>
				<v-flex xs5>
					<v-layout align-center>
						<div class="slash mr-1"></div>
						<span class="title_font">
							지점 정보
						</span>
					</v-layout>
					<div class="mt-2 sub_font ">
						<v-layout
							wrap
							align-center
							justify-center
							v-for="(left, index) in leftInfoTop"
							:key="index"
							:style="index === 4 ? 'height:80px;' : 'height:55px;'"
						>
							<v-flex xs3 class="dialog_table">
								<v-layout align-center class="nomal-info" :style="index === 4 ? 'height:80px;' : 'height:55px;'">
									<v-flex class="info_title">
										{{ left.title }}
									</v-flex>
								</v-layout>
							</v-flex>
							<v-flex class="nomal-input px-2" xs9 v-if="index === 3">
								<v-layout align-center>
									<v-flex xs9>
										<txtField class="bizInput" v-model="left.value" :txtField="left.txtfield"></txtField>
									</v-flex>
									<v-flex xs1 style="text-align:center;">
										명
									</v-flex>
								</v-layout>
							</v-flex>
							<v-flex class="nomal-input px-2" style="height:80px;" xs9 v-else-if="index === 4">
								<v-layout align-center>
									<v-flex xs7>
										<v-radio-group v-model="left.radio" row class="project_message">
											<v-radio label="활성" value="active"></v-radio>
											<v-radio label="비활성" value="unactive"></v-radio>
										</v-radio-group>
									</v-flex>
									<v-flex xs4>
										<txtField class="bizInput" v-model="left.value" :txtField="left.txtfield"></txtField>
									</v-flex>
									<v-flex xs1 style="text-align:center;">
										건
									</v-flex>
								</v-layout>
								<v-layout>
									<v-flex class="search_date_2"> <DatepickerDialog :picker="left.termStartpicker"></DatepickerDialog></v-flex>
									<span class="mx-1"> ~ </span>
									<v-flex class="search_date_2">
										<DatepickerDialog :picker="left.termEndpicker" :allowed_dates="termCustomer"></DatepickerDialog
									></v-flex>
								</v-layout>
							</v-flex>
							<v-flex class="nomal-input px-2" xs9 v-else>
								<txtField class="bizInput" v-model="left.value" :txtField="left.txtfield"></txtField>
							</v-flex>
						</v-layout>
					</div>
					<v-layout wrap class="pt-5">
						<v-flex sm12>
							<v-layout align-center>
								<div class="slash mr-1"></div>
								<span class="title_font">
									관리자 정보
								</span>
							</v-layout>
							<div class="my-2 sub_font">
								<v-layout wrap align-center justify-center v-for="(left, index) in leftInfoBottom" :key="index" style="height:55px;">
									<v-flex xs3 class="dialog_table">
										<v-layout align-center class="nomal-info">
											<v-flex class="info_title">
												{{ left.title }}
											</v-flex>
										</v-layout>
									</v-flex>
									<v-flex class="nomal-input px-2" xs9 v-if="index === 0">
										<v-layout align-center>
											<v-flex xs11>
												<txtField class="bizInput" v-model="left.value" :txtField="left.txtfield"></txtField>
											</v-flex>
											<v-flex xs1 style="text-align:center;" class="pl-1">
												<v-btn
													class="search_btn"
													style="min-width:30px; width:30px !important; background-color:#fff; border:1px solid #C5C5C5;"
													elevation="0"
													@click="searchUserDialog.dialog = true"
													><v-icon style="color:#272727">mdi-magnify</v-icon></v-btn
												>
											</v-flex>
										</v-layout>
									</v-flex>
									<v-flex class="nomal-input px-2" xs9 v-else>
										<txtField class="bizInput" v-model="left.value" :txtField="left.txtfield"></txtField>
									</v-flex>
								</v-layout>
							</div>
						</v-flex>
					</v-layout>
				</v-flex>
				<v-flex xs7 class="pl-11">
					<v-layout align-center>
						<div class="slash mr-1"></div>
						<span class="title_font">
							약관 정보
						</span>
					</v-layout>
					<v-layout wrap class="mt-2 sub_font">
						<v-col class="pa-0">
							<v-layout style="height:42px; border-bottom: 1px solid #d1d1d1; background:#F5F5F5">
								<v-flex xs12 align-self-center style="width:179px">
									<div class="pl-4">
										개인정보의 수집 및 이용안내
									</div>
								</v-flex>
							</v-layout>
						</v-col>
					</v-layout>
					<v-layout class="sub_font_text " style="height:118px;">
						<v-flex xs12 class="pa-2 terms-content-filed2">
							<v-textarea
								class="text_field_bottom"
								outlined
								no-resize
								rows="3"
								:value="termCollection"
								v-model="termCollection"
								style="border-radius:10px;font-size:12px;margin-right:2px;"
							></v-textarea
						></v-flex>
					</v-layout>
					<v-layout wrap class="mt-4 sub_font ">
						<v-col class="pa-0">
							<v-layout style="height:42px; border-bottom: 1px solid #d1d1d1; background:#F5F5F5">
								<v-flex xs12 align-self-center style="width:179px">
									<div class="pl-4">
										개인정보 제3자 제공 동의
									</div>
								</v-flex>
							</v-layout>
						</v-col>
					</v-layout>
					<v-layout class="sub_font_text" style="height:118px;">
						<v-flex xs12 class="pa-2 terms-content-filed2">
							<v-textarea
								class="text_field_bottom"
								outlined
								no-resize
								rows="3"
								:value="termThirdParties"
								v-model="termThirdParties"
								style="border-radius:10px;font-size:12px;margin-right:2px;"
							></v-textarea
						></v-flex>
					</v-layout>
					<v-layout wrap class="pt-10">
						<v-flex xs12 class="ml-auto mb-8" style="margin-top: 110px !important">
							<v-layout justify-end>
								<v-btn @click="setdialog.dialog = false" dense width="100" height="26" dark color="#5B5B5B" class="mr-3">취소</v-btn>
								<v-btn @click="businessAdd" dense width="100" height="26" dark color="#0500B7">저장</v-btn>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</div>
		<searchUser :setdialog="searchUserDialog" @searchUserData="searchUserData" />
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<sweetAlert :dialog="sweetInfo" />
	</v-dialog>
</template>

<script>
import searchUser from './searchUser.vue'
import { txtField, sweetAlert } from '@/components'
import { DatepickerDialog } from '@/components/index.js'
export default {
	components: {
		txtField,
		searchUser,
		sweetAlert,
		DatepickerDialog,
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
			searchUserDialog: {
				dialog: false,
				edit: false,
				editData: {},
			},
			termCollection: '',
			termThirdParties: '',
			managerId: '',
			leftInfoTop: [
				{
					value: '',
					title: '지점명',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '지점명을 입력해주세요.',
					},
					required: true,
				},
				{
					value: '',
					title: '대표번호',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '예) **-1234-5678 / ****-****',
					},
					required: true,
				},
				{
					value: '',
					title: '위치',
					txtfield: {
						maxlength: '15',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
					},
					required: false,
				},
				{
					value: '',
					title: '근무인원',
					txtfield: {
						maxlength: '15',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					},
					required: false,
				},
				{
					title: '목표설정',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
					},
					radio: 'unactive',
					termStartpicker: {
						date: this.$moment().format('YYYY-MM-DD'),
						errorMessage: '',
						class: 'whiteBack defalut-date-picker-setting',
						menu: false,
					},
					termEndpicker: {
						date: this.$moment().format('YYYY-MM-DD'),
						errorMessage: '',
						class: 'whiteBack defalut-date-picker-setting',
						menu: false,
					},
					required: true,
				},
			],
			leftInfoBottom: [
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
				},
				{
					value: '',
					title: '전화번호',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						disable: true,
					},
				},
				{
					value: '',
					title: '아이디(이메일)',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						disable: true,
					},
				},
			],
		}
	},
	methods: {
		searchUserData(data) {
			this.leftInfoBottom[0].value = data.name
			this.leftInfoBottom[1].value = data.phone
			this.leftInfoBottom[2].value = data.email
			this.managerId = data.id
		},
		reset() {
			this.setdialog.dialog = false
		},
		termCustomer(val) {
			let start = this.$moment(this.leftInfoTop[4].termStartpicker.date).format('YYMMDD')

			let startDate = new Date(this.leftInfoTop[4].termStartpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},

		clickSave() {
			this.$store.state.loading = true
			let input = {
				title: this.leftInfoTop[0].value,
				mainPhone: this.leftInfoTop[1].value,
				address: this.leftInfoTop[2].value,
				working: Number(this.leftInfoTop[3].value),
				goalCount: Number(this.leftInfoTop[4].value),
				goalActive: this.leftInfoTop[4].radio === 'active' ? true : false,
				goalStart: this.leftInfoTop[4].termStartpicker.date,
				goalEnd: this.leftInfoTop[4].termEndpicker.date,
				manager: this.leftInfoBottom[0].value,
				managerPhone: this.leftInfoBottom[1].value,
				managerEmail: this.leftInfoBottom[2].value,
				managerId: this.managerId ? this.managerId : this.setdialog.editData.managerId,
				termCollection: this.termCollection,
				termThirdParties: this.termThirdParties,
			}
			if (this.setdialog.edit) {
				input.id = this.setdialog.editData.id
				this.$store.dispatch('updateBusiness', input).then(res => {
					console.log(res)
					this.sweetDialog.open = false
					this.setdialog.dialog = false
					this.$emit('update')
					this.$store.state.loading = false
				})
			} else {
				this.$store.dispatch('createBusiness', input).then(res => {
					console.log(res)
					this.sweetDialog.open = false
					this.setdialog.dialog = false
					this.$emit('update')
					this.$store.state.loading = false
				})
			}
		},

		async businessAdd() {
			if (!this.leftInfoTop[0].value) {
				this.sweetInfo.title = '지점명 입력'
				this.sweetInfo.content = `지점명을 입력해 주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.leftInfoTop[1].value) {
				this.sweetInfo.title = '대표번호 입력'
				this.sweetInfo.content = `지점명을 입력해 주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.leftInfoTop[2].value) {
				this.sweetInfo.title = '위치 입력'
				this.sweetInfo.content = `위치를 입력해 주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.leftInfoTop[3].value) {
				this.sweetInfo.title = '근무인원 입력'
				this.sweetInfo.content = `근무인원을 입력해 주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.leftInfoTop[4].value) {
				this.sweetInfo.title = '목표설정 입력'
				this.sweetInfo.content = `목표설정을 입력해 주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.leftInfoTop[4].termStartpicker.date || !this.leftInfoTop[4].termEndpicker.date) {
				this.sweetInfo.title = '목표설정 기간 선택'
				this.sweetInfo.content = `목표설정 기간 선택해 주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.leftInfoBottom[0].value) {
				this.sweetInfo.title = '관리자 전화번호 입력'
				this.sweetInfo.content = `관리자 전화번호를 입력해 주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.leftInfoBottom[1].value) {
				this.sweetInfo.title = '관리자 아이디 입력'
				this.sweetInfo.content = `관리자 아이디를 입력해 주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.leftInfoBottom[2].value) {
				this.sweetInfo.title = '관리자 아이디 입력'
				this.sweetInfo.content = `관리자 아이디를 입력해 주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.managerId) {
				this.sweetInfo.title = '관리자 입력'
				this.sweetInfo.content = `잘못된 관리자입니다. 조회후 선택해주세요`
				return (this.sweetInfo.open = true)
			}
			if (!this.termCollection) {
				this.sweetInfo.title = '약관 입력'
				this.sweetInfo.content = `개인정보의 수집및 이용안내를 입력해주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.termThirdParties) {
				this.sweetInfo.title = '약관 입력'
				this.sweetInfo.content = `개인정보 제3자 제공 동의를 입력해주세요.`
				return (this.sweetInfo.open = true)
			}
			this.sweetDialog.open = true
		},
	},
	watch: {
		setdialog: {
			deep: true,
			handler() {
				if (this.setdialog.dialog) {
					if (this.setdialog.edit) {
						this.leftInfoTop[0].value = this.setdialog.editData.title
						this.leftInfoTop[1].value = this.setdialog.editData.mainPhone
						this.leftInfoTop[2].value = this.setdialog.editData.address
						this.leftInfoTop[3].value = String(this.setdialog.editData.working)
						this.leftInfoTop[4].value = String(this.setdialog.editData.goalCount)
						this.leftInfoTop[4].radio = this.setdialog.editData.goalActive ? 'active' : 'unactive'
						this.leftInfoTop[4].termStartpicker.date = this.setdialog.editData.goalStart
						this.leftInfoTop[4].termEndpicker.date = this.setdialog.editData.goalEnd
						this.leftInfoBottom[0].value = this.setdialog.editData.manager
						this.leftInfoBottom[1].value = this.setdialog.editData.managerPhone
						this.leftInfoBottom[2].value = this.setdialog.editData.managerEmail
						this.managerId = this.setdialog.editData.managerId
						this.termCollection = this.setdialog.editData.termCollection
						this.termThirdParties = this.setdialog.editData.termThirdParties
					} else {
						this.leftInfoTop[0].value = ''
						this.leftInfoTop[1].value = ''
						this.leftInfoTop[2].value = ''
						this.leftInfoTop[3].value = ''
						this.leftInfoTop[4].value = ''
						this.leftInfoTop[4].radio = 'unactive'
						this.leftInfoTop[4].termStartpicker.date = null
						this.leftInfoTop[4].termEndpicker.date = null
						this.managerId = ''
						this.leftInfoBottom[0].value = ''
						this.leftInfoBottom[1].value = ''
						this.leftInfoBottom[2].value = ''
						this.termCollection = ''
						this.termThirdParties = ''
					}
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
