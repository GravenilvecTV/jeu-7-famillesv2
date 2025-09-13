const { TURN_DURATION } = require('../config/constants');

class GameStateManager {
  constructor() {
    this.games = new Map();
    this.gameTimers = new Map();
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  setGame(gameId, state) {
    this.games.set(gameId, state);
  }

  hasGame(gameId) {
    return this.games.has(gameId);
  }

  deleteGame(gameId) {
    this.games.delete(gameId);
    this.clearTimer(gameId);
  }

  setTimer(gameId, timer) {
    this.clearTimer(gameId);
    this.gameTimers.set(gameId, timer);
  }

  clearTimer(gameId) {
    const timer = this.gameTimers.get(gameId);
    if (timer) {
      clearTimeout(timer);
      this.gameTimers.delete(gameId);
    }
  }

  prepareGameStateForClient(gameState, playerName) {
    const clientState = {
      ...gameState,
      hands: {},
      timeRemaining: gameState.turnStartTime 
        ? Math.max(0, TURN_DURATION - (Date.now() - gameState.turnStartTime)) 
        : TURN_DURATION
    };
    
    // Send card counts for all players
    if (gameState.hands) {
      Object.keys(gameState.hands).forEach(player => {
        if (player === playerName) {
          // Send actual cards for the requesting player
          clientState.hands[player] = gameState.hands[player] || [];
        } else {
          // Send only count for other players
          clientState.hands[player] = gameState.hands[player]?.length || 0;
        }
      });
    }
    
    return clientState;
  }

  sendPersonalizedState(io, gameId, gameState, playerNames) {
    for (const player of playerNames) {
      const playerSocket = [...io.sockets.sockets.values()]
        .find(s => s.data.playerName === player && s.data.gameId === gameId);
      if (playerSocket) {
        playerSocket.emit('gameState', this.prepareGameStateForClient(gameState, player));
      }
    }
  }
}

module.exports = new GameStateManager();