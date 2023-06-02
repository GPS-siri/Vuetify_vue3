<template>
	<div class="pa-4">
		<v-layout wrap>
			<v-flex>
				<btn
					v-if="addCount > 0"
					:btn="addBtn"
					:style="`background-color:${$store.state.PointColor2}`"
					:btn_txt="addBtn.btn_txt"
					@click="addClick"
				></btn>
			</v-flex>
			<v-spacer></v-spacer>
			<div style="width:30vw">
				<select-box :sel="selevent" @change="eventChange"></select-box>
			</div>
		</v-layout>
		<v-layout class="mt-4">
			<v-flex lg5 xs12>
				<span class="title_font">
					| 이벤트 정보
				</span>
				<v-layout wrap class="pa-4 title_font">
					<v-col v-for="(left, index) in leftInfoTop" :key="index" :cols="'12'" class="pa-0 ma-0" v-show="!left.show">
						<v-flex lg12 xs12>
							<v-layout class="my-1" wrap>
								<v-flex lg3 xs12>
									<div class="pt-2">
										{{ left.title }}
										<v-tooltip color="transparent" bottom v-if="left.tooltip">
											<template v-slot:activator="{ on, attrs }">
												<v-icon x-small color="primary" dark v-bind="attrs" v-on="on" class="ml-1">
													mdi-help-circle-outline
												</v-icon>
											</template>
											<span>
												<v-img width="70vh" :src="left.tooltip.url"></v-img>
											</span>
										</v-tooltip>
									</div>
								</v-flex>
								<v-flex v-if="left.txtfield" lg9 xs12>
									<txtField v-model="left.value" :txtField="left.txtfield"></txtField>
								</v-flex>
								<v-flex v-else-if="left.sel">
									<select-box :sel="left.sel" :disable="left.sel.disable" @change="leftInfoSelectChange(index)"></select-box>
								</v-flex>
								<v-flex v-else-if="left.picker">
									<DatepickerDialog
										:picker="left.picker"
										:disable="left.picker.disable"
										:allowed_dates="allowed_dates_open"
										@change="changeStartDate(index)"
									/>
									<v-dialog v-model="left.timePicker" persistent width="290px">
										<v-time-picker v-model="left.picker.date2" full-width format="24hr" :color="$store.state.PointColor1">
											<v-spacer></v-spacer>
											<v-btn
												text
												:disabled="left.picker.date2 === undefined"
												:color="$store.state.PointColor1"
												@click="changeStartTime(index, left.picker.date2)"
											>
												OK
											</v-btn>
										</v-time-picker>
									</v-dialog>
								</v-flex>
								<v-flex v-else-if="left.area && left.title === '참여 허용된 전화번호'" xs9>
									<v-layout align-center class="" wrap>
										<v-flex class="mr-2" style="align-self: baseline;" xs9>
											<v-textarea
												v-model="left.value"
												outlined
												:color="$store.state.PointColor1"
												:no-resize="left.area.noresize"
												:readonly="left.area.readonly"
											></v-textarea>
										</v-flex>
										<v-flex lg2 md2 sm2 xs12 style="align-self: baseline;">
											<v-btn class="mr-2" @click="previewClick()" x-small>preview</v-btn>
											<v-btn :disabled="left.csvImport" @click="csvImportClick(left)" x-small>csv Import</v-btn>
											<v-btn @click="csvDownloadClick()" x-small>csv Download</v-btn>
										</v-flex>
									</v-layout>

									<VueCsvImport
										style="display:none;"
										id="csvimport"
										inputClass="inputclasstest"
										v-model="parseCsv"
										:map-fields="mapfields"
										:autoMatchFields="true"
										:autoMatchIgnoreCase="true"
									>
									</VueCsvImport>
								</v-flex>
								<v-flex v-else-if="left.area" xs9>
									<v-textarea
										v-model="left.value"
										outlined
										hideDetails
										:color="$store.state.PointColor1"
										:no-resize="left.area.noresize"
										:readonly="left.area.readonly"
									></v-textarea>
								</v-flex>
								<v-flex v-else-if="left.fileinput" lg9 xs12>
									<v-layout wrap align-center>
										<v-layout>
											<txtField v-model="left.value" :txtField="left.fileinput" style="width:100%"></txtField>
											<div @click="clickFileUploadImageTop(index)" class="ml-2">
												<btn v-if="!$vuetify.breakpoint.xs" :btn="left.UploadBtn" btn_txt="File Upload" @click="clickinput"></btn>
												<btn v-else :btn="left.UploadBtn" btn_icon="mdi-link-variant" @click="clickinput"></btn>
											</div>
										</v-layout>
										<input type="file" style="display:none;" id="file_upload_Top_Event" @change="fileUploadTop" accept="image/*" />
									</v-layout>
								</v-flex>
								<v-flex lg9 xs12 v-else-if="left.colorPicker" class="">
									<v-layout>
										<v-flex>
											<v-layout wrap align-center>
												<v-layout>
													<v-flex xs12>
														<colorPicker :color_picker="left.colorPicker" :value="left.value"></colorPicker>
													</v-flex>
												</v-layout>
											</v-layout>
										</v-flex>
									</v-layout>
								</v-flex>
								<v-flex lg9 xs12 v-else-if="left.combobox">
									<v-layout>
										<v-flex>
											<v-layout wrap align-center>
												<v-flex xs12>
													<v-combobox
														:color="$store.state.PointColor1"
														v-model="left.value"
														hide-details
														multiple
														small-chips
														outlined
													></v-combobox>
												</v-flex>
											</v-layout>
										</v-flex>
									</v-layout>
								</v-flex>
								<v-flex lg9 xs12 v-else-if="left.checkbox">
									<v-layout wrap align-center>
										<v-flex xs12>
											<v-checkbox
												class="mt-0 pt-1"
												v-model="left.value"
												:label="left.value ? left.checkbox.trueLabel : left.checkbox.falseLabel"
												:hideDetails="left.checkbox.hideDetail"
												:color="$store.state.PointColor1"
											></v-checkbox>
										</v-flex>
									</v-layout>
								</v-flex>
							</v-layout>
						</v-flex>
					</v-col>
				</v-layout>
				<span class="title_font">
					| 상품 설정
				</span>
				<v-layout class="pa-4" align-center>
					<v-flex lg5 sm12 class="title_font pr-2" v-for="(size, index) in rightSize" :key="index">
						<v-layout align-center>
							<v-flex>
								<div>
									{{ size.title }}
								</div>
							</v-flex>
							<v-flex lg8 sm12 v-if="size.txtfield">
								<txtField v-model="size.value" :txtField="size.txtfield" @enter="addRightSizeList"></txtField>
							</v-flex>
						</v-layout>
					</v-flex>
					<v-flex>
						<btn :btn="bottomBtn2" btn_txt="추가" :style="`background-color:${$store.state.PointColor2}`" @click="addRightSizeList"></btn>
					</v-flex>
				</v-layout>
				<v-layout>
					<datatable :datatable="rightSizeList" :clickDeleteBtn="deleteRightSizeList"></datatable>
				</v-layout>
			</v-flex>
			<v-flex lg7 xs12>
				<span class="title_font">
					| 이벤트 현황
				</span>
				<v-layout>
					<datatable :datatable="dashBoardTable"></datatable>
				</v-layout>
				<v-layout class="title_font" align-center>
					| 참여자 확인
					<v-spacer></v-spacer>
					<btn
						v-show="selevent.value !== ''"
						class="mr-2"
						:btn="hideDisagree"
						@click="clickExport('join')"
						:style="`background-color:${$store.state.PointColor2}`"
						btn_txt="Excel"
					/>
					<txtField v-model="search" :txtField="searchTextFiled" />
				</v-layout>
				<v-layout>
					<datatable :datatable="joinList" :search="search"></datatable>
				</v-layout>
				<v-layout class="title_font" align-center>
					| 당첨자 확인
					<v-spacer></v-spacer>
					<btn
						v-show="selevent.value !== ''"
						class="mr-2"
						:btn="hideDisagree"
						@click="clickExport('winner')"
						:style="`background-color:${$store.state.PointColor2}`"
						btn_txt="Excel"
					/>
					<txtField v-model="searchWinner" :txtField="searchWinnerTextFiled" />
				</v-layout>
				<v-layout>
					<datatable :datatable="winnerList" :search="searchWinner"></datatable>
				</v-layout>
			</v-flex>
		</v-layout>
		<v-layout>
			<v-flex xs12 style="text-align: end;">
				<btn
					:style="`background-color:${$store.state.PointColor2}`"
					:btn="bottomBtn"
					btn_txt="미리보기"
					class="mr-4"
					@click="previewEvent"
				></btn>
				<btn
					v-if="selevent.value !== ''"
					:style="`background-color:${$store.state.PointColor2}`"
					:btn="bottomBtn"
					btn_txt="취소"
					class="mr-4"
					@click="events('reset')"
				></btn>
				<btn
					v-if="selevent.value === '' && addCount > 0"
					:style="`background-color:${$store.state.PointColor2}`"
					:btn="bottomBtn"
					class="mr-4"
					btn_txt="생성하기"
					@click="clickSaveBtn('create')"
				></btn>
				<btn
					v-else-if="selevent.value !== ''"
					:btn="bottomBtn"
					:style="`background-color:${$store.state.PointColor2}`"
					class="mr-4"
					btn_txt="수정하기"
					@click="clickSaveBtn('edit')"
				></btn>
			</v-flex>
		</v-layout>
		<v-dialog v-model="preview" width="50vh">
			<v-card class="px-4">
				<v-card-title class="pa-0">
					csv파일 예시
				</v-card-title>
				<v-img width="50vh" src="../../../assets/images/preview.jpg"> </v-img>
				<v-card-text class="pa-0">
					파일의 형식은 위에 이미지형식과 같게 해주셔야 합니다.
				</v-card-text>
				<v-img width="20vh" src="../../../assets/images/sampleFile.png"> </v-img>
				<v-card-text class="pa-0">
					파일의 확장자 명은 .csv로 해주셔야 합니다.
				</v-card-text>
			</v-card>
		</v-dialog>
		<giftBox :giftBox="giftBox" />
		<download-excel
			class="btn btn-default"
			id="join"
			:data="joinList.items"
			style="display:none"
			:fields="{
				이름: 'name',
				전화번호: 'phone',
				응모일: 'join_at',
				당첨여부: 'joinStatus',
			}"
			type="text/csv;charset=utf8"
			worksheet="My Worksheet"
			:name="leftInfoTop[3].value + '_참여자 리스트' + '.xls'"
		>
		</download-excel>
		<download-excel
			class="btn btn-default"
			id="winner"
			:data="winnerList.items"
			style="display:none"
			:fields="{
				이름: 'name',
				전화번호: 'phone',
				당첨일: 'winner_at',
				당첨상품: 'winnerStatus',
			}"
			type="text/csv;charset=utf8"
			worksheet="My Worksheet"
			:name="leftInfoTop[3].value + '_당첨자 리스트' + '.xls'"
		>
		</download-excel>
		<sweetAlert :dialog="sweetInfo" />
	</div>
