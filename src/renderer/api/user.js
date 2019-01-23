import request from '@/utils/request'
import { ipcRenderer } from 'electron'

const BiliApi = 'https://api.live.bilibili.com'
// 设置用户的cookie
function setCookies (cookieObj) {
  for (const key in cookieObj) {
    const c = { url: BiliApi, name: key, value: cookieObj[key] }
    console.log(c)
    ipcRenderer.send('set-cookie', c)
  }
}
// 获取用户信息
export function getUserInfo (cookieObj) {
  // 先设置需要传递的用户cookie
  setCookies(cookieObj)
  return request({
    url: `${BiliApi}/User/getUserInfo`,
    method: 'get',
    params: {
      ts: new Date().getTime()
    }
  })
}
// 用户心跳
export function userHeartBeat (cookieObj) {
  setCookies(cookieObj)
  return request({
    url: `${BiliApi}/User/userOnlineHeart`,
    method: 'get'
  })
}
