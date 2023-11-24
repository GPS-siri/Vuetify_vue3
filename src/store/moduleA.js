export const moduleA = {
  // getters, mutations, actions 도 각 모듈별로 구분해서 사용하려면 true 로 세팅해서 사용할 것
  // namespaced: true,
  state: () => ({
    count: 0
  }),
  getters: {
    // getter 추가가능 인자 - getters, rootState
    doubleCount(state) {
      return state.count * 2
    }
  },
  mutations: {
    increment(state) {
      state.count++
    }
  },
  actions: {
    incrementIfOddOnRootSum(state, commit, rootState) {
      if ((state.count + rootState.count) % 2 === 1) {
        commit('increment')
      }
    }
  }
}
