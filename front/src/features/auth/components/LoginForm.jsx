import { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';

export const LoginForm = ({ onLogin, onDemo, playerCount, playerList, isLoading, error }) => {
  const [pseudo, setPseudo] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pseudo.trim()) {
      onLogin(pseudo.trim());
    }
  };
  
  if (error) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-white text-2xl font-bold p-8 rounded bg-red-700 shadow-lg">
          Erreur de connexion au serveur. Vérifiez que le serveur est bien lancé sur localhost:4000.
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          className="px-4 py-2 rounded text-lg mb-2 border-2 border-gray-300 focus:border-green-500 focus:outline-none"
          type="text"
          placeholder="Entrez votre pseudo"
          value={pseudo}
          onChange={(e) => setPseudo(e.target.value)}
          maxLength={20}
          autoFocus
        />
        
        <Button
          type="submit"
          disabled={!pseudo.trim() || isLoading}
          size="lg"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : 'Se connecter au jeu'}
        </Button>
      </form>
      
      <Button
        variant="info"
        onClick={onDemo}
        disabled={isLoading}
      >
        Accès direct au jeu (démo)
      </Button>
      
      <div className="text-white text-lg font-semibold">
        Joueurs dans la partie : {playerCount}
      </div>
      
      <ul className="text-white text-base mt-2">
        {playerList.length > 0 ? (
          playerList.map((player, idx) => (
            <li key={idx}>• {player}</li>
          ))
        ) : (
          <li className="italic text-gray-200">Aucun joueur connecté</li>
        )}
      </ul>
    </div>
  );
};