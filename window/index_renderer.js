// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

$(function () {
    do_login_proc();
})

function do_login_proc () {
    window.app.cookies().then((cookies) => {
        let status = true
        let cookie_dic = {}
        let names = [
            'LENA-UID', 'WMONID', 'JSESSIONID',
            'knoucommon1', 'knoucommon2',
            'knoustudent', 'knouName', 'knouUknouID'
        ]

        for (let i in cookies) {
            let c = cookies[i]
            if (names.indexOf(c.name) > -1) {
                cookie_dic[c.name] = c.value
            }
        }

        if (Object.keys(cookie_dic).length != names.length)
            status = false

        set_status_msg(status, cookie_dic)
        make_button(status)
    })
}

function set_status_msg (status, data) {
    let $elem = $('div.status-login').empty()

    if (status) {
        $elem.append(`<p>로그인 되었습니다. ID: ${data['knouUknouID']}, 이름: ${decodeUnicode(data['knouName'])}</p>`)
    } else {
        $elem.append(`<p>로그인이 필요합니다.</p>`)
    }
}

function make_button (status) {
    let $elem = $('div.func-buttons').empty().css('display', 'block')

    switch (status) {
        case true:
            let $btn_logout = $('<button>로그아웃</button>').on('click', (e) => {
                e.preventDefault()
                window.app.openLogout()
            })
            $elem.append($btn_logout)
            break;
        case false:
        default:
            let $btn_login = $('<button>로그인</button>').on('click', (e) => {
                e.preventDefault()
                window.app.openLogin()
            })
            $elem.append($btn_login)
            break;
    }
}

function decodeUnicode (unicodeString) {
    let r = /\\u([\d\w]{4})/gi;
    unicodeString = unicodeString.replace(
        r,
        (match, grp) => String.fromCharCode(parseInt(grp, 16))
    );

    return unescape(unicodeString);
}