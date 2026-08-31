import { useEffect, useState } from 'react'
import api from '../../lib/api'

export default function AdminGuardians() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [regenerating, setRegenerating] = useState(null)
  const [linkResult, setLinkResult] = useState(null)

  const load = () => {
    api.get('/api/guardians')
      .then((res) => setItems(res.data))
      .catch(() => setError('Non riesco a caricare i genitori.'))
  }

  useEffect(() => { load() }, [])

  const regenerateLink = async (guardian) => {
    setRegenerating(guardian.id)
    setError('')
    try {
      const { data } = await api.post(`/api/guardians/${guardian.id}/regenerate-activation-link`)
      setLinkResult({ guardian, ...data })
    } catch (err) {
      setError(err.response?.data?.detail || 'Non riesco a generare un nuovo link.')
    } finally {
      setRegenerating(null)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-navy-dark">Genitori</h1>
        <p className="text-navy-dark/60 text-sm mt-1">
          Account dell'area riservata famiglie, creati approvando le iscrizioni. Da qui puoi anche rigenerare il
          link di attivazione se è andato perso.
        </p>
      </div>

      {error && <p className="text-amber-dark text-sm font-medium mb-4">{error}</p>}

      <div className="bg-white border-2 border-navy-dark/10 rounded-2xl overflow-hidden">
        {items === null ? (
          <p className="text-navy-dark/50 text-sm p-6">Caricamento…</p>
        ) : items.length === 0 ? (
          <p className="text-navy-dark/50 text-sm p-6">Nessun genitore creato ancora.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-dark/5 text-left">
                <th className="px-5 py-3 font-display font-semibold text-navy-dark/70 text-xs uppercase tracking-wide">Genitore</th>
                <th className="px-5 py-3 font-display font-semibold text-navy-dark/70 text-xs uppercase tracking-wide">Email</th>
                <th className="px-5 py-3 font-display font-semibold text-navy-dark/70 text-xs uppercase tracking-wide">Figli/e collegati</th>
                <th className="px-5 py-3 font-display font-semibold text-navy-dark/70 text-xs uppercase tracking-wide">Stato</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((g) => (
                <tr key={g.id} className="border-t border-navy-dark/5">
                  <td className="px-5 py-3 text-navy-dark font-medium">{g.first_name} {g.last_name}</td>
                  <td className="px-5 py-3 text-navy-dark/70">{g.email}</td>
                  <td className="px-5 py-3 text-navy-dark/70">
                    {g.players?.length > 0
                      ? g.players.map((p) => `${p.first_name} ${p.last_name} (${p.team?.category || '—'})`).join(', ')
                      : '—'}
                  </td>
                  <td className="px-5 py-3">
                    {g.is_active ? (
                      <span className="text-xs font-semibold text-green-700">✓ Attivo</span>
                    ) : (
                      <span className="text-xs font-semibold text-amber-dark">In attesa di attivazione</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    {!g.is_active && (
                      <button
                        onClick={() => regenerateLink(g)}
                        disabled={regenerating === g.id}
                        className="text-navy-light hover:text-navy-dark font-semibold disabled:opacity-50"
                      >
                        {regenerating === g.id ? 'Genero…' : 'Rigenera link'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {linkResult && (
        <div className="fixed inset-0 bg-navy-dark/40 flex items-center justify-center p-5 z-50">
          <div className="bg-cream rounded-2xl p-7 w-full max-w-lg">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="font-display font-bold text-lg text-navy-dark">
                Nuovo link per {linkResult.guardian.first_name} {linkResult.guardian.last_name}
              </h2>
              <button
                type="button"
                onClick={() => setLinkResult(null)}
                aria-label="Chiudi"
                className="text-navy-dark/40 hover:text-navy-dark shrink-0"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {linkResult.email_sent ? (
              <p className="text-sm text-green-700">Email inviata correttamente a {linkResult.guardian.email}.</p>
            ) : (
              <p className="text-sm text-navy-dark/60">
                Email non inviata (servizio email non configurato). Copia questo link e invialo tu al genitore:
              </p>
            )}
            <input
              readOnly
              value={linkResult.activation_link}
              onClick={(e) => e.target.select()}
              className="input text-xs mt-3"
            />

            <button
              onClick={() => setLinkResult(null)}
              className="mt-6 bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
