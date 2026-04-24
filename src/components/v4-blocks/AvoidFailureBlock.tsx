export default function AvoidFailureBlock({
  eyebrow,
  heading,
  lede,
  consequences,
  punchLine,
}: any) {
  return (
    <section className="avoid">
      <div className="container">
        {eyebrow && <span className="eyebrow avoid__eyebrow">{eyebrow}</span>}
        <div className="accent-line" style={{ background: 'var(--accent-bright)' }} />
        <h2 className="h2 avoid__heading">{heading}</h2>
        {lede && <p className="lede avoid__lede">{lede}</p>}
        <ul className="avoid__list">
          {(consequences || []).map((c: any, i: number) => (
            <li key={i} className="avoid__item">{c.text}</li>
          ))}
        </ul>
        {punchLine && <p className="avoid__punch">&ldquo;{punchLine}&rdquo;</p>}
      </div>
    </section>
  )
}
