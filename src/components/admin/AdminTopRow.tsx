'use client';

import { GameLanguage } from '@/types/game';
import { AdminInputs } from './AdminInputs';
import { AdminBetBox } from './AdminBetBox';
import { AdminControlBox } from './AdminControlBox';
import styles from './AdminTopRow.module.css';

interface AdminTopRowProps {
  playerId: string;
  betAmount: string;
  language: GameLanguage;
  onPlayerIdChange: (v: string) => void;
  onBetAmountChange: (v: string) => void;
  onLanguageChange: (l: GameLanguage) => void;
  onClearInput: () => void;
  onStart: () => void;
  onStop: () => void;
  onCelebrate: () => void;
}

export function AdminTopRow(props: AdminTopRowProps) {
  const inputValid = props.playerId.trim() !== '' && props.betAmount.trim() !== '';
  return (
    <div className={styles.topRow}>
      <section className={styles.miniBox}>
        <AdminInputs
          playerId={props.playerId} betAmount={props.betAmount} language={props.language}
          onPlayerIdChange={props.onPlayerIdChange} onBetAmountChange={props.onBetAmountChange}
          onLanguageChange={props.onLanguageChange}
        />
      </section>
      <section className={styles.miniBox}>
        <AdminBetBox playerId={props.playerId} betAmount={props.betAmount} inputValid={inputValid} onClear={props.onClearInput} />
      </section>
      <section className={styles.miniBox}>
        <AdminControlBox onStart={props.onStart} onStop={props.onStop} onCelebrate={props.onCelebrate} />
      </section>
    </div>
  );
}
