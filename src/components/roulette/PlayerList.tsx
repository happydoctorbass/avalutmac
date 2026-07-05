import { useMemo } from 'react';
import { useRouletteContext } from '@/context/RouletteContext';
import { Player } from '@/types/roulette';
import styles from './PlayerList.module.css';

export function PlayerList() {
  const { bets } = useRouletteContext();

  const players = useMemo(() => {
    const pMap = new Map<string, Player>();
    bets.forEach(bet => {
      if (!pMap.has(bet.player_id)) {
        pMap.set(bet.player_id, { player_id: bet.player_id, bets: [] });
      }
      pMap.get(bet.player_id)!.bets.push(bet);
    });
    return Array.from(pMap.values()).sort((a, b) => {
      // Sort by latest bet or just ID
      return a.player_id.localeCompare(b.player_id);
    });
  }, [bets]);

  const isManyPlayers = players.length > 15;

  return (
    <div className={`${styles.container} ${isManyPlayers ? styles.compact : ''}`}>
      <h2 className={styles.title}>Игроки & Ставки</h2>
      
      {players.length === 0 && (
        <div className={styles.empty}>Ставок пока нет</div>
      )}

      <div className={styles.list}>
        {players.map(player => (
          <div key={player.player_id} className={styles.playerRow}>
            <div className={styles.playerName}>{player.player_id}</div>
            <div className={styles.betsList}>
              {player.bets.map(bet => (
                <div 
                  key={bet.id} 
                  className={styles.betIndicator}
                  style={{ backgroundColor: bet.color }}
                >
                  {bet.number}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
