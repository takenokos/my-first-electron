import request from '@/utils/request'
import { ipcRenderer } from 'electron'
const BiliApi = 'https://api.live.bilibili.com'
// const BiliApi = ''
// 设置用户的cookie
function setCookies (cookieObj) {
  for (const key in cookieObj) {
    const cookie = { url: BiliApi, name: key, value: cookieObj[key] }
    ipcRenderer.send('set-cookie', cookie)
  }
}
// 获取用户信息
export async function getUserInfo (cookieObj) {
  // 先设置需要传递的用户cookie
  await setCookies(cookieObj)
  return request({
    url: `${BiliApi}/User/getUserInfo`,
    method: 'get',
    params: {
      ts: new Date().getTime()
    }
  })
}
// 用户心跳
export async function userHeartBeat (cookieObj) {
  await setCookies(cookieObj)
  return request({
    url: `${BiliApi}/User/userOnlineHeart`,
    method: 'get'
  })
}
