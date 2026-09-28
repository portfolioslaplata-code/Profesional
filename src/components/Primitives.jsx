import { useState } from 'react'
import { ArrowUpRight, ArrowDown, Download } from 'lucide-react'
import { safeHref, validLink } from '../utils/portfolio.js'

export function Link({ href, children, className = '', ...props }) {
  const url = safeHref(href)
  if (!url) return null
  const external = /^https?:\/\//.test(url)
  return (
    <a
      href={url}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  )
}

export function Cta({ cta, visible, className = 'button button-primary' }) {
  const href = validLink(cta?.href, visible)
  return href && cta?.label ? (
    <Link href={href} className={className}>
      {cta.label}
      <ArrowUpRight size={18} aria-hidden="true" />
    </Link>
  ) : null
}

export function CvLink({ cv, className = 'text-link' }) {
  return cv ? (
    <Link href={cv.url} download={cv.fileName || true} className={className}>
      {cv.label || 'Descargar CV'}
      <Download size={16} aria-hidden="true" />
    </Link>
  ) : null
}

export function SectionHeading({ number, eyebrow, title, description }) {
  return (
    <div className="section-heading reveal">
      <div className="eyebrow">
        <span className="section-number">{number}</span>
        {eyebrow}
      </div>
      <div className="heading-row">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </div>
  )
}

export function Picture({ image, className = '', eager = false, fallback }) {
  const [failed, setFailed] = useState(false)
  return image?.src && safeHref(image.src) && !failed ? (
    <img
      src={image.src}
      alt={image.alt || ''}
      width={image.width || 960}
      height={image.height || 720}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={className}
      style={{ objectPosition: image.position || 'center' }}
      onError={() => setFailed(true)}
    />
  ) : (
    <div className={`image-placeholder ${className}`}>
      <span aria-hidden="true">↗</span>
      {fallback && <span>{fallback}</span>}
    </div>
  )
}

export function DownLink({ href, children }) {
  return (
    <a className="text-link" href={href}>
      {children}
      <ArrowDown size={16} aria-hidden="true" />
    </a>
  )
}
