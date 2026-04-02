import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLeaderboard, getLeaderboardByPoints, getLeaderboardTriple, getLeaderboardTriplePoints  } from "../utils/ranking";

const TABS = [
  { id: "victories", label: "🏆 Victoires" },
  { id: "points", label: "⭐ Points" },
  { id: "triple", label: "🎲🎲🎲 Triple victoires" },
  { id: "triplePoints", label: "🎲🎲🎲 Triple points" },
];

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("victories");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      let data;
      if (activeTab === "victories") data = await getLeaderboard();
      else if (activeTab === "points") data = await getLeaderboardByPoints();
      else if (activeTab === "triplePoints") data = await getLeaderboardTriplePoints();
      else data = await getLeaderboardTriple();
      setPlayers(data);
      setLoading(false);
      
    };
    fetchLeaderboard();
  }, [activeTab]);

  const medals = ["🥇", "🥈", "🥉"];

  const getStatValue = (player) => {
    if (activeTab === "victories") return `${player.victories || 0} victoires`;
    if (activeTab === "points") return `${player.totalPoints || 0} pts`;
    if (activeTab === "triplePoints") return `${player.triplePoints || 0} pts`;
    return `${player.tripleVictories || 0} victoires`;
  };

  const getSecondary = (player) => {
    if (activeTab === "victories") return `${player.totalGames || 0} parties`;
    if (activeTab === "points") return `${player.totalGames || 0} parties`;
    if (activeTab === "triplePoints") return `${player.tripleGames || 0} parties Triple`;
    return `${player.tripleGames || 0} parties Triple`;
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", fontSize: "36px", fontWeight: 900, marginBottom: "8px" }}>
        🏆 Classement
      </h1>
      <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", marginBottom: "24px" }}>
        Les meilleurs joueurs
      </p>

      {/* Onglets */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "6px" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, padding: "10px", fontSize: "14px", fontWeight: 700,
              background: activeTab === tab.id
                ? "linear-gradient(135deg, #7c6af7, #5a4fcf)"
                : "transparent",
              color: activeTab === tab.id ? "white" : "rgba(255,255,255,0.5)",
              border: "none", borderRadius: "8px",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}>Chargement...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {players.map((player, index) => (
            <div
              key={player.id}
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
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "16px", fontWeight: 800 }}>{player.avatar || "🎲"} {player.pseudo}</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{getSecondary(player)}</div>
              </div>
              <div style={{ fontWeight: 900, fontSize: "18px", color: "#a89af7" }}>
                {getStatValue(player)}
              </div>
            </div>
          ))}

          {players.length === 0 && (
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", marginTop: "40px" }}>
              Aucun joueur pour l'instant 🎲
            </p>
          )}
        </div>
      )}

      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "30px", width: "100%", padding: "14px", background: "rgba(255,255,255,0.08)", color: "white", fontSize: "16px" }}
      >
        🏠 Retour au lobby
      </button>
    </div>
  );
};

export default Leaderboard;