<template>
	<v-dialog v-model="setdialog.dialog" max-width="85%" content-class="height-97">
		<div class="create_wrap display_inline_block">
			<div class="project_title px-5" :style="`background-color:${$store.state.PointColor2}`">
				<!-- text -->
				<h2 style="font-size:15px">예약/방문/상담 설정</h2>
				<v-spacer />
				<!-- icon -->
				<v-icon @click="clickCancel" class="title-icon" color="white">mdi-close</v-icon>
			</div>

			<v-layout class="mx-8 mt-4 " wrap>
				<v-flex xs5 class="pr-5">
					<v-layout align-center>
						<div class="slash mr-1"></div>
						<span class="title_font"> 기본정보</span>
					</v-layout>

					<!-- 아이템 리스트 시작 -->
					<v-layout wrap class="mt-2 sub_font" style="display:block">
						<v-layout
							v-for="(left, index) in items"
							:key="index"
							class="pa-0 table_all_gray"
							wrap
							style="min-height:49px; border-bottom: 1px solid #d1d1d1;"
						>
							<v-flex xs3 align-self-center style="text-align:center; max-width:156px">
								<v-flex>
									{{ left.title }}
								</v-flex>
							</v-flex>

							<!-- txtfield  -->
							<v-flex xs9 v-if="left.type === 'txtfield'" class="sub_text px-2 table_right_white">
								<v-flex xs12 align-self-center>
									<txtField
										class="pt-3 bizInput"
										v-model="left.value"
										:txtField="left.txtfield"
										style="height:27px; margin:auto"
									></txtField>
								</v-flex>
								<v-flex v-if="index === 1" xs12 class="input_guide" style="margin-top:15px;">
									※ 고객에게 노출되는 제목입니다. 유의하여 적용부탁드립니다.</v-flex
								>
								<v-flex v-if="index === 4" xs12 class="input_guide" style="margin-top:15px;"> ※ 예약신청시 노출되는 버튼명입니다. </v-flex>
								<v-flex v-else-if="index === 6" xs12 class="input_guide " style="margin-top:15px;">
									※ 예약/방문/상당 신청 완료 시 이동되는 링크입니다.
								</v-flex>
							</v-flex>

							<!-- selectBox -->
							<v-flex xs9 v-else-if="left.type === 'selectBox'" class="sub_text px-2  table_right_white">
								<v-layout>
									<v-flex xs8 class="pt-3" style="height:100%">
										<select-box :sel="left.selectBox" @change="change(left, index)"></select-box>
									</v-flex>
									<v-flex v-if="index === 0" xs4 align-self-center style="padding-top:3px; margin-left:5px;">
										<txtField class="bizInput" v-model="left.value2" :txtField="left.txtfield" style="height:27px;"></txtField>
									</v-flex>
								</v-layout>
							</v-flex>

							<!-- file input -->
							<v-flex xs9 v-if="left.type === 'fileinput'" class="sub_text px-2 table_right_white">
								<v-layout wrap align-center style="height:100%;">
									<v-flex xs8 align-self-center>
										<txtField
											class="bizInput"
											v-model="left.value"
											:txtField="left.txtfield"
											style="height:27px; margin:auto; padding-top:2px;"
										></txtField>
										<!-- 이미지 불러오기 버튼 -->
									</v-flex>
									<v-flex xs4 align-self-center class="pl-2 pt-1">
										<v-btn class="input_btn" depressed @click="clickFileUploadImage(index)">
											<v-img max-width="14" class="mr-2" src="@/assets/images/input_btn.png" />파일 업로드
										</v-btn>
										<!-- input -->
										<input type="file" style="display:none;" id="file_upload1" @change="fileUpload" accept="image/*" />
									</v-flex>
									<v-flex xs12 class="input_guide"> ※ 사이즈 : 가로 600px (길이 500px이상) / 세로 600px </v-flex>
								</v-layout>
							</v-flex>

							<!-- datePicker -->
							<v-flex xs9 v-if="left.type === 'datePicker'" class="sub_text px-2 table_right_white">
								<v-layout wrap align-center style="height:100%;">
									<v-flex class="search_date_1 ml-0" xs4>
										<DatepickerDialog :picker="left.startpicker" :disabledata="disabledata"></DatepickerDialog
									></v-flex>
									<span class="mx-1"> ~ </span>
									<v-flex class="search_date_2" xs4>
										<DatepickerDialog
											:picker="left.endpicker"
											:disabledata="disabledata"
											:allowed_dates="val => allow_dates(val, index)"
										></DatepickerDialog
									></v-flex>
								</v-layout>
							</v-flex>

							<!-- excel -->
							<v-flex xs9 v-if="left.type === 'excel'" class="sub_text pa-2 table_right_white">
								<v-layout wrap align-center style="height:100%;">
									<!-- 셀렉트 박스 -->
									<v-flex xs7 align-self-center>
										<select-box :sel="left.selectBox" @change="change(left, index)"></select-box>
									</v-flex>
									<v-flex xs4 align-self-center class="pl-2 ">
										<v-btn class="input_btn" depressed @click="csvImportClick(index)" style="margin-bottom: 10px;">
											<v-img max-width="14" class="mr-2" src="@/assets/images/input_btn.png" />파일 업로드
										</v-btn>
									</v-flex>

									<!-- 텍스트 필드 -->
									<v-flex xs8 align-self-center>
										<!-- <v-textarea v-model="left.value" hide-details outlined no-resize readonly height="50"></v-textarea> -->
									</v-flex>
									<!-- 파일업로드 버튼 -->
									<v-flex v-if="left.value && left.value[0].fileName" xs12 align-self-center>
										{{ left.value[0].fileName }}
									</v-flex>

									<v-flex xs12 align-self-center class="pt-2">
										<v-btn class="input_btn_excel" depressed @click="csvDownloadClick()">
											<v-img max-width="22" src="@/assets/images/excel-img2.png" />
										</v-btn>
										<span class="excel_span ml-2" @click="csvDownloadClick()">xlsx형식 다운받기</span>
									</v-flex>

									<!-- <VueCsvImport
										style="display:none;"
										id="csvimport"
										inputClass="inputclasstest"
										v-model="parseCsv"
										:map-fields="mapfields"
										:autoMatchFields="true"
										:autoMatchIgnoreCase="true"
									>
									</VueCsvImport> -->
									<input type="file" @change="e => readFile(e, left, index)" style="display:none;" :id="'excel_import4_' + index" />
								</v-layout>
							</v-flex>

							<!-- 아이템 리스트 끝 -->
						</v-layout>
					</v-layout>
				</v-flex>

				<!-- 데이터 테이블  영역-->
				<v-flex xs7>
					<v-layout align-center>
						<div class="slash mr-1"></div>
						<span class="title_font mr-2"> 예약 상세 설정 </span>
						<v-tooltip right>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
							</template>
							<span class="info-text" style="margin-right: 0px; width:fit-content;">
								※ 예약 기능을 사용하지 않는 경우에는 설정할 필요 없습니다.
							</span>
						</v-tooltip>
					</v-layout>
					<v-layout wrap class="mt-2 sub_font" style="display:block">
						<v-layout class="pa-0 table_all_gray" style="min-height:55px; border-bottom: 1px solid #d1d1d1;">
							<v-flex xs3 align-self-center style="text-align:center; max-width:156px">
								<v-flex>
									공통 제외시간
								</v-flex>
							</v-flex>
							<v-flex class="sub_text px-2 table_right_white" align-self-center style="height:56px;">
								<v-layout align-center class="pt-1">
									<v-flex xs7>
										<v-layout align-center>
											<v-radio-group v-model="timeSel" row class="pl-1 mt-0 reserve-radio-label" hide-details>
												<v-radio hide-details @click="radioExcept()" color="MainColor2" label="시간제외" value="radio-1"></v-radio>
												<v-radio hide-details @click="radioExcept()" color="MainColor2" label="단위시간제외" value="radio-2"></v-radio>
											</v-radio-group>
											<div style="max-width:100px;">
												<select-box @change="excludedTime()" :sel="selCommon"></select-box>
											</div>
											<v-btn @click="resetDates()" class="mx-2 applyBtn" color="#F3F3FF" size="small" height="27" elevation="0"
												>초기화</v-btn
											>
										</v-layout>
									</v-flex>
									<v-flex xs5>
										<v-layout align-center>
											<v-flex class="title_font text-right mr-2">※ 기간 총 예약인원</v-flex>
											<v-flex xs6 class="py-1 px-6 title_font text-right" style="border-radius:4px; border:1px #C5C5C5 solid; height:27px;">
												{{ TotalNumber(totalExceptionTime) }} 명
											</v-flex>
										</v-layout>
									</v-flex>
								</v-layout>
							</v-flex>
						</v-layout>
					</v-layout>
					<v-layout
						v-if="pickers[0].picker.date && pickers[1].picker.date"
						wrap
						class="px-4 pt-1 pb-3 title_font"
						style="border-bottom: 1px solid rgb(209, 209, 209);
					border-left: 1px solid rgb(209, 209, 209);
					border-right: 1px solid rgb(209, 209, 209);"
					>
						<v-flex lg12 xs12>
							<v-layout class="mt-2">
								<v-flex lg5 xs12>
									<v-date-picker
										no-title
										:allowed-dates="allowed_dates"
										v-model="picker"
										@input="selDatePicker"
										locale="ko-kr"
									></v-date-picker>
								</v-flex>
								<v-flex
									lg7
									xs12
									class="px-4"
									v-if="
										selStart.value !== '' && selEnd.value !== '' && selTimeTerm.value !== '' && selTermMax.value !== '' && picker !== ''
									"
								>
									<v-layout align-center class="mb-2">
										<v-flex lg2 xs12 class="title_font">선택일</v-flex>
										<v-flex lg10 class="py-1 px-6 title_font" style="border-radius:4px; border:1px #C5C5C5 solid; height:27px;">
											{{ picker }}
										</v-flex>
									</v-layout>
									<v-layout>
										<v-flex lg2 xs12 class="title_font mt-3">
											시간선택
										</v-flex>
										<v-flex lg10>
											<v-layout>
												<select-box :sel="selTime" @change="selTimeRange()"></select-box>
											</v-layout>
											<v-layout>
												<v-flex lg12 xs12>
													<v-layout class="title_font " v-for="(time, index) in exceptionTime.times" :key="index" align-center>
														<v-row
															style="place-items: center;"
															class="ma-0 pa-0"
															v-if="selTime.value === '' ? false : time.clock.indexOf(selTime.value.substring(0, 3)) === -1 ? false : true"
														>
															<v-flex lg2 style="border-radius:1vh; background-color:whitesmoke; place-self: center;" class="pa-2 mr-2">
																<v-layout justify-center>
																	{{ time.clock }}
																</v-layout>
															</v-flex>
															<v-flex lg3 class="mr-2">
																<v-layout align-center>
																	<v-text-field
																		v-model="time.maxCount"
																		maxlength="5"
																		color="PointColor2"
																		outlined
																		class="bizInput"
																		hide-details="true"
																		autocomplete="off"
																		:disabled="time.radio"
																	></v-text-field>
																</v-layout>
															</v-flex>
															<v-spacer></v-spacer>
															<v-flex lg4 style="place-self: center;">
																예외시간 적용하기
															</v-flex>
															<v-flex lg1 style="place-self: center;">
																<v-checkbox
																	v-model="time.radio"
																	color="PointColor2"
																	@click="radioClick(time)"
																	on-icon="mdi-check-circle"
																	off-icon="mdi-check-circle-outline"
																></v-checkbox>
															</v-flex>
														</v-row>
													</v-layout>
													<v-layout class="title_font">
														{{ picker }} {{ selTime.value }} = 최대 예약인원 : {{ timeTotalNumber(exceptionTime.times) }}명
													</v-layout>

													<v-divider class="mt-2"></v-divider>
												</v-flex>
											</v-layout>
										</v-flex>
									</v-layout>
								</v-flex>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-flex>
				<v-flex xs5 class="pr-5">
					<v-layout align-center class="mt-4">
						<div class="slash mr-1"></div>
						<span class="title_font mr-2"> 예약 기간 설정</span>
						<v-tooltip right>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
							</template>
							<span class="info-text" style="margin-right: 0px; width:fit-content;">
								※ 예약 기능을 사용하지 않는 경우에도 반드시 아래 기간을 설정하여야합니다. <br />{{ '  ' }}-예약 기간 (임의값 설정) <br />{{
									'  '
								}}-방문 기간 (실제 방문등록 사용기간)</span
							>
						</v-tooltip>
					</v-layout>

					<!-- 아이템 리스트 시작 -->
					<v-layout wrap class="mt-2 sub_font" style="display:block">
						<v-layout
							v-for="(left, index) in items2"
							:key="index"
							class="pa-0 table_all_gray"
							wrap
							style="min-height:40px; border-bottom: 1px solid #d1d1d1;"
						>
							<v-flex xs3 align-self-center style="text-align:center; max-width:156px">
								<v-flex>
									{{ left.title }}
								</v-flex>
							</v-flex>

							<!-- txtfield  -->
							<v-flex xs9 v-if="left.type === 'txtfield'" class="sub_text px-2 table_right_white">
								<v-flex xs8 align-self-center>
									<txtField
										class="pt-2 bizInput"
										v-model="selTermMax.value"
										:txtField="selTermMax"
										@input="maxCount"
										style="height:27px; margin:auto"
									></txtField>
								</v-flex>
							</v-flex>

							<!-- selectBox -->
							<v-flex
								xs9
								v-else-if="left.type === 'selectBox'"
								class="sub_text px-2  table_right_white pt-2"
								align-self-center
								style="height:47px;"
							>
								<v-layout align-center class="title_font">
									<select-box @change="selStartClick" :sel="selStart"></select-box>
									<div class="mx-2 mb-2">~</div>
									<select-box @change="selEndClick" :sel="selEnd" v-model="selEnd.value"></select-box>
									<div class="mx-2 mb-2 text-right" style="width: -webkit-fill-available;">
										시간단위
									</div>
									<select-box @change="selTimeChange" :sel="selTimeTerm" v-model="selTimeTerm.value"></select-box>
								</v-layout>
							</v-flex>

							<!-- datePicker -->
							<v-flex xs9 v-if="left.type === 'datePicker'" class="sub_text px-2 table_right_white">
								<v-layout wrap align-center style="height:100%;">
									<v-flex class="search_date_1 ml-0" xs4>
										<DatepickerDialog
											:picker="pickers[0].picker"
											:disable="pickers[0].picker.disable"
											:allowed_dates="allowed_dates_start"
											@change="changeStartDate"
										></DatepickerDialog
									></v-flex>
									<span class="mx-1"> ~ </span>
									<v-flex class="search_date_2" xs4>
										<DatepickerDialog
											@change="selTimeChange"
											:picker="pickers[1].picker"
											:disable="pickers[1].picker.disable"
											:allowed_dates="allowed_dates_end"
										></DatepickerDialog
									></v-flex>
								</v-layout>
							</v-flex>
							<v-flex xs9 v-if="left.type === 'datePicker2'" class="sub_text px-2 table_right_white">
								<v-layout wrap align-center style="height:100%;">
									<v-flex class="search_date_1 ml-0" xs4>
										<DatepickerDialog
											:picker="pickers[2].picker"
											:disable="pickers[2].picker.disable"
											:allowed_dates="allowed_dates_start2"
											@change="changeStartDate2"
										></DatepickerDialog
									></v-flex>
									<span class="mx-1"> ~ </span>
									<v-flex class="search_date_2" xs4>
										<DatepickerDialog
											:picker="pickers[3].picker"
											:disable="pickers[3].picker.disable"
											:allowed_dates="allowed_dates_end2"
										></DatepickerDialog
									></v-flex>
								</v-layout>
							</v-flex>

							<!-- 아이템 리스트 끝 -->
						</v-layout>
					</v-layout>
				</v-flex>
				<v-flex xs7 style="margin-top:-130px;">
					<v-layout align-center>
						<div class="slash mr-1"></div>
						<span class="title_font mr-2"> 알림톡 설정 </span>
						<v-tooltip right>
							<template v-slot:activator="{ on, attrs }">
								<v-icon small v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
							</template>
							<span class="info-text " style="margin-right: 0px; width:fit-content;">
								※ 예약 기능을 사용하지 않는 경우 아래* 표시된 알림톡만 설정하여 주시기 바랍니다.
								<br />
								※ 방문1일전 알림은 방문전일 14:00, 방문당일 알림은 09:00에 발송됩니다.
							</span>
						</v-tooltip>

						<!-- <v-spacer></v-spacer> -->
					</v-layout>
					<v-layout wrap class="mt-2 sub_font">
						<v-flex
							v-for="(left, index) in items3"
							:key="index"
							xs6
							class="pa-0 table_all_gray"
							wrap
							:style="
								index % 2 !== 0 ? 'border-left: 1px solid #d1d1d1; border-bottom: 1px solid #d1d1d1;' : 'border-bottom: 1px solid #d1d1d1;'
							"
						>
							<v-layout align-center>
								<div align-center style="text-align:center; min-width:115px; max-width:115px;">
									{{ left.title }}
									<span
										v-if="
											index === 1 || index === 3 || index === 5 || index === 7 || index === 8 || index === 9 || index === 11 || index === 13
										"
										>*</span
									>
								</div>
								<v-layout v-if="left.type === 'selectBox'" class="sub_text px-2  table_right_white pt-2">
									<div style="max-width: 200px;">
										<select-box :sel="left.selectBox" @change="change"></select-box>
									</div>
									<div>
										<v-btn
											class="mx-2 applyBtn"
											color="#F3F3FF"
											size="small"
											height="27"
											elevation="0"
											:disabled="!left.selectBox.value"
											@click="previewClick(messageDatas[messageDatas.map(x => x.tplCodeStr).indexOf(left.selectBox.value)])"
											>미리보기</v-btn
										>
									</div>
								</v-layout>
								<v-layout v-else class="sub_text px-2  table_right_white"> </v-layout>
							</v-layout>
						</v-flex>
					</v-layout>
				</v-flex>
				<v-flex xs12>
					<v-layout class="my-3">
						<v-flex sm12 style="text-align:end;">
							<btn
								:btn="bottomBtn"
								:class="'check_btn small_action_btn'"
								:style="`background-color:${$store.state.PointColor2}`"
								:btn_txt="'저장'"
								@click="checkDatas"
							></btn>
						</v-flex>
					</v-layout>
				</v-flex>
			</v-layout>
		</div>
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
		<previewTalk :setdialog="preview_dialog" />
		<sweetAlert :dialog="sweetDialog" @click="clickSave()" />
		<sweetAlert :dialog="sweetInfo" />
	</v-dialog>
