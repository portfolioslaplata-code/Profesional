# Profesional · Portfolios La Plata

Base comercial reutilizable de portfolio **one-page**, con una demo ficticia de ingeniería industrial. Datos, colores, tipografías y secciones configurables sin reescribir componentes. Casos ampliables, trayectoria, métricas, recomendaciones y HTML prerenderizado diferencian este producto de Esencial.

No incluye backend, CMS, autenticación, blog ni envío de formularios. Los límites comerciales siguen `../producto-docs/catalogo.md`.

## Iniciar

Node.js **20.19+ o 22.12+** (la implementación se validó con Node 22.17). Desde esta misma carpeta:

```sh
npm ci
npm run dev
```

```sh
npm run lint
npm test
npm run build
npm run preview
```

`npm run build` genera `dist/`, prerenderiza el contenido y verifica que los archivos locales referenciados existan. Si falta un CV o una imagen, falla con la ruta que hay que corregir; nunca entrega silenciosamente un archivo inexistente. El preview permite revisar exactamente el resultado publicable.

React 19, Vite 8, Tailwind CSS 4 con su integración oficial `@tailwindcss/vite`, JavaScript y Lucide. Fuentes variables **Manrope** y **DM Sans** empaquetadas localmente mediante Fontsource. El lockfile fija las versiones reproducibles. No se necesita configuración Tailwind v3 ni PostCSS adicional.

## Arquitectura

```text
src/
  data/portfolio.js           Contenido e identidad del cliente
  components/                Header, footer y elementos compartidos
  sections/                  Hero, proyectos, perfil y contacto
  styles/theme.css           Entrada CSS; base, hero, sections y responsive separados
  hooks/useReveal.js         Animación progresiva, sin ocultar contenido
  utils/portfolio.js         Validación de enlaces y visibilidad
  utils/seo.js               Metadatos y JSON-LD
  utils/analytics.js         Integración opcional, inactiva por defecto
  App.jsx                    Orden y composición de secciones
  entry-server.jsx           Render estático para producción
scripts/prerender.mjs         Verifica assets; genera HTML, robots y sitemap
scripts/demo-assets.*         Generadores opcionales de CV/OG demo
public/images/               Ilustraciones locales y Open Graph
public/cv-demo.pdf            CV ficticio, una página
tests/                       Pruebas de configuración y navegador
```

## Crear un nuevo cliente

1. Duplicar el repositorio en **una carpeta propia**, vincularlo al repositorio del cliente y ejecutar `npm ci`.
2. Editar `src/data/portfolio.js`: nombre, profesión, textos, experiencia, formación, métricas y datos de contacto. Conservar `ui` y traducirlo si hace falta.
3. Reemplazar las ilustraciones y cargar las imágenes reales en `public/images/`. Editar rutas y textos alternativos.
4. Cambiar los colores de `theme.colors` y comprobar el contraste de la nueva paleta.
5. Cambiar `theme.fonts`; si se usan otras fuentes locales, actualizar también `src/styles/fonts.css`.
6. Colocar el CV final en `public/`, configurar `cv` y comprobar la descarga.
7. Definir el dominio del cliente en `seo.siteUrl` y, si difiere, `seo.canonical`.
8. Revisar title, description, favicon, Open Graph, idioma, JSON-LD y robots. Reemplazar `public/images/og-cover.png` con una imagen real de 1200 × 630.
9. Configurar Analytics solo si corresponde, después de definir proveedor y privacidad. No hace falta configurarlo para que el sitio funcione.
10. Quitar avisos ficticios, completar el checklist, ejecutar las verificaciones y publicar `dist/` en el hosting estático elegido.

## Datos y compatibilidad

El núcleo conserva `firstName`, `lastName`, `monogram`, `profession`, `location`, `email`, `phone`, `photo`, `cv`, `socials`, `projects.items`, `services.items`, `journey`, `experience`, `education`, `skills.groups`, `contact` y `ui` del contrato compartido. No se introdujo un objeto `personal` incompatible.

