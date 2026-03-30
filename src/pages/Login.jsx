import { useState } from "react";
import { login } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(pseudo, password);
      navigate("/");
    } catch {
      setError("Pseudo ou mot de passe incorrect");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "40px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "60px", marginBottom: "10px" }}>🎲</div>
        <h1 style={{ fontSize: "32px", fontWeight: 900, marginBottom: "8px" }}>Yahtzee</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "30px" }}>Connecte-toi pour jouer</p>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: "#ff6b6b", marginBottom: "16px", background: "rgba(255,107,107,0.1)", padding: "10px", borderRadius: "8px" }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            placeholder="Ton pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              fontSize: "16px",
              background: "linear-gradient(135deg, #7c6af7, #5a4fcf)",
              color: "white",
              marginTop: "8px",
            }}
          >
            {loading ? "Connexion..." : "🎮 Se connecter"}
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "rgba(255,255,255,0.5)" }}>
          Pas encore de compte ?{" "}
          <Link to="/register" style={{ color: "#7c6af7", fontWeight: 700, textDecoration: "none" }}>
            S'inscrire
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;