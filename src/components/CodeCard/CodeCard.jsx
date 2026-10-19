import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { tokenizeLine } from '../../lib/highlight'
import './CodeCard.css'

export default function CodeCard({ code, lang = 'js', filename, label }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* sin permiso de portapapeles: no hacemos nada */
    }
  }

  return (
    <figure className="code">
      <figcaption className="code__bar">
        <span className="code__dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="code__file">{filename}</span>
        <span className="code__lang">{label}</span>
        <button type="button" className="code__copy" onClick={copy}>
          {copied ? t('showcase.copied') : t('showcase.copy')}
        </button>
      </figcaption>
      <pre className="code__pre" tabIndex={0}>
        <code>
          {lines.map((line, i) => (
            <span className="code__line" key={i}>
              {tokenizeLine(line, lang).map((tk, j) => (
                <span key={j} className={`tok tok--${tk.type}`}>{tk.text}</span>
              ))}
            </span>
          ))}
        </code>
      </pre>
      <p className="code__note">{t('showcase.codeNote')}</p>
    </figure>
  )
}
