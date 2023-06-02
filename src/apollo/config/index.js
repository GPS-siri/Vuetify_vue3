import { ApolloClient } from 'apollo-client'
// import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { createUploadLink } from 'apollo-upload-client'
import axios from 'axios'
const { buildAxiosFetch } = require('@lifeomic/axios-fetch')
// -------------------- 아폴로 셋팅 ------------------------ //

const uploadLink = createUploadLink({
	uri: process.env.VUE_APP_BACKEND_URL + '/graphql',
	fetch: buildAxiosFetch(axios, (config, input, init) => ({
		...config,
		onUploadProgress: init.onUploadProgress,
	})),
})

// HTTP connection to the API
// const httpLink = createHttpLink({
//   uri: process.env.VUE_APP_BACKEND_URL + '/graphql'
// })

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo clients
const apolloClient = new ApolloClient({
	link: uploadLink,
	cache,
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'no-cache',
		},
		query: {
			fetchPolicy: 'no-cache',
		},
		mutate: {
			fetchPolicy: 'no-cache',
		},
	},
})

export default new VueApollo({
	defaultClient: apolloClient,
})
