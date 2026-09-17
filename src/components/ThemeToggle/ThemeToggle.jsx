import { useTheme } from '../../context/ThemeContext'
import './ThemeToggle.css'

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.7 6.7 0 0 0 10.5 10.5z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo día' : 'Cambiar a modo noche'}
      aria-pressed={isDark}
    >
      <span className={`theme-toggle__track${isDark ? ' is-dark' : ''}`}>
        <span className="theme-toggle__icon theme-toggle__icon--sun"><SunIcon /></span>
        <span className="theme-toggle__icon theme-toggle__icon--moon"><MoonIcon /></span>
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  )
}
