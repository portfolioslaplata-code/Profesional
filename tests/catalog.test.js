import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { portfolio } from '../src/data/portfolio.js'
import {
  getActiveCatalogSections,
  getActiveCatalogComplements,
  getContactItems,
  contactLinks,
  sectionItems,
  visibleSections,
} from '../src/utils/portfolio.js'
import { renderHead } from '../src/utils/seo.js'

test('Profundidad declara Base, seis estándar, dos avanzadas y un CV independiente', () => {
  const active = getActiveCatalogSections(portfolio)
  assert.deepEqual(portfolio.catalogComposition.base, ['navigation', 'hero', 'contact', 'footer'])
  assert.deepEqual(
    active.map(({ id }) => id),
    visibleSections(portfolio).filter((id) => id !== 'contact'),
  )
  assert.equal(active.length, 8)
  assert.equal(active.filter(({ type }) => type === 'standard').length, 6)
  assert.equal(active.filter(({ type }) => type === 'advanced').length, 2)
  // IDs oficiales verificados contra LandingPage/src/data/sections.js; sin dependencia entre repos.
  assert.deepEqual(
    active.map(({ catalogIds }) => catalogIds),
    [
      ['achievements'],
      ['case-study'],
      ['about'],
      ['experience'],
      ['education'],
      ['services'],
      ['skills'],
      ['testimonials'],
    ],
  )
  assert.ok(active.every(({ label }) => label))
  for (const section of active) assert.deepEqual(section.activeCatalogIds, section.catalogIds)
  assert.deepEqual(getActiveCatalogComplements(portfolio), [
    {
      id: 'cv',
      catalogIds: ['download-cv'],
      activeCatalogIds: ['download-cv'],
      label: 'CV descargable',
    },
  ])
})

test('composición activa sigue el orden real, sin duplicar ni mutar la declaración', () => {
  const data = structuredClone(portfolio)
  const declaration = structuredClone(data.catalogComposition)
  data.settings.sectionOrder = [
    'testimonials',
    'education',
    'education',
    'contact',
    'unknown',
    'projects',
  ]
  const active = getActiveCatalogSections(data)
  assert.deepEqual(
    active.map(({ id }) => id),
    visibleSections(data).filter((id) => id !== 'contact'),
  )
  active[0].activeCatalogIds.push('no-modificar-datos')
  assert.deepEqual(data.catalogComposition, declaration)
  assert.deepEqual(getActiveCatalogSections({}), [])
  assert.deepEqual(getActiveCatalogComplements({}), [])
})

test('Experiencia y Formación se evalúan de manera independiente', () => {
  for (const hidden of ['experience', 'education']) {
    const data = structuredClone(portfolio)
    data.settings.sections[hidden] = false
    const ids = getActiveCatalogSections(data).map(({ id }) => id)
    assert.equal(ids.length, 7)
    assert.ok(!ids.includes(hidden))
    assert.ok(ids.includes(hidden === 'experience' ? 'education' : 'experience'))
    data.settings.sections[hidden] = true
    data[hidden] = [{ title: ' ' }]
    assert.ok(!getActiveCatalogSections(data).some(({ id }) => id === hidden))
  }
})

test('proyectos y casos integrados siempre cuentan como un solo Mini case study', () => {
  const data = structuredClone(portfolio)
  const cases = () => getActiveCatalogSections(data).filter(({ id }) => id === 'projects')
  assert.equal(sectionItems(data, 'projects').length, 3)
  assert.equal(cases().length, 1)
  data.projects.items[0].enabled = false
  assert.equal(sectionItems(data, 'projects').length, 2)
  assert.equal(cases().length, 1)
  data.projects.items.forEach((item) => {
    item.enabled = false
  })
  assert.equal(cases().length, 0)
  data.projects.items = [{ name: ' ' }]
  assert.equal(cases().length, 0)
  assert.equal(getActiveCatalogSections(data).length, 7)
})

