import { useState } from 'react'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

export default function AdminProfile() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (newPassword.length < 8) {
      setStatus('error')
      setErrorMsg('La nuova password deve avere almeno 8 caratteri.')
      return
    }
    if (newPassword !== confirmPassword) {
      setStatus('error')
      setErrorMsg('Le due password non coincidono.')
      return
    }

    setStatus('sending')
    try {
      await api.post('/api/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      })
      setStatus('done')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.detail || 'Non siamo riusciti ad aggiornare la password. Riprova.')
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy-dark">Profilo</h1>
      <p className="text-navy-dark/60 text-sm mt-1">I tuoi dati e le impostazioni dell'account.</p>

      {user && (
        <div className="mt-8 bg-white border-2 border-navy-dark/10 rounded-2xl p-6 max-w-lg">
          <p className="font-display text-xs uppercase tracking-widest text-amber-dark mb-3">I tuoi dati</p>
          <p className="font-body font-semibold text-navy-dark">{user.full_name}</p>
          <p className="text-sm text-navy-dark/60 mt-1">{user.email}</p>
          <p className="text-xs text-navy-dark/40 mt-2 uppercase tracking-wide">{user.role}</p>
        </div>
      )}

      <div className="mt-8 bg-white border-2 border-navy-dark/10 rounded-2xl p-6 max-w-lg">
        <p className="font-display text-xs uppercase tracking-widest text-amber-dark mb-4">Cambia password</p>

        {status === 'done' ? (
          <p className="text-sm font-semibold text-navy-dark">Password aggiornata correttamente.</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-navy-dark">Password attuale</span>
              <input
                required
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input mt-1.5"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-navy-dark">Nuova password</span>
              <input
                required
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input mt-1.5"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-navy-dark">Conferma nuova password</span>
              <input
                required
                type="password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input mt-1.5"
              />
            </label>

            {status === 'error' && (
              <p className="text-sm text-amber-dark font-medium">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark font-display font-semibold px-6 py-3 rounded-full transition-colors"
            >
              {status === 'sending' ? 'Aggiorno…' : 'Aggiorna password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
