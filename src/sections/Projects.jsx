import { ArrowDownRight, ArrowUpRight, Minus, Plus } from 'lucide-react'
import { asArray, getCaseStudy, sectionItems } from '../utils/portfolio.js'
import { Link, Picture, SectionHeading } from '../components/Primitives.jsx'

function CaseStudy({ project, detail, ui }) {
  return (
    <details className="case-study">
      <summary>
        <span className="case-open">{ui.caseOpen}</span>
        <span className="case-close">{ui.caseClose}</span>
        <Plus className="case-open" size={19} aria-hidden="true" />
        <Minus className="case-close" size={19} aria-hidden="true" />
      </summary>
      <div className="case-content">
        {(project.role || project.client) && (
          <dl className="case-facts">
            {project.role && (
              <div>
                <dt>{ui.role}</dt>
                <dd>{project.role}</dd>
              </div>
            )}
            {project.client && (
              <div>
                <dt>{ui.client}</dt>
                <dd>{project.client}</dd>
              </div>
            )}
          </dl>
        )}
        <div className="case-narrative">
          {['context', 'challenge', 'solution', 'result']
            .filter((key) => detail[key])
            .map((key) => (
              <div key={key}>
                <h4>{ui.caseLabels[key]}</h4>
                <p>{detail[key]}</p>
              </div>
            ))}
        </div>
        {asArray(detail.gallery).map((image, index) => (
          <figure key={image.src || index}>
            <Picture image={image} />
            {image.caption && <figcaption>{image.caption}</figcaption>}
          </figure>
        ))}
        <Link href={detail.url} className="text-link">
          {ui.visitProject}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </details>
  )
}

function ProjectCard({ project, data, index }) {
  const detail = getCaseStudy(data, project.id)
  const ui = data.ui
  return (
    <article className={`project-card reveal ${project.featured ? 'featured' : ''}`}>
      <div className="project-image-wrap">
        <Picture image={project.image} className="project-image" fallback={ui.imageFallback} />
        {project.featured && (
          <span className="featured-label">
            <span aria-hidden="true">✳</span>
            {ui.selected}
          </span>
        )}
        <span className="project-index" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="project-body">
        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.year}</span>
        </div>
        <h3>
          {project.name}
          <ArrowDownRight size={24} aria-hidden="true" />
        </h3>
        <p className="project-description">{project.description}</p>
        {asArray(project.metrics).length > 0 && (
          <div className="project-metrics">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
              </div>
            ))}
          </div>
        )}
        {(asArray(project.tools).length > 0 || asArray(project.technologies).length > 0) && (
          <ul className="tags" aria-label={`${ui.tools} / ${ui.technologies}`}>
            {[...asArray(project.tools), ...asArray(project.technologies)].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {detail ? (
          !project.featured && <CaseStudy project={project} detail={detail} ui={ui} />
        ) : (
          <Link href={project.url} className="text-link">
            {ui.visitProject}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        )}
        {detail && (
          <Link href={project.url} className="text-link project-external">
            {ui.visitProject}
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
      {detail && project.featured && <CaseStudy project={project} detail={detail} ui={ui} />}
    </article>
  )
}

export default function Projects({ data, number }) {
  const projects = sectionItems(data, 'projects')
  return (
    <section id="projects" className="section wrap">
      <SectionHeading number={number} {...data.projects} />
      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard key={project.id || index} project={project} data={data} index={index} />
        ))}
      </div>
    </section>
  )
}
