const gameLogic = require('../gameLogic');
const gameStateManager = require('../services/gameStateManager');
const timerService = require('../services/timerService');
const { EVENTS, ACTIONS, GAME_STATUS } = require('../config/constants');

async function handleGameAction(socket, io, prisma, { gameId, action }) {
  try {
    const gameState = gameStateManager.getGame(gameId);
    if (!gameState) {
      socket.emit(EVENTS.ERROR, { message: 'Partie non trouvée' });
      return;
    }
    
    // Verify it's the player's turn
    if (!gameLogic.isPlayerTurn(gameState, socket.data.playerName)) {
      socket.emit(EVENTS.ERROR, { message: "Ce n'est pas votre tour" });
      return;
    }
    
    let result;
    
    switch (action.type) {
      case ACTIONS.DRAW_CARD:
        result = gameLogic.drawCard(gameState, socket.data.playerName);
        if (result.success) {
          gameStateManager.setGame(gameId, result.gameState);
          timerService.resetTurnTimer(gameId, io, prisma);
        }
        break;
        
      case ACTIONS.ASK_CARD:
        result = gameLogic.askForCard(
          gameState, 
          socket.data.playerName,
          action.payload.targetPlayer,
          action.payload.card
        );
        
        if (result.success) {
          if (result.cardFound) {
            // Player continues, reset timer
            gameStateManager.setGame(gameId, result.gameState);
            timerService.resetTurnTimer(gameId, io, prisma);
          } else {
            // Card not found, player must draw automatically
            gameStateManager.setGame(gameId, result.gameState);
            
            // Auto-draw a card for the player
            const drawResult = gameLogic.drawCard(result.gameState, socket.data.playerName);
            if (drawResult.success) {
              gameStateManager.setGame(gameId, drawResult.gameState);
              timerService.resetTurnTimer(gameId, io, prisma);
              result.message += ` ${drawResult.message}`;
              result.gameState = drawResult.gameState;
            } else {
              // No cards left in deck, pass turn
              gameLogic.nextTurn(result.gameState);
              gameStateManager.setGame(gameId, result.gameState);
              timerService.resetTurnTimer(gameId, io, prisma);
              result.message += ` Pas de cartes dans le deck. Tour passé.`;
            }
          }
        }
        break;
        
      case ACTIONS.PASS_TURN:
        gameLogic.nextTurn(gameState);
        gameStateManager.setGame(gameId, gameState);
        timerService.resetTurnTimer(gameId, io, prisma);
        result = { success: true, message: 'Tour passé' };
        break;
        
      default:
        socket.emit(EVENTS.ERROR, { message: 'Action inconnue' });
        return;
    }
    
    if (result?.success) {
      const updatedState = gameStateManager.getGame(gameId);
      
      // Update database
      await prisma.game.update({
        where: { id: Number(gameId) },
        data: { state: JSON.stringify(updatedState) }
      });
      
      // Get player list
      const game = await prisma.game.findUnique({ 
        where: { id: Number(gameId) }, 
        include: { players: true } 
      });
      const playerNames = game.players.map(p => p.name);
      
      // Emit updated state to all players
      gameStateManager.sendPersonalizedState(io, gameId, updatedState, playerNames);
      io.to(`game_${gameId}`).emit(EVENTS.GAME_MESSAGE, { message: result.message });
      
      // If game is finished
      if (updatedState.status === GAME_STATUS.FINISHED) {
        timerService.clearTurnTimer(gameId);
        io.to(`game_${gameId}`).emit(EVENTS.GAME_FINISHED, { winner: updatedState.winner });
      }
    }
    
  } catch (error) {
    console.error('Erreur gameAction:', error);
    socket.emit(EVENTS.ERROR, { message: 'Erreur lors de l\'action' });
  }
}

module.exports = {
  handleGameAction
};