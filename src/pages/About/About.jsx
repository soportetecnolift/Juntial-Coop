import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import Placeholder from '../../components/Placeholder/Placeholder'
import './About.css'

export default function About() {
  const { t } = useLanguage()
  const steps = t('about.steps')

  return (
    <div className="page about-page">
      <section className="about-hero container">
        <div className="eyebrow">{t('about.eyebrow')}</div>
        <h1>{t('about.title')}</h1>
        <p className="about-hero__lead">{t('about.lead')}</p>
      </section>

      <section className="about-body container">
        <div className="about-body__text">
          <p>{t('about.body1')}</p>
          <p>{t('about.body2')}</p>
        </div>
        <Placeholder type="photo" ratio="4/3" />
      </section>

      <section className="about-grid container">
        <div className="about-grid__card">
          <h3>{t('about.howTitle')}</h3>
          <p>{t('about.howBody')}</p>
        </div>
        <div className="about-grid__card">
          <h3>{t('about.whoTitle')}</h3>
          <p>{t('about.whoBody')}</p>
        </div>
      </section>

      <section className="about-team container">
        <div className="eyebrow">{t('about.teamEyebrow')}</div>
        <h2>{t('about.teamTitle')}</h2>
        <div className="about-team__grid">
          <Placeholder type="photo" ratio="1/1" />
          <Placeholder type="photo" ratio="1/1" />
          <Placeholder type="photo" ratio="1/1" />
        </div>
      </section>

      <section className="about-steps container">
        <div className="about-steps__head">
          <h2>{t('about.stepsTitle')}</h2>
          <p>{t('about.stepsLead')}</p>
        </div>
        <div className="about-steps__list">
          {steps.map((s, i) => (
            <div className="about-step" key={i}>
              <div className="about-step__marker">0{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="about-steps__cta">
          <Link to="/Real-life-cases" className="btn-outline">{t('nav.cases')} →</Link>
          <a href="#" className="btn-primary">{t('common.getStarted')}</a>
        </div>
      </section>
    </div>
  )
}
