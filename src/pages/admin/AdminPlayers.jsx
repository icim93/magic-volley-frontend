import EntityManager from '../../components/admin/EntityManager'

export default function AdminPlayers() {
  return (
    <EntityManager
      title="Giocatrici"
      description="Il roster completo, collegato alle rispettive squadre."
      endpoint="/api/players"
      columns={[
        { key: 'first_name', label: 'Nome' },
        { key: 'last_name', label: 'Cognome' },
        { key: 'jersey_number', label: 'Numero' },
        { key: 'role', label: 'Ruolo' },
      ]}
      fields={[
        { name: 'first_name', label: 'Nome', required: true },
        { name: 'last_name', label: 'Cognome', required: true },
        {
          name: 'team_id',
          label: 'Squadra',
          type: 'select',
          required: true,
          optionsEndpoint: '/api/teams',
          optionsLabel: (t) => `${t.name} (${t.category})`,
        },
        { name: 'jersey_number', label: 'Numero di maglia', type: 'number' },
        { name: 'role', label: 'Ruolo (es. schiacciatrice, palleggiatrice, libero)' },
        { name: 'birth_date', label: 'Data di nascita', type: 'date' },
        { name: 'photo_url', label: 'URL foto' },
        { name: 'is_active', label: 'In rosa attualmente', type: 'checkbox' },
      ]}
      emptyItem={{ first_name: '', last_name: '', team_id: '', jersey_number: '', role: '', birth_date: '', photo_url: '', is_active: true }}
      transformSubmit={(v) => ({
        ...v,
        team_id: Number(v.team_id),
        jersey_number: v.jersey_number ? Number(v.jersey_number) : null,
        birth_date: v.birth_date || null,
      })}
    />
  )
}
