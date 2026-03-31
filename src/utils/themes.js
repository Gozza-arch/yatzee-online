export const THEMES = {
  default: {
    id: "default",
    label: "Cosmos",
    background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
    accent: "#7c6af7",
    preview: "🌌",
  },
  ocean: {
    id: "ocean",
    label: "Océan",
    background: "linear-gradient(135deg, #0a1628, #0d3b6e, #1a6b8a)",
    accent: "#00b4d8",
    preview: "🌊",
  },
  forest: {
    id: "forest",
    label: "Forêt",
    background: "linear-gradient(135deg, #0a1a0a, #1a3a1a, #2d5a2d)",
    accent: "#2ed573",
    preview: "🌲",
  },
  sunset: {
    id: "sunset",
    label: "Coucher de soleil",
    background: "linear-gradient(135deg, #1a0a0a, #6b1a1a, #c0392b)",
    accent: "#ff6b6b",
    preview: "🌅",
  },
  gold: {
    id: "gold",
    label: "Or",
    background: "linear-gradient(135deg, #1a1400, #3d3000, #6b5400)",
    accent: "#ffd700",
    preview: "✨",
  },
  midnight: {
    id: "midnight",
    label: "Minuit",
    background: "linear-gradient(135deg, #000000, #0a0a0a, #111111)",
    accent: "#ffffff",
    preview: "🌑",
  },
};

export const AVATARS = [
  { id: "🎲", label: "Dé" },
  { id: "🦁", label: "Lion" },
  { id: "🐯", label: "Tigre" },
  { id: "🦊", label: "Renard" },
  { id: "🐺", label: "Loup" },
  { id: "🦅", label: "Aigle" },
  { id: "🐉", label: "Dragon" },
  { id: "🦄", label: "Licorne" },
  { id: "🐸", label: "Grenouille" },
  { id: "🤖", label: "Robot" },
  { id: "👻", label: "Fantôme" },
  { id: "🎭", label: "Masque" },
  { id: "🔥", label: "Feu" },
  { id: "⚡", label: "Éclair" },
  { id: "💎", label: "Diamant" },
  { id: "🌙", label: "Lune" },
];

export const getTheme = () => {
  return localStorage.getItem("yahtzee_theme") || "default";
};

export const setTheme = (themeId) => {
  localStorage.setItem("yahtzee_theme", themeId);
};

export const getAvatar = () => {
  return localStorage.getItem("yahtzee_avatar") || "🎲";
};

export const setAvatar = (avatarId) => {
  localStorage.setItem("yahtzee_avatar", avatarId);
};