import { useEffect, useState, useCallback } from 'react'
import api from '../../lib/api'

/**
 * Componente generico di gestione CRUD, usato da tutte le pagine admin
 * (Squadre, Giocatrici, Staff, Partite, News, Sponsor...) per evitare di
 * ripetere la stessa struttura lista + form sette volte.
 *
 * Props:
 * - title, description: intestazione della pagina
 * - endpoint: path base delle API (es. "/api/teams")
 * - listParams: query params extra per il GET lista (es. { active_only: false })
 * - columns: [{ key, label, render? }] colonne mostrate nella tabella
 * - fields: [{ name, label, type, required, options, optionsEndpoint, optionsLabel }]
 *     type: text | textarea | number | date | datetime | select | checkbox
 * - emptyItem: valori di default per il form di creazione
 * - transformSubmit: (values) => payload  (es. per convertire stringhe in numeri)
 */
export default function EntityManager({
  title,
  description,
  endpoint,
  listParams,
  columns,
  fields,
  emptyItem,
  transformSubmit,
}) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null) // null = nessun form aperto, {} = nuovo, {...} = modifica
  const [optionsCache, setOptionsCache] = useState({})
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = useCallback(() => {
    setError('')
    api.get(endpoint, { params: listParams })
      .then((res) => setItems(res.data))
      .catch(() => setError('Non riesco a caricare i dati.'))
  }, [endpoint, listParams])

  useEffect(() => { load() }, [load])

  // Carica le opzioni per i campi "select" collegati ad altre risorse (es. squadra di una giocatrice)
  useEffect(() => {
    fields.forEach((f) => {
      if (f.optionsEndpoint && !optionsCache[f.name]) {
        api.get(f.optionsEndpoint).then((res) => {
          setOptionsCache((prev) => ({
            ...prev,
            [f.name]: res.data.map((item) => ({
              value: item.id,
              label: f.optionsLabel ? f.optionsLabel(item) : item.name,
            })),
          }))
        }).catch(() => {})
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openCreate = () => { setEditing({ ...emptyItem }); setFormError('') }
  const openEdit = (item) => { setEditing({ ...item }); setFormError('') }
  const closeForm = () => setEditing(null)

  const handleChange = (name, value) => setEditing((prev) => ({ ...prev, [name]: value }))

  // Gli errori di validazione di FastAPI (422) arrivano come lista di oggetti, non come stringa.
  // Senza questa conversione, provare a mostrare direttamente l'oggetto mandava in crash la pagina.
  const extractErrorMessage = (err) => {
    const detail = err.response?.data?.detail
    if (!detail) return 'Salvataggio non riuscito. Controlla i dati inseriti.'
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || String(d)).join(' — ')
    }
    return 'Salvataggio non riuscito. Controlla i dati inseriti.'
  }

  // Converte i campi facoltativi lasciati vuoti in null, invece di mandare una stringa vuota:
  // per alcuni campi (es. email) una stringa vuota non è un valore valido e il backend la rifiuta.
  const buildPayload = () => {
    const base = { ...editing }
    fields.forEach((f) => {
      if (!f.required && base[f.name] === '') {
        base[f.name] = null
      }
    })
    return transformSubmit ? transformSubmit(base) : base
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = buildPayload()
      if (editing.id) {
        await api.patch(`${endpoint}/${editing.id}`, payload)
      } else {
        await api.post(endpoint, payload)
      }
      closeForm()
      load()
    } catch (err) {
      setFormError(extractErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm('Confermi l\'eliminazione? L\'operazione non è reversibile.')) return
    try {
      await api.delete(`${endpoint}/${item.id}`)
      load()
    } catch {
      setError('Non riesco a eliminare questo elemento.')
    }
  }

  const fieldOptions = (f) => f.optionsEndpoint ? (optionsCache[f.name] || []) : (f.options || [])

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy-dark">{title}</h1>
          {description && <p className="text-navy-dark/60 text-sm mt-1">{description}</p>}
        </div>
        <button
          onClick={openCreate}
          className="bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          + Nuovo
        </button>
      </div>

      {error && <p className="text-amber-dark text-sm font-medium mb-4">{error}</p>}

      <div className="bg-white border-2 border-navy-dark/10 rounded-2xl overflow-hidden">
        {items === null ? (
          <p className="text-navy-dark/50 text-sm p-6">Caricamento…</p>
        ) : items.length === 0 ? (
          <p className="text-navy-dark/50 text-sm p-6">Nessun elemento presente. Crea il primo con "+ Nuovo".</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-dark/5 text-left">
                {columns.map((c) => (
                  <th key={c.key} className="px-5 py-3 font-display font-semibold text-navy-dark/70 text-xs uppercase tracking-wide">
                    {c.label}
                  </th>
                ))}
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-navy-dark/5">
                  {columns.map((c) => (
                    <td key={c.key} className="px-5 py-3 text-navy-dark">
                      {c.render ? c.render(item) : (item[c.key] ?? '—')}
                    </td>
                  ))}
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(item)} className="text-navy-light hover:text-navy-dark font-semibold mr-4">
                      Modifica
                    </button>
                    <button onClick={() => handleDelete(item)} className="text-amber-dark hover:text-red-600 font-semibold">
                      Elimina
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-navy-dark/40 flex items-center justify-center p-5 z-50" onClick={closeForm}>
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-cream rounded-2xl p-7 w-full max-w-lg max-h-[85vh] overflow-y-auto"
          >
            <h2 className="font-display font-bold text-lg text-navy-dark mb-5">
              {editing.id ? 'Modifica' : 'Nuovo'} — {title}
            </h2>

            <div className="space-y-4">
              {fields.map((f) => (
                <label key={f.name} className="block">
                  <span className="text-sm font-semibold text-navy-dark">
                    {f.label}{f.required && <span className="text-amber-dark"> *</span>}
                  </span>
                  <div className="mt-1.5">
                    {f.type === 'textarea' ? (
                      <textarea
                        required={f.required}
                        rows={4}
                        value={editing[f.name] ?? ''}
                        onChange={(e) => handleChange(f.name, e.target.value)}
                        className="input"
                      />
                    ) : f.type === 'select' ? (
                      <select
                        required={f.required}
                        value={editing[f.name] ?? ''}
                        onChange={(e) => handleChange(f.name, e.target.value)}
                        className="input"
                      >
                        <option value="">Seleziona…</option>
                        {fieldOptions(f).map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : f.type === 'multiselect' ? (
                      <div className="flex flex-wrap gap-2">
                        {fieldOptions(f).map((opt) => {
                          const current = editing[f.name] || []
                          const checked = current.includes(opt.value) || current.includes(String(opt.value))
                          return (
                            <label
                              key={opt.value}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border-2 cursor-pointer transition-colors ${
                                checked ? 'bg-amber border-amber text-navy-dark' : 'border-navy-dark/15 text-navy-dark/70'
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="hidden"
                                checked={checked}
                                onChange={() => {
                                  const next = checked
                                    ? current.filter((v) => v !== opt.value && v !== String(opt.value))
                                    : [...current, opt.value]
                                  handleChange(f.name, next)
                                }}
                              />
                              {opt.label}
                            </label>
                          )
                        })}
                      </div>
                    ) : f.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={!!editing[f.name]}
                        onChange={(e) => handleChange(f.name, e.target.checked)}
                        className="w-5 h-5 accent-amber"
                      />
                    ) : (
                      <input
                        type={f.type || 'text'}
                        required={f.required}
                        value={editing[f.name] ?? ''}
                        onChange={(e) => handleChange(f.name, e.target.value)}
                        className="input"
                      />
                    )}
                  </div>
                </label>
              ))}
            </div>

            {formError && <p className="text-amber-dark text-sm font-medium mt-4">{formError}</p>}

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark font-display font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                {saving ? 'Salvataggio…' : 'Salva'}
              </button>
              <button type="button" onClick={closeForm} className="text-navy-dark/60 hover:text-navy-dark font-semibold px-3">
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
