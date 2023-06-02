<template>
	<div class="profileDiv">
		<div :class="$vuetify.breakpoint.smAndDown ? '' : 'wrapper'">
			<breadcrumbs class="titleCrumb" title="마이 페이지"></breadcrumbs>
			<div class="dataCard mt-1">
				<p class="profileTitle">프로필</p>
				<!-- 프로필 data -->
				<v-layout flex-wrap class="pt-5">
					<v-flex md6 sm6 xs12 v-for="(item, i) in inputItems" :key="i">
						<v-layout flex-wrap>
							<!-- 프로필 정보명 -->
							<v-flex md4 sm12 xs12 class="inputProfile">{{ item.title }} </v-flex>
							<!-- 정보 input -->
							<v-flex md7 sm11 xs12>
								<!-- txtField -->
								<txtField
									v-if="item.txtField"
									v-model="item.txtField.value"
									:txtField="item.txtField"
									@input="inputConfirm(item)"
								></txtField>
								<!-- selectbox -->
								<selectBox3 v-else-if="item.sel" :sel="item.sel" @change="btnActive()"></selectBox3>
								<v-avatar v-else-if="item.fileinput" size="38" style="cursor:pointer" @click="imageClick">
									<img :src="item.fileinput.src" />
								</v-avatar>
								<input type="file" style="display:none;" id="profile_change" @change="fileUpload" accept="image/*" />
							</v-flex>
						</v-layout>
					</v-flex>
					<!-- checkBox -->
					<v-flex md2 sm12 class="inputProfile">마케팅 수신동의 </v-flex>
					<v-flex md10 sm12 style="min-height:49px">
						<check-box :check="marketingCheck" @click="checkAgree"></check-box>
						<p class="checkAlert" v-if="agreeMessage">{{ agreeMessage }}</p>
					</v-flex>
					<v-flex xs12 class="d-flex borderFlex">
						<btn :btn="nextbtn" btn_txt="저장" :disabled="nextbtn.disabled" class="ml-auto" @click="saveProfile"></btn>
					</v-flex>
				</v-layout>
			</div>
			<!-- 회원 탈퇴 -->
			<div class="dataCard mt-4" v-show="false">
				<p class="profileTitle">회원 탈퇴</p>
				<p class="withdrawlNotice">Notice</p>
				<p class="withdrawlInfo">- 회원 탈퇴시 결제잔금이 모두 지불 된 이후에 탈퇴가 가능합니다.</p>
				<p class="withdrawlInfo">- 회원 탈퇴시 진행준인 사업지가 모두 종료되어야 탈퇴가 가능합니다.</p>
				<div class="withdrawlBtn">
					<btn :btn="deletebtn" btn_txt="회원 탈퇴" class="ml-auto" @click="withdrawlClick"></btn>
				</div>
			</div>
		</div>
		<alertModal2 :setdialog="alertModal" :saveData="saveClick"></alertModal2>
		<alertModal2 :setdialog="alertModal2" :saveData="withdrawl"></alertModal2>
	</div>
