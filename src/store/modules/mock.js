import { getData } from '@/api/mock'
const state = {
  echartsData: {},
}
const mutations = {
  SET_ECHARTS_DATA(state, echartsData) {
    state.echartsData = echartsData
  },
}
const actions = {
  async getData({ commit }) {
    const result = await getData()
    if (result.code === 2100) {
      commit('SET_ECHARTS_DATA', result.data)
    }
  },
}

export default {
  state,
  mutations,
  actions,
}
