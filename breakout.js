
let board;
let boardwidth=500;
let boardheight=500;
let context;


let playerwidth=80;
let playerheight=10;
let playervelocityX=25;

let player= {
    x: boardwidth/2 - playerwidth/2,
    y: boardheight - playerheight-5,
    width:playerwidth,
    height:playerheight,
    velocityX: playervelocityX
}


let ballwidth=10;
let ballheight=10;
let ballvelocityX=3;
let ballvelocityY=2;

let ball= {
    x: boardwidth/2,
    y: boardheight/2,
    width: ballwidth,
    height: ballheight,
    velocityX: ballvelocityX,
    velocityY: ballvelocityY
}


let blockarray=[];
let blockwidth=50;
let blockheight=10;
let blockcolumns=8;
let blockrow=3;
let blockmaxrows=10;
let blockcount=0;


let blockX=15;
let blockY=45;

let score=0;
let gameover=false;

window.onload= function(){
    board=document.getElementById("board");
    board.height=boardheight;
    board.width=boardwidth;
    context=board.getContext("2d");

    context.fillstyle='grey';
    context.fillRect(player.x, player.y, player.width, player.height)
    
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveplayer);

    createblocks(); 
}


function update(){
    requestAnimationFrame(update);
    if(gameover){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);
    

    context.fillstyle="lightgreen";
    context.fillRect(player.x, player.y, player.width, player.height);

    context.fillstyle="white";
    ball.x +=ball.velocityX;
    ball.y +=ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);


    if(ball.y<=0){

        ball.velocityY *=-1;
    }
    else if(ball.x<=0 || (ball.x+ball.width) >= boardwidth){

        ball.velocityX *=-1;
    }
    else if(ball.y+ball.height >= boardheight){

        context.font="20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameover=true;
        // ball.velocityY *=-1;
    }


    if(topcollision(ball, player) || bototmcollision(ball, player)){
        ball.velocityY *= -1;
    }
    else if(leftcollision(ball, player) || rightcollision(ball, player)){
        ball.velocityX *=-1;
    }

    context.fillstyle="skyblue";
    for(let i=0;i<blockarray.length;i++){
        let block=blockarray[i];
        if(!block.break){
            if(topcollision(ball, block) || bototmcollision(ball,block)){
                block.break=true;
                ball.velocityY *=-1;
                blockcount -=1;
                score+=50;
            }
            else if(leftcollision(ball, block) || rightcollision(ball, block)){
                block.break=true;
                ball.velocityX *=-1;
                block.count-=1;
                score+=50;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }
    if(blockcount==0){
        score+=100*blockrow*blockcolumns;
        blockrows=Math.min(blockrow+1, blockmaxrows);
        createblocks();
    }
    context.font="20px sans-serif";
    context.fillText(score, 10, 25);
}

function outofbounds(xposition){
    return(xposition < 0 || xposition + playerwidth > boardwidth);
}

function moveplayer(e){
    if(gameover){
        if(e.code == "Space"){
            resetgame();
        }
    }
    if(e.code=="ArrowLeft"){
        // player.x -= playervelocityX;
        let nextplayerX= player.x - player.velocityX;
        if(!outofbounds(nextplayerX)){
            player.x=nextplayerX;
        }
    }
    else if(e.code=="ArrowRight"){
        // player.x +=player.velocityX;
        let nextplayerX= player.x + player.velocityX;
        if(!outofbounds(nextplayerX)){
            player.x=nextplayerX;
        }
    }
}

function detectcollision(a, b){
    return  a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

function topcollision(ball, block){
    return detectcollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bototmcollision(ball, block){
    return detectcollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftcollision(ball, block){
    return detectcollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightcollision(ball, block){
    return detectcollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createblocks(){
    blockarray=[];
    for(let c=0;c<blockcolumns;c++){
        for(let r=0;r<blockmaxrows;r++){
            let block={
                x: blockX+c*blockwidth + c*10,
                y: blockY+r*blockheight + r*10,
                width: blockwidth,
                height: blockheight,
                break : false
            }
            blockarray.push(block);
        }
    }

    blockcount=blockarray.length;
}

function resetgame(){
    gameover=false;
    player= {
    x: boardwidth/2 - playerwidth/2,
    y: boardheight - playerheight-5,
    width:playerwidth,
    height:playerheight,
    velocityX: playervelocityX
    }

    ball= {
        x: boardwidth/2,
        y: boardheight/2,
        width: ballwidth,
        height: ballheight,
        velocityX: ballvelocityX,
        velocityY: ballvelocityY
    }
    blockarray=[];
    score=0;
    createblocks();

}