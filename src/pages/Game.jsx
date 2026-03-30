import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { rollDice, calculateScores, CATEGORY_NAMES } from "../utils/yahtzee";
import { listenToGame, updateDice, saveScore, updatePlayerStats } from "../utils/gameManager";
import { checkAndAwardBadges } from "../utils/badges";
import BadgeNotification from "../components/BadgeNotification";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_CATEGORIES = Object.keys(CATEGORY_NAMES).length;

const diceFaces = [
  [[false,false,false],[false,true,false],[false,false,false]],
  [[true,false,false],[false,false,false],[false,false,true]],
  [[true,false,false],[false,true,false],[false,false,true]],
  [[true,false,true],[false,false,false],[true,false,true]],
  [[true,false,true],[false,true,false],[true,false,true]],
  [[true,false,true],[true,false,true],[true,false,true]],
];

const Die = ({ value, kept, onClick, isMyTurn, rolling }) => (
  <motion.div
    onClick={onClick}
    whileHover={isMyTurn ? { scale: 1.1 } : {}}
    whileTap={isMyTurn ? { scale: 0.9 } : {}}
    className={rolling && !kept ? "die-shake" : ""}
    style={{
      width: "70px",
      height: "70px",
      background: kept
        ? "linear-gradient(135deg, #f0c040, #e6a800)"
        : "linear-gradient(135deg, #ffffff, #e8e8e8)",
      borderRadius: "14px",
      cursor: isMyTurn ? "pointer" : "default",
      border: kept ? "3px solid #c8860a" : "3px solid #ccc",
      boxShadow: kept
        ? "0 0 20px rgba(240,192,64,0.5), inset 0 2px 4px rgba(255,255,255,0.4)"
        : "0 6px 20px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.8)",
      display: "grid",
      gridTemplateRows: "repeat(3, 1fr)",
      padding: "10px",
      gap: "3px",
    }}
  >
    {diceFaces[value - 1].map((row, rowIndex) => (
      <div key={rowIndex} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3px" }}>
        {row.map((dot, colIndex) => (
          <div
            key={colIndex}
            style={{
              borderRadius: "50%",
              background: dot ? (kept ? "#5a3e00" : "#1a1a2e") : "transparent",
              width: "100%",
              aspectRatio: "1",
              boxShadow: dot ? "0 1px 3px rgba(0,0,0,0.3)" : "none",
            }}
          />
        ))}
      </div>
    ))}
  </motion.div>
);

