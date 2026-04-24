export default function FivePlanBlock({
  eyebrow,
  heading,
  lede,
  steps,
  punchLine,
}: any) {
  return (
    <section className="fiveplan">
      <div className="container">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <div className="accent-line" />
        <h2 className="h2">{heading}</h2>
        {lede && <p className="lede" style={{ marginTop: '1.25rem', maxWidth: '60ch' }}>{lede}</p>}
        <div className="fiveplan__grid">
          {(steps || []).map((step: any, i: number) => (
            <div key={i} className="fiveplan__step">
              <div className="fiveplan__letter">Step {step.letter}</div>
              <h3 className="fiveplan__title">{step.title}</h3>
              {step.tag && <span className="fiveplan__tag">{step.tag}</span>}
              <p className="fiveplan__desc">{step.description}</p>
            </div>
          ))}
        </div>
        {punchLine && <p className="fiveplan__punch">&ldquo;{punchLine}&rdquo;</p>}
      </div>
    </section>
  )
}
