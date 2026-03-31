import { db } from "../firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  getDoc,
  increment,
} from "firebase/firestore";

export const createGame = async (playerUid, playerPseudo, mode = "classic") => {
  const isTriple = mode === "triple";
  const gameRef = await addDoc(collection(db, "games"), {
    status: "waiting",
    mode,
    players: {
      [playerUid]: {
        pseudo: playerPseudo,
        scores: isTriple ? { grid1: {}, grid2: {}, grid3: {} } : {},
        ready: true
      },
    },
    currentTurn: playerUid,
    dice: [1, 1, 1, 1, 1],
    kept: [false, false, false, false, false],
    rollsLeft: 3,
    createdAt: new Date(),
  });
  return gameRef.id;
};

// Rejoindre une partie existante
export const joinGame = async (gameId, playerUid, playerPseudo) => {
  const gameRef = doc(db, "games", gameId);
  const gameSnap = await getDoc(gameRef);

  if (!gameSnap.exists()) throw new Error("Partie introuvable");
  const game = gameSnap.data();
  if (Object.keys(game.players).length >= 2) throw new Error("Partie pleine");

  const isTriple = game.mode === "triple";
await updateDoc(gameRef, {
  [`players.${playerUid}`]: {
    pseudo: playerPseudo,
    scores: isTriple ? { grid1: {}, grid2: {}, grid3: {} } : {},
    ready: true
  },
  status: "playing",
});
};

// Écouter les changements d'une partie en temps réel
export const listenToGame = (gameId, callback) => {
  const gameRef = doc(db, "games", gameId);
  return onSnapshot(gameRef, (snap) => {
    if (snap.exists()) callback({ id: snap.id, ...snap.data() });
  });
};

// Mettre à jour l'état des dés
export const updateDice = async (gameId, dice, kept, rollsLeft) => {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, { dice, kept, rollsLeft });
};

// Enregistrer un score et passer au joueur suivant
export const saveScore = async (gameId, playerUid, category, score, players) => {
  const gameRef = doc(db, "games", gameId);
  const playerIds = Object.keys(players);
  const nextPlayer = playerIds.find((id) => id !== playerUid) || playerUid;

  await updateDoc(gameRef, {
    [`players.${playerUid}.scores.${category}`]: score,
    currentTurn: nextPlayer,
    dice: [1, 1, 1, 1, 1],
    kept: [false, false, false, false, false],
    rollsLeft: 3,
  });
};
// Mettre à jour les stats des joueurs après une partie
export const updatePlayerStats = async (winnerUid, loserUid) => {
  const winnerRef = doc(db, "players", winnerUid);
  const loserRef = doc(db, "players", loserUid);

  await updateDoc(winnerRef, {
    victories: increment(1),
    totalGames: increment(1),
  });

  await updateDoc(loserRef, {
    defeats: increment(1),
    totalGames: increment(1),
  });
};
// Quitter une partie
export const leaveGame = async (gameId) => {
  const gameRef = doc(db, "games", gameId);
  await updateDoc(gameRef, {
    status: "abandoned",
  });
};
// Sauvegarder un score en mode triple
export const saveTripleScore = async (gameId, playerUid, category, score, grid, players) => {
  const gameRef = doc(db, "games", gameId);
  const playerIds = Object.keys(players);
  const nextPlayer = playerIds.find((id) => id !== playerUid) || playerUid;

  // Vérifier si toutes les grilles du joueur actif sont complètes
  const currentGrids = players[playerUid].scores;
  const updatedGrid = { ...currentGrids[grid], [category]: score };

  const totalCategories = 13;
  const allComplete = ["grid1", "grid2", "grid3"].every(g =>
    Object.keys(g === grid ? updatedGrid : currentGrids[g] || {}).length === totalCategories
  );

  await updateDoc(gameRef, {
    [`players.${playerUid}.scores.${grid}.${category}`]: score,
    currentTurn: allComplete ? playerUid : nextPlayer,
    dice: [1, 1, 1, 1, 1],
    kept: [false, false, false, false, false],
    rollsLeft: 3,
  });
};