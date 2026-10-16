import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { SHOWCASE } from '../../data/showcase'
import FlowDiagram from '../FlowDiagram/FlowDiagram'
import CodeCard from '../CodeCard/CodeCard'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import MediaGallery from '../MediaGallery/MediaGallery'
import Placeholder from '../Placeholder/Placeholder'
import './EvidenceShowcase.css'

const CODE_LABEL = { js: 'Node.js', deluge: 'Deluge', json: 'JSON' }

function readHashIndex() {
  const hash = typeof window === 'undefined' ? '' : window.location.hash.slice(1)
  return SHOWCASE.findIndex((s) => s.id === hash)
}

/**
 * Explorador de capacidades: lista a la izquierda, visor a la derecha con
 * pestañas Flujo / Código / Vídeo / Capturas. Vídeo y Capturas muestran el
 * hueco marcado hasta que se añada material real en src/data/showcase.js.
 * Cada capacidad tiene enlace directo (#id) para compartirla.
 */
export default function EvidenceShowcase() {
  const { t } = useLanguage()
  const copy = t('showcase')
  const sectionRef = useRef(null)
  const [active, setActive] = useState(() => Math.max(0, readHashIndex()))
  const [tab, setTab] = useState('flow')

  useEffect(() => {
    if (readHashIndex() >= 0) sectionRef.current?.scrollIntoView({ block: 'start' })
  }, [])

  const cfg = SHOWCASE[active]
  const text = copy.items.find((i) => i.id === cfg.id)
  const { video, youtube, shots } = cfg.media

  const tabs = [
    { key: 'flow', label: copy.tabs.flow },
    cfg.code && { key: 'code', label: copy.tabs.code },
    { key: 'video', label: copy.tabs.video },
    { key: 'shots', label: copy.tabs.shots },
  ].filter(Boolean)

  function select(i) {
    setActive(i)
    setTab('flow')
    window.history.replaceState(window.history.state, '', `#${SHOWCASE[i].id}`)
  }

  return (
    <section className="ev" id="evidencias" ref={sectionRef}>
      <div className="container">
        <header className="ev__intro">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2>{copy.title}</h2>
          <p>{copy.lead}</p>
        </header>

        <div className="ev__layout">
          <ul className="ev__list" aria-label={copy.list}>
            {SHOWCASE.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  data-ev-id={s.id}
                  className={`ev__item${i === active ? ' is-active' : ''}`}
                  aria-current={i === active ? 'true' : undefined}
                  onClick={() => select(i)}
                >
                  <span className="ev__num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{copy.items.find((it) => it.id === s.id).title}</span>
                </button>
              </li>
            ))}
          </ul>

          <article className="ev__panel" id={`ev-${cfg.id}`}>
            <header className="ev__head">
              <span className={`ev__badge ev__badge--${cfg.status}`}>{copy.badge[cfg.status]}</span>
              <h3>{text.title}</h3>
              <p className="ev__proves"><strong>{copy.proves}.</strong> {text.proves}</p>
            </header>

            <div className="ev__tabs" role="tablist">
              {tabs.map((tb) => (
                <button
                  type="button"
                  role="tab"
                  key={tb.key}
                  aria-selected={tab === tb.key}
                  className={`ev__tab${tab === tb.key ? ' is-active' : ''}`}
                  onClick={() => setTab(tb.key)}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            <div className="ev__stage" role="tabpanel">
              {tab === 'flow' && (
                <>
                  <FlowDiagram key={cfg.id} nodes={text.nodes} kinds={cfg.kinds} label={text.title} />
                  <ul className="ev__legend">
                    {[...new Set(cfg.kinds)].map((k) => (
                      <li key={k}>
                        <span className={`ev__swatch flow__item--${k}`} />
                        {copy.legend[k]}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {tab === 'code' && cfg.code && (
                <CodeCard
                  code={cfg.code.source}
                  lang={cfg.code.lang}
                  filename={cfg.code.filename}
                  label={CODE_LABEL[cfg.code.lang]}
                />
              )}
              {tab === 'video' &&
                (video || youtube ? (
                  <VideoPlayer
                    src={video?.src}
                    poster={video?.poster}
                    youtube={youtube}
                    title={text.title}
                    badge={copy.badge[cfg.status]}
                  />
                ) : (
                  <Placeholder type="video" ratio="16/9" />
                ))}
              {tab === 'shots' &&
                (shots.length > 0 ? <MediaGallery images={shots} /> : <Placeholder type="photo" ratio="16/9" />)}
            </div>

            <footer className="ev__foot">
              <div className="ev__why">
                <span className="ev__why-label">{copy.why}</span>
                <p>{text.why}</p>
              </div>
              <ul className="ev__tags">
                {cfg.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </footer>
          </article>
        </div>
      </div>
    </section>
  )
}
