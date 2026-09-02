import { useEffect, useState } from 'react'
import api from '../../lib/api'

// Mostrata sopra la gestione News per admin/superadmin: le proposte inviate
// dallo staff restano "in stand-by" finché non vengono approvate o rifiutate
// da qui — l'articolo (nuovo o esistente) non cambia finché non si approva.
export default function PendingNewsReview() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    api.get('/api/news/revisions')
      .then((res) => setItems(res.data))
      .catch(() => setError('Non riesco a caricare le proposte in attesa.'))
  }

  useEffect(() => { load() }, [])

  const approve = async (revision) => {
    setBusyId(revision.id)
    setError('')
    try {
      await api.post(`/api/news/revisions/${revision.id}/approve`)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Non riesco ad approvare questa proposta.')
    } finally {
      setBusyId(null)
    }
  }

  const reject = async (revision) => {
    const reason = window.prompt('Motivo del rifiuto (facoltativo, visibile a chi ha proposto la modifica):', '')
    if (reason === null) return // annullato
    setBusyId(revision.id)
    setError('')
    try {
      await api.post(`/api/news/revisions/${revision.id}/reject`, { reason: reason || null })
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Non riesco a rifiutare questa proposta.')
    } finally {
      setBusyId(null)
    }
  }

  if (items && items.length === 0) return null // niente da rivedere: non occupare spazio

  return (
    <div className="bg-white border-2 border-amber/40 rounded-2xl p-6 mb-8">
      <p className="font-display font-semibold text-navy-dark">News proposte dallo staff, in attesa di approvazione</p>
      {error && <p className="text-amber-dark text-sm font-medium mt-2">{error}</p>}

      {items === null && <p className="text-navy-dark/50 text-sm mt-3">Caricamento…</p>}

      <div className="mt-4 space-y-3">
        {items?.map((r) => (
          <div key={r.id} className="border-2 border-navy-dark/10 rounded-xl p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-amber-dark">
                  {r.news_id ? `Modifica di: ${r.current?.title || 'articolo esistente'}` : 'Nuovo articolo'}
                </span>
                <p className="font-display font-semibold text-navy-dark mt-1">{r.title}</p>
                {r.summary && <p className="text-sm text-navy-dark/60 mt-0.5">{r.summary}</p>}
                <p className="text-xs text-navy-dark/40 mt-1">
                  Proposto da {r.submitted_by_name} · {r.published ? 'da pubblicare subito' : 'come bozza'}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => approve(r)}
                  disabled={busyId === r.id}
                  className="text-xs font-semibold bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark px-4 py-2 rounded-full transition-colors"
                >
                  Approva
                </button>
                <button
                  onClick={() => reject(r)}
                  disabled={busyId === r.id}
                  className="text-xs font-semibold text-navy-dark/60 hover:text-red-600 disabled:opacity-60 px-2"
                >
                  Rifiuta
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
