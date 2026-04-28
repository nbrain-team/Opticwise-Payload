import Link from 'next/link'

export default function CardGridBlock({
  eyebrow,
  heading,
  subheading,
  columns = '2',
  style = 'light',
  cards,
  closingLine,
}: any) {
  return (
    <section className={`cards cards--${style} cards--cols-${columns}`}>
      <div className="container">
        <div className="cards__header">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <div className="accent-line" />
          <h2 className="h2">{heading}</h2>
          {subheading && <p className="lede" style={{ marginTop: '1rem', maxWidth: '60ch' }}>{subheading}</p>}
        </div>
        <div className="cards__grid">
          {(cards || []).map((card: any, i: number) => {
            const logo =
              card?.image &&
              typeof card.image === 'object' &&
              typeof card.image.url === 'string'
                ? card.image
                : null
            const Content = (
              <>
                {logo && (
                  <div className="mb-4 px-4 flex justify-center items-center min-h-0">
                    <img
                      src={logo.url}
                      alt={logo.alt || card.title || ''}
                      className="max-h-[60px] w-auto object-contain object-center"
                    />
                  </div>
                )}
                <h3 className="cards__card-title">{card.title}</h3>
                <p className="cards__card-desc">{card.description}</p>
              </>
            )
            return card.href ? (
              <Link key={i} href={card.href} className="cards__card">
                {Content}
              </Link>
            ) : (
              <div key={i} className="cards__card">
                {Content}
              </div>
            )
          })}
        </div>
        {closingLine && <p className="cards__closing">{closingLine}</p>}
      </div>
    </section>
  )
}