Extensiones opcionales de Profesional: `highlights`, `testimonials`, `professional.caseStudies`, tokens en `theme`, orden en `settings.sectionOrder`. El esquema de casos de los documentos compartidos era una propuesta: aquí se relacionan mediante `projectId` con el proyecto, evitando duplicar rol, cliente y herramientas. Los IDs deben ser únicos y estables.

### Secciones y navegación

```js
settings: {
  sections: { about: true, highlights: true, projects: true, experience: true,
    education: true, services: false, skills: true, testimonials: false, contact: true },
  sectionOrder: ['projects', 'about', 'experience', 'education', 'contact'],
  navigation: ['projects', 'about', 'experience', 'contact'],
}
```

Una sección se muestra cuando no está deshabilitada **y** tiene contenido útil. Arrays vacíos y grupos de skills sin ítems desaparecen. `about` requiere texto, filosofía o datos; `contact` requiere al menos un medio válido. Las secciones omitidas del orden se agregan al final en su orden por defecto: para ocultar una, usar `sections.nombre: false`. Hero y footer permanecen como estructura del perfil.

La navegación y todos los CTA internos se filtran con las mismas reglas. No se generan enlaces a proyectos o contacto ocultos. `navigation` permite limitar los accesos visibles sin ocultar esas secciones del cuerpo. Experiencia y formación son bloques independientes que comparten el lenguaje visual de trayectoria. Si se desactiva experiencia, formación sigue teniendo su propio título.

### Colores y tipografías

Editar `theme.colors`: `primary`, `secondary`, `accent`, `background`, `surface`, `text`, `muted`, `border`, `onPrimary`, `onSecondary`. Se convierten en variables CSS dentro de `.portfolio`; `styles/base.css` contiene fallbacks para configuraciones antiguas. `theme.css` reúne las hojas de estilo. Tailwind consume las mismas variables mediante `@theme inline`.

Editar `theme.fonts.heading` y `theme.fonts.body`. Las familias predeterminadas se declaran localmente en `src/styles/fonts.css`, únicamente con su subconjunto latino. Para usar una fuente propia, añadir archivos `.woff2` locales, declarar `@font-face` y actualizar la familia. Cambiar solo el nombre no descarga una nueva fuente.

Las ilustraciones SVG son assets, con una paleta propia: reemplazarlas o editar sus fills/strokes si se cambia radicalmente la identidad. Los colores del layout sí responden automáticamente a los tokens.

### Fotografía e imágenes

```js
photo: { src: '/images/retrato.webp', alt: 'Retrato profesional de Nombre Apellido', position: 'center 35%' }
```

Con `photo: null`, el hero usa la ilustración configurable en `hero.image`. Si también falta esa imagen, muestra una composición neutra. Imágenes de proyectos, galerías y testimonios admiten `{ src, alt, position, caption, width, height }`. Una imagen rota en ejecución tiene fallback visual; las rutas locales inexistentes se detectan en el build.

Preferir WebP/AVIF con dimensiones apropiadas. El hero carga con prioridad y el contenido inferior usa lazy loading. No se consulta un banco de imágenes externo. Las ilustraciones actuales son originales y se pueden reutilizar en esta base.

### Proyectos y mini case studies

```js
projects: { eyebrow: 'Selección', title: 'Proyectos', description: '...', items: [
  { id: 'proyecto-uno', name: 'Nombre del proyecto', category: 'Investigación',
    year: '2026', description: 'Resumen breve', featured: true,
    image: { src: '/images/proyecto.webp', alt: 'Descripción útil de la imagen' },
    role: 'Mi participación', client: 'Institución',
    tools: ['Herramienta'], technologies: [],
    metrics: [{ value: '24', label: 'entrevistas realizadas' }], url: '' }
] },
professional: { caseStudies: [
  { projectId: 'proyecto-uno', context: 'Punto de partida', challenge: 'Problema',
    solution: 'Decisiones y proceso', result: 'Resultado comprobable',
    gallery: [{ src: '/images/detalle.webp', alt: 'Detalle', caption: 'Contexto' }], url: '' }
] }
```

Todos los campos complementarios son opcionales. Un proyecto sin caso se presenta como ficha y puede incluir un enlace externo; no aparece un control de expansión vacío. `featured: true` da una composición amplia en escritorio. No es obligatorio tener destacados; se admiten varios.

