import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('mva_token'))
  const [user, setUser] = useState(null)

  // Dopo un refresh della pagina il token resta in localStorage ma "user" va
  // recuperato di nuovo: senza questo, le pagine che leggono user.* (Profilo,
  // la voce di menu "Utenti" riservata al superadmin) si rompono finché non
  // si rifà login.
  useEffect(() => {
    if (token && !user) {
      api.get('/api/auth/me')
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('mva_token')
          setToken(null)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const login = useCallback(async (email, password) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    const { data } = await api.post('/api/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    localStorage.setItem('mva_token', data.access_token)
    setToken(data.access_token)
    const me = await api.get('/api/auth/me')
    setUser(me.data)
    return me.data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mva_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider')
  return ctx
}
