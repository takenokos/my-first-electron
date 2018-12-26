import Cookies from 'js-cookie'

// 设置用户传递的cookie
export function setUserCookie (obj) {
  return new Promise((resolve, reject) => {
    for (const key in obj) {
      Cookies.set(key, obj[key])
    }
    resolve()
  })
}
