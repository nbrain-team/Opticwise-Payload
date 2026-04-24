export default function BrainBlockBlock({
  layerLabel = 'Layer 2',
  eyebrow,
  heading,
  tagline,
  body,
  flowLine,
}: any) {
  return (
    <section className="brain">
      <div className="container">
        <div className="brain__inner">
          <div className="bot__header">
            <span className="bot__badge" style={{ background: 'var(--accent-bright)', color: '#001620' }}>
              {layerLabel}
            </span>
            {eyebrow && <span className="eyebrow" style={{ color: 'var(--accent-bright)' }}>{eyebrow}</span>}
          </div>
          <h2 className="h2" style={{ color: 'white' }}>{heading}</h2>
          {tagline && <p className="brain__tagline">{tagline}</p>}
          <div className="brain__body">
            {(body || []).map((p: any, i: number) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: boldTrademarks(p.text) }} />
            ))}
          </div>
          {flowLine && <div className="brain__flow">{flowLine}</div>}
        </div>
      </div>
    </section>
  )
}

function boldTrademarks(text: string): string {
  return text.replace(
    /(Property Brain™|Portfolio Brain™|data plane \+ trust plane)/g,
    '<strong>$1</strong>'
  )
}