Los casos usan **`details/summary` nativo**, con teclado, estado anunciado por el navegador y contenido presente en el HTML prerenderizado. Se expanden en el flujo de la página y no necesitan modal, bloqueo de foco ni librería. Campos vacíos se omiten. El relato sirve para ingeniería, diseño, investigación, programación u otras áreas.

### Experiencia, formación, skills y servicios

`experience` admite periodo, cargo (`title`), institución, ubicación, descripción y `achievements` opcionales. `education` acepta la misma base con `status` opcional: grado, curso, posgrado o certificación. No es obligatorio tener experiencia previa.

`skills.groups` agrupa listas de competencias, sin porcentajes. `services.items` admite `name`, `description`, icono opcional (`scan`, `route`, `chart`) y `cta: { label, href }`. Un icono no reconocido simplemente se omite.

### Métricas y testimonios

```js
highlights: [{ value: '8', label: 'proyectos publicados' }],
testimonials: [{ id: 'recomendacion-1', name: 'Nombre', role: 'Cargo',
  institution: 'Organización', text: 'Recomendación autorizada.',
  photo: null, url: '', demo: false }]
```

No hay carrusel automático. Los testimonios demo llevan `demo: true` y una etiqueta visible. Para un cliente, reemplazar texto y autor por recomendaciones autorizadas y poner `demo: false`; quitar la sección si no hay material. Métricas y resultados deben poder justificarse antes de publicar.

### CV

```js
cv: { enabled: true, url: '/cv.pdf', label: 'Descargar CV', fileName: 'Nombre-Apellido-CV.pdf' }
```

Colocar el archivo en `public/cv.pdf`. El acceso aparece en el hero y en el menú móvil abierto. `cv: null`, `enabled: false` o URL vacía ocultan el enlace. El atributo `download` funciona de forma fiable para archivos del mismo dominio; para URLs externas, el navegador puede abrir el archivo.

`public/cv-demo.pdf` es una muestra real de una página y tiene su condición ficticia impresa. **Nunca entregar este PDF a un cliente como su CV.** No se regenera automáticamente con cada build. El generador opcional toma datos de `portfolio.js`:

```sh
# Solo para rehacer los assets demo, no es necesario para instalar ni publicar.
python -m pip install reportlab Pillow pypdfium2
node scripts/demo-assets.mjs
# O: node scripts/demo-assets.mjs /ruta/a/python
```

También genera el PNG Open Graph y una vista previa del CV en `tmp/pdfs/`. Revisar ambos visualmente después de regenerarlos.

### Contacto

`email` genera `mailto:` y `phone` con código de país genera `wa.me` (se eliminan separadores). `socials` y `externalLinks` aceptan `{ label, url }`. Los enlaces externos abren otra pestaña con `noopener noreferrer`.

La demo usa `example.com`, reservado para ejemplos, y LinkedIn sin URL: se muestra como referencia **no clickeable**. Reemplazarlo por el enlace real al personalizar. No hay formularios que simulen envíos.

### SEO y dominio

`seo` centraliza title, description, siteUrl, canonical, favicon, robots, `openGraph` y `twitter`. No hay datos personales fijos en `index.html`. Vite inyecta los metadatos en el `<head>`; el script posterior prerenderiza React, incluyendo los textos de los casos.

Con `siteUrl: 'https://nombre.com'`, las imágenes Open Graph y las URLs se vuelven absolutas. `canonical` permite una URL preferida distinta; si se deja vacío se usa `siteUrl`. Si no hay dominio, canonical y URLs absolutas dependientes de él se omiten. No se inventa un dominio ni se utiliza localhost. Para producción, configurar la URL de la **raíz del dominio**; esta plantilla no incluye soporte de subcarpetas.

JSON-LD usa Schema.org `Person`: nombre, profesión, descripción, URL, imagen real si existe y redes válidas. No inventa reseñas estructuradas ni certificaciones. Las tarjetas Twitter/X son opcionales y no requieren cuenta.

La demo tiene `robots: 'noindex, nofollow'` y `robots.txt` bloqueado. Para un cliente real cambiar a `index, follow`. El sitemap solo se genera cuando hay URL válida y está permitida la indexación. Volver a ejecutar build después de cambiar datos, dominio o variables de entorno. Revisar en el hosting real los previews sociales y la indexación; el SEO técnico no garantiza posiciones.

