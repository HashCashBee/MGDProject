var context, tileSet,
    TILE_SIZE = 32,
    NUM_ROWS = 30,
    NUM_COLS = 40, sheep, wolf;

var fps = 10;
var then = Date.now();
var interval = 1000/fps;
var fb = new Firebase('https://sheepamongwolves.firebaseio.com/');
var locations = {};

if(fb){
    var fbLocation = fb.child("/location");
    fbLocation.on('child_added', function(sn){
        var data = sn.val();
        locations[sn.key()] = data;
    });
    fbLocation.on('child_changed', function(sn){
        var data = sn.val();
        locations[sn.key()] = data;
    });
    var fbLocation = fb.child("/location");
    fbLocation.on('child_removed', function(sn){
        var data = sn.val();
        delete locations[sn.key()];
    });
}

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

function addLocation(name, x, y){
    //Prevent duplicates
    if (getKey(name)) return;
    //Name is valid and can be added
    fb.child("/location").push({
        player: name,
        x: x,
        y: y,
        timestamp: Firebase.ServerValue.TIMESTAMP
    }, function(err){
        if(err){
            console.dir(err);
        }
    });
}

function getKey(name){
    var loc;
    for (loc in locations){
        if(locations[loc].player === name){
            return loc;
        }
    }
    return null;
}

function updateLocation(ref, name, x, y){
    fb.child("/location/" + ref).set({
        player: name,
        x: x,
        y: y,
        timestamp: Firebase.ServerValue.TIMESTAMP
    }, function(err){
        if(err){
            console.dir(err);
        }
    });
}

function removeLocation(ref){
    fb.child("/location/"+ref).set(null,function(err){
        if(err) console.dir(err);
    });
}

function LoadAssets(){
    tileSet = new TileSet(NUM_ROWS, NUM_COLS, TILE_SIZE);
    sheep = new Player(13, 5, "Sheep");
    wolf = new Player(20, 20, "Wolf");
    sheep.load("images/sheep-sprite.png");
    wolf.load("images/wolf-sprite.png");
    tileSet.loadTiles("images/sheep_tileset.png", gameLoop);
}

function drawPlayers(context){
    sheep.draw(context);
    wolf.draw(context);
}

function updatePlayerInfo(){
    if(locations[getKey(sheep.name)]) {
        sheep.x = locations[getKey(sheep.name)].x;
        sheep.y = locations[getKey(sheep.name)].y;
    }
    if(locations[getKey(wolf.name)]) {
        wolf.x = locations[getKey(wolf.name)].x;
        wolf.x = locations[getKey(wolf.name)].y;
    }
}

function gameLoop(){
    var now = Date.now();
    var delta = now - then;
    if(delta > interval) {
        sheep.update();
        wolf.update();
        tileSet.draw(context);
        updatePlayerInfo();
        drawPlayers(context);
        then = now - (delta % interval)
    }
    requestAnimationFrame(gameLoop);
}





