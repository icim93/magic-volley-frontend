import { createContext, useContext, useState, useCallback } from 'react'
import guardianApi from '../lib/guardianApi'

const GuardianAuthContext = createContext(null)

export function GuardianAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('mva_guardian_token'))
  const [guardian, setGuardian] = useState(null)

  const login = useCallback(async (email, password) => {
    const form = new URLSearchParams()
    form.append('username', email)
    form.append('password', password)
    const { data } = await guardianApi.post('/api/guardian-auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    localStorage.setItem('mva_guardian_token', data.access_token)
    setToken(data.access_token)
    const me = await guardianApi.get('/api/guardian-auth/me')
    setGuardian(me.data)
    return me.data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('mva_guardian_token')
    setToken(null)
    setGuardian(null)
  }, [])

  return (
    <GuardianAuthContext.Provider value={{ token, guardian, login, logout, isAuthenticated: !!token }}>
      {children}
    </GuardianAuthContext.Provider>
  )
}

export function useGuardianAuth() {
  const ctx = useContext(GuardianAuthContext)
  if (!ctx) throw new Error('useGuardianAuth deve essere usato dentro GuardianAuthProvider')
  return ctx
}
