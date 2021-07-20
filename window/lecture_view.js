const {BrowserWindow} = require('electron')
const path = require('path')
const fs = require('fs')

let parent = null
let sbjtId = null
let lectPldcTocNo = null
let code = null
let urls = [
    'https://ucampus.knou.ac.kr/ekp/app/study/retrieveUSTStudy.do',
    'https://ucampus.knou.ac.kr/ekp/app/study/retrieveUSTStudyTmp.do'
]
let url = urls[0]
let code_types = ['pAtlcNo', 'pTmpCode']
let code_type = code_types[0]

function set_parent (window) {
    parent = window

    return module.exports
}
function set_key (type, o_sbjtId, o_lectPldcTocNo, o_code) {
    sbjtId = o_sbjtId
    lectPldcTocNo = o_lectPldcTocNo
    code = o_code

    if (type == "tmp") {
        url = urls[1]
        code_type = code_types[1]
    }

    return module.exports
}

function create (is_download) {
    // Create the browser window.
    const window = new BrowserWindow({
        width: 1005,
        height: 900,
        frame: true,
        parent: parent,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'lecture_view_preload.js'),
            nodeIntegration: true,
            webSecurity: false,
            contextIsolation: true,
            enableRemoteModule: true,
        }
    })

    let postData = [{
        type: 'rawData',
        bytes: Buffer.from(`pSbjtId=${encodeURIComponent(sbjtId)}&${code_type}=${encodeURIComponent(code)}&pLectPldcTocNo=${encodeURIComponent(lectPldcTocNo)}`)
    }]

    // and load the index.html of the app.
    window.loadURL(url, {
        postData: postData,
        extraHeaders: "Content-Type: application/x-www-form-urlencoded"
    })

    window.once('ready-to-show', () => {
        let script_path = path.join(__dirname, 'lecture_view_renderer.js');
        let script_body = fs.readFileSync(script_path, 'utf8');
        window.webContents.on('did-finish-load', () => {
            window.webContents.executeJavaScript(script_body)

            if (typeof(is_download) !== "undefined" && is_download) {
                window.webContents.executeJavaScript('do_save(true)')
            } else {
                window.focus()
            }
        })

        window.setTitle('강의내용보기')
        window.show()

        // Open the DevTools.
        // window.webContents.openDevTools()

    })

    return window
}

module.exports = {
    create: create,
    set_parent: set_parent,
    set_key: set_key
}