const families = [
  {
    name: "Anna",
    cards: [
      { name: "Papa", image: "familys/anna/dad.png" },
      { name: "Maman", image: "familys/anna/mom.png" },
      { name: "Frère", image: "familys/anna/brother.png" },
      { name: "Fille", image: "familys/anna/anna.png" }, 
      { name: "Grand-père", image: "familys/anna/grandpa.png" },
      { name: "Grand-mère", image: "familys/anna/grandma.png" },
    ]
  },
  {
    name: "Awariz",
    cards: [
      { name: "Papa", image: "familys/awariz/dad.png" },
      { name: "Maman", image: "familys/awariz/mom.png" },
      { name: "Fils", image: "familys/awariz/awariz.png" },
      { name: "Fille", image: "familys/awariz/sister.png" }, 
      { name: "Grand-père", image: "familys/awariz/grandpa.png" },
      { name: "Grand-mère", image: "familys/awariz/grandma.png" },
    ]
  },
  {
    name: "Carlos",
    cards: [
      { name: "Papa", image: "familys/carlos/dad.png" },
      { name: "Maman", image: "familys/carlos/mom.png" },
      { name: "Fils", image: "familys/carlos/carlos.png" },
      { name: "Fille", image: "familys/carlos/sister.png" }, 
      { name: "Grand-père", image: "familys/carlos/grandpa.png" },
      { name: "Grand-mère", image: "familys/carlos/grandma.png" },
    ]
  },
  {
    name: "Kikoo",
    cards: [
      { name: "Papa", image: "familys/kikoo/dad.png" },
      { name: "Maman", image: "familys/kikoo/mom.png" },
      { name: "Fils", image: "familys/kikoo/kikoo.png" },
      { name: "Fille", image: "familys/kikoo/sister.png" }, 
      { name: "Grand-père", image: "familys/kikoo/grandpa.png" },
      { name: "Grand-mère", image: "familys/kikoo/grandma.png" },
    ]
  },
  {
    name: "Lucy",
    cards: [
      { name: "Papa", image: "familys/lucy/dad.png" },
      { name: "Maman", image: "familys/lucy/mom.png" },
      { name: "Fils", image: "familys/lucy/brother.png" },
      { name: "Fille", image: "familys/lucy/lucy.png" }, 
      { name: "Grand-père", image: "familys/lucy/grandpa.png" },
      { name: "Grand-mère", image: "familys/lucy/grandma.png" },
    ]
  },
  {
    name: "Yoananas",
    cards: [
      { name: "Papa", image: "familys/yoananas/dad.png" },
      { name: "Maman", image: "familys/yoananas/mom.png" },
      { name: "Fils", image: "familys/yoananas/yoananas.png" },
      { name: "Fille", image: "familys/yoananas/sister.png" }, 
      { name: "Grand-père", image: "familys/yoananas/grandpa.png" },
      { name: "Grand-mère", image: "familys/yoananas/grandma.png" },
    ]
  },
  {
    name: "Talcado",
    cards: [
      { name: "Papa", image: "familys/talcado/dad.png" },
      { name: "Maman", image: "familys/talcado/mom.png" },
      { name: "Fils", image: "familys/talcado/talcado.png" },
      { name: "Fille", image: "familys/talcado/sister.png" }, 
      { name: "Grand-père", image: "familys/talcado/grandpa.png" },
      { name: "Grand-mère", image: "familys/talcado/grandma.png" },
    ]
  },
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getAllCards() {
  return families.flatMap(family => 
    family.cards.map(card => ({
      ...card,
      family: family.name
    }))
  );
}

function initializeGame(playerNames) {
  const allCards = shuffle(getAllCards());
  const numPlayers = playerNames.length;
  // Limiter à 7 cartes par joueur au début
  const cardsPerPlayer = 7;
  
  const hands = {};
  let cardIndex = 0;
  
  // Distribuer les cartes aux joueurs
  playerNames.forEach(name => {
    hands[name] = [];
    for (let i = 0; i < cardsPerPlayer && cardIndex < allCards.length; i++) {
      hands[name].push(allCards[cardIndex]);
      cardIndex++;
    }
  });
  
  // Le reste des cartes va dans le deck
  const deck = allCards.slice(cardIndex);
  
  return {
    deck,
    hands,
    currentPlayerIndex: 0,
    currentPlayer: playerNames[0],
    players: playerNames,
    completedFamilies: {},
    turnStartTime: Date.now(),
    status: 'waiting', // waiting, playing, finished
    lastAction: null,
    winner: null
  };
}

function drawCard(gameState, playerName) {
  if (gameState.deck.length === 0) {
    return { success: false, message: "Plus de cartes dans le deck" };
  }
  
  const newState = { ...gameState };
  const card = newState.deck.shift();
  newState.hands[playerName].push(card);
  
  // Check for completed families
  checkCompletedFamilies(newState, playerName);
  
  // Next player's turn
  nextTurn(newState);
  
  return { 
    success: true, 
    gameState: newState, 
    message: `${playerName} a pioché une carte` 
  };
}

function askForCard(gameState, askingPlayer, targetPlayer, card) {
  const targetHand = gameState.hands[targetPlayer];
  const cardIndex = targetHand.findIndex(c => 
    c.name === card.name && c.family === card.family
  );
  
  const newState = { ...gameState };
  
  if (cardIndex !== -1) {
    // Card found - transfer it
    const [takenCard] = newState.hands[targetPlayer].splice(cardIndex, 1);
    newState.hands[askingPlayer].push(takenCard);
    
    // Check for completed families
    checkCompletedFamilies(newState, askingPlayer);
    
    // Player continues their turn
    newState.turnStartTime = Date.now();
    
    return {
      success: true,
      cardFound: true,
      gameState: newState,
      message: `${askingPlayer} a obtenu ${card.name} de la famille ${card.family} de ${targetPlayer}`
    };
  } else {
    // Card not found - player must draw
    return {
      success: true,
      cardFound: false,
      gameState: newState,
      message: `${targetPlayer} n'a pas la carte demandée. ${askingPlayer} doit piocher.`
    };
  }
}

function checkCompletedFamilies(gameState, playerName) {
  const hand = gameState.hands[playerName];
  
  families.forEach(family => {
    // Check if player has all cards of this family
    const hasAllCards = family.cards.every(card =>
      hand.some(handCard => 
        handCard.name === card.name && handCard.family === family.name
      )
    );
    
    if (hasAllCards && !gameState.completedFamilies[playerName]?.includes(family.name)) {
      // Initialize array if needed
      if (!gameState.completedFamilies[playerName]) {
        gameState.completedFamilies[playerName] = [];
      }
      
      // Add completed family
      gameState.completedFamilies[playerName].push(family.name);
      
      // Remove family cards from hand
      gameState.hands[playerName] = hand.filter(card => card.family !== family.name);
      
      // Check for game end
      const totalCompleted = Object.values(gameState.completedFamilies)
        .reduce((sum, families) => sum + families.length, 0);
      
      if (totalCompleted === families.length) {
        gameState.status = 'finished';
        gameState.winner = getWinner(gameState);
      }
    }
  });
  
  // Alternative end condition: if deck is empty and all players have empty hands
  if (gameState.deck.length === 0) {
    const allHandsEmpty = Object.values(gameState.hands).every(hand => hand.length === 0);
    if (allHandsEmpty && gameState.status !== 'finished') {
      gameState.status = 'finished';
      gameState.winner = getWinner(gameState);
    }
  }
}

function getWinner(gameState) {
  let maxFamilies = 0;
  let winners = [];
  
  // Find the maximum number of families completed
  Object.entries(gameState.completedFamilies).forEach(([player, families]) => {
    if (families.length > maxFamilies) {
      maxFamilies = families.length;
      winners = [player];
    } else if (families.length === maxFamilies && maxFamilies > 0) {
      winners.push(player);
    }
  });
  
  // Handle ties
  if (winners.length === 0) {
    return "Personne"; // No one completed any families
  } else if (winners.length === 1) {
    return winners[0];
  } else {
    return `Égalité entre ${winners.join(' et ')}`; // Tie between multiple players
  }
}

function nextTurn(gameState) {
  gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
  gameState.currentPlayer = gameState.players[gameState.currentPlayerIndex];
  gameState.turnStartTime = Date.now();
}

function isPlayerTurn(gameState, playerName) {
  return gameState.currentPlayer === playerName;
}

function canStartGame(playerNames) {
  return playerNames.length >= 2 && playerNames.length <= 4;
}

module.exports = {
  initializeGame,
  drawCard,
  askForCard,
  nextTurn,
  isPlayerTurn,
  canStartGame,
  checkCompletedFamilies,
  families
};