import db from './index'
const dbRoom = 'room_id'
// 获取房间号
export function getRoomId () {
  return Promise.resolve(db.read().get(dbRoom).value())
}
// 保存房间号
export function setRoomId (roomId) {
  return Promise.resolve(db.read().set(dbRoom, roomId).write())
}
