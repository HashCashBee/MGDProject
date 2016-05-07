/**
 * Created by hsah on 21/04/2016.
 */
function Player(x, y, playertype){
    this.x = x;
    this.y = y;
    this.playertype = playertype;
    this.originX = x;
    this.originY = y;
}

Player.prototype.load = function(img_file){
    this.image = new Image();
    this.image.src = img_file;
};

Player.prototype.update = function(){
    if (Key.isDown(Key.UP)) this.moveBy(0, -1);
    if (Key.isDown(Key.LEFT)) this.moveBy(-1, 0);
    if (Key.isDown(Key.RIGHT)) this.moveBy(1, 0);
    if (Key.isDown(Key.DOWN)) this.moveBy(0, 1);
    updateLocation(this.playertype,"0",this.x, this.y,true);
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

function Enemy(x, y, playertype){
    this.x = x;
    this.y = y;
    this.playertype = playertype;
    this.originX = x;
    this.originY = y;
}

Enemy.prototype.load = function(img_file){
    this.image = new Image();
    this.image.src = img_file;
};

Enemy.prototype.update = function (){
    this.x = locations[this.playertype].x;
    this.y = locations[this.playertype].y;
};


Enemy.prototype.draw = function(context){
    context.drawImage(this.image, 0, 0, 32, 32, this.x * 32, this.y * 32, 32, 32);
};

Enemy.prototype.moveBy = function(dx, dy){
    if(tileSet.canMoveTo(this.x + dx, this.y + dy)) {
        this.x += dx;
        this.y += dy;
    }
};

function Flower(number, x, y){
    this.number = number;
    this.pickedUp = false;
    this.x = x;
    this.y = y;
}

Flower.prototype.checkPosition = function(){ // ensures that no flowers are stuck in the walls and therefore unreachable
    while(!tileSet.canMoveTo(this.x, this.y)){
        this.x = Math.floor(Math.random()*(38-1)+1);
        this.y = Math.floor(Math.random()*(28-1)+1);
    }
};

Flower.prototype.load = function(img_file){
    this.image = new Image();
    this.image.src = img_file;
};

Flower.prototype.draw = function(context){
    context.drawImage(this.image, 0, 0, 32, 32, this.x * 32, this.y * 32, 32, 32);
};

function Text(winner){
    this.winner = winner;
};

Text.prototype.load = function(img_file){
    this.image = new Image();
    this.image.src = img_file;
};

Text.prototype.draw = function(context){
    context.drawImage(this.image, 496, 384);
};