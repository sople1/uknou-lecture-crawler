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
        openViewForDownload: (type, sbjtId, lectPldcTocNo, code) => {
            return remote.getGlobal('open_lecture_view')(type, sbjtId, lectPldcTocNo, code, true)
        },
        save: (dir, file) => {
            // Importing BrowserWindow using Electron remote
            const window = remote.getCurrentWindow();

            // Specifying the assets folder as the default path
            const dir_path_local = path.join(remote.getGlobal('app_path'), 'savedata', dir.replaceAll('/', '_'));
            const file_path_local = path.join(dir_path_local, file.replaceAll('/', '_') + '.html');

            // Works for the Local Page
            return window.webContents.savePage(file_path_local, 'HTMLComplete').then(() => {
                console.log('Page was saved successfully.')
            }).catch(err => {
                console.log(err);
            });
        }
    }
)
