import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { supportedLanguages } from '../../i18n'
import './LanguageSwitcher.css'

function FlagES() {
  return (
    <svg viewBox="0 0 24 16" width="20" height="14" aria-hidden="true">
      <rect width="24" height="16" fill="#AA151B" />
      <rect y="4" width="24" height="8" fill="#F1BF00" />
    </svg>
  )
}
function FlagEN() {
  return (
    <svg viewBox="0 0 24 16" width="20" height="14" aria-hidden="true">
      <rect width="24" height="16" fill="#012169" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#fff" strokeWidth="2.4" />
      <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.2" />
      <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="4" />
      <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="2.2" />
    </svg>
  )
}
function FlagFR() {
  return (
    <svg viewBox="0 0 24 16" width="20" height="14" aria-hidden="true">
      <rect width="8" height="16" fill="#0055A4" />
      <rect x="8" width="8" height="16" fill="#fff" />
      <rect x="16" width="8" height="16" fill="#EF4135" />
    </svg>
  )
}
function FlagCA() {
  return (
    <svg viewBox="0 0 24 16" width="20" height="14" aria-hidden="true">
      <rect width="24" height="16" fill="#FCDD09" />
      <rect y="1.78" width="24" height="1.78" fill="#DA121A" />
      <rect y="5.33" width="24" height="1.78" fill="#DA121A" />
      <rect y="8.89" width="24" height="1.78" fill="#DA121A" />
      <rect y="12.44" width="24" height="1.78" fill="#DA121A" />
    </svg>
  )
}

const flags = { es: FlagES, en: FlagEN, fr: FlagFR, ca: FlagCA }

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const current = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0]
  const CurrentFlag = flags[current.code]

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        type="button"
        className="lang-switcher__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <CurrentFlag />
        <span>{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <ul className="lang-switcher__menu" role="listbox">
          {supportedLanguages.map((lang) => {
            const Flag = flags[lang.code]
            const active = lang.code === language
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`lang-switcher__option${active ? ' is-active' : ''}`}
                  onClick={() => {
                    setLanguage(lang.code)
                    setOpen(false)
                  }}
                >
                  <Flag />
                  <span>{lang.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
