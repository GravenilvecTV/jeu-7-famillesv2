export const GAME_CONSTANTS = {
  TIMER_DURATION: 60,
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  CARDS_PER_FAMILY: 6,
  DEFAULT_GAME_ID: 1,
};

export const PLAYER_POSITIONS = {
  TOP: 0,
  RIGHT: 1,
  BOTTOM: 2,
  LEFT: 3,
};

export const PLAYER_POSITION_NAMES = {
  [PLAYER_POSITIONS.TOP]: 'haut',
  [PLAYER_POSITIONS.RIGHT]: 'droite',
  [PLAYER_POSITIONS.BOTTOM]: 'bas',
  [PLAYER_POSITIONS.LEFT]: 'gauche',
};

export const GAME_STATES = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_GAME: 'joinGame',
  GAME_STATE: 'gameState',
  GAME_ACTION: 'gameAction',
  PLAYER_JOINED: 'playerJoined',
  PLAYER_COUNT: 'playerCount',
  PLAYER_LIST: 'playerList',
  ERROR: 'error',
  CONNECT_ERROR: 'connect_error',
};