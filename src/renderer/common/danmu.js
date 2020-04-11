const pako = require('pako')
const rawHeaderLen = 16
const packetOffset = 0
const headerOffset = 4
const verOffset = 6
const opOffset = 8
const seqOffset = 12
let textDecoder = getDecoder(true)
const textEncoder = getEncoder()
// decode
function getDecoder (isUseful) {
  if (window['TextDecoder'] && isUseful) {
    return new window['TextDecoder']()
  } else {
    return {
      decode: (buf) => {
        return decodeURIComponent(window.escape(String.fromCharCode.apply(null, new Uint8Array(buf))))
      }
    }
  }
}
// encode
function getEncoder () {
  if (window['TextEncoder']) {
    return new window['TextEncoder']()
  } else {
    return {
      encode: (str) => {
        let buf = new ArrayBuffer(str.length)
        let bufView = new Uint8Array(buf)
        for (let i = 0, strlen = str.length; i < strlen; i++) {
          bufView[i] = str.charCodeAt(i)
        }
        return bufView
      }
    }
  }
}
// 合并arrayBuffer
function mergeArrayBuffer (ab1, ab2) {
  const u81 = new Uint8Array(ab1)
  const u82 = new Uint8Array(ab2)
  const res = new Uint8Array(ab1.byteLength + ab2.byteLength)
  res.set(u81, 0)
  res.set(u82, ab1.byteLength)
  return res.buffer
}

// sendData
export function sendArrayBuffer (type, token) {
  const headerBuf = new ArrayBuffer(rawHeaderLen)
  const headerView = new DataView(headerBuf, 0)
  const bodyBuf = textEncoder.encode(token)
  headerView.setInt32(packetOffset, rawHeaderLen + bodyBuf.byteLength)
  headerView.setInt16(headerOffset, rawHeaderLen)
  headerView.setInt16(verOffset, 1)
  // headerView.setInt16(verOffset, 2)
  headerView.setInt32(opOffset, type)
  headerView.setInt32(seqOffset, 1)
  return mergeArrayBuffer(headerBuf, bodyBuf)
}
// 处理拿到的ws onmessage event
export function fixMessage (event) {
  return new Promise(resolve => {
    const data = event.data
    const dataView = new DataView(data, 0)
    const packetLen = dataView.getInt32(packetOffset)
    const headerLen = dataView.getInt16(headerOffset)
    const ver = dataView.getInt16(verOffset)
    const op = dataView.getInt32(opOffset)
    const seq = dataView.getInt32(seqOffset)
    resolve({
      data,
      dataView,
      packetLen,
      headerLen,
      ver,
      op,
      seq
    })
  })
}
// 拿取人气
export function getPopularity (dataView) {
  return dataView.getUint32(16)
}
// 拿取弹幕内容
export function getMessage (res) {
  var packetView = res.dataView
  var msg = res.data
  let packetLen = res.packetLen
  let headerLen = res.headerLen
  for (let offset = 0; offset < msg.byteLength; offset += packetLen) {
    packetLen = packetView.getInt32(offset)
    headerLen = packetView.getInt16(offset + headerOffset)
    const item = msg.slice(offset + headerLen, offset + packetLen)
    let p
    try {
      p = pako.inflate(item)
    } catch (e) {
      p = new Uint8Array(item)
    }
    return getWsDataview(p.buffer)
  }
}
// 获取弹幕内容
function getWsDataview (data) {
  let dataView = new DataView(data, 0)
  let packetLen = dataView.getInt32(packetOffset)
  let headerLen = dataView.getInt16(headerOffset)
  let msgBody
  let res = []
  for (let offset = 0; offset < data.byteLength; offset += packetLen) {
    packetLen = dataView.getInt32(offset)
    headerLen = dataView.getInt16(offset + headerOffset)
    const item = data.slice(offset + headerLen, offset + packetLen)
    const responseArray = new Uint8Array(item)
    msgBody = new TextDecoder().decode(responseArray)
    if (!msgBody) {
      textDecoder = getDecoder(false)
      msgBody = textDecoder.decode(data.slice(offset + headerLen, offset + packetLen))
    }
    try {
      res.push(JSON.parse(msgBody))
    } catch (e) {
      console.log(msgBody)
    }
  }
  return res
}
