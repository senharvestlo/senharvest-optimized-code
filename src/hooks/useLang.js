import { useState, useMemo } from 'react';
import { DIC } from '../config/translations';

/**
 * useLang Hook
 * Manages language state and provides translations
 */
function useLang() {
  const [lang, setLang] = useState("fr");
  const t = useMemo(() => DIC[lang], [lang]);
  
  return { lang, setLang, t };
}

export default useLang;
