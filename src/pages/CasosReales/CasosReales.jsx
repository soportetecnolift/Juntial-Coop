import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import LiveLab from '../../components/LiveLab/LiveLab'
import EvidenceShowcase from '../../components/EvidenceShowcase/EvidenceShowcase'
import TypewriterHeading from '../../components/TypewriterHeading/TypewriterHeading'
import '../../components/TypewriterHeading/TypewriterHeading.css'
import './CasosReales.css'

export default function CasosReales() {
  const { t } = useLanguage()
  const [filter, setFilter] = useState('all')

  const hero = t('cases.hero')
  const categories = t('cases.categories')
  const items = t('cases.items')
  const footerNote = t('cases.footerNote')

  const filters = [
    { key: 'all', label: t('common.viewAll') },
    { key: 'sales', label: categories.sales },
    { key: 'finance', label: categories.finance },
    { key: 'ops', label: categories.ops },
    { key: 'people', label: categories.people },
  ]

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.cat === filter)),
    [filter, items]
  )

  return (
    <div className="page cases-page">
      <section className="cases-hero container">
        <div className="eyebrow">{hero.eyebrow}</div>
        <TypewriterHeading text={hero.title} key={hero.title} />
        <p>{hero.lead}</p>
      </section>

      <LiveLab />

      <EvidenceShowcase />

      <div className="cases-subhead container">
        <h2>{t('showcase.casesTitle')}</h2>
      </div>

      <section className="cases-filters container">
        {filters.map((f) => (
          <button
            key={f.key}
            className={`cases-filter${filter === f.key ? ' is-active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </section>

      <section className="cases-grid container">
        {filtered.map((item, i) => (
          <article className="case-full" key={i}>
            <div className="case-full__cat">{categories[item.cat]}</div>
            <h3>{item.title}</h3>
            <ol className="case-full__flow">
              {item.flow.map((step, j) => (
                <li key={j}>
                  <span className="case-full__flow-num">{j + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="case-full__closing">{item.closing}</p>
          </article>
        ))}
      </section>

      <section className="container">
        <p className="cases-footer-note">{footerNote}</p>
      </section>

      <section className="container">
        <div className="cases-cta">
          <h2>{t('common.talkToUs')}</h2>
          <Link to="/about" className="btn-primary">{t('home.ctaPrimary')}</Link>
        </div>
      </section>
    </div>
  )
}
