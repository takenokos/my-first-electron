import path from 'path'
import fs from 'fs-extra'
import { remote, app } from 'electron'
import { formatDate } from '@/common/format'

const APP = process.type === 'renderer' ? remote.app : app
const docDir = APP.getPath('documents')
export function addText (roomid, text) {
  const date = formatDate()
  const roomFolder = path.join(docDir, `/pigeon/${roomid}/${date}.txt`)
  fs.pathExists(roomFolder).then(bol => {
    if (bol) {
      fs.appendFile(roomFolder, `\n${text}`)
    } else {
      fs.outputFile(roomFolder, text)
    }
  })
}
