// lol this bad
let startGameEngine;
let stopGameEngine;

// UI elements
let connectCard = document.getElementById('connect-card');
let gameDiv = document.getElementById('game');
// let tmpSeekerBlock = document.getElementById('tmpSeekerBlock');

// Game lets
let gameInit = false;  
let gameState = undefined;  
let socket = io();

// Helpers
let isSeeker = false;  
let isHider = false;  

// Game State Updates
socket.on('gameState', (_gs) => {    
  try {            
    gameState = _gs;
    isSeeker = socket.id == gameState.seeker.id; 
    isHider = socket.id == gameState.hider.id;

    if (!gameInit && gameState.gameStarted){
      gameInit = true;
      startGameEngine();
    }

    uiUpdate();              
  } catch (error) {
    console.error('Error when reiced game state', error);      
  }

});

// Round Ends
socket.on('roundEnd', (_gs) => {    
  console.log('Round ended...', gameState);
  stopGameEngine();

  gameState = _gs;
  isSeeker = socket.id == gameState.seeker.id; 
  isHider = socket.id == gameState.hider.id;
  uiUpdate();              

  alert('Game Engine Stopped... Round Ended');
  startGameEngine();
});

// Position Updates
socket.on('updatePos', (position) => {    
  gameState.seeker.position = position.seeker;
  gameState.hider.position = position.hider;  
});

// Update UI based on the game state
const uiUpdate = () => {
  if (gameState){
    connectCard.style.display = 'none';      
    gameDiv.style.display = 'block';

    document.getElementById('game-id').innerText = `GameId: ${gameState.gameId}`;
    document.getElementById('player-type').innerHTML = isSeeker? 'You are <b>SEEKING</b>...' : 'You are <b>HIDING</b>...';
    document.getElementById('game-status').innerText = gameState.gameStarted? 'Game Started..' : 'Waiting for player to join...';

    if (isHider){
      document.getElementById('playerScore').innerText = gameState.playerScores[gameState.hider.id];    
      document.getElementById('enemyScore').innerText = gameState.playerScores[gameState.seeker.id];      
    } else if (isSeeker){
      document.getElementById('playerScore').innerText = gameState.playerScores[gameState.seeker.id];    
      document.getElementById('enemyScore').innerText = gameState.playerScores[gameState.hider.id];
    }
    
  } else {
    connectCard.style.display = 'block';
    gameDiv.style.display = 'none';      
  }    
}

const onJoinGame = () => {
  let gameId = document.getElementById('gameId').value;
  if (!gameId){
    return alert('Enter valid game id');
  }
  
  console.log('Joining game...', gameId);
  let result = socket.emit('joinGame', gameId);    

  let playerId = result.id;
  console.log('Player ID...', playerId);
}  