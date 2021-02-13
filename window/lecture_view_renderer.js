// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

$(function () {
    setTimeout(() => {
        // iframe to video tag
        $('iframe').each((index, elem) => {
            try {
                let video_src = $(elem).contents().find('video').attr('src');
                $(elem).replaceWith($('<video></video>').attr('src', video_src).attr('controls', true));
            } catch (e) {
                console.log(e);
            }
        });
    }, 1000)

    $('div.header-title button').remove();
    $('a.gotoTop').parent().remove();

    show_save_button();

})


function show_save_button () {
    let $container = $('<div></div>').addClass('save-button-container').css({
        'position': 'fixed',
        'top': '10px',
        'right': '10px',
        'z-index': '999999'
    }).appendTo($('header'));

    let $save = $('<button>저장</button>').css({
        'font-size': '24px'
    }).on('click', () => {
        $(this).parent().remove();
        do_save();
    }).appendTo($container)

    return $container;
}

function do_save(is_close) {
    let waiter = setInterval(() => {
        if ($('iframe[id^=ifrmVODPlayer]').length < 1) {
            clearInterval(waiter);
            window.app.save($('h4.header-subject').text().trim(), $('h2.header-weekly').text().trim())
                .then(() => {
                    let $buttons = show_save_button();
                    let $msg = $('<span>다운로드 완료</span>').prependTo($buttons);

                    setTimeout(() => { $msg.remove() }, 5000);

                    if (typeof(is_close) !== "undefined" && is_close) {
                        window.close()
                    }
                });
        }
    }, 1000);
}
