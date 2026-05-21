import confetti from 'canvas-confetti';

export function triggerWinConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  const colors = ['#d4af37', '#3469fe']; // Gold and Blue

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 1 },
      colors: colors,
      zIndex: 100,
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 1 },
      colors: colors,
      zIndex: 100,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
  
  // Rain from top
  confetti({
    particleCount: 150,
    spread: 120,
    origin: { y: 0 },
    colors: colors,
    gravity: 0.8,
    zIndex: 100,
  });
}
