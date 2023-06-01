import gql from 'graphql-tag'

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
