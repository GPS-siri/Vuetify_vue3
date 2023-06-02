<template>
	<div class="counselor_container">
		<div class="sticky_wrap_type">
			<div class="top_sticky_header">
				<v-layout class="tab_name_bar">
					<div class="header_left_btn">
						<v-btn icon x-large @click="to_bizDashboard()">
							<v-icon>
								mdi-chevron-left
							</v-icon>
						</v-btn>
						<div style="align-self:center">
							컨텐츠 관리
						</div>
					</div>
				</v-layout>
			</div>

			<v-layout justify-center class="basic_content" wrap v-for="(bdata, idx) of contentsmanage_data" :key="idx">
				<div style="width: 100%;">
					<h4 style="margin: 14px 10px;">{{ bdata.text }} 관리하기</h4>
					<v-layout style="margin: 0px 10px;" justify-space-between align-center>
						<span style="font-size: 14px; font-weight: 600;">전체 {{ bdata.text }}</span>
						<span style="font-size: 12px; color: rgba(0, 0, 0, 0.5);">&#8251; {{ bdata.text }} 생성 및 등록은 PC에서만 가능합니다.</span>
					</v-layout>
				</div>
				<div class="pb-4 basic_content_wrap">
					<div class="mb-4">
						<v-text-field
							:autofocus="false"
							class="search-textfiled"
							:placeholder="bdata.text + ' 제목을 검색하세요'"
							hideDetails
							maxlength="255"
							append-icon="mdi-magnify"
							@click:append="posts_handle"
							@keyup.enter="posts_handle"
							flat
							dense
							color="primary2"
							v-model="search[bdata.type]"
							autocomplete="off"
						></v-text-field>
					</div>
					<v-layout class="mt-2 mb-3 mx-5" justify-space-between>
						<v-flex xs5 align-center>
							<div class="manage_table_result">
								검색결과 <span class="ml-2 mr-1" style="#633EFD">{{ listsup[`${bdata.type}_data`].length }}</span> 건
							</div>
						</v-flex>
						<v-flex xs3>
							<v-select
								class="search_select_type"
								hideDetails
								dense
								outlined
								:items="statusfilt[`${bdata.type}_filt`].options"
								v-model="statusfilt[`${bdata.type}_filt`].value"
							>
							</v-select>
						</v-flex>
					</v-layout>
					<v-data-table
						:headers="headers[`${bdata.type}_header`]"
						:items="listsup[`${bdata.type}_data`]"
						mobile-breakpoint="100"
						class="elevation-0 dashboard-table talk_table_font mx-5"
						disable-sort
						:footer-props="{ itemsPerPageText: '' }"
					>
						<template v-slot:[`item.title`]="{ item }">
							<div>
								<v-layout v-if="$moment().diff($moment(item.created_at), 'days') < 8" align-center>
									<v-flex ml-1 v-if="item.title.length > 20">
										{{ item.title.substring(0, 15) + '...' }}
									</v-flex>
									<v-flex ml-1 v-else>
										{{ item.title }}
									</v-flex>
								</v-layout>
								<v-layout v-else>
									<v-flex ml-1 v-if="item.title.length > 20">
										{{ item.title.substring(0, 15) + '...' }}
									</v-flex>
									<v-flex ml-1 v-else>
										{{ item.title }}
									</v-flex>
								</v-layout>
							</div>
						</template>
						<template v-slot:[`item.users_permissions_users`]="{ item }">
							<div>
								{{ check_rel_hide(item.users_permissions_users) ? '공개' : '비공개' }}
							</div>
						</template>
						<template v-slot:[`item.etc`]="{ item }">
							<div class="posts_etc">
								<v-btn class="white--text" color="#633efd" @click="setup_dialog(item)">미리보기</v-btn>
							</div>
						</template>
					</v-data-table>
				</div>
			</v-layout>
			<v-layout class="contents_footer" style="background-color: #fff; height: auto;" justify-space-around>
				<v-flex xs6 v-for="(item, idx) of finishbtn" :key="idx" style="height:50px;">
					<v-btn
						block
						tile
						:style="item.style"
						:color="item.color"
						:class="item.type === 'save' ? 'white--text' : ''"
						v-text="item.text"
						@click="item.type === 'confirm' ? to_bizDashboard() : open_saveDialog()"
					></v-btn>
				</v-flex>
			</v-layout>
		</div>
		<contentsDialog :dialog="previewDialog" :listp="listsup.posts_data" />
		<comfirmDialog :dialog="saveDialog" :activeClick="finish_saveDialog" />
		<comfirmDialog :dialog="confirmDialog" />
	</div>
