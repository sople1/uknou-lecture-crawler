// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    // 로그인 화면 체크
    if ($('#content .container .login-box').length < 1) {
        window.close();
    }
    
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
            )
            .append($('form#loginForm'))
    );
    $('h1.logo a').attr('href', '#');
    $('#content').css('min-height', 'auto');
    $('#content .container').css({
        'width': 'auto',
        'min-width': 'auto',
        'max-width': 'auto'
    });
    $('#content .container .login-box').css('padding', '10px 0');
    $('#content .container .login-box a')

    $('#content .container .login-box').on('click', 'a[href^="/ekp/"]', (event) => {
        event.preventDefault();
        let link = event.target.href;
        require("electron").shell.openExternal(link);
        setTimeout(() => {alert("이 링크는 새로운 창으로 열립니다.")}, 0);
    });

    $('#content .container .login-box').find('input:text').focus();

    console.log('completed: preload');
})
