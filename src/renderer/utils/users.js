import fs from 'fs'
import path from 'path'
const userPath = path.join(__dirname, '..', `\\user`)
// console.log(_path) // 测试路径对不对的
// 读取用户目录
export function readUsers () {
  return new Promise((resolve, reject) => {
    fs.readdir(userPath, (err, files) => {
      let data = []
      if (!err && files.length > 0) {
        files.forEach(file => {
          const filePath = path.join(userPath, `\\${file}`)
          data.push(JSON.parse(fs.readFileSync(filePath, 'utf8'))) // 同步读取内容
        })
      }
      resolve(data)
    })
  })
}
// 更新用户文件
export function updateUser (username, json) {
  const _path = path.join(userPath, `\\${username}.txt`)
  dirExists(userPath).then(() => {
    write(_path, JSON.stringify(json))
  })
}

/**
 * 读取路径信息
 * @param {string} path 路径
 */
function getStat (path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        resolve(false)
      } else {
        resolve(stats)
      }
    })
  })
}
/**
 * 路径是否存在，不存在则创建
 * @param {string} dir 路径
 */
function dirExists (dir) {
  return getStat(dir).then(isExists => {
    // 如果该路径且不是文件，返回true
    if (isExists && isExists.isDirectory()) {
      return true
    } else { // 如果该路径存在但是文件，返回false
      mkdir(dir).then(bol => {
        return bol
      })
    }
  })
}

/**
 * 创建路径
 * @param {string} dir 路径
 */
function mkdir (dir) {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, err => {
      if (err) {
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
// 写入文件内容
function write (path, content) {
  fs.open(path, 'w', (err, fd) => {
    if (err) throw err
    fs.writeFile(fd, content, (err) => {
      fs.close(fd, (err) => {
        if (err) throw err
      })
      if (err) throw err
      console.log('文件已保存')
    })
  })
}
