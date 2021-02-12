const {BrowserWindow} = require('electron')
const path = require('path')

function create () {
    // Create the browser window.
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        frame: true,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'index_preload.js'),
            nodeIntegration: true,
            // webSecurity: false
            contextIsolation: true,
            enableRemoteModule: true,
        }
    })

    // and load the index.html of the app.
    window.loadFile('window/index.html')

    window.once('ready-to-show', () => {
        window.show()

        // Open the DevTools.
        window.webContents.openDevTools()
    })


    return window
}

module.exports = {
    create: create
}