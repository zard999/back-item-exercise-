import { login, logout, getInfo } from '@/api/acl/user'
import { resetRouter, allAsyncRoutes, constantRoutes, anyRoute } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'
// 过滤异步路由数组
function filterAsyncRoutes(allAsyncRoutes, routeNames) {
  let asyncRoutes = allAsyncRoutes.filter(item => {
    if (routeNames.indexOf(item.name) !== -1) {
      if (item.children && item.children.length) {
        item.children = filterAsyncRoutes(item.children, routeNames)
      }
      return true
    }
  })
  return asyncRoutes
}

const state = {
  token: localStorage.getItem('token_key'),
  name: '',
  avatar: '',
  buttons: [],
  roles: [],
  routes: [], // 这个是最后保存的路由数组，这个数组是让侧边栏遍历使用的
  asyncRoutes: []
  /**
   * 这个里面一会我们保存的不是请求回来的用户信息，
   * 而是根据请求回来的routes字符串过滤出来的路由信息数组
   * 请求返回的routes内部是路由的name字符串组成的
   * 我们最后保存的是根据字符串去所有的异步路由数组当中过滤出来的用户
   */
}

const mutations = {
  RESET_STATE: state => {
    state.token = ''
    state.name = ''
    state.avatar = ''
    state.buttons = []
    state.roles = []
    state.routes = []
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_INFO: (state, userInfo) => {
    state.name = userInfo.name
    state.avatar = userInfo.avatar
    state.buttons = userInfo.buttons
    state.roles = userInfo.roles
  },
  SET_ROUTES(state, asyncRoutes) {
    // 这个是为了解释过程用的，最终没啥用
    state.asyncRoutes = asyncRoutes
    // 保存用户所有的路由组成的数组，这个数组是让侧边栏遍历使用的
    // 这里千万别写 allAsyncRoutes
    state.routes = constantRoutes.concat(asyncRoutes, anyRoute)
    //还有把动态路由和任意路由，动态添加到常量路由中,形成一个完整的路由配置数组
    router.addRoutes([...asyncRoutes, anyRoute])
    // asyncRoutes.forEach(item => {
    //   router.addRoute(item)
    // })
    // router.addRoute(anyRoute)
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
      // result.data.routes 不是要这个，而是要从异步路由数组当中过滤好的异步路由数组
      commit(
        'SET_ROUTES',
        filterAsyncRoutes(cloneDeep(allAsyncRoutes), result.data.routes)
      )
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
      resetRouter() // 退出之后重置路由器
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
