export default function Card({ card, hidden, isOpponent, isSelected, onDragStart, draggable = false }) {
  const handleDragStart = (e) => {
    if (onDragStart) {
      onDragStart(e, card);
    }
  };

  return (
    <div 
      className={`w-24 h-36 bg-white border border-gray-400 rounded shadow overflow-hidden relative transition-all duration-300 hover:scale-125 hover:shadow-2xl hover:border-yellow-400 hover:border-4 hover:z-10 ${draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}
      ${isSelected ? "border-4 border-green-500 scale-110 z-20" : ""}`}
      draggable={draggable}
      onDragStart={handleDragStart}
    >
      {hidden || isOpponent ? (
        <img src="/images/back.jpg" alt="Dos de carte" className="w-full h-full object-cover" />
      ) : (
        <img src={`/images/${card?.image || 'front.jpg'}`} alt={card?.name || 'Carte'} className="w-full h-full object-cover" />
      )}
    </div>
  );
}