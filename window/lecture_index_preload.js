// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    console.log('completed: preload');
})

const {remote, contextBridge} = require('electron')
const path = require('path');
contextBridge.exposeInMainWorld(
    'app',
    {
        openView: (type, sbjtId, lectPldcTocNo, code) => {
            return remote.getGlobal('open_lecture_view')(type, sbjtId, lectPldcTocNo, code)
        },
        save: (dir, file) => {
            // Importing BrowserWindow using Electron remote
            const window = remote.getCurrentWindow();

            // Specifying the assets folder as the default path
            const filepathlocal = path.join(__dirname,
                ['../savedata', dir.replaceAll('/', '_'), file.replaceAll('/', '_')].join('/')
                + '.html');

            // Works for the Local Page
            return window.webContents.savePage(filepathlocal, 'HTMLComplete').then(() => {
                console.log('Page was saved successfully.')
            }).catch(err => {
                console.log(err);
            });
        }
    }
)
