// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    console.log('completed: preload');
})

const {remote, contextBridge} = require('electron')
contextBridge.exposeInMainWorld(
    'app',
    {
        openLecture: (sbjtId, cntsId) => {
            return remote.getGlobal('open_lecture_index')(sbjtId, cntsId)
        }
    }
)