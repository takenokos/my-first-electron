const state = {
  trueRoomId: null
}
const mutations = {
  // 设置roomId
  SET_TRUE_ROOM_ID (state, id) {
    state.trueRoomId = id
  }
}

const actions = {
  setTrueRoomId ({ dispatch, commit }, id) {
    commit('SET_TRUE_ROOM_ID', id)
  }
}
const getters = {
  trueRoomId: state => state.trueRoomId
}

export default {
  state,
  mutations,
  actions,
  getters
}