const Game = () => {
  const { gameId } = useParams();
  const { currentUser, playerProfile } = useAuth();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [currentScores, setCurrentScores] = useState({});
  const [newBadges, setNewBadges] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rolling, setRolling] = useState(false);

  const checkGameOver = useCallback(async (gameData) => {
    const players = Object.entries(gameData.players);
    const allDone = players.every(([, player]) =>
      Object.keys(player.scores).length === TOTAL_CATEGORIES
    );

    if (allDone && !gameOver) {
      setGameOver(true);
      const scores = players.map(([uid, player]) => ({
        uid,
        total: Object.values(player.scores).reduce((a, b) => a + b, 0),
      }));
      const winnerData = scores.reduce((a, b) => (a.total > b.total ? a : b));
      const loserData = scores.reduce((a, b) => (a.total < b.total ? a : b));
      setWinner(winnerData);

      await updatePlayerStats(winnerData.uid, loserData.uid);

      const myScores = gameData.players[currentUser.uid]?.scores || {};
      const isWinner = winnerData.uid === currentUser.uid;
      const victories = (playerProfile?.victories || 0) + (isWinner ? 1 : 0);
      const awarded = await checkAndAwardBadges(currentUser.uid, myScores, isWinner, victories);
      if (awarded.length > 0) setNewBadges(awarded);
    }
  }, [gameOver, currentUser.uid, playerProfile]);

  useEffect(() => {
    const unsubscribe = listenToGame(gameId, (gameData) => {
      setGame(gameData);
      if (gameData.rollsLeft < 3) {
        setCurrentScores(calculateScores(gameData.dice));
      }
      if (gameData.status === "playing") {
        checkGameOver(gameData);
      }
    });
    return unsubscribe;
  }, [gameId, checkGameOver]);

  if (!game) return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px", fontSize: "20px" }}>
      🎲 Chargement...
    </div>
  );

  const isMyTurn = game.currentTurn === currentUser.uid;
  const myScores = game.players[currentUser.uid]?.scores || {};
  const players = Object.entries(game.players);
  const shareLink = `${window.location.origin}/game/${gameId}`;

  const handleRoll = async () => {
    if (!isMyTurn || game.rollsLeft === 0) return;
    setRolling(true);
    setTimeout(() => setRolling(false), 500);
    const newDice = rollDice(game.dice, game.kept);
    await updateDice(gameId, newDice, game.kept, game.rollsLeft - 1);
  };

  const toggleKeep = async (i) => {
    if (!isMyTurn || game.rollsLeft === 3) return;
    const newKept = [...game.kept];
    newKept[i] = !newKept[i];
    await updateDice(gameId, game.dice, newKept, game.rollsLeft);
  };

  const selectCategory = async (category) => {
    if (!isMyTurn || myScores[category] !== undefined || game.rollsLeft === 3) return;
    await saveScore(gameId, currentUser.uid, category, currentScores[category], game.players);
    setCurrentScores({});
  };

  const totalScore = Object.values(myScores).reduce((a, b) => a + b, 0);

  return (
    <div style={{ minHeight: "100vh", padding: "20px", maxWidth: "600px", margin: "0 auto" }}>

      {newBadges.length > 0 && (
        <BadgeNotification badges={newBadges} onClose={() => setNewBadges([])} />
      )}

      <h1 style={{ textAlign: "center", fontSize: "32px", fontWeight: 900, marginBottom: "20px" }}>
        🎲 Yahtzee
      </h1>

      {/* Fin de partie */}
      <AnimatePresence>
        {gameOver && winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: winner.uid === currentUser.uid
                ? "linear-gradient(135deg, rgba(46,213,115,0.2), rgba(46,213,115,0.1))"
                : "linear-gradient(135deg, rgba(255,71,87,0.2), rgba(255,71,87,0.1))",
              border: `1px solid ${winner.uid === currentUser.uid ? "rgba(46,213,115,0.5)" : "rgba(255,71,87,0.5)"}`,
              padding: "24px", borderRadius: "16px", textAlign: "center", marginBottom: "20px"
            }}
          >
            <p style={{ fontSize: "48px" }}>{winner.uid === currentUser.uid ? "🏆" : "😢"}</p>
            <h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
              {winner.uid === currentUser.uid ? "Tu as gagné !" : "Tu as perdu !"}
            </h2>
            <button
              onClick={() => navigate("/")}
              style={{
                padding: "12px 30px", fontSize: "16px",
                background: "rgba(255,255,255,0.15)", color: "white"
              }}
            >
              🏠 Retour au lobby
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* En attente */}
      {game.status === "waiting" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "20px", borderRadius: "16px", textAlign: "center", marginBottom: "20px"
          }}
        >
          <p style={{ fontSize: "18px", marginBottom: "10px" }}>⏳ En attente d'un adversaire...</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "8px" }}>Partage ce lien :</p>
          <p style={{
            fontSize: "12px", background: "rgba(0,0,0,0.3)",
            padding: "10px", borderRadius: "8px", wordBreak: "break-all", marginBottom: "10px"
          }}>
            {shareLink}
          </p>
          <button
            onClick={() => navigator.clipboard.writeText(shareLink)}
            style={{ padding: "8px 20px", background: "rgba(124,106,247,0.5)", color: "white" }}
          >
            📋 Copier le lien
          </button>
        </motion.div>
      )}

      {/* Scores joueurs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        {players.map(([uid, player]) => (
          <div key={uid} style={{
            flex: 1, padding: "14px",
            background: uid === game.currentTurn
              ? "linear-gradient(135deg, rgba(124,106,247,0.3), rgba(90,79,207,0.3))"
              : "rgba(255,255,255,0.05)",
            borderRadius: "14px",
            border: uid === game.currentTurn
              ? "1px solid rgba(124,106,247,0.5)"
              : "1px solid rgba(255,255,255,0.05)",
            textAlign: "center",
          }}>
            <p style={{ fontWeight: 700 }}>{uid === game.currentTurn ? "🎯 " : ""}{player.pseudo}</p>
            <p style={{ fontSize: "22px", fontWeight: 900 }}>
              {Object.values(player.scores).reduce((a, b) => a + b, 0)} pts
            </p>
          </div>
        ))}
      </div>

      {/* Dés */}
      <div style={{ display: "flex", justifyContent: "center", gap: "12px", margin: "24px 0" }}>
        {game.dice.map((die, i) => (
          <Die
            key={i}
            value={die}
            kept={game.kept[i]}
            onClick={() => toggleKeep(i)}
            isMyTurn={isMyTurn}
            rolling={rolling}
          />
        ))}
      </div>

      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)", marginBottom: "12px" }}>
        {isMyTurn ? `Lancers restants : ${game.rollsLeft}` : "⏳ Tour de l'adversaire..."}
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleRoll}
        disabled={!isMyTurn || game.rollsLeft === 0}
        style={{
          width: "100%", padding: "14px", fontSize: "18px",
          background: isMyTurn && game.rollsLeft > 0
            ? "linear-gradient(135deg, #7c6af7, #5a4fcf)"
            : "rgba(255,255,255,0.1)",
          color: "white", marginBottom: "24px",
        }}
      >
        🎲 Lancer {game.rollsLeft > 0 ? `(${game.rollsLeft} restants)` : "(plus de lancers)"}
      </motion.button>

      {/* Feuille de score */}
      <h2 style={{ textAlign: "center", marginBottom: "12px", fontSize: "20px" }}>
        Ta feuille de score — {totalScore} pts
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {Object.entries(CATEGORY_NAMES).map(([key, label]) => (
          <motion.div
            key={key}
            onClick={() => selectCategory(key)}
            whileHover={isMyTurn && myScores[key] === undefined ? { scale: 1.02, x: 4 } : {}}
            style={{
              padding: "10px 16px",
              background: myScores[key] !== undefined
                ? "rgba(46,213,115,0.15)"
                : "rgba(255,255,255,0.05)",
              borderRadius: "10px",
              border: myScores[key] !== undefined
                ? "1px solid rgba(46,213,115,0.3)"
                : "1px solid rgba(255,255,255,0.05)",
              cursor: isMyTurn && myScores[key] === undefined ? "pointer" : "default",
              display: "flex", justifyContent: "space-between",
              opacity: myScores[key] !== undefined ? 0.8 : 1,
            }}
          >
            <span>{label}</span>
            <span style={{
              fontWeight: 700,
              color: myScores[key] !== undefined ? "#2ed573" :
                     currentScores[key] !== undefined ? "#ffd700" : "rgba(255,255,255,0.3)"
            }}>
              {myScores[key] !== undefined
                ? myScores[key]
                : currentScores[key] !== undefined
                ? `+${currentScores[key]}`
                : "-"}
            </span>
          </motion.div>
        ))}
      </div>

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px", width: "100%", padding: "12px",
          background: "rgba(255,255,255,0.08)", color: "white", fontSize: "15px"
        }}
      >
        🏠 Retour au lobby
      </button>
    </div>
  );
};

export default Game;