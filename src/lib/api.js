import axios from 'axios'

// In sviluppo punta al backend locale; in produzione impostare VITE_API_URL
// nelle variabili d'ambiente del deploy (es. Vercel) verso l'URL Render del backend.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
})

// Aggiunge automaticamente il token JWT (se presente) a ogni richiesta.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mva_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Se il token è scaduto/non valido, riporta al login del pannello admin.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('mva_token')
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
