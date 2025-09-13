import Card from "./Card";

export default function Deck({ cards = [] }) {
  return (
    <div className="deck-3d flex flex-col items-center">
      <span className="mb-4 text-lg font-bold bg-white bg-opacity-80 px-3 py-1 rounded shadow border border-gray-300">
        {cards.length} cartes
      </span>
      <div className="relative">
        {cards.slice(0, 4).map((card, idx) => (
          <div key={idx} className={`absolute ${idx === 3 ? "translate-x-1 translate-y-1" : ""}`}>
            <Card hidden={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
