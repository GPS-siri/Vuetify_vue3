<template>
	<div>
		<div :class="$vuetify.breakpoint.smAndDown ? '' : 'wrapper'">
			<!-- <breadcrumbs class="titleCrumb" title="상담사 관리"></breadcrumbs> -->

			<v-layout>
				<!-- --- 등록 버튼 --- -->
				<btn btn_txt="생성" :btn="addBtn" @click="clickAddBtn"></btn>
				<!-- 테이블 검색 -->
				<v-spacer /><v-flex lg2 xs4><txtField v-model="searchTxt" :txtField="searchTxtField"/></v-flex>
				<div style="width:15vw" class="ml-2">
					<select-box :sel="selTitle" @change="selTitleChange"></select-box>
				</div>
			</v-layout>
			<!-- --- 데이터 테이블 --- -->
			<v-layout wrap>
				<v-flex class="mt-4 " lg6 xs12>
					<edit-counselor-modal
						:setdialog="addCounselorModal"
						:clickSaveBtn="createCounselor"
						:breakpoint="datatable"
					></edit-counselor-modal>
					<!-- EDIT -->
					<edit-counselor-modal
						:setdialog="editCounselorModal"
						:clickSaveBtn="updateCounselor"
						:breakpoint="datatable"
					></edit-counselor-modal>
				</v-flex>
				<v-flex
					class="px-4"
					:lg6="addCounselorModal.dialog || editCounselorModal.dialog"
					:lg12="!addCounselorModal.dialog && !editCounselorModal.dialog"
				>
					<datatable
						:datatable="datatable"
						class="tbl-type01 sort_lay"
						:clickEditBtn="clickEditBtn"
						:clickDeleteBtn="clickDeleteBtn"
						:search="searchTxt"
					>
					</datatable> </v-flex
			></v-layout>
		</div>
		<alertModal :setdialog="alertModal" :clickDeleteBtnModal="deleteAccount" />
		<alertModal2 :setdialog="alertModal2" />
	</div>
</template>

