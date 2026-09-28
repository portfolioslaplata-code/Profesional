// Punto de integración neutro. No hay proveedor, cookies ni tracking en la demo.
export function analyticsConfig(env) {
  if (env.VITE_ANALYTICS_ENABLED !== 'true' || env.VITE_ANALYTICS_PRIVACY_REVIEWED !== 'true')
    return null
  try {
    const url = new URL(env.VITE_ANALYTICS_SCRIPT_URL)
    if (url.protocol !== 'https:') return null
    const attributes = JSON.parse(env.VITE_ANALYTICS_ATTRIBUTES || '{}')
    if (!attributes || typeof attributes !== 'object' || Array.isArray(attributes)) return null
    return { url: url.href, attributes }
  } catch {
    return null
  }
}

export function initAnalytics(env) {
  const config = analyticsConfig(env)
  if (!config || document.querySelector('[data-portfolio-analytics]')) return
  const script = document.createElement('script')
  script.src = config.url
  script.defer = true
  script.dataset.portfolioAnalytics = 'true'
  for (const [key, value] of Object.entries(config.attributes)) {
    if (/^[a-z][a-z0-9-]*$/.test(key) && typeof value === 'string')
      script.setAttribute(`data-${key}`, value)
  }
  document.head.append(script)
}
