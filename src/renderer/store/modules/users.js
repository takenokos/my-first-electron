
import { getUsers, addUser, deleteUserByUid, updateUser, getMainUid, setMainUid } from '@/db/users.js'
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
    // console.log(state.users)
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
  getUsers ({ dispatch, commit }) {
    commit('CLEAR_USERS')
    getUsers().then(data => {
      dispatch('getUsersInfo', data)
    })
  },
  // 用户信息 递归
  getUsersInfo ({ dispatch, commit }, data) {
    if (data.length <= 0) {
      return
    }
    let item = data[0]
    if (!item.enable) {
      dispatch('addTo', { user: item, data })
      return
    }
    const cookie = item.cookie
    getUserInfo(cookie).then(res => {
      if (res.code === 0) {
        const user = Object.assign({}, item, { info: res.data })
        updateUser(user)
        dispatch('addTo', { user, data })
      } else {
        item.enable = false
        updateUser(item)
        dispatch('addTo', { user: item, data })
      }
    }).catch(() => { // 接口返回出错 cookie 无效
      item.enable = false
      updateUser(item)
      dispatch('addTo', { user: item, data })
    })
  },
  // 添加进vuex
  addTo ({ dispatch, commit }, { user, data }) {
    commit('ADD_USER', user)
    data.shift() // 删除第一个
    dispatch('getUsersInfo', data)
  },
  // 添加用户 登陆
  loginUser ({ commit }, cookie) {
    const obj = {
      uid: parseInt(cookie.DedeUserID),
      enable: true,
      cookie
    }
    getUserInfo(cookie).then(res => {
      const user = res.code === 0 ? Object.assign({}, obj, { info: res.data }) : { ...obj }
      addUser(user)
      commit('ADD_USER', user)
    })
  },
  // 删除用户 登出
  deleteUser ({ commit }, uid) {
    deleteUserByUid(uid).then(() => {
      commit('DELETE_USER', uid)
    })
  },
  // 更新用户
  updateUserData ({ commit }, obj) {
    updateUser(obj)
    commit('UPDATE_USER', obj)
  },
  // 获取主用户uid
  getMainUser ({ commit }) {
    getMainUid().then(uid => {
      commit('SET_MAIN_UID', uid)
    })
  },
  // 更新主用户uid
  updateMainUser ({ commit }, uid) {
    setMainUid(uid).then(() => {
      commit('SET_MAIN_UID', uid)
    })
  }
}
const getters = {
  users: state => state.users,
  mainUser: state => state.users.find(item => item.uid === state.main_uid),
  isMain: state => {
    return uid => {
      return uid === state.main_uid
    }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
