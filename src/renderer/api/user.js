import request from '@/utils/request'
import Cookies from 'js-cookie'
// 获取用户信息
export function getUserInfo (obj) {
  // 先设置需要传递的用户cookie
  for (const key in obj) {
    Cookies.set(key, obj[key])
  }
  return request({
    url: 'https://api.live.bilibili.com/User/getUserInfo',
    method: 'get'
  })
}
