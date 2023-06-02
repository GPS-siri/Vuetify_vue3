import gql from 'graphql-tag'

// 로그인 - admin
export const login = gql`
	mutation login($identifier: String!, $password: String!) {
		login(input: { identifier: $identifier, password: $password }) {
			jwt
			user {
				role {
					id
					name
				}
				business {
					id
					title
				}
				counselorStatus
				confirmed
			}
		}
	}
`

export const createSendSm = gql`
	mutation createSendSm($receiver: String, $sender: String) {
		createSendSm(input: { data: { receiver: $receiver, sender: $sender } }) {
			sendSm {
				id
				authcode
			}
		}
	}
`
export const updateReserveday = gql`
	mutation($id: ID!, $splitMinute: String, $timeRange: String, $sdate: DateTime, $edate: DateTime) {
		updateReserveday(
			input: { where: { id: $id }, data: { sdate: $sdate, edate: $edate, splitMinute: $splitMinute, timeRange: $timeRange } }
		) {
			reserveday {
				id
			}
		}
	}
`
export const updateMessages = gql`
	mutation($id: ID!, $users_permissions_users: [ID]) {
		updateMessage(input: { where: { id: $id }, data: { users_permissions_users: $users_permissions_users } }) {
			message {
				id
				users_permissions_users {
					id
					name
				}
			}
		}
	}
`

export const updatePost = gql`
	mutation updatePost($id: ID!, $users_permissions_users: [ID]) {
		updatePost(input: { where: { id: $id }, data: { users_permissions_users: $users_permissions_users } }) {
			post {
				id
				users_permissions_users {
					id
				}
			}
		}
	}
`

export const register = gql`
	mutation register(
		$username: String!
		$email: String!
		$password: String!
		$name: String
		$companyName: String
		$companyNumber: String
		$companyPaper: ID
		$phone: String
		$authNumber: Int
		$bank: String
		$account: String
		$business: ID
		$role: ID
		$confirmed: Boolean
		$counselorStatus: String
		$companyAddress: String
		$companyBusiness: String
		$companyType: String
		$userNumber: String
	) {
		register(
			input: {
				username: $username
				email: $email
				password: $password
				name: $name
				companyName: $companyName
				companyNumber: $companyNumber
				companyPaper: $companyPaper
				phone: $phone
				authNumber: $authNumber
				bank: $bank
				account: $account
				business: $business
				role: $role
				confirmed: $confirmed
				counselorStatus: $counselorStatus
				companyAddress: $companyAddress
				companyBusiness: $companyBusiness
				companyType: $companyType
				userNumber: $userNumber
			}
		) {
			jwt
		}
	}
`
export const createBusiness = gql`
	mutation(
		$title: String
		$mainPhone: String
		$address: String
		$working: Int
		$goalCount: Int
		$goalActive: Boolean
		$goalStart: Date
		$goalEnd: Date
		$manager: String
		$managerPhone: String
		$managerEmail: String
		$managerId: String
		$termCollection: String
		$termThirdParties: String
	) {
		createBusiness(
			input: {
				data: {
					title: $title
					mainPhone: $mainPhone
					address: $address
					working: $working
					goalCount: $goalCount
					goalActive: $goalActive
					goalStart: $goalStart
					goalEnd: $goalEnd
					manager: $manager
					managerPhone: $managerPhone
					managerEmail: $managerEmail
					managerId: $managerId
					termCollection: $termCollection
					termThirdParties: $termThirdParties
				}
			}
		) {
			business {
				id
			}
		}
	}
`
export const updateBusiness = gql`
	mutation(
		$title: String
		$mainPhone: String
		$address: String
		$working: Int
		$goalCount: Int
		$goalActive: Boolean
		$goalStart: Date
		$goalEnd: Date
		$manager: String
		$managerPhone: String
		$managerEmail: String
		$managerId: String
		$termCollection: String
		$termThirdParties: String
		$id: ID!
	) {
		updateBusiness(
			input: {
				where: { id: $id }
				data: {
					title: $title
					mainPhone: $mainPhone
					address: $address
					working: $working
					goalCount: $goalCount
					goalActive: $goalActive
					goalStart: $goalStart
					goalEnd: $goalEnd
					manager: $manager
					managerPhone: $managerPhone
					managerEmail: $managerEmail
					managerId: $managerId
					termCollection: $termCollection
					termThirdParties: $termThirdParties
				}
			}
		) {
			business {
				id
			}
		}
	}
`
export const createNotice = gql`
	mutation(
		$title: String
		$content: String
		$businesses: [ID]
		$file: ID
		$status: Boolean
		$show: Boolean
		$fixYn: Boolean
		$creater: String
		$modifier: String
		$showAll: Boolean
	) {
		createNotice(
			input: {
				data: {
					title: $title
					content: $content
					businesses: $businesses
					file: $file
					status: $status
					show: $show
					fixYn: $fixYn
					creater: $creater
					modifier: $modifier
					showAll: $showAll
				}
			}
		) {
			notice {
				id
				title
			}
		}
	}
`

