import { useState } from 'react';
import { PlayerHand } from './PlayerHand';
import { OpponentHand } from './OpponentHand';
import { GameDeck } from './GameDeck';
import { GameControls } from './GameControls';
import { PlayerList } from './PlayerList';
import { CardSelector } from './CardSelector';
import { Leaderboard } from './Leaderboard';
import { useGameStore } from '../../../store/gameStore';

export const GameBoard = ({
  onDrawCard,
  onSelectCard,
  onSelectOpponent,
  onAskCard,
  onCardDrop,
  onDragStart,
  onDisconnect,
  onPassTurn,
  timeRemaining,
}) => {
  const {
    playerName,
    players,
    hands,
    myHand,
    deck,
    currentPlayer,
    selectedCard,
    isSelectingOpponent,
    dragOverPlayer,
    playerList,
    message,
    winner,
    status,
    completedFamilies,
    setDragOverPlayer,
    isMyTurn,
  } = useGameStore();

  const isPlayerTurn = isMyTurn();
  const isGameOver = status === 'finished';
  const [showCardSelector, setShowCardSelector] = useState(false);

  // Get other players for opponent positions (filter out current player)
  const otherPlayers = players.filter(p => p !== playerName);
  
  // Map players to positions (current player is always at bottom)
  const getPlayerAtPosition = (position) => {
    if (position === 'top' && otherPlayers[0]) return otherPlayers[0];
    if (position === 'right' && otherPlayers[1]) return otherPlayers[1];
    if (position === 'left' && otherPlayers[2]) return otherPlayers[2];
    return null;
  };

  const getHandForPosition = (position) => {
    const player = getPlayerAtPosition(position);
    if (!player) return 0;
    return hands[player] || 0;
  };

  const isPositionActive = (position) => {
    const player = getPlayerAtPosition(position);
    return player === currentPlayer;
  };

  const handleAskCard = () => {
    if (isPlayerTurn) {
      setShowCardSelector(true);
    }
  };

  const handleCardSelected = (card) => {
    onSelectCard(card);
    setShowCardSelector(false);
    // Trigger opponent selection
    const { startSelectingOpponent } = useGameStore.getState();
    startSelectingOpponent();
  };

  return (
    <>
      <PlayerList 
        playerList={playerList}
        onDisconnect={onDisconnect}
      />

      <Leaderboard 
        completedFamilies={completedFamilies}
        players={players}
        currentPlayer={currentPlayer}
      />

      {isSelectingOpponent && isPlayerTurn && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-60 z-40 pointer-events-auto" />
      )}

      {/* Top opponent */}
      {getPlayerAtPosition('top') && (
        <OpponentHand
          position="top"
          playerId={getPlayerAtPosition('top')}
          cards={getHandForPosition('top')}
          isActive={isPositionActive('top')}
          isSelectable={isSelectingOpponent && isPlayerTurn}
          isDragOver={dragOverPlayer === getPlayerAtPosition('top')}
          onSelect={() => onSelectOpponent(getPlayerAtPosition('top'))}
          onDrop={onCardDrop}
          onDragOver={(e) => setDragOverPlayer(getPlayerAtPosition('top'))}
          onDragLeave={() => setDragOverPlayer(null)}
          playerName={getPlayerAtPosition('top')}
        />
      )}

      {/* Right opponent */}
      {getPlayerAtPosition('right') && (
        <OpponentHand
          position="right"
          playerId={getPlayerAtPosition('right')}
          cards={getHandForPosition('right')}
          isActive={isPositionActive('right')}
          isSelectable={isSelectingOpponent && isPlayerTurn}
          isDragOver={dragOverPlayer === getPlayerAtPosition('right')}
          onSelect={() => onSelectOpponent(getPlayerAtPosition('right'))}
          onDrop={onCardDrop}
          onDragOver={(e) => setDragOverPlayer(getPlayerAtPosition('right'))}
          onDragLeave={() => setDragOverPlayer(null)}
          playerName={getPlayerAtPosition('right')}
        />
      )}

      {/* Left opponent */}
      {getPlayerAtPosition('left') && (
        <OpponentHand
          position="left"
          playerId={getPlayerAtPosition('left')}
          cards={getHandForPosition('left')}
          isActive={isPositionActive('left')}
          isSelectable={isSelectingOpponent && isPlayerTurn}
          isDragOver={dragOverPlayer === getPlayerAtPosition('left')}
          onSelect={() => onSelectOpponent(getPlayerAtPosition('left'))}
          onDrop={onCardDrop}
          onDragOver={(e) => setDragOverPlayer(getPlayerAtPosition('left'))}
          onDragLeave={() => setDragOverPlayer(null)}
          playerName={getPlayerAtPosition('left')}
        />
      )}

      {/* Current player at bottom */}
      <div className={`absolute bottom-32 left-1/2 transform -translate-x-1/2 flex items-end ${
        isSelectingOpponent && isPlayerTurn ? "pointer-events-none opacity-50" : ""
      }`}>
        <img
          src="/images/player.png"
          alt="Moi"
          className={`w-16 h-16 mr-4 ${
            isPlayerTurn ? "border-4 border-yellow-400 shadow-lg" : ""
          }`}
        />
        <PlayerHand
          cards={myHand}
          isActive={isPlayerTurn}
          onSelectCard={isPlayerTurn ? onSelectCard : undefined}
          selectedCard={selectedCard}
          onDragStart={onDragStart}
        />
      </div>

      <GameDeck
        cards={deck}
        onDrawCard={isPlayerTurn ? onDrawCard : undefined}
        disabled={!isPlayerTurn || isSelectingOpponent}
      />

      <GameControls
        timer={timeRemaining}
        message={message}
        isGameOver={isGameOver}
        isPlayerTurn={isPlayerTurn}
        isSelectingOpponent={isSelectingOpponent}
        hasSelectedCard={!!selectedCard}
        onAskCard={handleAskCard}
        onDrawCard={onDrawCard}
        onNextPlayer={onPassTurn}
        winner={winner}
      />

      {showCardSelector && (
        <CardSelector
          myCards={myHand}
          onSelectCard={handleCardSelected}
          onCancel={() => setShowCardSelector(false)}
        />
      )}
    </>
  );
};