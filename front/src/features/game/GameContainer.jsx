import { useCallback } from 'react';
import { LoginForm } from '../auth/components/LoginForm';
import { WaitingRoom } from '../auth/components/WaitingRoom';
import { GameBoard } from './components/GameBoard';
import { useSocket } from '../../hooks/useSocket';
import { useGameActions } from '../../hooks/useGameActions';
import { useGameTimer } from '../../hooks/useGameTimer';
import { useGameStore } from '../../store/gameStore';
import { GAME_CONSTANTS } from '../../constants/game';

export const GameContainer = () => {
  const {
    isConnected,
    socketError,
    playerCount,
    playerList,
    setPlayerName,
    setIsConnected,
    selectCard,
    selectOpponent,
    isWaiting,
  } = useGameStore();

  const { connect, disconnect, joinGame } = useSocket();
  const { drawCard, askForCard, confirmAskCard, passTurn } = useGameActions();
  const { timeRemaining } = useGameTimer();

  const handleLogin = useCallback((name) => {
    setPlayerName(name);
    const socket = connect();
    // Wait for socket to be connected before joining game
    socket.on('connect', () => {
      joinGame(GAME_CONSTANTS.DEFAULT_GAME_ID, name);
    });
  }, [setPlayerName, connect, joinGame]);

  const handleDemo = useCallback(() => {
    setIsConnected(true);
  }, [setIsConnected]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const handleCardDrop = useCallback((draggedCard, targetPlayer) => {
    // For drag & drop, we'll use the dragged card directly
    // This allows dragging a card you have to ask for any card from that family
    selectCard(draggedCard);
    selectOpponent(targetPlayer);
    askForCard();
  }, [selectCard, selectOpponent, askForCard]);

  const handleDragStart = useCallback((e, card) => {
    e.dataTransfer.setData('application/json', JSON.stringify(card));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  if (!isConnected) {
    return (
      <div className="relative h-screen w-screen">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-gray-900 bg-opacity-60">
          <LoginForm
            onLogin={handleLogin}
            onDemo={handleDemo}
            playerCount={playerCount}
            playerList={playerList.filter(p => typeof p === 'string')}
            isLoading={false}
            error={socketError}
          />
        </div>
      </div>
    );
  }

  if (isWaiting()) {
    return (
      <div className="relative h-screen w-screen">
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-gray-900 bg-opacity-80">
          <WaitingRoom
            playerCount={playerCount}
            playerList={playerList.filter(p => typeof p === 'string')}
            onDisconnect={handleDisconnect}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      <GameBoard
        onDrawCard={drawCard}
        onSelectCard={selectCard}
        onSelectOpponent={(opponent) => {
          selectOpponent(opponent);
          confirmAskCard(opponent);
        }}
        onAskCard={askForCard}
        onCardDrop={handleCardDrop}
        onDragStart={handleDragStart}
        onDisconnect={handleDisconnect}
        onPassTurn={passTurn}
        timeRemaining={timeRemaining}
      />
    </div>
  );
};