export const updateUser = gql`
	mutation updateUser(
		$id: ID!
		$business: ID
		$rank: ID
		$team: ID
		$blocked: Boolean
		$confirmed: Boolean
		$companyName: String
		$goalActive: Boolean
		$counselorStatus: String
		$password: String
		$personalPage: String
		$messages: [ID]
	) {
		updateUser(
			input: {
				where: { id: $id }
				data: {
					business: $business
					rank: $rank
					team: $team
					blocked: $blocked
					confirmed: $confirmed
					companyName: $companyName
					goalActive: $goalActive
					counselorStatus: $counselorStatus
					password: $password
					personalPage: $personalPage
					messages: $messages
				}
			}
		) {
			user {
				id
				blocked
				confirmed
				companyName
			}
		}
	}
`

export const updateNotice = gql`
	mutation(
		$id: ID!
		$title: String
		$content: String
		$businesses: [ID]
		$file: ID
		$status: Boolean
		$show: Boolean
		$fixYn: Boolean
		$creater: String
		$modifier: String
		$showAll: Boolean
	) {
		updateNotice(
			input: {
				where: { id: $id }
				data: {
					title: $title
					content: $content
					businesses: $businesses
					file: $file
					status: $status
					show: $show
					fixYn: $fixYn
					creater: $creater
					modifier: $modifier
					showAll: $showAll
				}
			}
		) {
			notice {
				id
				status
			}
		}
	}
`
export const notices = gql`
	query($title: String, $business: ID) {
		notices(where: { title: $title, business: $business }) {
			id
			created_at
			updated_at
			title
			content
			business {
				id
			}
			file {
				name
				url
			}
		}
	}
`

