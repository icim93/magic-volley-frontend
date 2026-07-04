import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import guardianApi from '../../lib/guardianApi'

export default function ActivateAccount() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-5">
        <div className="max-w-sm text-center">
          <p className="font-display font-bold text-xl text-navy-dark">Link non valido</p>
          <p className="text-sm text-navy-dark/60 mt-2">
            Manca il codice di attivazione. Usa il link ricevuto via email dalla società.
          </p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Le due password non coincidono.')
      return
    }
    setStatus('sending')
    setError('')
    try {
      await guardianApi.post('/api/guardian-auth/activate', { token, password })
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setError(err.response?.data?.detail || 'Non riesco ad attivare l\'account. Il link potrebbe essere scaduto.')
    }
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-5">
        <div className="max-w-sm text-center">
          <p className="font-display font-bold text-xl text-navy-dark">Account attivato!</p>
          <p className="text-sm text-navy-dark/60 mt-2 mb-6">Ora puoi accedere alla tua area riservata.</p>
          <Link
            to="/area-riservata/login"
            className="inline-block bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Vai al login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <form onSubmit={handleSubmit} className="bg-white border-2 border-navy-dark/10 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="font-display font-bold text-xl text-navy-dark">Attiva il tuo account</h1>
        <p className="text-sm text-navy-dark/60 mt-1 mb-6">Scegli una password per accedere all'area riservata.</p>

        <label className="block mb-4">
          <span className="text-sm font-semibold text-navy-dark">Nuova password</span>
          <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="input mt-1.5" />
          <span className="text-xs text-navy-dark/50 mt-1 block">Almeno 8 caratteri.</span>
        </label>

        <label className="block mb-6">
          <span className="text-sm font-semibold text-navy-dark">Conferma password</span>
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input mt-1.5" />
        </label>

        {error && <p className="text-sm text-amber-dark font-medium mb-4">{error}</p>}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark font-display font-semibold py-3 rounded-full transition-colors"
        >
          {status === 'sending' ? 'Attivazione…' : 'Attiva account'}
        </button>
      </form>
    </div>
  )
}
