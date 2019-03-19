import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'

const APP = process.type === 'renderer' ? remote.app : app
const docDir = APP.getPath('documents')

function newDate () {
  const date = new Date()
  const yyyy = date.getFullYear()
  const m = date.getMonth() + 1
  const d = date.getDate()
  const mm = m > 9 ? m : '0' + m
  const dd = d > 9 ? d : '0' + d
  return yyyy + '-' + mm + '-' + dd
}
export function addText (roomid, text) {
  const date = newDate()
  const roomFolder = path.join(docDir, `/pigeon/${roomid}/${date}.txt`)
  fs.pathExists(roomFolder).then(bol => {
    if (bol) {
      fs.appendFile(roomFolder, `\n${text}`)
    } else {
      fs.outputFile(roomFolder, text)
    }
  })
}
