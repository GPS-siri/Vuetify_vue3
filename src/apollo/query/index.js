import gql from 'graphql-tag'

export const me = gql`
	query {
		me {
			id
			username
			email
			name
			created_at
			role {
				id
				name
			}
			team {
				id
				title
			}
			rank {
				id
				title
			}
			companyName
			companyNumber
			companyPaper {
				id
				url
			}
			business {
				id
				title
				mainPhone
			}
			goalActive
			personalPage
			phone
		}
	}
`
export const clientsCount = gql`
	query($business: ID, $contractStatus: String) {
		clientsCount(where: { business: $business, contractStatus: $contractStatus })
	}
`
export const users = gql`
	query users(
		$id: ID
		$business: ID
		$team: ID
		$rank: ID
		$date: Date
		$name: String
		$phone: String
		$email: String
		$status: String
		$role: ID
		$blocked: Boolean
		$confirmed: Boolean
		$companyName: String
		$counselorStatus: String
		$created_at_gte: DateTime
		$created_at_lte: DateTime
		$date_gte: Date
		$date_lte: Date
		$clientName: String
		$clientPhone: String
		$clientStartCreated_at: DateTime
		$clientEndCreated_at: DateTime
		$clientLike: String
		$clientStatus: ENUM_CLIENT_CONTRACTSTATUS
	) {
		users(
			where: {
				id: $id
				business: $business
				team: $team
				rank: $rank
				name_contains: $name
				phone_contains: $phone
				email_contains: $email
				blocked: $blocked
				role: $role
				confirmed: $confirmed
				companyName: $companyName
				created_at_gte: $created_at_gte
				created_at_lte: $created_at_lte
				counselorStatus: $counselorStatus
			}
		) {
			id
			username
			name
			account
			email
			phone
			confirmed
			blocked
			fireDate
			bank
			reservations {
				id
				date
				times
			}
			business {
				id
				title
			}
			companyName
			gotoworks(where: { date: $date, status: $status, date_gte: $date_gte, date_lte: $date_lte }) {
				id
				startWork
				endWork
				date
				status
			}
			role {
				id
				name
			}
			created_at
			counselorStatus
			vacations {
				id
				status
				viewStatus
				vacationDate
				type
				comment
				reason
				created_at
			}
			team {
				id
				title
			}
			rank {
				id
				title
			}
			goalActive
			clients(
				where: {
					name_contains: $clientName
					phone_contains: $clientPhone
					created_at_gte: $clientStartCreated_at
					created_at_lte: $clientEndCreated_at
					like_contains: $clientLike
					contractStatus_contains: $clientStatus
				}
			) {
				id
				name
				phone
				created_at
				like
				contractStatus
				customDatas
				pricePaper {
					name
					previewUrl
					url
				}
				products {
					title
				}
			}
			goalPercent
			messages {
				id
			}
		}
	}
`
export const vacationUsers = gql`
	query users(
		$business: ID
		$date: Date
		$name: String
		$phone: String
		$email: String
		$role: ID
		$blocked: Boolean
		$confirmed: Boolean
		$companyName: String
		$created_at_gte: DateTime
		$created_at_lte: DateTime
		$date_gte: Date
		$date_lte: Date
	) {
		users(
			where: {
				business: $business
				name_contains: $name
				phone_contains: $phone
				email_contains: $email
				role: $role
				blocked: $blocked
				confirmed: $confirmed
				companyName: $companyName
				created_at_gte: $created_at_gte
				created_at_lte: $created_at_lte
			}
		) {
			id
			username
			name
			email
			phone
			confirmed
			blocked
			business {
				id
			}
			companyName
			gotoworks(
				where: { date: $date, date_gte: $date_gte, date_lte: $date_lte, status: ["vacation", "afternoonVacation", "morningVacation"] }
			) {
				id
				startWork
				endWork
				date
				status
			}
			role {
				id
				name
			}
			created_at
		}
	}
`
export const messages = gql`
	query messages($id: [ID], $tplCode: String, $tplCodeStr: String, $message: String, $type: String, $users_permissions_users: ID) {
		messages(
			where: {
				id: $id
				tplCode: $tplCode
				tplCodeStr_contains: $tplCodeStr
				message: $message
				type: $type
				users_permissions_users: $users_permissions_users
			}
		) {
			id
			tplCode
			tplCodeStr
			message
			type
			users_permissions_users {
				id
			}
		}
	}
`

