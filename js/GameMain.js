var context, tileSet, TILE_SIZE = 32, NUM_ROWS = 30, NUM_COLS = 40,
    player, enemy, sheep, wolf,
    flowers, sheepWins, wolfWins;
var fps = 10;
var then = Date.now();
var interval = 1000/fps;
var fb = new Firebase("https://sheepamongwolves.firebaseio.com/");
var locations = {};
var myflowers = {};
var state = 0; // 0 for playing, 1 for sheep wins, 2 for wolf wins
var playerType;

if (fb) {
    // This gets a reference to the 'location" node.
    var fbLocation = fb.child("/location");
    // Now we can install event handlers for nodes added, changed and removed.
    fbLocation.on('child_added', function(sn){
        locations[sn.key()] = sn.val();
    });
    fbLocation.on('child_changed', function(sn){
        locations[sn.key()] = sn.val();
    });
    fbLocation.on('child_removed', function(sn){
        delete locations[sn.key()];
    });
}
if(fb) {
    var fbFlowers = fb.child("/flowers");
    fbFlowers.on('child_added', function (sn) {
        myflowers[sn.key()] = sn.val();
    });
    fbFlowers.on('child_changed', function (sn) {
        myflowers[sn.key()] = sn.val();
    });
    fbFlowers.on('child_removed', function (sn) {
        delete myflowers[sn.key()];
    });
}

var Key = {
    _pressed:{},
    LEFT: 37,
    UP: 38,
    RIGHT:39,
    DOWN:40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    R: 82,
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
    updateLocation("sheep",'0',13,5,false,false);
    updateLocation('wolf',20,20,false, false);
};

window.unload = function(){
    for (var i = 0; i < 8; i++) {
        removeFlowers(i);
    }
}

function updateLocation(ref, name, x, y, taken){
    fb.child("/location/" + ref).set({
        player: name,
        x: x,
        y: y,
        taken: taken,
        timestamp: Firebase.ServerValue.TIMESTAMP
    }, function(err) {
        if(err) console.dir(err);
    });
}

function updateFlowers(ref, pickedUp, x, y){
    fb.child("/flowers/" + ref).set({
        pickedUp: pickedUp,
        x: x,
        y: y,
    }, function(err) {
        if(err) console.dir(err);
    });
}

function removeFlowers(ref){
    fb.child("/flowers/" +ref).set(null, function(err){
        if(err) console.dir(err);
    });
}

function LoadFlowers(){
    if(playerType == "sheep") {
        for (var i = 0; i <= flowers.length - 1; i++) {
            flowers[i] = new Flower(i, Math.floor(Math.random() * (38 - 1) + 1), Math.floor(Math.random() * (28 - 1) + 1));
            flowers[i].checkPosition();
            flowers[i].load("images/flower.png");
            updateFlowers(i, false, flowers[i].x, flowers[i].y);
        }
    }
    if(playerType == "wolf") {
        for (var i = 0; i < flowers.length; i++) {
            flowers[i] = new Flower(i, myflowers[i].x, myflowers[i].y);
            flowers[i].load("images/flower.png");
        }
    }
};

function syncFlowers(){
    for (var i = 0; i < flowers.length; i++) {
        flowers[i].pickedUp = myflowers[i].pickedUp;
        flowers[i].x = myflowers[i].x;
        flowers[i].y = myflowers[i].y;
    }
};

function getEmpty(taken) {
    var loc;
    for(loc in locations){
        if(locations[loc].taken === taken){
            return loc;
        }
        //console.log(loc);
    }
    //console.log(locations);
    //console.log(loc);
    return null;
};

document.getElementById("join").addEventListener("click", function(){
    player = new Player(13, 5, null);
    enemy = new Enemy(20, 20, null);
    if (playerType == null)
        playerType = getEmpty(false);
    else {
        updateLocation(playerType, '0', 0, 0, false);
        playerType = getEmpty(false);
    }
    console.log(playerType);
    if (playerType === "sheep") {
        player.playertype = playerType;
        enemy.playertype = "wolf";
        player.image = sheep;
        enemy.image = wolf;
        player.originX = 5;
        player.originY = 17;
        enemy.originX = 36;
        enemy.originY = 17;
        updateLocation(playerType, '0', player.x, player.y, true);
    }
    else if (playerType === "wolf") {
        player.playertype = playerType;
        enemy.playertype = "sheep";
        player.image = wolf;
        enemy.image = sheep;
        player.originX = 36;
        player.originY = 17;
        enemy.originX = 5;
        enemy.originY = 17;
        updateLocation(playerType, '0', player.x, player.y, true);
    }
    else {
        alert("Can't join! Game is full!")
    }
    LoadAssets();
});

function LoadAssets(){
    flowers = new Array(9);
    tileSet = new TileSet(NUM_ROWS, NUM_COLS, TILE_SIZE);
    sheepWins = new Text(0);
    wolfWins = new Text(1);

    if (playerType === "sheep") {
        player.load("images/sheep-sprite.png");
        enemy.load("images/wolf-sprite.png");
    }
    else
    {
        enemy.load("images/sheep-sprite.png");
        player.load("images/wolf-sprite.png");
    }

    sheepWins.load("images/sheep_wins.png");
    wolfWins.load("images/wolf_wins.png");
    LoadFlowers();
    if(playerType == "wolf") {
        syncFlowers();
    }
    endGame();
    tileSet.loadTiles("images/sheep_tileset.png", gameLoop);

}

function draw(context){
    player.draw(context);
    enemy.draw(context);
    for(var i = 0; i <=flowers.length-1; i++){
        if (!flowers[i].pickedUp)
            flowers[i].draw(context);
    }
    if(state == 1){
        sheepWins.draw(context);
    }
    if(state == 2){
        wolfWins.draw(context);
    }
}

function checkCollisions(){
    if (player.playertype === "sheep") {
        for (var i = 0; i < flowers.length; i++) {
            if (!flowers.pickedUp) sheepwin = false;
            if (player.x == flowers[i].x && player.y == flowers[i].y) {
                flowers[i].pickedUp = true;
                updateFlowers(i, flowers[i].pickedUp, flowers[i].x, flowers[i].y);
            }
        }
    }
    else {
        syncFlowers();
    }

    var sheepwin = true, loc;
    for (loc in flowers) {
        if (!flowers[loc].pickedUp) sheepwin = false;
        console.log(sheepwin);
    }
    console.log(sheepwin);
    if (sheepwin) {
        state = 1;
    }
    if (player.x == enemy.x && player.y == enemy.y) {
        if (state == 0 && state != 1) {
            state = 2;
        }
    }

}

function endGame(){
    player.x = player.originX;
    player.y = player.originY;
    enemy.x = enemy.originX;
    enemy.y = enemy.originY;
    state = 0;
    LoadFlowers();
}

function gameLoop(){
    if (playerType != null) {
        var now = Date.now();
        var delta = now - then;
        if (delta > interval) {
            context.clearRect(0, 0, 1280, 960);
            if (state == 0) {
                player.update();
                enemy.update();
            }
            else {
                if(Key.isDown(Key.R)) {
                    endGame();
                }
            }
            tileSet.draw(context);
            checkCollisions();
            draw(context);
            then = now - (delta % interval);
        }
        requestAnimationFrame(gameLoop);
    }
}