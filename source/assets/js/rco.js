
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
        console.log($(this).attr('data-pinyin'));
        $('#wordbox').hide();
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

$('body').mousemove(function( event ) {
  $('#wordbox').css({left: event.pageX+ 3, top: event.pageY+ 3});
});

