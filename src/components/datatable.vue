<template>
	<div
		:class="excelUseYn === 'true' ? datatable.class : `datatablehover2 ${datatable.class}`"
		class="datatablehover"
		style="position:relative"
	>
		<v-data-table
			calculate-widths
			show-current-page
			:value="selected"
			:fixed-header="datatable.header_fixed"
			:headers="datatable.headers"
			:items="datatable.items"
			:hide-default-footer="datatable.hidedefaultfooter"
			:page.sync="datatable.page"
			:items-per-page.sync="datatable.itemPerPage"
			@page-count="datatable.pageCount = $event"
			:show-select="datatable.showselect"
			:search="search"
			:item-key="datatable.itemKey"
			@click:row="$emit('click', $event)"
			@input="$emit('input', $event)"
			:height="datatable.height"
			:mobile-breakpoint="datatable.breakpoint ? '1960' : '600'"
			:disable-sort="datatable.disableSort"
			:class="datatable.disableSort ? 'noSort' : ''"
			:footer-props="{
				['items-per-page-text']: `• Total : ${datatable.items.length}`,
				['page-text']: ` 1 - ${
					datatable.itemPerPage ? Math.ceil(datatable.items.length / datatable.itemPerPage) : Math.ceil(datatable.items.length / 10)
				} of ${datatable.page ? datatable.page : 1} `,
			}"
		>
			<template v-slot:[`item.visit`]="{}">
				<div>
					현장등록
				</div>
			</template>

			<template v-slot:[`item.phone`]="{ item }">
				<div v-if="item.phone">
					{{ item.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) }}
				</div>
			</template>
			<template v-slot:[`item.reserveGroupCode`]="{ item }">
				<div v-if="item.reserveGroupCode">
					{{ item.groupData[item.groupData.map(x => x.qrcode).indexOf(item.reserveGroupCode)].title }}
				</div>
			</template>
			<template v-slot:[`item.0_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['0_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['0_label']">
						{{ `${item['0']} (${item['0'] > 0 ? ((item['0'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.1_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['1_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['1_label']">
						{{ `${item['1']} (${item['1'] > 0 ? ((item['1'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.2_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['2_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['2_label']">
						{{ `${item['2']} (${item['2'] > 0 ? ((item['2'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.3_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['3_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['3_label']">
						{{ `${item['3']} (${item['3'] > 0 ? ((item['3'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.4_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['4_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['4_label']">
						{{ `${item['4']} (${item['4'] > 0 ? ((item['4'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.5_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['5_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['5_label']">
						{{ `${item['5']} (${item['5'] > 0 ? ((item['5'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.6_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['6_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['6_label']">
						{{ `${item['6']} (${item['6'] > 0 ? ((item['6'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.7_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['7_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['7_label']">
						{{ `${item['7']} (${item['7'] > 0 ? ((item['7'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.8_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['8_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['8_label']">
						{{ `${item['8']} (${item['8'] > 0 ? ((item['8'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.9_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['9_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['9_label']">
						{{ `${item['9']} (${item['9'] > 0 ? ((item['9'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.10_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['10_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['10_label']">
						{{ `${item['10']} (${item['10'] > 0 ? ((item['10'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.11_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['11_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['11_label']">
						{{ `${item['11']} (${item['11'] > 0 ? ((item['11'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.12_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['12_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['12_label']">
						{{ `${item['12']} (${item['12'] > 0 ? ((item['12'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.13_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['13_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['13_label']">
						{{ `${item['13']} (${item['13'] > 0 ? ((item['13'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.14_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['14_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['14_label']">
						{{ `${item['14']} (${item['14'] > 0 ? ((item['14'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.15_reservevisit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['15_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['15_label']">
						{{ `${item['15']} (${item['15'] > 0 ? ((item['15'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.0_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['0_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['0_label']">
						{{ `${item['0']} (${item['0'] > 0 ? ((item['0'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.1_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['1_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['1_label']">
						{{ `${item['1']} (${item['1'] > 0 ? ((item['1'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.2_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['2_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['2_label']">
						{{ `${item['2']} (${item['2'] > 0 ? ((item['2'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.3_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['3_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['3_label']">
						{{ `${item['3']} (${item['3'] > 0 ? ((item['3'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.4_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['4_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['4_label']">
						{{ `${item['4']} (${item['4'] > 0 ? ((item['4'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.5_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['5_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['5_label']">
						{{ `${item['5']} (${item['5'] > 0 ? ((item['5'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.6_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['6_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['6_label']">
						{{ `${item['6']} (${item['6'] > 0 ? ((item['6'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.7_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['7_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['7_label']">
						{{ `${item['7']} (${item['7'] > 0 ? ((item['7'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.8_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['8_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['8_label']">
						{{ `${item['8']} (${item['8'] > 0 ? ((item['8'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.9_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['9_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['9_label']">
						{{ `${item['9']} (${item['9'] > 0 ? ((item['9'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.10_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['10_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['10_label']">
						{{ `${item['10']} (${item['10'] > 0 ? ((item['10'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.11_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['11_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['11_label']">
						{{ `${item['11']} (${item['11'] > 0 ? ((item['11'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.12_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['12_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['12_label']">
						{{ `${item['12']} (${item['12'] > 0 ? ((item['12'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.13_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['13_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['13_label']">
						{{ `${item['13']} (${item['13'] > 0 ? ((item['13'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.14_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['14_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['14_label']">
						{{ `${item['14']} (${item['14'] > 0 ? ((item['14'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.15_visit`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						{{ item['15_label'] }}
					</div>
					<div class="count py-2 label" v-if="item['15_label']">
						{{ `${item['15']} (${item['15'] > 0 ? ((item['15'] / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.noAnswer`]="{ item }">
				<div class="reserveTd">
					<div class="py-1 label">
						무응답
					</div>
					<div class="count py-2 label">
						{{ `${item.noAnswer ? item.noAnswer : 0} (${item.noAnswer > 0 ? ((item.noAnswer / item['Sum']) * 100).toFixed(0) : 0})%` }}
					</div>
				</div>
			</template>
			<template v-slot:[`item.message_1`]="{ item }">
				<div>
					{{ item.message_1.substring(item.message_1.indexOf('[') + 1, item.message_1.indexOf(']')) }}
				</div>
			</template>
			<template v-slot:[`item.systemDate`]="{ item }">
				<div>
					{{ item.sdate | moment('YYYY-MM-DD') }} ~ {{ item.edate | moment('YYYY-MM-DD') }}
					<span class="ml-2">
						{{ Math.abs($moment(item.sdate).diff($moment(item.edate), 'days')) }}
					</span>
					일간
				</div>
			</template>
			<template v-slot:[`item.reserveday`]="{ item }">
				<div>
					{{ item.reservedays.map(x => x.title).join(', ') }}
				</div>
			</template>

			<template v-slot:[`item.cancel_visit`]="{ item }">
				<div v-if="item.status === 2">{{ item.updated_at | moment('YYYY-MM-DD HH:mm') }}</div>
			</template>
			<template v-slot:[`item.state_visit_date`]="{ item }">
				<div v-if="item.state === 'visit'">{{ item.updated_at | moment('YYYY-MM-DD HH:mm') }}</div>
			</template>
			<template v-slot:[`item.state_visit`]="{ item }">
				<div :class="item.state === 'reserve' ? '' : 'success--text'" v-if="item.status !== 2">
					{{ item.state === 'reserve' ? '미방문' : '방문' }}
				</div>
				<div class="error--text" v-else>취소</div>
			</template>
			<template v-slot:[`item.range`]="{ item }">
				<div v-if="item.sdate !== '-'">{{ item.sdate | moment('YYYY-MM-DD') }} ~ {{ item.edate | moment('YYYY-MM-DD') }}</div>
				<div v-else>-</div>
			</template>

			<template v-slot:[`item.range_camapign`]="{ item }">
				<div>
					{{ item.range_camapign }}
				</div>
			</template>

			<template v-slot:[`item.businesses_title`]="{ item }">
				<div>
					{{ item.businesses.map(x => x.title).join(', ') }}
				</div>
			</template>
			<template v-slot:[`item.history_length`]="{ item }">
				<div>{{ item.history ? item.history.length - 1 : '0' }}건</div>
			</template>
			<template v-slot:[`item.showing`]="{ item }">
				<div>
					{{ item.stat === 1 ? '사용' : '미사용' }}
				</div>
			</template>
			<template v-slot:[`item.user_name`]="{ item }">
				<div>
					{{ item.name }}
				</div>
			</template>

			<template v-slot:[`item.winner`]="{ item }">
				<div :class="item.winner ? 'success--text' : 'error--text'">
					{{ item.winner ? '당첨' : '미당첨' }} {{ item.winner ? '(' + item.winnterProduct + ')' : '' }}
				</div>
			</template>
			<template v-slot:[`item.receiptDate`]="{ item }">
				<div>
					{{
						item.receiptDate
							? $moment(item.receiptDate)
									.subtract(9, 'h')
									.format('YYYY-MM-DD HH:mm')
							: ''
					}}
				</div>
			</template>
			<template v-slot:[`item.created_at_time`]="{ item }">
				<div v-if="item.created_at">
					{{ item.created_at | moment('YYYY-MM-DD HH:mm') }}
				</div>
			</template>
			<template v-slot:[`item.updated_at_time`]="{ item }">
				<div>
					{{ item.updated_at | moment('YYYY-MM-DD HH:mm') }}
				</div>
			</template>
			<template v-slot:[`item.created_at`]="{ item }">
				<div>
					{{ item.created_at | moment('YYYY-MM-DD') }}
				</div>
			</template>
			<template v-slot:[`item.updated_at`]="{ item }">
				<div>
					{{ item.updated_at | moment('YYYY-MM-DD') }}
				</div>
			</template>

			<!-- bizCounselor -->
			<!-- <template v-slot:[`item.name`]="{ item }">
				<v-layout class="nomal-input px-2" style=" max-width:200px !important; border:none !important;">
					<div class="bizInput">
						<v-text-field
							maxlength="255"
							v-model="item.name"
							:hide-details="true"
							:outlined="true"
							type="text"
							:autofocus="true"
							:autocomplete="true"
							placeholder="상담사명"
							dense
						>
						</v-text-field>
					</div>
				</v-layout>
			</template> -->
			<!-- bizCounselor -->
			<template v-slot:[`item.seat`]="{ item }">
				<v-layout class="nomal-input px-2" style=" max-width:200px !important; border:none !important;">
					<div class="bizInput">
						<v-text-field
							v-model="item.seat"
							:hide-details="true"
							:outlined="true"
							type="Number"
							:autofocus="true"
							:autocomplete="true"
							placeholder="상담석"
							dense
							:max="99"
							:oninput="
								99
									? 'if(Number(this.value) > Number(this.max)) this.value = this.max'
									: 'if(Number(this.value) > Number(this.max)) this.value = null'
							"
						>
						</v-text-field>
					</div>
				</v-layout>
			</template>
			<template v-slot:[`item.counselorName`]="{ item }">
				<v-layout class="nomal-input px-2" style=" max-width:200px !important; border:none !important;">
					<div class="bizInput">
						<v-text-field
							v-model="item.counselorName"
							:hide-details="true"
							:outlined="true"
							type="text"
							:autofocus="true"
							:autocomplete="true"
							dense
							:max="99"
						>
						</v-text-field>
					</div>
				</v-layout>
			</template>
			<!-- bizCounselor -->
			<!-- <template v-slot:[`item.counselorid`]="{ item }">
				<v-layout class="nomal-input px-2" style=" max-width:200px !important; border:none !important;">
					<div class="bizInput">
						<v-text-field
							maxlength="255"
							v-model="item.counselorid"
							:hide-details="true"
							:outlined="true"
							type="text"
							:autofocus="true"
							:autocomplete="true"
							placeholder="아이디"
							dense
						>
						</v-text-field>
					</div>
				</v-layout>
			</template> -->
			<!-- bizCounselor -->
			<!-- bizCounselor -->
			<template v-slot:[`item.actionCounselor`]="{ item, index }">
				<v-layout justify-center>
					<div>
						<v-btn @click="apply(item, index)" class="mx-2 applyBtn" color="#F3F3FF" size="small" height="27" elevation="0">적용</v-btn>
						<v-btn @click="applydelete(item, index)" class="mx-2 applyBtn" color="#F3F3FF" size="small" height="27" elevation="0"
							>삭제</v-btn
						>
					</div>
				</v-layout>
			</template>
			<!-- Password -->
			<template v-slot:[`item.Password`]="{ item }">
				<v-layout>
					<!-- {{ item.indexOf(item.id) }} -->
					<div class="password_btn" @click="setIndexNum(item.userId)">
						<v-btn class="" @click="pwchange(item)" depressed>CHANGE</v-btn>
					</div>
				</v-layout>
			</template>

			<!-- Action -->
			<template v-slot:[`item.Action`]="{ item }">
				<v-layout>
					<div v-if="$store.state.meData.id !== item.lgnid" class="action_btn" @click="setIndexNum(item.userId)">
						<v-btn class="" @click="deleteacskey(item)" depressed>Delete</v-btn>
					</div>
				</v-layout>
			</template>

			<!-- Access -->
			<template v-slot:[`item.accessPermission`]="{ item }">
				<v-layout style="height:38;px">
					<div>
						<v-switch
							v-model="item.accessPermission"
							:color="$store.state.PointColor2"
							@change="accessChange(item, item.accessPermission)"
						></v-switch>
					</div>
				</v-layout>
			</template>

			<!-- img FIle -->
			<template v-slot:[`item.imgUpload`]="{ item }">
				<v-layout style="height:38;px " justify-center>
					<div v-for="(img, i) in item.imgUpload" :key="i" class="mr-2">
						<v-img width="40" :src="img" @click="showUsesImg(item.imgUpload)"></v-img>
					</div>
				</v-layout>
			</template>

			<!-- stat -->
			<template v-slot:[`item.stat`]="{ item }">
				<div
					v-if="$route.name == 'counselor-management' && item.stat == false"
					:class="item.stat == false ? ['dt-align-set', 'font-red'] : ['dt-align-set']"
				>
					휴무
				</div>
				<div
					v-else-if="$route.name == 'counselor-management' && item.stat == true"
					:class="item.stat == true ? ['dt-align-set', 'font-green'] : ['dt-align-set']"
				>
					근무
				</div>
				<div
					v-else-if="$route.name == 'businessSiteManagement' && item.stat == false"
					:class="item.stat == false ? ['dt-align-set', 'font-red'] : ['dt-align-set']"
				>
					휴무
				</div>
				<!-- protect 상담사 관리- 상태 -->
				<div
					v-else-if="$route.name == 'businessSiteManagement' && item.stat == true && item.stat !== 1"
					:class="item.stat == true ? ['dt-align-set', 'font-green'] : ['dt-align-set']"
				>
					근무
				</div>
				<div v-else-if="$route.name === 'notification'" :class="item.stat === 0 ? 'success--text' : 'error--text'">
					{{ statText2(item.stat) }}
				</div>
				<!-- protect 알림톡 관리- 사용 -->
				<div v-else-if="$route.name === 'boardNotification'" :class="item.stat === 0 ? 'success--text' : 'error--text'">
					{{ statText2(item.stat) }}
				</div>
				<!-- <div v-else-if="$route.name == 'waiting' && item.stat === 0" :class="item.stat == 0 ? '' : ['dt-align-set']">
					상담중
				</div> -->
				<div v-else-if="($route.name == 'waiting' || $route.name == 'customerManagement') && item.stat === 0">상담 예약</div>
				<div v-else-if="($route.name == 'waiting' || $route.name == 'customerManagement') && item.stat === 1">상담중</div>
				<div
					v-else-if="($route.name == 'waiting' || $route.name == 'customerManagement') && item.stat === 2"
					:class="item.stat == 2 ? ['font-red'] : ['dt-align-set']"
				>
					미처리
				</div>
				<div
					v-else-if="($route.name == 'waiting' || $route.name == 'customerManagement') && item.stat === 9"
					:class="item.stat == 9 ? ['font-green'] : ['dt-align-set']"
				>
					상담 완료
				</div>

				<div v-else :class="item.stat === 1 ? 'success--text' : 'error--text'">
					{{ statText(item.stat) }}
				</div>
			</template>
			<!-- status -->
			<template v-slot:[`item.status`]="{ item }">
				<div
					v-if="item.status === null || item.status === 1"
					:class="item.status == null || 1 ? ['dt-align-set', 'font-green'] : ['dt-align-set']"
				>
					정상
				</div>
				<div v-if="item.status === 2" :class="item.status == 2 ? ['dt-align-set', 'font-red'] : ['dt-align-set']">
					예약취소
				</div>
			</template>
			<!-- No -->
			<template v-slot:[`item.No`]="{ index }">
				<div>
					{{ index + 1 }}
				</div>
			</template>
			<!-- talk_no -->
			<template v-slot:[`item.talk_no`]="{ index }">
				<div>
					{{ (datatable.items.length = index + 1) }}
				</div>
			</template>

			<!-- 상담항목 관리 페이지 -> 순서 -->
			<template v-slot:[`item.listorder`]="{ item }">
				<div class="dt-align-set">
					{{ item.listorder }}
				</div>
			</template>

			<!-- 상담사 관리페이지 -> 권한 -->
			<template v-slot:[`item.authority`]="{ item }">
				<div class="dt-align-set">{{ authorityText(item.authority) }}</div>
			</template>
			<template v-if="$route.name === 'COUNSELORPAGE'" v-slot:[`item.rdate`]="{ item }">
				<div v-if="item.rdate">
					{{ item.rdate | moment('subtract', '18 hours', 'YYYY-MM-DD HH:mm') }}
				</div>
			</template>
			<template v-else v-slot:[`item.rdate`]="{ item }">
				<div v-if="item.rdate">
					{{ item.rdate | moment('subtract', '9 hours', 'YYYY-MM-DD HH:mm:ss') }}
				</div>
			</template>
			<template v-slot:[`item.cdate`]="{ item }">
				<div>
					{{ item.cdate | moment('subtract', '9 hours', 'YYYY-MM-DD HH:mm:ss') }}
				</div>
			</template>

			<!-- 상담사 관리페이지 -> 상담석 -->
			<!-- <template v-slot:[`item.seat`]="{ item }">
				<div class="dt-align-set">
					{{ item.seat }}
				</div>
			</template> -->

			<!-- 상담사 관리페이지 -> 상담원명 -->
			<!-- <template v-slot:[`item.name`]="{ item }">
				<div
					:style="`color:${$store.state.PointColor2}`"
					class="nameEvent"
					@click="nameClick(item)"
					v-if="$route.name === 'customer' || $route.name === 'trackingCode' || $route.name === 'waiting'"
				>
					{{ item.name }}
				</div>

				<div v-else>
					{{ item.name }}
				</div>
			</template> -->

			<!-- 방문예약 관리 관리페이지 -> 시작일 -->
			<template v-slot:[`item.sdate`]="{ item }">
				<div class="dt-align-set">
					{{ item.sdate }}
				</div>
			</template>

			<!-- 방문예약 관리 관리페이지 -> 종료일 -->
			<template v-slot:[`item.edate`]="{ item }">
				<div class="dt-align-set">
					{{ item.edate }}
				</div>
			</template>

			<!-- 방문예약 관리 관리페이지 -> 최대예약 -->
			<template v-slot:[`item.maxcount`]="{ item }">
				<div class="dt-align-set">
					{{ item.maxcount }}
				</div>
			</template>

			<!-- 방문예약 관리 관리페이지 -> 동행인원 -->
			<template v-slot:[`item.companion`]="{ item }">
				<div class="dt-align-set">
					{{ item.companion }}
				</div>
			</template>

			<!-- ---- issue --- -->
			<template v-slot:[`item.isuse`]="{ item }">
				<div class="dt-align-set" v-if="$route.name == 'campaign'">
					{{ isuseCampaign(item.isuse) }}
				</div>
				<div class="dt-align-set" v-else>
					{{ isuseText(item.isuse) }}
				</div>
			</template>
			<template v-slot:[`item.type_history`]="{ item }">
				<div>
					{{ item.type }}
				</div>
			</template>
			<!-- ---- 알림톡관리 -> type --- -->
			<template v-slot:[`item.type`]="{ item }">
				<div v-if="$route.name == 'terms'">
					{{ typeTerm(item.type) }}
				</div>
				<div v-else>
					{{ typeText(item.type) }}
				</div>
			</template>
			<template v-slot:[`item.typeTerm`]="{ item }">
				<div>
					{{ typeTerm(item.type) }}
				</div>
			</template>
			<!-- ---- 등록고객 관리 -- 개인정보동의 --- -->
			<template v-slot:[`item.ispersonal`]="{ item }">
				<div class="dt-align-set">
					{{ agreeType(item.ispersonal) }}
				</div>
			</template>
			<!-- ---- 등록고객 관리 -- 마케팅동의 --- -->
			<template v-slot:[`item.ismarketing`]="{ item }">
				<div class="dt-align-set">
					{{ agreeType(item.ismarketing) }}
				</div>
			</template>
			<!-- ---- 사용자 관리-- confirmed --- -->
			<template v-slot:[`item.confirmed`]="{ item }">
				<div class="dt-align-set">
					{{ authoredType(item.confirmed) }}
				</div>
			</template>
			<!-- ---- 사용자 관리-- blocked --- -->
			<template v-slot:[`item.blocked`]="{ item }">
				<div class="dt-align-set">
					{{ authoredType(item.blocked) }}
				</div>
			</template>
			<template v-slot:[`item.mainimg`]="{ item }">
				<v-btn
					v-if="item.mainimg"
					x-small
					depressed
					dark
					:color="$store.state.PointColor2"
					@click="backServerClick($store.state.backServer, item)"
					>바로가기</v-btn
				>
			</template>
			<!-- Num -->
			<template v-slot:[`item.Num`]="{ item, index }">
				<div class="dt-align-set" v-show="!item.Num">{{ index + 1 }}</div>
			</template>
			<!-- channelList -->
			<template v-slot:[`item.collect`]="{ item }">
				<btn v-if="item.feedType === 2" :btn="collectBtn" btn_txt="Collect" @click="clickCollectBtn" />
			</template>

			<!-- logo -->
			<template v-slot:[`item.logoUrl`]="{ item }">
				<v-img style="background-color:grey;" max-height="30" max-width="40" :src="item.logoUrl" lazy-src="../assets/image.png"></v-img>
			</template>
			<!-- code -->
			<template v-slot:[`item.code`]="{ item }">
				<a :href="reserveDayHost + item.groupcode + '/' + item.code" target="_blank" v-if="$route.name === 'reservation'">
					{{ item.groupcode + '/' + item.code }}
				</a>
				<a :href="trackingCodeHost + '/myQr/' + item.code" target="_blank" v-if="$route.name === 'trackingCode'">
					{{ item.code }}
				</a>
				<a :href="reserveVisitHost + item.groupcode + '/' + item.code" target="_blank" v-if="$route.name === 'campaign'">
					{{ item.groupcode + '/' + item.code }}
				</a>
				<div v-if="$route.name === 'temperature'">
					{{ item.code }}
				</div>
				<!-- protect 방문예약관리 -  사업지 url -->
				<v-btn
					x-small
					depressed
					dark
					:color="$store.state.PointColor2"
					@click="reservedayClick(reserveDayHost, item)"
					v-if="$route.name === 'reservationManagement'"
					>바로가기</v-btn
				>
			</template>

			<template v-slot:[`item.codeDirect`]="{ item }">
				<a :href="reserveDirectHost + item.groupcode + '/' + item.code" target="_blank" v-if="$route.name === 'reservation'">
					{{ item.groupcode + '/' + item.code }}
				</a>
				<!-- protect 방문예약관리 -  다이렉트 url -->
				<v-btn
					x-small
					depressed
					dark
					:color="$store.state.PointColor2"
					@click="reservedirectClick(reserveDirectHost, item)"
					v-if="$route.name === 'reservationManagement'"
					>바로가기</v-btn
				>
			</template>
			<!-- 캠페인 url -->
			<template v-slot:[`item.campCode`]="{ item }">
				<v-btn x-small depressed dark :color="$store.state.PointColor2" @click="reservevisitClick(reserveVisitHost, item)">바로가기</v-btn>
			</template>
			<!-- enter QR -->
			<template v-slot:[`item.enterQR`]="{ item }">
				<v-btn x-small depressed dark :color="$store.state.PointColor2" @click="enterQRClick(enterQRHost, item)">바로가기</v-btn>
			</template>

			<!-- counsel QR -->
			<template v-slot:[`item.counselQR`]="{ item }">
				<v-btn x-small depressed dark :color="$store.state.PointColor2" @click="counselQRClick(counselQRHost, item)">바로가기</v-btn>
			</template>

			<!-- counsel QR -->
			<template v-slot:[`item.board`]="{ item }">
				<v-btn x-small depressed dark :color="$store.state.PointColor2" @click="boardHostClick(boardHost, item)">바로가기</v-btn>
			</template>

			<template v-slot:[`item.counseler`]="{ item }">
				<v-btn x-small depressed dark :color="$store.state.PointColor2" @click="counselerClick(counselser, item)">바로가기</v-btn>
			</template>
			<!-- image -->
			<template v-slot:[`item.image`]="{ item }">
				<v-img max-height="40" max-width="100" :src="item.image"></v-img>
			</template>

			<template v-slot:[`item.imageUrl`]="{ item }">
				<v-img max-height="40" max-width="100" :src="item.imageUrl"></v-img>
			</template>

			<template v-slot:[`item.startTime`]="{ item }">
				{{ item.startTime | moment('HH:mm') }}
			</template>

			<template v-slot:[`item.joinStatus`]="{ item }">
				<div :class="item.joinStatus === '꽝' ? '' : 'success--text'">
					{{ item.joinStatus }}
				</div>
			</template>

			<!-- action -->
			<template v-slot:[`item.action`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<v-btn
						v-if="$store.state.meData.username !== item.username"
						class="ml-2"
						small
						@click="editacskey(item)"
						dark
						:color="$store.state.PointColor2"
						depressed
						>수정</v-btn
					>
					<v-btn
						v-if="$store.state.meData.username !== item.username"
						class="ml-2"
						small
						@click="deleteacskey(item)"
						dark
						:color="$store.state.PointColor2"
						depressed
						>삭제</v-btn
					>
					<!-- <btn :btn="editBtn" btn_txt="수정" :click="clickEditBtn" /> -->
					<!-- <btn :btn="deleteBtn" btn_txt="삭제" class="right-btn" :click="clickDeleteBtn" /> -->
				</v-layout>
			</template>
			<!-- etc -->
			<template v-slot:[`item.etc`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<v-btn class="ml-2" small @click="nameClick(item)" dark :color="$store.state.PointColor2" depressed>이력보기</v-btn>
					<!-- <v-btn class="ml-2" small @click="deleteacskey(item)" dark :color="$store.state.PointColor2" depressed>삭제</v-btn> -->
					<!-- <btn :btn="editBtn" btn_txt="수정" :click="clickEditBtn" /> -->
					<!-- <btn :btn="deleteBtn" btn_txt=right-btn" :click="clickDeleteBtn" /> -->
				</v-layout>
			</template>
			<template v-slot:[`item.etcQR`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<v-btn
						class="ml-2"
						small
						@click=";($store.state.datatableItem = item), $emit('sendQR', $event)"
						dark
						:color="$store.state.PointColor2"
						depressed
						>QR</v-btn
					>
					<v-btn class="ml-2" small @click="nameClick(item)" dark :color="$store.state.PointColor2" depressed>이력보기</v-btn>
					<!-- <v-btn class="ml-2" small @click="deleteacskey(item)" dark :color="$store.state.PointColor2" depressed>삭제</v-btn> -->
					<v-btn class="ml-2" small @click="saveImg(item)" dark :color="$store.state.PointColor2" depressed>이미지</v-btn>
					<!-- <btn :btn="editBtn" btn_txt="수정" :click="clickEditBtn" /> -->
					<!-- <btn :btn="deleteBtn" btn_txt=right-btn" :click="clickDeleteBtn" /> -->
				</v-layout>
			</template>
			<!-- etc1 -->
			<template v-slot:[`item.etc1`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<v-btn
						v-if="$store.state.meData.username !== item.username"
						class="ml-2"
						small
						@click="nameClick(item)"
						dark
						:color="$store.state.PointColor2"
						depressed
						>이력보기</v-btn
					>

					<!-- <btn :btn="editBtn" btn_txt="수정" :click="clickEditBtn" /> -->
					<!-- <btn :btn="deleteBtn" btn_txt=click="clickDeleteBtn" /> -->
				</v-layout>
			</template>

			<template v-slot:[`item.actionReservationManagement`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<v-btn
						v-if="$store.state.meData.username !== item.username"
						class="ml-2"
						small
						@click="deleteacskey(item)"
						dark
						:color="$store.state.PointColor2"
						depressed
						>Delete</v-btn
					>
				</v-layout>
			</template>
			<!-- Only Edit -->
			<template v-slot:[`item.edit`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<v-btn v-if="$store.state.meData.username !== item.username" class="ml-2" small @click="editacskey(item)" depressed>Edit</v-btn>
					<selectBox3 :sel="item.sel" @change="qrChange(item), $emit('changeQR', $event)"></selectBox3>
					<btn :btn="editBtn" btn_txt="QRsend" @click=";($store.state.datatableItem = item), $emit('sendQR', $event)" />
					<!-- <btn :btn="deleteBtn" btn_txt=lickDeleteBtn" /> -->
				</v-layout>
			</template>
			<template v-slot:[`item.etc_edit`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<v-btn class="detail_etc_btn" small @click="detailClick(item)" :color="'#9A9C9B'" depressed>수정</v-btn>

					<!-- <btn :btn="editBtn" btn_txt="수정" :click="clickEditBtn" /> -->
					<!-- <btn :btn="deleteBtn" btn_txt=click="clickDeleteBtn" /> -->
				</v-layout>
			</template>
			<!-- 시슴템 관리 - 사용자 관리 - 자세히 보기 -->
			<template v-slot:[`item.etc_detail`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<v-btn class="detail_etc_btn" small @click="detailClick(item)" :color="'#9A9C9B'" depressed>자세히 보기</v-btn>

					<!-- <btn :btn="editBtn" btn_txt="수정" :click="clickEditBtn" /> -->
					<!-- <btn :btn="deleteBtn" btn_txt=click="clickDeleteBtn" /> -->
				</v-layout>
			</template>
			<template v-slot:[`item.preview`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<v-btn class="detail_etc_btn mr-2" small @click="previewClick(item)" :color="'#9A9C9B'" depressed>미리보기</v-btn>
				</v-layout>
			</template>
			<!-- 시슴템 관리 - 알림톡 관리 - 미리보기 + 자세히 보기 -->
			<template v-slot:[`item.etc_detail_preview`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<!-- <v-btn class="detail_etc_btn" small @click="previewClick(item)" :color="'#9A9C9B'" depressed>미리보기</v-btn> -->
					<v-btn class="detail_etc_btn mr-2" small @click="previewClick(item)" :color="'#9A9C9B'" depressed>미리보기</v-btn>
					<v-btn class="detail_etc_btn ml-3" small @click="detailClick(item)" :color="'#9A9C9B'" depressed>자세히 보기</v-btn>
				</v-layout>
			</template>

			<!-- 시슴템 관리 - 항목 관리 - 적용 + 항목편집 -->
			<template v-slot:[`item.etc_apply_edit`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<!-- <v-btn class="detail_etc_btn" small @click="previewClick(item)" :color="'#9A9C9B'" depressed>미리보기</v-btn> -->
					<v-btn class="detail_apply_btn mr-2" small @click="applyclick(item)" :color="'#9A9C9B'" depressed>적용</v-btn>
					<v-btn class="detail_apply_btn " small @click="detailClick(item)" :color="'#9A9C9B'" depressed>항목 편집</v-btn>
				</v-layout>
			</template>

			<!-- 시슴템 관리 - 항목 관리 - 적용 + 항목편집 -->
			<template v-slot:[`item.etc_apply`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<!-- <v-btn class="detail_etc_btn" small @click="previewClick(item)" :color="'#9A9C9B'" depressed>미리보기</v-btn> -->
					<v-btn class="detail_apply_btn mr-2" small @click="applyclick(item)" :color="'#9A9C9B'" depressed>적용</v-btn>
				</v-layout>
			</template>

			<!-- 시슴템 관리 - 항목 관리 - 적용 + 항목편집 -->
			<template v-slot:[`item.useYn`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<selectBox :sel="item.useYn" @change="change_default"></selectBox>
					<!-- <btn :btn="deleteBtn" btn_txt=lickDeleteBtn" /> -->
				</v-layout>
			</template>

			<!-- 캠페인 관리 - 거점 캠페인 관리  - 캠페인 URL -->
			<template v-slot:[`item.campaign_url`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center v-show="item.id">
					<!-- <v-btn class="detail_etc_btn" small @click="previewClick(item)" :color="'#9A9C9B'" depressed>미리보기</v-btn> -->
					<v-btn class="detail_etc_btn mr-2" small @click="$emit('campaign_url', item, 'QR')" :color="'#9A9C9B'" depressed>QR Code</v-btn>
					<v-btn class="detail_etc_btn mr-2" small @click="$emit('campaign_url', item, 'navigate')" :color="'#9A9C9B'" depressed
						>바로가기</v-btn
					>
					<v-btn class="detail_etc_btn " small @click="$emit('campaign_url', item, 'copy')" :color="'#9A9C9B'" depressed>URL 복사</v-btn>
				</v-layout>
			</template>

			<!-- 캠페인 관리 - 거점 캠페인 관리 - 팝업 - 유형 선택 -->
			<template v-slot:[`item.group_type`]="{ item }">
				<v-layout class="dt-align-set" justify-center style="width: 110px;">
					<selectBox style="min-height:unset;" :sel="item.group_type" @change="qrChange(item)"></selectBox>
				</v-layout>
			</template>

			<!-- 캠페인 관리 - 거점 캠페인 관리 - 팝업 - 그룹명 입력  -->
			<template v-slot:[`item.title_txtField`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<txtField
						class="bizInput"
						v-model="item.title_txtField.value"
						:txtField="item.title_txtField.txtfield"
						style="height:27px; margin:auto; background-color:white; border-radius:5px;"
					></txtField>
				</v-layout>
			</template>

			<!-- 캠페인 관리 - 거점 캠페인 관리 - 사용/미사용 라디오 버튼  -->
			<template v-slot:[`item.etc_capmaign`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<v-radio-group v-model="item.etc_capmaign" hide-details row class="campaign_radio">
						<v-radio class="mb-0" label="사용" :value="true" color="#FB9C00" :ripple="false"></v-radio>
						<v-radio class="mb-0" label="미사용" :value="false" color="#FB9C00" :ripple="false"></v-radio>
					</v-radio-group>
				</v-layout>
			</template>
			<!-- 캠페인 관리 - 이벤트 관리 - 팝업 - 수량 입력  -->
			<template v-slot:[`item.number_txtField`]="{ item }">
				<v-layout class="dt-align-set" justify-center>
					<txtField
						class="bizInput"
						v-model="item.number_txtField.value"
						:txtField="item.number_txtField.txtfield"
						style="height:27px; margin:auto; background-color:white; border-radius:5px;"
					></txtField>
				</v-layout>
			</template>
			<!-- 캠페인 관리 - 예약 상담 관리 - 상담예약 확인  -->
			<template v-slot:[`item.wating_check`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<v-layout class="dt-align-set ml-0" justify-center>
						<v-btn class="detail_etc_btn mr-2" small @click="$emit('reservation_page', item, 'waiting_QR')" :color="'#9A9C9B'" depressed
							>QR Code</v-btn
						>
						<v-btn
							class="detail_etc_btn mr-2"
							small
							@click="$emit('reservation_page', item, 'wating_check_QR')"
							:color="'#9A9C9B'"
							depressed
							>바로가기</v-btn
						>
						<v-btn class="detail_etc_btn " small @click="$emit('reservation_page', item, 'wating_check_url')" :color="'#9A9C9B'" depressed
							>URL 복사</v-btn
						>
					</v-layout>
				</v-layout>
			</template>
			<!-- 캠페인 관리 - 예약 상담 관리 - 방문등록 확인  -->
			<template v-slot:[`item.reservation_check`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<v-btn class="detail_etc_btn mr-2" small @click="$emit('reservation_page', item, 'reservation_QR')" :color="'#9A9C9B'" depressed
						>QR Code</v-btn
					>
					<v-btn
						class="detail_etc_btn mr-2"
						small
						@click="$emit('reservation_page', item, 'reservation_check_QR')"
						:color="'#9A9C9B'"
						depressed
						>바로가기</v-btn
					>
					<v-btn
						class="detail_etc_btn "
						small
						@click="$emit('reservation_page', item, 'reservation_check_url')"
						:color="'#9A9C9B'"
						depressed
						>URL 복사</v-btn
					>
				</v-layout>
			</template>

			<!-- 캠페인 관리 - 예약 상담 관리 - 상담사 화면  -->
			<template v-slot:[`item.counselor_page`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<v-layout class="dt-align-set ml-0" justify-center>
						<v-btn
							class="detail_etc_btn mr-2"
							small
							@click="$emit('reservation_page', item, 'counselor_page_QR')"
							:color="'#9A9C9B'"
							depressed
							>바로가기</v-btn
						>
						<v-btn class="detail_etc_btn " small @click="$emit('reservation_page', item, 'counselor_page_url')" :color="'#9A9C9B'" depressed
							>URL 복사</v-btn
						>
					</v-layout>
				</v-layout>
			</template>

			<!-- 캠페인 관리 - 예약 상담 관리 - 상담현황판 -->
			<template v-slot:[`item.waiting_board`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<v-layout class="dt-align-set ml-0" justify-center>
						<v-btn
							class="detail_etc_btn mr-2"
							small
							@click="$emit('reservation_page', item, 'waiting_board_QR')"
							:color="'#9A9C9B'"
							depressed
							>바로가기</v-btn
						>
						<v-btn class="detail_etc_btn " small @click="$emit('reservation_page', item, 'waiting_board_url')" :color="'#9A9C9B'" depressed
							>URL 복사</v-btn
						>
					</v-layout>
				</v-layout>
			</template>

			<!-- 캠페인 관리 - 이벤트 관리 - 이벤트 정보 -->
			<template v-slot:[`item.event_url`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<v-layout class="dt-align-set ml-0" justify-center>
						<v-btn class="detail_etc_btn mr-2" small @click="$emit('event_page', item, 'event_QR')" :color="'#9A9C9B'" depressed
							>QR Code</v-btn
						>
						<v-btn class="detail_etc_btn mr-2" small @click="$emit('event_page', item, 'event_url_QR')" :color="'#9A9C9B'" depressed
							>바로가기</v-btn
						>
						<v-btn class="detail_etc_btn " small @click="$emit('event_page', item, 'event_url_url')" :color="'#9A9C9B'" depressed
							>URL 복사</v-btn
						>
					</v-layout>
				</v-layout>
			</template>

			<!-- 친구톡 관리 - 항목 관리 - 적용 + 항목편집 -->
			<!-- 시슴템 관리 - 알림톡 관리 - 미리보기 + 자세히 보기 -->
			<template v-slot:[`item.unsubscribe_change`]="{ item }">
				<v-layout class="dt-align-set ml-0" justify-center>
					<!-- <v-btn class="detail_etc_btn" small @click="previewClick(item)" :color="'#9A9C9B'" depressed>미리보기</v-btn> -->
					<v-btn width="80px" class="detail_etc_btn ml-3" small @click="$emit('unsubscribe_change', item)" :color="'#9A9C9B'" depressed>{{
						item.access ? '거부' : '허용'
					}}</v-btn>
				</v-layout>
			</template>
			<template v-slot:[`item.notice_status`]="{ item }">
				<v-layout class="dt-align-set ml-0 overflow_hidden" justify-center style="width:80px">
					<selectBox class="table_select_box" :sel="item.table_select" @change="tableStatus(item)"></selectBox>
				</v-layout>
			</template>

			<template v-slot:[`item.business_title`]="{ item }">
				<v-layout wrap>
					<div v-if="datatable.allBiz.length === item.business_title.length">
						전체 지점
					</div>
					<div v-else class="table_title_wrap py-1 px-2 mr-3" v-for="(biz, index) in item.business_title" :key="index">
						{{ biz.title }}
						<v-icon @click="removeBiz(item, biz)" class="table_icon">mdi-close</v-icon>
					</div>
				</v-layout>
			</template>

			<!-- 지점관리 - 상품관리 - 판매건수 -->
			<template v-slot:[`item.priceNum`]="{ item }">
				<div>
					{{ comma(item.clients.length) }}
				</div>
			</template>
		</v-data-table>

		<!--고객 관리 - 캠페인 고객 관리 - 자세히 보기 -->
		<!-- <template v-slot:[`item.etc_detail`]="{ item }">
			<v-layout class="dt-align-set" justify-center>
				<v-btn class="detail_etc_btn" small @click="detailClick(item)" :color="'#9A9C9B'" depressed>자세히 보기</v-btn>


			</v-layout>
		</template> -->

		<v-layout v-if="excelUseYn === 'true'">
			<!-- freind_talk_tamplate_excel -->
			<txtField
				v-if="excelTextYn === 'true'"
				class="bizInput datatable_excel_text"
				v-model="excel_text.value"
				:txtField="excel_text.txtfield"
				style="height:27px;  background-color:white; border-radius:5px; width:300px;"
			></txtField>
			<v-btn small :class="excelType === 'freind_talk_tamplate_dialog_excel' ? 'btn-style-type2' : 'btn-style'" @click="clickExport()">
				<img src="@/assets/images/excel-img2.png" />
				엑셀파일 다운로드
			</v-btn>
			<download-excel
				class="btn btn-default"
				:id="`excel-down-${excelType}`"
				:data="excel_items"
				style="display:none"
				:fields="json_fields"
				type="text/csv;charset=utf8"
				worksheet="My Worksheet"
				:name="excel_title"
			>
			</download-excel>
			<sweetAlert :dialog="sweetInfo" />
		</v-layout>
	</div>
</template>

<script>
import btn from './button'
import { selectBox3, selectBox, txtField } from '@/components/index'
// import { sweetAlert } from '@/components/index'

import downloadExcel from 'vue-json-excel'
export default {
	components: {
		btn,
		selectBox3,
		downloadExcel,
		selectBox,
		sweetAlert: () => import('@/components/sweetAlert.vue'),
		txtField,
	},
	data() {
		return {
			sweetInfo: {
				open: false,
				title: '',
				content: ``,
				modalIcon: 'info',
				cancelBtnText: '확인',
				buttonType: 'oneBtn',
			},
			excel_text: {
				value: '',
				txtfield: {
					maxlength: '255',
					outlined: true,
					hideDetail: false,
					errorMessage: '',
					placeholder: '엑셀 다운로드 시 사유를 입력해주세요.',
					// disable: true,
				},
			},

			reserveDayHost: '',
			reserveDirectHost: '',
			reserveVisitHost: '',
			trackingCodeHost: '',
			enterQRHost: '',
			counselQRHost: '',
			boardHost: '',
			counselser: '',
			Host: '',
			selUser: {
				value: 'data1',
				items: ['data1', 'data2'],
				label: '사용자',
				outlined: true,
				hideDetail: true,
			},
			full: 100,
			// 패스워드 버튼
			password_btn: {
				color: 'white',

				width: '113',
				class: 'bold',
			},
			password_btn_txt: 'CHANGE',
			// 액션 버튼
			action_btn: {
				color: 'white',
				width: '113',
				class: 'bold',
			},
			action_btn_txt: 'DELETE',
			viewBtn: {
				class: 'whiteBtn',
			},
			collectBtn: {
				class: 'whiteBtn',
			},
			editBtn: {
				small: true,
				class: 'ml-2',
			},
			deleteBtn: {
				class: '',
			},
			excel_title: 'excel 리스트.xls',
			excel_items: [],
			json_fields: {},
		}
	},
	created() {
		this.reserveDayHost = location.protocol + '//' + location.host + '/reserve_day/'
		this.reserveDirectHost = location.protocol + '//' + location.host + '/reserve_direct/'
		this.reserveVisitHost = location.protocol + '//' + location.host + '/reserve_visit/'
		this.trackingCodeHost = location.protocol + '//' + location.host
		this.enterQRHost = location.protocol + '//' + location.host + '/qrReaderEnter/'
		this.counselQRHost = location.protocol + '//' + location.host + '/qrReaderCounsel/'
		this.boardHost = location.protocol + '//' + location.host + '/board/'
		this.counselser = location.protocol + '//' + location.host + '/counselorlogin/'
		this.Host = location.protocol + '//' + location.host
	},

	watch: {
		datatable: {
			deep: true,
			handler() {
				let obj = {}
				if (this.datatable.headers.length > 0) {
					for (let i = 0; i < this.datatable.headers.length; i++) {
						if (i === 5 && this.excelType === 'reservation_customer') {
							obj['동반 인명수(본인포함)'] = 'companion'
						}
						obj[this.datatable.headers[i].text] = this.datatable.headers[i].value
					}
				}
				this.json_fields = obj

				if (this.excelType === 'inputBox') {
					// 문항 관리 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))
					new_items.forEach(el => {
						if (el.reservedays && el.reservedays.length > 0) {
							el['reserveday'] = el.reservedays.map(x => x.title).join(', ')

							el['range'] = `${this.$moment(el.reservedays[0].sdate).format('YYYY-MM-DD')} ~ ${this.$moment(el.reservedays[0].edate).format(
								'YYYY-MM-DD',
							)}`
						}
					})

					this.excel_title = '문항 관리 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'reservedays') {
					// 거점 캠페인 관리 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					new_items.forEach(el => {
						el['campaign_url'] = process.env.VUE_APP_CUSTOMER_URL + '/reserve_visit/' + el.code
					})

					this.excel_title = '거점 홍보 관리 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'reservation') {
					// 예약 상담 관리 excel 정리

					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					new_items.forEach(el => {
						el['wating_check'] = process.env.VUE_APP_CUSTOMER_URL + '/reserve_day/' + el.code
						el['reservation_check'] = process.env.VUE_APP_CUSTOMER_URL + '/reserve_direct/' + el.code
						el['counselor_page'] = process.env.VUE_APP_CUSTOMER_URL + '/counselorlogin/' + el.code
						el['waiting_board'] = process.env.VUE_APP_CUSTOMER_URL + '/board/' + el.code
					})

					this.excel_title = '예약 상담 관리 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'event') {
					// 이벤트 관리 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					new_items.forEach(el => {
						el['event_url'] = process.env.VUE_APP_CUSTOMER_URL + '/reserve_visit/' + el.code
					})

					this.excel_title = '이벤트 관리 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'campaign_customer') {
					// 캠페인 고객 관리 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					new_items.forEach(el => {
						el.phone = el.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
						el['created_at_time'] = this.$moment(el.created_at).format('YYYY-MM-DD HH:mm')
						if (el.groupData && el.reserveGroupCode) {
							el['reserveGroupCode'] = el.groupData[el.groupData.map(x => x.qrcode).indexOf(el.reserveGroupCode)].title
						}

						if (el.userData) {
							this.userData_parsing(el)
						}
					})
					this.excel_title = '거점 홍보 고객 관리 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'reservation_customer') {
					// 방문예약 고객 관리 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))
					new_items.forEach(el => {
						el.phone = el.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
						el['rdate'] = this.$moment(el.rdate)
							.subtract(9, 'hours')
							.format('YYYY-MM-DD HH:mm:ss ')
						el['state_visit_date'] = el.state === 'visit' ? this.$moment(el.updated_at).format('YYYY-MM-DD HH:mm') : ''
						el['cancel_visit'] = el.status === 2 ? this.$moment(el.updated_at).format('YYYY-MM-DD HH:mm') : ''
						if (el.status !== 2) {
							if (el.state === 'reserve') {
								el['state_visit'] = '미방문'
							} else {
								el['state_visit'] = '방문'
							}
						} else {
							el['state_visit'] = '취소'
						}
					})

					this.excel_title = '방문예약 고객 관리 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'visit_customer') {
					// 방문 고객 관리 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					new_items.forEach(el => {
						el.phone = el.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
						el['visit'] = '현장등록'
						el['created_at_time'] = this.$moment(el.created_at).format('YYYY-MM-DD HH:mm')
					})

					this.excel_title = '방문 고객 관리 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'counselor_customer') {
					// 상담 고객 관리 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					new_items.forEach(el => {
						el.phone = el.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
						el['created_at'] = this.$moment(el.created_at).format('YYYY-MM-DD')
						if (el.stat === 0) {
							el['stat'] = '상담 예약'
						} else if (el.stat === 1) {
							el['stat'] = '상담중'
						} else if (el.stat === 2) {
							el['stat'] = '미처리'
						} else if (el.stat === 9) {
							el['stat'] = '상담 완료'
						}

						el['rdate'] = this.$moment(el.rdate)
							.subtract(9, 'hours')
							.format('YYYY-MM-DD HH:mm:ss')

						if (el.userData) {
							this.userData_parsing(el)
						}
					})

					this.excel_title = '상담 고객 관리 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'event_customer') {
					// 이벤트 참여 고객 관리 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					new_items.forEach(el => {
						el.phone = el.phone.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`)
						el['created_at'] = this.$moment(el.created_at).format('YYYY-MM-DD')
						if (el.stat === 0) {
							el['stat'] = '상담 예약'
						} else if (el.stat === 1) {
							el['stat'] = '상담중'
						} else if (el.stat === 2) {
							el['stat'] = '미처리'
						} else if (el.stat === 9) {
							el['stat'] = '상담 완료'
						}

						el['rdate'] = this.$moment(el.rdate)
							.subtract(9, 'hours')
							.format('YYYY-MM-DD HH:mm:ss')

						if (el.userData) {
							this.userData_parsing(el)
						}
					})
					this.excel_title = '이벤트 참여 고객 관리 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'freind_talk_tamplate_excel') {
					// 친구톡 템플릿 관리 excel 정리
					this.excel_title = '친구톡 템플릿 관리 리스트.xls'

					this.json_fields = {
						'템플릿 제목': 'title',
						'템플릿 유형': 'category_text',
						등록일: 'created_at_detail',
						'템플릿 분류': 'type_text',
						'템플릿 형태': 'form_text',
						버튼정보: 'buttons_text',
						'친구톡 이미지': 'mainImg_url',
						'친구톡 내용': 'content',
						'대체문자 이미지': 'lmsImg_url',
						'대체문자 내용': 'lmsContent',
					}

					this.excel_items = this.datatable.items
				} else if (this.excelType === 'freind_talk_tamplate_dialog_excel') {
					this.excel_title = '친구톡 수신 리스트.xls'

					this.json_fields = {
						No: 'talk_no',
						이름: 'name',
						'수신 번호': 'talk_phone',
						결과: 'talk_status',
					}
					this.excel_items = this.datatable.origin_items
					console.log(this.excel_items)
				} else if (this.excelType === 'freind_talk_sent_list_excel') {
					// 친구톡 발송 결과 리스트 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					this.excel_title = '친구톡 발송 결과 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'unsubscribes_excel') {
					// 수신 거부 리스트 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					this.excel_title = '수신 거부 리스트.xls'
					this.excel_items = new_items
				} else if (this.excelType === 'ft_report_excel') {
					// 친구톡 발송 통계 리스트 excel 정리
					let new_items = JSON.parse(JSON.stringify(this.datatable.items))

					this.excel_title = '친구톡 발송 통계 리스트.xls'
					this.excel_items = new_items
				} else {
					this.excel_items = this.datatable.items
				}
			},
		},
	},
	methods: {
		comma(val) {
			return val.toLocaleString('ko-KR')
		},
		backServerClick(backServer, item) {
			window.open(backServer + item.mainimg.url)
		},
		boardHostClick(boardHost, item) {
			window.open(boardHost + item.groupcode + '/' + item.code)
		},
		counselQRClick(counselQRHost, item) {
			window.open(counselQRHost + item.groupcode + '/' + item.code)
		},
		enterQRClick(enterQRHost, item) {
			window.open(enterQRHost + item.groupcode + '/' + item.code)
		},
		counselerClick(counselser, item) {
			window.open(counselser + item.groupcode + '/' + item.code)
		},
		reservedayClick(reserveDayHost, item) {
			window.open(reserveDayHost + item.groupcode + '/' + item.code)
		},
		reservedirectClick(reserveDirectHost, item) {
			window.open(reserveDirectHost + item.groupcode + '/' + item.code)
		},
		reservevisitClick(reserveVisitHost, item) {
			window.open(process.env.VUE_APP_CUSTOMER_URL + '/reserve_visit/' + item.groupcode + '/' + item.code)
		},
		accessChange(val, accessPermission) {
			const data = {
				acskey: val.acskey,
				state: accessPermission ? 1 : 2,
			}
			this.$store
				.dispatch('updateAdmin', data)
				.then(() => {})
				.catch(() => {})
		},
		statText(data) {
			if (data === 1) {
				return '공개'
			} else if (data === 2) {
				return '비공개'
			}
		},
		statText2(data) {
			if (data === 0) {
				return '사용'
			} else if (data === 1) {
				return '미사용'
			}
		},
		authorityText(data) {
			if (data === '0') {
				return '분양소장'
			} else if (data === '1') {
				return '상담사'
			}
		},
		isuseText(data) {
			if (data === 0) {
				return '운영중'
			} else if (data === 1) {
				return '휴관'
			} else if (data === 2) {
				return '종료'
			}
		},

		isuseCampaign(data) {
			if (data === 1) {
				return 'Y'
			} else if (data === 2) {
				return 'N'
			}
		},
		typeText(data) {
			if (data === 1) {
				return '신청완료'
			} else if (data === 2) {
				return '내앞대기수'
			} else if (data === 3) {
				return '대기'
			} else if (data === 4) {
				return '상담석'
			} else if (data === 5) {
				return '미처리'
			} else if (data === 6) {
				return '방문예약취소'
			}
		},
		typeTerm(data) {
			if (data === 1) {
				return '개인정보 수집 동의'
			} else if (data === 2) {
				return '마케팅 활용 동의'
			} else if (data === 3) {
				return '미동의'
			}
		},
		agreeType(data) {
			if (data === 1) {
				return 'Y'
			} else if (data === 2) {
				return 'N'
			}
		},
		authoredType(data) {
			if (data) {
				return 'Y'
			} else if (!data) {
				return 'N'
			}
		},
		apply(item, index) {
			item.index = index
			this.$store.state.datatableItem = item
			this.applyclick()
		},
		applydelete(item, index) {
			item.index = index
			this.$store.state.datatableItem = item
			this.applydeleteclick()
		},
		pwchange(item) {
			this.$store.state.datatableItem = item
			this.passwordclick()
		},
		saveImg(item) {
			this.$store.state.datatableItem = item
			this.saveImgBtn()
		},
		deleteacskey(item) {
			this.$store.state.datatableItem = item
			this.clickDeleteBtn()
		},
		editacskey(item) {
			this.$store.state.datatableItem = item
			this.datatable.noweditting = this.datatable.items.indexOf(item)
			this.clickEditBtn()
		},
		nameClick(item) {
			this.$store.state.datatableItem = item
			this.datatable.noweditting = this.datatable.items.indexOf(item)
			this.clickName()
		},
		roleTypeText(data) {
			if (data === 'ROLE_SUPER_ADMIN') {
				return 'Super Admin'
			} else if (data === 'ROLE_ADMIN') {
				return 'Admin'
			} else if (data === 'ROLE_USER') {
				return 'CP member'
			} else {
				return 'No Role'
			}
		},
		setIndexNum(id) {
			this.datatable.setIndex = this.datatable.items.map(v => v.userId).indexOf(id)
		},
		showUsesImg(img) {
			this.$store.commit('usersImg', img)
			this.imgDialogShow()
		},
		qrChange() {},
		async clickExport() {
			if (
				this.excelType === 'campaign_customer' ||
				this.excelType === 'reservation_customer' ||
				this.excelType === 'visit_customer' ||
				this.excelType === 'counselor_customer' ||
				this.excelType === 'event_customer'
			) {
				if (this.excel_text.value === '') {
					this.sweetInfo.title = '입력 에러'
					this.sweetInfo.content = '엑셀 다운로드 시 사유를 입력해주세요.'
					return (this.sweetInfo.open = true)
				} else {
					let input = {
						users_permissions_user: this.$store.state.meData.id,
						business: this.datatable.businessId,
						excel: this.excel_items,
						comment: this.excel_text.value,
					}
					if (this.datatable.reservedayId) {
						input['reserveday'] = this.datatable.reservedayId
					}
					if (this.datatable.eventId) {
						input['event'] = this.datatable.eventId
					}
					this.$store.state.loading = true
					this.$store.dispatch('createExcelLog', input).then(() => {
						document.getElementById(`excel-down-${this.excelType}`).click()
						this.$store.state.loading = false
					})
				}
			} else if (this.excelType === 'ft_sent_list_excel') {
				let sendManagements_data = []
				this.$store.state.loading = true
				await this.$store.dispatch('sendManagements_sendList', {}).then(async res => {
					sendManagements_data = res.data.sendManagements

					sendManagements_data.forEach(el => {
						el['created_at_second'] = this.$moment(el.created_at).format('YYYY-MM-DD HH:mm:ss')
						el['project_title'] = el.business.title
						el['send_date'] = el.immediateDelivery
							? this.$moment(el.created_at).format('YYYY-MM-DD HH:mm:ss')
							: this.$moment(el.reservationSend).format('YYYY-MM-DD HH:mm:ss')
						el['immediate_text'] = el.immediateDelivery ? '즉시 발송' : '예약 발송'
						el['cateogry_title'] = el.category === 'nomal' ? '일반' : '변수'
						el['send_state'] = el.sendState ? el.sendState : '발송전'
						if (el.sendState === 'cancel') {
							// 발송 정지 상태
							el['send_state'] = '발송정지'
						} else {
							if (!this.$moment(el['send_date']).isBefore(this.$moment())) {
								// 발송일이 현재 시간 이전 - 발송전
								el['send_state'] = '발송전'
							} else if (el.sendType === 'divide') {
								// 분산발송 - 발송중,발송완료
								el['send_state'] = '발송완료'
								for (let index = 1; index <= Number(el.divideNum); index++) {
									if (
										this.$moment(el['send_date'])
											.add(Number(el.divideTerm) * index, 'minute')
											.isAfter(this.$moment())
									) {
										el['send_state'] = '발송중'
										break
									}
								}
							} else {
								// 발송일 현재 이후 , 분산발송 아님  - 발송완료
								el['send_state'] = '발송완료'
							}
						}
						// 엑셀 다운로드용 데이터

						// 수신그룹
						let groups = []
						let group_uploaded = [...new Set(el.sendList.filter(item => item.code).map(item => item.code))]
						group_uploaded.forEach(code => {
							let group_items = el.sendList.filter(list => list.code === code)
							groups.push(`${group_items[0].title} (${group_items.length})`)
						})

						// 수신그룹 - 엑셀
						let excel_uploaded = [...new Set(el.sendList.filter(item => !item.code).map(item => item.title))]
						excel_uploaded.forEach(excel_title => {
							let excel_items = el.sendList.filter(list => !list.code && list.title === excel_title)

							groups.push(`${excel_items[0].title} (${excel_items.length})`)
						})

						el['group_sendList'] = groups.join('\n')

						// 알림톡 제목
						el['template_title'] = el.message_template ? el.message_template.title : ''
						// 총 발송건수
						el['total_sendList'] = el.sendList.length
						// 분산발송 설정
						el['divide_info'] = el.sendType === 'divide' ? `${el.divideNum}회 / ${el.divideTerm}분 간격` : ''
					})

					sendManagements_data.sort((a, b) => {
						// Compare the 2 keys
						if (new Date(this.$moment(a.created_at).format('YYYY-MM-DD')) < new Date(this.$moment(b.created_at).format('YYYY-MM-DD')))
							return -1
						else if (new Date(this.$moment(a.created_at).format('YYYY-MM-DD')) > new Date(this.$moment(b.created_at).format('YYYY-MM-DD')))
							return 1
						else {
							return new Date(a.send_date) - new Date(b.send_date)
						}
					})

					sendManagements_data.forEach((el, index) => {
						el['row_num'] = index + 1
					})
					this.excel_title = '친구톡 발송 관리 리스트.xls'
					let new_items = JSON.parse(JSON.stringify(sendManagements_data))

					delete this.json_fields['비고']

					this.json_fields['수신 그룹'] = 'group_sendList'
					this.json_fields['친구톡'] = 'template_title'
					this.json_fields['총 발송건수'] = 'total_sendList'
					this.json_fields['분산발송 설정'] = 'divide_info'

					this.excel_items = new_items

					this.$store.state.loading = false
				})
				document.getElementById(`excel-down-${this.excelType}`).click()
			} else if (this.excelType === 'freind_talk_tamplate_dialog_excel') {
				document.getElementById(`excel-down-${this.excelType}`).click()
			} else {
				document.getElementById(`excel-down-${this.excelType}`).click()
			}
		},
		change_default() {},

		userData_parsing(el) {
			// 고객 데이터중 userData (설문 응답 데이터) 를 excel 다운로드 시에 연결
			el.userData.forEach(question => {
				if (question.type === 21) {
					if (question.imgFiles) {
						let imgFiles = ''
						for (let index = 0; index < question.imgFiles.length; index++) {
							imgFiles += process.env.VUE_APP_BACKEND_URL + question.imgFiles[index].url + (question.imgFiles.length > 1 ? '\n' : '')
						}

						this.json_fields[question.codename] = question.codename
						el[question.codename] = imgFiles
					}
				} else if (question.type === 10) {
					this.json_fields[question.codename] = question.codename
					el[question.codename] = question.value
				} else if (question.type === 11) {
					const categorydatas = []
					const detailDatas = JSON.parse(JSON.stringify(question.category_details)).sort(function(a, b) {
						return a.listorder - b.listorder
					})
					for (let index = 0; index < detailDatas.length; index++) {
						categorydatas.push({
							value: question.value.indexOf(',') > -1 ? question.value.split(',') : question.value ? [question.value] : [],
							detailcode: detailDatas[index].detailname,
							label: detailDatas[index].detailname,
						})
					}
					this.json_fields[question.codename] = question.codename
					el[question.codename] = question.value
				} else if (question.type === 20) {
					this.json_fields[question.codename] = question.codename
					el[question.codename] = question.value
				}
			})
		},
		tableStatus(item) {
			this.$store.state.loading = true
			let data = {
				id: item.id,
				status: item.table_select.value,
			}
			this.$store.dispatch('updateNotice', data).then(() => {
				this.$store.state.loading = false
			})
		},
		removeBiz(item, biz) {
			console.log(item)
			for (let i = 0; i < item.businesses.length; i++) {
				if (item.businesses[i].id === biz.id) {
					item.businesses.splice(i, 1)
				}
			}
			let editId = { id: item.id }
			let li = []
			item.businesses.forEach(el => {
				li.push(el.id)
			})
			editId.businesses = li
			let edit = editId
			this.$store.dispatch('updateNotice', edit).then(() => {
				this.$emit('update')
			})
		},
	},
	props: {
		selected: Array,
		search: String,
		clickrow: Function,
		userheaderselect: Object,
		datatable: Object,
		clickViewBtn: Function,
		passwordclick: Function,
		applyclick: Function,
		applydeleteclick: Function,
		clickDeleteBtn: Function,
		saveImgBtn: Function,
		clickEditBtn: Function,
		clickName: Function,
		changeUser: Function,
		clickCollectBtn: Function,
		imgDialogShow: Function,
		detailClick: Function,
		previewClick: Function,
		excelUseYn: String,
		excelTextYn: String,
		excelType: String,
	},
}
</script>

<style lang="scss">
.text-start {
	text-align: center !important;
}
.noSort {
	th {
		height: 0px !important;
	}
}
.dt-align-set {
	// margin-left: -16px;
	text-align: center;
}
.OkBtn {
	cursor: pointer;
	text-decoration: underline;
}
.max-width-table .v-data-table__wrapper {
	th {
		width: 120px !important;
		max-width: 120px !important;
	}
	td {
		overflow: auto;
	}
	margin-top: 20px;
}
.datatablehover .v-data-table__wrapper {
	td {
		overflow: auto;
	}
	margin-top: 20px;
}
.cursorDefalut .v-data-table__wrapper {
	td {
		cursor: default;
	}
}
.overflow_common {
	overflow: auto;
}
.datatablehover .v-data-table__wrapper > table > tbody > tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
	cursor: pointer !important;
	// background-color: #d1d1d1 !important;
}
.action_btn,
.password_btn {
	border: 1px solid #d1d1d1;
	border-radius: 5px 5px 5px 5px;
	font-weight: bold;
}
.whiteBtn {
	border: 1px solid #d1d1d1 !important;
	background-color: white !important;
	border-radius: 5px;
	font-weight: bold;
	width: 100px;
	height: 36px;
}
.font-green {
	color: #4caf50;
}
.font-red {
	color: #ff5252;
}
.nameEvent {
	// color: #fdc85a;
	cursor: pointer !important;
	text-decoration: underline;
}
.datatablehover > .v-data-table > .v-data-table__wrapper > table {
	border-right: 1px solid #d1d1d1;
	border-left: 1px solid #d1d1d1;
	border-bottom: 1px solid #d1d1d1;
	thead {
		background-color: #f5f5f5 !important;

		tr {
			th:not(:last-of-type) {
				border-right: 1px solid #d1d1d1;
			}
			th {
				text-align: center !important;
				color: #333333;
				height: 53px;
				border-top: 1px solid #323153 !important;
			}
		}
	}
}

.datatablehover > .v-data-table > .v-data-table__wrapper > table {
	tbody {
		tr {
			td:not(:last-of-type) {
				border-right: 1px solid #d1d1d1;
			}
			td {
				height: 36px;
				text-align: center !important;
			}
		}
	}
}
.datatablehover > .v-data-table > .v-data-table__wrapper > table {
	tbody {
		tr:hover {
			background-color: #ffd999 !important;
		}
	}
}
.datatablehover > .v-data-table > .v-data-footer {
	justify-content: center;
	padding-right: 0px;
	.v-data-footer__select {
		margin-left: 0px;
	}
}
.datatablehover3 {
	max-width: 100% !important;
}
.datatablehover2 > .v-data-table > .v-data-footer {
	justify-content: center;
	padding-right: 0px;
	.v-data-footer__select {
		margin-left: 0px;
	}
}

.datatablehover > .v-data-table > .v-data-footer > .v-data-footer__select {
	// color: #e89000;
	font-weight: bold;
}
.datatablehover > .v-data-table > .v-data-footer > .v-data-footer__select > div {
	border: 1px solid #c5c5c5;
	border-radius: 5px;
	padding: 0 5px 0 10px;
}
.datatablehover > .v-data-table > .v-data-footer > .v-data-footer__select > div > div > div::before {
	border: none;
}
.datatablehover > .v-data-table > .v-data-footer > .v-data-footer__select > div > div > div {
	border: none;
}
.datatablehover > .v-data-table > .v-data-footer > .v-data-footer__select > div > div > div > .v-menu {
	border: none;
}
.datatablehover > .v-data-table > .v-data-footer > .v-data-footer__select > div > div > div > .v-menu::after {
	border: none;
}
.datatablehover > .v-data-table > .v-data-footer > .v-data-footer__select > div > div > div > div > .v-select__selections {
	width: 20px;
}
.btn-style {
	box-shadow: none;
	background-color: #ffffff;
	border: 1px solid #9a9c9b;
	border-radius: 5px;
	// margin-top: -3rem !important;
	// margin-left: 92.5rem !important;
	position: absolute;
	bottom: 15px;
	right: 0px;
}
.btn-style-type2 {
	box-shadow: none;
	background-color: #ffffff;
	border: 1px solid #9a9c9b;
	border-radius: 5px;
	position: absolute;
	bottom: 460px;
	right: 0px;
}
.customer_dialog_table .v-data-table--fixed-header > div > table > thead > tr > th {
	background: #f5f5f5 !important;
	height: 53px;
}
.reserveTd {
	.label {
		white-space: nowrap;
		overflow-x: auto;
	}
	font-size: 14px;
	color: #434a5d;
	.count {
		font-weight: bold;
		color: #5d19ff;
	}
}
.datatable_excel_text {
	position: absolute;
	bottom: 15px;
	right: 175px;
}
.table_select_box {
	min-height: 23px !important;
	height: 23px !important;
	align-items: center !important;
	font-size: 12px !important;
	.v-input__control {
		height: 23px !important;
		.v-input__slot {
			padding: 0 0 0 10px !important;
			min-height: 23px !important;
			.v-select__slot {
				.v-select__selections {
					padding: 0 !important;
				}
				.v-input__append-inner {
					margin: 0 !important;
				}
			}
		}
	}
}
</style>
