import db from './index'
import { Message } from 'element-ui'
const dbName = 'users'
const dbMainUser = 'main_uid'
const userDb = () => {
  return db.read().get(dbName)
}
// 读取全部的用户的uid
export function getUsers () {
  return new Promise((resolve) => {
    resolve(userDb().value())
  })
}
// 读取一个用户
export function getUser (uid) {
  return new Promise((resolve) => {
    const val = userDb().find({ uid: uid }).value()
    resolve(val)
  })
}
// 添加用户
export function addUser (obj) {
  return new Promise((resolve) => {
    const val = userDb().find({ uid: obj.uid }).value()
    if (val) {
      Message({
        message: '用户已存在',
        type: 'error'
      })
      updateUser(obj) // 用户存在的情况下更新数据
      resolve()
    } else {
      userDb().push(obj).write()
      Message({
        message: '用户信息已保存',
        type: 'success'
      })
      resolve()
    }
  })
}
// 更新用户信息 全部的
export function updateUser (obj) {
  return new Promise((resolve) => {
    const val = userDb().find({ uid: obj.uid }).value()
    if (!val) {
      Message({
        message: '用户不存在',
        type: 'error'
      })
      resolve()
    } else {
      userDb()
        .find({ uid: obj.uid })
        .assign(obj)
      Message({
        message: '用户信息已更新',
        type: 'success'
      })
      resolve()
    }
  })
}
// 删除用户信息 登出
export function deleteUserByUid (uid) {
  return new Promise((resolve) => {
    userDb()
      .remove({ uid: uid }).write()
    Message({
      message: '用户已登出',
      type: 'success'
    })
    resolve()
  })
}

// 主用户的内容
// 获取主用户id
export function getMainUid () {
  return Promise.resolve(db.read().get(dbMainUser).value())
}
// 设置主用户id
export function setMainUid (uid) {
  return Promise.resolve(db.read().set(dbMainUser, uid).write())
}
