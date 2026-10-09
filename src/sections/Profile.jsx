import { ArrowUpRight, ChartNoAxesCombined, Route, ScanLine, Quote } from 'lucide-react'
import { asArray, sectionItems, skillGroups } from '../utils/portfolio.js'
import { Cta, Link, Picture, SectionHeading } from '../components/Primitives.jsx'

export function Highlights({ data }) {
  return (
    <section id="highlights" className="highlights wrap" aria-label={data.ui.nav.highlights}>
      {sectionItems(data, 'highlights').map((item) => (
        <div className="highlight" key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </section>
  )
}

export function About({ data, number }) {
  const about = data.about
  return (
    <section id="about" className="about-section section">
      <div className="wrap">
        <SectionHeading number={number} eyebrow={about.eyebrow} title={about.title} />
        <div className="about-grid">
          <div className="about-intro">
            <p>{about.lead}</p>
            {about.philosophy && (
              <div className="philosophy">
                <span aria-hidden="true">✳</span>
                <span>{about.philosophy}</span>
              </div>
            )}
          </div>
          <div className="about-copy">
            {asArray(about.paragraphs).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <dl className="about-facts">
              {asArray(about.facts)
                .filter((fact) => fact.value)
                .map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Experience({ data, number }) {
  return (
    <section id="experience" className="section wrap">
      <SectionHeading number={number} {...data.journey} />
      <div className="journey-layout">
        <h3 className="side-title">
          {data.ui.experienceTitle}
          <ArrowUpRight size={22} aria-hidden="true" />
        </h3>
        <div className="timeline">
          {sectionItems(data, 'experience').map((item, index) => (
            <article key={item.id || index} className="timeline-item reveal">
              <p className="period">{item.period}</p>
              <h3>{item.title}</h3>
              <p className="institution">
                {item.institution}
                {item.location && <span> · {item.location}</span>}
              </p>
              {item.description && <p>{item.description}</p>}
              {asArray(item.achievements).length > 0 && (
                <ul>
                  {item.achievements.map((achievement) => (
                    <li key={achievement}>{achievement}</li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Education({ data, number }) {
  return (
    <section id="education" className="section education-section wrap">
      <div className="journey-layout">
        <div>
          <p className="eyebrow">
            <span className="section-number">{number}</span>
            {data.ui.nav.education}
          </p>
          <h2 className="side-title education-title">{data.ui.educationTitle}</h2>
        </div>
        <div className="education-list">
          {sectionItems(data, 'education').map((item, index) => (
            <article className="education-item reveal" key={item.id || index}>
              <div className="education-meta">
                <span>{item.period}</span>
                {item.status && <span className="status-tag">{item.status}</span>}
              </div>
              <h3>{item.title}</h3>
              <p className="institution">{item.institution}</p>
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const serviceIcons = { scan: ScanLine, route: Route, chart: ChartNoAxesCombined }
export function Services({ data, number, visible }) {
  return (
    <section id="services" className="section services-section">
      <div className="wrap">
        <SectionHeading number={number} {...data.services} />
        <div className="services-grid">
          {sectionItems(data, 'services').map((item, index) => {
            const Icon = serviceIcons[item.icon]
            return (
              <article className="service-card reveal" key={item.id || index}>
                <div className="service-top">
                  {Icon && <Icon size={27} strokeWidth={1.4} aria-hidden="true" />}
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <Cta cta={item.cta} visible={visible} className="text-link" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function Skills({ data, number }) {
  return (
    <section id="skills" className="section wrap">
      <SectionHeading number={number} {...data.skills} />
      <div className="skills-grid">
        {skillGroups(data).map((group) => (
          <div key={group.name}>
            <h3>{group.name}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">↗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

export function Testimonials({ data, number }) {
  return (
    <section id="testimonials" className="section testimonials-section wrap">
      <SectionHeading
        number={number}
        eyebrow={data.ui.testimonialsEyebrow}
        title={data.ui.testimonialsTitle}
      />
      <div className="testimonials-grid">
        {sectionItems(data, 'testimonials').map((item, index) => (
          <figure className="testimonial reveal" key={item.id || index}>
            <Quote size={26} strokeWidth={1.4} aria-hidden="true" />
            <blockquote>{item.text}</blockquote>
            <figcaption>
              {item.photo?.src && <Picture image={item.photo} className="testimonial-photo" />}
              <div>
                <strong>{item.name}</strong>
                <p>{[item.role, item.institution].filter(Boolean).join(' · ')}</p>
                {item.demo && <span className="demo-label">{data.ui.demoTestimonial}</span>}
                <Link href={item.demo ? null : item.url} className="text-link">
                  {item.name}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
