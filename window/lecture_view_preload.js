// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.k/f
window.addEventListener('DOMContentLoaded', () => {
    console.log('completed: preload');
})

const {remote, contextBridge} = require('electron')
const fs = require('fs');
const path = require('path');
contextBridge.exposeInMainWorld(
    'app',
    {
        save: (dir, file) => {
            // Importing BrowserWindow using Electron remote
            const window = remote.getCurrentWindow();

            // Specifying the assets folder as the default path
            const dir_path_local = path.join(__dirname, '../savedata', dir.replaceAll('/', '_'), "강의");
            const file_path_local = path.join(dir_path_local, file.replaceAll('/', '_').replaceAll(':', '-').replaceAll('?', '？')+ '.html');
            const video_dir_path = path.join(dir_path_local, 'videos');

            // Works for the Local Page
            return window.webContents.savePage(file_path_local, 'HTMLComplete').then(() => {
                let html = fs.readFileSync(file_path_local, 'utf8');
                let video_re = /<video src="([^"]+)" controls="controls"><\/video>/gm;
                let m;

                do {
                    m = video_re.exec(html);
                    if (m) {
                        let video_url = m[1];
                        let o_url = new URL(video_url);
                        let video_path = o_url.pathname;
                        let video_path_local = path.join(video_dir_path, video_path);

                        remote.getGlobal('save_video')(video_path_local, video_url);

                        html = html.replaceAll(video_url, path.join('./videos', video_path));
                    }
                } while (m);

                try {
                    fs.writeFileSync(file_path_local, html, 'utf-8')
                } catch (e) {
                    console.log('failed: save html file', e)
                }

                console.log('Page was saved successfully.')
            }).catch(err => {
                console.log(err);
            });
        }
    }
)