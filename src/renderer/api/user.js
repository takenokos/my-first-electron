import request from './request'
// 获取用户信息
export function getUserInfo (cookieObj) {
  return request({
    url: '/xlive/web-ucenter/user/get_user_info',
    method: 'get'
  },
  cookieObj)
}
// 用户心跳
export function userHeartBeat (cookieObj, roomId = 21825) {
  return request({
    url: '/User/userOnlineHeart',
    method: 'get',
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Host': 'api.live.bilibili.com',
      'Origin': 'https://live.bilibili.com',
      'Referer': `https://live.bilibili.com/${roomId}`
    }
  }, cookieObj)
}