export const deleteNotice = gql`
	mutation($id: ID!) {
		deleteNotice(input: { where: { id: $id } }) {
			notice {
				id
			}
		}
	}
`
export const createCounselor = gql`
	mutation($business: ID, $status: ENUM_COUNSELOR_STATUS, $users_permissions_user: ID) {
		createCounselor(input: { data: { business: $business, status: $status, users_permissions_user: $users_permissions_user } }) {
			counselor {
				id
			}
		}
	}
`
export const updateCounselor = gql`
	mutation($business: ID, $status: ENUM_COUNSELOR_STATUS, $users_permissions_user: ID, $id: ID!) {
		updateCounselor(
			input: { where: { id: $id }, data: { business: $business, status: $status, users_permissions_user: $users_permissions_user } }
		) {
			counselor {
				id
			}
		}
	}
`
export const createClient = gql`
	mutation(
		$name: String
		$phone: String
		$birthday: String
		$address: String
		$sex: String
		$customDatas: JSON
		$comment: String
		$like: ENUM_CLIENT_LIKE
		$contractStatus: ENUM_CLIENT_CONTRACTSTATUS
		$pricePaper: [ID]
		$products: [ID]
		$agreeDate: DateTime
		$business: String
		$users_permissions_user: ID
	) {
		createClient(
			input: {
				data: {
					name: $name
					phone: $phone
					birthday: $birthday
					address: $address
					sex: $sex
					customDatas: $customDatas
					products: $products
					comment: $comment
					like: $like
					contractStatus: $contractStatus
					pricePaper: $pricePaper
					agreeDate: $agreeDate
					business: $business
					users_permissions_user: $users_permissions_user
				}
			}
		) {
			client {
				id
			}
		}
	}
`
export const updateClient = gql`
	mutation(
		$name: String
		$phone: String
		$birthday: String
		$address: String
		$sex: String
		$id: ID!
		$products: [ID]
		$contractStatus: ENUM_CLIENT_CONTRACTSTATUS
		$customDatas: JSON
		$comment: String
		$like: ENUM_CLIENT_LIKE
		$pricePaper: [ID]
		$agreeDate: DateTime
		$users_permissions_user: ID
		$business: String
	) {
		updateClient(
			input: {
				where: { id: $id }
				data: {
					name: $name
					phone: $phone
					birthday: $birthday
					address: $address
					sex: $sex
					customDatas: $customDatas
					comment: $comment
					products: $products
					like: $like
					contractStatus: $contractStatus
					pricePaper: $pricePaper
					agreeDate: $agreeDate
					users_permissions_user: $users_permissions_user
					business: $business
				}
			}
		) {
			client {
				id
				phone
				name
			}
		}
	}
`
export const updateReservation = gql`
	mutation(
		$name: String
		$phone: String
		$houseDatas: JSON
		$users_permissions_user: ID
		$business: String
		$date: Date
		$times: String
		$status: ENUM_RESERVATION_STATUS
		$id: ID!
		$reason: String
		$products: [ID]
		$client: ID
	) {
		updateReservation(
			input: {
				where: { id: $id }
				data: {
					name: $name
					phone: $phone
					houseDatas: $houseDatas
					users_permissions_user: $users_permissions_user
					business: $business
					date: $date
					times: $times
					status: $status
					reason: $reason
					products: $products
					client: $client
				}
			}
		) {
			reservation {
				id
			}
		}
	}
`
export const createReservation = gql`
	mutation(
		$name: String
		$phone: String
		$houseDatas: JSON
		$users_permissions_user: ID
		$business: String
		$date: Date
		$times: String
		$status: ENUM_RESERVATION_STATUS
		$products: [ID]
		$client: ID
	) {
		createReservation(
			input: {
				data: {
					houseDatas: $houseDatas
					users_permissions_user: $users_permissions_user
					business: $business
					date: $date
					times: $times
					name: $name
					phone: $phone
					status: $status
					products: $products
					client: $client
				}
			}
		) {
			reservation {
				id
			}
		}
	}
`

