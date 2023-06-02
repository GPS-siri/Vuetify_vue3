<template>
	<v-dialog v-model="setdialog.dialog" persistent width="440">
		<div class="counselor_create_wrap">
			<div class="px-8 py-4" style="background:#2d1c71; color:white;">
				<v-layout>
					<span>{{ setdialog.title }}</span>
					<v-spacer />
					<v-icon @click="close()" class="title-icon" color="white">mdi-close</v-icon>
				</v-layout>
			</div>
			<div class="mx-5 mt-5 mb-6">
				<v-layout class="goal_header py-3" align-center justify-center>
					<v-icon class="ml-4" color="red">mdi-alert-circle-outline</v-icon>
					<div class="ml-3 mr-10" style="font-size:12px; font-weight:300">
						목표 등록 및 수정이 되면 공지사항에 목표건수와 목표일자가 자동으로 공지 되고 새로운 '목표달성률'이 반영됩니다.
					</div>
				</v-layout>
			</div>
			<div class="goal_table mx-5">
				<v-layout align-center class="table_menu">
					<div class="menu_tab d-flex align-center pl-5">{{ tablemenu[0] }}</div>
					<div class="d-flex align-center ml-2" style="height:25px">
						<v-radio-group v-model="goalData.goalActive" class="radio-group radio_align mt-0" row hideDetails>
							<v-radio class="mr-7" color="primary" label="활성" :value="true"></v-radio>
							<v-radio color="primary" label="비활성" :value="false"></v-radio>
						</v-radio-group>
					</div>
				</v-layout>
				<v-layout align-center class="table_menu">
					<div class="menu_tab d-flex align-center pl-5">{{ tablemenu[1] }}</div>
					<div class="ml-2 mr-1">
						<v-text-field
							class="goal_input"
							:disabled="goalData.goalActive === false"
							v-model="goalData.goalCount"
							outlined
							hideDetails
							type="number"
						></v-text-field>
					</div>
					건
				</v-layout>
				<v-layout align-center class="table_menu">
					<div class="menu_tab d-flex align-center pl-5">{{ tablemenu[2] }}</div>
					<v-layout>
						<div class="goal_data_picker d-flex align-center ml-2" style="width:100px;">
							<DatepickerDialog :picker="goalData.goalStart"></DatepickerDialog>
						</div>
						<div class="mx-1 d-flex align-center">~</div>
						<div class="goal_data_picker d-flex align-center" style="width:100px">
							<DatepickerDialog :picker="goalData.goalEnd" :allowed_dates="allowed_datesEnd"></DatepickerDialog>
						</div>
					</v-layout>
				</v-layout>
			</div>
			<v-layout class="mt-8" justify-center align-center>
				<v-btn color="primary" style="width:120px; height:35px;" @click="goalEdit()">
					저장
				</v-btn>
				<v-btn class="ml-3" outlined style="width:120px; height:35px;" @click="close()">
					취소
				</v-btn>
			</v-layout>
		</div>
	</v-dialog>
</template>

<script>
import { DatepickerDialog } from '@/components'

export default {
	components: {
		DatepickerDialog,
	},
	props: {
		setdialog: Object,
		goalEdit: Function,
		goalData: Object,
	},
	data() {
		return {
			tablemenu: ['목표설정', '목표건수', '목표설정기간'],
			goal_input_keyword: '',
			date: {
				start: {
					date: this.$moment().format('YYYY-MM-DD'),
				},
				end: {
					date: this.$moment().format('YYYY-MM-DD'),
				},
			},
		}
	},
	methods: {
		close() {
			this.setdialog.dialog = false
		},
		allowed_datesEnd(val) {
			if (this.date.start === '') {
				return val
			} else {
				val = this.date.start.date <= val
			}
			return val
		},
	},
}
</script>

<style lang="scss">
.counselor_create_wrap {
	background: white;
	height: 370px;
}
.goal_header {
	background: #f4f4f4;
	border-top: 1px solid #bcbcbc;
}
.goal_table {
	border-top: 1px solid #bcbcbc;
}
.table_menu {
	border-bottom: 1px solid #e0e0e0;
	font-size: 14px;
}
.menu_tab {
	background: #f4f4f4;
	width: 120px;
	height: 36px;
}
.goal_input {
	width: 131px;
	font-size: 14px;
	.v-input__slot {
		min-height: 25px !important;
		height: 25px;
		padding: 0 10px !important;
	}
}
.goal_data_picker {
	.v-input__slot {
		min-height: 25px !important;
		height: 25px !important;
		padding: 0 5px !important;
		font-size: 12px;
		.v-input__append-inner {
			margin-top: 2px !important;
			padding: 0;
			.v-icon.v-icon {
				font-size: 20px;
			}
		}
	}
}
</style>
