import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard } from "../utils/ranking";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getLeaderboard();
      setPlayers(data);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ textAlign: "center", fontSize: "36px", fontWeight: 900, marginBottom: "8px" }}>
          🏆 Classement
        </h1>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", marginBottom: "30px" }}>
          Les meilleurs joueurs
        </p>

        {loading ? (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>Chargement...</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  display: "flex", alignItems: "center", gap: "16px",
                  padding: "14px 20px",
                  background: index === 0 ? "rgba(255,215,0,0.1)" :
                               index === 1 ? "rgba(192,192,192,0.1)" :
                               index === 2 ? "rgba(205,127,50,0.1)" :
                               "rgba(255,255,255,0.05)",
                  borderRadius: "14px",
                  border: index === 0 ? "1px solid rgba(255,215,0,0.3)" :
                          index === 1 ? "1px solid rgba(192,192,192,0.3)" :
                          index === 2 ? "1px solid rgba(205,127,50,0.3)" :
                          "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <span style={{ fontSize: "24px", minWidth: "36px", textAlign: "center" }}>
                  {medals[index] || `#${index + 1}`}
                </span>
                <span style={{ flex: 1, fontSize: "18px", fontWeight: 700 }}>{player.pseudo}</span>
                <span style={{ color: "#4caf50", fontWeight: 700 }}>{player.victories} 🏆</span>
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>{player.totalGames} parties</span>
              </motion.div>
            ))}

            {players.length === 0 && (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: "40px" }}>
                Aucun joueur pour l'instant. Sois le premier ! 🎲
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "30px", width: "100%", padding: "14px",
            background: "rgba(255,255,255,0.08)",
            color: "white", fontSize: "16px",
          }}
        >
          🏠 Retour au lobby
        </button>
      </motion.div>
    </div>
  );
};

export default Leaderboard;