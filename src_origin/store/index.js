/* eslint-disable no-empty-pattern */
import { createStore } from 'vuex'
import apollo from '@/apollo/config'
import { testQuery, terms } from '@/apollo/query'
import {} from '@/apollo/mutation'

import { moduleA } from '@/store/moduleA'
import { moduleB } from '@/store/moduleB'

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {
    // testQuery({}, input) {
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
    },
    terms({}, input) {
      return new Promise((resolve, reject) => {
        apollo.clients['defaultClient']
          .query({
            query: terms,
            variables: input
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
