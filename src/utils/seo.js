import { fullName, safeHref, asArray } from './portfolio.js'

const escape = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  )
export function absoluteUrl(path, siteUrl) {
  try {
    const url = new URL(path || siteUrl, siteUrl || undefined)
    return ['https:', 'http:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

export function renderHead(data) {
  const seo = data.seo || {}
  const og = seo.openGraph || {}
  const title = seo.title || fullName(data)
  const canonical = absoluteUrl(seo.canonical || seo.siteUrl, seo.siteUrl)
  const image = absoluteUrl(og.image, seo.siteUrl)
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: fullName(data),
    ...(data.profession && { jobTitle: data.profession }),
    ...(seo.description && { description: seo.description }),
    ...(canonical && { url: canonical }),
    ...(data.photo?.src &&
      absoluteUrl(data.photo.src, seo.siteUrl) && {
        image: absoluteUrl(data.photo.src, seo.siteUrl),
      }),
    sameAs: asArray(data.socials)
      .filter((link) => !link.demo)
      .map((link) => absoluteUrl(link.url))
      .filter(Boolean),
  }
  const tags = [`<title>${escape(title)}</title>`]
  const meta = (key, value, property = false) => {
    if (value)
      tags.push(`<meta ${property ? 'property' : 'name'}="${key}" content="${escape(value)}" />`)
  }
  meta('description', seo.description)
  meta('robots', seo.robots || 'noindex, nofollow')
  meta('theme-color', data.theme?.colors?.background)
  if (canonical) tags.push(`<link rel="canonical" href="${escape(canonical)}" />`)
  if (safeHref(seo.favicon)) tags.push(`<link rel="icon" href="${escape(seo.favicon)}" />`)
  meta('og:type', 'profile', true)
  meta('og:title', og.title || title, true)
  meta('og:description', og.description || seo.description, true)
  meta('og:locale', (data.locale || 'es-AR').replace('-', '_'), true)
  meta('og:url', canonical, true)
  meta('og:image', image, true)
  if (image) meta('og:image:alt', og.imageAlt || title, true)
  if (seo.twitter?.enabled) {
    meta('twitter:card', seo.twitter.card || 'summary_large_image')
    meta('twitter:title', og.title || title)
    meta('twitter:description', og.description || seo.description)
    meta('twitter:image', image)
    if (image) meta('twitter:image:alt', og.imageAlt || title)
    meta('twitter:creator', seo.twitter.handle)
  }
  tags.push(
    `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>`,
  )
  return tags.join('\n    ')
}
