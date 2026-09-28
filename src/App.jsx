import { portfolio } from './data/portfolio.js'
import { themeStyle, visibleSections } from './utils/portfolio.js'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Hero from './sections/Hero.jsx'
import Projects from './sections/Projects.jsx'
import Contact from './sections/Contact.jsx'
import {
  About,
  Education,
  Experience,
  Highlights,
  Services,
  Skills,
  Testimonials,
} from './sections/Profile.jsx'
import useReveal from './hooks/useReveal.js'

const sections = {
  about: About,
  highlights: Highlights,
  projects: Projects,
  experience: Experience,
  education: Education,
  services: Services,
  skills: Skills,
  testimonials: Testimonials,
  contact: Contact,
}
export default function App({ data = portfolio }) {
  const visible = visibleSections(data)
  useReveal()
  const numbered = visible.filter((key) => key !== 'highlights')
  return (
    <div id="top" className="portfolio" style={themeStyle(data.theme)}>
      <a href="#main" className="skip-link">
        {data.ui.skip}
      </a>
      <Header data={data} visible={visible} />
      <main id="main" tabIndex={-1}>
        <Hero data={data} visible={visible} />
        {visible.map((key) => {
          const Section = sections[key]
          return (
            <Section
              key={key}
              data={data}
              visible={visible}
              number={String(numbered.indexOf(key) + 1).padStart(2, '0')}
            />
          )
        })}
      </main>
      <Footer data={data} />
    </div>
  )
}
