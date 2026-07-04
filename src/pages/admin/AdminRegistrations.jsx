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

// Prova a separare "Mario Rossi" in nome/cognome per precompilare il form di approvazione.
// È solo un suggerimento: lo staff può sempre correggerlo prima di confermare.
function splitName(fullName) {
  if (!fullName) return { first: '', last: '' }
  const parts = fullName.trim().split(/\s+/)
  return { first: parts[0] || '', last: parts.slice(1).join(' ') || '' }
}

function ApproveModal({ registration, onClose, onDone }) {
  const [teams, setTeams] = useState(null)
  const guess = splitName(registration.parent_name)
  const [form, setForm] = useState({
    team_id: '',
    jersey_number: '',
    guardian_first_name: guess.first,
    guardian_last_name: guess.last,
    guardian_email: registration.email,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    api.get('/api/teams', { params: { active_only: false } }).then((res) => setTeams(res.data)).catch(() => {})
  }, [])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const { data } = await api.post(`/api/registrations/${registration.id}/approve-and-invite`, {
        ...form,
        team_id: Number(form.team_id),
        jersey_number: form.jersey_number ? Number(form.jersey_number) : null,
      })
      setResult(data)
      onDone()
    } catch (err) {
      setError(err.response?.data?.detail || 'Approvazione non riuscita. Controlla i dati inseriti.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-navy-dark/40 flex items-center justify-center p-5 z-50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-cream rounded-2xl p-7 w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {result ? (
          <div>
            <h2 className="font-display font-bold text-lg text-navy-dark mb-3">Fatto! 🎉</h2>
            <p className="text-sm text-navy-dark/70">
              Giocatrice creata e collegata a <strong>{result.guardian_email}</strong>.
            </p>
            {result.email_sent ? (
              <p className="text-sm text-green-700 mt-2">Email di attivazione inviata correttamente.</p>
            ) : (
              <div className="mt-4 bg-amber/10 border-2 border-amber/30 rounded-xl p-4">
                <p className="text-sm text-navy-dark font-semibold">
                  Email non inviata (servizio email non ancora configurato, oppure account già attivo).
                </p>
                <p className="text-xs text-navy-dark/60 mt-1">
                  Copia questo link e invialo tu al genitore:
                </p>
                <input
                  readOnly
                  value={result.activation_link}
                  onClick={(e) => e.target.select()}
                  className="input text-xs mt-2"
                />
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-6 bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              Chiudi
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="font-display font-bold text-lg text-navy-dark mb-1">Approva iscrizione</h2>
            <p className="text-sm text-navy-dark/60 mb-5">
              Crea la giocatrice nella squadra scelta e l'account del genitore, che riceverà un'email per attivarlo.
            </p>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-navy-dark">Squadra *</span>
                <select required value={form.team_id} onChange={update('team_id')} className="input mt-1.5">
                  <option value="">Seleziona…</option>
                  {teams?.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.category})</option>)}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-navy-dark">Numero di maglia</span>
                <input type="number" value={form.jersey_number} onChange={update('jersey_number')} className="input mt-1.5" />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm font-semibold text-navy-dark">Nome genitore *</span>
                  <input required value={form.guardian_first_name} onChange={update('guardian_first_name')} className="input mt-1.5" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-navy-dark">Cognome genitore *</span>
                  <input required value={form.guardian_last_name} onChange={update('guardian_last_name')} className="input mt-1.5" />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-navy-dark">Email genitore (per l'accesso) *</span>
                <input required type="email" value={form.guardian_email} onChange={update('guardian_email')} className="input mt-1.5" />
              </label>
            </div>

            {error && <p className="text-amber-dark text-sm font-medium mt-4">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark font-display font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                {saving ? 'Approvazione…' : 'Approva e crea account'}
              </button>
              <button type="button" onClick={onClose} className="text-navy-dark/60 hover:text-navy-dark font-semibold px-3">
                Annulla
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function AdminRegistrations() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState(null)
  const [notesDraft, setNotesDraft] = useState({})
  const [approving, setApproving] = useState(null)

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
                {item.player_id ? (
                  <p className="text-xs text-green-700 font-semibold mt-2">✓ Giocatrice e account genitore creati</p>
                ) : (
                  <button
                    onClick={() => setApproving(item)}
                    className="text-xs font-semibold text-amber-dark hover:text-amber mt-2"
                  >
                    Approva e crea account genitore →
                  </button>
                )}
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

      {approving && (
        <ApproveModal
          registration={approving}
          onClose={() => setApproving(null)}
          onDone={load}
        />
      )}
    </div>
  )
}
