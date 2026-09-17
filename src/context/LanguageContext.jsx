import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { dictionaries, defaultLanguage } from '../i18n'

const LanguageContext = createContext(null)

const STORAGE_KEY = 'juntial-lang'

function detectInitialLanguage() {
  if (typeof window === 'undefined') return defaultLanguage
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && dictionaries[stored]) return stored
  const browserLang = window.navigator.language?.slice(0, 2)
  if (browserLang && dictionaries[browserLang]) return browserLang
  return defaultLanguage
}

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj)
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(detectInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const setLanguage = useCallback((code) => {
    if (dictionaries[code]) setLanguageState(code)
  }, [])

  const t = useCallback((path) => {
    const dict = dictionaries[language] || dictionaries[defaultLanguage]
    const value = getByPath(dict, path)
    if (value === undefined) {
      const fallback = getByPath(dictionaries[defaultLanguage], path)
      return fallback !== undefined ? fallback : path
    }
    return value
  }, [language])

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
