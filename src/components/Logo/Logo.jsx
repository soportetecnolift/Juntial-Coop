// Icono hexagonal facetado de Juntial, replicado del logo oficial.
export function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,3 90,25 90,75 50,97 10,75 10,25" fill="var(--facet-1)" />
      <polygon points="50,3 90,25 50,50 10,25" fill="var(--facet-2)" opacity="0.6" />
      <polygon points="10,25 50,50 50,97 10,75" fill="var(--facet-2)" />
      <circle cx="50" cy="45" r="16" fill="var(--blue)" />
    </svg>
  )
}

export function LogoFull({ markSize = 28, textSize = 20 }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      fontFamily: 'var(--heading)',
      fontWeight: 700,
      fontSize: textSize,
      letterSpacing: '-0.02em',
      color: 'var(--text)',
    }}>
      <LogoMark size={markSize} />
      JUNT<span style={{ color: 'var(--blue)' }}>IAL</span>
    </span>
  )
}
