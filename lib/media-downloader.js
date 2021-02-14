const fs = require('fs');
const https = require('https');
const path = require('path');
const url = require('url');

let refresh_interval = 5000
let download = {
    limit: 20,
    queue: [],
    status: [],
    set_status: (idx, data) => {
        download.status[idx] = {
            'path': data.path,
            'url':  data.url,
            'remote_size': data.remote_size,
            'downloaded': (typeof(data.downloaded) !== 'undefined') ? data.downloaded : 0
        }
    },
    end_status: (idx) => {
        download.status[idx] = null
    }
}
let screen = (msg) => { console.log(msg) }

function set_screen (o_callback) {
    screen = o_callback

    return module.exports
}

function add_queue (path, url) {
    check_file(path, url)
}

function check_file (path, url) {
    if (!fs.existsSync(path)) {
        download.queue.push({
            'path': path,
            'url': url
        })

        return 0;
    }

    let stats = fs.statSync(path)
    let request = https.get(url, (response) => {
        if (stats.size != response.headers['content-length']) {
            download.queue.push({
                'path': path,
                'url': url
            })
        }
    }).on('error', () => {
        setTimeout(() => {
            check_file (path, url)
        }, 30000)
    })

    return 0;
}

function download_file (idx, path, url) {
    let file = fs.createWriteStream(path)
    let status = {
        'path': path,
        'url':  url,
        'remote_size': 0,
        'downloaded': 0
    }
    download.set_status(idx, status)

    let request = https.get(url, (response) => {
        status.remote_size = response.headers['content-length'];
        download.set_status(idx, status)

        response.pipe(file);
        response.on('data', (chunk) => {
            status.downloaded += chunk.length
            download.set_status(idx, status)
        }).on('end', () => {
            download.end_status(idx)
        })
    }).on('error', () => {
        download.queue.push({
            'path': path,
            'url': url
        })
        download.end_status(idx)
    })

    file.on('end', () => {
        file.close()
        download.end_status(idx)
    })
}

function run_queue() {
    let intval = setInterval(() => {
        if (download.status.length == 0) {
            download.status = Array.from({length: download.limit}, () => null)
        }

        let scr = []
        scr.push(`대기열 남은 양: ${download.queue.length}개`)

        for (let i in download.status) {
            if (download.status[i] == null) {
                scr.push(`슬롯[${i}]: null`)
                if (download.queue.length > 0) {
                    let data = download.queue.shift()
                    download_file(i, data.path, data.url)
                }
                continue
            }

            let status = download.status[i]
            let percent = ( status.downloaded / status.remote_size * 100 ).toFixed(2)
            let rpath = decodeURIComponent(
                url.pathToFileURL(status.path).toString()
                    .replace(
                        url.pathToFileURL(path.join(__dirname, '../')).toString()
                            , '')
            )

            scr.push(`슬롯[${i}]: (${percent}%) | ${rpath} | ${status.downloaded}/${status.remote_size}`)
        }

        screen(scr.join("\n"))

    }, refresh_interval)
}

module.exports = {
    'add': add_queue,
    'run': run_queue,
    'set_screen': set_screen
}