<template>
	<v-container class="login-container">
		<v-layout class="login_background_t" wrap justify-center align-center>
			<!--  이미지  -->
			<v-flex xs6>
				<div>
					<v-img height="100vh" src="@/assets/images/image/pick_here_admin_login.png"></v-img>
				</div>
			</v-flex>
			<!-- 회원가입 정보 폼 -->
			<v-flex md6 xs12 class="signUp_container">
				<div class="login-text">Sign up for Service</div>
				<div class="login-text-sub mb-7">서비스 가입</div>
				<v-layout class="signUp_wrap" wrap>
					<!-- 왼쪽 필드 -->
					<v-flex xs6 class="pr-12">
						<div class="signUp_input_group">
							SERVICE INFORMATION
						</div>

						<div class="new_login_head">회사명</div>
						<v-text-field
							hideDetails
							:error-messages="iderrorMessages"
							:autofocus="false"
							class="txtLogin1_t mb-2"
							outlined
							maxlength="255"
							flat
							dense
							v-model="siginup.companyName"
							autocomplete="off"
						></v-text-field>
						<div class="new_login_head">사업자 등록번호</div>
						<div class="display_flex">
							<v-text-field
								readonly
								hideDetails
								:autofocus="false"
								class="txtLogin1_t"
								outlined
								type="text"
								maxlength="13"
								dense
								v-model="siginup.companyPaperName"
								autocomplete="off"
							></v-text-field>
							<v-btn elevation="0" height="40" class="ml-4" dark color="admin_blue" @click="clickUpload()">
								<span style="font-weight: bold;"> 사업자 등록증 첨부</span>
							</v-btn>
						</div>
						<div class="warnning-text mb-4 mt-1">
							※ 파일형식 : jpg, pdf, png (500kb이하)
						</div>

						<input
							type="file"
							style="display:none;"
							id="company_upload"
							@change="fileUploadChange"
							accept="image/jpeg,image/png,application/pdf"
						/>

						<div class="new_login_head mt-11">위치</div>
						<v-text-field
							hideDetails
							:autofocus="false"
							class="txtLogin1_t"
							outlined
							type="text"
							maxlength="255"
							dense
							v-model="siginup.companyAddress"
							autocomplete="off"
						></v-text-field>

						<div class="new_login_head">업종</div>
						<v-text-field
							hideDetails
							:autofocus="false"
							class="txtLogin1_t"
							outlined
							type="text"
							maxlength="255"
							dense
							v-model="siginup.companyBusiness"
							autocomplete="off"
						></v-text-field>

						<div class="new_login_head">업태</div>
						<v-text-field
							hideDetails
							:autofocus="false"
							class="txtLogin1_t"
							outlined
							type="text"
							maxlength="255"
							dense
							v-model="siginup.companyType"
							autocomplete="off"
						></v-text-field>

						<div class="new_login_head">서비스 사용인원</div>
						<v-text-field
							hideDetails
							:autofocus="false"
							class="txtLogin1_t"
							outlined
							maxlength="255"
							dense
							v-model="siginup.userNumber"
							autocomplete="off"
							type="number"
						></v-text-field>

						<!-- </div> -->
					</v-flex>
					<!-- 오른쪽 필드 -->
					<v-flex xs6 class="pl-12">
						<div class="signUp_input_group">
							SUBSCRIBER INFROMATION
						</div>

						<div class="new_login_head">이름</div>
						<v-text-field
							hideDetails
							:error-messages="iderrorMessages"
							:autofocus="false"
							class="txtLogin1_t mb-2"
							outlined
							maxlength="255"
							flat
							dense
							v-model="siginup.name"
							autocomplete="off"
						></v-text-field>
						<div class="new_login_head">휴대전화</div>
						<div class="display_flex">
							<v-text-field
								:readonly="sendActive"
								hideDetails
								:autofocus="false"
								class="txtLogin1_t"
								outlined
								type="text"
								maxlength="13"
								dense
								@keyup="phoneCheck(siginup.phone)"
								v-model="siginup.phone"
								autocomplete="off"
							></v-text-field>
							<v-btn elevation="0" height="40" width="140" class="ml-4" dark color="admin_blue" @click="createSendMessage()">
								<span style="	font-weight: bold;"> 인증번호 {{ sendActive ? '재' : '' }}발송 </span>
							</v-btn>
						</div>
						<div class="new_login_head">인증번호</div>
						<div class="display_flex">
							<v-text-field
								hideDetails
								:autofocus="false"
								class="txtLogin1_t"
								outlined
								type="text"
								maxlength="13"
								dense
								v-model="siginup.authNumber"
								autocomplete="off"
							></v-text-field>
							<v-btn
								:disabled="authButton"
								elevation="0"
								height="40"
								width="140"
								class="login_btn2 ml-4"
								@click="checkAuthNumber()"
								:dark="!authButton"
								color="admin_blue"
							>
								<span style="color:white;	font-weight: bold;"> 인증번호 확인 </span>
							</v-btn>
						</div>
						<div class="signUp_input_group mt-9">
							SECURITY
						</div>
						<div class="new_login_head">이메일</div>
						<v-text-field
							hideDetails
							:autofocus="false"
							class="txtLogin1_t"
							outlined
							type="text"
							maxlength="255"
							dense
							v-model="siginup.email"
							autocomplete="off"
							placeholder="로그인시 사용할 이메일 입력"
						></v-text-field>

						<div class="new_login_head">비밀번호</div>
						<v-text-field
							:append-icon="siginup.pwshow1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
							hideDetails
							:error-messages="iderrorMessages"
							:autofocus="false"
							class="txtLogin1_t"
							:type="siginup.pwshow1 ? 'text' : 'password'"
							outlined
							maxlength="255"
							flat
							dense
							v-model="siginup.password"
							autocomplete="off"
							@click:append="siginup.pwshow1 = !siginup.pwshow1"
							placeholder="Password"
						></v-text-field>
						<div class="new_login_head">비밀번호 확인</div>
						<v-text-field
							:append-icon="siginup.pwshow2 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
							hideDetails
							:error-messages="iderrorMessages"
							:autofocus="false"
							class="txtLogin1_t"
							:type="siginup.pwshow2 ? 'text' : 'password'"
							outlined
							maxlength="255"
							flat
							dense
							v-model="siginup.password_re"
							autocomplete="off"
							@click:append="siginup.pwshow2 = !siginup.pwshow2"
							placeholder="Confirm Password"
						></v-text-field>
						<v-checkbox v-model="siginup.agree" color="admin_blue" hide-details>
							<div slot="label" @click="viewTerm">
								I accept the Terms of Use.
							</div>
						</v-checkbox>
						<v-btn elevation="0" height="48" class=" mt-10" block dark color="admin_blue" @click="register()">
							<span> Sign Up </span>
						</v-btn>
						<!-- </div> -->
					</v-flex>
				</v-layout>
			</v-flex>
		</v-layout>
		<sweet-alert :dialog="sweetDialog_info" />
		<sweet-alert :dialog="sweetDialog_done" @close_active="to_login" />
	</v-container>
