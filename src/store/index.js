import { createStore } from 'vuex'
import { moduleA } from '@/store/moduleA'
import { moduleB } from '@/store/moduleB'

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},

  modules: { moduleA, moduleB }
})
