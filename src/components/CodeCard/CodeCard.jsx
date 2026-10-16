import { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import './CodeCard.css'

// Resaltado de sintaxis mínimo y propio (el proyecto no usa librerías externas).
// Tokeniza línea a línea: comentarios, cadenas, números, palabras clave y llamadas.
const KEYWORDS = {
  js: new Set([
    'import', 'from', 'const', 'let', 'var', 'export', 'async', 'await', 'return', 'if', 'else',
    'for', 'of', 'in', 'try', 'catch', 'break', 'new', 'function', 'default', 'true', 'false', 'null',
  ]),
  deluge: new Set([
    'void', 'if', 'else', 'for', 'each', 'in', 'try', 'catch', 'info', 'return', 'true', 'false',
    'null', 'invokeurl', 'url', 'type', 'parameters', 'headers', 'connection',
  ]),
  json: new Set(['true', 'false', 'null']),
}

const RULES = [
  ['comment', /\/\/.*/y],
  ['string', /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/y],
  ['number', /\d[\d_]*(?:\.\d+)?/y],
  ['word', /[A-Za-z_$][\w$]*/y],
]

function tokenizeLine(line, lang) {
  const out = []
  const push = (type, text) => {
    const last = out[out.length - 1]
    if (last && type === 'plain' && last.type === 'plain') last.text += text
    else out.push({ type, text })
  }

  let i = 0
  while (i < line.length) {
    let matched = false
    for (const [kind, re] of RULES) {
      re.lastIndex = i
      const m = re.exec(line)
      if (!m) continue

      const text = m[0]
      let type = kind
      if (kind === 'word') {
        const next = line[i + text.length]
        if (KEYWORDS[lang].has(text)) type = 'kw'
        else if (text === 'zoho') type = 'builtin'
        else if (next === '(') type = 'fn'
        else type = 'plain'
      } else if (kind === 'string' && lang === 'json') {
        type = /^\s*:/.test(line.slice(i + text.length)) ? 'key' : 'string'
      }

      push(type, text)
      i += text.length
      matched = true
      break
    }
    if (!matched) {
      push('plain', line[i])
      i += 1
    }
  }
  return out
}

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
