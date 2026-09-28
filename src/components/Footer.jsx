import { ArrowUp } from 'lucide-react'
import { fullName, safeHref } from '../utils/portfolio.js'
import { Link } from './Primitives.jsx'

export default function Footer({ data }) {
  const credit = data.settings?.credit
  return (
    <footer className="footer wrap">
      <div className="footer-main">
        <div>
          <p className="footer-name">{fullName(data)}</p>
          <p>{data.ui.footerNote}</p>
        </div>
        <a className="back-top" href="#top">
          {data.ui.backTop}
          <ArrowUp size={16} aria-hidden="true" />
        </a>
      </div>
      <div className="footer-meta">
        {data.settings?.demoNotice && <p>{data.settings.demoNotice}</p>}
        {credit?.enabled && (
          <p>
            {credit.label}{' '}
            {safeHref(credit.url) ? (
              <Link href={credit.url}>{credit.name}</Link>
            ) : (
              <span>{credit.name}</span>
            )}
            <span className="credit-dot" aria-hidden="true">
              ↗
            </span>
          </p>
        )}
      </div>
    </footer>
  )
}
