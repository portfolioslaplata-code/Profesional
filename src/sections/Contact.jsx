import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { getContactItems } from '../utils/portfolio.js'
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
            {getContactItems(data).map((link) =>
              link.url ? (
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
              ) : link.kind === 'email' ? (
                <div
                  key={link.label}
                  className="contact-link email-link"
                  title={contact.demoMessage}
                >
                  <span>
                    <small>{contact.demoEmailLabel || data.ui.demoLink}</small>
                    {link.label}
                  </span>
                  <Mail size={24} aria-hidden="true" />
                </div>
              ) : (
                <div key={link.label} className="contact-link inactive-link" title={link.note}>
                  <span>{link.label}</span>
                  <small>{data.ui.demoLink}</small>
                </div>
              ),
            )}
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
