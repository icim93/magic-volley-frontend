import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Panoramica', end: true },
  { to: '/admin/squadre', label: 'Squadre' },
  { to: '/admin/giocatrici', label: 'Giocatrici' },
  { to: '/admin/giocatrici-duplicate', label: 'Unisci duplicati', minRole: 'admin' },
  { to: '/admin/staff', label: 'Staff e Organigramma' },
  { to: '/admin/partite', label: 'Partite' },
  { to: '/admin/news', label: 'News' },
  { to: '/admin/iscrizioni', label: 'Iscrizioni' },
  { to: '/admin/genitori', label: 'Genitori', minRole: 'admin' },
  { to: '/admin/sponsor', label: 'Sponsor' },
  { to: '/admin/gallery', label: 'Fotogallery' },
  { to: '/admin/documenti', label: 'Documenti' },
  { to: '/admin/profilo', label: 'Profilo' },
]

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/admin/login')
  }

  const canSeeAdminOnly = user?.role === 'admin' || user?.role === 'superadmin'
  const items = [
    ...navItems.filter(item => item.minRole !== 'admin' || canSeeAdminOnly),
    ...(user?.role === 'superadmin' ? [{ to: '/admin/utenti', label: 'Utenti' }] : []),
  ]

  return (
    <div className="min-h-screen bg-cream flex flex-col lg:flex-row">
      {/* Su telefono il menu non deve ridurre la larghezza del contenuto. */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between gap-4 bg-navy-dark text-cream px-4 py-3 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/logo-dark.jpg" alt="" className="h-11 w-11 object-contain rounded-md shrink-0" />
          <div className="min-w-0">
            <p className="font-display font-semibold text-sm truncate">Magic Volley Adelfia</p>
            <p className="text-xs text-cream/60">Pannello gestionale</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Apri menu amministrazione"
          aria-controls="admin-menu"
          aria-expanded={menuOpen}
          className="p-2 rounded-lg border border-cream/30 shrink-0"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {menuOpen && (
        <button
          type="button"
          onClick={() => setMenuOpen(false)}
          aria-label="Chiudi menu"
          className="lg:hidden fixed inset-0 z-40 bg-navy-dark/65"
        />
      )}

      <aside
        id="admin-menu"
        aria-label="Menu amministrazione"
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col bg-navy-dark text-cream transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:max-w-none lg:shrink-0 lg:translate-x-0 ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-5 lg:p-6">
          <div className="flex justify-between gap-2">
            <img src="/logo-dark.jpg" alt="" className="h-16 w-auto mb-3 mix-blend-lighten" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Chiudi menu amministrazione"
              className="lg:hidden self-start px-3 py-1 rounded-lg border border-cream/20 text-xl"
            >
              ×
            </button>
          </div>
          <p className="font-display font-bold leading-tight">Magic Volley<br />Adelfia</p>
          <p className="text-[10px] text-cream/40 leading-tight mt-1">Associazione Sportiva Dilettantistica</p>
          <p className="text-xs text-cream/50 mt-1.5">Pannello gestionale</p>
        </div>

        <nav aria-label="Sezioni amministrazione" className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
          {items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-amber text-navy-dark' : 'text-cream/80 hover:bg-cream/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-cream/10">
          {user && <p className="text-xs text-cream/50 truncate mb-2">{user.email}</p>}
          <button type="button" onClick={handleLogout} className="text-sm text-cream/70 hover:text-amber">
            Esci
          </button>
        </div>
      </aside>

      <main className="w-full min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="w-full max-w-6xl min-w-0 mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
