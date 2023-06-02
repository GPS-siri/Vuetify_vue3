<template>
	<v-dialog v-model="setdialog.dialog" persistent width="600">
		<div class="create_wrap" style="height:100%; background-color:white;">
			<!--  타이틀 -->
			<div class="px-8 py-4" style="background:#2d1c71; color:white;">
				<v-layout>
					<span>{{ setdialog.title }}</span>
					<v-spacer />
					<v-icon @click="close()" class="title-icon" color="white">mdi-close</v-icon>
				</v-layout>
			</div>
			<!--  안내 문구 -->
			<div class="mx-5 mt-5 mb-6">
				<v-layout class="goal_header py-3" align-center justify-start>
					<v-icon class="ml-4" color="red">mdi-alert-circle-outline</v-icon>
					<div class="ml-3 mr-10" style="font-size:12px; font-weight:300">
						상담예약건의 '미완료' 및 '취소' 에 대한 사유를 확인할 수 있습니다.
					</div>
				</v-layout>
			</div>
			<!-- 1번째 테이블 -->
			<div class="goal_table mx-5">
				<v-layout align-center class="table_menu">
					<!--상담사 -->
					<div class="display_flex" style="width:50%; align-items:center;">
						<div class="menu_tab d-flex align-center pl-5">{{ tablemenu[0] }}</div>
						<div class="d-flex align-center ml-2" style="height:25px">
							{{ setdialog.counselor }}
						</div>
					</div>
					<!-- 고객이름 -->
					<div class="display_flex" style="width:50%; align-items:center;">
						<div class="menu_tab d-flex align-center pl-5">{{ tablemenu[1] }}</div>
						<div class="d-flex align-center ml-2" style="height:25px">
							{{ setdialog.name }}
						</div>
					</div>
				</v-layout>
				<!-- 예약 상품 -->
				<v-layout align-center class="table_menu" style="background-color:#f4f4f4">
					<div class="menu_tab d-flex align-center pl-5" style="min-width:120px; background-color:transparent">{{ tablemenu[2] }}</div>
					<div class="d-flex align-center pl-2 py-2" style="min-height:36px; width:100%;  background-color:white">
						{{ setdialog.houseDatas }}
					</div>
				</v-layout>
			</div>

			<!-- 2번째 테이블 -->
			<div class="goal_table mt-3 mx-5">
				<!-- 예약 상품 -->
				<v-layout align-center class="table_menu" style="background-color:#f4f4f4">
					<div class="menu_tab d-flex align-center pl-5" style="min-width:120px; background-color:transparent">{{ tablemenu[3] }}</div>
					<div class="d-flex align-center pl-2 py-2" style="min-height:100px; width:100%;  background-color:white">
						{{ setdialog.reason }}
					</div>
				</v-layout>
			</div>

			<v-layout class="mt-8 pb-10" justify-center align-center>
				<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="close()">
					확인
				</v-btn>
			</v-layout>
		</div>
	</v-dialog>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			tablemenu: ['상담사', '고객이름', '예약상품', '사유'],
			status_keyword: {
				edit: false,
				delete: true,
				value: '',
				items: ['재직', '개인', '법인', '퇴사'],
				add: '',
			},
		}
	},
	props: {
		setdialog: Object,
	},
	methods: {
		optionEdit() {
			this.status_keyword.edit = !this.status_keyword.edit
		},
		optionDelete(index) {
			this.status_keyword.items.splice(index, 1)
		},
		addOption() {
			this.status_keyword.items.push(this.status_keyword.add)
			this.status_keyword.add = ''
		},
		close() {
			this.setdialog.dialog = false
		},
	},
}
</script>

<style lang="scss">
.status_select {
	div {
		.v-input__slot {
			font-size: 14px;
			min-height: 25px !important;
			height: 25px !important;
		}
		div {
			.v-input__append-inner {
				margin-top: 0;
			}
		}
	}
}
.status_btn {
	width: 100px;
	height: 25px !important;
	border: 1px solid #3a258f;
	border-radius: 25px;
	color: #3a258f !important;
	font-weight: 350;
}
.status_text {
	div {
		.v-input__slot {
			min-height: 25px !important;
			height: 25px;
			padding: 0 10px !important;
			font-size: 14px;
		}
	}
}
.select_option {
	font-size: 14px !important;
}
</style>
