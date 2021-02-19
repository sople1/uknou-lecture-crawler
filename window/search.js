const {BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')

let parent = null
let url = 'https://ucampus.knou.ac.kr/ekp/user/total/initUTOTotalSrch.do'

function set_parent (window) {
    parent = window

    return module.exports
}

function create () {
    // Create the browser window.
    const window = new BrowserWindow({
        width: 1280,
        height: 800,
        frame: true,
        parent: parent,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'search_preload.js'),
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: true,
            enableRemoteModule: true,
        }
    })

    // and load the index.html of the app.
    window.loadURL(url)

    window.once('ready-to-show', () => {
        let script_path = path.join(__dirname, 'search_renderer.js');
        let script_body = fs.readFileSync(script_path, 'utf8');
        window.webContents.on('did-finish-load', () => {
            window.webContents.executeJavaScript(script_body)
        })

        window.setTitle('강의찾기')
        window.show()

        // Open the DevTools.
        // window.webContents.openDevTools()

        window.focus()
    })

    return window
}

module.exports = {
    create: create,
    set_parent: set_parent
}