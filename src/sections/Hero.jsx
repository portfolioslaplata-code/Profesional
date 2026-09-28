import { ArrowDown, ArrowUpRight, MapPin } from 'lucide-react'
import { fullName, getCv } from '../utils/portfolio.js'
import { Cta, CvLink, Picture } from '../components/Primitives.jsx'

export default function Hero({ data, visible }) {
  const hero = data.hero || {}
  return (
    <section className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-topline">
        <span className="eyebrow">{hero.index}</span>
        {hero.availability && (
          <span className="availability">
            <i aria-hidden="true" />
            {hero.availability}
          </span>
        )}
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="profession">{data.profession}</p>
          <h1 id="hero-title">{fullName(data)}</h1>
          <p className="hero-statement">
            {hero.title}
            <br />
            <span>{hero.emphasis}</span>
          </p>
          <p className="hero-description">{hero.description}</p>
          <div className="hero-actions">
            <Cta cta={hero.primaryCta} visible={visible} />
            {getCv(data) ? (
              <CvLink cv={getCv(data)} />
            ) : (
              <Cta cta={hero.secondaryCta} visible={visible} className="text-link" />
            )}
          </div>
          {data.location && (
            <p className="location">
              <MapPin size={15} aria-hidden="true" />
              {data.location}
            </p>
          )}
        </div>
        <figure className={`hero-visual ${data.photo?.src ? 'has-portrait' : ''}`}>
          <div className="visual-top">
            <span>{hero.imageLabel}</span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </div>
          <Picture image={data.photo || hero.image} className="hero-image" eager />
          <figcaption>
            <span>{hero.imageCaption}</span>
            <span className="visual-coordinate" aria-hidden="true">
              01 / ∞
            </span>
          </figcaption>
          <div className="visual-stamp" aria-hidden="true">
            <span>{data.monogram}</span>
            <span>↗</span>
          </div>
        </figure>
      </div>
      <div className="hero-bottom">
        <p>{hero.footnote}</p>
        {visible[0] && (
          <a href={`#${visible[0]}`} aria-label={data.ui.nav[visible[0]]}>
            <ArrowDown size={21} />
          </a>
        )}
      </div>
    </section>
  )
}
