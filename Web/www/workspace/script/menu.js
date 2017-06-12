$(document).ready(function() {
    var menu = $('.menu'),
        ltpos = 20 - menu.width();
    menu.css({ left:ltpos});
    menu.hover(function() {
        menu.stop().animate({ left:'0px' }, 500);
    }, function() {
        menu.stop().animate({ left:ltpos + 'px' }, 500);
    });
}); 