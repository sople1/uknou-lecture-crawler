const fs = require('fs');
const https = require('https');
const path = require('path');

let data_root_path = path.join( __dirname, 'savedata');
let media_host = "https://sdn.knou.ac.kr"

let download = {
    limit: 30,
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

function root_dir() {
    fs.readdirSync(data_root_path).forEach((item)=> {
        let current_path = path.join(data_root_path, item)
        lecture_dir(current_path, 'videos')
        lecture_dir(current_path, 'audios')
    })

}

function lecture_dir(content_path, type) {
    let media_dir = path.join(content_path, '강의', type)

    if (!fs.existsSync(media_dir))
        return;

    data_dir(media_dir, null)
}

function data_dir(parent_path, parent_url) {
    fs.readdirSync(parent_path).forEach((item) => {
        let current_path = path.join(parent_path, item)
        let current_url = [parent_url, item].join('/')
        if (fs.lstatSync(current_path).isDirectory()) {
            return data_dir(current_path, current_url)
        }

        return check_file(current_path, current_url)
    })
}

function check_file (path, rurl) {
    let stats = fs.statSync(path)
    let url = [media_host, rurl].join('')
    let request = https.get(url, (response) => {
        if (stats.size != response.headers['content-length']) {
            download.queue.push({
                'path': path,
                'rurl': rurl
            })
        }
    }).on('error', () => {
        setTimeout(() => {
            check_file (path, rurl)
        }, 30000)
    })
}

function download_file (idx, path, rurl) {
    let file = fs.createWriteStream(path)
    let url = [media_host, rurl].join('')
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
        download.end_status(idx)
        download.queue.push({
            'path': path,
            'rurl': rurl
        })
    })

    file.on('end', () => {
        file.close()
        download.end_status(idx)
    })
}

function run_download_queue() {
    let intval = setInterval(() => {
        if (download.status.length == 0) {
            download.status = Array.from({length: download.limit}, () => null);
        }

        let null_count = 0;

        console.log(`queue.length: ${download.queue.length}`)
        for (let i in download.status) {
            if (download.status[i] == null) {
                console.log(`status[${i}]: null`)
                if (download.queue.length > 0) {
                    let data = download.queue.shift()
                    download_file(i, data.path, data.rurl)
                }
                null_count = null_count + 1
                continue
            }

            let status = download.status[i]
            let percent = ( status.downloaded / status.remote_size * 100 ).toFixed(2)

            console.log(`status[${i}]: ${status.url} => ${status.path}, ${status.downloaded}/${status.remote_size} (${percent}%)`)
        }
        console.log('\n')

        if (download.queue.length < 1 && null_count == download.limit) {
            clearInterval(intval);
            return 0;
        }

    }, 5000)
}

function main() {
    root_dir()
    run_download_queue()
}

if (typeof require !== 'undefined' && require.main === module) {
    main()
}