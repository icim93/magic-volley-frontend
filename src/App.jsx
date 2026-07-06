import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GuardianAuthProvider } from './context/GuardianAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import GuardianProtectedRoute from './components/GuardianProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import Club from './pages/Club'
import Teams from './pages/Teams'
import PlayerDetail from './pages/PlayerDetail'
import Gallery from './pages/Gallery'
import Calendar from './pages/Calendar'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Registration from './pages/Registration'
import Sponsors from './pages/Sponsors'
import Contact from './pages/Contact'

import Login from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminTeams from './pages/admin/AdminTeams'
import AdminPlayers from './pages/admin/AdminPlayers'
import AdminStaff from './pages/admin/AdminStaff'
import AdminMatches from './pages/admin/AdminMatches'
import AdminNews from './pages/admin/AdminNews'
import AdminRegistrations from './pages/admin/AdminRegistrations'
import AdminSponsors from './pages/admin/AdminSponsors'
import AdminGallery from './pages/admin/AdminGallery'

import GuardianLogin from './pages/guardian/GuardianLogin'
import ActivateAccount from './pages/guardian/ActivateAccount'
import GuardianLayout from './pages/guardian/GuardianLayout'
import GuardianDashboard from './pages/guardian/GuardianDashboard'

function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
    <GuardianAuthProvider>
      <Routes>
        {/* Sito pubblico */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/societa" element={<PublicLayout><Club /></PublicLayout>} />
        <Route path="/squadre" element={<PublicLayout><Teams /></PublicLayout>} />
        <Route path="/giocatrici/:id" element={<PublicLayout><PlayerDetail /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/calendario" element={<PublicLayout><Calendar /></PublicLayout>} />
        <Route path="/news" element={<PublicLayout><News /></PublicLayout>} />
        <Route path="/news/:slug" element={<PublicLayout><NewsDetail /></PublicLayout>} />
        <Route path="/iscriviti" element={<PublicLayout><Registration /></PublicLayout>} />
        <Route path="/sponsor" element={<PublicLayout><Sponsors /></PublicLayout>} />
        <Route path="/contatti" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Attivazione account genitore (link ricevuto via email) */}
        <Route path="/attiva-account" element={<ActivateAccount />} />

        {/* Area riservata famiglie */}
        <Route path="/area-riservata/login" element={<GuardianLogin />} />
        <Route
          path="/area-riservata"
          element={
            <GuardianProtectedRoute>
              <GuardianLayout />
            </GuardianProtectedRoute>
          }
        >
          <Route index element={<GuardianDashboard />} />
        </Route>

        {/* Pannello admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="squadre" element={<AdminTeams />} />
          <Route path="giocatrici" element={<AdminPlayers />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="partite" element={<AdminMatches />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="iscrizioni" element={<AdminRegistrations />} />
          <Route path="sponsor" element={<AdminSponsors />} />
          <Route path="gallery" element={<AdminGallery />} />
        </Route>

        {/* 404 semplice */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="max-w-lg mx-auto px-5 py-24 text-center">
                <p className="font-display font-bold text-3xl text-navy-dark">Pagina non trovata</p>
                <p className="text-navy-dark/60 mt-3">La pagina che cerchi non esiste o è stata spostata.</p>
              </div>
            </PublicLayout>
          }
        />
      </Routes>
    </GuardianAuthProvider>
    </AuthProvider>
    </ErrorBoundary>
  )
}
