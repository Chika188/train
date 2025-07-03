import styles from './nav.module.scss';
import { useNavigate } from 'react-router-dom';

export default function CommonNav() {

  const navigate = useNavigate();

  return (
    <nav className={styles.navBar}>
      <div className={styles.centerSection}>
          <span>
            Battle
          </span>
      </div>
      <button className={styles.battleButton} onClick={() => navigate('/popular')}>← Popular</button>
    </nav>
  );
}