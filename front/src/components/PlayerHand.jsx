import Card from './Card';

export default function PlayerHand({
  isPlayer = false,
  position,
  cards = [],
  onSelectCard,
  selectedCard,
  isActive = false,
  onDragStart,
  onDrop,
  onDragOver,
  playerId
}) {
  const getPerspectiveClass = () => {
    if (isPlayer) return '';
    switch (position) {
      case 'top': return 'opponent-hand-top';
      case 'left': return 'opponent-hand-left';
      case 'right': return 'opponent-hand-right';
      default: return '';
    }
  };

  const getCardRotation = (index) => {
    if (isPlayer) {
      const rotations = ["-rotate-6", "-rotate-4", "-rotate-2", "rotate-0", "rotate-2", "rotate-4", "rotate-6"];
      return rotations[index % rotations.length];
    } else if (position === 'left') {
      const rotations = ["rotate-3", "rotate-2", "rotate-1", "rotate-0", "-rotate-1", "-rotate-2", "-rotate-3"];
      return rotations[index % rotations.length];
    } else if (position === 'right') {
      const rotations = ["-rotate-3", "-rotate-2", "-rotate-1", "rotate-0", "rotate-1", "rotate-2", "rotate-3"];
      return rotations[index % rotations.length];
    }
    return "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (onDrop && !isPlayer) {
      const draggedCard = JSON.parse(e.dataTransfer.getData('application/json'));
      onDrop(draggedCard, playerId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (onDragOver && !isPlayer) {
      onDragOver(e, playerId);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    if (onDragOver && !isPlayer) {
      onDragOver(e, null);
    }
  };

  return (
    <div
      className={`flex justify-center items-center relative ${getPerspectiveClass()} ${isActive ? "ring-4 ring-yellow-400 bg-yellow-50 shadow-xl" : ""} ${!isPlayer ? "drop-zone" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isActive && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded bg-yellow-400 text-white font-bold text-xs shadow">
          {isPlayer ? "À vous de jouer" : "Tour de l'adversaire"}
        </div>
      )}
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`${getCardRotation(idx)} -mr-6 ${isPlayer && onSelectCard ? "cursor-pointer hover:scale-105 transition" : ""} ${isPlayer && selectedCard && selectedCard.name === card.name && selectedCard.family === card.family ? "ring-2 ring-green-500" : ""}`}
          onClick={isPlayer && onSelectCard ? () => onSelectCard(card) : undefined}
        >
          <Card
            card={card}
            hidden={!isPlayer}
            isOpponent={!isPlayer}
            isSelected={isPlayer && selectedCard && selectedCard.name === card.name && selectedCard.family === card.family}
            draggable={isPlayer}
            onDragStart={isPlayer ? onDragStart : undefined}
          />
        </div>
      ))}
    </div>
  );
}
