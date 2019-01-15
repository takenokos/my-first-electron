'use strict'

import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron'
import path from 'path'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 576,
    useContentSize: true,
    width: 1024,
    frame: false, // 去除菜单
    fullscreenable: false, // 不可全屏
    // resizable: false, // 不可改变大小
    webPreferences: {
      webSecurity: false, // 设置跨域
      allowDisplayingInsecureContent: true, // 允许http资源
      allowRunningInsecureContent: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // 自定义菜单按钮
  // 关闭
  ipcMain.on('close-window', () => {
    mainWindow.close()
  })
  // 最小化到托盘
  ipcMain.on('hide-window', () => {
    mainWindow.hide()
  })
  // 最小化
  ipcMain.on('min-window', () => {
    mainWindow.minimize()
  })
  // 禁止直接关闭 ?是否需要 已自定义窗口
  mainWindow.on('close', (event) => {
    mainWindow.hide()
    mainWindow.setSkipTaskbar(true)
    event.preventDefault()
  })
  mainWindow.on('show', () => {
    tray.setHighlightMode('always')
  })
  mainWindow.on('hide', () => {
    tray.setHighlightMode('never')
  })
  // 系统托盘
  // const tray = new Tray(path.join(__dirname, '../../build/icons/icon.ico'))
  // const trayIcon = path.join(__dirname, 'build/icons/icon.ico')
  // const tray = new Tray(nativeImage.createFromPath(trayIcon))
  // const tray = new Tray(trayIcon)
  const trayIcon = `${__static}/icon.ico`
  const tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    { label: '退出', click: () => { mainWindow.destroy() } } // 我们需要在这里有一个真正的退出（这里直接强制退出）
  ])
  tray.setToolTip('My托盘测试')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => { // 我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    if (!mainWindow.isVisible()) {
      mainWindow.show()
    }
    mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
