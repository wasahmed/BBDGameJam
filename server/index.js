const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.use(express.static('app'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/app/index.html');
});

class GameState {
  static playerIdGameMap = {}

  constructor(gameId){
    this.gameId = gameId;
    this.gameStarted = false;
    this.map = [
      {
        width: 1000,
        height: 30,
        x: 0,
        y: 0,
      },
      {
        width: 30,
        height: 1000,
        x: 0,
        y: 0,
      },
      {
        width: 120,
        height: 290,
        x: 40,
        y: 40,
      }
      {
        width: 120,
        height: 290,
        x: 40,
        y: 40,
      }
      {
        width: 1000,
        height: 300,
        x: 970,
        y: 0,
      }
      {
        width: 30,
        height: 400,
        x: 570,
        y: 40,
      }
      {
        width: 110,
        height:120,
        x: 160,
        y: 270,
      }
      {
        width: 170,
        height: 200,
        x: 40,
        y: 470,
      }
      {
        width: 120,
        height: 320,
        x: 650,
        y: 370,
      }
      {
        width: 370,
        height: 60,
        x: 400,
        y: 640,
      }
      {
        width: 20,
        height: 1000,
        x: 0,
        y: 990,
      }
      {
        width: 120,
        height: 160,
        x: 100,
        y: 640,
      }
      {
        width: 120,
        height: 240,
        x: 100,
        y: 870,
      }
      {
        width: 180,
        height: 70,
        x: 460,
        y: 810,
      }
      {
        width: 100,
        height: 90,
        x: 600,
        y: 730,
      }
      {
        width: 100,
        height: 90,
        x: 180,
        y: 100,
      }
    ]
    this.hider = {
      id: '',
      position: {
        x: 0,
        y: 0,
      },
      score: 0,   
    };
  
    this.seeker = {
      id: '',
      position: 0,
      score: 0,
    };      
  }

  // Helpers
  isSeeker(playerId){
    return this.seeker.id == playerId;
  }

  isHider(playerId){
    return this.hider.id == playerId;
  }

  static getPlayerGameState(playerId){
    return GameState.playerIdGameMap[playerId];
  }

  // Operations
  joinGame(playerId){  
    if (this.seeker.id && this.hider.id){
      console.log('Game if full sorry...');
      return false;
    }

    GameState.playerIdGameMap[playerId] = this;
    if (!this.seeker.id) {
      this.seeker.id = playerId;
      console.log(playerId, 'joined as seeker...');
    } else if (!this.hider.id) {
      this.hider.id = playerId;
      console.log(playerId, 'joined as hider...');
    }    

    if (this.hider.id && this.seeker.id){
      this.startGame();
    }

    return true;
  }   

  // Initialise game state
  startGame(){
    this.gameStarted = true;
  }


  updatePosition(playerId, newPos){
    console.log(playerId, 'Position update', newPos);
    if (this.isSeeker(playerId)){
      this.seeker.position = newPos;
    } else {
      this.hider.position = newPos;
    }        
  }
}  


const gameStateMap = {};

io.on('connection', (socket) => {
  // join game =================================
  socket.on('joinGame', async (gameId) => {    
    // create game if doesnt exist        
    if (!gameStateMap[gameId]){      
      gameStateMap[gameId] = new GameState(gameId);
    }

    let gameState = gameStateMap[gameId];

    if (gameState.joinGame(socket.id)){      
      console.log('Joining and emitting game state to room...', gameState.gameId);
      await socket.join(gameState.gameId);
      await io.to(gameState.gameId).emit('gameState', gameState)      
    } 
  });

  // update position =================================
  socket.on('updatePos', (newPos) => {      
    let gameState = GameState.getPlayerGameState(socket.id);
    if (gameState){
      console.log('Emitting game state to room...', gameState.gameId);
      gameState.updatePosition(socket.id, newPos);            
      io.to(gameState.gameId).emit('gameState', gameState);
    }
  });

});



server.listen(3000, () => {
  console.log('listening on *:3000');
});