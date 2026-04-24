import { lexicalToHTML } from '@/lib/lexicalToHTML'

export default function TwoColumnBlock({
  eyebrow,
  heading,
  subheading,
  body,
  authorityNote,
  style = 'light',
}: any) {
  return (
    <section className={`twocol twocol--${style}`}>
      <div className="container">
        <div className="twocol__wrap">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <div className="accent-line" />
          <h2 className="h2">{heading}</h2>
          {subheading && <p className="lede" style={{ marginTop: '1rem', maxWidth: '65ch' }}>{subheading}</p>}
          {body && (
            <div
              className="twocol__body"
              dangerouslySetInnerHTML={{ __html: lexicalToHTML(body) }}
            />
          )}
          {authorityNote && (
            <p className="twocol__authority">{authorityNote}</p>
          )}
        </div>
      </div>
    </section>
  )
}
