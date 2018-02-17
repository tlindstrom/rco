let rco = {
    // pronounce a Chinese phrase using the browser text to speech API
    pronounce(phrase) {
        var msg = new SpeechSynthesisUtterance(phrase);
        msg.lang = 'zh-CH';
        msg.rate = 0.8
        window.speechSynthesis.speak(msg);
    }
}

$(document).ready(function(){
    // simplify words
    if (window.localStorage.getItem('rcoScript') == 'simplified') {
        $('[data-word]').each(function(){
            $(this).html( toSimp( $(this).html() ) );
        });

        $('#script-button').text('SIMPLIFIED');
        $('#script-button').off('click').on('click', function() {
            window.localStorage.setItem('rcoScript', 'traditional');
            location.reload();
        });
    } else {
        $('#script-button').text('TRADITIONAL');
        $('#script-button').off('click').on('click', function() {
            window.localStorage.setItem('rcoScript', 'simplified');
            location.reload();
        });
    }
    
    $('body').show();




    $('[data-word]').each(function(){
        $(this).mouseenter(function(){

            let chinese = $(this).html();
            let pinyin  = $(this).attr('data-pinyin');
            let meaning = $(this).attr('data-meaning');

            $('#wordbox').find("#chinese").html(chinese);
            $('#wordbox').find("#pinyin").html(pinyin);
            $('#wordbox').find("#meaning").html(meaning);
            $('#wordbox').show();

        });

        $(this).mouseleave(function(){
            $('#wordbox').hide();
        });

        $(this).contextmenu(function(){
            let wordElement = $(this);

            $('#word-dropdown').css({ left: event.pageX-5, top: event.pageY-5 });
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

            // return false to block the standard context menu
            return false;
        });
    });
    $(document).click(function() {
        $('#word-dropdown').hide();
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

    $(document).mousemove(function( event ) {
    $('#wordbox').css({left: event.pageX, top: event.pageY });
    });








});