### Analytics (opcional)

Copiar `.env.example` a `.env.local`. Por defecto no se solicita ningún script externo. No hay proveedor contratado ni identificador de seguimiento.

Tras definir proveedor, cuenta del cliente, titularidad, privacidad y consentimiento:

```dotenv
VITE_ANALYTICS_ENABLED=true
VITE_ANALYTICS_PRIVACY_REVIEWED=true
VITE_ANALYTICS_SCRIPT_URL=https://proveedor.example/script.js
VITE_ANALYTICS_ATTRIBUTES={"domain":"nombre.com"}
```

La URL anterior es **ilustrativa**: usar la URL y atributos reales suministrados por el proveedor elegido. Esta integración sirve para un proveedor cuyo script se inicializa con atributos `data-*`. No implementa automáticamente Google Analytics ni un banner de consentimiento. Si el proveedor necesita consentimiento o inicialización propia, mantener `ENABLED=false` hasta integrar ese flujo; `PRIVACY_REVIEWED` no equivale al consentimiento del visitante. Los valores `VITE_*` son públicos: nunca poner secretos.

Sin configuración completa, con JSON inválido o con una URL que no sea HTTPS, no se carga nada. Los cambios de entorno requieren nuevo build.

### Avisos demo y crédito

`settings.demoNotice: ''` quita el aviso del footer y el aviso demo de contacto. Reemplazar también todos los textos, PDF, ilustraciones, métricas y recomendaciones ficticias. Las etiquetas de testimonios se controlan individualmente con `demo`.

`settings.credit` acepta `{ enabled, label, name, url }`. Sin URL se muestra texto; con URL, un enlace. `enabled: false` lo elimina sin tocar el footer.

## Validación en navegador

```sh
npm run build
npm run test:browser
```

Las pruebas levantan preview en 4173 y Vite en 5173. Usan Edge instalado por defecto (Windows). Para Chrome, definir `PLAYWRIGHT_CHANNEL=chrome`; para CI sin navegador, instalar Chromium con Playwright y ajustar `channel` en `playwright.config.js`. No se requiere un navegador para lint o build.

Se comprueban anchos 320, 375, 430, 768, 1366 y 1920, expansión de casos, navegación con teclado, Escape en el menú, descarga real del CV, reduced motion, WCAG AA mediante axe y ausencia de solicitudes externas. Las variantes se inyectan en memoria: nombre/profesión largos, sin CV, sin foto, imágenes fallidas, cero/uno/seis proyectos, sin casos, secciones vacías o deshabilitadas y orden alternativo. No se modifica el archivo de datos para hacer las pruebas. Capturas en `tmp/qa-*.png`.

## Publicación

Publicar el contenido de `dist/` en cualquier hosting estático con HTTPS. Build: `npm ci && npm run build`; output: `dist`. No se requieren funciones de servidor ni fallback de router. No se configuró hosting, dominio o despliegue remoto en esta entrega.

- [ ] Datos reales cargados
- [ ] Contenido demo eliminado (incluyendo métricas, testimonios y PDF)
- [ ] Fotografías reemplazadas
- [ ] Proyectos revisados y autorizados
- [ ] Links revisados
- [ ] Redes revisadas
- [ ] CV reemplazado y descargado correctamente
- [ ] Favicon reemplazado
- [ ] SEO y JSON-LD revisados
- [ ] Open Graph revisado en el dominio final
- [ ] Dominio configurado con HTTPS
- [ ] `siteUrl`, canonical, robots y sitemap revisados
- [ ] Analytics configurado si corresponde, con privacidad resuelta
- [ ] Responsive revisado (320 a 1920px)
- [ ] Accesibilidad básica y teclado revisados
- [ ] Lint, tests y build exitosos
- [ ] Crédito Portfolios La Plata configurado

Integración de estilos según la [documentación oficial de Tailwind para Vite](https://tailwindcss.com/docs/installation/using-vite). Requisitos del entorno según la [guía oficial de Vite](https://vite.dev/guide/).
