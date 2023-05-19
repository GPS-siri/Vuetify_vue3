export const moduleB = {
  // getters, mutations, actions 도 각 모듈별로 구분해서 사용하려면 true 로 세팅해서 사용할 것
  // namespaced: true,
  state: () => ({ counter: 10 }),
  getters: {
    time2(state) {
      return state.counter * 2
    }
  },
  mutations: {
    setCounter(state, value) {
      state.counter = value
    }
  },
  actions: {
    test() {
      console.log(4)
    }
  }
}
