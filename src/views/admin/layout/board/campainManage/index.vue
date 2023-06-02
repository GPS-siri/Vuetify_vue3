<template>
	<div>
		<Manage :setdialog="edit_dialog" />
		<!-- :validation_chceck="validation_chceck"
			:add_project="add_project"
			:delete_project="delete_project" -->
	</div>
</template>

<script>
import Manage from './manage.vue'
export default {
	data() {
		return {
			edit_dialog: {
				// 수정/추가 다이어로그
				dialog: false,
				type: 'create',
				id: '',
				items: [
					//0
					{
						title: '아이디',
						id: 'email_name',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '아이디를 입력하세요.',
						},
						required: true,
					},
					//1
					{
						title: '이름',
						id: 'username',
						type: 'txtfield',
						value: '',
						txtfield: {
							maxlength: '15',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '이름을 입력하세요',
						},
						required: false,
					},
					//2
					{
						title: '휴대폰 번호',
						id: 'phone',
						value: '',
						type: 'txtfield',
						txtfield: {
							maxlength: '255',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '휴대폰 번호를 입력하세요',
						},
						required: true,
					},
					//3
					{
						title: '권한',
						id: 'auth',
						value: '',
						type: 'selectBox',
						selectBox: {
							value: '',
							disable: false,
							errorMessage: '',
							hideDetail: true,
							items: ['슈퍼 어드민', '현장관리자', '마케팅 기획'],
							inputItems: [],
							outlined: true,
							class: 'small_font bizInput',
							placeholder: '권한을 선택하세요.',
						},
						required: false,
					},
					//4
					{
						title: '프로젝트',
						id: 'project',
						value: '',
						type: 'selectBox',
						selectBox: {
							value: '',
							disable: false,
							errorMessage: '',
							hideDetail: true,
							items: [],
							inputItems: [],
							outlined: true,
							class: 'small_font bizInput',
							placeholder: '프로젝트를 선택하세요.',
						},
						btn: true,
						required: false,
					},
					//5
					{
						title: '상태',
						id: 'businesses',
						value: '',
						type: 'chips',

						chips: [],
						btn: true,
						required: false,
					},
				],
			},
		}
	},
	components: {
		Manage,
	},
}
</script>

<style></style>
