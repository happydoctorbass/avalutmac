import styles from './AdminStatsBlock.module.css';

const BARS = [42, 68, 55, 82, 48, 71, 60, 88, 52, 76];

export function AdminStatsBlock() {
  return (
    <section className={styles.block}>
      <h2 className={styles.title}>Статистика</h2>
      <div className={styles.chartWrap}>
        <svg className={styles.chart} viewBox="0 0 280 120" aria-hidden>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-accent-gold)" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          {BARS.map((h, i) => (
            <rect
              key={i}
              x={8 + i * 27}
              y={110 - h}
              width="18"
              height={h}
              rx="3"
              fill="url(#barGrad)"
              opacity="0.55"
            />
          ))}
          <polyline
            className={styles.line}
            points="17,75 44,52 71,58 98,38 125,48 152,32 179,42 206,28 233,36 260,22"
            fill="none"
            stroke="var(--color-accent-gold)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className={styles.notice}>Статистика ещё находится в разработке</p>
    </section>
  );
}
