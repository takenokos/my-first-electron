import https from 'https'
import url from 'url'
import qs from 'querystring'
import { Message } from 'element-ui'
const BiliApi = 'api.live.bilibili.com'
export default function (config) {
  // url
  const requestUrl = config.url
  const parsed = url.parse(requestUrl)
  let options = {
    hostname: parsed.hostname || BiliApi,
    port: parsed.port,
    path: parsed.pathname,
    method: config.method.toUpperCase(),
    headers: {}
  }
  // path query
  const params = qs.stringify(config.params)
  if (params) {
    options.path += '?' + params
  }
  // post data
  const postData = typeof config.data === 'string'
    ? config.data
    : JSON.stringify(config.data || {})
  // set headers
  if (config.headers) {
    switch (options.method) {
      case 'GET':
        options.headers = config.headers
        break
      case 'POST':
        options.headers = Object.assign({
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }, config.headers)
        break
    }
  }
  // cookie
  if (config.cookie) {
    const cookieObj = config.cookie
    let cookieStr = ''
    Object.keys(cookieObj).forEach(key => {
      cookieStr += `${key}=${cookieObj[key]};`
    })
    options.headers.Cookie = cookieStr
  }
  // https request
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      const statusCode = res.statusCode
      if (statusCode !== 200) {
        reject(new Error(`Request failed with status code ${statusCode}`))
      }
      res.setEncoding('utf8')
      let rawData = ''
      res.on('error', e => {
        Message({
          message: e,
          type: 'error'
        })
        reject(e)
      })
      res.on('data', chunk => {
        rawData += chunk
      })
      res.on('end', () => {
        resolve(JSON.parse(rawData))
      })
    })
    req.on('error', e => {
      Message({
        message: e,
        type: 'error'
      })
      reject(e)
    })
    if (options.method === 'POST') {
      req.write(postData)
    }
    req.end()
  })
}
