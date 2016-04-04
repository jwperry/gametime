var socket = io.connect();
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var connectionCount = document.getElementById('connected-users-count');
var statusMessage = document.getElementById('status');

//////////Draw Class//////////
function ShapeDrawer(canvas, context) {
  this.canvas = canvas;
  this.context = context;
}

ShapeDrawer.prototype = {
  drawFood: function(food) {
    this.context.beginPath();
    this.context.arc(food.x, food.y, 5, 0, Math.PI * 2);
    this.context.fillStyle = food.color;
    this.context.fill();
    return this;
  },

  drawPlayer: function(player) {
    this.context.beginPath();
    this.context.arc(player.x, player.y, player.mass, 0, Math.PI * 2);
    this.context.fillStyle = 'royalblue';
    this.context.fill();
    return player;
  }
};
//////////////////////////////


var shapeDrawer = new ShapeDrawer(canvas, ctx);

var gameState = {};
var keysPressed = {};


//////////Listener/Send//////////
this.onkeydown = function(event) {
    if([65, 68, 83, 87].includes(event.keyCode)){
      keysPressed[event.keyCode] = true;
    }
};

this.onkeyup = function(event) {
    if([65, 68, 83, 87].includes(event.keyCode)){
      keysPressed[event.keyCode] = false;
    }
};
//////////////////////////////


//////////Receive/Process//////////
socket.on('usersConnected', function(count) {
  connectionCount.innerText = count + ' users connected.';
});

socket.on('status', function(message) {
  statusMessage.innerText = message;
});

socket.on('gameState', function(newState) {
  gameState = newState;
});
//////////////////////////////


//////////Game Loop//////////
function gameLoop() {
  socket.send('keysPressed', keysPressed);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(typeof gameState.players !== "undefined"){

    for(var i = 0; i < gameState.players.length; i++) {
      shapeDrawer.drawPlayer(gameState.players[i]);
    }

    for(var j = 0; j < gameState.food.length; j++) {
      shapeDrawer.drawFood(gameState.food[j]);
    }

    for(var k = 0; k < gameState.boosts.length; k++) {
      shapeDrawer.drawFood(gameState.boosts[k]);
    }

  }
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
//////////////////////////////