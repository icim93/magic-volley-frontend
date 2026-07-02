import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Panoramica', end: true },
  { to: '/admin/squadre', label: 'Squadre' },
  { to: '/admin/giocatrici', label: 'Giocatrici' },
  { to: '/admin/staff', label: 'Staff tecnico' },
  { to: '/admin/partite', label: 'Partite' },
  { to: '/admin/news', label: 'News' },
  { to: '/admin/iscrizioni', label: 'Iscrizioni' },
  { to: '/admin/sponsor', label: 'Sponsor' },
]

export default function AdminLayout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-cream">
      <aside className="w-60 bg-navy-dark text-cream flex flex-col shrink-0">
        <div className="p-6">
          <p className="font-display font-bold leading-tight">Magic Volley<br />Adelfia</p>
          <p className="text-xs text-cream/50 mt-1">Pannello gestionale</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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
          <button onClick={handleLogout} className="text-sm text-cream/70 hover:text-amber transition-colors">
            Esci
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 max-w-5xl">
        <Outlet />
      </main>
    </div>
  )
}
