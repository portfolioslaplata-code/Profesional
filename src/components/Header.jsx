import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { asArray, fullName, getCv } from '../utils/portfolio.js'
import { CvLink } from './Primitives.jsx'

export default function Header({ data, visible }) {
  const [open, setOpen] = useState(false)
  const button = useRef(null)
  const navigation = asArray(
    data.settings?.navigation ?? ['projects', 'about', 'experience', 'contact'],
  ).filter((key) => visible.includes(key))
  const close = () => setOpen(false)
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        button.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 960px)')
    const onResize = () => {
      if (desktop.matches) setOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', handleKey)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])
  return (
    <header className="site-header">
      <div className="header-inner wrap">
        <a
          className="brand"
          href="#top"
          aria-label={`${fullName(data)} · ${data.ui.home}`}
          onClick={close}
        >
          <span className="monogram">
            {data.monogram ||
              fullName(data)
                .split(' ')
                .map((word) => word[0])
                .slice(0, 2)
                .join('')}
          </span>
          <span className="brand-name">{fullName(data)}</span>
        </a>
        <nav className="desktop-nav" aria-label="Principal">
          {navigation.map((key) => (
            <a key={key} href={`#${key}`} className={key === 'contact' ? 'nav-contact' : ''}>
              {data.ui.nav[key] || key}
              {key === 'contact' && <ArrowUpRight size={16} aria-hidden="true" />}
            </a>
          ))}
        </nav>
        <button
          ref={button}
          className="menu-toggle"
          aria-controls="mobile-navigation"
          aria-expanded={open}
          aria-label={open ? data.ui.closeMenu : data.ui.menu}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <nav id="mobile-navigation" aria-label="Menú móvil" className="mobile-nav" hidden={!open}>
        {navigation.map((key) => (
          <a key={key} href={`#${key}`} onClick={close}>
            {data.ui.nav[key] || key}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        ))}
        <CvLink cv={getCv(data)} />
      </nav>
    </header>
  )
}
