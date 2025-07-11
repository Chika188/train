import './App.css';
import CommonNav from './components/CommonNav';
import PopularProjects from './popular/PopularProjects';
import { useEffect, useState } from 'react';

function App() {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('selectedLanguage') || 'all';
  });

  useEffect(() => {
    localStorage.setItem('selectedLanguage', language);
  }, [language]);

  return (
    <>
      <CommonNav selectedLanguage={language} onLanguageChange={setLanguage}></CommonNav>
      <PopularProjects selectedLanguage={language}></PopularProjects>
    </>
  );
}

export default App;
