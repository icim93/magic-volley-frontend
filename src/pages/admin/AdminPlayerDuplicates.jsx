import { useEffect, useState } from 'react'
import api from '../../lib/api'

const fields = [
  ['birth_date', 'Data di nascita'], ['jersey_number', 'Numero'],
  ['role', 'Ruolo'], ['height_cm', 'Altezza'], ['bio', 'Bio'], ['photo_url', 'Foto'],
]

export default function AdminPlayerDuplicates() {
  const [groups, setGroups] = useState(null)
  const [selected, setSelected] = useState({})
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const errorMessage = (err) => {
    const code = err.response?.status
    if (code === 404) {
      return 'Il backend non espone ancora la funzione Unisci duplicati (HTTP 404). Occorre verificare il deploy del backend e che sia aggiornato alla versione GitHub.'
    }
    if (code === 401 || code === 403) {
      return 'Accesso non autorizzato (HTTP ' + code + '). Esegui nuovamente il login con un account amministratore.'
    }
    if (code === 500 || (code >= 500 && code < 600)) {
      return 'Errore del backend (HTTP ' + code + '). Controllare i log del servizio, lo schema del database e il campo merged_into_player_id.'
    }
    if (!err.response) {
      return 'Il server non risponde. Controlla connessione, stato del backend e configurazione API.'
    }
    return 'Impossibile leggere le schede (HTTP ' + code + ').'
  }

  const load = async () => {
    setError('')
    try {
      const { data } = await api.get('/api/player-duplicates', {
        headers: { 'Cache-Control': 'no-cache' },
      })
      if (!Array.isArray(data)) {
        throw new Error('La risposta del backend non contiene un elenco di schede.')
      }
      setGroups(data)
    } catch (err) {
      setGroups(null)
      setError(err.message && !err.response && err.message.startsWith('La risposta')
        ? err.message : errorMessage(err))
    }
  }

  useEffect(() => {
    load()
  }, [])

  const merge = async (group, source) => {
    const key = group.team_id + ':' + group.name
    const keepId = Number(selected[key])
    if (!keepId || keepId === source.id) return
    if (!window.confirm('Archiviare la scheda #' + source.id +
        ' e unire i suoi dati nella scheda #' + keepId + '?')) return
    setBusy(true)
    setError('')
    setNotice('')
    try {
      const { data } = await api.post('/api/player-duplicates/merge', {
        keep_id: keepId, merge_id: source.id,
      })
      setNotice('Schede unite. Principale #' + data.kept_id +
        '; archiviata #' + data.archived_id + '.')
      await load()
    } catch (e) {
      setError(typeof e.response?.data?.detail === 'string'
        ? e.response.data.detail : 'Unione non riuscita.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display font-bold text-xl sm:text-2xl">Unisci giocatrici duplicate</h1>
      <p className="text-sm">Mostriamo le omonime della stessa squadra.
        Scegli quale scheda conservare. Nessun record viene eliminato:
        i dati complementari vengono copiati e le schede secondarie archiviate.
        I conflitti vanno risolti prima nella sezione Giocatrici.</p>
      {error && (
        <div role="alert" className="space-y-3 rounded-xl border border-red-200 bg-white p-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button type="button" onClick={load}
            className="bg-navy-dark text-white rounded-lg px-4 py-2 text-sm font-semibold">
            Riprova caricamento
          </button>
        </div>
      )}
      {notice && <p role="status">{notice}</p>}
      {!groups && !error && <p>Caricamento…</p>}
      {groups?.length === 0 && <p>Nessun gruppo di omonime trovato.</p>}
      {groups?.map(group => {
        const key = group.team_id + ':' + group.name
        const keepId = Number(selected[key])
        return (
          <section key={key} className="bg-white rounded-xl p-4 sm:p-5 space-y-4 min-w-0">
            <h2 className="font-semibold text-lg">{group.name}</h2>
            <p className="text-sm">{group.team_name} · {group.season}</p>
            {group.conflicts.length > 0 && (
              <p className="text-red-700 text-sm">
                Valori discordanti: {group.conflicts.join(', ')}.
              </p>
            )}
            <div className="max-w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr><th>Campo</th>{group.players.map(p =>
                  <th className="min-w-32 px-2 text-left" key={p.id}>Scheda #{p.id}</th>)}</tr></thead>
                <tbody>
                  {fields.map(([field, label]) => (
                    <tr key={field}>
                      <td className="p-2">{label}</td>
                      {group.players.map(p =>
                        <td className="p-2" key={p.id}>
                          {p[field] == null || p[field] === '' ? '—' : String(p[field])}
                        </td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <label className="block text-sm">
              Scheda principale
              <select className="input mt-1" value={selected[key] || ''}
                onChange={e => setSelected(s => ({ ...s, [key]: e.target.value }))}>
                <option value="">Seleziona…</option>
                {group.players.map(p =>
                  <option key={p.id} value={p.id}>Scheda #{p.id}</option>)}
              </select>
            </label>
            {keepId > 0 && group.players.filter(p => p.id !== keepId).map(p =>
              <button key={p.id} disabled={busy || group.conflicts.length > 0}
                onClick={() => merge(group, p)}
                className="bg-amber text-navy-dark px-4 py-2 rounded-lg disabled:opacity-40 mr-2">
                Unisci #{p.id} nella #{keepId}
              </button>)}
          </section>
        )
      })}
    </div>
  )
}
