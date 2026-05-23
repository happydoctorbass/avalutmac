export function formatRemaining(ms: number): string {
  const t = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${p(h)}:${p(m)}:${p(s)}`;
}

export function finishAtFromMinutes(minutes: number): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}
