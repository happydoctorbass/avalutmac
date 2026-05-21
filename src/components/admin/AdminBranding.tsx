import styles from './AdminBranding.module.css';

export function AdminBranding() {
  return (
    <div className={styles.branding}>
      <span className={styles.title}>Admiral Casino Bishkek</span>
      <span className={styles.subtitle}>Novomatic Technologies</span>
    </div>
  );
}
