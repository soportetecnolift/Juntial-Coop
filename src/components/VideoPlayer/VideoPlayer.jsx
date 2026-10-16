import { useState } from 'react'
import './VideoPlayer.css'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/**
 * Reproductor para las grabaciones reales y las demos.
 *  - src / sources: archivo propio (mp4 recomendado; `sources` permite mp4 + webm).
 *  - youtube: ID de vídeo. Usa youtube-nocookie y NO carga nada de YouTube
 *    hasta que la persona pulsa play (más rápido y respetuoso con la privacidad).
 *  - ambient: vídeo mudo en bucle sin controles (para demos animadas). Si la
 *    persona tiene "reducir movimiento" activado, vuelve a mostrar controles
 *    y no se reproduce solo.
 */
export default function VideoPlayer({ src, sources, poster, youtube, title, badge, ambient = false }) {
  const [playing, setPlaying] = useState(false)
  const list = sources || (src ? [{ src }] : [])
  const calm = ambient && !prefersReducedMotion()

  if (youtube) {
    return (
      <div className="vp">
        {playing ? (
          <iframe
            className="vp__frame"
            src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="vp__poster"
            aria-label={title}
            onClick={() => setPlaying(true)}
            style={poster ? { backgroundImage: `url(${poster})` } : undefined}
          >
            <span className="vp__play">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
        {badge && <span className="vp__badge">{badge}</span>}
      </div>
    )
  }

  return (
    <div className="vp">
      <video
        className="vp__video"
        poster={poster}
        title={title}
        controls={!calm}
        autoPlay={calm}
        loop={calm}
        playsInline
        preload={calm ? 'auto' : 'metadata'}
        ref={(el) => {
          if (el) el.muted = calm
        }}
      >
        {list.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
      {badge && <span className="vp__badge">{badge}</span>}
    </div>
  )
}
