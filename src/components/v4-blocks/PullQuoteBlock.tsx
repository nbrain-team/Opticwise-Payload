export default function PullQuoteBlock({
  eyebrow,
  quote,
  attribution,
  style = 'dark',
}: any) {
  return (
    <section className={`quote quote--${style}`}>
      <div className="container-narrow">
        <div className="quote__inner">
          {eyebrow && <span className="eyebrow quote__eyebrow">{eyebrow}</span>}
          <blockquote className="quote__text">&ldquo;{quote}&rdquo;</blockquote>
          {attribution && <span className="quote__attr">{attribution}</span>}
        </div>
      </div>
    </section>
  )
}
