import { useEffect, useState } from 'react'
import api from '../../lib/api'

const statusOptions = [
  { value: 'pending', label: 'In attesa' },
  { value: 'approved', label: 'Approvata' },
  { value: 'payment_due', label: 'In attesa di pagamento' },
  { value: 'completed', label: 'Completata' },
  { value: 'rejected', label: 'Rifiutata' },
]

const statusColor = {
  pending: 'bg-navy-light/15 text-navy-light',
  approved: 'bg-green-100 text-green-700',
  payment_due: 'bg-amber/20 text-amber-dark',
  completed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

export default function AdminRegistrations() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [notesDraft, setNotesDraft] = useState({})

  const load = () => {
    api.get('/api/registrations').then((res) => setItems(res.data)).catch(() => setError('Non riesco a caricare le iscrizioni.'))
  }

  useEffect(() => { load() }, [])

  const updateStatus = async (item, status) => {
    setSavingId(item.id)
    try {
      await api.patch(`/api/registrations/${item.id}`, { status })
      load()
    } catch {
      setError('Non riesco ad aggiornare lo stato.')
    } finally {
      setSavingId(null)
    }
  }

  const saveNotes = async (item) => {
    setSavingId(item.id)
    try {
      await api.patch(`/api/registrations/${item.id}`, { notes: notesDraft[item.id] })
      load()
    } catch {
      setError('Non riesco a salvare le note.')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy-dark">Iscrizioni</h1>
      <p className="text-navy-dark/60 text-sm mt-1">
        Richieste di tesseramento inviate dal sito pubblico. Aggiorna lo stato man mano che avanzano.
      </p>

      {error && <p className="text-amber-dark text-sm font-medium mt-4">{error}</p>}

      <div className="mt-8 space-y-4">
        {items === null && <p className="text-navy-dark/50 text-sm">Caricamento…</p>}
        {items?.length === 0 && <p className="text-navy-dark/50 text-sm">Nessuna iscrizione ricevuta ancora.</p>}

        {items?.map((item) => (
          <div key={item.id} className="bg-white border-2 border-navy-dark/10 rounded-2xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display font-semibold text-navy-dark">{item.first_name} {item.last_name}</p>
                <p className="text-sm text-navy-dark/60 mt-0.5">
                  {item.email} · {item.phone}
                  {item.requested_team_category && ` · categoria ${item.requested_team_category}`}
                </p>
                {item.parent_name && <p className="text-sm text-navy-dark/50 mt-0.5">Genitore: {item.parent_name}</p>}
                <p className="text-xs text-navy-dark/40 mt-1">
                  Nato/a il {new Date(item.birth_date).toLocaleDateString('it-IT')} · richiesta del {new Date(item.created_at).toLocaleDateString('it-IT')}
                </p>
              </div>

              <select
                value={item.status}
                disabled={savingId === item.id}
                onChange={(e) => updateStatus(item, e.target.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 ${statusColor[item.status] || ''}`}
              >
                {statusOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>

            <div className="mt-4 flex gap-2">
              <input
                placeholder="Note interne (es. certificato mancante)…"
                value={notesDraft[item.id] ?? item.notes ?? ''}
                onChange={(e) => setNotesDraft((prev) => ({ ...prev, [item.id]: e.target.value }))}
                className="input text-sm flex-1"
              />
              <button
                onClick={() => saveNotes(item)}
                disabled={savingId === item.id}
                className="text-sm font-semibold text-amber-dark hover:text-amber shrink-0 px-3"
              >
                Salva nota
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