export const messages_title = gql`
	query messages($id: [ID], $tplCode: String, $tplCodeStr: String, $message: String, $type: String, $users_permissions_users: ID) {
		messages(
			where: {
				id: $id
				tplCode: $tplCode
				tplCodeStr_contains: $tplCodeStr
				message: $message
				type: $type
				users_permissions_users: $users_permissions_users
			}
		) {
			id
			tplCodeStr
		}
	}
`
export const sendSms = gql`
	query sendSms($receiver: String, $authcode: Int, $created_at_gte: DateTime) {
		sendSms(where: { receiver: $receiver, authcode: $authcode, created_at_gte: $created_at_gte }) {
			id
			created_at
		}
	}
`
export const emailDuplicate = gql`
	query($email: String) {
		emailDuplicate(where: { email: $email }) {
			duplicate
		}
	}
`

export const phoneDuplicate = gql`
	query($phone: String) {
		phoneDuplicate(where: { phone: $phone }) {
			duplicate
		}
	}
`

export const businesses_register = gql`
	query business($id: ID!) {
		business(id: $id) {
			id
		}
	}
`
export const businesses = gql`
	query {
		businesses {
			id
			created_at
			updated_at
			title
			mainPhone
			address
			working
			goalActive
			goalCount
			goalStart
			goalEnd
			manager
			managerPhone
			managerEmail
			managerId
			termCollection
			termThirdParties
		}
	}
`

export const businesses_title = gql`
	query businesses {
		businesses {
			id
			title
		}
	}
`
export const counselor = gql`
	query($id: ID!) {
		counselor(id: $id) {
			id
			created_at
			updated_at
			status
			business {
				id
				title
			}
			users_permissions_user {
				id
				name
				phone
				companyName
				email
			}
		}
	}
`
export const clients = gql`
	query(
		$business: ID
		$id: ID
		$name: String
		$phone: String
		$contractStatus: ENUM_CLIENT_CONTRACTSTATUS
		$created_at_lte: String
		$created_at_gte: String
		$updated_at_lte: String
		$updated_at_gte: String
		$users_permissions_user: ID
	) {
		clients(
			where: {
				id: $id
				users_permissions_user: $users_permissions_user
				business: $business
				name_contains: $name
				phone_contains: $phone
				updated_at_gte: $updated_at_gte
				updated_at_lte: $updated_at_lte
				created_at_gte: $created_at_gte
				created_at_lte: $created_at_lte
				contractStatus: $contractStatus
			}
			limit: 1000000
		) {
			id
			created_at
			updated_at
			name
			phone
			age
			address
			products {
				id
				title
				status
				data1
				data2
				data3
				data4
				data5
				data6
				data7
				contractorName
				contractorPhone
				editHistory
				business {
					id
				}
			}
			business
			pricePaper {
				id
				url
				name
			}
			sex
			customDatas
			comment
			like
			contractStatus
			pricePaper {
				url
				name
			}
			users_permissions_user {
				id
				name
			}
			agreeDate
			published_at
		}
	}
`
export const client_check = gql`
	query($business: ID, $name: String, $phone: String, $contractStatus_not: ENUM_CLIENT_CONTRACTSTATUS, $users_permissions_user: ID) {
		clients(
			where: {
				business: $business
				name: $name
				phone: $phone
				contractStatus_ne: $contractStatus_not
				users_permissions_user: $users_permissions_user
			}
			limit: 1000000
		) {
			id
			products {
				id
				title
			}
		}
	}
`
export const notices = gql`
	query(
		$businesses: [ID]
		$title: String
		$content: String
		$status: Boolean
		$show: Boolean
		$fixYn: Boolean
		$creater: String
		$modifier: String
		$created_at_gte: DateTime
		$created_at_lte: DateTime
		$updated_at_gte: DateTime
		$updated_at_lte: DateTime
		$showAll: Boolean
	) {
		notices(
			where: {
				businesses: $businesses
				title_contains: $title
				content_contains: $content
				status: $status
				show: $show
				fixYn: $fixYn
				creater: $creater
				modifier: $modifier
				created_at_gte: $created_at_gte
				created_at_lte: $created_at_lte
				updated_at_gte: $updated_at_gte
				updated_at_lte: $updated_at_lte
				showAll: $showAll
			}
		) {
			id
			created_at
			updated_at
			title
			content
			status
			show
			fixYn
			creater
			modifier
			businesses {
				id
				title
			}
			file {
				id
				name
				url
			}
			showAll
		}
	}
`
export const postes = gql`
	query(
		$business: ID
		$title: String
		$content: String
		$status: Boolean
		$paging: Boolean
		$creater: String
		$modifier: String
		$created_at_gte: DateTime
		$created_at_lte: DateTime
		$updated_at_gte: DateTime
		$updated_at_lte: DateTime
	) {
		postes(
			where: {
				business: $business
				title_contains: $title
				content_contains: $content
				status: $status
				paging: $fixYn
				creater: $creater
				modifier: $modifier
				created_at_gte: $created_at_gte
				created_at_lte: $created_at_lte
				updated_at_gte: $updated_at_gte
				updated_at_lte: $updated_at_lte
			}
		) {
			id
			created_at
			updated_at
			title
			content
			status
			show
			fixYn
			creater
			modifier
			business {
				id
				title
			}
			file {
				id
				name
				url
			}
		}
	}
`

