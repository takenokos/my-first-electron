
import { getUsers, addUser, deleteUser, updateUser } from '@/utils/users-db.js'
import { getUserInfo } from '@/api/user'
const state = {
  users: [],
  main_uid: -1
}

const mutations = {
  // 清空用户
  CLEAR_USERS (state) {
    state.users = []
  },
  // 添加用户
  ADD_USER (state, user) {
    const bol = state.users.some(obj => obj.uid === user.uid)
    !bol && state.users.push(user)
  },
  // 删除用户
  DELETE_USER (state, uid) {
    const index = state.users.findIndex(obj => obj.uid === uid)
    index > -1 && state.users.splice(index, 1)
  },
  // 更新用户
  UPDATE_USER (state, obj) {
    let user = state.users.find(item => item.uid === obj.uid)
    if (user) {
      Object.keys(obj).forEach(key => {
        user[key] = obj[key]
      })
    }
  },
  // 主用户
  SET_MAIN_UID (state, uid) {
    state.main_uid = uid
  }
}

const actions = {
  // 获取全部用户
  async getUsers ({ dispatch, commit }) {
    commit('CLEAR_USERS')
    getUsers().then(data => {
      dispatch('getUserInfo', data)
    })
  },
  // 用户信息 递归
  getUserInfo ({ dispatch, commit }, data) {
    if (data.length <= 0) {
      return
    }
    let item = data[0]
    if (!item.enable) {
      dispatch('addTo', { user: item, data })
      return
    }
    if (!item.enable) {
      commit('ADD_USER', item)
      dispatch('addTo', { item, data })
      return
    }
    const cookie = item.cookie
    getUserInfo(cookie).then(res => {
      const user = Object.assign({}, item, { info: res.data })
      updateUser(user)
      commit('ADD_USER', user)
      dispatch('addTo', { user, data })
    }).catch(() => { // 接口返回出错 cookie 无效
      item.enable = false
      dispatch('addTo', { user: item, data })
    })
  },
  // 添加进vuex
  addTo ({ dispatch, commit }, { user, data }) {
    commit('ADD_USER', user)
    data.shift() // 删除第一个
    setTimeout(() => { // 1s延迟加载，保证cookie的正常
      dispatch('getUserInfo', data)
    }, 1000)
  },
  // 添加用户 登陆
  addUser ({ commit }, cookie) {
    const obj = {
      uid: parseInt(cookie.DedeUserID),
      enable: true,
      cookie
    }
    setTimeout(() => { // 1s延迟加载，保证cookie的正常
      // dispatch('getUserInfo', [obj])
      getUserInfo(cookie).then(res => {
        const user = Object.assign({}, obj, { info: res.data })
        addUser(user)
        commit('ADD_USER', user)
      })
    }, 1000)
  },
  // 删除用户 登出
  deleteUser ({ commit }, uid) {
    deleteUser(uid).then(() => {
      commit('DELETE_USER', uid)
    })
  },
  // 更新用户
  updateUser ({ commit }, obj) {
    updateUser(obj)
    commit('UPDATE_USER', obj)
  }
}
const getters = {
  users: state => state.users,
  mainuser: state => state.users.find(item => item.uid === state.main_uid)
}

export default {
  state,
  mutations,
  actions,
  getters
}
