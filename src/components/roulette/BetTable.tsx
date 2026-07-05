import { motion } from 'framer-motion';
import { ROULETTE_NUMBERS, ACTION_NUMBERS } from '@/types/roulette';
import { useRouletteContext } from '@/context/RouletteContext';
import { BetChip } from './BetChip';
import styles from './BetTable.module.css';

interface BetTableProps {
  onCellClick?: (number: number) => void;
  isAdmin?: boolean;
}

export function BetTable({ onCellClick, isAdmin = false }: BetTableProps) {
  const { bets } = useRouletteContext();

  const zeroCell = ROULETTE_NUMBERS.find(n => n.number === 0)!;
  const gridCells = ROULETTE_NUMBERS.filter(n => n.number !== 0);

  const renderCell = (cell: typeof zeroCell, isZero = false) => {
    const bet = bets.find(b => b.number === cell.number);
    const isAction = ACTION_NUMBERS.includes(cell.number);

    let bgColorClass = styles.blackCell;
    if (cell.color === 'red') bgColorClass = styles.redCell;
    if (cell.color === 'green') bgColorClass = styles.greenCell;

    return (
      <div 
        key={cell.number} 
        className={`${styles.cell} ${bgColorClass} ${isZero ? styles.zeroCell : ''} ${isAdmin ? styles.clickable : ''}`}
        onClick={() => onCellClick?.(cell.number)}
      >
        {isAction && (
          <motion.div 
            className={styles.actionHighlight}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        <span className={styles.number}>{cell.number}</span>
        {bet && <BetChip playerId={bet.player_id} color={bet.color} />}
      </div>
    );
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.zeroRow}>
        {renderCell(zeroCell, true)}
      </div>
      <div className={styles.grid}>
        {gridCells.map(cell => renderCell(cell))}
      </div>
    </div>
  );
}