</template>

<script>
import { btn, colorPicker, selectBox, DatepickerDialog, txtField, datatable, giftBox, sweetAlert } from '@/components'
import { VueCsvImport } from 'vue-csv-import'
import downloadExcel from 'vue-json-excel'
export default {
	components: {
		downloadExcel,
		colorPicker,
		VueCsvImport,
		btn,
		selectBox,
		DatepickerDialog,
		txtField,
		datatable,
		giftBox,
		sweetAlert,
	},
	methods: {
		clickExport(id) {
			document.getElementById(id).click()
		},
		previewEvent() {
			this.giftBox.dialog = true
			const randomItem = this.randomItem(this.eventsDataSelect.map.filter(x => x.check === false).map(y => y.id))
			const indexItem = this.eventsDataSelect.map
				.filter(x => x.check === false)
				.map(y => y.id)
				.indexOf(randomItem)
			if (this.eventsDataSelect.winnerMessage) {
				this.giftBox.winnerMessage = this.eventsDataSelect.winnerMessage
			} else {
				this.giftBox.winnerMessage = ''
			}
			if (this.eventsDataSelect.joinMessage) {
				this.giftBox.joinMessage = this.eventsDataSelect.joinMessage
			} else {
				this.giftBox.joinMessage = ''
			}
			this.giftBox.product = this.eventsDataSelect.map[indexItem].title
		},
		randomItem(item) {
			return item[Math.floor(Math.random() * item.length)]
		},
		addRightSizeList() {
			if (this.rightSize[0].value === '') {
				alert('상품명을 입력해 주세요.')
			} else if (this.rightSize[1].value === '') {
				if (this.leftInfoTop[0].sel.value === '선착순 참여') {
					alert('선착순 당첨번호를 입력해 주세요.')
				} else {
					alert('당첨자 수를 입력해 주세요.')
				}
			} else {
				if (this.leftInfoTop[0].sel.value === '선착순 참여') {
					if (Number(this.rightSize[1].value) > Number(this.leftInfoTop[6].value)) {
						return alert("'총 이벤트 참여인원' 이상의 번호를 입력 할수 없습니다.")
					}
				}
				if (this.rightSizeList.items.length > 0) {
					const index = this.rightSizeList.items.map(x => x.product).indexOf(this.rightSize[0].value)
					if (index !== -1) {
						return alert('동일한 상품명을 입력할 수 없습니다.')
					}
				}
				this.rightSizeList.items.push({
					product: this.rightSize[0].value,
					winnerNumber: Number(this.rightSize[1].value),
					setEnd: false,
				})
				this.rightSize[0].value = ''
				this.rightSize[1].value = ''
			}
		},
		deleteRightSizeList() {
			const index = this.rightSizeList.items.map(x => x.product).indexOf(this.$store.state.datatableItem.product)
			this.rightSizeList.items.splice(index, 1)
		},

		createEventAws(data) {
			this.$store.dispatch('createEventAws', data).then(() => {})
		},
		updateEventAws(data) {
			this.$store.dispatch('updateEventAws', data).then(() => {})
		},
		changeStartTime(index, data) {
			this.leftInfoTop[index].timePicker = false
			this.leftInfoTop[index].picker.date += ' ' + data
			this.leftInfoTop[index].picker.date2 = data
		},
		csvDownloadClick() {
			var a = document.createElement('a')

			a.href = location.protocol + '//' + location.host + '/sampleCSV.csv'
			a.download = 'sampleCSV.csv'
			a.style.display = 'none'
			document.body.appendChild(a)
			a.click()
		},
		TotalNumber(val) {
			if (val) {
				let number = 0
				val.forEach(element => {
					element.times.forEach(time => {
						number += Number(time.maxCount)
					})
				})
				return number
			} else {
				return 0
			}
		},
		timeTotalNumber(val) {
			if (val) {
				let number = 0
				val.forEach(element => {
					if (element.clock.indexOf(this.selTime.value.substring(0, 3)) > -1) {
						number += Number(element.maxCount)
					}
				})
				return number
			} else {
				return 0
			}
		},
		leftInfoSelectChange(index, type) {
			if (index === 0) {
				if (this.leftInfoTop[index].sel.value === '선착순 참여') {
					this.rightSizeList.headers = [
						{ text: 'No.', value: 'No' },
						{ text: '상품명', value: 'product' },
						{ text: '선착순 당첨번호', value: 'winnerNumber' },
						{ text: '비고', width: '200', sortable: false, align: 'center', value: 'actionReservationManagement' },
					]
					this.rightSize[1].title = '선착순 당첨번호'
					if (type !== 'reset') {
						this.rightSizeList.items = []
					}
					this.leftInfoTop[8].value = ''
					this.leftInfoTop[8].show = true
				} else if (this.leftInfoTop[index].sel.value === '선물상자') {
					this.rightSizeList.headers = [
						{ text: 'No.', value: 'No' },
						{ text: '상품명', value: 'product' },
						{ text: '당첨자 수', value: 'winnerNumber' },
						{ text: '비고', width: '200', sortable: false, align: 'center', value: 'actionReservationManagement' },
					]
					this.rightSize[1].title = '당첨자 수'
					if (type !== 'reset') {
						this.rightSizeList.items = []
					}
					this.leftInfoTop[8].show = false
				}
				this.leftInfoTop[index]
			}
		},
		async fileUpload(file, type) {
			const filedata = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
				file: file,
			}
			await this.$store
				.dispatch('fileUpload', filedata)
				.then(res => {
					if (type === 'eventImg') {
						this.eventImg = res.data.upload.id
					}
				})
				.catch(() => {
					this.$store.state.loading = false
				})
		},
		previewClick() {
			this.preview = true
		},
		changeStartDate(index) {
			if (this.leftInfoTop[1].picker.date === '') {
				this.leftInfoTop[2].picker.disable = true
			} else {
				this.leftInfoTop[2].picker.disable = false
			}
			this.leftInfoTop[index].timePicker = true
		},
		addClick() {
			this.eventImg = null
			this.selevent.value = ''
			this.leftInfoTop[0].sel.value = '선물상자'
			this.leftInfoTop[1].picker.date = ''
			this.leftInfoTop[2].picker.date = ''
			this.leftInfoTop[3].value = ''
			this.leftInfoTop[4].value = ''
			this.leftInfoTop[5].value = ''
			this.leftInfoTop[6].value = ''
			this.leftInfoTop[7].value = '[상품명]'
			this.leftInfoTop[8].value = ''
			this.leftInfoTop[9].sel.value = '운영'
			this.joinList.items = []
			this.winnerList.items = []
			this.dashBoardTable.items = []
			this.rightSizeList.headers = [
				{ text: 'No.', value: 'No' },
				{ text: '상품명', value: 'product' },
				{ text: '당첨자 수', value: 'winnerNumber' },
				{ text: '비고', width: '200', sortable: false, align: 'center', value: 'actionReservationManagement' },
			]
			this.rightSizeList.items = []
		},
		csvImportClick(item) {
			this.sweetInfo.title = '참여 그룹 설정 유의사항'
			this.sweetInfo.content = `전화번호 재업로드는 저장이후에 가능합니다.`
			this.sweetInfo.open = true
			document.getElementsByClassName('form-check-input')[0].click()
			document.getElementsByClassName('inputclasstest')[0].click()
			var interval = setInterval(() => {
				document.getElementsByClassName('btn-primary')[0].click()
				this.$store.state.loading = true
				if (this.parseCsv !== null) {
					clearInterval(interval)
					let idx
					idx = this.leftInfoTop.map(x => x.title).indexOf(item.title)
					this.leftInfoTop[idx].value = JSON.stringify(this.parseCsv)
					let populationIndex = this.leftInfoTop.findIndex(e => e.title === '모집단 선택')
					this.leftInfoTop[populationIndex].sel.value = '선택없음'
					this.$store.state.loading = false
				} else {
					this.$store.state.loading = false
				}
			}, 1000)
		},
		async clickSaveBtn(val) {
			let ok = 0
			const RequiredData = []
			this.leftInfoTop.forEach((element, index) => {
				if (element.required) {
					if (element.sel) {
						if (element.sel.value === '') {
							RequiredData.push(element.title)
						}
					} else if (element.picker) {
						if (element.picker.date === '') {
							RequiredData.push(element.title)
						}
					} else if (!element.value || element.value === '') {
						RequiredData.push(element.title)
					}
				}
				if (index === this.leftInfoTop.length - 1) {
					if (RequiredData.length > 0) {
						ok += 1
						return alert('Required Data : ' + RequiredData.join(', '))
					}
				}
			})
			if (ok === 0) {
				// this.$store.state.loading = true
				if (val === 'create') {
					if (this.selevent.items.indexOf(this.leftInfoTop[3].value) > -1) {
						return alert('동일한 이벤트명이 존재합니다.')
					}
					if (this.leftInfoTop[5].file.name !== '') {
						await this.fileUpload(this.leftInfoTop[5].file, 'eventImg')
					}
					await this.createEvent()
				} else if (val === 'edit') {
					if (this.leftInfoTop[5].file.name !== '') {
						await this.fileUpload(this.leftInfoTop[5].file, 'eventImg')
					}
					await this.updateEvent()
				}
			}
		},
		async createEvent() {
			const map = []
			let winnersNumber = this.rightSizeList.items.map(x => x.winnerNumber)
			for (let index = 0; index < this.leftInfoTop[6].value; index++) {
				if (winnersNumber[winnersNumber.length - 1] === 0) {
					map.push({
						id: index + 1,
						title: '꽝',
						check: false,
					})
				} else {
					let ok = 0
					winnersNumber.forEach((element, num) => {
						if (element > 0 && ok === 0) {
							ok += 1
							winnersNumber[num] -= 1
							return map.push({
								id: index + 1,
								title: this.rightSizeList.items[num].product,
								check: false,
							})
						}
					})
				}
			}
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
				type: this.leftInfoTop[0].sel.value,
				title: this.leftInfoTop[3].value,
				explan: this.leftInfoTop[4].value,
				start: this.$moment(this.leftInfoTop[1].picker.date).add(9, 'hours')._d,
				end: this.$moment(this.leftInfoTop[2].picker.date).add(9, 'hours')._d,
				joinList: [],
				winnerList: [],
				joinNumber: Number(this.leftInfoTop[6].value),
				status: this.leftInfoTop[9].sel.items.indexOf(this.leftInfoTop[9].sel.value) === 0 ? 1 : 99,
				map: map,
				priceList: this.rightSizeList.items,
				winnerMessage: this.leftInfoTop[7].value,
				joinMessage: this.leftInfoTop[8].value,
			}
			if (this.eventImg) {
				data.eventImg = this.eventImg
			}
			data.loginType = 'phone'
			await this.$store
				.dispatch('createEvent', data)
				.then(() => {
					alert('생성 되었습니다.')
					this.$store.state.loading = false
					this.addClick()
					this.events()
				})
				.catch(() => {
					this.$store.state.loading = false
					this.events()
				})
		},
		async updateEvent() {
			const map = []
			let winnersNumber = this.rightSizeList.items.map(x => x.winnerNumber)
			let winnersProduct = this.rightSizeList.items.map(x => x.product)
			this.rightSizeList.items
			this.winnerList.items.forEach(element => {
				const index = winnersProduct.indexOf(element.winnerStatus)
				winnersNumber[index] -= 1
			})
			for (let index = 0; index < this.leftInfoTop[6].value - this.joinList.items.length; index++) {
				if (winnersNumber[winnersNumber.length - 1] === 0) {
					map.push({
						id: index + 1,
						title: '꽝',
						check: false,
					})
				} else {
					let ok = 0
					winnersNumber.forEach((element, num) => {
						if (element > 0 && ok === 0) {
							ok += 1
							winnersNumber[num] -= 1
							return map.push({
								id: index + 1,
								title: this.rightSizeList.items[num].product,
								check: false,
							})
						}
					})
				}
			}
			const data = {
				id: this.eventId,
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
				type: this.leftInfoTop[0].sel.value,
				title: this.leftInfoTop[3].value,
				explan: this.leftInfoTop[4].value,
				start: this.$moment(this.leftInfoTop[1].picker.date)._d,
				end: this.$moment(this.leftInfoTop[2].picker.date)._d,
				joinList: this.joinList.items,
				winnerList: this.winnerList.items,
				joinNumber: this.leftInfoTop[6].value,
				status: this.leftInfoTop[9].sel.items.indexOf(this.leftInfoTop[9].sel.value) === 0 ? 1 : 99,
				map: map,
				priceList: this.rightSizeList.items,
				winnerMessage: this.leftInfoTop[7].value,
				joinMessage: this.leftInfoTop[8].value,
			}
			if (this.eventImg) {
				data.eventImg = this.eventImg
			}
			await this.$store
				.dispatch('updateEvent', data)
				.then(() => {
					alert('수정 되었습니다.')
					this.$store.state.loading = false
				})
				.catch(() => {
					this.$store.state.loading = false
				})
		},
		allowed_dates_open(val) {
			if (this.leftInfoTop[1].picker.date !== '') {
				if (this.$moment(this.leftInfoTop[1].picker.date).format('YYYY-MM-DD') <= val) {
					return val
				}
			} else {
				if (this.$moment().format('YYYY-MM-DD') <= val) {
					return val
				}
			}
		},
		eventChange(val) {
			const index = this.eventsData.map(x => x.title).indexOf(val)
			this.eventId = this.eventsData[index].id
			this.eventsDataSelect = this.eventsData[index]
			if (this.eventsData[index].type) {
				this.leftInfoTop[0].sel.value = this.eventsData[index].type
			} else {
				this.leftInfoTop[0].sel.value = ''
			}
			this.leftInfoTop[1].picker.date = this.$moment(this.eventsData[index].start).format('YYYY-MM-DD HH:mm:ss')
			this.leftInfoTop[2].picker.date = this.$moment(this.eventsData[index].end).format('YYYY-MM-DD HH:mm:ss')
			this.leftInfoTop[3].value = this.eventsData[index].title
			this.leftInfoTop[4].value = this.eventsData[index].explan
			if (this.eventsData[index].eventImg) {
				this.leftInfoTop[5].value = this.eventsData[index].eventImg.name
			} else {
				this.leftInfoTop[5].value = ''
			}
			this.leftInfoTop[6].value = String(this.eventsData[index].joinNumber)
			this.leftInfoTop[7].value = this.eventsData[index].winnerMessage
			this.leftInfoTop[8].value = this.eventsData[index].joinMessage
			this.leftInfoTop[9].sel.value = this.eventsData[index].status === 1 ? '운영' : '종료'
			if (this.eventsData[index].priceList) {
				this.rightSizeList.items = this.eventsData[index].priceList
			} else {
				this.rightSizeList.items = []
			}
			if (this.eventsData[index].joinList) {
				this.joinList.items = this.eventsData[index].joinList
			} else {
				this.joinList.items = []
			}
			if (this.eventsData[index].winnerList) {
				this.winnerList.items = this.eventsData[index].winnerList
			} else {
				this.winnerList.items = []
			}
			let sumCount = 0
			const priceList = this.eventsData[index].priceList.map(x => x.winnerNumber)
			for (let sunIndex = 0; sunIndex < priceList.length; sunIndex++) {
				sumCount += priceList[sunIndex]
			}
			this.dashBoardTable.items = []
			this.dashBoardTable.items.push({
				total: this.eventsData[index].joinList.length,
				winner: this.eventsData[index].winnerList.length,
				rate:
					(
						(this.eventsData[index].winnerList.length / this.eventsData[index].joinList.length
							? this.eventsData[index].winnerList.length / this.eventsData[index].joinList.length
							: 0) * 100
					).toFixed(1) + '%',
				winnerCount:
					(
						((sumCount - this.eventsData[index].winnerList.length) / this.eventsData[index].map.filter(x => x.check === false).length) *
						100
					).toFixed(1) + '%',
			})
			if (this.eventsData[index].eventImg) {
				this.giftBox.eventImg = this.$store.state.backServer + this.eventsData[index].eventImg.url
			} else {
				this.giftBox.eventImg = null
			}
			if (this.eventsData[index].type === '선착순 참여') {
				this.leftInfoTop[8].show = true
			} else {
				this.leftInfoTop[8].show = false
			}
			this.leftInfoSelectChange(this.leftInfoTop[0].sel.items.indexOf(this.eventsData[index].type), 'reset')
		},
		events(type) {
			this.$store.state.loading = true
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
			}
			this.$store
				.dispatch('events', data)
				.then(res => {
					this.eventsData = res.data.events
					this.selevent.items = res.data.events.map(x => x.title)
					if (type === 'reset') {
						this.eventChange(this.selevent.value)
					}
					this.addCount = this.$store.state.meData.event - res.data.events.length
					this.$store.state.loading = false
				})
				.catch(() => {
					alert('생성 허용치를 초과하였습니다.')
					this.$store.state.loading = false
				})
		},
		change() {},
		clickinput() {},
		clickFileUploadImageTop(index) {
			this.fileIndex = index
			document.getElementById('file_upload_Top_Event').click()
		},
		fileUploadTop(event) {
			this.leftInfoTop[this.fileIndex].value = event.target.files[0].name
			this.leftInfoTop[this.fileIndex].file = event.target.files[0]
		},
		fileUploadBottom(event) {
			this.leftInfoBottom[this.fileIndex].value = event.target.files[0].name
			this.leftInfoBottom[this.fileIndex].file = event.target.files[0]
		},
	},
	data() {
		return {
			sweetInfo: {
				//  업데이트 완료
				open: false,
				title: '업데이트 완료',
				content: `알림톡 업데이트가
완료되었습니다.`,
				modalIcon: 'info',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},
			giftBox: {
				dialog: false,
				color: 'black',
				titleColor: 'white',
				title: 'test',
				product: '',
				winnerMessage: '',
				joinMessage: '',
			},
			prevTitle: '',
			timePicker1: false,
			timePicker2: false,
			eventImg: null,
			eventsData: [],
			addCount: 0,
			hideDisagree: {
				class: '',
				dark: true,
				color: '',
				width: '',
			},
			search: '',
			searchTextFiled: {
				placeholder: '참여자 검색',
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
			searchWinner: '',
			searchWinnerTextFiled: {
				placeholder: '당첨자 검색',
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
			eventsDataSelect: {},
			preview: false,
			businessesDatas: [],
			timeEdit: false,
			parseCsv: null,
			mapfields: ['name', 'phone'],
			eventId: null,
			fileIndex: null,
			addBtn: {
				color: '',
				dark: true,
				btn_txt: '생성',
			},
			pickerRangeData: [],
			selevent: {
				outlined: true,
				items: [],
				id: [],
				value: '',
				label: '이벤트명',
			},
			bottomBtn: {
				color: '',
				dark: true,
				width: 100,
				height: 30,
			},
			bottomBtn2: {
				color: '',
				dark: true,
				width: 100,
				height: 40,
			},
			rightSize: [
				{
					title: '상품명',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
					},
				},
				{
					title: '당첨자 수',
					value: '',
					txtfield: {
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						type: 'Number',
						max: 20000,
						maxNumber: true,
					},
				},
			],
			leftInfoTop: [
				// 0
				{
					title: '이벤트 타입*',
					sel: {
						value: '선물상자',
						errorMessage: '',
						hideDetail: true,
						items: ['선물상자'],
						// '선착순 참여'
						inputItems: [],
						outlined: true,
					},
					tooltip: {
						url: '',
					},
					required: true,
				},
				// 1
				{
					title: '시작일*',
					picker: {
						menu: false,
						menu2: true,
						date: '',
						date2: '',
						errorMessage: '',
						hideDetail: true,
						disable: false,
					},
					timePicker: false,
					required: true,
				},
				// 2
				{
					title: '종료일*',
					picker: {
						menu: false,
						menu2: true,
						date: '',
						date2: '',
						errorMessage: '',
						hideDetail: true,
						disable: false,
					},
					timePicker: false,
					required: true,
				},
				// 3
				{
					title: '이벤트명*',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
					},
					required: true,
				},
				// 4
				{
					title: '이벤트 설명',
					value: '',
					area: {
						noresize: true,
						readonly: false,
						outlined: true,
						height: '3vh',
					},
					required: false,
				},
				// 5
				{
					title: '상품 이미지',
					value: '',
					file: { name: '' },
					fileinput: {
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						readonly: true,
					},
					UploadBtn: {
						class: '',
						dark: true,
						height: '40',
					},
					show: true,
					required: false,
				},
				// 6
				{
					title: '총 이벤트 참여인원*',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						type: 'Number',
						maxNumber: true,
						max: 20000,
					},
					required: true,
				},
				// 7
				{
					title: '당첨 메세지*',
					value: '[상품명]',
					area: {
						noresize: true,
						readonly: false,
						outlined: true,
						height: '1vh',
					},
					tooltip: {
						url: '',
					},
					required: true,
				},
				// 8
				{
					title: '꽝 메세지*',
					value: '',
					area: {
						noresize: true,
						readonly: false,
						outlined: true,
						height: '1vh',
					},
					tooltip: {
						url: '',
					},
					show: false,
					required: true,
				},
				// 9
				{
					title: '상태*',
					sel: {
						value: '운영',
						errorMessage: '',
						hideDetail: true,
						items: ['운영', '종료'],
						inputItems: [],
						outlined: true,
					},
					required: true,
				},
			],
			rightSizeList: {
				headers: [
					{ text: 'No.', value: 'No' },
					{ text: '상품명', value: 'product' },
					{ text: '당첨자 수', value: 'winnerNumber' },
					{ text: '비고', width: '200', sortable: false, align: 'center', value: 'actionReservationManagement' },
				],
				items: [],
			},
			joinList: {
				headers: [
					{ text: 'No.', value: 'No' },
					{ text: '이름', value: 'name' },
					{ text: '전화번호', value: 'phone' },
					{ text: '응모일', value: 'join_at' },
					{ text: '당첨여부', value: 'joinStatus' },
				],
				items: [],
			},
			winnerList: {
				headers: [
					{ text: 'No.', value: 'No' },
					{ text: '이름', value: 'name' },
					{ text: '전화번호', value: 'phone' },
					{ text: '당첨일', value: 'winner_at' },
					{ text: '당첨상품', value: 'winnerStatus' },
				],
				items: [],
			},
			dashBoardTable: {
				headers: [
					{ text: '총 참여인원', value: 'total' },
					{ text: '당첨 인원', value: 'winner' },
					{ text: '비율', value: 'rate' },
					{ text: '현 시점 당첨확률', value: 'winnerCount' },
				],
				items: [],
				hidedefaultfooter: true,
			},
		}
	},
	created() {
		this.events()
	},
}
</script>

<style lang="scss">
.title_font {
	font-size: 0.75rem;
	font-weight: bold;
}
.radioTime {
	.v-label {
		font-size: 0.75rem !important;
	}
}
</style>