export const updateSystem = gql`
	mutation updateSystem(
		$id: ID!
		$type: ENUM_SYSTEM_TYPE
		$business: ID
		$counselorStatusOption: JSON
		$goalShow: Boolean
		$goalActive: Boolean
		$goalCount: Int
		$goalStart: Date
		$goalEnd: Date
		$reservationTimeStartTime: String
		$reservationTimeEndTime: String
		$reservationTimeSplitTime: String
		$reservationTimeMaxSelect: String
		$reservationTimeStartDate: Date
		$reservationTimeEndDate: Date
		$vacationReservation: Int
		$reservationTitle: String
		$reservationEventId: String
		$reservationTalks: JSON
		$reservationNodaySetting: JSON
	) {
		updateSystem(
			input: {
				where: { id: $id }
				data: {
					type: $type
					business: $business
					counselorStatusOption: $counselorStatusOption
					goalShow: $goalShow
					goalActive: $goalActive
					goalCount: $goalCount
					goalStart: $goalStart
					goalEnd: $goalEnd
					reservationTimeStartTime: $reservationTimeStartTime
					reservationTimeEndTime: $reservationTimeEndTime
					reservationTimeSplitTime: $reservationTimeSplitTime
					reservationTimeMaxSelect: $reservationTimeMaxSelect
					reservationTimeStartDate: $reservationTimeStartDate
					reservationTimeEndDate: $reservationTimeEndDate
					vacationReservation: $vacationReservation
					reservationTitle: $reservationTitle
					reservationEventId: $reservationEventId
					reservationTalks: $reservationTalks
					reservationNodaySetting: $reservationNodaySetting
				}
			}
		) {
			system {
				id
			}
		}
	}
`
export const createSystem = gql`
	mutation createSystem(
		$type: ENUM_SYSTEM_TYPE
		$business: ID
		$counselorStatusOption: JSON
		$goalActive: Boolean
		$goalCount: Int
		$goalStart: Date
		$goalEnd: Date
		$reservationTimeStartTime: String
		$reservationTimeEndTime: String
		$reservationTimeSplitTime: String
		$reservationTimeMaxSelect: String
		$reservationTimeStartDate: Date
		$reservationTimeEndDate: Date
		$reservationTitle: String
		$reservationEventId: String
		$reservationTalks: JSON
		$reservationNodaySetting: JSON
	) {
		createSystem(
			input: {
				data: {
					type: $type
					business: $business
					counselorStatusOption: $counselorStatusOption
					goalActive: $goalActive
					goalCount: $goalCount
					goalStart: $goalStart
					goalEnd: $goalEnd
					reservationTimeStartTime: $reservationTimeStartTime
					reservationTimeEndTime: $reservationTimeEndTime
					reservationTimeSplitTime: $reservationTimeSplitTime
					reservationTimeMaxSelect: $reservationTimeMaxSelect
					reservationTimeStartDate: $reservationTimeStartDate
					reservationTimeEndDate: $reservationTimeEndDate
					reservationTitle: $reservationTitle
					reservationEventId: $reservationEventId
					reservationTalks: $reservationTalks
					reservationNodaySetting: $reservationNodaySetting
				}
			}
		) {
			system {
				id
			}
		}
	}
`
export const createGotowork = gql`
	mutation createGotowork(
		$date: Date
		$users_permissions_user: ID
		$startWork: DateTime
		$endWork: DateTime
		$status: ENUM_GOTOWORK_STATUS
		$business: ID
		$vacation: ID
	) {
		createGotowork(
			input: {
				data: {
					date: $date
					users_permissions_user: $users_permissions_user
					startWork: $startWork
					endWork: $endWork
					status: $status
					business: $business
					vacation: $vacation
				}
			}
		) {
			gotowork {
				id
				users_permissions_user {
					name
				}
			}
		}
	}
`
export const updateGotowork = gql`
	mutation updateGotowork(
		$id: ID!
		$date: Date
		$users_permissions_user: ID
		$startWork: DateTime
		$endWork: DateTime
		$status: ENUM_GOTOWORK_STATUS
	) {
		updateGotowork(
			input: {
				where: { id: $id }
				data: { date: $date, users_permissions_user: $users_permissions_user, startWork: $startWork, endWork: $endWork, status: $status }
			}
		) {
			gotowork {
				id
				users_permissions_user {
					name
				}
			}
		}
	}
`
export const deleteGotowork = gql`
	mutation deleteGotowork($id: ID!) {
		deleteGotowork(input: { where: { id: $id } }) {
			gotowork {
				id
			}
		}
	}
`
export const updateVacation = gql`
	# Write your query or mutation here
	mutation updateVacation(
		$id: ID!
		$users_permissions_user: ID
		$status: ENUM_VACATION_STATUS
		$adminName: String
		$adminId: String
		$viewStatus: Boolean
		$vacationDate: Date
		$reason: String
		$type: ENUM_VACATION_TYPE
	) {
		updateVacation(
			input: {
				where: { id: $id }
				data: {
					status: $status
					adminId: $adminId
					adminName: $adminName
					viewStatus: $viewStatus
					users_permissions_user: $users_permissions_user
					vacationDate: $vacationDate
					reason: $reason
					type: $type
				}
			}
		) {
			vacation {
				id
				gotowork {
					id
				}
			}
		}
	}
`
export const createProduct = gql`
	mutation createProduct(
		$title: String
		$data1: String
		$data2: String
		$editHistory: JSON
		$business: ID
		$goodsCode: String
		$description: String
		$file: ID
	) {
		createProduct(
			input: {
				data: {
					title: $title
					data1: $data1
					data2: $data2
					editHistory: $editHistory
					business: $business
					goodsCode: $goodsCode
					description: $description
					file: $file
				}
			}
		) {
			product {
				title
				data1
				data2
				id
				created_at
				updated_at
				editHistory
			}
		}
	}
`
export const updateProduct = gql`
	mutation updateProduct(
		$id: ID!
		$title: String
		$data1: String
		$data2: String
		$editHistory: JSON
		$business: ID
		$goodsCode: String
		$description: String
		$file: ID
	) {
		updateProduct(
			input: {
				where: { id: $id }
				data: {
					title: $title
					data1: $data1
					data2: $data2
					editHistory: $editHistory
					business: $business
					goodsCode: $goodsCode
					description: $description
					file: $file
				}
			}
		) {
			product {
				title
				data1
				data2
				id
				created_at
				updated_at
				editHistory
			}
		}
	}
`
export const deleteProduct = gql`
	mutation deleteProduct($id: ID!) {
		deleteProduct(input: { where: { id: $id } }) {
			product {
				title
			}
		}
	}
`
export const createVacation = gql`
	mutation createVacation(
		$vacationDate: Date
		$status: ENUM_VACATION_STATUS
		$type: ENUM_VACATION_TYPE
		$users_permissions_user: ID
		$viewStatus: Boolean
		$reason: String
		$comment: String
	) {
		createVacation(
			input: {
				data: {
					vacationDate: $vacationDate
					status: $status
					type: $type
					users_permissions_user: $users_permissions_user
					viewStatus: $viewStatus
					reason: $reason
					comment: $comment
				}
			}
		) {
			vacation {
				id
			}
		}
	}
`
export const createInputBox = gql`
	mutation createInputBox($groupcode: String, $status: Int, $name: String!, $business: ID) {
		createInputBox(input: { data: { groupcode: $groupcode, status: $status, name: $name, business: $business } }) {
			inputBox {
				id
				groupcode
				status
				name
			}
		}
	}
`
export const createTeam = gql`
	mutation($title: String, $business: ID) {
		createTeam(input: { data: { title: $title, business: $business } }) {
			team {
				id
				title
			}
		}
	}
`
// admin
export const createCategory = gql`
	mutation createCategory(
		$groupcode: String
		$code: String!
		$codename: String!
		$stat: Int
		$listorder: Int
		$type: Int
		$input_box: ID!
		$explain: String
		$tag: String
		$musthave: Boolean
		$fixYn: Boolean
	) {
		createCategory(
			input: {
				data: {
					musthave: $musthave
					groupcode: $groupcode
					code: $code
					codename: $codename
					stat: $stat
					listorder: $listorder
					type: $type
					input_box: $input_box
					explain: $explain
					tag: $tag
					fixYn: $fixYn
				}
			}
		) {
			category {
				id
				groupcode
				code
				codename
				contents
				stat
				listorder
				explain
				type
			}
		}
	}
`
export const updateTeam = gql`
	mutation($id: ID!, $title: String) {
		updateTeam(input: { where: { id: $id }, data: { title: $title } }) {
			team {
				id
				title
			}
		}
	}
`
export const createCategoryDetail = gql`
	mutation createCategoryDetail(
		$groupcode: String
		$code: String
		$detailcode: String
		$detailname: String
		$stat: Int
		$listorder: Int
		$category: ID!
	) {
		createCategoryDetail(
			input: {
				data: {
					groupcode: $groupcode
					code: $code
					detailcode: $detailcode
					detailname: $detailname
					stat: $stat
					listorder: $listorder
					category: $category
				}
			}
		) {
			categoryDetail {
				id
				groupcode
				code
				detailcode
				detailname
				stat
				listorder
			}
		}
	}
`
export const deleteTeam = gql`
	mutation($id: ID!) {
		deleteTeam(input: { where: { id: $id } }) {
			team {
				id
				title
			}
		}
	}
`
export const createRank = gql`
	mutation($title: String, $business: ID, $team: ID) {
		createRank(input: { data: { title: $title, business: $business, team: $team } }) {
			rank {
				id
				title
			}
		}
	}
`
export const updateRank = gql`
	mutation($title: String, $id: ID!) {
		updateRank(input: { where: { id: $id }, data: { title: $title } }) {
			rank {
				id
				title
			}
		}
	}
`
export const deleteRank = gql`
	mutation($id: ID!) {
		deleteRank(input: { where: { id: $id } }) {
			rank {
				id
				title
			}
		}
	}
`
export const updateCategoryDetail = gql`
	mutation updateCategoryDetail(
		$id: ID!
		$groupcode: String
		$code: String
		$detailcode: String
		$detailname: String
		$stat: Int
		$listorder: Int
		$category: ID
	) {
		updateCategoryDetail(
			input: {
				where: { id: $id }
				data: {
					groupcode: $groupcode
					code: $code
					detailcode: $detailcode
					detailname: $detailname
					stat: $stat
					listorder: $listorder
					category: $category
				}
			}
		) {
			categoryDetail {
				id
				groupcode
				code
				detailcode
				detailname
				stat
				listorder
			}
		}
	}
`
export const updateCategory = gql`
	mutation updateCategory(
		$id: ID!
		$groupcode: String
		$code: String
		$codename: String
		$contents: String
		$stat: Int
		$listorder: Int
		$type: Int
		$input_box: ID
		$explain: String
		$tag: String
		$musthave: Boolean
		$fixYn: Boolean
	) {
		updateCategory(
			input: {
				where: { id: $id }
				data: {
					musthave: $musthave
					groupcode: $groupcode
					code: $code
					codename: $codename
					contents: $contents
					stat: $stat
					listorder: $listorder
					type: $type
					input_box: $input_box
					explain: $explain
					tag: $tag
					fixYn: $fixYn
				}
			}
		) {
			category {
				id
				groupcode
				code
				codename
				contents
				stat
				listorder
				explain
				type
			}
		}
	}
`
export const updateInputBox = gql`
	mutation updateInputBox($id: ID!, $groupcode: String, $status: Int, $name: String) {
		updateInputBox(input: { where: { id: $id }, data: { groupcode: $groupcode, status: $status, name: $name } }) {
			inputBox {
				id
				groupcode
				status
				name
			}
		}
	}
`
export const createPersonalPage = gql`
	mutation createPersonalPage(
		$profileImg: ID
		$introduction_title: String
		$introduction_content: String
		$introduction_button: String
		$count_title: String
		$counsel_count: String
		$client_count: String
		$contract_count: String
		$subscribe_title: String
		$subscribe_button: String
		$sns: JSON
		$user: String
		$mainBanner: [ID]
		$phone: String
	) {
		createPersonalPage(
			input: {
				data: {
					profileImg: $profileImg
					introduction_title: $introduction_title
					introduction_content: $introduction_content
					introduction_button: $introduction_button
					count_title: $count_title
					counsel_count: $counsel_count
					client_count: $client_count
					contract_count: $contract_count
					subscribe_title: $subscribe_title
					subscribe_button: $subscribe_button
					sns: $sns
					user: $user
					mainBanner: $mainBanner
					phone: $phone
				}
			}
		) {
			personalPage {
				id
			}
		}
	}
`

export const updatePersonalPage = gql`
	mutation updatePersonalPage(
		$id: ID!
		$profileImg: ID
		$introduction_title: String
		$introduction_content: String
		$introduction_button: String
		$count_title: String
		$counsel_count: String
		$client_count: String
		$contract_count: String
		$subscribe_title: String
		$subscribe_button: String
		$sns: JSON
		$user: String
		$mainBanner: [ID]
		$phone: String
	) {
		updatePersonalPage(
			input: {
				where: { id: $id }
				data: {
					profileImg: $profileImg
					introduction_title: $introduction_title
					introduction_content: $introduction_content
					introduction_button: $introduction_button
					count_title: $count_title
					counsel_count: $counsel_count
					client_count: $client_count
					contract_count: $contract_count
					subscribe_title: $subscribe_title
					subscribe_button: $subscribe_button
					sns: $sns
					user: $user
					mainBanner: $mainBanner
					phone: $phone
				}
			}
		) {
			personalPage {
				id
			}
		}
	}
`
