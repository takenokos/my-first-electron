import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'
import { formatDate } from '@/common/format'

const APP = process.type === 'renderer' ? remote.app : app
const docDir = APP.getPath('documents')
const STORE_PATH = path.join(docDir, '/pigeon')

if (!fs.pathExistsSync(STORE_PATH)) { // 目录不存在则创建
  fs.mkdirpSync(STORE_PATH)
}
const adapter = new FileSync(path.join(STORE_PATH, '/gift.json')) // db 的json 文件

const db = Datastore(adapter)

if (!db.has('logs').value()) {
  db.set('logs', []).write() // {date:'2019-09-16',time:'00:00:00',roomId:21825,uid:123456,uname:'test',giftName:'辣条',num:1000}
}
if (!db.has('daysTotal').value()) {
  db.set('daysTotal', []).write() // {date:'2019-09-16',roomId:21825,gifts:[{name:'辣条',num:1000}]}
}

const logsDb = () => {
  return db.read().get('logs')
}
const daysDb = () => {
  return db.read().get('daysTotal')
}
// 添加礼物记录
export function addGiftLog (roomId, obj) {
  return new Promise((resolve) => {
    const date = formatDate()
    const data = Object.assign({ date, roomId }, obj)
    logsDb().push(data).write() // 日志直接写入
    // 以下更新统计信息
    const val = daysDb().find({ date: date, roomId: roomId }).value()
    if (!val) { // 今天还没有统计数据进入
      const dayObj = {
        date: date,
        roomId: roomId,
        gifts: [{ name: obj.giftName, num: obj.num }]
      }
      daysDb().push(dayObj).write()
    } else { // 有则更新gifts的内容
      const dayGifts = val.gifts.map(item => Object.assign({}, item))
      const giftData = dayGifts.find(item => item.name === obj.giftName)
      if (giftData) {
        giftData.num += obj.num
      } else {
        dayGifts.push({ name: obj.giftName, num: obj.num })
      }
      daysDb()
        .find({ date: date, roomId: roomId })
        .assign({ gifts: dayGifts }).write()
    }
    resolve()
  })
}
// 统计房间天数礼物合 从当天往前推
export function countDaysGifts (roomId, num = 1) {
  return new Promise(resolve => {
    const trueNum = num > 0 ? num - 1 : 0 // 防止负数
    const minTime = new Date().getTime() - (trueNum * 3600 * 24 * 1000) // num-1 天前的日期时间
    const to = formatDate()
    const from = formatDate(minTime)
    const data = daysDb().find(obj => (obj.roomId === roomId && obj.date <= to && obj.date >= from)).value()
    let res = {
      from,
      to,
      roomId,
      gifts: []
    }
    data.forEach(obj => {
      obj.gifts.forEach(item => {
        let gifObj = res.gifts.find(ele => ele.name === item.name)
        if (gifObj) {
          // 有数据 则统计相加
          gifObj.num += item.num
        } else {
          res.gifts.push(item)
        }
      })
    })
    resolve(res)
  })
}
// 统计个人天数礼物
export function countUserGifts (roomId, num = 1) {
  return new Promise(resolve => {
    const trueNum = num > 0 ? num - 1 : 0 // 防止负数
    const minTime = new Date().getTime() - (trueNum * 3600 * 24 * 1000) // num-1 天前的日期时间
    const to = formatDate()
    const from = formatDate(minTime)
    const data = logsDb().find(obj => (obj.roomId === roomId && obj.date <= to && obj.date >= from)).value()
    let res = {
      from,
      to,
      roomId,
      gifts: []
    }
    data.forEach(obj => {
      obj.gifts.forEach(item => {
        let gifObj = res.gifts.find(ele => ele.name === item.name)
        if (gifObj) {
          // 有数据 则统计相加
          gifObj.num += item.num
        } else {
          res.gifts.push(item)
        }
      })
    })
    resolve(res)
  })
}
