import gql from 'graphql-tag'

// strapi_v4 test
export const testQuery = gql`
  query testContents {
    testContent(id: 1) {
      data {
        id
        attributes {
          status
          type
        }
      }
    }
  }
`
// strapi_v3 test
export const terms = gql`
	query {
		terms(where: { show: true }) {
			content
		}
	}
`
