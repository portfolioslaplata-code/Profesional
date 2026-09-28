import test from 'node:test'
import assert from 'node:assert/strict'
import { portfolio } from '../src/data/portfolio.js'
import {
  getCaseStudy,
  getCv,
  visibleSections,
  validLink,
  safeHref,
  skillGroups,
} from '../src/utils/portfolio.js'
import { absoluteUrl, renderHead } from '../src/utils/seo.js'
import { analyticsConfig } from '../src/utils/analytics.js'

test('secciones vacías o deshabilitadas no crean navegación ni CTA huérfanos', () => {
  const data = structuredClone(portfolio)
  data.projects.items = []
  data.experience = []
  data.education = []
  data.services.items = []
  data.highlights = []
  data.testimonials = []
  data.skills.groups = [{ name: 'Vacío', items: [] }]
  data.settings.sections.about = false
  const visible = visibleSections(data)
  assert.deepEqual(visible, ['contact'])
  assert.equal(validLink('#projects', visible), null)
  assert.equal(validLink('#about', visible), null)
  assert.equal(validLink('#contact', visible), '#contact')
  assert.deepEqual(skillGroups(data), [])
})

test('sin datos opcionales, sin contacto y sin CV', () => {
  const data = {
    ui: portfolio.ui,
    firstName: 'Nombre muy largo',
    lastName: 'Apellido compuesto muy extenso',
  }
  assert.deepEqual(visibleSections(data), [])
  assert.equal(getCv(data), null)
  assert.equal(getCv({ cv: { enabled: true, url: '' } }), null)
  assert.equal(getCv({ cv: { enabled: false, url: '/cv.pdf' } }), null)
  assert.equal(getCaseStudy(data, 'none'), null)
})

test('uno o seis proyectos, sin imágenes o sin casos', () => {
  for (const count of [1, 6]) {
    const data = structuredClone(portfolio)
    data.projects.items = Array.from({ length: count }, (_, index) => ({
      id: `p${index}`,
      name: `Proyecto ${index}`,
    }))
    assert.ok(visibleSections(data).includes('projects'))
    assert.equal(getCaseStudy(data, 'p0'), null)
  }
  assert.ok(getCaseStudy(portfolio, 'flujo-productivo'))
})

test('secciones se reordenan, sin duplicados ni claves desconocidas', () => {
  const data = structuredClone(portfolio)
  data.settings.sectionOrder = ['contact', 'contact', 'inexistente', 'about']
  const visible = visibleSections(data)
  assert.deepEqual(visible.slice(0, 2), ['contact', 'about'])
  assert.equal(visible.filter((key) => key === 'contact').length, 1)
  assert.ok(!visible.includes('inexistente'))
})

test('URLs inseguras no se convierten en enlaces', () => {
  assert.equal(safeHref('javascript:alert(1)'), null)
  assert.equal(safeHref('//unexpected.test'), null)
  assert.equal(safeHref('https://example.com'), 'https://example.com')
  assert.equal(
    absoluteUrl('/images/og.png', 'https://portfolio.test'),
    'https://portfolio.test/images/og.png',
  )
  assert.equal(absoluteUrl('/images/og.png', ''), '')
  assert.equal(absoluteUrl('javascript:alert(1)'), '')
})

test('SEO configura canonical, tarjetas y JSON-LD seguro desde datos', () => {
  const data = structuredClone(portfolio)
  data.seo.siteUrl = 'https://portfolio.test'
  data.firstName = '</script><script>alert(1)</script>'
  const html = renderHead(data)
  assert.ok(html.includes('https://portfolio.test/images/og-cover.png'))
  assert.ok(html.includes('rel="canonical" href="https://portfolio.test/"'))
  assert.ok(html.includes('application/ld+json'))
  assert.ok(!html.includes('</script><script>alert'))
  assert.ok(!renderHead(portfolio).includes('rel="canonical"'))
})

test('analytics no carga sin habilitación, privacidad y URL válidas', () => {
  assert.equal(analyticsConfig({}), null)
  assert.equal(analyticsConfig({ VITE_ANALYTICS_ENABLED: 'true' }), null)
  const env = {
    VITE_ANALYTICS_ENABLED: 'true',
    VITE_ANALYTICS_PRIVACY_REVIEWED: 'true',
    VITE_ANALYTICS_SCRIPT_URL: 'https://analytics.example.com/script.js',
  }
  assert.equal(analyticsConfig(env).url, env.VITE_ANALYTICS_SCRIPT_URL)
  assert.equal(analyticsConfig({ ...env, VITE_ANALYTICS_SCRIPT_URL: 'http://insecure.test' }), null)
  assert.equal(analyticsConfig({ ...env, VITE_ANALYTICS_ATTRIBUTES: 'bad-json' }), null)
})
