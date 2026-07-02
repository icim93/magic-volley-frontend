import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
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
      navigate(location.state?.from || '/admin')
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Email o password non corretti.'
          : 'Non riesco a contattare il server. Riprova più tardi.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-dark px-5">
      <form onSubmit={handleSubmit} className="bg-cream rounded-2xl p-8 w-full max-w-sm">
        <div className="flex gap-1.5 items-end mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-navy-light" />
          <span className="w-3.5 h-3.5 rounded-full bg-amber" />
          <span className="w-5 h-5 rounded-full bg-amber-dark" />
        </div>
        <h1 className="font-display font-bold text-xl text-navy-dark">Pannello gestionale</h1>
        <p className="text-sm text-navy-dark/60 mt-1 mb-6">Magic Volley Adelfia</p>

        <label className="block mb-4">
          <span className="text-sm font-semibold text-navy-dark">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input mt-1.5"
            autoFocus
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm font-semibold text-navy-dark">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-1.5"
          />
        </label>

        {error && <p className="text-sm text-amber-dark font-medium mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark font-display font-semibold py-3 rounded-full transition-colors"
        >
          {loading ? 'Accesso in corso…' : 'Accedi'}
        </button>
      </form>
    </div>
  )
}
