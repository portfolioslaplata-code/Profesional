export const sectionKeys = [
  'about',
  'highlights',
  'projects',
  'experience',
  'education',
  'services',
  'skills',
  'testimonials',
  'contact',
]
export const asArray = (value) => (Array.isArray(value) ? value : [])
export const textValue = (value) => typeof value === 'string' && value.trim().length > 0
export const fullName = (data) => [data.firstName, data.lastName].filter(Boolean).join(' ')

export function safeHref(value) {
  if (!textValue(value)) return null
  const url = value.trim()
  if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url
  if (/^\/(?!\/)/.test(url) || /^#[\w-]+$/.test(url)) return url
  return null
}

export function sectionItems(data, key) {
  const items = data[key]?.items ?? data[key]
  return asArray(items).filter(
    (item) =>
      item &&
      item.enabled !== false &&
      (key === 'highlights'
        ? textValue(String(item.value ?? '')) && textValue(item.label)
        : key === 'testimonials'
          ? textValue(item.text)
          : textValue(item.name || item.title)),
  )
}

export function skillGroups(data) {
  return asArray(data.skills?.groups)
    .map((group) => ({ ...group, items: asArray(group.items).filter(textValue) }))
    .filter((group) => group.items.length)
}

export function getContactItems(data) {
  const links = []
  if (textValue(data.email) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    links.push({
      label: data.email,
      url: `mailto:${data.email}`,
      kind: 'email',
      demo: Boolean(data.contact?.emailIsDemo),
    })
  const phone = String(data.phone || '').replace(/\D/g, '')
  if (phone.length >= 8)
    links.push({
      label: data.contact?.whatsappLabel || 'WhatsApp',
      url: `https://wa.me/${phone}`,
      kind: 'whatsapp',
      demo: Boolean(data.contact?.phoneIsDemo),
    })
  return [...links, ...asArray(data.socials), ...asArray(data.externalLinks)]
    .filter((link) => textValue(link?.label) && (link.demo || safeHref(link.url)))
    .map((link) => ({ ...link, url: link.demo ? null : safeHref(link.url) }))
}

// Conserva los canales reales separados de los datos visibles de muestra.
export function contactLinks(data) {
  return getContactItems(data).filter((link) => link.url)
}

export function visibleSections(data) {
  const available = {
    about: Boolean(
      textValue(data.about?.lead) ||
      asArray(data.about?.paragraphs).some(textValue) ||
      asArray(data.about?.facts).some((fact) => textValue(fact?.value)) ||
      textValue(data.about?.philosophy),
    ),
    skills: skillGroups(data).length > 0,
    contact: getContactItems(data).length > 0,
  }
  for (const key of sectionKeys.filter((key) => !(key in available)))
    available[key] = sectionItems(data, key).length > 0
  const ordered = [...new Set([...asArray(data.settings?.sectionOrder), ...sectionKeys])]
  return ordered.filter(
    (key) =>
      sectionKeys.includes(key) && data.settings?.sections?.[key] !== false && available[key],
  )
}

export function validLink(href, visible) {
  const safe = safeHref(href)
  return safe && (!safe.startsWith('#') || safe === '#top' || visible.includes(safe.slice(1)))
    ? safe
    : null
}

export function getCv(data) {
  return data.cv?.enabled !== false && safeHref(data.cv?.url) ? data.cv : null
}

// Sigue el orden real de App, incluso cuando settings.sectionOrder cambia.
// Cada bloque es independiente; los elementos internos no suman secciones.
export function getActiveCatalogSections(data) {
  const declared = asArray(data.catalogComposition?.sections)
  return visibleSections(data)
    .map((id) => declared.find((section) => section.id === id))
    .filter(Boolean)
    .map((section) => ({ ...section, activeCatalogIds: [...section.catalogIds] }))
}

// getCv también gobierna los enlaces de Hero y menú. El build verifica el recurso local.
export function getActiveCatalogComplements(data) {
  return asArray(data.catalogComposition?.complements)
    .filter((complement) => complement.id === 'cv' && getCv(data))
    .map((complement) => ({ ...complement, activeCatalogIds: [...complement.catalogIds] }))
}

export function getCaseStudy(data, id) {
  const detail = asArray(data.professional?.caseStudies).find((item) => item.projectId === id)
  return detail &&
    (['context', 'challenge', 'solution', 'result'].some((key) => textValue(detail[key])) ||
      asArray(detail.gallery).some((image) => safeHref(image.src)))
    ? detail
    : null
}

export function themeStyle(theme = {}) {
  const style = {}
  for (const [key, value] of Object.entries(theme.colors || {})) {
    const name = key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
    if (/^[a-z-]+$/.test(name) && typeof value === 'string') style[`--${name}`] = value
  }
  if (theme.fonts?.heading) style['--font-heading'] = theme.fonts.heading
  if (theme.fonts?.body) style['--font-body'] = theme.fonts.body
  return style
}
