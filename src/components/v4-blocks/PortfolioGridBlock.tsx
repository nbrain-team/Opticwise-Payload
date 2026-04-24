import Image from 'next/image'

export default function PortfolioGridBlock({ eyebrow, heading, projects }: any) {
  return (
    <section className="portfolio">
      <div className="container">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <div className="accent-line" />
        <h2 className="h2">{heading}</h2>
        <div className="portfolio__grid">
          {(projects || []).map((p: any, i: number) => {
            const imageUrl = p.image?.url || '/images/placeholder.jpg'
            return (
              <article key={i} className="portfolio__card">
                <div
                  className="portfolio__image"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                  role="img"
                  aria-label={p.image?.alt || p.name}
                />
                <div className="portfolio__body">
                  <h3 className="portfolio__name">{p.name}</h3>
                  <div className="portfolio__location">{p.location}</div>
                  <p className="portfolio__caption">{p.caption}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
