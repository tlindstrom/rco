var TOUCH_DETECTED = false;

var rco = {
    // pronounce a Chinese phrase using the browser text to speech API
    pronounce(phrase) {
        var msg = new SpeechSynthesisUtterance(phrase);
        msg.lang = 'zh-CH';
        msg.rate = 0.8
        window.speechSynthesis.speak(msg);
    }
}

$(document).ready(function(){

    document.body.addEventListener('touchstart', function () {
        TOUCH_DETECTED = true;
    });
    

    $('#script-button-traditional').off('click').on('click', function() {
        window.localStorage.setItem('rcoScript', 'traditional');
        location.reload();
    });
    $('#script-button-simplified').off('click').on('click', function() {
        window.localStorage.setItem('rcoScript', 'simplified');
        location.reload();
    });

    // simplify words
    if (window.localStorage.getItem('rcoScript') == 'simplified') {

        $('#script-button-simplified').addClass('chosen');

        $('[data-word]').each(function(){
            $(this).html( toSimp( $(this).html() ) );
        });
    } else {
        $('#script-button-traditional').addClass('chosen');
    }
    
    $('body').show();


    function openWordbox(element) {
        let chinese = element.html();
        let pinyin  = element.attr('data-pinyin');
        let meaning = element.attr('data-meaning');

        $('#wordbox').find(".chinese").html(chinese);
        $('#wordbox').find(".pinyin").html(pinyin);
        $('#wordbox').find(".meaning").html(meaning);

        if (TOUCH_DETECTED){
            $('#wordbox').find(".controls").html('');

            let listenButton = $(`<button><i class="fas fa-fw fa-volume-up"></i></button>`);
            listenButton.off('click').on('click', () => { rco.pronounce(chinese) });
            $('#wordbox').find(".controls").append(listenButton);

            console.log(element);

            if (element.attr('data-wordpage')){
                let wordPageButton = $(`<button><i class="fas fa-fw fa-book"></i></button>`);
                wordPageButton.off('click').on('click', () => { window.location = PREFIX + '/words/' + element.attr('data-wordpage') + '.html' });
                $('#wordbox').find(".controls").append(wordPageButton);
            }            
        }


        $('#wordbox').show();
    }

    $('[data-word]').each(function(){
        $(this).mouseenter(function(){
            openWordbox($(this));
        });

        $(this).mouseleave(function(){
            if (!TOUCH_DETECTED)
                $('#wordbox').hide();
        });

        $(this).click(function(){
            if (!TOUCH_DETECTED && $(this).attr('data-wordpage'))
                window.location = PREFIX + '/words/' + $(this).attr('data-wordpage') + '.html';
        });

        $(this).contextmenu(function(e){
            let wordElement = $(this);

            $('#word-dropdown').css({ left: e.pageX-5, top: e.pageY-5 });
            $('#word-dropdown').show();

            // listening to word
            $('#word-dropdown #listen-to-word').off('click').on('click', function() {
                rco.pronounce(wordElement.text());
                $('#word-dropdown').hide();
            });

            // if parent element has 'data-sentence' attribute, make listening to sentence possible
            if (wordElement.parent().parent().get(0).hasAttribute("data-sentence")){
                $('#word-dropdown #listen-to-sentence').off('click').on('click', function() {
                    rco.pronounce(wordElement.parent().parent().text());
                    $('#word-dropdown').hide();
                });
                $('#word-dropdown #listen-to-sentence').show();
            } else {
                $('#word-dropdown #listen-to-sentence').hide();
            }
            
            // if there's a word page, add the 'learn more' button
            if ($(this).attr('data-wordpage')){
                $('#word-dropdown #learn-more').attr('href', PREFIX + '/words/' + $(this).attr('data-wordpage') + '.html');
                $('#word-dropdown #learn-more').show();
            } else {
                $('#word-dropdown #learn-more').hide();
            }

            e.preventDefault();
            // return false to block the standard context menu
            return false;
        });
    });
    $(document).click(function() {
        $('#word-dropdown').hide();
    });

    // automatically assign highlight values to parallel text sentences
    let highlightCount = 0;
    $('.ptext tr').each(function(){
        let highlightCountCopy = highlightCount;
        $(this).children().eq(0).children().each(function(){
            $(this).attr('data-highlight', highlightCountCopy++);
        });
        $(this).children().eq(1).children().each(function(){
            $(this).attr('data-highlight', highlightCount++);
        });
    });






    $('[data-highlight]').each(function(){
        let highlightId = $(this).attr('data-highlight');
        
        $(this).mouseenter(function(){
            $('[data-highlight=' + highlightId +']').each(function(){
                $(this).addClass('highlighted');
            });
        });

        $(this).mouseleave(function(){
            $('[data-highlight=' + highlightId +']').each(function(){
                $(this).removeClass('highlighted');
            });
        });

    });

    $(document).mousemove(function(e) {
        $('#wordbox').css({left: e.pageX, top: e.pageY });
    });

    // top menu show and hide stuff
    $('#home-button').mouseenter(function(){
        $('.top-bar-links').show();
    });
    $('#home-button').click(function(){
        $('.top-bar-links').show();
    });
    $(document).click(function(e){
        if (!$(e.target).is('#home-button')){
            $('.top-bar-links').hide();
        }
    });








});