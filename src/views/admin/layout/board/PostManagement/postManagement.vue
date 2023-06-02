<template>
	<div style="width:100%; margin:0 37px">
		<v-layout align-center class="header_title">
			<!--  타이틀  -->
			<v-flex xs10>
				<v-layout align-center>
					<div class="slash mr-1"></div>
					<span class="admin_title">
						포스트 관리
					</span>
				</v-layout>
			</v-flex>
		</v-layout>
		<v-spacer></v-spacer>
		<v-layout align-center class="header_search" style="margin : 20px auto">
			<v-layout class="search_wrap ml-3">
				<v-layout justify-end>
					<v-flex class="mr-3" style="max-width:200px;">
						<txtField :txtField="search" class="search_box_admin"></txtField>
					</v-flex>
					<v-btn class="search_btn" color="#5d19ff" elevation="0"><v-icon>mdi-magnify</v-icon>조회</v-btn>
				</v-layout>
			</v-layout>
		</v-layout>

		<!-- 생성 및 저장 -->
		<v-layout class="mt-4">
			<v-flex xs10 class="pr-5">
				<datatable :datatable="postTable" class="notice_table"> </datatable>
			</v-flex>

			<v-flex xs7 class="pl-5">
				<v-layout style="border-top:1px solid black;">
					<v-flex class="notice_right_table" xs2>
						포스트 제목
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<txtField :txtField="post_title" class="search_box_admin pa-3"></txtField>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						소개글
					</v-flex>
					<v-flex xs10 class="notice_right_table2" style="height:">
						<v-textarea class="notice_content_text ma-3" outlined auto-grow hide-details style="font-size:12px !important"></v-textarea>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						배너 이미지
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<div class="right_subtable filePost" style="border-bottom:0; display: flex; flex-direction: row;">
							<div class="fileBox" @click="postfileUpload">
								<label class="pa-0 ma-0" style="font-size: 14px; color: #c3c3c3">
									권장사이즈: 440 x 140px / jpg.png
								</label>
							</div>
							<div class="mr-3">
								<v-btn class="notice_btn" color="#fff" elevation="0" style="width: 20%;">첨부</v-btn>
							</div>
						</div>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						포스트 이미지
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<div class="right_subtable filePost" style="border-bottom:0; display: flex; flex-direction: row;">
							<div class="fileBox" @click="postfileUpload">
								<label class="pa-0 ma-0" style="font-size: 14px; color: #c3c3c3">{{
									postlists.length > 0 ? postlists[postlists.length - 1].numberList.name : '권장사이즈: 720 x 960 ~ 1280 / jpg.png'
								}}</label>
							</div>
							<v-btn class="notice_btn" color="#fff" elevation="0" @click="postfileUpload">첨부</v-btn>
							<input type="file" style="display:none;" id="preview_files" @change="PostfileUploadChange" accept="image/jpeg,image/png" />
						</div>

						<v-layout>
							<v-flex xs12>
								<v-layout>
									<draggable v-model="postlists" class="imageGrid">
										<v-flex v-for="(image, index) in postlists" :key="index" class="imageItem ma-1">
											<v-img v-if="postlists.length > 0" :src="image.numberList.url" alt="Preview Image" class="previewImageItem" />
											<v-img v-else class="previewImageItem emptyBorder" />
										</v-flex>
										<v-flex v-for="index in 12 - postlists.length" :key="'empty-' + index" class="imageItem ma-1">
											<v-img class="previewImageItem emptyBorder">
												<v-icon class="addIcon" style="margin-left:15px">mdi-plus</v-icon>
											</v-img>
										</v-flex>
									</draggable>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						페이징 방식
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<v-radio-group :value="true" hide-details row class="notice_radio ma-3">
							<v-radio class="mb-0 mr-2" label="캐러셀" :value="true" color="#FB9C00" :ripple="false"></v-radio>
							<v-radio class="mb-0" label="스크롤" :value="false" color="#FB9C00" :ripple="false"></v-radio>
						</v-radio-group>
					</v-flex>
				</v-layout>
				<v-layout>
					<v-flex class="notice_right_table" xs2>
						포스트
					</v-flex>
					<v-flex xs10 class="notice_right_table2">
						<v-btn class="new_post_btn ml-3 " color="#0500B7" elevation="0">저장 및 신규 발행</v-btn>
					</v-flex>
				</v-layout>
			</v-flex>
			<!-- 미리보기 페이지 -->
			<v-flex xs6>
				<v-flex
					xs12
					class="pa-0 "
					:class="'border_side'"
					wrap
					style="height:100%; border-bottom: 1px solid #d1d1d1; border-left: none; border-top: 1px solid black;"
				>
					<v-layout>
						<v-flex xs3 align-self-start style="text-align:center; width:179px" class="pt-4">
							<v-flex class="bannerPreview"> </v-flex>
							<!-- <v-flex class="titlePreview mt-3"></v-flex>
							<v-flex class="postPreview mt-3 mb-3"></v-flex> -->
						</v-flex>
					</v-layout>
				</v-flex>
			</v-flex>
		</v-layout>
	</div>
