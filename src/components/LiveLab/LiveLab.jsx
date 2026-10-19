import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../context/LanguageContext'
import { LIVE_DEMOS, NARRATION } from './liveDemos'
import { buildCodeTimeline, buildGraphTimeline } from './timeline'
import usePlayer from './usePlayer'
import GraphBuilder from './GraphBuilder'
import CodeStudio from './CodeStudio'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import './LiveLab.css'

const INTRO_MS = 3500
const SPEEDS = [0.5, 1, 2, 3]
const REC_SPEED = 0.5 // narrar con calma: la demo va a ½× en el modo grabación
const GROUPS = ['make', 'flow', 'deluge', 'sql', 'node', 'mcp']

const CACHE = new Map()
function timelineFor(demo) {
  if (!CACHE.has(demo.id)) {
    CACHE.set(demo.id, demo.engine === 'graph' ? buildGraphTimeline(demo) : buildCodeTimeline(demo))
  }
  return CACHE.get(demo.id)
}

const MIC = (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
  </svg>
)
// Si no hay audio en el idioma de la web, se usa el más cercano disponible (catalán → español, francés → inglés)
const AUDIO_FALLBACK = { ca: 'es', fr: 'en' }
const LANG_NAMES = { es: 'Español', en: 'English', fr: 'Français', ca: 'Català' }

