// createHttpLink: 필요시 @apollo/client/core 에서 삽입
import axios from 'axios'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'
import { createUploadLink } from 'apollo-upload-client'
import { buildAxiosFetch } from '@lifeomic/axios-fetch'

// HTTP connection to the API
// const httpLink = createHttpLink({
//   // You should use an absolute URL here
//   uri: process.env.VUE_APP_BACKEND_URL + '/graphql'
// })

const uploadLink = createUploadLink({
  uri: process.env.VUE_APP_BACKEND_URL + '/graphql',
  fetch: buildAxiosFetch(axios, (config, input, init) => ({
    ...config,
    onUploadProgress: init.onUploadProgress
  }))
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: uploadLink,
  uri: 'http://localhost:4042/graphql',
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache'
    },
    query: {
      fetchPolicy: 'no-cache'
    },
    mutate: {
      fetchPolicy: 'no-cache'
    }
  }
})

const apolloProvider = createApolloProvider({
  defaultClient: apolloClient
})

export default apolloProvider
