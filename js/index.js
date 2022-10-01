var canvas;
var ctx;

var rightKey;
var leftKey;
var upKey;
var downKey;

var gameLoop;
var player;
var borders = [];

window.onload = function(){
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    setupInputs();

    player = new Player(25,645);

    // function Border(x,y,width,height,type){
    for (let i = 0; i < 6; i++){
        //borders.push(new Border(0 + 100*i,620,100,100,1));
    }
    //borders.push(new Border(0,520,100,100,2));
    borders.push(new Border(0,700,1280,20,1));
    borders.push(new Border(0,0,1280,20,1));
    borders.push(new Border(0,0,20,720,1));
    borders.push(new Border(1260,0,100,720,1));

    borders.push(new Border(320,165,10,220,1));
    borders.push(new Border(165,320,10,220,1));//v
    borders.push(new Border(75,75,10,220,1));//v
    borders.push(new Border(1000,50,10,220,1));//v
    borders.push(new Border(165,320,10,220,1));//v
    borders.push(new Border(1200,125,10,220,1));//v
    borders.push(new Border(1150,600,10,220,1));//v
    borders.push(new Border(630,500,10,220,1));//v
    borders.push(new Border(700,435,10,220,1));//v
    borders.push(new Border(430,400,10,220,1));//v
    borders.push(new Border(450,200,220,10,1));//h
    borders.push(new Border(625,415,220,10,1));//h
    borders.push(new Border(250,550,220,10,1));//h
    borders.push(new Border(800,500,220,10,1));//h
    borders.push(new Border(900,100,220,10,1));//h
    borders.push(new Border(700,250,220,10,1));//h
    borders.push(new Border(900,100,220,10,1));//h
    
    for(let i = 0; i < 3; i++){
        //borders.push(new Border(600,420 + 100*i,100,100,2));
    }

    gameLoop = setInterval(step, 1000/30);

    ctx.fillStyle = "white";
    ctx.fillRect(0,0,1280,720);


}

function step(){
    player.step();

    draw();
}

function draw(){
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,1280,720);

    player.draw();

    for(let i = 0; i < borders.length; i++){
        borders[i].draw();
    }
}

function setupInputs(){
    document.onkeydown = function(event){
        switch(event.keyCode)
                {
                    case 39:
                        rightKey = true;
                        break;
                    case 37:
                       leftKey = true;
                        break;
                    case 38:
                        upKey = true;
                        break;
                    case 40:
                        downKey = true;
                        break;
                }
    };
    document.onkeyup = function(event){
        switch(event.keyCode)
                {
                    case 39:
                        rightKey = false;
                        break;
                    case 37:
                       leftKey = false;
                        break;
                    case 38:
                        upKey = false;
                        break;
                    case 40:
                        downKey = false;
                        break;
                }
    };
}

function checkIntersection(r1,r2){
    if (r1.x >= r2.x + r2.width){
        return false;
    }
    else if (r1.x + r1.width <= r2.x){
        return false;
    }
    else if (r1.y >= r2.y + r2.height){
        return false;
    }
    else if (r1.y + r1.height <= r2.y){
        return false;
    }else{
        return true;
    }
}

