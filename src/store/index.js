import { createStore } from 'vuex'
import apollo from '@/apollo/config'
import { testQuery } from '@/apollo/query'
import {} from '@/apollo/mutation'

import { moduleA } from '@/store/moduleA'
import { moduleB } from '@/store/moduleB'

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // testQuery({}, input) {
    // eslint-disable-next-line no-empty-pattern
    testQuery({}) {
      return new Promise((resolve, reject) => {
        apollo.clients['defaultClient']
          .query({
            query: testQuery
            // variables: input
            // context: {
            // 	headers: {
            // 		Authorization: 'Bearer ' + sessionStorage.getItem(tokenName),
            // 	},
            // },
          })
          .then(({ data }) => {
            resolve(data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },

  modules: { moduleA, moduleB }
})
