module.exports = {
  TURN_DURATION: 60000, // 60 seconds
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  DEFAULT_GAME_ID: 1,
  
  GAME_STATUS: {
    WAITING: 'waiting',
    PLAYING: 'playing',
    FINISHED: 'finished'
  },
  
  ACTIONS: {
    DRAW_CARD: 'DRAW_CARD',
    ASK_CARD: 'ASK_CARD',
    PASS_TURN: 'PASS_TURN'
  },
  
  EVENTS: {
    JOIN_GAME: 'joinGame',
    GAME_ACTION: 'gameAction',
    GAME_STATE: 'gameState',
    GAME_MESSAGE: 'gameMessage',
    GAME_FINISHED: 'gameFinished',
    PLAYER_JOINED: 'playerJoined',
    PLAYER_LEFT: 'playerLeft',
    PLAYER_COUNT: 'playerCount',
    PLAYER_LIST: 'playerList',
    ERROR: 'error'
  }
};