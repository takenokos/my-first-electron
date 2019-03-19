import request from './request'
// 获取用户信息
export function getUserInfo (cookieObj) {
  return request({
    url: '/xlive/web-ucenter/user/get_user_info',
    method: 'get',
    cookie: cookieObj
  })
}
// 用户心跳
export function userHeartBeat (cookieObj) {
  return request({
    url: '/User/userOnlineHeart',
    method: 'get',
    cookie: cookieObj
  })
}
