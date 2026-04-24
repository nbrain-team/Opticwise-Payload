export default function FiveStandardBlock({
  eyebrow,
  heading,
  tagline,
  standards,
}: any) {
  return (
    <section className="five-s">
      <div className="container">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <div className="accent-line" />
        <h2 className="h2">{heading}</h2>
        {tagline && <p className="lede" style={{ marginTop: '1rem', maxWidth: '60ch' }}>{tagline}</p>}
        <div className="five-s__grid">
          {(standards || []).map((s: any, i: number) => (
            <div key={i} className="five-s__item">
              <div className="five-s__num">0{i + 1}</div>
              <h4 className="five-s__title">{s.title}</h4>
              <p className="five-s__desc">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
