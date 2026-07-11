import { useState } from 'react';
import { useRouletteContext } from '@/context/RouletteContext';
import { ACTION_NUMBERS, CHIP_COLORS } from '@/types/roulette';
import { BetTable } from './BetTable';
import styles from './AdminControls.module.css';

export function AdminControls() {
  const { bets } = useRouletteContext();
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [playerId, setPlayerId] = useState('');
  const [selectedColor, setSelectedColor] = useState(CHIP_COLORS[0]);
  const [loading, setLoading] = useState(false);

  const handleCellClick = (number: number) => {
    setSelectedCell(number);
    setPlayerId('');
    setSelectedColor(CHIP_COLORS[0]);
  };

  const closeModal = () => setSelectedCell(null);

  const handleAddBet = async () => {
    if (!playerId.trim() || selectedCell === null) return;
    
    // Check max bets (4 per player)
    const playerBets = bets.filter(b => b.player_id === playerId.trim());
    if (playerBets.length >= 4) {
      alert(`Игрок ${playerId} уже сделал максимальное количество ставок (4).`);
      return;
    }

    const isAction = ACTION_NUMBERS.includes(selectedCell);
    if (isAction) {
      const confirmed = window.confirm('Внимание! Это платное акционное число. Подтвердить?');
      if (!confirmed) return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/roulette/bet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add',
          payload: { playerId: playerId.trim(), number: selectedCell, color: selectedColor }
        })
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        alert(json.error || 'Не удалось добавить ставку');
        return;
      }
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBet = async () => {
    if (selectedCell === null) return;
    setLoading(true);
    await fetch('/api/roulette/bet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete',
        payload: { number: selectedCell }
      })
    });
    setLoading(false);
    closeModal();
  };

  const handleClearAll = async () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить ВСЕ ставки со стола?');
    if (!confirmed) return;
    
    setLoading(true);
    await fetch('/api/roulette/clear', { method: 'POST' });
    setLoading(false);
  };

  const existingBet = selectedCell !== null ? bets.find(b => b.number === selectedCell) : null;

  return (
    <div className={styles.adminContainer}>
      <div className={styles.header}>
        <h2>Управление Рулеткой</h2>
        <button onClick={handleClearAll} className={styles.clearBtn} disabled={loading}>
          Очистить всё поле
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <BetTable onCellClick={handleCellClick} isAdmin={true} />
      </div>

      {selectedCell !== null && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3>Ячейка {selectedCell}</h3>
            
            {existingBet ? (
              <div className={styles.existingBet}>
                <p>Ставка от: <strong>{existingBet.player_id}</strong></p>
                <div 
                  className={styles.colorPreview} 
                  style={{ backgroundColor: existingBet.color }}
                />
                <button 
                  onClick={handleDeleteBet} 
                  className={styles.deleteBtn}
                  disabled={loading}
                >
                  Удалить ставку
                </button>
              </div>
            ) : (
              <div className={styles.newBetForm}>
                <label>
                  Player ID:
                  <input 
                    type="text" 
                    value={playerId} 
                    onChange={e => setPlayerId(e.target.value)}
                    placeholder="Введите ID игрока"
                    autoFocus
                  />
                </label>
                
                <label>Цвет фишки:</label>
                <div className={styles.colorGrid}>
                  {CHIP_COLORS.map(color => (
                    <button
                      key={color}
                      className={`${styles.colorOption} ${selectedColor === color ? styles.selectedColor : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>

                <div className={styles.modalActions}>
                  <button onClick={closeModal} className={styles.cancelBtn}>Отмена</button>
                  <button onClick={handleAddBet} className={styles.confirmBtn} disabled={loading || !playerId.trim()}>
                    Подтвердить
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
