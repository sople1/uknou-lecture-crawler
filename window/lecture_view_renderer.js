// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

$(function () {
    replace_video_player();
    replace_audio_player();

    $('div.header-title button').remove();
    $('a.gotoTop').parent().remove();

    show_save_button();

})

function replace_video_player() {
    let selector = 'iframe[id^=ifrmVODPlayer]';
    let $iframe = $(selector);
    if ($iframe.length > 0) {
        setTimeout(() => {
            // iframe to video tag
            $iframe.each((index, elem) => {
                let $video = $(elem).contents().find('video');
                if ($video.length > 0)
                    $(elem).replaceWith($('<video></video>').attr('src', $video.attr('src')).attr('controls', true));
            });

            if ($(selector).length > 0) {
                replace_video_player();
            }
        }, 1000)
    }
}

function replace_audio_player() {
    let selector = 'iframe[id^=ifrmAODPlayer]';
    let $iframe = $(selector);
    if ($iframe.length > 0) {
        setTimeout(() => {
            // iframe to audio tag
            $iframe.each((index, elem) => {
                let $audio = $(elem).contents().find('audio');
                if ($audio.length > 0)
                    $(elem).replaceWith($('<audio></audio>').attr('src', $audio.attr('src')).attr('controls', true));
            });

            if ($(selector).length > 0) {
                replace_audio_player();
            }
        }, 1000)
    }
}

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
        if ($('iframe[id^=ifrmVODPlayer]').length < 1 && $('iframe[id^=ifrmAODPlayer]').length < 1) {
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