export const posts = gql`
	query($title: String) {
		posts(where: { title_contains: $title }) {
			id
			created_at
			updated_at
			title
			content
			bannerImg {
				id
				url
			}
			postImg {
				id
				url
			}
			users_permissions_users {
				id
			}
		}
	}
`

export const clientCount = gql`
	query($business: ID, $user: ID) {
		clientCount(where: { business: $business, user: $user }) {
			count
		}
	}
`
export const business = gql`
	query($id: ID!, $type: String) {
		business(id: $id) {
			id
			created_at
			updated_at
			title
			mainPhone
			bizAddress
			houseAddress
			homepage
			sns
			law
			product
			groupName
			reserveday {
				id
				sdate
				edate
				splitMinute
				timeRange
			}
			status
			published_at
			notices {
				id
				file {
					name
					url
				}
				title
				content
				created_at
			}
			systems(where: { type: $type }) {
				id
				type
				goalShow
				goalActive
				goalCount
				goalStart
				goalEnd
				reservationTimeStartDate
				reservationTimeEndDate
			}
		}
	}
`
export const client = gql`
	query($id: ID!) {
		client(id: $id) {
			id
			created_at
			updated_at
			name
			phone
			age
			address
			email
			products {
				title
				id
				status
			}
			business {
				id
				title
			}
			pricePaper {
				url
				name
			}
			sex
			customDatas
			comment
			like
			contractStatus
			pricePaper {
				url
				name
				id
			}
			users_permissions_user {
				name
			}
			agreeDate
			published_at
		}
	}
`
export const reservations = gql`
	query(
		$users_permissions_user: ID
		$business: ID
		$status: ENUM_RESERVATION_STATUS
		$date_gte: Date
		$date_lte: Date
		$created_at_lte: DateTime
		$created_at_gte: DateTime
		$date: Date
		$name: String
		$phone: String
		$counselor_name: String
		$counselor_phone: String
		$counselor_team: ID
		$counselor_rank: ID
	) {
		reservations(
			where: {
				users_permissions_user: $users_permissions_user
				business: $business
				status: $status
				date_gte: $date_gte
				date_lte: $date_lte
				date: $date
				name_contains: $name
				phone_contains: $phone
				created_at_gte: $created_at_gte
				created_at_lte: $created_at_lte
				counselor_name: $counselor_name
				counselor_phone: $counselor_phone
				counselor_team: $counselor_team
				counselor_rank: $counselor_rank
			}
		) {
			id
			times
			date
			name
			phone
		}
	}
`
export const reservation = gql`
	query reservation($id: ID!) {
		reservation(id: $id) {
			id
			name
			phone
			created_at
			updated_at
			houseDatas
			users_permissions_user {
				id
				name
				phone
				rank {
					id
					title
				}
				team {
					id
					title
				}
			}
			business
			date
			times
			status
			reason
			products {
				id
				title
				status
				data1
				data2
				data3
				data4
				data5
				data6
				data7
				title
			}
			client {
				id
				customDatas
				contractStatus
				age
			}
			title
			address
			memo
		}
	}
`

