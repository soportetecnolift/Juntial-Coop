import { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './MediaGallery.css'

/**
 * Miniaturas que se amplían en un visor a pantalla completa.
 * Teclado: Esc cierra, ← → navegan. Al cerrar, el foco vuelve a la miniatura.
 * images: [{ src, alt }]
 */
export default function MediaGallery({ images }) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(null)
  const closeBtn = useRef(null)
  const lastTrigger = useRef(null)

  const close = useCallback(() => {
    setOpen(null)
    lastTrigger.current?.focus()
  }, [])
  const move = useCallback(
    (delta) => setOpen((i) => (i === null ? i : (i + delta + images.length) % images.length)),
    [images.length]
  )

  useEffect(() => {
    if (open === null) return undefined
    closeBtn.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') move(1)
      else if (e.key === 'ArrowLeft') move(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, move])

  const current = open === null ? null : images[open]

  return (
    <>
      <div className="mg">
        {images.map((img, i) => (
          <button
            type="button"
            className="mg__thumb"
            key={img.src}
            onClick={(e) => {
              lastTrigger.current = e.currentTarget
              setOpen(i)
            }}
          >
            <img src={img.src} alt={img.alt} loading="lazy" />
          </button>
        ))}
      </div>

      {current && (
        <div className="mg__overlay" role="dialog" aria-modal="true" aria-label={current.alt} onClick={close}>
          <figure className="mg__figure" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.alt} />
            <figcaption>{current.alt}</figcaption>
          </figure>
          <button type="button" className="mg__btn mg__btn--close" ref={closeBtn} onClick={close} aria-label={t('showcase.close')}>×</button>
          {images.length > 1 && (
            <>
              <button type="button" className="mg__btn mg__btn--prev" onClick={(e) => { e.stopPropagation(); move(-1) }} aria-label={t('showcase.prev')}>‹</button>
              <button type="button" className="mg__btn mg__btn--next" onClick={(e) => { e.stopPropagation(); move(1) }} aria-label={t('showcase.next')}>›</button>
            </>
          )}
        </div>
      )}
    </>
  )
}
