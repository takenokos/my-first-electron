import Datastore from 'lowdb'
import LodashId from 'lodash-id'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}
if (process.env.DEBUG_ENV === 'debug') {
  global.__static = path.join(__dirname, '../../static').replace(/\\/g, '\\\\')
}

const APP = process.type === 'renderer' ? remote.app : app
const docDir = APP.getPath('documents')
const STORE_PATH = path.join(docDir, '/test')

if (!fs.pathExistsSync(STORE_PATH)) { // 目录不存在则创建
  fs.mkdirpSync(STORE_PATH)
}
const adapter = new FileSync(path.join(STORE_PATH, '/data.json')) // db 的json 文件

const db = Datastore(adapter)
db._.mixin(LodashId)

if (!db.has('users').value()) {
  db.set('users', []).write()
}
if (!db.has('main_uid').value()) {
  db.set('main_uid', -1).write()
}

export default db