</template>

<script>
import { btn, txtField, selectBox, sweetAlert, previewTalk, DatepickerDialog } from '@/components/index'
import changeTime from '../../../utils/timeRange2.js'
// import { VueCsvImport } from 'vue-csv-import'
export default {
	data() {
		return {
			first: true,
			messageDatas: [],
			preview_dialog: {
				// 미리포기 다이어로그
				dialog: false,
				title: '철산자이 더 헤리티지',
				content: `[철산자이 더 헤리티지]

[홍길동]고객님,
[2023-01-17 14:25]에
[철산자이 더 헤리티지 고객 설문조사 이벤트]에
참여 하셨습니다.

고객님의 소중한 의견과 참여에 감사드립니다.
아래 버튼을 클릭하시면 이벤트에 관한 
자세한 내용과 분양정보를 확인 하실 수 
있습니다.`,
				buttons: [
					{
						text: '카카오톡 채널 친구추가',
					},
					{
						text: '홍페이지 바로가기',
					},
					{
						text: '분양 정보 보기',
					},
					{
						text: '챗봇 바로가기',
					},
				],
			},
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
			sweetDialog: {
				// 저장 확인 팝업
				open: false,
				title: '예약정보 저장',
				content: `예약 정보를 
저장합니다.`,
				cancelBtnText: '취소',
				buttonType: 'twoBtn',
				saveBtnText: '저장',
				modalIcon: 'success',
			},
			items: [
				// 0
				{
					title: '프로젝트 선택',
					value: '',
					value2: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						items: [],
						inputItems: [],
						outlined: true,
						filter: true,
						returnObject: true,
						itemText: 'title',
						class: 'small_font bizInput',
					},
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						disable: true,
						errorMessage: '',
						autocomplete: 'off',
					},
				},

				// 1
				{
					title: '제목',
					value: '',
					type: 'txtfield',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '예) 운정자이 시그니쳐 견본주택',
					},
					essential: true,
				},
				// 2
				{
					title: '메인이미지',
					value: '',
					type: 'fileinput',
					fileinput: {
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						readonly: true,
						tooltip: {
							url: '/image/tooltip/3.캠페인_메인이미지.png',
						},
					},
					txtfield: {
						readonly: true,
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '※ jpg,png / 500kb이하',
					},
				},
				// 3
				{
					title: '문항선택',
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						items: [],
						inputItems: [],
						outlined: true,
						filter: true,
						tooltip: {
							url: '/image/tooltip/3.캠페인_설문선택.png',
						},
						class: 'small_font bizInput',
					},
					essential: true,
				},
				// 4

				{
					title: '버튼 텍스트',
					value: '',
					type: 'txtfield',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						tooltip: {
							url: '/image/tooltip/4.방문예약_버튼텍스트.png',
						},
					},
				},
				// 5
				{
					title: '참여 그룹 설정',
					type: 'excel',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						onlyNumber: true,
						autocomplete: 'off',
					},

					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						filter: true,
						items: [],
						inputItems: [],
						outlined: true,
						tooltip: {
							url: '/image/tooltip/3.캠페인_모집단.png',
						},
						class: 'small_font bizInput',
					},
				},
				// 6
				{
					title: '완료 링크',
					value: 'https://pf.kakao.com/_IgBkj/friend',
					type: 'txtfield',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '형식 예: https://www.google.com',
						tooltip: {
							url: '/image/tooltip/3.캠페인_완료링크.png',
						},
					},
				},
				// 7
				{
					title: '이벤트 설정',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '없음',
						errorMessage: '',
						hideDetail: true,
						items: [],
						inputItems: [],
						outlined: true,
						clearable: true,
						filter: true,
						tooltip: {
							url: '/image/tooltip/3.캠페인_이벤트 설정.png',
						},
						class: 'small_font bizInput',
					},
				},
				// 8
				{
					title: '대기번호 시작번호',
					value: '1',
					type: 'txtfield',
					txtfield: {
						maxNumber: true,
						max: 9999,
						type: 'Number',
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '',
						tooltip: {
							url: '/image/tooltip/3.캠페인_완료링크.png',
						},
					},
				},
			],
			items2: [
				// 0
				{
					title: '예약 기간 설정',
					value: '',
					type: 'datePicker2',
					essential: true,
				},
				{
					title: '방문 기간 설정',
					value: '',
					type: 'datePicker',
					essential: true,
				},
				{
					title: '시간 설정',
					value: '',
					type: 'selectBox',
				},
				//2
				{
					title: '시간단위별 최대 인원',
					value: '',
					type: 'txtfield',
					txtfield: {
						type: 'Number',
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '명',
						tooltip: {
							url: '/image/tooltip/4.방문예약_버튼텍스트.png',
						},
					},
				},
			],
			items3: [
				// 0
				{
					title: '방문 예약 완료',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						filter: true,
						items: [],
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 1
				{
					title: '상담 신청 완료',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						items: [],
						filter: true,
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 2
				{
					title: '방문 예약 취소',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						filter: true,
						clearable: true,
						items: [],
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 3
				{
					title: '상담 취소 알림',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						filter: true,
						items: [],
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 4
				{
					title: '방문 1일전',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						items: [],
						filter: true,
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 5
				{
					title: '대기자수 알림',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						items: [],
						filter: true,
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 6
				{
					title: '방문 당일',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						items: [],
						filter: true,
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 7
				{
					title: '상담 대기 알림',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						items: [],
						filter: true,
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 8
				{
					title: '방문 등록 완료',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						items: [],
						filter: true,
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 9
				{
					title: '상담석 안내',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						items: [],
						filter: true,
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 10
				{
					title: '',
					value: '',
					disable: false,
				},
				// 11
				{
					title: '상담 완료 알림',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						items: [],
						filter: true,
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
				// 12
				{
					title: '',
					value: '',
					disable: false,
				},
				// 13
				{
					title: '상담 미처리 알림',
					value: '',
					disable: false,
					type: 'selectBox',
					selectBox: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						clearable: true,
						items: [],
						filter: true,
						inputItems: [],
						outlined: true,
						class: 'small_font bizInput',
					},
				},
			],
			selStart: {
				value: changeTime[1],
				errorMessage: '',
				hideDetail: true,
				items: changeTime,
				inputItems: [],
				outlined: true,
				class: 'small_font bizInput',
			},
			selEnd: {
				value: changeTime[changeTime.length - 7],
				errorMessage: '',
				hideDetail: true,
				items: changeTime,
				inputItems: [],
				outlined: true,
				class: 'small_font bizInput',
			},
			selTimeTerm: {
				value: '60',
				errorMessage: '',
				hideDetail: true,
				items: ['15', '30', '60'],
				inputItems: [],
				outlined: true,
				class: 'small_font bizInput',
			},
			mask: '###-####-####',
			csvImport: false,
			preview: false,
			parseCsv: null,
			mapfields: ['name', 'phone'],
			selection: '',
			ClickpickerChip: false,
			txtFieldName: {
				maxlength: '255',
				outlined: true,
				autofocus: true,
			},
			selectUseLg: {
				value: '',
				items: ['Y', 'N'],

				outlined: true,
				hideDetail: true,
			},

			cancelBtn: {
				class: 'cancelBtn',
			},
			UploadBtn: {
				class: '',
				height: '40',
				dark: true,
			},
			UploadBtn2: {
				class: '',
				height: '40',
				iconMdi: true,
			},
			imgFileUrl: '',
			imgFile: '',
			testIndex: 0,
			selectIndex: 0,
			DateIndex: 0,
			chipIndex: 0,
			bottomBtn: {
				color: '',
				dark: true,
				width: 100,
				height: 40,
			},

			add_Btn: {
				color: '',
				dark: true,
				height: 26,
			},
			addCount: 0,
			eventsList: [],
			prevTitle: '',
			timePicker1: false,
			timePicker2: false,
			mainimg: null,
			companionImg: null,
			directimg: null,
			businessesDatas: [],
			copyData: '',
			timeEdit: false,
			code: '',
			counselser: '',
			reserve_direct_Add: '',
			reserveDayHost: '',
			reserveDirectHost: '',
			enterQRHost: '',
			counselQRHost: '',
			boardHost: '',
			addStatus: false,
			inputBoxesData: [],
			reserveDayId: null,
			fileIndex: null,
			addBtn: {
				color: '',
				dark: true,
				btn_txt: '생성',
			},
			pickerRangeData: [],
			selReserveDay: {
				outlined: true,
				items: [],
				id: [],
				value: '',
				label: '방문 거점 홍보명',
			},

			btnGo: {
				color: '',
				dark: true,
				btn_txt: '바로가기',
				xsmall: true,
			},
			btnPaste: {
				color: '',
				dark: true,
				btn_txt: 'URL복사',
				xsmall: true,
			},
			picker: '',
			timeSel: '',
			timeTxtfield: {
				maxlength: '5',
				outlined: true,
				hideDetail: true,
				errorMessage: '',
				autocomplete: 'off',
			},
			totalExceptionTime: [],
			exceptionTime: [],
			visitReservation: [
				// 0
				{
					title: '예약명',
					value: '',
				},
				// 1
				{
					title: '시작일',
					value: '',
				},
				// 2
				{
					title: '종료일',
					value: '',
				},
				// 3
				{
					title: '전체예약수',
					value: 0,
				},
				// 4
				{
					title: '상담사 페이지',
					type: 'counselerClick',
					btn: {},
				},
				// 5
				{
					title: '예약페이지',
					type: 'reservedayClick',
					btn: {},
				},
				// 6
				{
					title: '동반고객 방문등록',
					type: 'reserve_direct_Add',
					btn: {},
				},
				// 7
				{
					title: '동반고객 상담신청',
					type: 'reservedirectClick',
					btn: {},
				},
				// 8
				{
					title: '입장확인',
					type: 'enterQRClick',
					btn: {},
				},
				// 9
				{
					title: '상담신청',
					type: 'counselQRClick',
					btn: {},
				},
				// 10
				{
					title: '상담현황판',
					type: 'boardHostClick',
					btn: {},
				},
			],
			pickers: [
				{
					title: '시작일*',
					picker: {
						menu: false,
						menu2: true,
						date: '',
						date2: '',
						class: 'whiteBack defalut-date-picker-setting',
						errorMessage: '',
						hideDetail: true,
						disable: false,
					},
					required: true,
				},
				{
					title: '종료일*',
					picker: {
						menu: false,
						menu2: false,
						date: '',
						date2: '',
						class: 'whiteBack defalut-date-picker-setting',
						errorMessage: '',
						hideDetail: true,
						disable: true,
					},
					required: true,
				},
				{
					title: '오픈일*',
					picker: {
						menu: false,
						menu2: true,
						date: '',
						date2: '',
						class: 'whiteBack defalut-date-picker-setting',
						errorMessage: '',
						hideDetail: true,
						disable: false,
					},
					required: true,
				},
				{
					title: '마감일*',
					picker: {
						menu: false,
						menu2: false,
						date: '',
						date2: '',
						class: 'whiteBack defalut-date-picker-setting',
						errorMessage: '',
						hideDetail: true,
						disable: true,
					},
					required: true,
				},
			],
			leftInfoTop: [
				// 0
				{
					title: '사업지*',
					value2: '',
					sel: {
						value: '',
						disable: false,
						errorMessage: '',
						hideDetail: true,
						items: [],
						inputItems: [],
						outlined: true,
					},
					required: true,
				},
				// 1
				{
					title: '예약명*',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_예약명.png',
					},
					required: true,
				},
				// 2
				{
					title: '상담신청 사업지명*',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_상담신청 사업지명.png',
					},
					required: true,
				},
				// 3
				{
					title: '메인이미지',
					value: '',
					file: { name: '' },
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						placeholder: '※ jpg,png / 500kb이하',
					},
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
					tooltip: {
						url: '/image/tooltip/4.방문예약_메인이미지.png',
					},
					required: false,
				},
				// 4
				{
					title: '버튼텍스트',
					value: '',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_버튼텍스트.png',
					},
					required: false,
				},
				// 5
				{
					title: '질문선택*',
					sel: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						items: [],
						inputItems: [],
						outlined: true,
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_질문선택.png',
					},
					required: true,
				},
				// 6
				{
					title: '문진표 선택',
					sel: {
						value: '',
						errorMessage: '',
						hideDetail: true,
						items: [],
						inputItems: [],
						outlined: true,
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_문진표선택.png',
					},
					required: false,
				},
				// 7
				{
					title: '상담사 CommentTag',
					value: '',
					combobox: {},
					required: false,
					tooltip: {
						url: '/image/tooltip/4.방문예약_상담사코멘트.png',
					},
				},
				// 8
				{
					title: '완료 링크',
					value: 'https://pf.kakao.com/_IgBkj/friend',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_완료링크.png',
					},
					required: false,
				},
				// 9
				{
					title: '인증 방식',
					value: false,
					checkbox: {
						hideDetail: true,
						trueLabel: '카카오 로그인 허용',
						falseLabel: '카카오 로그인 미허용',
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_인증방식.png',
					},
					required: false,
				},
				// 10
				{
					title: '정보 표시',
					value: false,
					checkbox: {
						hideDetail: true,
						trueLabel: '표시',
						falseLabel: '숨김',
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_정보표시.png',
					},
					required: false,
				},

				// 11
				{
					title: '모집단 선택',
					sel: {
						value: '',
						disable: false,
						errorMessage: '',
						hideDetail: true,
						items: [],
						inputItems: [],
						outlined: true,
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_모집단선택.png',
					},
					required: false,
				},
				// 12
				{
					title: '참여 허용된 전화번호',
					value: '',
					csvImport: false,
					area: {
						noresize: true,
						readonly: true,
						outlined: true,
						height: '3vh',
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_참여허용된 전화번호.png',
					},
					required: false,
				},
				// 13
				{
					title: '이벤트 설정',
					sel: {
						value: '없음',
						disable: false,
						errorMessage: '',
						hideDetail: true,
						items: [],
						inputItems: [],
						outlined: true,
					},
					tooltip: {
						url: '/image/tooltip/4.방문예약_이벤트 설정.png',
					},
					required: false,
				},
				// 14
				{
					title: '예약자 알림톡 받기',
					value: false,
					checkbox: {
						trueLabel: '허용',
						falseLabel: '비허용',
						txtfield: {
							value: '',
							maxlength: '13',
							outlined: true,
							hideDetail: true,
							errorMessage: '',
							autocomplete: 'off',
							placeholder: '알림톡 받을 전화번호 입력',
						},
					},
					tooltip: {
						url: '',
					},
					required: false,
				},
				//15
				{
					title: '대기번호 시작번호',
					value: '0',
					txtfield: {
						maxlength: '255',
						outlined: true,
						hideDetail: true,
						errorMessage: '',
						autocomplete: 'off',
						type: 'Number',
						max: '9999',
					},
					tooltip: {
						url: '',
					},
					required: false,
				},
			],
			leftInfoBottom: [
				{
					title: '방문등록 이미지',
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
					tooltip: {
						url: '/image/tooltip/4.방문예약_방문등록이미지.png',
					},
					required: false,
				},
				{
					title: '상담신청 이미지',
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
					tooltip: {
						url: '/image/tooltip/4.방문예약_상담신청 이미지.png',
					},
					required: false,
				},
			],

			selTermMax: {
				value: '10',
				maxlength: '255',
				outlined: true,
				hideDetail: true,
				errorMessage: '',
				autocomplete: 'off',
				type: 'Number',
				max: '9999',
			},
			selCommon: {
				value: '',
				class: 'small_font bizInput mt-2',
				errorMessage: '',
				hideDetail: true,
				items: [],
				inputItems: [],
				outlined: true,
			},
			selTime: {
				value: '',
				class: 'small_font bizInput mt-2',
				errorMessage: '',
				hideDetail: true,
				items: [],
				inputItems: [],
				outlined: true,
			},
		}
	},
	watch: {
		setdialog: {
			deep: true,
			async handler() {
				if (this.setdialog.dialog) {
					if (this.setdialog.type === 'create') {
						Object.assign(this.$data, this.$options.data())
						if (!this.pickers[0].picker.date) {
							await this.getBusiness()
							await this.first_messages_call()
						}
					} else {
						if (this.setdialog.item && !this.items[0].selectBox.value) {
							this.items[0].selectBox.value = this.setdialog.item.business
							this.items[0].value2 = this.setdialog.item.business?.code
							this.items[1].value = this.setdialog.item.title
							this.items[2].value = this.setdialog.item.mainimg?.name
							this.items[3].selectBox.value = this.setdialog.item.input_box?.name
							this.items[4].value = this.setdialog.item.btnText
							this.items[5].value = this.setdialog.item.accessPhones ? this.setdialog.item.accessPhones : ''
							this.items[6].value = this.setdialog.item.endLink
							this.items[7].selectBox.value = this.setdialog.item.event?.title
							this.items[8].value = this.setdialog.item.startWaitingNumber ? String(this.setdialog.item.startWaitingNumber) : '1'
							this.pickers[0].picker.date = this.$moment(this.setdialog.item.sdate).format('YYYY-MM-DD')
							this.pickers[1].picker.date = this.$moment(this.setdialog.item.edate).format('YYYY-MM-DD')
							this.pickers[2].picker.date = this.$moment(this.setdialog.item.openDate).format('YYYY-MM-DD')
							this.pickers[3].picker.date = this.$moment(this.setdialog.item.endDate).format('YYYY-MM-DD')
							this.pickers[3].picker.disable = false
							await this.changeStartDate()
							await this.selTimeChange()
							this.selTimeTerm.value = this.setdialog.item.splitMinute
							this.selTermMax.value = String(this.setdialog.item.maxcount)
							this.totalExceptionTime = this.setdialog.item.nodaySetting
							this.selStart.value = this.setdialog.item.timeRange.substring(0, 5)
							this.selEnd.value = this.setdialog.item.timeRange.substring(6, 11)
							await this.getBusiness()
							await this.first_messages_call()
						}
					}
					if (this.first) {
						await this.Inputboxes(this.setdialog.item.business.id)
						await this.events(this.setdialog.item.business.id)
					}
				} else {
					Object.assign(this.$data, this.$options.data())
				}
			},
		},
	},
	methods: {
		checkDatas() {
			if (!this.items[0].selectBox.value) {
				this.sweetInfo.title = '프로젝트 선택'
				this.sweetInfo.content = `프로젝트를 선택해주세요.`
				return (this.sweetInfo.open = true)
			}
			if (this.setdialog.type === 'edit') {
				if (
					this.reservedaysData
						.map(x => x.title)
						.filter(x => x !== this.setdialog.item.title)
						.indexOf(this.items[1].value) > -1
				) {
					this.sweetInfo.title = '예약명 중복'
					this.sweetInfo.content = `동일한 예약명이 존재합니다.`
					return (this.sweetInfo.open = true)
				}
			} else {
				if (this.reservedaysData.map(x => x.title).indexOf(this.items[1].value) > -1) {
					this.sweetInfo.title = '예약명 중복'
					this.sweetInfo.content = `동일한 예약명이 존재합니다.`
					return (this.sweetInfo.open = true)
				}
			}
			if (!this.items[1].value) {
				this.sweetInfo.title = '예약명 입력'
				this.sweetInfo.content = `예약명을 입력해주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.items[3].selectBox.value) {
				this.sweetInfo.title = '문항선택'
				this.sweetInfo.content = `문항을 선택해주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.pickers[0].picker.date) {
				this.sweetInfo.title = '예약 기간 설정 입력'
				this.sweetInfo.content = `예약 기간 설정을 입력해주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.pickers[1].picker.date) {
				this.sweetInfo.title = '예약 기간 설정 입력'
				this.sweetInfo.content = `예약 기간 설정을 입력해주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.pickers[2].picker.date) {
				this.sweetInfo.title = '방문 기간 설정 입력'
				this.sweetInfo.content = `기간 설정을 입력해주세요.`
				return (this.sweetInfo.open = true)
			}
			if (!this.pickers[3].picker.date) {
				this.sweetInfo.title = '방문 기간 설정 입력'
				this.sweetInfo.content = `방문 기간 설정을 입력해주세요.`
				return (this.sweetInfo.open = true)
			}

			this.sweetDialog.open = true
		},
		previewClick(item) {
			if (item) {
				let preview_buttons = item.button ? JSON.parse(item.button) : []
				if (preview_buttons) {
					if (preview_buttons.button) {
						preview_buttons = preview_buttons.button
					}
				} else {
					preview_buttons = []
				}

				preview_buttons.forEach(el => {
					el['text'] = el.name
				})

				this.preview_dialog.title = item.tplCodeStr
				this.preview_dialog.content = item.message
				this.preview_dialog.buttons = preview_buttons
				this.preview_dialog.dialog = true
			}
		},
		async first_messages_call() {
			// 약관 내역 호출
			let variable = {}
			this.$store.dispatch('messages', variable).then(res => {
				this.messageDatas = res.data.messages
				this.items3.forEach(el => {
					if (el.selectBox) {
						el.selectBox.items = res.data.messages.map(x => x.tplCodeStr).sort()
					}
				})
				if (this.setdialog.type === 'edit') {
					if (this.setdialog.item) {
						this.items3[0].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[0]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[0])].tplCodeStr
								: ''
						this.items3[4].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[1]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[1])].tplCodeStr
								: ''
						this.items3[2].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[2]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[2])].tplCodeStr
								: ''
						this.items3[1].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[3]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[3])].tplCodeStr
								: ''
						this.items3[7].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[4]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[4])].tplCodeStr
								: ''
						this.items3[5].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[5]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[5])].tplCodeStr
								: ''
						this.items3[9].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[6]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[6])].tplCodeStr
								: ''
						this.items3[3].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[7]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[7])].tplCodeStr
								: ''
						this.items3[6].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[9]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[9])].tplCodeStr
								: ''
						this.items3[11].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[11]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[11])].tplCodeStr
								: ''
						this.items3[8].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[14]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[14])].tplCodeStr
								: ''
						this.items3[13].selectBox.value =
							this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[15]) > -1
								? this.messageDatas[this.messageDatas.map(x => x.tplCode).indexOf(this.setdialog.item.tplCode[15])].tplCodeStr
								: ''
					}
				}
			})
		},
		getBusiness() {
			const data = {
				show: true,
			}
			this.$store.dispatch('businesses', data).then(res => {
				this.businessesDatas = res.data.businesses
				this.items[0].selectBox.items = res.data.businesses
			})
		},

		async Inputboxes(id) {
			const data = {
				business: id,
			}
			await this.$store.dispatch('inputboxes_list', data).then(res => {
				this.inputBoxesData = res.data.inputBoxes
				this.items[3].selectBox.items = res.data.inputBoxes.map(x => x.name).sort()
				this.items[5].selectBox.items = res.data.inputBoxes.map(x => x.name).sort()
				this.items[5].selectBox.items.unshift('설정 해제')
				if (this.setdialog.type === 'edit') {
					if (this.setdialog.item) {
						this.items[5].selectBox.value = this.setdialog.item.population
							? this.inputBoxesData[this.inputBoxesData.map(x => x.id).indexOf(this.setdialog.item.population)].name
							: '설정 해제'
					}
				}
				this.first = false
			})
		},
		events(id) {
			const data = {
				status: 1,
				business: id,
			}
			this.$store.dispatch('events', data).then(res => {
				this.eventsList = res.data.events
				this.items[7].selectBox.items = res.data.events.map(data => data.title).sort()
				// this.items[7].selectBox.items.unshift('없음')
			})
		},

		resetDates() {
			this.totalExceptionTime.forEach(element => {
				element.times.forEach(time => {
					time.radio = false
					time.maxCount = this.selTermMax.value
				})
			})
			this.exceptionTime.items.forEach(time => {
				time.radio = false
				time.maxCount = this.selTermMax.value
			})
		},
		csvDownloadClick() {
			var a = document.createElement('a')

			a.href = location.protocol + '//' + location.host + '/sampleXLSX.xlsx'
			a.download = 'sampleXLSX.xlsx'
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
			if (this.selTime.value === '시간 초기화') {
				let number = 0
				val.forEach(element => {
					number += Number(element.maxCount)
				})
				return number
			} else if (this.selTime.value === '날짜 제외') {
				return 0
			} else if (val) {
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
		leftInfoSelectChange(index) {
			if (index === 11) {
				this.parseCsv = null
				this.leftInfoTop[index + 1].value = ''
			}
		},
		async fileUpload(e) {
			// this.$store.state.loading = true
			// const filedata = {
			// 	file: e.target.files[0],
			// }
			// await this.$store
			// 	.dispatch('upload', filedata)
			// 	.then(res => {
			// 		this.$store.state.loading = false
			// 		this.items[2].value = e.target.files[0].name
			// 		this.mainimg = res.data[0].id
			// 	})
			// 	.catch(() => {
			// 		this.$store.state.loading = false
			// 	})
			let img = new Image()
			img.src = window.URL.createObjectURL(e.target.files[0])

			img.onload = async () => {
				// 일반 이미지형
				// - 권장 사이즈 : 600px*600px
				// - 제한 사이즈 - 가로 500px 미만 또는 가로:세로 비율이 2:1 미만 또는 3:4 초과시 업로드 불가
				// - 파일형식 및 크기 : jpg, png / 최대 500KB
				if (img.width > 600 || img.height > 600) {
					this.sweetInfo.title = '이미지 업로드 불가'
					this.sweetInfo.content = `600px * 600px 이하의 이미지를 업로드해주세요.`
					return (this.sweetInfo.open = true)
				} else if (img.width < 500) {
					this.sweetInfo.title = '이미지 업로드 불가'
					this.sweetInfo.content = `가로길이가 500px 이상인 이미지를 업로드해주세요.`
					return (this.sweetInfo.open = true)
				} else if (img.width / img.height > 2 || img.width / img.height < 3 / 4) {
					this.sweetInfo.title = '이미지 업로드 불가'
					this.sweetInfo.content = `가로/세로 비율이 2:1 이상, 3:4 이하의 이미지를 업로드해주세요.`
					return (this.sweetInfo.open = true)
				} else if (e.target.files[0].size / 1024 > 500) {
					this.sweetInfo.title = '이미지 업로드 불가'
					this.sweetInfo.content = `500kb 이하의 이미지를 업로드해주세요.`
					return (this.sweetInfo.open = true)
				} else {
					const filedata = {
						file: e.target.files[0],
					}
					this.$store.state.loading = true

					await this.$store.dispatch('upload', filedata).then(res => {
						this.$store.state.loading = false
						this.items[2].value = e.target.files[0].name
						this.mainimg = res.data[0].id
					})
				}
			}
		},
		selStartClick() {
			let idx = changeTime.indexOf(this.selStart.value)
			this.selEnd.items = changeTime.slice(idx)
			this.selTimeChange()
		},
		selEndClick() {
			let idx = changeTime.indexOf(this.selEnd.value)
			this.selStart.items = changeTime.slice(0, idx)
			this.selTimeChange()
		},
		timeEditClick() {
			if (this.timeEdit === false) {
				this.reserveday()
			}
		},
		pasteWindeow(val) {
			if (val === 'counselerClick') {
				this.counselerPasteClick()
			} else if (val === 'reservedayClick') {
				this.reservedayPasteClick()
			} else if (val === 'reservedirectClick') {
				this.reservedirectPasteClick()
			} else if (val === 'enterQRClick') {
				this.enterQRPasteClick()
			} else if (val === 'counselQRClick') {
				this.counselQRPasteClick()
			} else if (val === 'boardHostClick') {
				this.boardHostPasteClick()
			} else if (val === 'reserve_direct_Add') {
				this.reserve_direct_AddPasteClick()
			}
		},
		openWindow(val) {
			if (val === 'counselerClick') {
				this.counselerClick()
			} else if (val === 'reservedayClick') {
				this.reservedayClick()
			} else if (val === 'reservedirectClick') {
				this.reservedirectClick()
			} else if (val === 'enterQRClick') {
				this.enterQRClick()
			} else if (val === 'counselQRClick') {
				this.counselQRClick()
			} else if (val === 'boardHostClick') {
				this.boardHostClick()
			} else if (val === 'reserve_direct_Add') {
				this.reserve_direct_AddClick()
			}
		},
		counselerPasteClick() {
			const dummy = document.createElement('input')
			const text = this.counselser + this.$store.state.meData.group.groupcode + '/' + this.code
			document.body.appendChild(dummy)
			dummy.value = text
			dummy.select()
			document.execCommand('copy')
			document.body.removeChild(dummy)
			alert('URL이 클립보드에 복사되었습니다')
		},
		reserve_direct_AddPasteClick() {
			const dummy = document.createElement('input')
			const text = this.reserve_direct_Add + this.$store.state.meData.group.groupcode + '/' + this.code
			document.body.appendChild(dummy)
			dummy.value = text
			dummy.select()
			document.execCommand('copy')
			document.body.removeChild(dummy)
			alert('URL이 클립보드에 복사되었습니다')
		},

		reservedayPasteClick() {
			const dummy = document.createElement('input')
			const text = this.reserveDayHost + this.$store.state.meData.group.groupcode + '/' + this.code
			document.body.appendChild(dummy)
			dummy.value = text
			dummy.select()
			document.execCommand('copy')
			document.body.removeChild(dummy)
			alert('URL이 클립보드에 복사되었습니다')
		},
		reservedirectPasteClick() {
			const dummy = document.createElement('input')
			const text = process.env.VUE_APP_CUSTOMER_URL + '/reserve_direct/' + this.$store.state.meData.group.groupcode + '/' + this.code
			document.body.appendChild(dummy)
			dummy.value = text
			dummy.select()
			document.execCommand('copy')
			document.body.removeChild(dummy)
			alert('URL이 클립보드에 복사되었습니다')
		},
		enterQRPasteClick() {
			const dummy = document.createElement('input')
			const text = this.enterQRHost + this.$store.state.meData.group.groupcode + '/' + this.code
			document.body.appendChild(dummy)
			dummy.value = text
			dummy.select()
			document.execCommand('copy')
			document.body.removeChild(dummy)
			alert('URL이 클립보드에 복사되었습니다')
		},
		counselQRPasteClick() {
			const dummy = document.createElement('input')
			const text = this.counselQRHost + this.$store.state.meData.group.groupcode + '/' + this.code
			document.body.appendChild(dummy)
			dummy.value = text
			dummy.select()
			document.execCommand('copy')
			document.body.removeChild(dummy)
			alert('URL이 클립보드에 복사되었습니다')
		},
		boardHostPasteClick() {
			const dummy = document.createElement('input')
			const text = this.boardHost + this.$store.state.meData.group.groupcode + '/' + this.code
			document.body.appendChild(dummy)
			dummy.value = text
			dummy.select()
			document.execCommand('copy')
			document.body.removeChild(dummy)
			alert('URL이 클립보드에 복사되었습니다')
		},

		counselerClick() {
			window.open(this.counselser + this.$store.state.meData.group.groupcode + '/' + this.code)
		},
		reserve_direct_AddClick() {
			window.open(this.reserve_direct_Add + this.$store.state.meData.group.groupcode + '/' + this.code)
		},
		reservedayClick() {
			window.open(this.reserveDayHost + this.$store.state.meData.group.groupcode + '/' + this.code)
		},
		reservedirectClick() {
			window.open(process.env.VUE_APP_CUSTOMER_URL + '/reserve_direct/' + this.$store.state.meData.group.groupcode + '/' + this.code)
		},
		enterQRClick() {
			window.open(this.enterQRHost + this.$store.state.meData.group.groupcode + '/' + this.code)
		},
		counselQRClick() {
			window.open(this.counselQRHost + this.$store.state.meData.group.groupcode + '/' + this.code)
		},
		boardHostClick() {
			window.open(this.boardHost + this.$store.state.meData.group.groupcode + '/' + this.code)
		},
		changeStartDate(index) {
			if (this.pickers[0].picker.date === '') {
				this.pickers[1].picker.disable = true
			} else {
				this.pickers[1].picker.disable = false
			}
			if (index === 2) {
				this.timePicker1 = true
			} else if (index === 3) {
				this.timePicker2 = true
			}
			this.selTimeChange()
		},
		changeStartDate2() {
			if (this.pickers[2].picker.date === '') {
				this.pickers[3].picker.disable = true
			} else {
				this.pickers[3].picker.disable = false
			}
		},
		csvImportClick(index) {
			// 엑셀 업로드 클릭
			document.getElementById('excel_import4_' + index).click()
		},
		readFile(event, left, index) {
			this.$store.state.loading = true
			this.sweetInfo.title = '참여 그룹 설정 유의사항'
			this.sweetInfo.content = `전화번호 재업로드는 저장이후에 가능합니다.`
			this.sweetInfo.open = true
			// 엑셀 업로드

			var XLSX = require('xlsx')

			// get File object from input tag
			const file = event.target.files[0]
			// const fileName = file.name

			// declare FileReader, temp result
			const reader = new FileReader()
			let tmpResult = {}
			// if you use "this", don't use "function(e) {...}"
			reader.onload = () => {
				var fileData = reader.result
				var wb = XLSX.read(fileData, { type: 'binary' })
				wb.SheetNames.forEach(sheetName => {
					// var rowObj = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])
					const roa = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { header: 1 })
					if (roa.length) tmpResult[sheetName] = roa
				})
				let li = []
				tmpResult[wb.SheetNames[0]].forEach((x, index) => {
					if (index !== 0) {
						li.push({
							name: x[0],
							phone: x[1],
						})
					}
				})
				li[0]['fileName'] = file.name
				this.items[index].value = li
				this.items[index].csvImport = true

				this.items[index].selectBox.value = ''
				this.$store.state.loading = false
			}

			reader.readAsArrayBuffer(file)
		},

		clickSave() {
			if (this.setdialog.type === 'create') {
				this.createReserveday()
			} else {
				this.updateReserveday()
			}
		},
		async createReserveday() {
			let event
			this.eventsList.forEach(element => {
				if (element.title === this.items[7].selectBox.value) {
					event = element.id
				}
			})
			// let businessIdx = this.businessesDatas.findIndex(x => x.title === this.items[0].selectBox.value)
			// let business = ''
			// if (this.items[0].selectBox.value !== '') {
			// 	business = this.businessesDatas[businessIdx].id
			// } else {
			// 	business = ''
			// }
			let input_boxIdx = this.inputBoxesData.findIndex(x => x.name === this.items[3].selectBox.value)
			let input_box = ''
			if (this.items[3].selectBox.value !== '') {
				input_box = this.inputBoxesData[input_boxIdx].id
			} else {
				input_box = ''
			}
			let popurationIdx = this.inputBoxesData.findIndex(x => x.name === this.items[5].selectBox.value)
			let popuration = ''
			if (this.items[5].selectBox.value !== '') {
				if (this.items[5].selectBox.value === '설정 해제') {
					popuration = ''
				} else {
					popuration = this.inputBoxesData[popurationIdx].id
				}
			} else {
				popuration = ''
			}
			const data = {
				type: 'd',
				title: this.items[1].value,
				// consultingTitle: this.leftInfoTop[2].value,
				sdate: this.$moment(this.pickers[0].picker.date),
				edate: this.$moment(this.pickers[1].picker.date),
				openDate: this.$moment(this.pickers[2].picker.date)._d,
				endDate: this.$moment(this.pickers[3].picker.date)._d,
				btnText: this.items[4].value,
				commentTag: '',
				splitMinute: this.selTimeTerm.value,
				timeRange: this.selStart.value + ',' + this.selEnd.value,
				accessPhones: this.items[5].value ? this.items[5].value : null,
				status: 1,
				nodaySetting: this.totalExceptionTime,
				population: popuration,
				input_box: input_box,
				directInputBoxId: input_box,
				maxcount: Number(this.selTermMax.value),
				business: this.items[0].selectBox.value.id,
				endLink: this.items[6].value,
				kakaoLogin: false,
				showInfo: true,
				tplCode: [
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[0].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[0].selectBox.value)].tplCode
						: '', // 방문예약 알림(0)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[4].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[4].selectBox.value)].tplCode
						: '', // 1일전 알림(1)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[2].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[2].selectBox.value)].tplCode
						: '', // 취소 알림(2)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[1].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[1].selectBox.value)].tplCode
						: '', // 상담신청(3)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[7].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[7].selectBox.value)].tplCode
						: '', // 상담대기(임박안내)(4)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[5].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[5].selectBox.value)].tplCode
						: '', // 대기 알림(5) - 제거
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[9].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[9].selectBox.value)].tplCode
						: '', // 상담석 안내(6)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[3].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[3].selectBox.value)].tplCode
						: '', // 상담취소(미처리) 안내(7)
					'TG_1549', // 온도체크(8)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[6].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[6].selectBox.value)].tplCode
						: '', // 방문예약 당일(9)
					'TG_0652', // 상담 완료 알림 (10)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[11].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[11].selectBox.value)].tplCode
						: '', // 감사 알림 / 상담 완료 알림(11)
					'TG_6026', // 내가 받을 알림톡 (12)
					'TG_6027', // 내가 받을 알림톡 취소 (13),
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[8].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[8].selectBox.value)].tplCode
						: '', // 방문 등록완료(14)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[13].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[13].selectBox.value)].tplCode
						: '', // 상담 미처리 알림(15)
				],
				selfAlert: null,
				startWaitingNumber: Number(this.items[8].value),
			}
			if (event) {
				data.event = event
			} else {
				data.event = null
			}
			data.totalMaxcount = this.TotalNumber(this.totalExceptionTime)
			if (this.mainimg) {
				data.mainimg = this.mainimg
			}
			data.loginType = 'phone'
			await this.$store
				.dispatch('createReserveday', data)
				.then(() => {
					this.setdialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
					document.getElementById('refresh').click()
				})
				.catch(() => {
					alert('생성시 오류가 발생하였습니다.')
					this.$store.state.loading = false
				})
		},
		async updateReserveday() {
			let event
			this.eventsList.forEach(element => {
				if (element.title === this.items[7].selectBox.value) {
					event = element.id
				}
			})
			// let businessIdx = this.businessesDatas.findIndex(x => x.title === this.items[0].selectBox.value)
			// let business = ''
			// if (this.items[0].selectBox.value !== '') {
			// 	business = this.businessesDatas[businessIdx].id
			// } else {
			// 	business = ''
			// }
			let input_boxIdx = this.inputBoxesData.findIndex(x => x.name === this.items[3].selectBox.value)
			let input_box = ''
			if (this.items[3].selectBox.value !== '') {
				input_box = this.inputBoxesData[input_boxIdx].id
			} else {
				input_box = ''
			}
			let popurationIdx = this.inputBoxesData.findIndex(x => x.name === this.items[5].selectBox.value)
			let popuration = ''
			if (this.items[5].selectBox.value !== '') {
				if (this.items[5].selectBox.value === '설정 해제') {
					popuration = ''
				} else {
					popuration = this.inputBoxesData[popurationIdx].id
				}
			} else {
				popuration = ''
			}
			const data = {
				id: this.setdialog.id,
				type: 'd',
				title: this.items[1].value,
				// consultingTitle: this.leftInfoTop[2].value,
				sdate: this.$moment(this.pickers[0].picker.date),
				edate: this.$moment(this.pickers[1].picker.date),
				openDate: this.$moment(this.pickers[2].picker.date)._d,
				endDate: this.$moment(this.pickers[3].picker.date)._d,
				btnText: this.items[4].value,
				commentTag: '',
				splitMinute: this.selTimeTerm.value,
				timeRange: this.selStart.value + ',' + this.selEnd.value,
				accessPhones: this.items[5].value ? this.items[5].value : null,
				status: 1,
				nodaySetting: this.totalExceptionTime,
				population: popuration,
				input_box: input_box,
				directInputBoxId: input_box,
				maxcount: Number(this.selTermMax.value),
				business: this.items[0].selectBox.value.id,
				endLink: this.items[6].value,
				kakaoLogin: false,
				showInfo: true,
				tplCode: [
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[0].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[0].selectBox.value)].tplCode
						: '', // 방문예약 알림(0)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[4].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[4].selectBox.value)].tplCode
						: '', // 1일전 알림(1)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[2].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[2].selectBox.value)].tplCode
						: '', // 취소 알림(2)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[1].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[1].selectBox.value)].tplCode
						: '', // 상담신청(3)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[7].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[7].selectBox.value)].tplCode
						: '', // 상담대기(임박안내)(4)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[5].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[5].selectBox.value)].tplCode
						: '', // 대기 알림(5) - 제거
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[9].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[9].selectBox.value)].tplCode
						: '', // 상담석 안내(6)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[3].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[3].selectBox.value)].tplCode
						: '', // 상담취소(미처리) 안내(7)
					'TG_1549', // 온도체크(8)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[6].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[6].selectBox.value)].tplCode
						: '', // 방문예약 당일(9)
					'TG_0652', // 방문예약 변경 (10)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[11].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[11].selectBox.value)].tplCode
						: '', // 감사 알림 / 상담 완료 알림(11)
					'TG_6026', // 내가 받을 알림톡 (12)
					'TG_6027', // 내가 받을 알림톡 취소 (13),
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[8].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[8].selectBox.value)].tplCode
						: '', // 방문 등록완료(14)
					this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[13].selectBox.value) > -1
						? this.messageDatas[this.messageDatas.map(x => x.tplCodeStr).indexOf(this.items3[13].selectBox.value)].tplCode
						: '', // 상담 미처리 알림(15)
				],
				selfAlert: null,
				startWaitingNumber: Number(this.items[8].value),
			}
			if (event) {
				data.event = event
			} else {
				data.event = null
			}
			data.totalMaxcount = this.TotalNumber(this.totalExceptionTime)
			if (this.mainimg) {
				data.mainimg = this.mainimg
			}
			await this.$store
				.dispatch('updateReserveday', data)
				.then(() => {
					this.setdialog.dialog = false
					this.sweetDialog.open = false
					this.$store.state.loading = false
					document.getElementById('refresh').click()
				})
				.catch(() => {
					this.$store.state.loading = false
				})
		},
		excludedTime() {
			if (this.timeSel === 'radio-1') {
				this.totalExceptionTime.forEach(element => {
					element.times.forEach(e => {
						if (e.clock.indexOf(this.selCommon.value.substring(0, 3)) !== -1) {
							e.radio = true
							e.maxCount = 0
						}
					})
				})
			} else if (this.timeSel === 'radio-2') {
				this.totalExceptionTime.forEach(element => {
					element.times.forEach(e => {
						if (e.clock.indexOf(this.selCommon.value) !== -1) {
							e.radio = true
							e.maxCount = 0
						}
					})
				})
			}
			this.picker = ''
		},
		timeSet() {
			this.timeSel = ''
			this.selCommon.items = []
		},
		maxCount() {
			this.selTime.value = ''
			this.picker = ''
			this.exceptionTime = []
			this.totalExceptionTime.forEach(element => {
				element.times.forEach(e => {
					if (e.radio === false) {
						e.maxCount = this.selTermMax.value
					}
				})
			})
		},
		selTimeRange() {
			if (this.selTime.value === '날짜 제외') {
				this.exceptionTime.times.forEach(time => {
					time.maxCount = 0
					time.radio = true
				})
			} else if (this.selTime.value === '시간 초기화') {
				this.exceptionTime.times.forEach(time => {
					time.maxCount = this.selTermMax.value
					time.radio = false
				})
			}
		},
		selDatePicker() {
			if (this.exceptionTime !== []) {
				let index = this.totalExceptionTime.findIndex(x => x.date === this.exceptionTime.date)
				this.totalExceptionTime[index] = this.exceptionTime
			}
			this.selTime.value = ''
			let idx = this.totalExceptionTime.findIndex(x => x.date === this.picker)
			this.exceptionTime = this.totalExceptionTime[idx]
			let startRange = this.selStart.value
			let endRange = this.selEnd.value
			this.selTime.items = []
			for (let index = 0; startRange < endRange; index++) {
				this.selTime.items.push(startRange)

				startRange = this.$moment
					.utc(startRange, 'HH:mm')
					.add(60, 'minutes')
					.format('HH:mm')
			}
			this.selTime.items.push('날짜 제외')
			this.selTime.items.push('시간 초기화')
		},
		selTimeChange() {
			this.timeSet()
			let startRange
			let endRange
			this.totalExceptionTime = []
			this.selTime.items = []
			this.exceptionTime = []
			this.selTime.value = ''
			this.picker = ''
			startRange = this.selStart.value
			endRange = this.selEnd.value
			let dateRange = this.$moment(this.pickers[1].picker.date).diff(this.pickers[0].picker.date, 'days')
			for (let index = 0; index < dateRange + 1; index++) {
				let date = this.$moment(this.pickers[0].picker.date)
					.add(index, 'd')
					.format('YYYY-MM-DD')
				this.totalExceptionTime.push({
					date: date,
					times: [],
				})
			}
			for (let index = 0; startRange < endRange; index++) {
				this.selTime.items.push(startRange)

				startRange = this.$moment
					.utc(startRange, 'HH:mm')
					.add(60, 'minutes')
					.format('HH:mm')
			}
			if (this.selTimeTerm.value !== '') {
				this.totalExceptionTime.forEach(element => {
					startRange = this.selStart.value
					endRange = this.selEnd.value
					for (let index = 0; startRange < endRange; index++) {
						element.times.push({
							clock: startRange,
							maxCount: this.selTermMax.value,
							radio: false,
						})
						startRange = this.$moment
							.utc(startRange, 'HH:mm')
							.add(this.selTimeTerm.value, 'minutes')
							.format('HH:mm')
					}
				})
			}
		},
		radioExcept() {
			let startRange
			let endRange

			if (this.timeSel === 'radio-1') {
				startRange = this.selStart.value
				endRange = this.selEnd.value
				this.selCommon.items = []
				this.exceptionTime = []
				this.selTime.items = []
				for (let index = 0; startRange < endRange; index++) {
					this.selCommon.items.push(startRange)
					this.selTime.items.push(startRange)
					startRange = this.$moment
						.utc(startRange, 'HH:mm')
						.add(60, 'minutes')
						.format('HH:mm')
				}
			} else if (this.timeSel === 'radio-2') {
				startRange = this.selStart.value
				endRange = this.selEnd.value
				this.selCommon.items = []
				this.exceptionTime = []
				this.selTime.items = []
				for (let index = 0; startRange < endRange; index++) {
					this.selTime.items.push(startRange)
					startRange = this.$moment
						.utc(startRange, 'HH:mm')
						.add(60, 'minutes')
						.format('HH:mm')
				}
				startRange = this.selStart.value
				endRange = this.selEnd.value
				for (let index = 0; startRange < endRange; index++) {
					this.selCommon.items.push(startRange)
					this.selTime.items.push(startRange)
					startRange = this.$moment
						.utc(startRange, 'HH:mm')
						.add(this.selTimeTerm.value, 'minutes')
						.format('HH:mm')
				}
			}
		},
		allowed_dates_open(val) {
			if (this.pickers[0].picker.date !== '') {
				if (this.pickers[0].picker.date >= val) {
					return val
				}
			} else {
				return val
			}
		},
		allowed_dates_endDate(val) {
			if (this.pickers[1].picker.date !== '') {
				if (this.pickers[1].picker.date >= val && this.pickers[0].picker.date <= val) {
					return val
				}
			} else {
				return val
			}
		},
		allowed_dates_start(val) {
			if (this.pickers[1].picker.date !== '') {
				val = this.pickers[1].picker.date > val
				return val
			} else {
				return val
			}
		},
		allowed_dates_end(val) {
			if (this.pickers[0].picker.date !== '') {
				val = this.pickers[0].picker.date < val
				return val
			} else {
				return val
			}
		},
		allowed_dates_start2(val) {
			if (this.pickers[3].picker.date !== '') {
				val = this.pickers[3].picker.date > val
				return val
			} else {
				return val
			}
		},
		allowed_dates_end2(val) {
			if (this.pickers[2].picker.date !== '') {
				val = this.pickers[2].picker.date < val
				return val
			} else {
				return val
			}
		},

		radioClick(time) {
			if (!time.radio) {
				time.maxCount = this.selTermMax.value
			} else {
				time.maxCount = '0'
			}
		},
		allowed_dates(val) {
			val = this.pickers[0].picker.date <= val && val <= this.pickers[1].picker.date
			return val
		},

		reservedays() {
			this.$store.state.loading = true
			const data = {
				status: 1,
			}
			this.$store
				.dispatch('reservedays', data)
				.then(res => {
					this.items[5].selectBox.items = res.data.reservedays.map(x => x.title).sort()
					this.$store.state.loading = false
				})
				.catch(() => {
					this.$store.state.loading = false
				})
		},
		change(left, idx) {
			if (idx === 0) {
				this.items[idx].value2 = left.selectBox.value.code
				this.items[3].selectBox.value = null
				this.items[5].selectBox.value = '설정 해제'
				this.items[7].selectBox.value = null
				this.Inputboxes(this.items[idx].selectBox.value.id)
				this.events(this.items[idx].selectBox.value.id)
			} else if (idx === 5) {
				this.items[idx].value = ''
			}
		},
		clickinput() {},

		fileUploadTop(event) {
			this.leftInfoTop[this.fileIndex].value = event.target.files[0].name
			this.leftInfoTop[this.fileIndex].file = event.target.files[0]
		},

		fileUploadBottom(event) {
			this.leftInfoBottom[this.fileIndex].value = event.target.files[0].name
			this.leftInfoBottom[this.fileIndex].file = event.target.files[0]
		},

		sample() {},
		clickFileUploadImage() {
			document.getElementById('file_upload1').click()
		},
		disabledata() {
			this.datedisable = false
		},

		name() {
			// if (this.setdialog.name) {
			// 	this.setdialog.txtFieldName.errorMessage = ''
			// }
		},
		clickCancel() {
			this.setdialog.dialog = false
			this.first = true
		},

		changeDummy() {},
		changeIndex(i) {
			this.selectIndex = i
			// this.setdialog.selectBoxes = this.selectBoxes
		},

		chipsdelete(y) {
			// 제외시간 chip 삭제
			this.setdialog.items[this.selectIndex].selChip.items.push(
				this.setdialog.items[this.selectIndex].selChip.chips[this.chipIndex].noTime[y],
			)

			let commonIndex = this.setdialog.items.findIndex(e => e.commonNotime)
			let checkSelected = this.setdialog.items[commonIndex].commonNotime.items.findIndex(
				e => e === this.setdialog.items[this.selectIndex].selChip.chips[this.chipIndex].noTime[y],
			)
			if (checkSelected === -1) {
				this.setdialog.items[commonIndex].commonNotime.items.push(
					this.setdialog.items[this.selectIndex].selChip.chips[this.chipIndex].noTime[y],
				)
			}
			this.setdialog.items[commonIndex].commonNotime.items.sort()
			this.setdialog.items[this.selectIndex].selChip.chips[this.chipIndex].noTime.splice(y, 1)
			this.setdialog.items[this.selectIndex].selChip.items.sort((a, b) => {
				if (a > b) return 1
				if (a === b) return 0
				if (a < b) return -1
			})
			this.setdialog.items[this.selectIndex].selChip.value = null
		},
		changeMsgBox(val) {
			// // 알림톡 chip 추가
			const selectarray = this.setdialog.items[this.selectIndex].selectChip

			selectarray.chips.push(val)
			let itemsindex = selectarray.items.indexOf(val)
			selectarray.items.splice(itemsindex, 1)
			selectarray.chips.sort()

			selectarray.value = ''
		},

		msgChipsdelete(i, y) {
			// 제외시간 chip 삭제
			this.setdialog.items[i].selectChip.items.push(this.setdialog.items[i].selectChip.chips[y])
			this.setdialog.items[i].selectChip.chips.splice(y, 1)
			this.setdialog.items[i].selectChip.items.sort((a, b) => {
				if (a > b) return 1
				if (a === b) return 0
				if (a < b) return -1
			})
			this.setdialog.items[i].selectChip.value = null
		},
		selectdate(date, i) {
			this.DateIndex = i
			this.setdialog.items[i].selChip.chips.push({
				date: date[date.length - 1],
				noTime: [],
			})
			// 제외날째 chip 추가
			let selectarray = this.setdialog.items[this.DateIndex].pickerChip
			selectarray.chips = selectarray.date
		},
		deleteDate(element, y, chip, i) {
			this.DateIndex = i
			// 제외날째 chip 삭제
			element.pickerChip.chips.splice(y, 1)
			this.setdialog.items[this.DateIndex].pickerChip.date = element.pickerChip.chips
			const index = element.selChip.chips.map(x => x.date).indexOf(chip)
			element.selChip.chips.splice(index, 1)
			this.setdialog.items[this.DateIndex].selChip.chips = element.selChip.chips
			if (element.pickerChip.chipTxt === chip) {
				element.pickerChip.chipTxt = ''
			}
		},
		chipCont(item, i, y) {
			this.selectIndex = i
			this.chipIndex = y
			// this.setdialog.items[i].selChip.items = this.$store.state.selChips.split(',')
			// if (this.setdialog.items[i].selChip.chips[y].noTime.length > 0) {
			// 	this.setdialog.items[i].selChip.items = this.setdialog.items[i].selChip.items.filter(
			// 		x => !this.setdialog.items[i].selChip.chips[y].noTime.includes(x),
			// 	)
			// }
			// this.setdialog.items[i].pickerChip.chipTxt = item
			// this.setdialog.items[i].maxcount.value = this.setdialog.items[i].selChip.chips[y].maxcount
			// this.setdialog.items[i].selChip.value = null
			let commonIndex = this.setdialog.items.findIndex(e => e.commonNotime)
			let setTimedata = this.setdialog.items[commonIndex].commonNotime.items.slice()
			// this.setdialog.items[i].selChip.items = this.$store.state.selChips.split(',')
			this.setdialog.items[i].selChip.items = setTimedata
			this.setdialog.items[i].selChip.items.push('날짜 제외')
			if (this.setdialog.items[i].selChip.chips[y].noTime.length > 0) {
				this.setdialog.items[i].selChip.items = this.setdialog.items[i].selChip.items.filter(
					x => !this.setdialog.items[i].selChip.chips[y].noTime.includes(x),
				)
			}
			this.setdialog.items[i].pickerChip.chipTxt = item

			if (this.setdialog.items[i].selChip.chips[y].maxcount) {
				this.setdialog.items[i].maxcount.value = String(this.setdialog.items[i].selChip.chips[y].maxcount)
			} else {
				this.setdialog.items[i].maxcount.value = ''
			}

			this.setdialog.items[i].selChip.value = null
		},
		clicked(btns) {
			if (btns.length > 1) {
				btns.pop()
			}
		},

		checkTimeSlice(item) {
			item.timeRange.timeSlice.disable = !item.timeRange.timeSlice.disable

			// 시간 범위 i
			let rangeIndex = this.setdialog.items.findIndex(e => e.timeRange)
			let timeRange = this.setdialog.items[rangeIndex].timeRange

			let commonIndex = this.setdialog.items.findIndex(e => e.commonMaxconut)

			let notimeIndex = this.setdialog.items.findIndex(e => e.selChip)

			//종료 시간 범위 아이템 적용
			let endRangeItem = []
			let notimeItem = []
			let notimeItem2 = []
			timeRange.startRange.items.forEach(e => {
				if (e > timeRange.startRange.value) {
					endRangeItem.push(e)
				}
				if (e >= timeRange.startRange.value && e < timeRange.endRange.value) {
					notimeItem.push(e)
					notimeItem2.push(e)
				}
			})
			timeRange.endRange.items = endRangeItem
			this.setdialog.items[commonIndex].commonNotime.items = notimeItem
			this.setdialog.items[commonIndex].commonNotime.value = ''

			// this.setdialog.items[notimeIndex].selChip.items = notimeItem2
			// this.setdialog.items[notimeIndex].selChip.items.push('날짜 제외')
			// 시간 범위 sel item 변경
			if (item.timeRange.timeSlice.disable === true) {
				item.timeRange.timeSlice.value = ''

				// 시간 범위 아이템 초기화
				timeRange.startRange.items = changeTime
				this.setdialog.items[notimeIndex].selChip.items = notimeItem2
				this.setdialog.items[notimeIndex].selChip.items.push('날짜 제외')
				this.setdialog.items[notimeIndex].maxcount.value = '30'

				// 공통 max count 초기화
				this.setdialog.items[commonIndex].commonMaxconut.items = []
				this.setdialog.items[commonIndex].commonMaxconutTxt.value = '30'

				//제외시간 초기화
				this.setdialog.items[notimeIndex].selChip.chips.forEach(e => {
					e.noTime = []
					e.maxcount = 0
				})
			} else {
				timeRange.startRange.items = changeTime
				this.setdialog.items[notimeIndex].selChip.items = notimeItem2

				// 공통 max count Txtfield 초기화
				this.setdialog.items[commonIndex].commonMaxconutTxt.value = '30'
				// this.setdialog.items[commonIndex].selectBox = true

				//제외시간 초기화
				this.setdialog.items[notimeIndex].selChip.chips.forEach(e => {
					e.noTime = []
					e.maxcount = 0
				})
				this.setdialog.items[notimeIndex].maxcount.value = '30'
			}

			// this.setdialog.items[commonIndex].commonNotime.items = endRangeItem
		},
		changeNoday(item, i) {
			item.picker.menu = false
			let nodayIndex = this.setdialog.items.findIndex(x => x.pickerChip)

			let nodays = []
			let nodaysChip = []
			if (item.title === '시작일' && this.setdialog.items[i + 1].picker.date) {
				nodays = this.getDateRangeData(item.picker.date, this.setdialog.items[i + 1].picker.date)
				nodays.forEach(e => {
					nodaysChip.push({
						date: e,
						noTime: [],
						maxcount: '',
					})
				})
			} else if (item.title === '종료일') {
				nodays = this.getDateRangeData(this.setdialog.items[i - 1].picker.date, item.picker.date)
				nodays.forEach(e => {
					nodaysChip.push({
						date: e,
						noTime: [],
						maxcount: '',
					})
				})
			}

			this.setdialog.items[nodayIndex].pickerChip.chips = nodays
			this.setdialog.items[nodayIndex].selChip.chips = nodaysChip
		},
		getDateRangeData(start, end) {
			// 두 날짜 사이 날짜 구하기
			let resultDays = []
			let startday = new Date(start)
			let endday = new Date(end)
			while (startday.getTime() <= endday.getTime()) {
				let month = startday.getMonth() + 1
				month = month < 10 ? '0' + month : month
				let day = startday.getDate()
				day = day < 10 ? '0' + day : day
				resultDays.push(startday.getFullYear() + '-' + month + '-' + day)
				startday.setDate(startday.getDate() + 1)
			}
			return resultDays
		},
		maxcountDay(i) {
			this.setdialog.items[i].selChip.chips[this.chipIndex].maxcount = String(this.setdialog.items[i].maxcount.value)
		},
		setCommon(item) {
			let nodayIndex = this.setdialog.items.findIndex(e => e.selChip)
			this.setdialog.items[nodayIndex].selChip.chips.forEach(e => {
				e.maxcount = String(item.commonMaxconutTxt.value)
			})
			this.setdialog.items[nodayIndex].maxcount.value = item.commonMaxconutTxt.value
		},
		setCommonsel() {
			let nodayIndex = this.setdialog.items.findIndex(e => e.selChip)
			let nowIndex = this.setdialog.items.findIndex(e => e.commonMaxconut)
			this.setdialog.items[nodayIndex].selChip.chips.forEach(e => {
				e.maxcount = String(this.setdialog.items[nowIndex].commonMaxconut.value)
			})
			this.setdialog.items[nodayIndex].maxcount.value = String(this.setdialog.items[nowIndex].commonMaxconut.value)
		},
		commonNotime(val) {
			let notimeIndex = this.setdialog.items.findIndex(e => e.selChip)
			let commonSelindex = this.setdialog.items.findIndex(e => e.commonNotime)

			const selectarray = this.setdialog.items[notimeIndex].selChip
			let commonArray = this.setdialog.items[commonSelindex].commonNotime

			// // 제외시간 chip 추가
			if (selectarray.chips.length > 0) {
				let itemsindex = commonArray.items.indexOf(val)
				selectarray.chips.forEach(e => {
					if (e.noTime.indexOf(val) === -1) {
						e.noTime.push(val)
						e.noTime.sort()
					}
				})
				selectarray.items.splice(itemsindex, 1)
				// selectarray.chips[index].noTime.sort()
				commonArray.items.splice(itemsindex, 1)
			}
		},
		changePopulation(item) {
			let csvIndex = this.setdialog.items.findIndex(e => e.title === '참여 허용된 전화번호')
			if (item.sel.value !== '없음' && this.alertModal.onceDone === false) {
				this.alertModal.dialog = true
				this.alertModal.onceDone = true
				this.alertModal.text = '선택한 설문에 참여한 고객만 참여 가능합니다'
				this.setdialog.items[csvIndex].value = ''
				this.setdialog.items[csvIndex].csvImport = true
			} else if (item.sel.value === '없음') {
				this.alertModal.onceDone = false
				this.setdialog.items[csvIndex].csvImport = false
			}
		},

		allow_dates(val, index) {
			let start = this.$moment(this.setdialog.items[index].startpicker.date).format('YYMMDD')

			let startDate = new Date(this.setdialog.items[index].startpicker.date)
			let end = new Date(startDate.setDate(startDate.getDate() + 240))
			let endDate = this.$moment(end).format('YYMMDD')

			val = this.$moment(val).format('YYMMDD') < endDate && this.$moment(val).format('YYMMDD') >= start
			return val
		},
	},
	props: {
		setdialog: Object,
		alertModal: Object,
		reserveAllow: Function,
		reserveAllow2: Function,
		reserveAllowStart: Function,
		setStratRange: Function,
		setNotimes: Function,
		changeCommon: Function,
		cancelBack: Function,
		reservedaysData: Array,
	},
	components: {
		// VueCsvImport,
		sweetAlert,
		previewTalk,
		DatepickerDialog,
		btn,
		txtField,
		selectBox,
	},
}
</script>

