<template>
	<div>
		<qrcode-stream
			:key="'qr_reader'"
			:track="selected.value"
			:torch="torchActive"
			@init="logErrors"
			@decode="onDecode"
			:camera="camera"
			class="qrReader"
		>
			<!-- 상단 메뉴 -->
			<v-layout :class="$vuetify.breakpoint.xs ? 'qrHeadxsEnter' : 'qrHeadEnter'" :style="`background-color:${$store.state.primary2}`">
				<v-icon :size="$vuetify.breakpoint.smAndDown ? '7vmax' : '3.5vmax'" color="white" class="mr-5">
					mdi-qrcode-scan
				</v-icon>
				<v-flex :class="$vuetify.breakpoint.smAndDown ? 'qrTitlexsEnter' : 'qrTitleEnter'">
					<div>
						출/퇴근 등록
						<span :class="$vuetify.breakpoint.smAndDown ? 'qrTitleInfoxsEnter' : 'qrTitleInfoEnter'"
							>(출/퇴근 등록을 위하여 QR코드를 스캔해주세요.)</span
						>
					</div></v-flex
				>

				<v-btn class="hideBtn" id="hiddenBtn" @click="hides"></v-btn>
			</v-layout>

			<!-- qr 인증박스 -->
			<v-layout :class="$vuetify.breakpoint.xs ? 'qrMiddlexs' : 'qrMiddle'" align-center justify-center>
				<div :class="nowWidth">
					<v-layout style="justify-content: space-between; height:50%">
						<div
							style="border-top:7px #F3C82C solid; border-left:7px #F3C82C solid; border-radius:10px 0px 0px 0px; height:40%; width:20%"
						></div>
						<div
							style="border-top:7px #F3C82C solid; border-right:7px #F3C82C solid; border-radius:0px 10px 0px 0px; height:40%; width:20%"
						></div>
					</v-layout>
					<v-layout style="justify-content: space-between; height:50%" align-end>
						<div
							style="border-bottom:7px #F3C82C solid; border-left:7px #F3C82C solid; border-radius:0px 0px 0px 10px; height:40%; width:20%"
						></div>
						<div
							style="border-bottom:7px #F3C82C solid; border-right:7px #F3C82C solid; border-radius: 0px 0px 10px 0px; height:40%; width:20%"
						></div>
					</v-layout>
				</div>
			</v-layout>
			<!-- 촬영 버튼 -->
			<v-btn
				block
				dark
				height="7%"
				class="qrCapture"
				btn_icon="mdi-camera-flip-outline"
				@click="switchCamera"
				:style="`background-color:${$store.state.primary2}; position:absolute; bottom:0px`"
			>
				<v-icon color="white" size="40px">
					mdi-camera-flip-outline
				</v-icon>
			</v-btn>

			<!-- 출/퇴근 등록 완료 -->
			<v-dialog v-model="greetdialog" width="80%" max-width="500px" persistent>
				<v-card class="greetCard">
					<v-layout>
						<!-- <div> -->
						<v-icon color="#7EADEC" size="60px" class="mr-5" style="align-items: self-start;">
							mdi-check
						</v-icon>

						<!-- </div> -->
						<div class="greetTitle">
							{{ gotowork_type === '출근' ? '출근' : '퇴근' }} 등록 완료
							<div class="greetText">
								<span class="greet_name"> {{ qr_name }} </span> 님

								<br />
								정상 {{ gotowork_type === '출근' ? '출근' : '퇴근' }} 등록 되었습니다.
							</div>
						</div>
					</v-layout>
				</v-card>
			</v-dialog>

			<!-- 퇴근 등록 불가 -->
			<v-dialog v-model="denydialog" width="80%" max-width="500px" persistent>
				<v-card class="denyCard">
					<v-layout>
						<!-- <div> -->
						<v-icon color="#F55555" size="60px" class="mr-5" style="align-items: self-start;">
							mdi-exclamation-thick
						</v-icon>

						<!-- </div> -->
						<div class="denyTitle">
							퇴근 등록 불가
							<div class="denyText">
								{{ deny_reason }}
							</div>
						</div>
					</v-layout>
				</v-card>
			</v-dialog>
		</qrcode-stream>
	</div>
</template>

