// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    console.log('preload');
})

const Dialogs = require('dialogs')
const {remote, contextBridge} = require('electron')
contextBridge.exposeInMainWorld(
    'app',
    {
        dialogs: () => {
            return new Dialogs()
        },

        // Returns Promise<Cookie[]>
        cookies: () => {
            return remote.session.defaultSession.cookies.get({}).then((cookies) => {
                // console.log(cookies);
                return cookies
            }).catch((error) => {
                console.log('failed: get cookies', error)
            })
        },
        appPath: () => {
            return remote.getGlobal('app_path')
        },
        openLogin: () => {
            return remote.getGlobal('open_login')()
        },
        openLogout: () => {
            return remote.getGlobal('open_logout')()
        },
        openSearch: () => {
            return remote.getGlobal('open_search')()
        },
        openLectureByCode: (code) => {
            return remote.getGlobal('open_lecture_index')(code + '001', code)
        }
    }
)