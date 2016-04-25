/**
 * Created by hsah on 21/04/2016.
 */
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