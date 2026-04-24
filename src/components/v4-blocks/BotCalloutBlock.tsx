export default function BotCalloutBlock({
  layerLabel = 'Layer 1',
  eyebrow,
  heading,
  botDescription,
  pillars,
  closingLine,
}: any) {
  return (
    <section className="bot">
      <div className="container">
        <div className="bot__header">
          <span className="bot__badge">{layerLabel}</span>
          {eyebrow && <span className="eyebrow" style={{ color: 'var(--text-muted)' }}>{eyebrow}</span>}
        </div>
        <h2 className="h2">{heading}</h2>
        {botDescription && (
          <div className="bot__callout" dangerouslySetInnerHTML={{ __html: formatBotDescription(botDescription) }} />
        )}
        {pillars && pillars.length > 0 && (
          <div className="bot__pillars">
            {pillars.map((p: any, i: number) => (
              <div key={i} className="bot__pillar">
                <div className="bot__pillar-title">{p.title}</div>
                <p className="bot__pillar-desc">{p.description}</p>
              </div>
            ))}
          </div>
        )}
        {closingLine && <p className="bot__closing">{closingLine}</p>}
      </div>
    </section>
  )
}

// Bold "BoT®" mentions in the description
function formatBotDescription(text: string): string {
  return text
    .replace(/BoT®/g, '<strong>BoT®</strong>')
    .replace(/\(Building of Things®\)/g, '<strong>(Building of Things®)</strong>')
}
