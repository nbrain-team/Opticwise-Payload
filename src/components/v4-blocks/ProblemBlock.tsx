export default function ProblemBlock({ eyebrow, heading, intro, items, closingLine }: any) {
  return (
    <section className="problem">
      <div className="container">
        <div className="problem__grid">
          <div>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <div className="accent-line" />
            <h2 className="h2">{heading}</h2>
            {intro && <p className="lede" style={{ marginTop: '1.5rem' }}>{intro}</p>}
          </div>
          <div>
            <ul className="problem__list">
              {(items || []).map((item: any, i: number) => (
                <li key={i} className="problem__item">
                  <span className="problem__item-label">{item.label}</span>
                  <span className="problem__item-desc">{item.description}</span>
                </li>
              ))}
            </ul>
            {closingLine && <p className="problem__closing">{closingLine}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
