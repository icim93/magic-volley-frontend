import EntityManager from '../../components/admin/EntityManager'

export default function AdminStaff() {
  return (
    <EntityManager
      title="Staff tecnico"
      description="Allenatori e dirigenti, collegabili a una o più squadre."
      endpoint="/api/staff"
      columns={[
        { key: 'first_name', label: 'Nome' },
        { key: 'last_name', label: 'Cognome' },
        { key: 'role', label: 'Ruolo' },
        { key: 'teams', label: 'Squadre', render: (i) => i.teams?.map((t) => t.name).join(', ') || '—' },
      ]}
      fields={[
        { name: 'first_name', label: 'Nome', required: true },
        { name: 'last_name', label: 'Cognome', required: true },
        { name: 'role', label: 'Ruolo (es. Allenatore, Vice, Dirigente)', required: true },
        {
          name: 'team_ids',
          label: 'Squadre seguite',
          type: 'multiselect',
          optionsEndpoint: '/api/teams',
          optionsLabel: (t) => `${t.name} (${t.category})`,
        },
        { name: 'bio', label: 'Bio', type: 'textarea' },
        { name: 'email', label: 'Email' },
        { name: 'phone', label: 'Telefono' },
        { name: 'photo_url', label: 'URL foto' },
      ]}
      emptyItem={{ first_name: '', last_name: '', role: '', team_ids: [], bio: '', email: '', phone: '', photo_url: '' }}
      transformSubmit={(v) => ({
        ...v,
        team_ids: (v.team_ids || []).map(Number),
        teams: undefined, // campo di sola lettura ricevuto dall'API, da non rimandare
      })}
    />
  )
}
