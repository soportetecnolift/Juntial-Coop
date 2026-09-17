import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LogoFull } from '../Logo/Logo'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { useLanguage } from '../../context/LanguageContext'
import './Navbar.css'

export default function Navbar() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)

  const links = [
    { to: '/', label: t('nav.home'), end: true },
    { to: '/Custom-development', label: t('nav.customDev') },
    { to: '/automation-ai', label: t('nav.automation') },
    { to: '/integration-zoho-one', label: t('nav.zoho') },
    { to: '/Real-life-cases', label: t('nav.cases') },
    { to: '/about', label: t('nav.about') },
  ]

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo" onClick={() => setOpen(false)}>
          <LogoFull markSize={38} textSize={23} gap={10} />
        </Link>

        <nav className={`navbar__links${open ? ' is-open' : ''}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `navbar__link${isActive ? ' is-active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__actions">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link to="/about" className="navbar__cta">{t('nav.cta')}</Link>
          <button
            className={`navbar__burger${open ? ' is-open' : ''}`}
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  )
}
