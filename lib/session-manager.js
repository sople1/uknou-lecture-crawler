const path = require('path')
const fs = require('fs')

let ses = null

let cookie = {
    default_url: 'https://ucampus.knou.ac.kr/',
    store_file: 'userdata/cookie.dat',
    load: () => {
        try {
            let data = fs.readFileSync(cookie.store_file, 'utf-8')
            let parsed = JSON.parse(data)
            for (let i in parsed) {
                let p = parsed[i]
                p.url = cookie.default_url
                ses.cookies.set(p)
                    .then(() => {
                        // success
                        console.log('success: load cookies')
                    }, (error) => {
                        console.error('failed: set cookies', error)
                    })
            }
        } catch (e) {

            console.log('failed: load cookies', e)
        }
    },
    save: () => {
        ses.cookies.get({ url: cookie.default_url })
            .then((cookies) => {
                let cookies_filtered = []
                for (let i in cookies) {
                    let names = [
                        'LENA-UID', 'WMONID', 'JSESSIONID',
                        'knoucommon1', 'knoucommon2',
                        'knoustudent', 'knouName', 'knouUknouID'
                    ]
                    if (names.indexOf(cookies[i].name) > -1) {
                        cookies_filtered.push(cookies[i])
                    }
                }
                cookies = cookies_filtered

                try {
                    fs.writeFileSync(cookie.store_file, JSON.stringify(cookies), 'utf-8')
                } catch (e) {
                    console.log('failed: save cookies', e)
                }
                // console.log(cookies)
            }).catch((error) => {
                console.log('failed: get cookies', error)
            })
    },
    autosave: (ms) => {
        setTimeout(() => {
            cookie.save()
        }, ms)
    }
}

function init () {
    cookie.store_file = path.join(global.app_path, cookie.store_file)
    if (!fs.existsSync(cookie.store_file)) {
        fs.mkdir(path.dirname(cookie.store_file), { recursive: true }, (err) => {
            if (err) throw err;
        })
    }

    return module.exports
}

function set_session (session) {
    ses = session
}

module.exports = {
    init: init,
    set_session: set_session,
    cookie: cookie
}
