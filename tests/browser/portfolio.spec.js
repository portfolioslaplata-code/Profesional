import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { portfolio } from '../../src/data/portfolio.js'

async function checkLayout(page) {
  const overflow = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  }))
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.viewport)
  const orphanLinks = await page
    .locator('a[href^="#"]')
    .evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href'))
        .filter((href) => !document.getElementById(href.slice(1))),
    )
  expect(orphanLinks).toEqual([])
}

for (const width of [320, 375, 430, 768, 1366, 1920]) {
  test(`demo responsive ${width}px, sin overflow ni enlaces huérfanos`, async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height: 960 })
    await page.goto('/')
    await page.evaluate(() => document.fonts.ready)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sofía Ferrer')
    await checkLayout(page)
    await page.locator('details').first().locator('summary').click()
    await expect(page.getByRole('heading', { name: 'El desafío' }).first()).toBeVisible()
    await checkLayout(page)
    await page.locator('details').first().locator('summary').click()
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
    await page.screenshot({ path: `tmp/qa-hero-${width}.png`, animations: 'disabled' })
    await page.screenshot({ path: `tmp/qa-${width}.png`, fullPage: true })
    expect(errors).toEqual([])
  })
}

test('teclado, menú móvil, descarga del CV y movimiento reducido', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.keyboard.press('Tab')
  await expect(page.getByText(portfolio.ui.skip)).toBeFocused()
  const menu = page.getByRole('button', { name: portfolio.ui.menu, exact: true })
  await menu.click()
  await expect(page.locator('#mobile-navigation')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.locator('#mobile-navigation')).toBeHidden()
  await expect(menu).toBeFocused()
  await menu.click()
  await page.locator('#mobile-navigation a[href="#projects"]').click()
  await expect(page.locator('#mobile-navigation')).toBeHidden()
  const summary = page.locator('details summary').first()
  await summary.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('details').first()).toHaveAttribute('open', '')
  await page.keyboard.press('Enter')
  await expect(page.locator('details').first()).not.toHaveAttribute('open')
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('link', { name: portfolio.cv.label, exact: true }).first().click(),
  ])
  expect(download.suggestedFilename()).toBe(portfolio.cv.fileName)
  expect(await page.locator('html').evaluate((el) => getComputedStyle(el).scrollBehavior)).toBe(
    'auto',
  )
})

test('accesibilidad WCAG AA en desktop, casos abiertos y móvil', async ({ page }) => {
  await page.goto('/')
  await page.locator('details summary').first().click()
  const desktop = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(desktop.violations).toEqual([])
  await page.setViewportSize({ width: 320, height: 812 })
  await page.getByRole('button', { name: portfolio.ui.menu, exact: true }).click()
  const mobile = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()
  expect(mobile.violations).toEqual([])
})

test('HTML estático contiene perfil, casos y SEO; demo sin solicitudes externas', async ({
  page,
  request,
}) => {
  const external = []
  page.on('request', (req) => {
    if (!req.url().startsWith('http://127.0.0.1:4173')) external.push(req.url())
  })
  const response = await request.get('/')
  const html = await response.text()
  expect(html).toContain('Sofía Ferrer')
  expect(html).toContain('Los materiales cruzaban la planta')
  expect(html).toContain('application/ld+json')
  expect(html).toContain('noindex, nofollow')
  await page.goto('/')
  await page.locator('footer').scrollIntoViewIfNeeded()
  await page.waitForLoadState('networkidle')
  expect(external).toEqual([])
  const broken = await page
    .locator('img')
    .evaluateAll((images) =>
      images
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.src),
    )
  expect(broken).toEqual([])
})

test('colores y tipografías se cambian desde theme', async ({ page }) => {
  const data = structuredClone(portfolio)
  data.theme.fonts.body = 'Georgia, serif'
  data.theme.fonts.heading = 'Arial, sans-serif'
  data.theme.colors.primary = '#713228'
  await page.route('**/src/data/portfolio.js*', (route) =>
    route.fulfill({
      contentType: 'application/javascript',
      body: `export const portfolio = ${JSON.stringify(data)}`,
    }),
  )
  await page.goto('http://127.0.0.1:5173')
  await expect(page.locator('.hero-description')).toHaveCSS('font-family', 'Georgia, serif')
  await expect(page.locator('h1')).toHaveCSS('font-family', 'Arial, sans-serif')
  await expect(page.locator('.button-primary').first()).toHaveCSS(
    'background-color',
    'rgb(113, 50, 40)',
  )
})

const variants = {
  'sin secciones opcionales': (data) => {
    data.about = {}
    data.experience = []
    data.education = []
    data.projects.items = []
    data.services.items = []
    data.skills.groups = []
    data.testimonials = []
    data.highlights = []
    data.socials = []
    data.email = ''
    data.photo = null
    data.cv = null
  },
  'un proyecto mínimo y secciones deshabilitadas': (data) => {
    data.projects.items = [
      {
        id: 'minimo',
        name: 'Proyecto sin imagen ni case study',
        description: 'Un proyecto que no necesita campos adicionales para presentarse.',
      },
    ]
    data.settings.sections.about = false
    data.settings.sections.experience = false
    data.settings.sections.contact = false
    data.cv = null
  },
  'seis proyectos, nombre y descripciones largos': (data) => {
    data.firstName = 'María Sofía'
    data.lastName = 'Fernández de los Ríos Montenegro'
    data.profession =
      'Ingeniera industrial especializada en transformación de procesos y operaciones sustentables'
    data.hero.description = data.hero.description.repeat(4)
    data.projects.items = Array.from({ length: 6 }, (_, index) => ({
      ...data.projects.items[index % 3],
      id: `proyecto-${index}`,
      featured: false,
      image: null,
      description: data.projects.items[0].description.repeat(3),
    }))
    data.cv = null
  },
  'secciones reordenadas y fotografía rota con fallback': (data) => {
    data.settings.sectionOrder = ['about', 'education', 'projects', 'skills', 'contact']
    data.photo = { src: '/images/no-existe.webp', alt: 'Retrato opcional' }
    data.settings.sections.experience = false
    data.settings.sections.services = false
    data.settings.sections.testimonials = false
  },
}
for (const [name, mutate] of Object.entries(variants)) {
  test(`robustez: ${name}`, async ({ page }) => {
    const data = structuredClone(portfolio)
    mutate(data)
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.route('**/src/data/portfolio.js*', (route) =>
      route.fulfill({
        contentType: 'application/javascript',
        body: `export const portfolio = ${JSON.stringify(data)}`,
      }),
    )
    await page.setViewportSize({ width: 320, height: 812 })
    await page.goto('http://127.0.0.1:5173')
    await expect(page.getByRole('heading', { level: 1 })).toContainText(data.firstName)
    await checkLayout(page)
    await page.setViewportSize({ width: 1366, height: 900 })
    await checkLayout(page)
    if (!data.cv)
      await expect(page.getByRole('link', { name: portfolio.cv.label, exact: true })).toHaveCount(0)
    if (data.projects.items.length === 0) await expect(page.locator('#projects')).toHaveCount(0)
    if (data.settings.sections.contact === false)
      await expect(page.locator('a[href="#contact"]')).toHaveCount(0)
    expect(errors).toEqual([])
  })
}
