'use client';

import { useGameContext } from '@/context/GameContext';
import { useBetsLeaderboard } from '@/hooks/useBetsLeaderboard';
import styles from './AdminStatsBlock.module.css';

export function AdminStatsBlock() {
  const { dbSessionId, betsVersion } = useGameContext();
  const { bets, loading } = useBetsLeaderboard(dbSessionId, betsVersion);

  return (
    <section className={styles.block}>
      <h2 className={styles.title}>Статистика / Лидеры</h2>
      <div className={styles.tableWrap}>
        {loading && <p className={styles.hint}>Загрузка…</p>}
        {!loading && !dbSessionId && <p className={styles.hint}>Запустите раунд (СТАРТ)</p>}
        {!loading && dbSessionId && bets.length === 0 && <p className={styles.hint}>Ставок пока нет</p>}
        {bets.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr><th>ID</th><th>Ставка ($)</th><th>Дата / время</th></tr>
            </thead>
            <tbody>
              {bets.map((b) => (
                <tr key={b.id}>
                  <td>{b.player_id}</td>
                  <td className={styles.amount}>{b.amount.toLocaleString('en-US')}</td>
                  <td>{new Date(b.created_at).toLocaleString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
