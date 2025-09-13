export const Leaderboard = ({ completedFamilies, players, currentPlayer }) => {
  // Calculate scores for each player
  const scores = players.map(player => ({
    name: player,
    families: completedFamilies[player] || [],
    count: (completedFamilies[player] || []).length,
    isActive: player === currentPlayer
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg shadow-lg p-4 min-w-[250px]">
      <h3 className="text-lg font-bold mb-3 text-gray-800">🏆 Familles Complétées</h3>
      
      <div className="space-y-2">
        {scores.map((player, index) => (
          <div 
            key={player.name}
            className={`flex items-center justify-between p-2 rounded ${
              player.isActive ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {index === 0 && player.count > 0 ? '🥇' : 
                 index === 1 && player.count > 0 ? '🥈' : 
                 index === 2 && player.count > 0 ? '🥉' : '👤'}
              </span>
              <div>
                <div className="font-semibold text-gray-800">
                  {player.name}
                  {player.isActive && <span className="text-xs ml-1 text-yellow-600">(joue)</span>}
                </div>
                {player.families.length > 0 && (
                  <div className="text-xs text-gray-600">
                    {player.families.join(', ')}
                  </div>
                )}
              </div>
            </div>
            <div className="text-xl font-bold text-gray-800">
              {player.count}/7
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-300">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total complétées:</span>
          <span className="font-bold">
            {Object.values(completedFamilies).flat().length}/7
          </span>
        </div>
      </div>
    </div>
  );
};