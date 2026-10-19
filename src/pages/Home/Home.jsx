import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer'
import { SHOWCASE } from '../../data/showcase'
import LiveLab from '../../components/LiveLab/LiveLab'
import TypewriterHeading from '../../components/TypewriterHeading/TypewriterHeading'
import '../../components/TypewriterHeading/TypewriterHeading.css'
import Reveal from '../../components/Reveal/Reveal'
import '../../components/Reveal/Reveal.css'
import HexSystem from '../../components/HexSystem/HexSystem'
import './Home.css'

const LAB_IDS = ['make-agent', 'deluge-lead', 'mern']

export default function Home() {
  const { t } = useLanguage()
  const ctaRef = useRef(null)

  function handleCtaMouseMove(e) {
    const node = ctaRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    node.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    node.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }

  const lines = [
    { to: '/Custom-development', title: t('home.line1title'), desc: t('home.line1desc'), n: '01' },
    { to: '/automation-ai', title: t('home.line2title'), desc: t('home.line2desc'), n: '02' },
    { to: '/integration-zoho-one', title: t('home.line3title'), desc: t('home.line3desc'), n: '03' },
  ]

  const steps = [
    { title: t('home.step1title'), desc: t('home.step1desc') },
    { title: t('home.step2title'), desc: t('home.step2desc') },
    { title: t('home.step3title'), desc: t('home.step3desc') },
  ]

  const featuredCases = t('cases.items').slice(0, 3)
  const showcaseItems = t('showcase.items')
  const mcpTitle = showcaseItems.find((it) => it.id === 'mcp').title

  return (
    <div className="page home">
      {/* ---------- HERO ---------- */}
      <section className="home-hero container">
        <div className="home-hero__copy">
          <div className="eyebrow"><span className="eyebrow__dot" /> {t('home.eyebrow')}</div>
          <TypewriterHeading
            before={t('home.h1a')}
            accent={t('home.h1accent')}
            after={t('home.h1b')}
            key={t('home.h1a') + t('home.h1accent') + t('home.h1b')}
          />
          <p className="home-hero__lead">{t('home.lead')}</p>
          <div className="home-hero__actions">
            <Link to="/about" className="btn-primary">{t('home.ctaPrimary')}</Link>
            <Link to="/Real-life-cases" className="btn-ghost">{t('home.ctaSecondary')} →</Link>
          </div>
          <div className="home-hero__stats">
            <div><div className="stat-num">{t('home.stat1num')}</div><div className="stat-label">{t('home.stat1label')}</div></div>
            <div><div className="stat-num">{t('home.stat2num')}</div><div className="stat-label">{t('home.stat2label')}</div></div>
            <div><div className="stat-num">{t('home.stat3num')}</div><div className="stat-label">{t('home.stat3label')}</div></div>
          </div>
        </div>

        <div className="home-hero__visual">
          <HexSystem />
        </div>
      </section>

      {/* ---------- LABORATORIO EN VIVO (carrusel) ---------- */}
      <LiveLab ids={LAB_IDS} variant="home" />

      {/* ---------- QUÉ ES JUNTIAL ---------- */}
      <Reveal as="section" className="home-what container">
        <div className="home-what__head">
          <div className="eyebrow">{t('home.whatEyebrow')}</div>
          <h2>{t('home.whatTitle')}</h2>
        </div>
        <div className="home-what__body">
          <p className="home-what__lead">{t('home.whatLead')}</p>
          <p>{t('home.whatBody')}</p>
        </div>
        <div className="home-what__grid">
          <div className="home-what__card">
            <h3>{t('home.howTitle')}</h3>
            <p>{t('home.howBody')}</p>
          </div>
          <div className="home-what__card">
            <h3>{t('home.whoTitle')}</h3>
            <p>{t('home.whoBody')}</p>
          </div>
        </div>
      </Reveal>

      {/* ---------- TRES LÍNEAS DE SERVICIO ---------- */}
      <Reveal as="section" className="home-lines container">
        <div className="home-lines__head">
          <div className="eyebrow">{t('home.linesEyebrow')}</div>
          <h2>{t('home.linesTitle')}</h2>
        </div>
        <div className="home-lines__grid">
          {lines.map((line, i) => (
            <Reveal as="div" delay={i * 90} key={line.n}>
              <Link to={line.to} className="line-card">
                <span className="line-card__num">{line.n}</span>
                <h3>{line.title}</h3>
                <p>{line.desc}</p>
                <span className="line-card__arrow">{t('common.readMore')} →</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Reveal>

      {/* ---------- PROCESO ---------- */}
      <Reveal as="section" className="home-process container">
        <div className="home-process__head">
          <div>
            <div className="eyebrow">{t('home.processEyebrow')}</div>
            <h2>{t('home.processTitle')}</h2>
          </div>
        </div>
        <div className="home-process__timeline">
          {steps.map((s, i) => (
            <div className="process-step" key={i}>
              <div className={`process-step__marker${i === 0 ? ' is-active' : ''}`}>0{i + 1}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ---------- CASOS DESTACADOS ---------- */}
      <Reveal as="section" className="home-cases container">
        <div className="home-cases__head">
          <div>
            <div className="eyebrow">{t('home.casesEyebrow')}</div>
            <h2>{t('home.casesTitle')}</h2>
          </div>
          <p>{t('home.casesLead')}</p>
        </div>
        <div className="home-cases__grid">
          {featuredCases.map((c, i) => (
            <Reveal as="div" delay={i * 90} className="case-card" key={i}>
              <h3>{c.title}</h3>
              <ol className="case-card__flow">
                {c.flow.slice(0, 3).map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
              <p className="case-card__closing">{c.closing}</p>
            </Reveal>
          ))}
        </div>
        <div className="home-cases__cta">
          <Link to="/Real-life-cases" className="btn-outline">{t('home.casesCta')} →</Link>
        </div>
      </Reveal>

      {/* ---------- MEDIA / PROCESO ILUSTRATIVO ---------- */}
      <Reveal as="section" className="home-media container">
        <div className="home-media__head">
          <div className="eyebrow">{t('home.mediaEyebrow')}</div>
          <h2>{t('home.mediaTitle')}</h2>
          <p>{t('home.mediaLead')}</p>
        </div>
        <div className="home-media__grid">
          <VideoPlayer
            ambient
            sources={[
              { src: '/media/demos/mcp.mp4', type: 'video/mp4' },
              { src: '/media/demos/mcp.webm', type: 'video/webm' },
            ]}
            poster="/media/demos/mcp.jpg"
            title={mcpTitle}
          />
          <ul className="home-media__list">
            {SHOWCASE.map((s, i) => (
              <li key={s.id}>
                <Link to={`/Real-life-cases#${s.id}`}>
                  <span className="home-media__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{showcaseItems.find((it) => it.id === s.id).title}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="home-media__cta">
          <Link to="/Real-life-cases#evidencias" className="btn-outline">{t('showcase.seeAll')} →</Link>
        </div>
      </Reveal>

      {/* ---------- CTA FINAL ---------- */}
      <Reveal as="section" className="container">
        <div className="home-cta" ref={ctaRef} onMouseMove={handleCtaMouseMove}>
          <div className="home-cta__glow" />
          <div className="home-cta__cursor-glow" />
          <div className="home-cta__main">
            <div className="eyebrow">{t('home.finalCtaEyebrow')}</div>
            <h2>{t('home.finalCtaTitle')}</h2>
            <p>{t('home.finalCtaLead')}</p>
            <div className="home-cta__actions">
              <Link to="/about" className="btn-primary">{t('home.finalCtaPrimary')}</Link>
              <a href="#" className="btn-outline">{t('home.finalCtaSecondary')}</a>
            </div>
          </div>
          <div className="home-cta__channels">
            <div className="channel">
              <div className="channel__label">{t('home.channelEmailLabel')}</div>
              <div className="channel__value accent">hola@juntial.com</div>
            </div>
            <div className="channel">
              <div className="channel__label">{t('home.channelTimeLabel')}</div>
              <div className="channel__value">{t('home.channelTimeValue')}</div>
            </div>
            <div className="channel">
              <div className="channel__label">{t('home.channelModeLabel')}</div>
              <div className="channel__value">{t('home.channelModeValue')}</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
