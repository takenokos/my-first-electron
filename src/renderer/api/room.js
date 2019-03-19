import request from './request'
// 获取用户信息
export function getTrueRoomId (id) {
  return request({
    url: '/room/v1/Room/room_init',
    method: 'get',
    params: {
      id
    }
  })
}