</template>
<script>
import { breadcrumbs, txtField, selectBox3, checkBox, btn, alertModal2 } from '@/components/index.js'
export default {
	data: () => ({
		name: '',
		changePasswordModal: {
			dialog: false,
			pwd: '',
			rePwd: '',
			txtFieldPassword: { label: 'PasswordCheck', outlined: true, clearable: true, type: 'password', errorMessage: '', hideDetail: false },
			txtFieldRePassword: { label: 'Password', outlined: true, clearable: true, type: 'password', errorMessage: '', hideDetail: false },
		},

		nextbtn: { width: '100', disabled: true, height: '38', dark: false },
		deletebtn: { width: '100', height: '38', dark: true },
		inputItems: [
			{ title: '프로필 사진', fileinput: { src: '', file: {} } },
			{ title: '이메일', txtField: { maxlength: '255', disable: true, outlined: true, hideDetail: false, errorMessage: '' } },
			{
				title: '비밀번호',
				txtField: {
					type: 'password',
					value: '',
					maxlength: '20',
					outlined: true,
					hideDetail: false,
					autocomplete: 'off',
					errorMessage: '',
					placeholder: '영문 + 숫자 포함 8 ~ 20자리',
				},
			},
			{
				title: '비밀번호 확인',
				txtField: {
					type: 'password',
					value: '',
					maxlength: '20',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
					placeholder: '비밀번호를 한번 더 입력하세요.',
				},
			},
			{
				title: '국가',
				sel: { value: '', items: ['대한민국', '미국'], maxlength: '255', outlined: true, hideDetail: false, errorMessage: '' },
			},
			{
				title: '전화번호',

				txtField: {
					// onlyNumber: true,
					value: '',
					maxlength: '13',
					outlined: true,
					hideDetail: false,
					autocomplete: 'off',
					errorMessage: '',
					placeholder: '전화번호를 입력해 주세요.',
				},
			},
		],
		nationalCode: [
			{ name: '대한민국', code: 'ko' },
			{ name: '미국', code: 'us' },
		],

		marketingCheck: {
			color: 'primary',
			class: '',
			value: false,
			hideDetail: true,
			errorMessage: '',
			label: 'Visit Here의 새소식과 이벤트 정보 수신에 동의합니다.',
		},
		marketingDate: '',
		agreeMessage: '',
		alertModal: {
			dialog: false,
			text: '저장되었습니다.',
		},
		alertModal2: {
			dialog: false,
			text:
				'- 회원 탈퇴시 결제잔금이 모두 지불 된 이후에 탈퇴가 가능합니다.\n- 회원 탈퇴시 진행준인 사업지가 모두 종료되어야 탈퇴가 가능합니다.',
		},
		userData: {},
	}),
	methods: {
		async medata() {
			await this.$store
				.dispatch('me')
				.then(() => {})
				.catch(() => {})
		},

		imageClick() {
			document.getElementById('profile_change').click()
		},
		fileUpload(event) {
			// 단일 파일 업로드

			/// 파일업로드
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
				file: event.target.files[0],
			}
			this.$store.dispatch('superAdminFileUpload', data).then(res => {
				this.inputItems[0].fileinput.src = process.env.VUE_APP_BACKEND_URL + res.data.upload.url
				this.inputItems[0].fileinput.file = res

				this.nextbtn.disabled = false
				this.nextbtn.dark = true
			})

			// const data = {
			// 	file: event.target.files[0],
			// }
			// /// 메인 이미지 업로드
			// if (this.setdialog.items[this.testIndex].title === '메인이미지') {
			// 	this.$store.commit('uploadFileData', data)
			// } else {
			// 	// direct 이미지 업로드
			// 	this.$store.commit('uploadFileDataDirect', data)
			// }
		},
		inputConfirm(item) {
			if (item.title === '비밀번호') {
				let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
				if (!this.inputItems[2].txtField.value) {
					this.inputItems[2].txtField.errorMessage = ''
					setTimeout(() => {
						this.nextbtn.disabled = false
						this.nextbtn.dark = true
					}, 100)
				} else if (!re.test(this.inputItems[2].txtField.value)) {
					this.inputItems[2].txtField.errorMessage = '비밀번호는 영문+숫자를 조합하여 8자리 이상으로 입력바랍니다.'
				} else {
					this.inputItems[2].txtField.errorMessage = ''
				}
			}
			if (item.title === '비밀번호 확인') {
				if (!this.inputItems[3].txtField.value) {
					this.inputItems[3].txtField.errorMessage = ''
				} else if (this.inputItems[2].txtField.value !== this.inputItems[3].txtField.value) {
					this.inputItems[3].txtField.errorMessage = '비밀번호가 일치하지 않습니다.'
				} else {
					this.inputItems[3].txtField.errorMessage = ''
				}
			}
			if (item.title === '전화번호') {
				let value = item.txtField.value
					.replace(/[^0-9]/g, '')
					.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
					.replace('--', '-')
				item.txtField.value = value
			}
			this.btnActive()
		},
		btnActive() {
			let index = this.nationalCode.findIndex(e => e.name === this.inputItems[4].sel.value)
			let code = this.nationalCode[index].code
			let value = this.inputItems[5].txtField.value
			if (this.inputItems[5].txtField.value) {
				value = this.inputItems[5].txtField.value.replace(/-/g, '')
			}
			if (
				this.inputItems[2].txtField.value ||
				this.inputItems[3].txtField.value ||
				code !== this.userData.language ||
				value !== this.userData.phone ||
				this.marketingCheck.value !== this.userData.marketing
			) {
				this.nextbtn.disabled = false
				this.nextbtn.dark = true
			} else {
				this.nextbtn.disabled = true
				this.nextbtn.dark = false
			}
		},
		saveProfile() {
			let ok = 0
			let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
			if (this.inputItems[2].txtField.value) {
				if (!re.test(this.inputItems[2].txtField.value)) {
					this.inputItems[2].txtField.errorMessage = '비밀번호는 영문+숫자를 조합하여 8자리 이상으로 입력바랍니다.'
					ok++
				} else if (this.inputItems[2].txtField.value !== this.inputItems[3].txtField.value) {
					this.inputItems[3].txtField.errorMessage = '비밀번호가 일치하지 않습니다.'
					ok++
				}
			}
			if (ok === 0) {
				this.nextbtn.disabled = true
				this.nextbtn.dark = false
				this.updateUser()
			}
		},
		checkAgree() {
			if (!this.marketingCheck.value) {
				this.agreeMessage = `${this.$moment().format('YYYY년 MM월 DD일 HH시 mm분')}에 마케팅 정보 수신에 동의를 철회 하셨습니다.`
			} else {
				this.agreeMessage = `${this.$moment().format('YYYY년 MM월 DD일 HH시 mm분')}에 마케팅 정보 수신에 동의하셨습니다.`
			}
			this.marketingDate = this.$moment()
			this.btnActive()
		},
		async users() {
			const data = {
				email: this.$store.state.meData.email,
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
			}
			await this.$store
				.dispatch('Users', data)
				.then(res => {
					let user = res.data.users[0]
					this.userData = user
					this.inputItems[1].txtField.value = user.email
					this.inputItems[2].txtField.value = ''
					this.inputItems[3].txtField.value = ''
					if (user.language) {
						let index = this.nationalCode.findIndex(e => e.code === user.language)
						let name = this.nationalCode[index].name
						this.inputItems[4].sel.value = name
					}
					this.inputItems[5].txtField.value = user.phone
					if (user.phone) {
						let value = user.phone
							.replace(/[^0-9]/g, '')
							.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
							.replace('--', '-')
						this.inputItems[5].txtField.value = value
					}
					this.marketingCheck.value = user.marketing

					if (user.marketingDate === null) {
						this.agreeMessage = `${this.$moment(user.updated_at).format(
							'YYYY년 MM월 DD일 HH시 mm분',
						)}에 마케팅 정보 수신에 동의를 철회 하셨습니다.`
						this.marketingDate = user.updated_at
					} else {
						this.marketingDate = user.marketingDate
						if (!user.marketing) {
							this.agreeMessage = `${this.$moment(user.marketingDate).format(
								'YYYY년 MM월 DD일 HH시 mm분',
							)}에 마케팅 정보 수신에 동의를 철회 하셨습니다.`
						} else {
							this.agreeMessage = `${this.$moment(user.marketingDate).format(
								'YYYY년 MM월 DD일 HH시 mm분',
							)}에 마케팅 정보 수신에 동의하셨습니다.`
						}
					}
					if (user.face) {
						this.inputItems[0].fileinput.src = process.env.VUE_APP_BACKEND_URL + user.face.url
					} else {
						this.inputItems[0].fileinput.src = '/image/default_pic.png'
					}
					// this.agreeMessage = ''
				})
				.catch(() => {})
		},
		updateUser() {
			let index = this.nationalCode.findIndex(e => e.name === this.inputItems[4].sel.value)
			let code = this.nationalCode[index].code
			let faceId
			if (Object.keys(this.inputItems[0].fileinput.file).length !== 0) {
				faceId = this.inputItems[0].fileinput.file.data.upload.id
			}

			const data = {
				id: this.$store.state.meData.id,
				marketing: this.marketingCheck.value,
				marketingDate: this.marketingDate,
				face: faceId,
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
			}

			if (this.inputItems[2].txtField.value) {
				data.password = this.inputItems[2].txtField.value
			}
			if (code) {
				data.language = code
			}

			if (this.inputItems[5].txtField.value) {
				data.phone = this.inputItems[5].txtField.value.replace(/-/g, '')
			}
			this.$store
				.dispatch('updateUser', data)
				.then(() => {
					this.alertModal.dialog = true
					this.$store.state.meData.face.url = this.inputItems[0].fileinput.src
				})
				.catch(() => {})
		},
		withdrawl() {
			// const data = {
			// 	id: this.$store.state.meData.id,
			// 	out: true,
			// }
			// this.$store
			// 	.dispatch('updateUser', data)
			// 	.then(() => {
			// 		this.logout()
			// 	})
			// 	.catch(() => {})
		},
		saveClick() {
			this.users()
		},
		withdrawlClick() {
			this.alertModal2.dialog = true
		},
		logout() {
			this.$cookies.remove('xi-t')
			this.$store.commit('meData', {})
			window.open('https://sso.gsenc.com/sso/std/chkTokenRedirect.jsp?ru=https://crm-admin.xi.co.kr/loginCheck?redirect=/KIOSK', '_self')
			// this.$router.push({ name: 'kioskLogin' }).catch(() => {})
		},
		test() {},
	},
	async created() {
		this.nextbtn.color = this.$store.state.PointColor2
		await this.medata()
		await this.users()
	},
	components: {
		breadcrumbs,
		txtField,
		selectBox3,
		checkBox,
		btn,
		alertModal2,
	},
}
</script>

<style lang="scss" scoped>
@import 'Scss/main';
.profileDiv {
	width: 100%;
	background-color: aliceblue;
	min-height: 100%;
	height: fit-content;
}
.dataCard {
	padding: 20px;
	background-color: white;
}
.profileTitle {
	font-size: 20px;
	font-weight: bold;
}
.inputProfile {
	padding-top: 8px;
	font-size: 14px;
}
.checkAlert {
	margin-left: 32px;
	font-size: 14px;
	color: red;
}
.borderFlex {
	margin-top: 20px;
	padding-top: 20px;
	border-top: 1px solid #a0a0a0;
}
.withdrawlNotice {
	margin: 20px 0px 10px 0px;
	color: #c84040;
	font-size: 16px;
	font-weight: bold;
}
.withdrawlInfo {
	color: #7d7d7d;
	font-size: 13px;
}
.withdrawlBtn {
	border-top: 1px solid #a0a0a0;
	margin-top: 20px;
	padding-top: 20px;
	text-align: end;
}
</style>
