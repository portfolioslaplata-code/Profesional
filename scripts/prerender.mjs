import { readFile, writeFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createServer } from 'vite'
import { portfolio } from '../src/data/portfolio.js'
import { absoluteUrl } from '../src/utils/seo.js'
import { getCv, asArray, visibleSections, sectionItems, getCaseStudy } from '../src/utils/portfolio.js'

// Fallar antes de publicar un CV o una imagen local inexistente.
const visible = visibleSections(portfolio)
const projects = visible.includes('projects') ? sectionItems(portfolio, 'projects') : []
const testimonials = visible.includes('testimonials') ? sectionItems(portfolio, 'testimonials') : []
const assets = [
  getCv(portfolio)?.url,
  portfolio.photo?.src || portfolio.hero?.image?.src,
  portfolio.seo?.favicon,
  portfolio.seo?.openGraph?.image,
  ...projects.map((project) => project.image?.src),
  ...projects.flatMap((project) =>
    asArray(getCaseStudy(portfolio, project.id)?.gallery).map((image) => image.src),
  ),
  ...testimonials.map((item) => item.photo?.src),
].filter((url) => url?.startsWith('/') && !url.startsWith('//'))
for (const asset of assets) {
  try {
    await access(resolve('public', asset.slice(1)))
  } catch {
    throw new Error(
      `No existe public${asset}. Reemplazá el archivo o desactivá su referencia en src/data/portfolio.js.`,
    )
  }
}

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx')
  const html = await readFile('dist/index.html', 'utf8')
  await writeFile('dist/index.html', html.replace('<!--app-html-->', render(portfolio)))
} finally {
  await server.close()
}

const siteUrl = absoluteUrl(
  portfolio.seo?.canonical || portfolio.seo?.siteUrl,
  portfolio.seo?.siteUrl,
)
const noindex = /noindex/i.test(portfolio.seo?.robots || 'noindex')
const xmlEscape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
if (siteUrl && !noindex) {
  await writeFile(
    'dist/sitemap.xml',
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${xmlEscape(siteUrl)}</loc></url></urlset>\n`,
  )
}
await writeFile(
  'dist/robots.txt',
  `User-agent: *\n${noindex ? 'Disallow: /' : 'Allow: /'}\n${siteUrl && !noindex ? `Sitemap: ${new URL('/sitemap.xml', siteUrl).href}\n` : ''}`,
)
console.log(
  'HTML prerenderizado, metadatos y robots generados. ' +
    (noindex
      ? 'Demo protegida con noindex.'
      : siteUrl
        ? 'Sitemap generado.'
        : 'Falta siteUrl: canonical/sitemap omitidos.'),
)
