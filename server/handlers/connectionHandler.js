const gameLogic = require('../gameLogic');
const gameStateManager = require('../services/gameStateManager');
const timerService = require('../services/timerService');
const { EVENTS, GAME_STATUS } = require('../config/constants');

async function handleJoinGame(socket, io, prisma, { gameId, playerName }) {
  try {
    // Verify game exists
    const game = await prisma.game.findUnique({ 
      where: { id: Number(gameId) }, 
      include: { players: true } 
    });
    
    if (!game) {
      socket.emit(EVENTS.ERROR, { message: `La partie ${gameId} n'existe pas.` });
      return;
    }
    
    // Store player info
    socket.data.playerName = playerName;
    socket.data.gameId = gameId;
    socket.join(`game_${gameId}`);
    
    // Create or get player
    let player = await prisma.player.findFirst({ 
      where: { name: playerName, gameId: Number(gameId) } 
    });
    
    if (!player) {
      player = await prisma.player.create({ 
        data: { name: playerName, gameId: Number(gameId) } 
      });
    }
    
    // Get updated player list
    const updatedGame = await prisma.game.findUnique({ 
      where: { id: Number(gameId) }, 
      include: { players: true } 
    });
    const playerNames = updatedGame.players.map(p => p.name);
    
    // Initialize or get game state
    let gameState = gameStateManager.getGame(gameId);
    if (!gameState) {
      gameState = JSON.parse(game.state);
      gameStateManager.setGame(gameId, gameState);
    }
    
    // Start game if we have enough players and game is waiting
    if (playerNames.length >= 2 && gameState.status === GAME_STATUS.WAITING) {
      gameState = gameLogic.initializeGame(playerNames);
      gameState.status = GAME_STATUS.PLAYING;
      gameStateManager.setGame(gameId, gameState);
      
      // Start turn timer
      timerService.startTurnTimer(gameId, io, prisma);
      
      console.log('Partie démarrée avec les joueurs:', playerNames);
    }
    
    // Update database
    await prisma.game.update({
      where: { id: Number(gameId) },
      data: { state: JSON.stringify(gameState) }
    });
    
    // Send updates to all players
    io.to(`game_${gameId}`).emit(EVENTS.PLAYER_JOINED, { 
      playerName,
      players: playerNames,
      count: playerNames.length 
    });
    
    gameStateManager.sendPersonalizedState(io, gameId, gameState, playerNames);
    
    console.log(`${playerName} a rejoint la partie ${gameId} (${playerNames.length}/4)`);
    
  } catch (error) {
    console.error('Erreur joinGame:', error);
    socket.emit(EVENTS.ERROR, { message: 'Erreur lors de la connexion à la partie' });
  }
}

async function handleDisconnect(socket, io, prisma) {
  const { playerName, gameId } = socket.data || {};
  
  if (gameId && playerName) {
    try {
      // Remove player from database
      await prisma.player.deleteMany({ 
        where: { name: playerName, gameId: Number(gameId) } 
      });
      
      // Get updated player list
      const updatedGame = await prisma.game.findUnique({ 
        where: { id: Number(gameId) }, 
        include: { players: true } 
      });
      const playerNames = updatedGame ? updatedGame.players.map(p => p.name) : [];
      
      // Update game state if game is active
      const gameState = gameStateManager.getGame(gameId);
      if (gameState && gameState.status === GAME_STATUS.PLAYING) {
        // If current player left, move to next player
        if (gameState.currentPlayer === playerName) {
          gameLogic.nextTurn(gameState);
          timerService.resetTurnTimer(gameId, io, prisma);
        }
        
        // Remove player from game
        gameState.players = playerNames;
        if (playerNames.length < 2) {
          gameState.status = GAME_STATUS.WAITING;
          timerService.clearTurnTimer(gameId);
        }
        
        gameStateManager.setGame(gameId, gameState);
        
        // Update database
        await prisma.game.update({
          where: { id: Number(gameId) },
          data: { state: JSON.stringify(gameState) }
        });
        
        // Notify remaining players
        gameStateManager.sendPersonalizedState(io, gameId, gameState, playerNames);
      }
      
      console.log(`${playerName} a quitté la partie ${gameId}`);
      
      io.to(`game_${gameId}`).emit(EVENTS.PLAYER_LEFT, { 
        playerName,
        players: playerNames,
        count: playerNames.length 
      });
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }
}

module.exports = {
  handleJoinGame,
  handleDisconnect
};