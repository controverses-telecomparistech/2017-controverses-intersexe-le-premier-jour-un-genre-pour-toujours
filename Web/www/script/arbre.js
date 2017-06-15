var container, globalImg, specImg, currentImg;
var x = 0;
var y = 0;
var zoom = 1;
var dragging = false;
var startX, startY;
var BASE_WIDTH = 1000;
var BASE_FONT_SIZE = 26;
var BUBBLES = [
    {cx: 500, cy : 130, rx : 180, ry : 120},
    {cx : 795, cy : 350, rx : 170, ry : 110},
    {cx : 185, cy : 335, rx : 180, ry : 100 }
];
var SMALL_BUBBLES = [
    {cx : 365, cy : 95, rx : 105, ry : 60},
    {cx : 642, cy : 93, rx : 112, ry : 60},
    {cx : 867, cy : 285, rx : 113, ry : 60},
    {cx : 806, cy : 447, rx : 110, ry : 57},
    {cx : 124, cy : 268, rx : 110, ry : 58},
    {cx : 172, cy : 434, rx : 105, ry : 55},
]
var BIG_BUBBLES_NB = 3;
var SMALL_BUBBLES_NB = 6;


$(document).ready(function() {
   container = $("#container");
   globalImg = $("#global-img");
   specImg = $("#spec-img");
   currentImg = globalImg;
   var w = $(document.body).width() - 20;
   container.width(w);
   $("#container img").width(w); 
   
   container.on("mousewheel", function(e){
       e.stopPropagation();
       e.preventDefault();
       e.stopImmediatePropagation();
       zoomImgAt(currentImg, (1 + e.originalEvent.wheelDelta/1200), e.offsetX, e.offsetY, false);
   })
   
   globalImg.click(function(e){
       //console.log(e);
   });
   
   container.on("mousedown", function(e){
       dragging = true;
       startX = e.clientX;
       startY = e.clientY;
   });
   
   $("body").on("mouseup", function(e){
       dragging = false;
   });
   
   $("body").on("mousemove", function(e){
       if(dragging){
        var dx = e.clientX - startX;
        var dy = e.clientY - startY;
        startX = e.clientX;
        startY = e.clientY;
        dragImg(currentImg, dx, dy); 
        updateAllBubbleTexts();
       }
   });
   
   globalImg.click(function(e){
        var b = isMouseInABubble(e.offsetX , e.offsetY);
        if(b != -1) onBubbleClick(BUBBLES[b]);
   });
   
   specImg.click(function(e){
       var b = isMouseInASmallBubble(e.offsetX, e.offsetY);
       showDebate(b);
   })
   
   globalImg.click(function(){
       showDebate(-1);
   })
   
   $(".debate").click(function(){
       console.log("click")
       showDebate(parseInt($(this).attr("num")));
   })
   
   specImg.mousemove(function(e){
        var b = isMouseInASmallBubble(e.offsetX, e.offsetY);
        hoverHandle(SMALL_BUBBLES, "small", b);
   });
   
   
    globalImg.on("mousemove", function(e){
        var b = isMouseInABubble(e.offsetX , e.offsetY)
        hoverHandle(BUBBLES, "label", b);
   });
   
   $(".small-label").click(function(e){
       showDebate( parseInt( e.target.id.slice(5) ) );
   })
   
   $(".bubble-label").click(function(e){
        var b = parseInt( e.target.id.slice(5) );
        if(b != -1) onBubbleClick(BUBBLES[b]);
   })
   
   updateAllBubbleTexts();
   zoomImgAt(currentImg, 1, 0, 0, false);
   
});

function hoverHandle(bubbles, labelName, b){
    if(b != -1){
        if(!bubbles[b].mousein) hoverText($("#"+labelName+b), true);
        bubbles[b].mousein = true;
    }
    else{
        for(var i=0; i<bubbles.length; i++){
            if(bubbles[i].mousein) hoverText($("#"+labelName+i), false);
            bubbles[i].mousein = false;
        }
    }
}

