import { login, logout, getInfo } from '@/api/user'
import { resetRouter } from '@/router'

const state = {
  token: localStorage.getItem('token_key'),
  name: '',
  avatar: ''
}

const mutations = {
  RESET_STATE: state => {
    state.token = ''
    state.name = ''
    state.avatar = ''
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
  }
}

const actions = {
  // user login
  async login({ commit }, { username, password }) {
    const result = await login({
      username: username.trim(),
      password: password
    })
    if (result.code === 20000) {
      commit('SET_TOKEN', result.data.token)
      localStorage.setItem('token_key', result.data.token)
      return 'ok'
    } else {
      return Promise.error(new Error('failed'))
    }
  },

  // get user info
  async getInfo({ commit, state }) {
    const result = await getInfo(state.token)
    if (result.code === 20000) {
      commit('SET_USER_INFO', result.data)
      return 'ok'
    } else {
      return Promise.error(new Error('failed'))
    }
  },

  // user logout
  async logout({ commit, state }) {
    const result = await logout(state.token)
    if (result.code === 20000) {
      localStorage.removeItem('token_key')
      commit('RESET_STATE')
      return 'ok'
    } else {
      return Promise.error(new Error('failed'))
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
