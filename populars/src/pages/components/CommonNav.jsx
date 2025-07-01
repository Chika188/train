import styles from './nav.module.scss';

export default function CommonNav({ selectedLanguage, onLanguageChange }) {
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
      <button className={styles.battleButton}>Battle →</button>
    </nav>
  );
}