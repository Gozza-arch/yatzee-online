import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createGame, joinGame } from "../utils/gameManager";

const Lobby = () => {
  const { currentUser, playerProfile } = useAuth();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const id = await createGame(currentUser.uid, playerProfile.pseudo);
      navigate(`/game/${id}`);
    } catch {
      setError("Erreur lors de la création de la partie");
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!gameId.trim()) return;
    setLoading(true);
    try {
      await joinGame(gameId.trim(), currentUser.uid, playerProfile.pseudo);
      navigate(`/game/${gameId.trim()}`);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
      <h1>🎲 Yahtzee</h1>
      <h2>Bienvenue {playerProfile?.pseudo} !</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ margin: "40px 0" }}>
        <button
          onClick={handleCreate}
          disabled={loading}
          style={{ padding: "12px 30px", fontSize: "16px", cursor: "pointer", marginBottom: "20px", display: "block", margin: "0 auto 20px" }}
        >
          🎮 Créer une partie
        </button>

        <p>— ou —</p>

        <input
          type="text"
          placeholder="ID de la partie"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          style={{ padding: "8px", marginRight: "10px", fontSize: "16px" }}
        />
        <button
          onClick={handleJoin}
          disabled={loading}
          style={{ padding: "8px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Rejoindre
        </button>
      </div>
    </div>
  );
};

export default Lobby;