// Modules to control application life and create native browser window
const {app, session, BrowserWindow} = require('electron')
const session_manager = require('./lib/session-manager')
const main_window = require('./window')
const login_window = require('./window/login')
const logout_window = require('./window/logout')
const search_window = require('./window/search')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  session_manager.set_session(session.defaultSession)
  session_manager.cookie.load()

  let mainW = main_window.create()

  global.open_login = () => {
    let w = login_window.set_parent(mainW).create()
    w.on('closed', () => {
      session_manager.cookie.save()
      mainW.webContents.executeJavaScript('do_login_proc()')
    })
  }
  global.open_login()

  global.open_logout = () => {
    let w = logout_window.set_parent(mainW).create()
    w.on('closed', () => {
      session_manager.cookie.save()
      mainW.webContents.executeJavaScript('do_login_proc()')
    })
  }

  global.open_search = () => {
    let w = search_window.set_parent(mainW).create()
    w.on('closed', () => {
    })
  }

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) main_window.create()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
