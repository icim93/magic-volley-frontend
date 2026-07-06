import { useState } from 'react'
import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/societa', label: 'Società' },
  { to: '/squadre', label: 'Squadre' },
  { to: '/calendario', label: 'Calendario' },
  { to: '/news', label: 'News' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/sponsor', label: 'Sponsor' },
  { to: '/contatti', label: 'Contatti' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b-2 border-navy-dark/10">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-28">
        <NavLink to="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setOpen(false)}>
          <img src="/logo.png" alt="Magic Volley Adelfia ASD" className="h-24 w-auto py-2" />
        </NavLink>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-body font-medium text-sm tracking-wide transition-colors ${
                  isActive ? 'text-amber-dark' : 'text-navy-dark hover:text-navy-light'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/iscriviti"
            className="bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
          >
            Iscriviti
          </NavLink>
        </nav>

        <button
          className="md:hidden text-navy-dark"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Chiudi il menu' : 'Apri il menu'}
          aria-expanded={open}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="md:hidden flex flex-col gap-1 px-5 pb-5 bg-cream border-t border-navy-dark/10">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `font-body font-medium py-2.5 border-b border-navy-dark/5 ${
                  isActive ? 'text-amber-dark' : 'text-navy-dark'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/iscriviti"
            onClick={() => setOpen(false)}
            className="mt-3 bg-amber text-navy-dark font-display font-semibold text-sm px-5 py-3 rounded-full text-center"
          >
            Iscriviti
          </NavLink>
        </nav>
      )}
    </header>
  )
}
