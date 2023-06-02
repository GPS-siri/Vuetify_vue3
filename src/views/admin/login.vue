<template>
	<v-container class="login-container">
		<!-- 로그인 화면 로고 -->
		<v-layout class="login-layout" wrap justify-center v-if="!registerMode">
			<v-layout class="login_background_t" flex-wrap justify-center>
				<v-flex xs6>
					<div>
						<v-img height="100vh" src="@/assets/images/image/pick_here_admin_login.png"></v-img>
					</div>
				</v-flex>
				<v-flex md6 xs12>
					<v-layout style="height:100vh">
						<v-layout style="width:320px; padding:0px 10px;" wrap align-center justify-center>
							<div>
								<div class="login-text">Log In</div>
								<div class="login-text-sub mb-11">로그인</div>
								<div class="text-center" style="margin: 0 auto; width:320px;">
									<!-- 아이디 -->
									<div class="mb-2 login-text-name" style="text-align:start">이메일</div>
									<v-text-field
										:error-messages="iderrorMessages"
										:autofocus="false"
										class="txtLogin1_t"
										placeholder="Email"
										outlined
										maxlength="255"
										flat
										v-model="userid"
										@keydown.enter="login()"
										autocomplete="off"
										dense
									></v-text-field>
									<!-- 비밀번호 -->
									<div class="mb-2 login-text-name" style="text-align:start">비밀번호</div>
									<v-text-field
										:append-icon="pwshow ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
										:type="pwshow ? 'text' : 'password'"
										:error-messages="pwerrorMessages"
										:autofocus="false"
										class="txtLogin1_t"
										outlined
										placeholder="Password"
										maxlength="255"
										v-model="password"
										@keydown.enter="login()"
										autocomplete="off"
										@click:append="pwshow = !pwshow"
										dense
									></v-text-field>
									<!-- 로그인 버튼 -->
									<v-checkbox class="mt-1" color="#633efd" label="아이디 저장" v-model="save_id"></v-checkbox>

									<v-btn elevation="0" height="40" class="loginButton_admin" block color="#633efd" @click="login()">
										<span style="color:white;	font-weight: bold;"> SIGN IN </span>
									</v-btn>

									<!-- <v-btn elevation="0" height="48" class="loginButton mt-7" block color="#F6F2E9" @click="registerModeChange()">
										<v-icon class="mr-4">mdi-email-outline</v-icon>
										<span> Sign up with EMAIL </span>
									</v-btn> -->
								</div>
							</div>
						</v-layout>
					</v-layout>
				</v-flex>
			</v-layout>
		</v-layout>
	</v-container>
</template>

<script>
export default {
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
		}
	},
	methods: {
		async register() {
			if (!this.siginup.name) return alert('이름을 입력해주세요.')
			else if (!this.siginup.phone) return alert('휴대전화를 입력해주세요.')
			else if (!this.siginup.authNumber) return alert('인증번호를 입력해주세요.')
			else if (!this.siginup.email) return alert('이메일을 입력해주세요.')
			else if (!this.siginup.password) return alert('비밀번호를 입력해주세요.')
			else if (!this.siginup.password_re) return alert('비밀번호 확인을 입력해주세요.')
			// else if (!this.siginup.companyName) return alert('회사명을 입력해주세요.')
			// else if (!this.siginup.companyNumber) return alert('사업자등록번호를 입력해주세요.')
			// else if (!this.siginup.companyPaper) return alert('사업자등록증을 첨부해 주세요.')
			else if (!this.siginup.agree) return alert('약관에 동의해 주세요.')
			else if (this.emailDuplicate === null) return alert('이메일 중복확인을 해주세요.')
			else if (this.emailDuplicate) return alert('중복된 이메일입니다.')
			else if (!this.sendActive) return alert('인증번호 요청을 진행해주세요.')
			else if (this.siginup.password.length < 6) return alert('비밀번호는 6자리 이상으로 입력해주세요.')
			else if (this.siginup.password !== this.siginup.password_re) return alert('비밀번호와 비밀번호 확인이 동일하지 않습니다.')

			// this.$store
			// 	.dispatch('upload', { files: this.siginup.companyPaper })
			// 	.then(res => {
			// 		if (res.data.length > 0) {

			let business = {}
			await this.$store.dispatch('businesses_register').then(res => {
				business = res.businesses[0]
			})

			const data = {
				role: 1,
				business: business.id,
				username: this.siginup.email,
				email: this.siginup.email,
				password: this.siginup.password,
				phone: this.siginup.phone,
				name: this.siginup.name,
				// companyName: this.siginup.companyName,
				// companyNumber: this.siginup.companyNumber,
				// companyPaper: res.data[0].id,
				authNumber: Number(this.siginup.authNumber),
				confirmed: false,
			}

			await this.$store
				.dispatch('register', data)
				.then(() => {
					this.registerMode = false
					this.authButton = true
					this.sendActive = false
					this.siginup = {
						name: '',
						phone: '',
						authNumber: '',
						email: '',
						password: '',
						password_re: '',
						companyName: '',
						companyNumber: '',
						companyPaper: null,
						companyPaperName: '',
						pwshow1: false,
						pwshow2: false,
						agree: false,
					}
				})
				.catch(err => {
					alert('회원가입 도중 오류가 발생하였습니다. 관리자에게 문의하세요.')
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
			document.getElementById(`companyPaper_file_upload`).click()
		},
		registerModeChange() {
			this.registerMode = !this.registerMode
		},
		updateEntities() {
			this.$store.dispatch('getEntities').then(res => {
				res.entities.forEach(el => {
					const data = {
						id: el.id,
						groupcode: 'fb83c66418',
					}
					this.$store.dispatch('updateEntity', data).then(() => {})
				})
			})
		},
		updateAnswerCard() {
			this.$store.dispatch('answerCards').then(res => {
				res.answerCards.forEach(el => {
					const data = {
						id: el.id,
						groupcode: 'fb83c66418',
						chatbotCode: 'a9hf9ai2f9',
						chatType: 'btn',
					}
					this.$store.dispatch('updateAnswerCard', data).then(() => {})
				})
			})
		},
		login() {
			if (!this.userid) {
				this.iderrorMessages = 'Please enter your EMAIL.'
				if (!this.password) {
					this.pwerrorMessages = 'Please enter your PASSWORD.'
				} else {
					this.pwerrorMessages = ''
				}
				return
			} else if (!this.password) {
				this.pwerrorMessages = 'Please enter your PASSWORD.'
				return
			} else {
				const data = {
					identifier: this.userid,
					password: this.password,
				}
				this.$store
					.dispatch('login', data)
					.then(res => {
						if (res.user.role.name === 'superAdmin') {
							this.$router.push({ name: 'dashBoard' })
						} else if (res.user.role.name === 'Authenticated' && res.user.confirmed) {
							this.$router.push({ name: 'dashBoard' })
						} else if (res.user.role.name === 'Authenticated' && !res.user.confirmed) {
							alert('관리자의 승인이 필요합니다.')
						} else {
							alert('어드민 유저만 로그인이 가능합니다.')
						}
					})
					.catch(() => {
						this.iderrorMessages = 'Your ID or Password is incorrect.'
						this.password.errorMessage = 'Your ID or Password is incorrect.'
					})
			}
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
.login_btn2.theme--light.v-btn.v-btn--has-bg {
	border-radius: 20px;
}
.login_btn3.theme--light.v-btn.v-btn--has-bg {
	background-color: white;
	border: 1px solid #7d7d7d;
}
</style>