function hoverText(elt, hover){
    if(hover){
        elt.css("text-shadow", "0px 0px 8px purple");
        container.css("cursor", "pointer");
    } 
    else{
        elt.css("text-shadow", "");
        container.css("cursor", "");
    } 
}

function isMouseInABubble(mx, my){
    var imgx = mx/ zoom;
    var imgy = my / zoom;
    for(var i=0; i<BUBBLES.length; i++){
        if(isPointInBubble(imgx, imgy, BUBBLES[i])) return i;
    }
    return -1;
}

function showDebate(b){
    console.log("show "+b);
    for(var i=0; i<SMALL_BUBBLES_NB; i++){
        if(b != i) $("#d"+i).animate({"left" : "100%"}, 1000)
    }
    if(b != -1) $("#d"+b).animate({"left" : "40%"}, 1000);
}

function isMouseInASmallBubble(mx, my){
    var imgx = mx/ zoom;
    var imgy = my / zoom;
    for(var i=0; i<SMALL_BUBBLES_NB; i++){
        if(isPointInBubble(imgx, imgy, SMALL_BUBBLES[i])) return i;
    }
    return -1;
}

function updateAllBubbleTexts(){
    for(var i=0; i<BUBBLES.length; i++){
        updateBubbleText(BUBBLES[i], $("#label"+i), BASE_FONT_SIZE);
    }
    for(var i=0; i<SMALL_BUBBLES_NB; i++){
        updateBubbleText(SMALL_BUBBLES[i], $("#small"+i), BASE_FONT_SIZE*1/2);
    }
}

function zoomImgAt(img, factor, mx, my, imgNotTargeted){
    var imgx = (mx - x*imgNotTargeted)/ zoom;
    var imgy = (my - x*imgNotTargeted)/zoom;
    updateAllBubbleTexts();
    if(zoom < 2 && zoom * factor >= 2) changeImg(true);
    if(zoom >= 2 && zoom * factor < 2) changeImg(false);
    zoom *= factor;
    if(zoom < 0.6) zoom = 0.6;
    if(zoom > 4) zoom = 4; 
    var dx = Math.round(parseInt(img.css("width")) - BASE_WIDTH*zoom);
    globalImg.css("width", BASE_WIDTH*zoom);
    specImg.css("width", BASE_WIDTH*zoom);
    x += dx * imgx / BASE_WIDTH;
    y += dx * imgy / BASE_WIDTH;
    globalImg.css("left", x);
    globalImg.css("top", y);
    specImg.css("left", x);
    specImg.css("top", y);
    updateAllBubbleTexts();
}

function changeImg(zoomIn){
    currentImg.fadeOut(1200);
    if(zoomIn){
        currentImg = specImg;
        for(var i=0; i<BIG_BUBBLES_NB; i++){
            $("#label"+i).fadeOut(1200);
        }
        for(var i=0; i<SMALL_BUBBLES_NB; i++){
            $("#small"+i).fadeIn(700);
        }
    }
    else{
        currentImg = globalImg;
        for(var i=0; i<BIG_BUBBLES_NB; i++){
            $("#label"+i).fadeIn(700);
        }
        for(var i=0; i<SMALL_BUBBLES_NB; i++){
            $("#small"+i).fadeOut(1200);
        }
    }
    currentImg.fadeIn(700);
} 

function dragImg(img, dx, dy){
    x += dx;
    y += dy;
    $(img).css("left", x);
    $(img).css("top", y);

}

function isPointInBubble(x, y, bubble){
    x -= bubble.cx;
    y -= bubble.cy;
    x /= bubble.rx;
    y /= bubble.ry;
    return (x*x + y*y)<1.05;
}

function updateBubbleText(bubble, bubbleText, fontSize){
    bubbleText.css("font-size", fontSize*zoom);
    var h = bubbleText.height();
    var w = bubbleText.width();
    bubbleText.css("left", x + bubble.cx*zoom - w / 2);
    bubbleText.css("top", y + bubble.cy*zoom - h / 2);
}

function onBubbleClick(bubble){
    zoomImgAt(globalImg, 2.1/zoom, bubble.cx*zoom, bubble.cy*zoom, false);
}