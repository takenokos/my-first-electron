import https from 'https'
import url from 'url'
import qs from 'querystring'
import { Message } from 'element-ui'

import FormData from 'form-data'
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
  // const postData = typeof config.data === 'string'
  //   ? config.data
  //   : qs.stringify(config.data || {})

  // set headers
  if (config.headers || options.method === 'POST') {
    switch (options.method) {
      case 'GET':
        options.headers = config.headers
        break
      case 'POST':
        options.headers = Object.assign({
          'Content-Type': 'application/json'
          // 'Content-Length': postData.length
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
    console.log(options)
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
        console.log(rawData)
        resolve(JSON.parse(rawData))
      })
    })
    if (options.method === 'POST') {
      let postData = new FormData()
      Object.keys(config.data).forEach(key => {
        postData.append(key, config.data[key])
      })
      postData.pipe(req)
      req.write(postData + '')
    }
    req.on('error', e => {
      Message({
        message: e,
        type: 'error'
      })
      reject(e)
    })
    req.end()
  })
}