export const terms = gql`
	query {
		terms(where: { show: true }) {
			content
		}
	}
`
export const gotoWork = gql`
	query gotoWork($date: Date, $status_in: JSON, $business: ID, $users_permissions_user: ID) {
		gotoworks(where: { date: $date, status_in: $status_in, business: $business, users_permissions_user: $users_permissions_user }) {
			id
			status
			startWork
			endWork
			users_permissions_user {
				id
				name
				username
				phone
			}
		}
	}
`
export const productList = gql`
	query products(
		$created_at_lte: String
		$created_at_gte: String
		$update_at_lte: String
		$update_at_gte: String
		$title: String
		$status: ENUM_PRODUCT_STATUS
		$data1: String
		$data2: String
		$data3: String
		$data4: String
		$data5: String
		$data6: String
		$data7: String
		$business: ID
		$reservationDate: Date
	) {
		products(
			where: {
				business: $business
				created_at_lte: $created_at_lte
				created_at_gte: $created_at_gte
				update_at_lte: $update_at_lte
				update_at_gte: $update_at_gte
				title_contains: $title
				status: $status
				data1_contains: $data1
				data2_contains: $data2
				data3_contains: $data3
				data4_contains: $data4
				data5_contains: $data5
				data6_contains: $data6
				data7_contains: $data7
			}
		) {
			id
			status
			created_at
			updated_at
			contractorName
			contractorPhone
			contractDate
			data1
			data2
			goodsCode
			business {
				title
				product
			}
			editHistory
			contractDate
			productData
			users_permissions_user {
				username
				name
			}
			reservations(where: { date: $reservationDate }) {
				date
			}
			clients {
				name
				customDatas
			}
			file {
				id
				name
			}
			description
		}
	}
`
export const productList2 = gql`
	query products(
		$created_at_lte: String
		$created_at_gte: String
		$update_at_lte: String
		$update_at_gte: String
		$title: String
		$status: ENUM_PRODUCT_STATUS
		$data1: String
		$data2: String
		$data3: String
		$data4: String
		$data5: String
		$data6: String
		$data7: String
		$business: ID
	) {
		products(
			where: {
				business: $business
				created_at_lte: $created_at_lte
				created_at_gte: $created_at_gte
				update_at_lte: $update_at_lte
				update_at_gte: $update_at_gte
				title_contains: $title
				status: $status
				data1: $data1
				data2: $data2
				data3: $data3
				data4: $data4
				data5: $data5
				data6: $data6
				data7: $data7
			}
		) {
			id
			status
			created_at
			updated_at
			contractorName
			contractorPhone
			contractDate
			data1
			data2
			data3
			data4
			data5
			data6
			data7
			status
			title
			business {
				title
				product
			}
			editHistory
			contractDate
			productData
			users_permissions_user {
				username
				name
			}
			clients {
				name
				customDatas
			}
		}
	}
`

export const systems = gql`
	query systems($business: ID, $type: ENUM_SYSTEM_TYPE) {
		systems(where: { business: $business, type: $type }) {
			id
			type
			business {
				id
			}
			counselorStatusOption
			goalActive
			goalCount
			goalStart
			goalEnd
			reservationTimeStartTime
			reservationTimeEndTime
			reservationTimeSplitTime
			reservationTimeMaxSelect
			reservationTimeStartDate
			reservationTimeEndDate
			vacationReservation
		}
	}
`
export const vacations = gql`
	query vacations(
		$counselorName: String
		$counselorPhone: String
		$created_at_gte: DateTime
		$created_at_lt: DateTime
		$status: ENUM_VACATION_STATUS
		$type: ENUM_VACATION_TYPE
	) {
		vacations(
			where: {
				counselorName: $counselorName
				counselorPhone: $counselorPhone
				created_at_gte: $created_at_gte
				created_at_lt: $created_at_lt
				status: $status
				type: $type
			}
		) {
			id
			adminName
			adminId
			created_at
			type
			vacationDate
			status
			updated_at
			comment
			users_permissions_user {
				id
				name
				username
				phone
			}
		}
	}
`

