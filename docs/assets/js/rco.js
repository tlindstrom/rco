
// simplify words
$('[data-word]').each(function(){
    $(this).html( toSimp( $(this).html() ) );
});
$('body').show();

console.log('hello from rco.js');


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

        $('#word-dropdown #listen').off('click').on('click', function() {
            rco.pronounce(wordElement.html());
            $('#word-dropdown').hide();
        });

        if ($(this).attr('data-wordpage')){
            $('#word-dropdown #learn-more').attr('href', '/rco/words/' + $(this).attr('data-wordpage') + '.html');
            $('#word-dropdown #learn-more').show();
        } else {
            $('#word-dropdown #learn-more').hide();
        }

        // return false blocks the standard context menu
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






let rco = {


    // pronounce a Chinese phrase using the browser text to speech API
    pronounce(phrase) {
        var msg = new SpeechSynthesisUtterance(phrase);
        msg.lang = 'zh-CH';
        msg.rate = 0.8
        window.speechSynthesis.speak(msg);
    }
}