<style lang="scss">
.dialog {
	.title {
		height: 60px;
		display: flex;
		align-items: center;
		// background-color: #fdc85a;
		padding: 0 25px;

		h2 {
			color: white;
		}

		.title-icon {
			color: white;
		}
	}
	.dialog-content-lay-1 {
		padding: 2vh;
	}
	.dialog-bottom-lay-1 {
		padding: 0 2vh;
	}

	// ------------------------
	.mobile-dialog-content {
		padding: 0 2vh;
		.dialog-left {
			max-width: 200px;
			// padding: 2vh 3vh;
			text-align: left;
			.dialog_title {
				place-content: baseline;
				font-size: 0.5rem;
			}
			.dialog-star {
				color: red;
				margin-left: 8px;
				width: 8px;
			}
		}
	}
	.dialog-content {
		// padding: 40px;
		.divider-dark {
			background-color: black;
		}

		.dialog-left {
			max-width: 200px;
			// padding: 20px 25px;
			text-align: left;
			.dialog_title {
				place-content: flex-end;
			}

			.dialog-star {
				color: red;
				margin-left: 8px;
				width: 8px;
			}
		}
	}
	.bottom {
		display: flex;
		margin-top: 40px;
	}
}
.txtField {
	margin-bottom: -20px !important;
}
.test124 {
	white-space: pre-line !important;
}
</style>
