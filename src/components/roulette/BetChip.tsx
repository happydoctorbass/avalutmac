import { motion } from 'framer-motion';
import styles from './BetChip.module.css';

interface BetChipProps {
  playerId: string;
  color: string;
}

function getContrastTextColor(hexColor: string) {
  if (!hexColor.startsWith('#')) return '#ffffff';
  const c = hexColor.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  // Luma calculation to determine text contrast
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luma < 140 ? '#ffffff' : '#000000';
}

export function BetChip({ playerId, color }: BetChipProps) {
  const textColor = getContrastTextColor(color);

  return (
    <motion.div
      className={styles.chip}
      style={{ backgroundColor: color }}
      initial={{ scale: 0, opacity: 0, y: -20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className={styles.chipInner}>
        <span className={styles.chipText} style={{ color: textColor }}>
          {playerId}
        </span>
      </div>
    </motion.div>
  );
}
