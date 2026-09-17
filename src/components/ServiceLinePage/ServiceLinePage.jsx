import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import Placeholder from '../Placeholder/Placeholder'
import TypewriterHeading from '../TypewriterHeading/TypewriterHeading'
import '../TypewriterHeading/TypewriterHeading.css'
import './ServiceLinePage.css'

/**
 * Plantilla compartida por las tres líneas de servicio:
 * Desarrollo a Medida, Automatización e IA, Integración Zoho One.
 * lineKey: 'dev' | 'automation' | 'zoho'
 */
export default function ServiceLinePage({ lineKey }) {
  const { t } = useLanguage()
  const line = t(`lines.${lineKey}`)

  return (
    <div className="page service-line">
      <section className="sl-hero container">
        <div className="eyebrow">{line.eyebrow}</div>
        <TypewriterHeading text={line.title} key={lineKey + line.title} />
        <p className="sl-hero__intro">{line.intro}</p>
      </section>

      <section className="sl-media container">
        <Placeholder type="process" ratio="21/9" />
      </section>

      <section className="sl-services container">
        <div className="sl-services__label">{t('common.servicesInLine')}</div>
        <div className="sl-services__list">
          {line.services.map((svc, i) => (
            <div className="sl-service" key={i}>
              <div className="sl-service__index">{String(i + 1).padStart(2, '0')}</div>
              <div className="sl-service__body">
                <h3>{svc.name}</h3>
                <p>{svc.desc}</p>
                <div className="sl-service__ideal">
                  <span className="sl-service__ideal-label">{t('common.idealWhen')}</span> {svc.ideal}
                </div>
              </div>
            </div>
          ))}
        </div>
        {line.note && (
          <div className="sl-note">{line.note}</div>
        )}
      </section>

      <section className="container">
        <div className="sl-cta">
          <h2>{t('common.talkToUs')}</h2>
          <Link to="/about" className="btn-primary">{t('home.ctaPrimary')}</Link>
        </div>
      </section>
    </div>
  )
}