<script>
import { selectBox, datatable, btn, alertModal, alertModal2, editCounselorModal, txtField } from '@/components/index.js'
// breadcrumbs,
export default {
	components: {
		selectBox,
		// breadcrumbs,
		datatable,
		btn,
		alertModal,
		alertModal2,
		editCounselorModal,
		txtField,
	},
	data() {
		return {
			reservedaysDatas: [],
			selTitle: {
				value: '',
				errorMessage: '',
				hideDetail: true,
				items: [],
				inputItems: [],
				outlined: true,
				label: '방문 거점 홍보명',
			},
			// --- 데이터 테이블 데이터 --``
			datatable: {
				headers: [
					// { text: '사업지 코드', width: '150', value: 'groupcode' },
					// { text: '건설사명', value: 'group.constname' },
					{ text: '방문 거점 홍보', value: 'codeTitle' },
					{ text: '상담사 아이디', value: 'counselorid' },
					// { text: '대표번호', value: 'phone' },
					{ text: '상담원명', value: 'name' },
					{ text: '상담석', align: 'center', value: 'seat' },
					// { text: '권한', align: 'center', value: 'authority' },
					{ text: '상태', align: 'center', value: 'stat' },
					{ text: '비고', width: '200', align: 'center', value: 'action' },
				],
				items: [],
				hidedefaultfooter: false,
				breakpoint: false,
			},
			searchTxt: '',
			searchTxtField: {
				maxlength: 20,
				clearable: true,
				prependinnericon: 'mdi-magnify',
				label: 'Search',
				backCol: '#FFFFFF',
				outlined: true,
			},
			// --- 삭제 모달 ---
			alertModal: {
				dialog: false,
				text: '',
			},
			alertModal2: {
				dialog: false,
				text: '',
			},
			// --- 등록 모달 ---
			addCounselorModal: {
				dialog: false,
				title: '',
				groupcode: '',
				constname: '',
				groupname: '',
				counselorid: '',
				counselorpw: '',
				counselorCampain: '',
				phone: '',
				name: '',
				seat: '',
				editcounselorCampain: {
					value: '',
					errorMessage: '',
					hideDetail: false,
					items: [],
					outlined: true,
				},
				authoritysel: {
					value: '',
					errorMessage: '',
					hideDetail: false,
					items: ['분양소장', '상담사'],
					outlined: true,
					autocomplete: 'off',
				},
				statsel: {
					value: '',
					errorMessage: '',
					hideDetail: false,
					items: ['근무', '휴무'],
					outlined: true,
					autocomplete: 'off',
				},
				editgroupcode: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					disable: true,
					autocomplete: 'off',
				},
				editconstname: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
				},
				editgroupname: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
				},
				editcounselorid: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
				},
				editcounselorpw: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
				},
				editphone: {
					maxlength: '11',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					onlyNumber: true,
					autocomplete: 'off',
				},
				editname: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
				},
				editseat: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					onlyNumber: true,
					autocomplete: 'off',
				},
			},
			// 수정 모달
			editCounselorModal: {
				dialog: false,
				title: '',
				groupcode: '',
				constname: '',
				groupname: '',
				counselorid: '',
				counselorpw: '',
				counselorCampain: '',
				phone: '',
				name: '',
				seat: '',
				authoritysel: {
					value: '',
					errorMessage: '',
					hideDetail: false,
					items: ['분양소장', '상담사'],
					outlined: true,
				},
				statsel: {
					value: '',
					errorMessage: '',
					hideDetail: false,
					items: ['근무', '휴무'],
					outlined: true,
				},
				editcounselorCampain: {
					value: '',
					errorMessage: '',
					hideDetail: false,
					items: [],
					outlined: true,
				},
				editgroupcode: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					disable: true,
					autocomplete: 'off',
				},
				editconstname: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
				},
				editgroupname: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
				},
				editcounselorid: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					disable: true,
					autocomplete: 'off',
				},
				editcounselorpw: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
				},
				editphone: {
					maxlength: '11',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					onlyNumber: true,
					autocomplete: 'off',
				},
				editname: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					autocomplete: 'off',
				},
				editseat: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					onlyNumber: true,
					autocomplete: 'off',
				},
			},
			// --- 등록 버튼 ---
			addBtn: {
				class: '',
				width: '100',
				height: '38',
				dark: true,
				color: this.$store.state.PointColor2,
			},
			sel: { value: '', errorMessage: '', hideDetail: true, items: [], outlined: true },
			counselors: [], // 카운셀러 데이터 테이블 items
			groups: [], // 그룹지 셀렉트박스를 위한 그룹지 데이터 저장
		}
	},
	created() {
		this.setGroupData() // 페이지 데이터 set api 호출
	},
	computed: {},
	methods: {
		selTitleChange() {
			this.setCounselorData(this.sel.value)
		},

		createCounselorsAws(data) {
			this.$store.dispatch('createCounselorsAws', data).then(() => {})
		},
		updateCounselorsAws(data) {
			this.$store.dispatch('updateCounselorsAws', data).then(() => {})
		},
		// 그룹 데이터 호출
		setGroupData() {
			this.sel.value = this.$store.state.meData.group.groupcode
			const data = {
				type: 'd',
				groupcode: this.$store.state.meData.group.groupcode,
			}
			this.$store.dispatch('reservedays', data).then(res => {
				if (res.data.reservedays.length > 0) {
					this.selTitle.items = res.data.reservedays.map(x => x.title)
					this.editCounselorModal.editcounselorCampain.items = res.data.reservedays.map(x => x.title)
					this.editCounselorModal.editcounselorCampain.value = res.data.reservedays.map(x => x.title)[0]
					this.addCounselorModal.editcounselorCampain.items = res.data.reservedays.map(x => x.title)
					this.addCounselorModal.editcounselorCampain.value = res.data.reservedays.map(x => x.title)[0]
					this.selTitle.value = res.data.reservedays.map(x => x.title)[0]
					this.reservedaysDatas = res.data.reservedays
					this.setCounselorData(this.sel.value)
				}
			})
		},
		// counselors 데이터 호출
		setCounselorData(groupcode) {
			const codeIndex = this.reservedaysDatas.map(x => x.title).indexOf(this.selTitle.value)
			const code = this.reservedaysDatas[codeIndex].code
			const data = {
				groupcode: groupcode,
				code: code,
			}
			this.$store
				.dispatch('counselors', data)
				.then(res => {
					res.data.counselors.forEach(el => {
						const codeSettingIndex = this.reservedaysDatas.map(x => x.code).indexOf(el.code)
						const codeSetting = this.reservedaysDatas[codeSettingIndex].title
						el.codeTitle = codeSetting
					})
					this.counselors = res.data.counselors
					this.datatable.items = this.counselors
				})
				.catch(() => {})
		},
		deleteCounselor(id) {
			const data = {
				groupcode: this.$store.state.meData.group ? this.$store.state.meData.group.groupcode : this.$store.state.meData.groupcode,
				counselorid: this.$store.state.datatableItem.counselorid,
				id: id,
			}
			this.$store
				.dispatch('deleteCounselor', data)
				.then(() => {
					this.setCounselorData(this.sel.value)
				})
				.catch(() => {})
		},
		deleteAccount() {
			this.deleteCounselor(this.$store.state.datatableItem.id)
			this.alertModal.dialog = false
		},
		clickDeleteBtn() {
			this.alertModal.text = '정말로 지우시겠습니까?'
			this.alertModal.dialog = true
		},
		clickEditBtn() {
			this.editCounselorModal.title = '상담사 수정'
			let editdata = this.datatable.items.filter(a => a === this.$store.state.datatableItem)
			if (editdata[0].stat == false) {
				this.editCounselorModal.statsel.value = '휴무'
			} else if (editdata[0].stat == true) {
				this.editCounselorModal.statsel.value = '근무'
			}
			if (editdata[0].authority === '0') {
				this.editCounselorModal.authoritysel.value = '분양소장'
			} else if (editdata[0].authority === '1') {
				this.editCounselorModal.authoritysel.value = '상담사'
			}
			Object.assign(this.editCounselorModal, editdata[0])
			// let index = this.groups.findIndex(obj => obj.groupcode == this.sel.value)
			this.editCounselorModal.groupcode = this.sel.value
			this.editCounselorModal.dialog = true
			this.addCounselorModal.dialog = false
			this.datatable.breakpoint = !this.datatable.breakpoint
		},
		createCounselor() {
			let ok = 0
			// let index
			let stat
			let authority
			let seatArr
			if (this.addCounselorModal.groupcode === '') {
				ok += 1
				return (this.addCounselorModal.editgroupcode.errorMessage = 'Please enter the required value (*).')
			} else {
				this.addCounselorModal.editgroupcode.errorMessage = ''
			}
			if (this.addCounselorModal.counselorid === '') {
				ok += 1
				return (this.addCounselorModal.editcounselorid.errorMessage = 'Please enter the required value (*).')
			} else {
				this.addCounselorModal.editcounselorid.errorMessage = ''
			}
			if (this.datatable.items.findIndex(obj => obj.counselorid == this.addCounselorModal.counselorid) != -1) {
				ok += 1
				return (this.addCounselorModal.editcounselorid.errorMessage = 'Id is already used')
			} else {
				this.addCounselorModal.editcounselorid.errorMessage = ''
			}
			if (this.addCounselorModal.counselorpw === '') {
				ok += 1
				return (this.addCounselorModal.editcounselorpw.errorMessage = 'Please enter the required value (*).')
			} else {
				this.addCounselorModal.editcounselorpw.errorMessage = ''
			}
			if (this.addCounselorModal.seat === '') {
				ok += 1
				return (this.addCounselorModal.editseat.errorMessage = 'Please enter the required value (*).')
			} else {
				this.addCounselorModal.editseat.errorMessage = ''
			}
			if (this.addCounselorModal.authoritysel.value === '') {
				ok += 1
				return (this.addCounselorModal.authoritysel.errorMessage = 'Please enter the required value (*).')
			} else {
				this.addCounselorModal.authoritysel.errorMessage = ''
				// 입력 받은 groupcode 로 groupId index 찾기
				// index = this.groups.findIndex(obj => obj.groupcode == this.addCounselorModal.groupcode)
				// stat 값 boolean 값으로 전환
				if (this.addCounselorModal.statsel.value == '근무') {
					stat = true
				} else if (this.addCounselorModal.statsel.value == '휴무') {
					stat = false
				}
				if (this.addCounselorModal.authoritysel.value === '분양소장') {
					authority = '0'
				} else if (this.addCounselorModal.authoritysel.value === '상담사') {
					authority = '1'
				}
			}
			// 상담석 중복 체크
			seatArr = this.counselors.filter(obj => {
				return obj.seat === this.addCounselorModal.seat && obj.groupcode === this.addCounselorModal.groupcode
			})
			if (seatArr.length !== 0) {
				ok += 1
				return (this.addCounselorModal.editseat.errorMessage = '상담석 번호가 중복됩니다.')
			} else {
				this.addCounselorModal.editseat.errorMessage = ''
			}
			if (ok === 0) {
				const codeIndex = this.reservedaysDatas.map(x => x.title).indexOf(this.addCounselorModal.editcounselorCampain.value)
				const code = this.reservedaysDatas[codeIndex].code
				const data = {
					groupcode: this.addCounselorModal.groupcode,
					counselorid: this.addCounselorModal.counselorid,
					counselorpw: this.addCounselorModal.counselorpw,
					phone: this.addCounselorModal.phone,
					name: this.addCounselorModal.name,
					seat: this.addCounselorModal.seat,
					authority: authority,
					stat: stat,
					group: this.$store.state.meData.group.id,
					code: code,
				}
				this.$store
					.dispatch('createCounselor', data)
					.then(() => {
						this.addCounselorModal.dialog = false
						this.setCounselorData(this.sel.value)
						this.datatable.breakpoint = !this.datatable.breakpoint
					})
					.catch(() => {})
			} else {
				this.alertModal2.text = '사업지 코드를 잘못 입력하셨습니다.'
				this.alertModal2.dialog = true
			}
		},
		updateCounselor() {
			let ok = 0
			let stat
			let authority
			let seatArr
			if (this.editCounselorModal.groupcode === '') {
				ok += 1
				return (this.editCounselorModal.editgroupcode.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editCounselorModal.editgroupcode.errorMessage = ''
			}
			if (this.editCounselorModal.counselorid === '') {
				ok += 1
				return (this.editCounselorModal.editcounselorid.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editCounselorModal.editcounselorid.errorMessage = ''
			}
			if (this.editCounselorModal.seat === '') {
				ok += 1
				return (this.editCounselorModal.editseat.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editCounselorModal.editseat.errorMessage = ''
			}
			// 상담석 번호 중복 방지
			seatArr = this.datatable.items.filter(obj => {
				return obj.seat === this.editCounselorModal.seat && obj.counselorid !== this.editCounselorModal.counselorid
			})
			if (seatArr.length !== 0) {
				ok += 1
				return (this.editCounselorModal.editseat.errorMessage = '상담석 번호가 중복됩니다.')
			} else {
				this.editCounselorModal.editseat.errorMessage = ''
			}

			if (this.editCounselorModal.counselorpw === '') {
				ok += 1
				return (this.editCounselorModal.editcounselorpw.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editCounselorModal.editcounselorpw.errorMessage = ''
			}
			if (this.editCounselorModal.authoritysel.value === '') {
				ok += 1
				return (this.editCounselorModal.authoritysel.errorMessage = 'Please enter the required value (*).')
			} else {
				this.editCounselorModal.authoritysel.errorMessage = ''
				// stat 값 boolean 값으로 전환
				if (this.editCounselorModal.statsel.value == '근무') {
					stat = true
				} else if (this.editCounselorModal.statsel.value == '휴무') {
					stat = false
				}
			}
			if (this.editCounselorModal.authoritysel.value === '분양소장') {
				authority = '0'
			} else if (this.editCounselorModal.authoritysel.value === '상담사') {
				authority = '1'
			}
			if (ok === 0) {
				const codeIndex = this.reservedaysDatas.map(x => x.title).indexOf(this.editCounselorModal.editcounselorCampain.value)
				const code = this.reservedaysDatas[codeIndex].code
				const data = {
					groupcode: this.editCounselorModal.groupcode,
					id: this.$store.state.datatableItem.id,
					counselorid: this.editCounselorModal.counselorid,
					counselorpw: this.editCounselorModal.counselorpw,
					phone: this.editCounselorModal.phone,
					name: this.editCounselorModal.name,
					seat: this.editCounselorModal.seat,
					authority: authority,
					stat: stat,
					code: code,
				}
				this.$store
					.dispatch('updateCounselor', data)
					.then(() => {
						this.editCounselorModal.dialog = false
						this.setCounselorData(this.sel.value)
						this.datatable.breakpoint = !this.datatable.breakpoint
					})
					.catch(() => {})
			}
		},
		clickAddBtn() {
			this.addCounselorModal.title = '상담사 등록'
			// let index = this.groups.findIndex(obj => obj.groupcode == this.sel.value)
			this.addCounselorModal.groupcode = this.sel.value
			this.addCounselorModal.constname = ''
			this.addCounselorModal.groupname = ''
			this.addCounselorModal.counselorid = ''
			this.addCounselorModal.counselorpw = ''
			this.addCounselorModal.phone = ''
			this.addCounselorModal.name = ''
			this.addCounselorModal.seat = ''
			this.addCounselorModal.authoritysel.value = '상담사'
			this.addCounselorModal.statsel.value = '근무'
			this.addCounselorModal.dialog = !this.addCounselorModal.dialog
			this.editCounselorModal.dialog = false

			this.addCounselorModal.editgroupcode.errorMessage = ''
			this.addCounselorModal.editcounselorid.errorMessage = ''
			this.addCounselorModal.editcounselorid.errorMessage = ''
			this.datatable.breakpoint = !this.datatable.breakpoint
		},
		// 셀렉트 박스 선택된 값 테이블 적용
		applyTable() {
			// let filterType = this.sel.value
			// let result = this.counselors.filter(item => {
			// 	return item.groupcode === filterType
			// })
			// this.datatable.items = result
			this.setCounselorData(this.sel.value)
		},
	},
}
</script>
<style lang="scss">
.sort_lay {
	.theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
		width: 100%;
	}
}
</style>
