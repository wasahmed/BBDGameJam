// lol this bad
let startGameEngine;

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

// ON GAME STATE ================================================
socket.on('gameState', (_gs) => {    
  // console.log('Got gamestate...', _gs);  

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
// ================================================

// Update UI based on the game state
const uiUpdate = () => {
  // console.log('Updating UI from gamestate...', gameState);

  if (gameState){
    connectCard.style.display = 'none';      
    gameDiv.style.display = 'block';

    document.getElementById('player-type').innerText = isSeeker? 'SEEKING' : 'HIDING';
    document.getElementById('game-status').innerText = gameState.gameStarted? 'Game Started..' : 'Waiting for player to join...';
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