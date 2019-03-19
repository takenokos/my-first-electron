import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

const APP = process.type === 'renderer' ? remote.app : app
const docDir = APP.getPath('documents')
const STORE_PATH = path.join(docDir, '/pigeon')

if (!fs.pathExistsSync(STORE_PATH)) { // 目录不存在则创建
  fs.mkdirpSync(STORE_PATH)
}
const adapter = new FileSync(path.join(STORE_PATH, '/data.json')) // db 的json 文件

const db = Datastore(adapter)

if (!db.has('users').value()) {
  db.set('users', []).write()
}
if (!db.has('main_uid').value()) {
  db.set('main_uid', -1).write()
}
if (!db.has('room_id').value()) {
  db.set('room_id', null).write()
}
export default db
