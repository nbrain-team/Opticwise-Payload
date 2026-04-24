import { lexicalToHTML } from '@/lib/lexicalToHTML'

export default function RichContentBlock({
  eyebrow,
  heading,
  content,
  style = 'light',
}: any) {
  return (
    <section className={`rich rich--${style}`}>
      <div className="container-narrow">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {heading && <h2 className="h2" style={{ marginTop: '1rem', marginBottom: '2rem' }}>{heading}</h2>}
        <div
          className="rich__content"
          dangerouslySetInnerHTML={{ __html: lexicalToHTML(content) }}
        />
      </div>
    </section>
  )
}