test('testimonios y Logros cuentan por bloque, excluyendo elementos ocultos o vacíos', () => {
  for (const key of ['testimonials', 'highlights']) {
    const data = structuredClone(portfolio)
    const count = () => getActiveCatalogSections(data).filter(({ id }) => id === key).length
    assert.equal(count(), 1)
    data[key][0].enabled = false
    assert.equal(count(), 1)
    data[key].forEach((item) => {
      item.enabled = false
    })
    assert.equal(count(), 0)
    data[key] = [{}]
    assert.equal(count(), 0)
    data[key] = portfolio[key]
    data.settings.sections[key] = false
    assert.equal(count(), 0)
  }
})

test('bloques vacíos se excluyen sin contar idiomas, métricas, galería o certificaciones aparte', () => {
  const data = structuredClone(portfolio)
  data.about = { lead: ' ', philosophy: ' ', facts: [{ value: ' ' }] }
  data.services.items = []
  data.skills.groups = [{ items: [' '] }]
  assert.deepEqual(
    getActiveCatalogSections(data).map(({ id }) => id),
    ['highlights', 'projects', 'experience', 'education', 'testimonials'],
  )
})

test('desactivar CV no cambia las ocho secciones y el PDF local está disponible', async () => {
  for (const cv of [null, { ...portfolio.cv, enabled: false }, { enabled: true, url: '' }]) {
    const data = { ...portfolio, cv }
    assert.deepEqual(getActiveCatalogComplements(data), [])
    assert.equal(getActiveCatalogSections(data).length, 8)
    assert.equal(data.catalogComposition.complements.length, 1)
  }
  const pdf = await readFile(new URL(`../public${portfolio.cv.url}`, import.meta.url))
  assert.equal(pdf.subarray(0, 5).toString(), '%PDF-')
  assert.ok(pdf.length > 1000)
})

test('canales ficticios no generan enlaces ni sameAs, incluso con URL y sin aviso global', () => {
  const data = structuredClone(portfolio)
  data.settings.demoNotice = ''
  data.socials[0].url = 'https://example.org/demo'
  data.phone = '+54 221 555 0100'
  data.contact.phoneIsDemo = true
  data.externalLinks = [{ label: 'Otro ejemplo', url: 'https://example.org/contacto', demo: true }]
  assert.equal(getContactItems(data).length, 4)
  assert.ok(getContactItems(data).every(({ url }) => url === null))
  assert.deepEqual(contactLinks(data), [])
  assert.ok(visibleSections(data).includes('contact'))
  assert.ok(!renderHead(data).includes('https://example.org/demo'))
  data.email = ''
  data.phone = ''
  data.socials = []
  data.externalLinks = []
  assert.ok(!visibleSections(data).includes('contact'))
})

test('canales reales conservan su acción junto a datos demo y filtran URLs inseguras', () => {
  const data = structuredClone(portfolio)
  data.socials.push({ label: 'Perfil', url: 'https://example.org/real' })
  data.externalLinks = [{ label: 'Inválido', url: 'javascript:alert(1)' }]
  assert.deepEqual(
    contactLinks(data).map(({ url }) => url),
    ['https://example.org/real'],
  )
  data.email = 'cliente@example.org'
  data.contact.emailIsDemo = false
  data.phone = '+54 221 555 0100'
  assert.deepEqual(
    contactLinks(data).map(({ url }) => url),
    ['mailto:cliente@example.org', 'https://wa.me/542215550100', 'https://example.org/real'],
  )
})

test('SEO identifica Profundidad y conserva avisos ficticios y noindex', () => {
  const html = renderHead(portfolio)
  assert.ok(html.includes('Demo Profundidad'))
  assert.ok(!html.includes('Demo Profesional'))
  assert.ok(html.includes('noindex, nofollow'))
  assert.ok(portfolio.testimonials.every((item) => item.demo))
})
