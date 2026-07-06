import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useGuardianAuth } from '../../context/GuardianAuthContext'

export default function GuardianLogin() {
  const { login } = useGuardianAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/area-riservata')
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Il tuo account non è ancora attivo. Controlla l\'email che ti abbiamo inviato.')
      } else if (err.response?.status === 401) {
        setError('Email o password non corretti.')
      } else {
        setError('Non riesco a contattare il server. Riprova più tardi.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-5">
      <form onSubmit={handleSubmit} className="bg-white border-2 border-navy-dark/10 rounded-2xl p-8 w-full max-w-sm">
        <img src="/logo.png" alt="Magic Volley Adelfia ASD" className="h-24 w-auto mb-5" />
        <h1 className="font-display font-bold text-xl text-navy-dark">Area riservata famiglie</h1>
        <p className="text-sm text-navy-dark/60 mt-1 mb-6">Magic Volley Adelfia ASD</p>

        <label className="block mb-4">
          <span className="text-sm font-semibold text-navy-dark">Email</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input mt-1.5" autoFocus />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-semibold text-navy-dark">Password</span>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input mt-1.5" />
        </label>

        {error && <p className="text-sm text-amber-dark font-medium mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark font-display font-semibold py-3 rounded-full transition-colors"
        >
          {loading ? 'Accesso in corso…' : 'Accedi'}
        </button>

        <p className="text-xs text-navy-dark/50 mt-5 text-center">
          Non hai ancora un account? Lo staff lo crea automaticamente dopo l'approvazione
          della richiesta di <Link to="/iscriviti" className="text-amber-dark font-semibold">iscrizione</Link>.
        </p>
      </form>
    </div>
  )
}
