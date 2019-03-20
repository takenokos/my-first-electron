import request from './request'
// 获取真实的房间信息
export function getTrueRoomId (id) {
  return request({
    url: '/room/v1/Room/room_init',
    method: 'get',
    params: {
      id
    }
  })
}
// 发送弹幕消息
export function danmuSend (data) {
  return request({
    url: '/msg/send',
    // url: 'https://live.bilibili.com/msg/send',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': 'https://live.bilibili.com',
      'Referer': `https://live.bilibili.com/${data.roomid}`
    },
    data
  })
}
