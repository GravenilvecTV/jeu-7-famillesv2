const gameLogic = require('../gameLogic');
const gameStateManager = require('./gameStateManager');
const { TURN_DURATION, EVENTS } = require('../config/constants');

class TimerService {
  startTurnTimer(gameId, io, prisma) {
    gameStateManager.clearTimer(gameId);
    
    const timer = setTimeout(async () => {
      const gameState = gameStateManager.getGame(gameId);
      if (gameState && gameState.status === 'playing') {
        // Auto pass turn
        gameLogic.nextTurn(gameState);
        gameStateManager.setGame(gameId, gameState);
        
        try {
          // Update database
          await prisma.game.update({
            where: { id: Number(gameId) },
            data: { state: JSON.stringify(gameState) }
          });
          
          // Get player list and emit update
          const game = await prisma.game.findUnique({ 
            where: { id: Number(gameId) }, 
            include: { players: true } 
          });
          const playerNames = game.players.map(p => p.name);
          
          gameStateManager.sendPersonalizedState(io, gameId, gameState, playerNames);
          io.to(`game_${gameId}`).emit(EVENTS.GAME_MESSAGE, { 
            message: `Temps écoulé ! Tour de ${gameState.currentPlayer}` 
          });
          
          // Start timer for next player
          this.startTurnTimer(gameId, io, prisma);
        } catch (error) {
          console.error('Erreur lors du timeout du tour:', error);
        }
      }
    }, TURN_DURATION);
    
    gameStateManager.setTimer(gameId, timer);
  }

  resetTurnTimer(gameId, io, prisma) {
    this.startTurnTimer(gameId, io, prisma);
  }

  clearTurnTimer(gameId) {
    gameStateManager.clearTimer(gameId);
  }
}

module.exports = new TimerService();