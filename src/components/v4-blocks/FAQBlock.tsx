export default function FAQBlock({ eyebrow, heading, questions }: any) {
  return (
    <section className="faq">
      <div className="container">
        <div style={{ maxWidth: '820px', marginInline: 'auto' }}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <div className="accent-line" />
          <h2 className="h2">{heading}</h2>
        </div>
        <div className="faq__list">
          {(questions || []).map((q: any, i: number) => (
            <details key={i} className="faq__item">
              <summary className="faq__q">
                <span>{q.question}</span>
                <span className="faq__toggle">+</span>
              </summary>
              <div className="faq__a">{q.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
