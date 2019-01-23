import request from '@/utils/request'
import { ipcRenderer } from 'electron'

const BiliApi = 'https://api.live.bilibili.com'
// 设置用户的cookie
function setCookies (url, cookieObj) {
  for (const key in cookieObj) {
    const c = { url: url, name: key, value: cookieObj[key] }
    console.log(c)
    ipcRenderer.send('set-cookie', c)
  }
}
// 获取用户信息
export function getUserInfo (cookieObj) {
  const url = `${BiliApi}/User/getUserInfo`
  // 先设置需要传递的用户cookie
  setCookies(url, cookieObj)
  return request({
    url: url,
    method: 'get',
    params: {
      ts: new Date().getTime()
    }
  })
}
// 用户心跳
export function userHeartBeat (cookieObj) {
  const url = `${BiliApi}/User/userOnlineHeart`
  setCookies(url, cookieObj)
  return request({
    url: url,
    method: 'get'
  })
}
