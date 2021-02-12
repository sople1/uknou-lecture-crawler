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
    let $status = $('div.status-login')

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


        if (status) {
            $status.empty().append(`<p>로그인 되었습니다. ID: ${cookie_dic['knouUknouID']}, 이름: ${decodeUnicode(cookie_dic['knouName'])}</p>`)
        } else {
            $status.empty().append(`<p>로그인이 필요합니다.</p>`)
        }


    })
}
function decodeUnicode (unicodeString) {
    let r = /\\u([\d\w]{4})/gi;
    unicodeString = unicodeString.replace(
        r,
        (match, grp) => String.fromCharCode(parseInt(grp, 16))
    );

    return unescape(unicodeString);
}