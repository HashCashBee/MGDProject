var context, tileSet,
    TILE_SIZE = 32,
    NUM_ROWS = 30,
    NUM_COLS = 40, sheep, wolf;

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

function Player(x, y, playable){
    this.x = x;
    this.y = y;
    this.playable = playable;
}

Player.prototype.load = function(img_file){
    this.image = new Image();
    this.image.src = img_file;
};

Player.prototype.update = function(){
    if(this.playable) {
        if (Key.isDown(Key.UP)) this.moveBy(0, -1);
        if (Key.isDown(Key.LEFT)) this.moveBy(-1, 0);
        if (Key.isDown(Key.RIGHT)) this.moveBy(1, 0);
        if (Key.isDown(Key.DOWN)) this.moveBy(0, 1);
    }
};

Player.prototype.draw = function(context){
    context.drawImage(this.image, 0, 0, 32, 32, this.x * 32, this.y * 32, 32, 32);
};

Player.prototype.moveBy = function(dx, dy){
    if(tileSet.canMoveTo(this.x + dx, this.y + dy)) {
        this.x += dx;
        this.y += dy;
    }
};


function TileSet(rows, cols, size){
    this.tilesize = size;
    this.rows = rows;
    this.cols = cols;
}

TileSet.prototype.canMoveTo = function(x, y){
    if (tile_map[y][x] == 0)
        return true;

    else
        return false;

};

TileSet.prototype.loadTiles = function(image_file, callback){
    this.image = new Image();
    this.image.src = image_file;
    this.image.onload = function () {
        callback();
    }
};

TileSet.prototype.draw = function(context){
    var destx, desty, srcx, row, col;

    for(row = 0; row < this.rows; row += 1){
        for(col = 0; col < this.cols; col += 1){
            destx = col * this.tilesize,
                desty = row * this.tilesize;
            //Update the drawing code..
            srcx = tile_map[row][col] * this.tilesize;
            context.drawImage(this.image, srcx, 0, this.tilesize, this.tilesize, destx, desty, this.tilesize, this.tilesize);
        }
    }
};

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
    sheep.update();
    wolf.update();
    tileSet.draw(context);
    drawPlayers(context);
    requestAnimationFrame(gameLoop);
}





