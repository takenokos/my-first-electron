import db from '../../db/index'
import { Message } from 'element-ui'
const dbName = 'users'
const userDb = db.get(dbName)
// 读取全部的用户
export function getUsers () {
  return new Promise((resolve, reject) => {
    resolve(userDb.value())
  })
}
// 添加用户
export function addUser (obj) {
  return new Promise((resolve, reject) => {
    const val = userDb.find({ uid: obj.uid }).value()
    if (val) {
      Message({
        message: '用户已存在',
        type: 'error'
      })
      resolve()
    } else {
      userDb.push(obj).write()
      Message({
        message: '用户信息已保存',
        type: 'success'
      })
      resolve()
    }
  })
}
// 更新用户信息
export function updateUser (obj) {
  return new Promise((resolve, reject) => {
    const val = userDb.find({ uid: obj.uid }).value()
    if (!val) {
      Message({
        message: '用户不存在',
        type: 'error'
      })
      resolve()
    } else {
      userDb
        .find({ uid: obj.uid })
        .assign(obj)
      Message({
        message: '用户信息已保存',
        type: 'success'
      })
      resolve()
    }
  })
}
