import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createGame, joinGame } from "../utils/gameManager";
import { logout } from "../utils/auth";
import { BADGES } from "../utils/badges";
import { motion } from "framer-motion";

const Lobby = () => {
  const { currentUser, playerProfile } = useAuth();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("classic");

  const handleCreate = async () => {
    setLoading(true);
    try {
      const id = await createGame(currentUser.uid, playerProfile.pseudo, mode, playerProfile.avatar || "🎲");
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
      await joinGame(gameId.trim(), currentUser.uid, playerProfile.pseudo, playerProfile.avatar || "🎲");
      navigate(`/game/${gameId.trim()}`);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const playerBadges = (playerProfile?.badges || []).map((id) => BADGES[id]).filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}
      >
        <div style={{ fontSize: "70px", marginBottom: "10px" }}>🎲</div>
        <h1 style={{ fontSize: "42px", fontWeight: 900, marginBottom: "4px" }}>Yahtzee</h1>
        <h2 style={{ fontSize: "20px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
  {playerProfile?.avatar || "🎲"} Bienvenue {playerProfile?.pseudo} !
</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>
          {playerProfile?.victories || 0} victoires 🏆 · {playerProfile?.totalGames || 0} parties 🎮
        </p>

        {/* Badges */}
        {playerBadges.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
              {playerBadges.map((badge) => (
                <div
                  key={badge.id}
                  title={badge.description}
                  style={{
                    background: "rgba(255,215,0,0.1)",
                    border: "1px solid rgba(255,215,0,0.3)",
                    borderRadius: "20px",
                    padding: "4px 12px",
                    fontSize: "13px",
                  }}
                >
                  {badge.icon} {badge.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <p style={{ color: "#ff6b6b", marginBottom: "16px", background: "rgba(255,107,107,0.1)", padding: "10px", borderRadius: "8px" }}>
            {error}
          </p>
        )}

        {/* Créer une partie */}
        <div style={{ marginBottom: "16px" }}>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginBottom: "10px" }}>Mode de jeu :</p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            {[
              { id: "classic", label: "🎲 Classique", desc: "1 grille" },
              { id: "triple", label: "🎲🎲🎲 Triple", desc: "3 grilles x1 x2 x3" },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setMode(m.id)}
                style={{
                  padding: "10px 20px", borderRadius: "12px", cursor: "pointer",
                  background: mode === m.id ? "linear-gradient(135deg, rgba(124,106,247,0.5), rgba(90,79,207,0.5))" : "rgba(255,255,255,0.05)",
                  border: mode === m.id ? "2px solid rgba(124,106,247,0.8)" : "2px solid rgba(255,255,255,0.1)",
                  textAlign: "center", transition: "all 0.2s",
                }}
              >
                <div style={{ fontWeight: 800, fontSize: "15px" }}>{m.label}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleCreate}
          disabled={loading}
          style={{
            width: "100%", padding: "16px", fontSize: "18px",
            background: "linear-gradient(135deg, #7c6af7, #5a4fcf)",
            color: "white", marginBottom: "20px",
          }}
        >
          🎮 Créer une partie
        </motion.button>

        <p style={{ color: "rgba(255,255,255,0.3)", marginBottom: "20px" }}>— ou rejoindre une partie —</p>

        {/* Rejoindre une partie */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          <input
            type="text"
            placeholder="ID de la partie"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            style={{ flex: 1 }}
          />
          <button
            onClick={handleJoin}
            disabled={loading}
            style={{
              padding: "12px 20px", fontSize: "16px",
              background: "rgba(255,255,255,0.1)",
              color: "white",
            }}
          >
            Rejoindre
          </button>
        </div>

        {/* Boutons bas */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/leaderboard")}
            style={{
              flex: 1, padding: "12px",
              background: "rgba(255,255,255,0.08)",
              color: "white", fontSize: "15px",
            }}
          >
            🏆 Classement
          </button>
          <button
  onClick={() => navigate("/profile")}
  style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.08)", color: "white", fontSize: "15px" }}
>
  🎨 Mon profil
</button>
          <button
            onClick={handleLogout}
            style={{
              flex: 1, padding: "12px",
              background: "rgba(192,57,43,0.6)",
              color: "white", fontSize: "15px",
            }}
          >
            🚪 Déconnexion
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Lobby;