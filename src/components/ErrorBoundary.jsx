import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // In produzione qui si potrebbe inviare l'errore a un servizio di monitoraggio.
    console.error('Errore non gestito nell\'app:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', textAlign: 'center',
          padding: '2rem', fontFamily: 'sans-serif', background: '#FAF7F1', color: '#14213D',
        }}>
          <p style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Qualcosa è andato storto
          </p>
          <p style={{ color: 'rgba(20,33,61,0.6)', marginBottom: '1.5rem', maxWidth: 380 }}>
            Si è verificato un errore imprevisto. Prova a ricaricare la pagina; se il problema persiste, controlla i dati appena inseriti.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#F2A93B', color: '#14213D', fontWeight: 700, border: 'none',
              padding: '0.75rem 1.5rem', borderRadius: '999px', cursor: 'pointer',
            }}
          >
            Ricarica la pagina
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