</template>

<script>
import { sweetAlert } from '@/components'
export default {
	components: {
		sweetAlert,
	},
	data() {
		return {
			emailDuplicate: null,
			authButton: true,
			sendActive: false,
			siginup: {
				name: '',
				phone: '',
				authNumber: '',
				authNumberCheck: false,
				email: '',
				password: '',
				password_re: '',
				companyName: '',
				companyNumber: '',
				companyPaper: null,
				companyPaperName: '',
				companyAddress: '',
				companyBusiness: '',
				companyType: '',
				userNumber: '',
				pwshow1: false,
				pwshow2: false,
				agree: false,
			},
			registerMode: false,
			pwshow: false,
			loginDatas: {
				email: '',
				password: '',
			},
			// 아이디 에러메세지
			iderrorMessages: '',
			// 패스워드 에러메세지
			pwerrorMessages: '',
			// id,password 데이터
			userid: '',
			password: '',
			save_id: false, // 아이디 저장
			sweetDialog_info: {
				// 저장 불가 팝업
				open: false,
				title: '',
				content: ``,
				buttonType: 'oneBtn',
				saveBtnText: '저장',
				cancelBtnText: '확인',
				modalIcon: 'info',
			},
			sweetDialog_done: {
				// 저장 완료 팝업
				open: false,
				title: '회원가입 완료',
				content: `회원가입이 완료되었습니다.`,
				buttonType: 'oneBtn',
				saveBtnText: '저장',
				cancelBtnText: '확인',
				modalIcon: 'success',
			},
		}
	},
	created() {
		this.$store.dispatch('businesses_register', { id: this.$route.params.business }).then(res => {
			if (!res.business) {
				this.sweetDialog_done.open = true
				this.sweetDialog_done.modalIcon = 'info'
				this.sweetDialog_done.title = '지점 확인 불가'
				this.sweetDialog_done.content = `지점이 존재하지 않습니다. \n 관리자에게 문의하세요`
			}
		})
	},
	methods: {
		async register() {
			let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (!re.test(this.siginup.email)) return alert('정상적인 이메일 형식이 아닙니다.')
			const emailCheck = {
				email: this.siginup.email,
			}

			let duplicate
			await this.$store.dispatch('emailDuplicate', emailCheck).then(res => {
				if (res.emailDuplicate.duplicate) {
					duplicate = true
				}
			})

			if (!this.siginup.name) return alert('이름을 입력해주세요.')
			else if (!this.siginup.phone) return alert('휴대전화를 입력해주세요.')
			else if (!this.siginup.authNumber) return alert('인증번호를 입력해주세요.')
			else if (!this.siginup.email) return alert('이메일을 입력해주세요.')
			else if (!this.siginup.password) return alert('비밀번호를 입력해주세요.')
			else if (!this.siginup.password_re) return alert('비밀번호 확인을 입력해주세요.')
			else if (duplicate) return alert('중복된 이메일이 존재합니다.')
			else if (!this.siginup.companyName) return alert('회사명을 입력해주세요.')
			else if (!this.siginup.companyPaper) return alert('사업자등록증을 첨부해 주세요.')
			else if (!this.siginup.companyAddress) return alert('회사 위치를 입력해주세요.')
			else if (!this.siginup.companyBusiness) return alert('회사 업종을 입력해주세요.')
			else if (!this.siginup.companyType) return alert('회사 업태를 입력해주세요.')
			else if (!this.siginup.userNumber) return alert('서비스 사용인원을 입력해주세요.')
			else if (!this.siginup.agree) return alert('약관에 동의해 주세요.')
			else if (!this.sendActive) return alert('인증번호 요청을 진행해주세요.')
			else if (this.siginup.password.length < 6) return alert('비밀번호는 6자리 이상으로 입력해주세요.')
			else if (this.siginup.password !== this.siginup.password_re) return alert('비밀번호와 비밀번호 확인이 동일하지 않습니다.')

			// this.$store
			// 	.dispatch('upload', { files: this.siginup.companyPaper })
			// 	.then(res => {
			// 		if (res.data.length > 0) {

			let file = null
			this.$store.state.loading = true
			if (this.siginup.companyPaper) {
				await this.$store.dispatch('upload', { files: this.siginup.companyPaper }).then(res => {
					file = res.data[0].id
				})
			}
			const data = {
				role: 1,
				business: this.$route.params.business,
				username: this.siginup.email,
				email: this.siginup.email,
				password: this.siginup.password,
				phone: this.siginup.phone,
				name: this.siginup.name,
				companyName: this.siginup.companyName,
				// companyNumber: this.siginup.companyNumber,
				companyPaper: file,
				authNumber: Number(this.siginup.authNumber),
				confirmed: true,
				companyAddress: this.siginup.companyAddress,
				companyBusiness: this.siginup.companyBusiness,
				companyType: this.siginup.companyType,
				userNumber: this.siginup.userNumber,
			}

			await this.$store
				.dispatch('register', data)
				.then(() => {
					this.sweetDialog_done.open = true
					this.sweetDialog_done.modalIcon = 'success'
					this.sweetDialog_done.title = '회원가입 완료'
					this.sweetDialog_done.content = `회원가입이 완료되었습니다.`
					this.$store.state.loading = false
				})
				.catch(err => {
					alert('회원가입 도중 오류가 발생하였습니다. 관리자에게 문의하세요.')
					this.$store.state.loading = false
					console.log({ err })
				})
			// } else return alert('사업자등록증 업로드중 오류가 발생하였습니다. 다시시도해 주세요.')
			// })
			// .catch(err => {
			// 	console.log({ err })
			// })
		},
		viewTerm() {},
		fileUploadPaper(val) {
			this.siginup.companyPaper = val.target.files[0]
			this.siginup.companyPaperName = val.target.files[0].name
		},
		emailDuplicateAction() {
			let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (!re.test(this.siginup.email)) return alert('정상적인 이메일 형식이 아닙니다.')
			const data = {
				email: this.siginup.email,
			}
			this.$store.dispatch('emailDuplicate', data).then(res => {
				if (res.emailDuplicate.duplicate) alert('중복된 이메일이 존재합니다.'), (this.emailDuplicate = true)
				else alert('이메일이 인증되었습니다.'), (this.emailDuplicate = false)
			})
		},
		checkAuthNumber() {
			const data = {
				receiver: this.siginup.phone.replace(/-/g, ''),
				authcode: Number(this.siginup.authNumber),
				created_at_gte: this.$moment().subtract(1, 'h')._d,
			}
			this.$store
				.dispatch('sendSms', data)
				.then(res => {
					if (res.sendSms.length > 0) {
						this.siginup.authNumberCheck = true
						return alert('인증번호가 확인 되었습니다.')
					} else return alert('인증번호가 틀렸습니다.')
				})
				.catch(err => {
					console.log({ err })
				})
		},
		createSendMessage() {
			if (this.siginup.phone.replace(/-/g, '').length < 10) return alert('정상적인 휴대전화번호가 아닙니다.')
			const data = {
				receiver: this.siginup.phone.replace(/-/g, ''),
			}
			this.$store
				.dispatch('createSendSm', data)
				.then(() => {
					this.siginup.authNumberCheck = false
					this.authButton = false
					this.sendActive = true

					this.sweetDialog_info.modalIcon = 'success'
					this.sweetDialog_info.open = true
					this.sweetDialog_info.title = '인증번호 발송 완료'
					this.sweetDialog_info.content = '인증번호가 발송되었습니다'
				})
				.catch(err => {
					console.log({ err })
				})
		},
		businessNumCheck(item) {
			//사업지 번호 체크
			let value = item.replace(/[^0-9.]/g, '').replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')

			this.siginup.companyNumber = value
		},
		phoneCheck(item) {
			//전화번호 체크
			let value = item
				.replace(/[^0-9.]/g, '')
				.replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, '$1-$2-$3')
				.replace('--', '-')
			this.siginup.phone = value
		},
		clickUpload() {
			document.getElementById(`company_upload`).click()
		},

		fileUploadChange(val) {
			if (val.target.files[0].size / 1024 > 500) {
				this.siginup.companyPaper = null
				this.siginup.companyPaperName = ''

				this.sweetDialog_info.modalIcon = 'info'
				this.sweetDialog_info.open = true
				this.sweetDialog_info.title = '이미지 업로드 불가'
				this.sweetDialog_info.content = '500kb 이하의 이미지를 업로드해주세요.'
			} else {
				this.siginup.companyPaper = val.target.files[0]

				this.siginup.companyPaperName = val.target.files[0].name
			}
		},
		to_login() {
			this.$router.push({
				name: 'adminLogin',
			})
		},
	},
}
</script>
<style lang="scss">
.new_login_head {
	font-size: 14px;
	width: 120px;
	height: 40px;
	display: flex;
	align-items: center;
	text-align: start;
}
</style>