function NarrationSlot({ ui, media, siteLang, picked, onPick }) {
  if (media?.video) return <VideoPlayer src={media.video} poster={media.poster} title={ui.narrationTitle} />

  // Audio: { es: { audio }, en: { audio } } (varios idiomas) o { audio } (uno solo)
  const langs = media ? Object.keys(media).filter((k) => media[k]?.audio) : []
  let src = media?.audio ?? null
  let lang = null
  if (!src && langs.length > 0) {
    lang = [picked, siteLang, AUDIO_FALLBACK[siteLang]].find((l) => l && langs.includes(l)) ?? langs[0]
    src = media[lang].audio
  }

  if (src) {
    return (
      <div className="lab__narr is-filled">
        <span className="lab__mic" aria-hidden="true">{MIC}</span>
        <div className="lab__narr-body">
          <b>{ui.narrationListen}</b>
          <audio key={src} controls preload="metadata" src={src} aria-label={ui.narrationListen} />
        </div>
        {langs.length > 1 && (
          <div className="lab__lang" role="group" aria-label={ui.audioLanguage}>
            {langs.map((l) => (
              <button
                type="button"
                key={l}
                className={l === lang ? 'is-on' : ''}
                aria-pressed={l === lang}
                title={LANG_NAMES[l] ?? l}
                onClick={() => onPick(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="lab__narr">
      <span className="lab__mic" aria-hidden="true">{MIC}</span>
      <span className="lab__narr-text">
        <b>{ui.narrationTitle}</b>
        <span>{ui.narrationText}</span>
      </span>
      <span className="lab__wave" aria-hidden="true">
        {Array.from({ length: 22 }).map((_, i) => (
          <i key={i} style={{ '--i': i }} />
        ))}
      </span>
    </div>
  )
}

/**
 * Laboratorio en vivo: demos que se construyen solas (escenarios de Make y Zoho Flow, funciones
 * Deluge, SQL, proyectos Node/MERN). Todo es función del tiempo `t` del reproductor, así que se
 * puede pausar, repetir, acelerar, saltar con la barra y grabar. Son recreaciones con datos ficticios.
 *  - variant "full": lista completa + controles + modo grabación + hueco de narración.
 *  - variant "home": carrusel automático de las demos indicadas en `ids`.
 */
export default function LiveLab({ ids, variant = 'full' }) {
  const { t, language } = useLanguage()
  const copy = t('liveLab')
  const home = variant === 'home'
  const demos = useMemo(
    () => (ids ? ids.map((id) => LIVE_DEMOS.find((d) => d.id === id)).filter(Boolean) : LIVE_DEMOS),
    [ids]
  )
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const [active, setActive] = useState(0)
  const [runId, setRunId] = useState(0)
  const [recording, setRecording] = useState(false)
  const [inView, setInView] = useState(false)
  const [auto, setAuto] = useState(true)
  const [audioPick, setAudioPick] = useState(null) // idioma del audio elegido a mano (null = el de la web)
  const root = useRef(null)

  const demo = demos[active]
  const tl = timelineFor(demo)
  const item = copy.items.find((i) => i.id === demo.id)
  const player = usePlayer(tl.total, {
    loop: home && !auto && !recording,
    active: inView || recording,
    start: reduced ? tl.total : 0,
  })
  const { restart, setSpeed } = player

  useEffect(() => {
    const node = root.current
    if (!node || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 })
    io.observe(node)
    return () => io.disconnect()
  }, [])

  function select(i, byUser = true) {
    setActive(i)
    setRunId((r) => r + 1)
    if (byUser) setAuto(false)
    restart(reduced ? timelineFor(demos[i]).total : 0)
  }

  // Carrusel de la Home: al terminar una demo pasa a la siguiente (hasta que alguien elige una)
  useEffect(() => {
    if (!(home && auto && inView && player.finished)) return undefined
    const id = setTimeout(() => {
      setActive((a) => (a + 1) % demos.length)
      setRunId((r) => r + 1)
      restart(0)
    }, 500)
    return () => clearTimeout(id)
  }, [home, auto, inView, player.finished, demos.length, restart])

  // Modo grabación: pantalla completa, Esc para salir, sin scroll de fondo
  useEffect(() => {
    if (!recording) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setRecording(false)
        setRunId((r) => r + 1)
        setSpeed(1)
        restart(0)
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [recording, restart, setSpeed])

  function toggleRecording() {
    const next = !recording
    setRecording(next)
    setRunId((r) => r + 1)
    player.setSpeed(next ? REC_SPEED : 1)
    restart(next ? -INTRO_MS : 0)
  }
  function replay() {
    setRunId((r) => r + 1)
    restart(recording ? -INTRO_MS : 0)
  }
  function seek(e) {
    const r = e.currentTarget.getBoundingClientRect()
    player.seek(((e.clientX - r.left) / r.width) * tl.total)
  }

  const te = Math.max(0, player.t)
  const pct = Math.min(100, (te / tl.total) * 100)
  const ui = copy.ui
  const engineProps = { demo, timeline: tl, t: te, ui }

  return (
    <section className={`lab lab--${variant}`} id={home ? 'en-vivo-home' : 'en-vivo'} ref={root}>
      <div className="container">
        <header className="lab__head">
          <div className="eyebrow">{copy.eyebrow}</div>
          <h2>{copy.title}</h2>
          <p>{home ? copy.homeLead : copy.lead}</p>
        </header>

        <div className="lab__layout">
          {home ? (
            <div className="lab__chips" role="tablist" aria-label={ui.list}>
              {demos.map((d, i) => (
                <button
                  type="button"
                  role="tab"
                  key={d.id}
                  aria-selected={i === active}
                  className={`lab__chip${i === active ? ' is-active' : ''}`}
                  onClick={() => select(i)}
                >
                  {copy.items.find((it) => it.id === d.id).title}
                </button>
              ))}
            </div>
          ) : (
            <nav className="lab__list" aria-label={ui.list}>
              {GROUPS.filter((g) => demos.some((d) => d.group === g)).map((g) => (
                <div key={g}>
                  <div className="lab__group">{copy.groups[g]}</div>
                  {demos.map((d, i) =>
                    d.group === g ? (
                      <button
                        type="button"
                        key={d.id}
                        data-demo-id={d.id}
                        className={`lab__item${i === active ? ' is-active' : ''}`}
                        aria-current={i === active ? 'true' : undefined}
                        onClick={() => select(i)}
                      >
                        {copy.items.find((it) => it.id === d.id).title.replace(/^[^·]*·\s*/, '')}
                      </button>
                    ) : null
                  )}
                </div>
              ))}
            </nav>
          )}

          <div className="lab__main">
            <div className={`lab__wrap${recording ? ' is-recording' : ''}`}>
              <div className="lab__bar">
                <div className="lab__bar-title">
                  <h3>{item.title}</h3>
                  <span className="lab__badge">{ui.badge}</span>
                </div>
                <div className="lab__ctrl">
                  <button type="button" className="lab__btn" onClick={player.toggle} aria-label={player.playing ? ui.pause : ui.play}>
                    {player.playing ? (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    )}
                  </button>
                  <button type="button" className="lab__btn" onClick={replay} aria-label={ui.replay}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12a8 8 0 1 0 2.6-5.9M4 4v4.5h4.5" /></svg>
                  </button>
                  <div className="lab__speeds" role="group" aria-label={ui.speed}>
                    {SPEEDS.map((s) => (
                      <button type="button" key={s} aria-pressed={player.speed === s} className={player.speed === s ? 'is-on' : ''} onClick={() => player.setSpeed(s)}>
                        {s === 0.5 ? '½×' : `${s}×`}
                      </button>
                    ))}
                  </div>
                  {!home && (
                    <button type="button" className={`lab__rec${recording ? ' is-on' : ''}`} onClick={toggleRecording}>
                      <i /> {recording ? ui.exitRecord : ui.record}
                    </button>
                  )}
                </div>
              </div>

              <div className="lab__stage">
                {demo.engine === 'graph' ? (
                  <GraphBuilder key={`${demo.id}-${runId}`} {...engineProps} labels={copy.flow} playing={player.playing} />
                ) : (
                  <CodeStudio key={`${demo.id}-${runId}`} {...engineProps} analytics={copy.analytics} lang={language} />
                )}
              </div>

              <div className="lab__progress" onClick={seek} role="progressbar" aria-label={ui.progress} aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
                <i style={{ width: `${pct}%` }} />
              </div>

              {recording && (
                <>
                  <aside className="lab__side" aria-hidden="true">
                    <div className="lab__pip">
                      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="9" r="3.4" />
                        <path d="M5.5 20c.6-3.6 3.2-5.6 6.5-5.6s5.9 2 6.5 5.6" />
                      </svg>
                      <span>{ui.camera}</span>
                    </div>
                  </aside>
                  {player.t < 0 && (
                    <div className="lab__card">
                      <span>{ui.intro}</span>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {!home && !recording && (
              <NarrationSlot ui={ui} media={NARRATION[demo.id]} siteLang={language} picked={audioPick} onPick={setAudioPick} />
            )}
            {!home && <p className="lab__desc">{item.desc}</p>}
            {home && (
              <div className="lab__cta">
                <Link to="/Real-life-cases#en-vivo" className="btn-outline">{ui.seeAll} →</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
