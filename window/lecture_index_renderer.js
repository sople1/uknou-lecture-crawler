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
})
