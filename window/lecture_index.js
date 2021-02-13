const {BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')

let parent = null
let sbjtId = null
let cntsId = null
let url = 'https://ucampus.knou.ac.kr/ekp/user/course/initUCRCourse.sdo'

function set_parent (window) {
    parent = window

    return module.exports
}
function set_key (o_sbjtId, o_cntsId) {
    sbjtId = o_sbjtId
    cntsId = o_cntsId

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
            preload: path.join(__dirname, 'lecture_index_preload.js'),
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: true,
            enableRemoteModule: true,
        }
    })

    // and load the index.html of the app.
    window.loadURL(`${url}?sbjtId=${sbjtId}&cntsId=${cntsId}`)

    window.once('ready-to-show', () => {
        let script_path = path.join(__dirname, 'lecture_index_renderer.js');
        let script_body = fs.readFileSync(script_path, 'utf8');
        window.webContents.on('did-finish-load', () => {
            window.webContents.executeJavaScript(script_body)
        })

        window.setTitle('강의보기')
        window.show()

        // Open the DevTools.
        // window.webContents.openDevTools()

        window.focus()
    })

    return window
}

module.exports = {
    create: create,
    set_parent: set_parent,
    set_key: set_key
}