<script>
import { QrcodeStream } from 'vue-qrcode-reader'
export default {
	components: {
		QrcodeStream,
	},
	data() {
		const options = [
			{ text: 'nothing (default)', value: undefined },
			{ text: 'outline', value: this.paintOutline },
			{ text: 'centered text', value: this.paintCenterText },
			{ text: 'bounding box', value: this.paintBoundingBox },
		]

		const selected = options[1]

		return {
			date: this.$moment(),
			greetdialog: false,
			denydialog: false,
			selected,
			options,

			// 배포시에는 front 로 변경 필요  // 맥에서는 auto
			camera: 'front',
			//카메라 유무 체크
			noRearCamera: false,
			noFrontCamera: false,
			// flash light
			torchActive: false,
			torchNotSupported: false,

			windowWidth: window.innerWidth,
			windowHeight: window.innerHeight,

			qr_name: '', // 출/퇴근 등록자 이름
			gotowork_type: '', // 출근인지 퇴근인지
			deny_reason: '', // 거절 이유
		}
	},
	computed: {
		nowWidth() {
			window.addEventListener('resize', () => {
				this.windowWidth = window.innerWidth
			})
			window.addEventListener('resize', () => {
				this.windowHeight = window.innerHeight
			})
			if (this.windowWidth <= 375) {
				return 'middleSquareEnterxxxs'
			} else if (this.windowWidth <= 375) {
				return 'middleSquareEnterxxs'
			} else if (this.windowWidth <= 425) {
				return 'middleSquareEnterxs'
			} else if (this.windowWidth <= 768) {
				return 'middleSquareEntersm'
			} else if (this.windowWidth <= 1024) {
				return 'middleSquareEntermd'
			} else {
				return 'middleSquareEnter'
			}
		},
		nowHeight() {
			window.addEventListener('resize', () => {
				this.windowHeight = window.innerHeight
			})
			return this.windowHeight
		},
	},
	created() {},
	methods: {
		paintOutline(detectedCodes, ctx) {
			for (const detectedCode of detectedCodes) {
				const [firstPoint, ...otherPoints] = detectedCode.cornerPoints

				ctx.strokeStyle = 'yellow'

				ctx.beginPath()
				ctx.moveTo(firstPoint.x, firstPoint.y)
				for (const { x, y } of otherPoints) {
					ctx.lineTo(x, y)
				}
				ctx.lineTo(firstPoint.x, firstPoint.y)
				ctx.closePath()
				ctx.stroke()
			}
		},

		paintBoundingBox(detectedCodes, ctx) {
			for (const detectedCode of detectedCodes) {
				const {
					boundingBox: { x, y, width, height },
				} = detectedCode

				ctx.lineWidth = 2
				ctx.strokeStyle = '#007bff'
				ctx.strokeRect(x, y, width, height)
			}
		},

		paintCenterText(detectedCodes, ctx) {
			for (const detectedCode of detectedCodes) {
				const { boundingBox, rawValue } = detectedCode

				const centerX = boundingBox.x + boundingBox.width / 2
				const centerY = boundingBox.y + boundingBox.height / 2

				const fontSize = Math.max(12, (50 * boundingBox.width) / ctx.canvas.width)

				ctx.font = `bold ${fontSize}px sans-serif`
				ctx.textAlign = 'center'

				ctx.lineWidth = 3
				ctx.strokeStyle = '#35495e'
				ctx.strokeText(detectedCode.rawValue, centerX, centerY)

				ctx.fillStyle = '#5cb984'
				ctx.fillText(rawValue, centerX, centerY)
			}
		},

		switchCamera() {
			//카메라 변경
			switch (this.camera) {
				case 'front':
					this.camera = 'rear'
					break
				case 'rear':
					this.camera = 'front'
					break
			}
		},
		async logErrors(promise) {
			try {
				//카메라 변경
				await promise
			} catch (error) {
				const triedFrontCamera = this.camera === 'front'
				const triedRearCamera = this.camera === 'rear'

				const cameraMissingError = error.name === 'OverconstrainedError'

				if (triedRearCamera && cameraMissingError) {
					this.noRearCamera = true
				}

				if (triedFrontCamera && cameraMissingError) {
					this.noFrontCamera = true
				}

				console.error(error)
			}
			try {
				//플래시라이트 on off
				const { capabilities } = await promise

				this.torchNotSupported = !capabilities.torch
			} catch (error) {
				console.error(error)
			}
			try {
				//qr 읽기
				await promise
			} catch (e) {
				console.error(e)
			}
		},
		async onDecode(content) {
			// 큐알 확인
			document.getElementById('hiddenBtn').click()

			let nowCamera = this.camera
			this.pause()

			// 출근 확인 및 출/퇴근 등록
			await this.gotoWorks(content)

			// 카메라 재가동 및 팝업 사라지기 까지 시간 간격
			await this.timeout(1000)
			this.camera = nowCamera
			await this.timeout(1000)

			this.greetdialog = false
			this.denydialog = false
		},

		unpause() {
			this.camera = 'auto'
		},
		pause() {
			this.camera = 'off'
		},

		timeout(ms) {
			return new Promise(resolve => {
				window.setTimeout(resolve, ms)
			})
		},

		hides() {},
		async gotoWorks(id) {
			// 오늘 날짜로 출근, 퇴근 기록 확인
			const data = {
				business: this.$route.params.id,
				date: this.$moment(this.date).format('YYYY-MM-DD'),
				users_permissions_user: id,
				status_in: ['startWork', 'endWork'],
			}
			await this.$store
				.dispatch('gotoWork', data)
				.then(async res => {
					let gotoworks = res.gotoworks
					if (gotoworks.length > 0) {
						// 오늘 출/퇴근 이력 있는 경우
						// alert(res.gotoworks[0].status)
						// alert(res.gotoworks[0].users_permissions_user.name)
						if (gotoworks[0].status === 'endWork') {
							// 퇴근 이력인 경우
							// 이미 퇴근 처리
							this.denydialog = true
							this.deny_reason = '이미 퇴근 처리 되었습니다.'
						} else {
							// 출근 이력인 경우

							this.qr_name = gotoworks[0].users_permissions_user.name

							// 출근 5분 지났나 확인
							let diff = this.$moment().diff(this.$moment(gotoworks[0].startWork), 'minutes')

							if (diff < 5) {
								// 출근 5분 안지나면 퇴근 불가
								this.denydialog = true
								this.deny_reason = '출근 후 5분이 지난 후 퇴근 등록이 가능합니다'
							} else {
								// 출근 5분 안지나서 퇴근 가능
								await this.leaveWorkStatus(gotoworks[0].id)
							}
						}
					} else {
						// 출근 등록
						await this.createGotoworkAction(id)
					}
				})
				.catch(err => {
					console.log({ err })
				})
		},

		async createGotoworkAction(id) {
			// 출근 등록
			const data = {
				business: this.$route.params.id,
				date: this.$moment(this.date).format('YYYY-MM-DD'),
				users_permissions_user: id,
				startWork: this.$moment(),
				status: 'startWork',
			}

			await this.$store
				.dispatch('createGotowork', data)
				.then(res => {
					this.greetdialog = true
					this.qr_name = res.createGotowork.gotowork.users_permissions_user.name
					this.gotowork_type = '출근'
				})
				.catch(err => {
					console.log({ err })
				})
		},
		async leaveWorkStatus(id) {
			// 퇴근 등록
			const data = {
				id: id,
				endWork: this.$moment(this.date),
				status: 'endWork',
			}

			await this.$store
				.dispatch('updateGotowork', data)
				.then(res => {
					this.greetdialog = true
					this.qr_name = res.updateGotowork.gotowork.users_permissions_user.name
					this.gotowork_type = '퇴근'
				})
				.catch(err => {
					console.log({ err })
				})
		},
	},
}
</script>