</template>

<script>
import { txtField, datatable } from '@/components/index.js'
import draggable from 'vuedraggable'

export default {
	created() {
		this.post_first_table()
	},

	data() {
		return {
			postfiles: {},
			postlists: [],
			postTable: {
				headers: [
					{ text: '포스트 제목', value: 'title', width: '45%' },
					{ text: '발행일', value: 'created_at', width: '15%' },
					{ text: '배너이미지', value: '', width: '25%' },
					{ text: '포스팅 수', value: 'id', width: '15%' },
				],
				class: 'datatablehover3',
				items: [],
				noweditting: '',
				itemPerPage: 15,
				page: 1,
				pageCount: 0,
			},
			search: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
			post_title: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
			},
			post_file: {
				clearable: false,
				maxlength: '255',
				outlined: true,
				backCol: 'white',
				disable: true,
			},
		}
	},
	components: {
		txtField,
		datatable,
		draggable,
	},
	methods: {
		PostfileUploadChange(val) {
			if (this.postlists.length > 11) {
				alert('더 이상 등록하실 수 없습니다')
				return
			}

			this.postfiles.file = val.target.files[0]
			this.postfiles.name = val.target.files[0].name
			this.postfiles.fileUpload = true
			this.postfiles.url = URL.createObjectURL(val.target.files[0])
			this.postlists.push({ numberList: this.postfiles })
			this.postfiles = {}
			console.log(this.postlists)
		},
		postfileUpload() {
			document.getElementById(`preview_files`).click()
		},
		post_first_table() {
			this.$store.dispatch('postes').then(res => {
				let data = res.postes
				this.postTable.items = data
				console.log(this.postTable.items)
			})
		},
	},
}
</script>

<style lang="scss">
.new_post_btn {
	width: 150px !important;
	height: 30px !important;
	padding: 0;
	font-size: 13px !important;
	color: #fff;
	margin: 5px;
}

.imageGrid {
	max-width: 590px;
	display: flex;
	flex-wrap: wrap;
}

.imageItem {
	max-width: 20%;
	width: 720px;
	max-height: 1280px;
}

.previewImageItem {
	width: 133.69px;
	height: 92.06px;
	object-fit: cover;
	border: 1px solid rgba(0, 0, 0, 0.2);
}

.emptyBorder {
	border: 1px dashed rgba(0, 0, 0, 0.2);
}

.fileBox {
	border: 2px solid rgba(0, 0, 0, 0.2);
	width: 400px;
	height: 27px;
	border-radius: 3px;
	margin: 12px;
	background-color: #f0f1f2;
}
.notice_table {
	div {
		.v-data-table__wrapper {
			margin: 0;
		}
	}
}
.notice_right_table {
	background-color: #f5f5f5;
	font-size: 12px;
	font-weight: bold;
	display: flex;
	align-items: center;
	justify-content: center;
	border-right: 1px solid #c8c8c8;
	border-bottom: 1px solid #c8c8c8;
	border-left: 1px solid #c8c8c8;
}
.notice_right_table2 {
	border-right: 1px solid #c8c8c8;
	border-bottom: 1px solid #c8c8c8;
}
.right_subtable {
	display: flex;
	align-items: center;
	text-align: center;
	border-bottom: 1px solid #c8c8c8;
}
.notice_radio {
	margin: 0;
	padding: 0;
	font-size: 12px;
	.v-label {
		font-size: 12px;
	}
}
.notice_btn {
	width: 68px !important;
	height: 26px !important;
	padding: 0 !important;
	font-size: 12px !important;
	font-weight: normal;
	border: 1px solid #c5c3d5 !important;
	.v-btn__content {
		color: black;
	}
}
.right_checkbox {
	margin: 12px !important;
	padding: 0 !important;
	.v-label {
		font-size: 12px;
	}
}
.notice_content_text {
	.v-text-field__slot {
		textarea {
			margin-top: 0px !important;
			padding-top: 5px !important;
			max-height: 120px !important;
			overflow: auto;
			line-height: 18px !important;
		}
	}
}
.new_post_btn {
	width: 140px !important;
	height: 30px !important;
	padding: 0 !important;
	font-size: 13px !important;
	.v-btn__content {
		color: #fff;
	}
}

.bannerPreview {
	margin-left: 50px;
	border: 1px solid rgba(0, 0, 0, 0.2);
	width: 300px !important;
	height: 140px;
	max-width: none;
	border-top-right-radius: 50px;
	border-top-left-radius: 50px;
}

.titlePreview {
	margin-left: 50px;
	border: 1px solid rgba(0, 0, 0, 0.2);
	width: 300px !important;
	height: 70px;
	max-width: none;
}

.postPreview {
	margin-left: 50px;
	border: 1px solid rgba(0, 0, 0, 0.2);
	width: 300px !important;
	height: 500px;
	max-width: none;
}
</style>
