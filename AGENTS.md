# Profesional · Portfolios La Plata

Trabajar directamente en este repositorio independiente. Leer también `../AGENTS.md` y `../producto-docs/`. No modificar modelos Esencial sin pedido explícito.

## Arquitectura

- React + Vite + JavaScript + Tailwind CSS mediante `@tailwindcss/vite`.
- Datos del cliente y tokens visuales en `src/data/portfolio.js`.
- Mantener el núcleo compartido; las ampliaciones de casos viven en `professional.caseStudies`.
- Visibilidad, navegación y CTA usan las mismas reglas en `src/utils/portfolio.js`.
- Casos dentro de la one-page con `details/summary` nativo.
- Build estático prerenderizado. No introducir backend, CMS ni páginas adicionales.
- Analytics apagado por defecto y sin proveedor impuesto. Leer el README antes de integrarlo.
- Recursos locales. Mantener accesibilidad, reduced motion y fallbacks de imágenes.
- No activar enlaces ficticios ni quitar las marcas demo hasta cargar datos reales.

## Comprobaciones

Antes de entregar cambios o crear commits: `npm run lint`, `npm test`, `npm run build`.
Para cambios visuales o de datos opcionales: `npm run test:browser` y revisar capturas en `tmp/qa-*.png`.
Las pruebas usan Edge por defecto; `PLAYWRIGHT_CHANNEL=chrome` permite Chrome instalado.
No hacer push, deploy ni comprar dominios sin pedido. Nunca usar force push.
