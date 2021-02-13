// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

$(function () {
    // UI 조정
    $('body').replaceWith(
        $('<body></body>')
            .addClass('desktop')
            .prepend(
                $('<header id="header"></header>')
                    .css({
                        'height': '42px',
                        'margin': '10px'
                    })
                    .append($('h1.logo'))
                    .append($('div.search'))
            )
            .append($('form#frm'))
            .append($('div#content'))
    );
    $('div#content .top-img').remove()

    $('h1.logo a').attr('href', '#');
    $('#content').css('min-height', 'auto');
    $('#content .container').css({
        'width': 'auto',
        'min-width': 'auto',
        'max-width': 'auto'
    });


    fnCntsPopup = (sbjtId, lectPldcTocNo, atlcNo) => {
        window.app.openView(null, sbjtId, lectPldcTocNo, atlcNo)
    }

    fnCntsTmpPopup = (sbjtId, lectPldcTocNo, tmpCode) => {
        window.app.openView('tmp', sbjtId, lectPldcTocNo, tmpCode)
    }

    fnCntsPopupForDown = (sbjtId, lectPldcTocNo, atlcNo) => {
        window.app.openView(null, sbjtId, lectPldcTocNo, atlcNo)
    }

    fnCntsTmpPopupForDown = (sbjtId, lectPldcTocNo, tmpCode) => {
        window.app.openView('tmp', sbjtId, lectPldcTocNo, tmpCode)
    }

    show_save_button();
})


function show_save_button () {
    let if_lecture_list = (window.location.pathname === "/ekp/user/lecture/retrieveUCRLecture.do");

    let $container = $('<div></div>').addClass('save-button-container').css({
        'position': 'fixed',
        'top': '10px',
        'right': '10px',
        'z-index': '999999'
    }).appendTo($('header'));

    if (if_lecture_list) {
        let $save_lecture_all = $('<button>강의 전부 다운로드</button>').css({
            'font-size': '24px'
        }).on('click', () => {
            $('a.lecture-crawl-download').click();
        }).appendTo($container);
    }

    let $save = $('<button>저장</button>').css({
        'font-size': '24px'
    }).on('click', () => {
        $save.parent().remove();
        do_save();
    }).appendTo($container);

    if (if_lecture_list) {
        $('div.lecture-content-item').removeClass('inactive');
        $('div.lecture-content-item-body').slideDown();

        let $alist = $('div.lecture-btns').find('a[onclick^=fnCnts]');
        for (let i in $alist) {
            let $a = $($alist[i]).clone();
            $a.attr('onclick', $a.attr('onclick').replace("Popup('", "PopupForDown('"))
                .text('다운로드')
                .addClass('lecture-crawl-download');
            $a.appendTo($($alist[i]).parent());
        }
    }

    return $container;
}

function do_save() {
    $('a.lecture-crawl-download').remove();

    window.app.save($('h2.lecture-title').text().trim(), $('div.tab-menu li.active').text().trim())
        .then(() => {
            let $buttons = show_save_button();
            let $msg = $('<span>다운로드 완료</span>').prependTo($buttons);

            setTimeout(() => { $msg.remove() }, 5000);
        });
}