<style lang="scss">
.qrReader {
	height: 100vh !important;
}
/// 상단 메뉴 css
.qrHeadEnter {
	padding: 2vh 0px 2vh 2vw;
}
.qrHeadxsEnter {
	padding: 2vh 0px 2vh 2vw;
}
// 상단 사업지명
.qrTitleEnter {
	font-size: 1.5vmax;
	font-weight: bold;
	color: white;
	border-radius: 10px;
	padding: 0.2vw 0px 0px 1vw;
}

.qrTitlexsEnter {
	// font-size: 3vh;
	font-size: 3vmax;
	font-weight: bold;
	color: white;
}
.qrTitleInfoEnter {
	font-size: 1.3vmax;
	font-weight: 300;
	color: white;
}
.qrTitleInfoxsEnter {
	font-size: 2vmax;
	font-weight: 300;
	color: white;
}
// 상단 버튼

/// 인증완료 메세지 div
.confirmation {
	z-index: 1;
	position: inherit;
	width: 100%;
	text-align: -webkit-center;
	padding-top: 4vh;
}
/// 인증완료 메세지 카드
.confirmationCard {
	opacity: 0.7;
	width: 25vh;
	font-size: 2vh;
	padding: 10px;
	border-radius: 10px !important;
}
.DenialCard {
	color: white !important;
	opacity: 0.7;
	width: 40vh;
	font-size: 2vh;
	padding: 10px;
	border-radius: 10px !important;
}
/// qr 인식 layout
.qrMiddle {
	z-index: 2;
	height: 84%;
}
.qrMiddlexs {
	z-index: 2;
	height: 80%;
}
// qr 인식 박스
.middleSquareEnter {
	// border: 4px dashed yellow;
	width: 30%;
	height: 69.5%;
	border-radius: 10px;
}

.middleSquareEntermd {
	// border: 4px dashed yellow;
	width: 48vw;
	height: 55vh;
}
.middleSquareEntersm {
	// border: 4px dashed yellow;
	width: 58vw;
	height: 50vh;
}
.middleSquareEnterxs {
	// border: 4px dashed yellow;
	width: 63vw;
	height: 35vh;
}
.middleSquareEnterxxs {
	// border: 4px dashed yellow;
	width: 71vw;
	height: 35vh;
}
.middleSquareEnterxxxs {
	// border: 4px dashed yellow;
	width: 71vw;
	height: 35vh;
}
.hideBtn {
	display: none;
}
.greetCard {
	padding: 20px;
	border-radius: 20px !important;
	border-bottom: 15px solid #7eadec !important;
}
.greetTitle {
	color: #7eadec;
	font-weight: bold;
	font-size: 25px;
}
.greetText {
	color: black;
	font-weight: 500;
	font-size: 18px;
}
.greet_name {
	font-size: 25px;
	font-weight: bold;
}
.denyCard {
	padding: 20px;
	border-radius: 20px !important;
	border-bottom: 15px solid #f55555 !important;
}
.denyTitle {
	color: #f55555;
	font-weight: bold;
	font-size: 25px;
}
.denyText {
	color: black;
	font-weight: 500;
	font-size: 20px;
}
</style>
