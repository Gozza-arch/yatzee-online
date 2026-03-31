import confetti from "canvas-confetti";

export const launchVictoryConfetti = () => {
  const duration = 3000;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#7c6af7", "#2ed573", "#ffd700"],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#7c6af7", "#2ed573", "#ffd700"],
    });

    if (Date.now() < end) requestAnimationFrame(frame);
  };

  frame();
};

export const launchYahtzeeConfetti = () => {
  confetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.4 },
    colors: ["#ffd700", "#ff6b6b", "#7c6af7", "#2ed573"],
    startVelocity: 40,
  });
};