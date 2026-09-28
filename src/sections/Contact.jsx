import { ArrowUpRight, MapPin } from 'lucide-react'
import { asArray, contactLinks, safeHref } from '../utils/portfolio.js'
import { Link } from '../components/Primitives.jsx'

export default function Contact({ data, number }) {
  const contact = data.contact || {}
  return (
    <section id="contact" className="contact-section section">
      <div className="wrap">
        <div className="eyebrow">
          <span className="section-number">{number}</span>
          {contact.eyebrow}
        </div>
        <div className="contact-grid">
          <div>
            <h2>{contact.title}</h2>
            <p className="contact-description">{contact.description}</p>
            {contact.availability && (
              <p className="availability">
                <i aria-hidden="true" />
                {contact.availability}
              </p>
            )}
          </div>
          <div className="contact-links">
            {contactLinks(data).map((link) => (
              <Link
                key={link.url}
                href={link.url}
                className={`contact-link ${link.kind === 'email' ? 'email-link' : ''}`}
              >
                <span>
                  {link.kind === 'email' && <small>{contact.emailLabel}</small>}
                  {link.label}
                </span>
                <ArrowUpRight size={24} aria-hidden="true" />
              </Link>
            ))}
            {asArray(data.socials)
              .filter((link) => !safeHref(link.url) && link.label)
              .map((link) => (
                <div key={link.label} className="contact-link inactive-link">
                  <span>{link.label}</span>
                  <small>{data.ui.demoLink}</small>
                </div>
              ))}
            {data.location && (
              <p className="location">
                <MapPin size={15} aria-hidden="true" />
                {data.location}
              </p>
            )}
          </div>
        </div>
        {contact.demoMessage && data.settings?.demoNotice && (
          <p className="contact-demo">{contact.demoMessage}</p>
        )}
      </div>
    </section>
  )
}
