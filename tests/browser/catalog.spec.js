import { test, expect } from '@playwright/test'
import { portfolio } from '../../src/data/portfolio.js'
import { getActiveCatalogSections, getActiveCatalogComplements } from '../../src/utils/portfolio.js'

async function openVariant(page, data) {
  await page.route('**/src/data/portfolio.js*', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `export const portfolio = ${JSON.stringify(data)}`,
    }),
  )
  await page.goto('http://127.0.0.1:5173')
  await expect(page.locator('h1')).toHaveText('Sofía Ferrer')
}

test('demo prerenderizada sin contactos ficticios accionables, CV disponible y SEO Profundidad', async ({
  page,
  request,
}) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Demo Profundidad/)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    /Demo Profundidad/,
  )
  await expect(page.locator('#contact a, #contact button, #contact [tabindex]')).toHaveCount(0)
  await expect(page.locator('#contact')).toContainText(portfolio.email)
  await expect(page.locator('#contact')).toContainText('LinkedIn')
  await expect(page.locator('#testimonials .demo-label')).toHaveCount(2)
  await expect(page.locator('#projects .project-card')).toHaveCount(3)
  await expect(page.locator('#projects details')).toHaveCount(2)
  const ids = await page
    .locator('main > section[id]')
    .evaluateAll((sections) => sections.map(({ id }) => id).filter((id) => id !== 'contact'))
  expect(ids).toEqual(getActiveCatalogSections(portfolio).map(({ id }) => id))
  const html = await (await request.get('/')).text()
  expect(html).not.toContain(`mailto:${portfolio.email}`)
  const pdf = await request.get(portfolio.cv.url)
  expect(pdf.ok()).toBeTruthy()
  expect(pdf.headers()['content-type']).toContain('application/pdf')
  expect((await pdf.body()).subarray(0, 5).toString()).toBe('%PDF-')
})

const variants = {
  'sin Experiencia': (data) => {
    data.settings.sections.experience = false
  },
  'sin Formación': (data) => {
    data.settings.sections.education = false
  },
  'un proyecto oculto': (data) => {
    data.projects.items[0].enabled = false
  },
  'todos los proyectos ocultos': (data) => {
    data.projects.items.forEach((item) => {
      item.enabled = false
    })
  },
  'un testimonio oculto': (data) => {
    data.testimonials[0].enabled = false
  },
  'todos los testimonios ocultos': (data) => {
    data.testimonials.forEach((item) => {
      item.enabled = false
    })
  },
  'sin Logros': (data) => {
    data.settings.sections.highlights = false
  },
  'sin CV': (data) => {
    data.cv.enabled = false
  },
}
for (const [name, mutate] of Object.entries(variants)) {
  test(`composición y numeración renderizada: ${name}`, async ({ page }) => {
    const data = structuredClone(portfolio)
    mutate(data)
    await openVariant(page, data)
    const active = getActiveCatalogSections(data)
    expect(
      await page
        .locator('main > section[id]')
        .evaluateAll((sections) => sections.map(({ id }) => id).filter((id) => id !== 'contact')),
    ).toEqual(active.map(({ id }) => id))
    const numberedCount = active.filter(({ id }) => id !== 'highlights').length + 1
    expect(await page.locator('.section-number').allTextContents()).toEqual(
      Array.from({ length: numberedCount }, (_, index) => String(index + 1).padStart(2, '0')),
    )
    await expect(page.locator('.hero a[download]')).toHaveCount(
      getActiveCatalogComplements(data).length,
    )
    await expect(page.locator('#projects .project-card')).toHaveCount(
      data.projects.items.filter((item) => item.enabled !== false).length,
    )
    await expect(page.locator('#testimonials .testimonial')).toHaveCount(
      data.testimonials.filter((item) => item.enabled !== false).length,
    )
    const orphans = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .filter((link) => !document.getElementById(link.hash.slice(1)))
          .map((link) => link.hash),
      )
    expect(orphans).toEqual([])
  })
}

test('marcas demo bloquean correo, teléfono, redes y testimonios con URL, sin depender del footer', async ({
  page,
}) => {
  const data = structuredClone(portfolio)
  data.settings.demoNotice = ''
  data.phone = '+54 221 555 0100'
  data.contact.phoneIsDemo = true
  data.socials[0].url = 'https://example.org/demo'
  data.externalLinks = [{ label: 'Ejemplo', url: 'https://example.org/contacto', demo: true }]
  data.testimonials[0].url = 'https://example.org/testimonio'
  await openVariant(page, data)
  await expect(page.locator('#contact a, #testimonials a')).toHaveCount(0)
  await expect(page.locator('#contact')).toContainText('Correo de muestra')
  await expect(page.locator('#testimonials .demo-label')).toHaveCount(2)
})

test('canales reales siguen activos junto a una red de muestra', async ({ page }) => {
  const data = structuredClone(portfolio)
  data.email = 'cliente@example.org'
  data.contact.emailIsDemo = false
  data.phone = '+54 221 555 0100'
  data.externalLinks = [{ label: 'Perfil real', url: 'https://example.org/real' }]
  await openVariant(page, data)
  await expect(page.locator('#contact a')).toHaveCount(3)
  await expect(page.locator('#contact .email-link')).toHaveAttribute(
    'href',
    'mailto:cliente@example.org',
  )
  await expect(page.locator('#contact a[href="https://wa.me/542215550100"]')).toHaveCount(1)
  await expect(page.getByRole('link', { name: 'Perfil real' })).toHaveAttribute(
    'href',
    'https://example.org/real',
  )
})