</template>
<script>
import contentsDialog from './contentsDialog.vue'
import { comfirmDialog } from '@/components'
export default {
	components: {
		comfirmDialog,
		contentsDialog,
	},
	computed: {
		released(x) {
			return this.check_rel_hide(x.users_permissions_users) ? '공개' : '비공개'
		},
	},
	data() {
		return {
			whoru: this.$store.state.meData.id,
			contentsmanage_data: [
				{ type: 'events', text: '이벤트' },
				{ type: 'posts', text: '포스트' },
			],
			finishbtn: [
				{
					text: '확인',
					type: 'confirm',
					color: '#ffffff',
					style: 'width: 100%; border: 1px solid #000; height:100%; font-size:14px; font-weight:500;',
				},
				{
					text: '저장',
					type: 'save',
					color: '#633efd',
					style: 'width: 100%; border: 1px solid ##633efd; height:100%; font-size:14px; font-weight:500;',
				},
			],
			statusfilt: {
				posts_filt: {
					options: ['전체', '공개', '비공개'],
					value: '전체',
				},
				events_filt: {
					options: ['전체', '미진행', '진행중', '종료'],
					value: '전체',
				},
			},

			headers: {
				events_header: [
					{
						text: '이벤트 제목',
						align: 'center',
						value: 'title',
						width: '50%',
					},
					{ text: '상태', value: 'users_permissions_users', align: 'center', width: '25%' },
					{ text: '비고', value: `etc`, align: 'center', width: '25%' },
				],

				posts_header: [
					{
						text: '포스트 제목',
						align: 'center',
						value: 'title',
						width: '50%',
					},
					{ text: '상태', value: 'users_permissions_users', align: 'center', width: '25%' },
					{ text: '비고', value: `etc`, align: 'center', width: '25%' },
				],
			},

			listsup: {
				posts_data: [],
				events_data: [],
			},

			search: {
				posts: '',
				events: '',
			},
			startPicker: {
				date: this.$moment()
					.subtract(6, 'days')
					.format('YYYY-MM-DD'),
			},
			endPicker: {
				date: this.$moment().format('YYYY-MM-DD'),
			},
			day: '7일',
			days: ['30일', '21일', '14일', '7일'],

			previewDialog: {
				// 미리보기
				open: false,
				data: {
					postImg: [],
					users_permissions_users: [],
				},
				status: false,
				budid: '',
				public: '',
				result: '',
			},
			saveDialog: {
				// 저장하기
				open: false,
				title: '',
				content: `컨텐츠 정보를 저장하시겠습니까?`,
				type: 'question',
			},
			confirmDialog: {
				// 확인하기
				open: false,
				title: '',
				content: `저장하지 않은 정보는 보존되지 않습니다.`,
			},
		}
	},
	created() {
		this.posts_handle()
	},
	methods: {
		check_rel_hide(x) {
			if (x.length > 0) {
				for (let i of x) {
					i.id == this.whoru
					return true
				}
			} else {
				return false
			}
		},
		setup_dialog(x) {
			console.log(this.listsup.posts_data)
			console.log(this.check_rel_hide(x.users_permissions_users))
			this.previewDialog.budid = this.whoru
			this.previewDialog.open = true
			this.previewDialog.data = x
			this.previewDialog.status = this.check_rel_hide(x.users_permissions_users)
			this.previewDialog.result = this.previewDialog.status ? 'release' : 'hide'
		},

		to_bizDashboard() {
			// 뒤로가기 버튼
			this.$router.push({
				name: 'counselorBizDashboard',
				params: { id: this.$route.params.id },
			})
		},
		posts_handle() {
			this.$store.state.loading = true
			const data = {
				title: '',
				// business: this.$route.params.id,
			}
			if (this.search.posts) {
				data['title'] = this.search.posts
			}
			this.$store.dispatch('posts', data).then(res => {
				res.posts.sort((a, b) => {
					return new Date(b.created_at) - new Date(a.created_at)
				})

				this.listsup.posts_data = res.posts

				console.log(res.posts)
				this.$store.state.countShow[4].count1 = res.posts.filter(x => this.$moment().diff(this.$moment(x.created_at), 'days') < 8).length
				this.$store.state.countShow[4].count2 = localStorage.getItem('readPosts')
					? res.posts.length - (localStorage.getItem('readPosts').split(',').length - 1)
					: res.posts.length
				this.$store.state.countShow[4].count3 = res.posts.length
				this.$store.state.loading = false
			})
		},
		events_handle() {
			console.log('이벤트란입니다.')
		},

		preview(item, index, header) {
			console.log(item, index, header)
		},
		open_saveDialog() {
			this.saveDialog.open = true
		},
		async finish_saveDialog() {
			this.saveDialog.open = false
		},
	},
	mounted() {
		this.$store.state.footerMobileStatus = false
	},
	destroyed() {
		this.$store.state.footerMobileStatus = true
	},
}
</script>
<style lang="scss">
.dashboard-table {
	.v-data-table__wrapper {
		table {
			thead {
				tr {
					th.text-left {
						text-align: center !important;
					}
				}
			}
		}
	}
}
.expand_wrap {
	padding: 0 !important;
	background: #f2f2f2;
}

.search_select_type {
	.v-input__append-inner {
		margin-top: 0px !important;
	}
	div .v-input__slot div .v-select__selection {
		margin: 0;
	}
}

.posts_etc {
	.v-btn {
		border-radius: 11px;
	}
}
.sticky_wrap_type {
	padding-bottom: 50px;
}

.basic_content {
	margin-bottom: 0;
}
</style>
