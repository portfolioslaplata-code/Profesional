# Profundidad · Portfolios La Plata

## Contexto independiente

Demo de portfolio con mayor profundidad del ecosistema Portfolios La Plata. **El nombre del repositorio/carpeta es histórico. Esta aplicación ya no representa un «Plan Profesional».** Muestra proyectos desarrollados, mini case studies, trayectoria, logros, testimonios y recursos visuales avanzados. El perfil ficticio actual es de ingeniería industrial; la estructura admite otras disciplinas.

La oferta vigente es **Portfolio Base + secciones estándar/avanzadas + complementos + desarrollo a medida**. `LandingPage` es la fuente comercial principal de precios, catálogo y mensaje. Esta demo es referencia de diseño e implementación, sin definir precios, planes ni límites comerciales. Sus capacidades ilustran secciones avanzadas y composiciones más profundas, sin hacerlas exclusivas de este modelo. Hero y Contacto/Footer pertenecen a la base; CV descargable es el único complemento actual. CV, dominio, SEO y Analytics no establecen un nivel comercial superior a Editorial o Minimal.

## Arquitectura y datos

- React + Vite + JavaScript + Tailwind CSS mediante `@tailwindcss/vite`. One-page estática prerenderizada; no introducir backend, CMS ni páginas adicionales sin un pedido que cambie ese alcance técnico.
- `src/data/portfolio.js` centraliza contenido y tokens en `theme.colors` / `theme.fonts`. Preservar el núcleo de datos y las extensiones opcionales; no hardcodear datos del cliente ni sincronizar schemas entre repos sin pedido.
- `catalogComposition` declara Base + 6 estándar (Logros, Sobre mí, Experiencia, Formación, Servicios, Habilidades) + 2 avanzadas (Mini case study, Testimonios) + CV descargable. Los IDs oficiales son `achievements`, `case-study` y `download-cv` para los bloques internos `highlights`, `projects` y el complemento `cv`. No sumar tarjetas, casos, cifras ni elementos integrados como secciones independientes.
- `professional.caseStudies` es una clave técnica histórica. Los casos se relacionan con `projects.items` mediante `projectId`; preservar IDs únicos y estables, sin duplicar rol, cliente o herramientas. El schema propuesto en documentos compartidos no reemplaza este contrato implementado.
- `src/utils/portfolio.js` comparte reglas de visibilidad, navegación y CTA. Respetar contenido válido, `settings.sections`, `settings.sectionOrder` y `settings.navigation`; no enlazar a bloques ocultos. Omitir una sección del orden no la desactiva: usar su flag.
- `getActiveCatalogSections` reutiliza `visibleSections`, respeta el orden real y devuelve `activeCatalogIds`; `sectionItems` excluye elementos con `enabled: false` o sin contenido válido. Experiencia y Formación cuentan por separado; la línea visual de Experiencia no es Timeline avanzada y Logros no es Métricas/resultados avanzada. La numeración omite Logros e incluye Contacto, por lo que no equivale al conteo comercial.
- `getActiveCatalogComplements` reutiliza `getCv`; el build verifica la existencia del PDF local. `cv: null` o `enabled: false` ocultan el acceso y desactivan el complemento sin alterar las secciones. Mantener el PDF demo existente salvo pedido de reemplazo.
- Casos ampliables con `details/summary` nativo dentro de la página; omitir campos vacíos y controles de expansión sin caso. Experiencia y formación tienen bloques independientes. No añadir carruseles automáticos a testimonios.

## Identidad, contenido y recursos

- Preservar composición de mayor desarrollo narrativo, proyectos destacados, métricas contextualizadas, trayectoria y espacios de lectura. Paleta cálida con terracota/verde, configurable desde datos; Manrope y DM Sans locales.
- `src/styles/theme.css` reúne hojas separadas para base, hero, secciones y responsive; fuentes en `src/styles/fonts.css`. Las ilustraciones SVG tienen su propia paleta: los tokens no recolorean sus fills automáticamente.
- Español argentino con voseo, tono claro y cercano; mobile-first, semántica, contraste, foco y teclado. `useReveal` debe mantener contenido disponible y respetar movimiento reducido. Mantener imágenes locales, fallbacks y carga diferida cuando corresponda.
- No inventar testimonios, clientes, métricas ni resultados reales. Conservar avisos y etiquetas demo hasta cargar material autorizado. No activar enlaces ficticios; `public/cv-demo.pdf` nunca se entrega como CV real de un cliente.
- `getContactItems` mantiene muestras como texto sin URL: `contact.emailIsDemo`, `contact.phoneIsDemo` y `demo` en redes/enlaces. `contactLinks` contiene solo canales accionables. Quitar el aviso global no activa contactos. Testimonios demo conservan su etiqueta y no enlazan al autor; redes demo se excluyen de JSON-LD.

## SEO, Analytics y publicación

- `src/utils/seo.js`, `src/entry-server.jsx` y `scripts/prerender.mjs` sostienen metadata, JSON-LD y HTML estático. El build verifica recursos locales: corregir referencias ausentes, no ocultar los fallos.
- Nombre público y SEO/OG: Profundidad. Conservar nombres técnicos históricos cuando corresponda. El rótulo de la imagen OG se configura en `seo.openGraph.imageLabel` y su generador está en `scripts/demo-assets.py`.
- `seo.siteUrl` y canonical no deben inventarse. La demo usa `noindex, nofollow`; solo cambiar al preparar un sitio real. Sitemap depende de URL válida e indexación habilitada. La implementación supone la raíz del dominio, sin soporte automático de subcarpetas.
- Analytics está apagado por defecto y no impone proveedor. Consultar README y `.env.example` antes de integrarlo; resolver proveedor, titularidad, privacidad y consentimiento aplicable. `VITE_*` es público, sin secretos; el flag de revisión de privacidad no sustituye consentimiento.
- Consultar `../../AGENTS.md` y `../producto-docs/` si están disponibles; leer documentos históricos como referencias técnicas, no como paquetes vigentes. No modificar demos vecinas por una tarea local. No hacer push, deploy ni comprar dominios sin pedido; nunca force push.

## Validación

Consultar `package.json`. Tras cambios relevantes de implementación: `npm run lint`, `npm test`, `npm run build`. Para cambios visuales o datos opcionales, ejecutar `npm run test:browser` después del build y revisar `tmp/qa-*.png`. Playwright usa Edge; `PLAYWRIGHT_CHANNEL=chrome` permite Chrome instalado (en PowerShell, establecer la variable mediante `$env:PLAYWRIGHT_CHANNEL`). Para cambios solo de instrucciones, revisar documentación y diff.
