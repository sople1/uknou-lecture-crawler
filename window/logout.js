const {BrowserWindow} = require('electron')
const path = require('path')

let parent = null
let url = 'https://ucampus.knou.ac.kr/ekp/user/login/retrieveULOLogout.do'

function set_parent (window) {
    parent = window

    return module.exports
}

function create () {
    // Create the browser window.
    const window = new BrowserWindow({
        width: 0,
        height: 0,
        frame: true,
        parent: parent,
        modal: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'logout_preload.js'),
            // nodeIntegration: true,
            // webSecurity: false
        }
    })

    window.removeMenu()

    // and load the index.html of the app.
    window.loadURL(url)

    window.once('ready-to-show', () => {
        window.setTitle('로그아웃')
        window.show()

        // Open the DevTools.
        // window.webContents.openDevTools()
    })

    return window
}

module.exports = {
    create: create,
    set_parent: set_parent
}