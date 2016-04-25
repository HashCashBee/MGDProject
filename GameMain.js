var context, tileSet,
    TILE_SIZE = 32,
    NUM_ROWS = 30,
    NUM_COLS = 40, sheep, wolf;

var fps = 10;
var then = Date.now();
var interval = 1000/fps;

var Key = {
    _pressed:{},
    LEFT: 37,
    UP: 38,
    RIGHT:39,
    DOWN:40,
    isDown: function(keyCode){
        return this._pressed[keyCode];
    },
    onKeydown: function(event){
        this._pressed[event.keyCode] = true;
    },
    onKeyup: function(event){
        delete this._pressed[event.keyCode];
    }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event);}, false);
window.addEventListener('keydown', function(event){ Key.onKeydown(event);}, false);

window.onload = function(){
    context = document.getElementById("canvas").getContext("2d");
    LoadAssets();
};

function LoadAssets(){
    tileSet = new TileSet(NUM_ROWS, NUM_COLS, TILE_SIZE);
    sheep = new Player(13, 5, true);
    wolf = new Player(20, 20, false);
    sheep.load("images/sheep-sprite.png");
    wolf.load("images/wolf-sprite.png");
    tileSet.loadTiles("images/sheep_tileset.png", gameLoop);
}

function drawPlayers(context){
    sheep.draw(context);
    wolf.draw(context);
}

function gameLoop(){
    var now = Date.now();
    var delta = now - then;
    if(delta > interval) {
        sheep.update();
        wolf.update();
        tileSet.draw(context);
        drawPlayers(context);
        then = now - (delta % interval)
    }
    requestAnimationFrame(gameLoop);
}





