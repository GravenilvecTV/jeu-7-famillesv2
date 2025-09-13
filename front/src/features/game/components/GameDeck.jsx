import Card from '../../../components/Card';

export const GameDeck = ({ cards = 0, onDrawCard, disabled }) => {
  // Create an array of fake cards for display
  const displayCards = Array.from({ length: Math.min(cards, 4) }, (_, i) => i);
  
  return (
    <div className={`absolute top-1/3 left-1/2 transform -translate-x-2/3 -translate-y-1/5 ${
      disabled ? "pointer-events-none opacity-50" : ""
    }`}>
      <div
        onClick={!disabled ? onDrawCard : undefined}
        className={`${!disabled ? "cursor-pointer" : "opacity-50 pointer-events-none"}`}
      >
        <div className="deck-3d flex flex-col items-center">
          <span className="mb-4 text-lg font-bold bg-white bg-opacity-80 px-3 py-1 rounded shadow border border-gray-300">
            {cards} cartes
          </span>
          <div className="relative">
            {displayCards.map((_, idx) => (
              <div key={idx} className={`absolute ${idx === 3 ? "translate-x-1 translate-y-1" : ""}`}>
                <Card hidden={true} />
              </div>
            ))}
            {cards === 0 && (
              <div className="w-24 h-36 bg-gray-200 border-2 border-gray-400 rounded flex items-center justify-center">
                <span className="text-gray-500 text-sm">Deck vide</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};