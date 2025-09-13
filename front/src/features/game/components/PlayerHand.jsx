import Card from '../../../components/Card';

export const PlayerHand = ({
  cards = [],
  isActive = false,
  onSelectCard,
  selectedCard,
  onDragStart,
}) => {
  const getCardRotation = (index) => {
    const rotations = ["-rotate-6", "-rotate-4", "-rotate-2", "rotate-0", "rotate-2", "rotate-4", "rotate-6"];
    return rotations[index % rotations.length];
  };

  return (
    <div className={`flex justify-center items-center relative ${
      isActive ? "ring-4 ring-yellow-400 bg-yellow-50 shadow-xl" : ""
    }`}>
      {isActive && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded bg-yellow-400 text-white font-bold text-xs shadow">
          À vous de jouer
        </div>
      )}
      {cards.map((card, idx) => (
        <div
          key={`${card.family}-${card.name}-${idx}`}
          className={`${getCardRotation(idx)} -mr-6 ${
            onSelectCard ? "cursor-pointer hover:scale-105 transition" : ""
          } ${
            selectedCard && selectedCard.name === card.name && selectedCard.family === card.family 
              ? "ring-2 ring-green-500" 
              : ""
          }`}
          onClick={onSelectCard ? () => onSelectCard(card) : undefined}
        >
          <Card
            card={card}
            hidden={false}
            isOpponent={false}
            isSelected={selectedCard && selectedCard.name === card.name && selectedCard.family === card.family}
            draggable={!!onDragStart}
            onDragStart={onDragStart}
          />
        </div>
      ))}
    </div>
  );
};