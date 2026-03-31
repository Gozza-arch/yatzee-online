let audioCtx = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
};

const playTone = (freq, duration, volume = 0.3, delay = 0) => {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = freq;
    osc.type = "sine";
    gain.gain.setValueAtTime(volume, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

export const playVictory = () => {
  playTone(523, 0.15, 0.3, 0);
  playTone(659, 0.15, 0.3, 0.15);
  playTone(784, 0.15, 0.3, 0.3);
  playTone(1047, 0.4, 0.4, 0.45);
};

export const playDefeat = () => {
  playTone(400, 0.2, 0.3, 0);
  playTone(350, 0.2, 0.3, 0.2);
  playTone(280, 0.4, 0.3, 0.4);
};

export const playYahtzee = () => {
  [523, 659, 784, 1047, 1200].forEach((freq, i) => {
    playTone(freq, 0.2, 0.4, i * 0.1);
  });
  playTone(1500, 0.6, 0.5, 0.6);
};