export const teams = gql`
	query teams($business: ID, $id: ID) {
		teams(where: { business: $business, id: $id }) {
			id
			title
			ranks {
				id
				title
			}
		}
	}
`
export const ranks = gql`
	query ranks($business: ID, $id: ID, $team: ID) {
		ranks(where: { business: $business, id: $id, team: $team }) {
			id
			title
		}
	}
`
export const productCounts = gql`
	query productCounts($business: ID) {
		productCounts(where: { business: $business }) {
			count
		}
	}
`
export const inputBoxes = gql`
	query inputBoxes($business: ID) {
		inputBoxes(where: { business: $business }) {
			id
			categories {
				id
				codename
				type
				listorder
				musthave
				fixYn
				category_details {
					id
					detailname
					listorder
				}
			}
		}
	}
`

export const productAvailableCounts = gql`
	query productAvailableCounts(
		$business: ID
		$data1: String
		$data2: String
		$data3: String
		$data4: String
		$data5: String
		$data6: String
		$data7: String
		$last_data1: String
		$last_data2: String
		$last_data3: String
		$last_data4: String
		$last_data5: String
		$last_data6: String
		$last_data7: String
	) {
		productAvailableCounts(
			where: {
				business: $business
				data1: $data1
				data2: $data2
				data3: $data3
				data4: $data4
				data5: $data5
				data6: $data6
				data7: $data7
				last_data1: $last_data1
				last_data2: $last_data2
				last_data3: $last_data3
				last_data4: $last_data4
				last_data5: $last_data5
				last_data6: $last_data6
				last_data7: $last_data7
			}
		) {
			count
		}
	}
`
export const availableTimes = gql`
	query availableTimes($business: ID, $products: [ID], $date: String) {
		availableTimes(where: { business: $business, products: $products, date: $date }) {
			times
		}
	}
`
export const businessDashboard = gql`
	query business($id: ID!, $date: Date) {
		business(id: $id) {
			id
			clients {
				id
				contractStatus
				customDatas
				created_at
			}
			reservations {
				id
				status
				date
			}
			reserveday {
				sdate
				edate
				status
			}
			products {
				id
				status
			}
			users(where: { role: 3 }) {
				id
				goalActive
				vacations(where: { status: "waiting" }) {
					id
					status
					vacationDate
				}
				clients {
					id
					contractStatus
				}
				gotoworks(where: { date: $date }) {
					status
					date
					vacation {
						id
						status
						type
					}
				}
			}
		}
	}
`
export const personalPage = gql`
	query personalPage($id: ID!) {
		personalPage(id: $id) {
			id
			created_at
			updated_at
			profileImg {
				id
				url
				name
			}
			introduction_title
			introduction_content
			introduction_button
			count_title
			counsel_count
			client_count
			contract_count
			subscribe_title
			subscribe_button
			sns
			user
			published_at
			mainBanner {
				id
				url
				name
			}
			phone
		}
	}
`

export const systems_reservation = gql`
	query systems($business: ID, $type: ENUM_SYSTEM_TYPE, $reservationTitle: String) {
		systems(where: { business: $business, type: $type, reservationTitle_contains: $reservationTitle }) {
			id
			business {
				id
				title
			}
			reservationTimeStartDate
			reservationTimeEndDate
			reservationTitle
		}
	}
`

export const system = gql`
	query system($id: ID!) {
		system(id: $id) {
			id
			business {
				id
				title
			}
			type
			counselorStatusOption
			goalActive
			goalCount
			goalStart
			goalEnd
			vacationReservation
			reservationTimeStartTime
			reservationTimeEndTime
			reservationTimeSplitTime
			reservationTimeMaxSelect
			reservationTimeStartDate
			reservationTimeEndDate
			reservationTitle
			reservationEventId
			reservationTalks
			reservationNodaySetting
		}
	}
`

export const event_title = gql`
	query events($id: ID) {
		events(where: { id: $id }) {
			id
			title
		}
	}
`
