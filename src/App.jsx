import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { GuardianAuthProvider } from './context/GuardianAuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import GuardianProtectedRoute from './components/GuardianProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Loading } from './components/Feedback'

import Home from './pages/Home'
import Club from './pages/Club'
import Teams from './pages/Teams'
import TeamDetail from './pages/TeamDetail'
import PlayerDetail from './pages/PlayerDetail'
import Gallery from './pages/Gallery'
import Calendar from './pages/Calendar'
import News from './pages/News'
import NewsDetail from './pages/NewsDetail'
import Registration from './pages/Registration'
import Sponsors from './pages/Sponsors'
import Contact from './pages/Contact'

const Login = lazy(() => import('./pages/admin/Login'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminTeams = lazy(() => import('./pages/admin/AdminTeams'))
const AdminPlayers = lazy(() => import('./pages/admin/AdminPlayers'))
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff'))
const AdminMatches = lazy(() => import('./pages/admin/AdminMatches'))
const AdminNews = lazy(() => import('./pages/admin/AdminNews'))
const AdminRegistrations = lazy(() => import('./pages/admin/AdminRegistrations'))
const AdminSponsors = lazy(() => import('./pages/admin/AdminSponsors'))
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))

const GuardianLogin = lazy(() => import('./pages/guardian/GuardianLogin'))
const ActivateAccount = lazy(() => import('./pages/guardian/ActivateAccount'))
const GuardianLayout = lazy(() => import('./pages/guardian/GuardianLayout'))
const GuardianDashboard = lazy(() => import('./pages/guardian/GuardianDashboard'))
const GuardianProfile = lazy(() => import('./pages/guardian/GuardianProfile'))

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
      <Suspense fallback={<Loading label="Caricamento…" />}>
      <Routes>
        {/* Sito pubblico */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/societa" element={<PublicLayout><Club /></PublicLayout>} />
        <Route path="/squadre" element={<PublicLayout><Teams /></PublicLayout>} />
        <Route path="/squadre/:id" element={<PublicLayout><TeamDetail /></PublicLayout>} />
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
          <Route path="profilo" element={<GuardianProfile />} />
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
          <Route path="profilo" element={<AdminProfile />} />
          <Route path="utenti" element={<AdminUsers />} />
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
      </Suspense>
    </GuardianAuthProvider>
    </AuthProvider>
    </ErrorBoundary>
  )
}
