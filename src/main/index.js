'use strict'

import { app, BrowserWindow, ipcMain, Tray, Menu, screen } from 'electron'
import path from 'path'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow, barrageWin
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/index.html`
  : `file://${__dirname}/index.html`
const barrageURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/barrage.html`
  : `file://${__dirname}/barrage.html`

function createWindow () {
  /**
   * Initial window options
   */
  /* main window */
  mainWindow = new BrowserWindow({
    height: 550,
    width: 980,
    useContentSize: true,
    frame: false, // 去除菜单
    transparent: true, // 透明窗口
    fullscreenable: false, // 不可全屏
    resizable: false, // 不可改变大小
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
  /* end main window */

  /* barrage window */
  const screenSize = screen.getPrimaryDisplay().size
  barrageWin = new BrowserWindow({
    height: screenSize.height,
    width: 200,
    x: screenSize.width - 200,
    y: 0,
    alwaysOnTop: true,
    useContentSize: true,
    frame: false, // 去除菜单
    transparent: true, // 透明窗口
    fullscreenable: false, // 不可全屏
    resizable: false // 不可改变大小
  })

  barrageWin.loadURL(barrageURL)
  // 鼠标穿透
  barrageWin.setIgnoreMouseEvents(true)
  // 不能获取焦点 任务栏不显示
  barrageWin.setFocusable(false)
  /* end barrage window */

  /* 系统托盘 */
  const trayIcon = `${__static}/icon.png`
  const tray = new Tray(trayIcon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: () => {
        mainWindow.destroy()
        barrageWin.destroy()
        app.quit()
      }
    } // 我们需要在这里有一个真正的退出（这里直接强制退出）
  ])
  tray.setToolTip('bililive pigeon')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => { // 我们这里模拟桌面程序点击通知区图标实现打开关闭应用的功能
    if (!mainWindow.isVisible()) {
      mainWindow.show()
    }
    mainWindow.isVisible() ? mainWindow.setSkipTaskbar(false) : mainWindow.setSkipTaskbar(true)
  })
  /* end 系统托盘 */

  /* 进程间通信 */
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
  // 弹幕
  // 添加弹幕至悬浮窗
  ipcMain.on('add-danmu', (event, json) => {
    barrageWin.webContents.send('add-danmu', json)
  })
  // 切换弹幕浮窗的显示
  ipcMain.on('toggle-barrage', (event, bol) => {
    bol ? barrageWin.show() : barrageWin.hide()
  })
  /* end 进程间通信 */
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
