import EntityManager from '../../components/admin/EntityManager'

const statusOptions = [
  { value: 'scheduled', label: 'In programma' },
  { value: 'played', label: 'Giocata' },
  { value: 'postponed', label: 'Rinviata' },
  { value: 'cancelled', label: 'Annullata' },
]

export default function AdminMatches() {
  return (
    <EntityManager
      title="Partite"
      description="Calendario e risultati. Per inserire un risultato, modifica la partita e imposta stato 'Giocata' con i set."
      endpoint="/api/matches"
      columns={[
        { key: 'match_date', label: 'Data', render: (i) => new Date(i.match_date).toLocaleString('it-IT') },
        { key: 'teams', label: 'Squadre', render: (i) => `${i.home_team_name} vs ${i.away_team_name}` },
        { key: 'status', label: 'Stato', render: (i) => statusOptions.find((s) => s.value === i.status)?.label },
        { key: 'result', label: 'Risultato', render: (i) => (i.home_sets != null ? `${i.home_sets}-${i.away_sets}` : '—') },
      ]}
      fields={[
        {
          name: 'home_team_id',
          label: 'Nostra squadra',
          type: 'select',
          required: true,
          optionsEndpoint: '/api/teams',
          optionsLabel: (t) => `${t.name} (${t.category})`,
        },
        { name: 'home_team_name', label: 'Nome squadra (come da comunicato/tabellone)', required: true },
        { name: 'away_team_name', label: 'Squadra avversaria', required: true },
        { name: 'is_home', label: 'Partita in casa', type: 'checkbox' },
        { name: 'match_date', label: 'Data e ora', type: 'datetime-local', required: true },
        { name: 'location', label: 'Palestra / indirizzo' },
        { name: 'status', label: 'Stato', type: 'select', options: statusOptions },
        { name: 'home_sets', label: 'Set nostra squadra', type: 'number' },
        { name: 'away_sets', label: 'Set squadra avversaria', type: 'number' },
        { name: 'set_scores', label: 'Punteggi set (es. "25-20, 22-25, 25-18")' },
        { name: 'notes', label: 'Note', type: 'textarea' },
      ]}
      emptyItem={{
        home_team_id: '', home_team_name: '', away_team_name: '', is_home: true,
        match_date: '', location: '', status: 'scheduled', home_sets: '', away_sets: '', set_scores: '', notes: '',
      }}
      transformSubmit={(v) => ({
        ...v,
        home_team_id: Number(v.home_team_id),
        home_sets: v.home_sets === '' ? null : Number(v.home_sets),
        away_sets: v.away_sets === '' ? null : Number(v.away_sets),
        match_date: v.match_date ? new Date(v.match_date).toISOString() : v.match_date,
      })}
    />
  )
}
