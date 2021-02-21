// Modules to control application life and create native browser window
const {app, session, BrowserWindow} = require('electron')
const fs = require('fs');
const path = require('path');
const session_manager = require('./lib/session-manager')
const media_downloader = require('./lib/media-downloader')
const main_window = require('./window')
const login_window = require('./window/login')
const logout_window = require('./window/logout')
const search_window = require('./window/search')
const lecture_index_window = require('./window/lecture_index')
const lecture_view_window = require('./window/lecture_view')

global.app_path = app.getAppPath()
while ((/(\.asar|resources)$/gm).exec(global.app_path)) {
  global.app_path = path.join(global.app_path.toString(), '..')
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  session_manager.init().set_session(session.defaultSession)
  session_manager.cookie.load()

  let mainW = main_window.create()

  media_downloader.set_screen((msg) => {
    mainW.webContents.executeJavaScript(`show_download_stat("${msg.replace(/\n/g, "\\n")}")`)
  })
  media_downloader.run()

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
    let w = search_window.create()
    w.on('closed', () => {
    })
  }

  global.open_lecture_index = (sbjtId, cntsId) => {
    let w = lecture_index_window.set_key(sbjtId, cntsId).create()
    w.on('closed', () => {
    })
  }

  global.open_lecture_view = (type, sbjtId, lectPldcTocNo, code, is_download) => {
    let w = lecture_view_window.set_key(type, sbjtId, lectPldcTocNo, code).create(is_download)
    w.on('closed', () => {
    })
  }

  global.save_media = (path_local, url) => {
    setTimeout(() => {
      fs.mkdirSync(path.dirname(path_local), { recursive: true })
      media_downloader.add(path_local, url)
    }, 0)
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
