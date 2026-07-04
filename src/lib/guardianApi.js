import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Client separato da quello admin: usa un token diverso, salvato con una chiave
// diversa in localStorage, così un genitore e uno staff possono anche essere
// loggati "insieme" nello stesso browser senza sovrascriversi a vicenda.
const guardianApi = axios.create({ baseURL: API_URL })

guardianApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('mva_guardian_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

guardianApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname.startsWith('/area-riservata')) {
      localStorage.removeItem('mva_guardian_token')
      if (window.location.pathname !== '/area-riservata/login') {
        window.location.href = '/area-riservata/login'
      }
    }
    return Promise.reject(error)
  }
)

export default guardianApi
