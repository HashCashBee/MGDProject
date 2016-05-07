/**
 * Created by hsah on 21/04/2016.
 */
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