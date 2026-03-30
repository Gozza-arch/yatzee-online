import { useState } from "react";
import { register } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Register = () => {
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setLoading(true);
    try {
      await register(pseudo, password);
      navigate("/");
    } catch {
      setError("Pseudo déjà pris ou invalide");
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
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "30px" }}>Crée ton compte pour jouer</p>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: "#ff6b6b", marginBottom: "16px", background: "rgba(255,107,107,0.1)", padding: "10px", borderRadius: "8px" }}
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input
            type="text"
            placeholder="Choisis un pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe (6 caractères min)"
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
            {loading ? "Création..." : "🎮 Créer mon compte"}
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "rgba(255,255,255,0.5)" }}>
          Déjà un compte ?{" "}
          <Link to="/login" style={{ color: "#7c6af7", fontWeight: 700, textDecoration: "none" }}>
            Se connecter
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;