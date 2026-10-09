// Única fuente de contenido del cliente. Todo el perfil es ficticio.
// El núcleo conserva el contrato compartido de ../producto-docs/portfolio-schema.md.
export const portfolio = {
  locale: 'es-AR',
  firstName: 'Sofía',
  lastName: 'Ferrer',
  monogram: 'sf.',
  profession: 'Ingeniera industrial',
  location: 'La Plata, Argentina',
  email: 'sofia.ferrer@example.com',
  phone: '',
  photo: null, // { src: '/images/retrato.webp', alt: '...', position: 'center' }
  cv: {
    enabled: true,
    url: '/cv-demo.pdf',
    label: 'Descargar CV',
    fileName: 'Sofia-Ferrer-CV-demo.pdf',
  },
  socials: [{ label: 'LinkedIn', url: '', demo: true, note: 'Perfil de demostración' }],
  externalLinks: [],
  // Equivalencias con la Landing en el orden visual de esta demo, sin precios.
  // La composición activa se deriva de visibleSections y getCv.
  catalogComposition: {
    base: ['navigation', 'hero', 'contact', 'footer'],
    sections: [
      { id: 'highlights', type: 'standard', catalogIds: ['achievements'], label: 'Logros' },
      { id: 'projects', type: 'advanced', catalogIds: ['case-study'], label: 'Mini case study' },
      { id: 'about', type: 'standard', catalogIds: ['about'], label: 'Sobre mí' },
      { id: 'experience', type: 'standard', catalogIds: ['experience'], label: 'Experiencia' },
      { id: 'education', type: 'standard', catalogIds: ['education'], label: 'Formación' },
      { id: 'services', type: 'standard', catalogIds: ['services'], label: 'Servicios' },
      { id: 'skills', type: 'standard', catalogIds: ['skills'], label: 'Habilidades' },
      { id: 'testimonials', type: 'advanced', catalogIds: ['testimonials'], label: 'Testimonios' },
    ],
    complements: [{ id: 'cv', catalogIds: ['download-cv'], label: 'CV descargable' }],
  },
  settings: {
    sections: {
      about: true,
      highlights: true,
      projects: true,
      experience: true,
      education: true,
      services: true,
      skills: true,
      testimonials: true,
      contact: true,
    },
    sectionOrder: [
      'highlights',
      'projects',
      'about',
      'experience',
      'education',
      'services',
      'skills',
      'testimonials',
      'contact',
    ],
    // Solo estos destinos se muestran en la barra; también se verifica su contenido.
    navigation: ['projects', 'about', 'experience', 'contact'],
    demoNotice: 'Perfil de muestra · Personas, proyectos y resultados ficticios',
    credit: { enabled: true, label: 'Hecho por', name: 'Portfolios La Plata', url: '' },
  },
  theme: {
    colors: {
      primary: '#ad4327',
      secondary: '#273c35',
      accent: '#dce4cd',
      background: '#f8f7f3',
      surface: '#efeee7',
      text: '#272b26',
      muted: '#62665d',
      border: '#d8dbd1',
      onPrimary: '#ffffff',
      onSecondary: '#f8f7f3',
    },
    fonts: { heading: 'Manrope Variable, sans-serif', body: 'DM Sans Variable, sans-serif' },
  },
  seo: {
    title: 'Sofía Ferrer · Ingeniería de procesos | Demo Profundidad',
    description:
      'Profundidad, demo de Portfolios La Plata. Portfolio ficticio de ingeniería industrial con proyectos, trayectoria y casos de mejora continua.',
    siteUrl: '',
    canonical: '',
    favicon: '/favicon.svg',
    robots: 'noindex, nofollow', // Cambiar a index, follow al publicar un cliente real.
    openGraph: {
      title: 'Sofía Ferrer | Demo Profundidad · Portfolios La Plata',
      description:
        'Profundidad: procesos, operaciones y mejora continua en un portfolio ficticio de demostración.',
      image: '/images/og-cover.png',
      imageAlt: 'Profundidad, portfolio de muestra de Sofía Ferrer, ingeniera industrial.',
      imageLabel: 'PORTFOLIO PROFUNDIDAD / DEMO',
    },
    twitter: { enabled: true, card: 'summary_large_image', handle: '' },
  },
  hero: {
    eyebrow: 'Procesos claros. Impacto real.',
    title: 'Hacer que las cosas',
    emphasis: 'funcionen mejor.',
    description:
      'Conecto datos, personas y procesos para transformar desafíos operativos en mejoras que se sostienen en el tiempo.',
    availability: 'Disponible para nuevos proyectos',
    primaryCta: { label: 'Explorá mi trabajo', href: '#projects' },
    secondaryCta: { label: 'Conversemos', href: '#contact' },
    image: {
      src: '/images/operations.svg',
      alt: 'Ilustración isométrica de una operación industrial conectada, con áreas de producción, almacenamiento y distribución.',
    },
    imageLabel: 'UNA MIRADA SISTÉMICA',
    imageCaption: 'Cada proceso es una oportunidad.',
    footnote: 'Ingeniería con los pies en la planta y la mirada en las personas.',
    index: 'PORTFOLIO / 2026',
  },
  about: {
    eyebrow: 'Un poco sobre mí',
    title: 'Los mejores procesos empiezan escuchando.',
    lead: 'Me interesa entender cómo funcionan las cosas. Y, sobre todo, cómo podrían funcionar mejor para quienes las hacen todos los días.',
    paragraphs: [
      'Soy Sofía, ingeniera industrial con foco en operaciones y mejora continua. Acompaño a equipos a ordenar lo complejo, encontrar oportunidades en sus datos y convertirlas en cambios concretos.',
      'Mi lugar está entre el análisis y la acción: recorrer una planta, hacer las preguntas correctas, probar en pequeño y construir soluciones junto a las personas que las van a usar.',
    ],
    philosophy: 'Entender. Simplificar. Mejorar.',
    facts: [
      { label: 'Base', value: 'La Plata, Argentina' },
      { label: 'Modalidad', value: 'Híbrida · Remota' },
      { label: 'Enfoque', value: 'Operaciones y mejora continua' },
      { label: 'Idiomas', value: 'Español · Inglés B2' },
    ],
  },
  highlights: [
    { value: '6+', label: 'años en operaciones' },
    { value: '12', label: 'proyectos de mejora' },
    { value: '3', label: 'sectores industriales' },
    { value: '1', label: 'mirada integral' },
  ],
  projects: {
    eyebrow: 'Del análisis a la acción',
    title: 'Trabajo que hace la diferencia.',
    description:
      'Una selección de desafíos, decisiones y mejoras. Porque el resultado importa tanto como el camino.',
    items: [
      {
        id: 'flujo-productivo',
        name: 'Menos recorridos. Más producción.',
        category: 'Optimización de procesos',
        year: '2025',
        featured: true,
        description:
          'Rediseño del flujo de materiales en una planta de envases, con foco en eliminar movimientos que no agregaban valor.',
        image: {
          src: '/images/flow.svg',
          alt: 'Diagrama del nuevo flujo de materiales con estaciones de trabajo y recorridos simplificados.',
        },
        role: 'Líder de mejora de procesos',
        client: 'Envases del Sur · Empresa ficticia',
        tools: ['Lean Manufacturing', 'VSM', 'AutoCAD'],
        metrics: [
          { value: '−28%', label: 'tiempo de traslado' },
          { value: '+16%', label: 'capacidad operativa' },
        ],
      },
      {
        id: 'planificacion',
        name: 'Decidir con datos, no con supuestos.',
        category: 'Planificación & datos',
        year: '2025',
        description:
          'Un tablero compartido para conectar demanda, capacidad y decisiones de producción.',
        image: {
          src: '/images/planning.svg',
          alt: 'Composición de un tablero de planificación con barras de capacidad y tendencia de demanda.',
        },
        role: 'Analista de operaciones',
        tools: ['Power BI', 'Excel', 'SQL'],
        metrics: [{ value: '−35%', label: 'horas de planificación' }],
      },
      {
        id: 'inventario',
        name: 'El inventario justo, en el lugar correcto.',
        category: 'Logística & operaciones',
        year: '2024',
        description:
          'Clasificación ABC y nuevos puntos de reposición para un almacén de insumos industriales.',
        image: {
          src: '/images/inventory.svg',
          alt: 'Ilustración de módulos de almacenamiento organizados en tres categorías de inventario.',
        },
        tools: ['Análisis ABC', 'Gestión de stock'],
        metrics: [{ value: '−22%', label: 'quiebres de stock' }],
      },
    ],
  },
  professional: {
    caseStudies: [
      {
        projectId: 'flujo-productivo',
        context:
          'Una pyme de envases necesitaba absorber mayor demanda sin ampliar su superficie ni incorporar un nuevo turno.',
        challenge:
          'Los materiales cruzaban la planta varias veces y el equipo perdía tiempo buscando lotes. Primero había que hacer visible el recorrido real.',
        solution:
          'Relevamos el flujo con las personas de cada puesto, medimos recorridos y ensayamos una nueva distribución en una célula piloto. El equipo validó estándares visuales antes de extender el cambio.',
        result:
          'En una medición de ocho semanas, el tiempo de traslado bajó un 28% y la capacidad operativa creció un 16%, manteniendo la dotación. Cifras ficticias para ilustrar el caso.',
        gallery: [
          {
            src: '/images/flow-detail.svg',
            alt: 'Comparación esquemática del recorrido original y el recorrido propuesto.',
            caption: 'Del recorrido fragmentado a un flujo continuo. Esquema ilustrativo.',
          },
        ],
      },
      {
        projectId: 'planificacion',
        context:
          'Una operación de manufactura planificaba con archivos separados y versiones que no coincidían.',
        challenge:
          'Alinear ventas, producción y compras alrededor de una misma información, sin sumar carga administrativa.',
        solution:
          'Unificamos fuentes, acordamos cinco indicadores y construimos un tablero semanal de capacidad y demanda. Documentamos responsables y una rutina breve de revisión.',
        result:
          'La preparación del plan pasó de 10 a 6,5 horas semanales. El equipo ganó visibilidad sobre desvíos antes de comprometer las entregas. Resultado ficticio de demostración.',
      },
    ],
  },
  journey: {
    eyebrow: 'Una trayectoria en movimiento',
    title: 'Aprender haciendo. Crecer mejorando.',
    description: 'Experiencia en planta, criterio analítico y aprendizaje continuo.',
  },
  experience: [
    {
      id: 'lead',
      period: '2023 — Actualidad',
      title: 'Ingeniera de mejora continua',
      institution: 'Envases del Sur',
      location: 'Buenos Aires · Híbrido',
      description:
        'Acompaño proyectos de eficiencia operativa, desde el diagnóstico hasta la implementación en planta.',
      achievements: [
        'Coordinación de equipos de producción, mantenimiento y calidad.',
        'Diseño de indicadores y rutinas de seguimiento de mejoras.',
      ],
    },
    {
      id: 'analyst',
      period: '2020 — 2023',
      title: 'Analista de operaciones',
      institution: 'Nodo Logística',
      location: 'La Plata',
      description:
        'Planificación de capacidad, análisis de inventario y estandarización de procesos de distribución.',
      achievements: ['Implementación de tableros para visualizar desvíos operativos.'],
    },
  ],
  education: [
    {
      id: 'degree',
      period: '2014 — 2019',
      title: 'Ingeniería Industrial',
      institution: 'Universidad Nacional de La Plata',
      status: 'Finalizado',
      description: 'Formación demo; no representa a una graduada real de la institución.',
    },
    {
      id: 'lean',
      period: '2022',
      title: 'Lean Six Sigma · Green Belt',
      institution: 'Instituto de Gestión Aplicada · Ficticio',
      status: 'Certificación',
      description: 'Mejora de procesos, análisis de causas y gestión de proyectos.',
    },
  ],
  services: {
    eyebrow: 'Cómo puedo acompañarte',
    title: 'Una mirada externa. Un avance concreto.',
    items: [
      {
        id: 'diagnostico',
        name: 'Diagnóstico de procesos',
        icon: 'scan',
        description:
          'Entender el punto de partida, detectar cuellos de botella y priorizar oportunidades con impacto.',
        cta: { label: 'Conversemos', href: '#contact' },
      },
      {
        id: 'mejora',
        name: 'Mejora de operaciones',
        icon: 'route',
        description:
          'Diseñar y poner en marcha procesos más simples, medibles y sostenibles junto a tu equipo.',
      },
      {
        id: 'indicadores',
        name: 'Datos para decidir',
        icon: 'chart',
        description:
          'Transformar información dispersa en indicadores claros que ayuden a tomar mejores decisiones.',
      },
    ],
  },
  skills: {
    eyebrow: 'Mi caja de herramientas',
    title: 'Método, herramientas y personas.',
    groups: [
      {
        name: 'Especialización',
        items: [
          'Mejora continua',
          'Planificación operativa',
          'Gestión de proyectos',
          'Análisis de procesos',
        ],
      },
      {
        name: 'Herramientas',
        items: ['Power BI', 'Excel avanzado', 'SQL', 'AutoCAD', 'Lean Six Sigma'],
      },
      {
        name: 'Forma de trabajar',
        items: [
          'Escucha activa',
          'Pensamiento sistémico',
          'Trabajo interdisciplinario',
          'Comunicación clara',
        ],
      },
    ],
  },
  testimonials: [
    {
      id: 'mariana',
      name: 'Mariana Costa',
      role: 'Responsable de Operaciones',
      institution: 'Envases del Sur',
      text: 'Sofía tiene la capacidad de traducir un problema complejo en un plan que todo el equipo entiende. Las mejoras se construyeron con nosotros, desde el primer día.',
      demo: true,
    },
    {
      id: 'tomas',
      name: 'Tomás Rivas',
      role: 'Coordinador de Logística',
      institution: 'Nodo Logística',
      text: 'Su aporte fue mucho más que un tablero: nos ayudó a hacernos mejores preguntas y a ordenar la forma en que tomábamos decisiones.',
      demo: true,
    },
  ],
  contact: {
    emailIsDemo: true,
    demoEmailLabel: 'Correo de muestra',
    eyebrow: 'El próximo paso',
    title: '¿Hay algo que podemos mejorar juntos?',
    description:
      'Si tenés un desafío en tus procesos, una oportunidad de colaboración o simplemente querés conversar, me encantará escucharte.',
    emailLabel: 'Escribime',
    whatsappLabel: 'Hablemos por WhatsApp',
    availability: 'Abierta a proyectos y oportunidades profesionales',
    demoMessage:
      'Contacto de muestra: este correo no recibe consultas. Los enlaces reales se incorporan al personalizar el portfolio.',
  },
  ui: {
    nav: {
      projects: 'Proyectos',
      about: 'Sobre mí',
      experience: 'Trayectoria',
      education: 'Formación',
      services: 'Servicios',
      skills: 'Competencias',
      testimonials: 'Recomendaciones',
      highlights: 'En cifras',
      contact: 'Conversemos',
    },
    skip: 'Saltar al contenido',
    menu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    home: 'Volver al inicio',
    selected: 'Proyecto destacado',
    caseOpen: 'Explorar el caso',
    caseClose: 'Cerrar el caso',
    visitProject: 'Ver proyecto',
    caseLabels: {
      context: 'El contexto',
      challenge: 'El desafío',
      solution: 'La solución',
      result: 'El resultado',
    },
    role: 'Mi rol',
    client: 'Organización',
    tools: 'Herramientas',
    technologies: 'Tecnologías',
    experienceTitle: 'Experiencia',
    educationTitle: 'Formación & aprendizaje',
    testimonialsEyebrow: 'El valor de trabajar juntos',
    testimonialsTitle: 'Lo que deja el trabajo en equipo.',
    demoTestimonial: 'Testimonio ficticio · Demo',
    demoLink: 'Demo · Sin enlace',
    footerNote: 'Pensado con criterio. Hecho con propósito.',
    backTop: 'Volver arriba',
    imageFallback: 'Una mirada a este proyecto',
  },
}
