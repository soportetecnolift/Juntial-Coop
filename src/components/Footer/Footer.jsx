import { Link } from 'react-router-dom'
import { LogoFull } from '../Logo/Logo'
import { useLanguage } from '../../context/LanguageContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__top container">
        <div className="footer__brand">
          <LogoFull markSize={26} textSize={20} />
          <p>{t('footer.tagline')}</p>
        </div>

        <div className="footer__col">
          <h4>{t('footer.servicesTitle')}</h4>
          <Link to="/Custom-development">{t('nav.customDev')}</Link>
          <Link to="/automation-ai">{t('nav.automation')}</Link>
          <Link to="/integration-zoho-one">{t('nav.zoho')}</Link>
        </div>

        <div className="footer__col">
          <h4>{t('footer.companyTitle')}</h4>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/Real-life-cases">{t('nav.cases')}</Link>
        </div>

        <div className="footer__newsletter">
          <h4>{t('footer.newsletterTitle')}</h4>
          <p>{t('footer.newsletterText')}</p>
          <form className="footer__nl-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder={t('footer.newsletterPlaceholder')} />
            <button type="submit">{t('footer.newsletterBtn')}</button>
          </form>
        </div>
      </div>

      <div className="footer__bottom container">
        <div>© {year} Juntial. {t('footer.rights')}</div>
        <div className="footer__legal">
          <a href="#">{t('footer.legal')}</a>
          <a href="#">{t('footer.privacy')}</a>
          <a href="#">{t('footer.cookies')}</a>
        </div>
      </div>
    </footer>
  )
}
