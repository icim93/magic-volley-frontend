import { Outlet, useNavigate, Link } from 'react-router-dom'
import { useGuardianAuth } from '../../context/GuardianAuthContext'

export default function GuardianLayout() {
  const { logout, guardian } = useGuardianAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/area-riservata/login')
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-navy-dark text-cream">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/area-riservata" className="flex items-center gap-2">
            <span className="flex gap-1 items-end">
              <span className="w-1.5 h-1.5 rounded-full bg-navy-light" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber" />
              <span className="w-3.5 h-3.5 rounded-full bg-amber-dark" />
            </span>
            <span className="font-display font-bold text-sm">Area riservata famiglie</span>
          </Link>
          <div className="flex items-center gap-4">
            {guardian && <span className="text-xs text-cream/60 hidden sm:inline">{guardian.first_name} {guardian.last_name}</span>}
            <button onClick={handleLogout} className="text-sm text-cream/70 hover:text-amber transition-colors">Esci</button>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 py-10">
        <Outlet />
      </main>
    </div>
  )
}
