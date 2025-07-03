import styles from './nav.module.scss';
import { useNavigate } from 'react-router-dom';

export default function CommonNav({ selectedLanguage, onLanguageChange }) {

  const navigate = useNavigate();
  const languages = ['all', 'javascript', 'ruby', 'java', 'css', 'python'];

  return (
    <nav className={styles.navBar}>
      <div className={styles.centerSection}>
        {languages.map(lang => (
          <span
            key={lang}
            className={lang === selectedLanguage ? styles.active : ''}
            onClick={() => onLanguageChange(lang)}
          >
            {lang}
          </span>
        ))}
      </div>
      <button className={styles.battleButton} onClick={() => navigate('/battle')}>Battle →</button>
    </nav>
  );
}