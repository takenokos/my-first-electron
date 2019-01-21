import request from '@/utils/request'
import Cookies from 'js-cookie'
// 设置用户的cookie
function setCookies (cookieObj) {
  const oldUid = Cookies.get('DedeUserID') // DedeUserID 用户uid
  if (oldUid === cookieObj.DedeUserID) { // 如果存储的就是当前用户，不操作
    return
  }
  for (const key in cookieObj) {
    Cookies.set(key, cookieObj[key])
  }
}
// 获取用户信息
export function getUserInfo (cookieObj) {
  // 先设置需要传递的用户cookie
  setCookies(cookieObj)
  return request({
    url: `https://api.live.bilibili.com/User/getUserInfo`,
    method: 'get',
    params: {
      ts: new Date().getTime()
    }
  })
}
// 用户心跳
export function userHeartBeat (cookieObj) {
  // setCookies(cookieObj)
  // return request({
  //   url: `https://api.live.bilibili.com/User/getUserInfo`,
  //   method: 'get',
  //   params: {
  //     ts: new Date().getTime()
  //   }
  // })
}
