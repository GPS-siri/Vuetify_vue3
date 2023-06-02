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
							공지사항
						</div>
					</div>
				</v-layout>
			</div>

			<v-layout justify-center class="basic_content">
				<div class="pb-4 basic_content_wrap">
					<div class="mb-4">
						<v-text-field
							:autofocus="false"
							class="search-textfiled"
							placeholder="검색어를 입력하세요"
							hideDetails
							maxlength="255"
							append-icon="mdi-magnify"
							@click:append="notices"
							@keyup.enter="notices"
							flat
							dense
							color="primary2"
							v-model="search"
							autocomplete="off"
						></v-text-field>
					</div>
					<v-layout class="mt-2 mb-3 mx-5">
						<div class="manage_table_result">
							전체 <span class="ml-2 mr-1" style="#633EFD">{{ desserts.length }}</span> 건
						</div>
					</v-layout>
					<v-data-table
						:headers="headers"
						:items="desserts"
						mobile-breakpoint="100"
						class="elevation-0 dashboard-table talk_table_font mx-5"
						@click:row="openNotice"
						:single-expand="true"
						:expanded.sync="expanded"
						disable-sort
						:footer-props="{ itemsPerPageText: '' }"
					>
						<!-- show-expand -->
						<template v-slot:expanded-item="{ headers, item }">
							<td :colspan="headers.length" class="expand_wrap">
								<v-layout align-center class="mt-2">
									<v-flex style="width:30%; text-align:end; margin-bottom:auto"> 제목 :</v-flex>
									<v-flex class="pl-1 mr-2" style="width:70%;">{{ item.title }}</v-flex>
								</v-layout>
								<v-layout align-center class="mt-2">
									<v-flex style="width:30%; text-align:end; margin-bottom:auto"> 내용 :</v-flex>
									<v-flex class="pl-1" style="width:70%;">
										<div class="expand_image_wrap mr-2" v-html="item.content"></div>
									</v-flex>
								</v-layout>
								<v-layout v-if="item.file" align-center class="py-2 mx-2" style="border-top:1px solid #E8E8E8">
									<v-flex style="width:30%; text-align:end; margin-bottom:auto"> 첨부파일 :</v-flex>
									<v-flex class="pl-1 mr-2" style="width:70%;" @click="download">{{ item.file ? item.file.name : '' }}</v-flex>
								</v-layout>
							</td>
						</template>
						<template v-slot:[`item.created_at`]="{ item }">
							<div>
								{{ $moment(item.created_at).format('YYYY-MM-DD') }}
							</div>
						</template>
						<template v-slot:[`item.title`]="{ item }">
							<div>
								<!-- <v-badge color="green" left content="new" v-if="$moment().diff($moment(item.created_at), 'days') < 8"> -->
								<!-- </v-badge> -->
								<v-layout v-if="item.fixYn" align-center>
									<v-img
										lazy-src="https://picsum.photos/id/11/10/6"
										max-height="12"
										max-width="12"
										src="@/assets/images/ico/clip.png"
									></v-img>
									<v-flex ml-1 v-if="item.title.length > 20">
										{{ item.title.substring(0, 15) + '...' }}
									</v-flex>
									<v-flex ml-1 v-else>
										{{ item.title }}
									</v-flex>
								</v-layout>
								<v-layout v-else-if="$moment().diff($moment(item.created_at), 'days') < 8" align-center>
									<!-- <v-img lazy-src="" width="15" height="15" src="@/assets/images/ico/clip.png"></v-img> -->
									<v-img
										lazy-src="https://picsum.photos/id/11/10/6"
										max-height="12"
										max-width="12"
										src="@/assets/images/ico/n_mark.png"
									></v-img>
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
					</v-data-table>
				</div>
			</v-layout>
		</div>
	</div>
</template>
<script>
export default {
	components: {},
	data() {
		return {
			noticeDialog: {
				open: false,
				title: '',
				content: '',
				created_at: '',
				file: {},
			},
			headers: [
				{
					text: '날짜',
					align: 'center',
					value: 'created_at',
					width: '30%',
				},
				{ text: '제목', value: 'title', align: 'left', width: '70%' },
			],
			expanded: [],
			desserts: [],
			search: '',
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
		}
	},
	created() {
		this.notices()
	},
	methods: {
		download() {
			const url = process.env.VUE_APP_BACKEND_URL + this.expanded[0].file.url
			const link = document.createElement('a')
			link.href = url
			link.target = '_blank'
			link.download = this.expanded[0].file.name
			link.click()
			link.remove()
			window.URL.revokeObjectURL(url)
		},
		to_bizDashboard() {
			// 뒤로가기 버튼
			this.$router.push({
				name: 'counselorBizDashboard',
				params: { id: this.$route.params.id },
			})
		},
		notices() {
			const data = {
				business: this.$route.params.id,
				show: true,
				status: true,
			}
			if (this.search) {
				data['title'] = this.search
			}
			this.$store.dispatch('notices', data).then(res => {
				res.notices.sort((a, b) => {
					return new Date(b.created_at) - new Date(a.created_at)
				})

				res.notices.sort((a, b) => {
					return b.fixYn - a.fixYn
				})

				this.desserts = res.notices

				this.$store.state.countShow[3].count1 = res.notices.filter(x => this.$moment().diff(this.$moment(x.created_at), 'days') < 8).length
				this.$store.state.countShow[3].count2 = localStorage.getItem('readNotice')
					? res.notices.length - (localStorage.getItem('readNotice').split(',').length - 1)
					: res.notices.length
				this.$store.state.countShow[3].count3 = res.notices.length
			})
		},
		openNotice(item) {
			if (this.expanded.length > 0 && this.expanded[0].id === item.id) {
				this.expanded = []
			} else {
				this.expanded = [item]
			}
		},
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
</style>
