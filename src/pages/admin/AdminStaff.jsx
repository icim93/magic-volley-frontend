import EntityManager from '../../components/admin/EntityManager'

const areaLabels = {
  dirigenza: 'Dirigenza',
  staff_tecnico: 'Staff tecnico',
  area_sanitaria: 'Area sanitaria',
  collaboratori: 'Collaboratori',
}

export default function AdminStaff() {
  return (
    <EntityManager
      title="Staff e Organigramma"
      description="Tutte le persone dello staff e dell'organigramma societario, mostrate sul sito raggruppate per area."
      endpoint="/api/staff"
      columns={[
        { key: 'first_name', label: 'Nome' },
        { key: 'last_name', label: 'Cognome' },
        { key: 'role', label: 'Ruolo' },
        { key: 'area', label: 'Area', render: (i) => areaLabels[i.area] || i.area },
        { key: 'teams', label: 'Squadre', render: (i) => i.teams?.map((t) => t.name).join(', ') || '—' },
      ]}
      fields={[
        { name: 'first_name', label: 'Nome', required: true },
        { name: 'last_name', label: 'Cognome', required: true },
        { name: 'role', label: 'Ruolo (es. Allenatore, Vice, Presidente, Fisioterapista)', required: true },
        {
          name: 'area',
          label: 'Area (dove compare sul sito)',
          type: 'select',
          required: true,
          options: [
            { value: 'staff_tecnico', label: 'Staff tecnico' },
            { value: 'dirigenza', label: 'Dirigenza' },
            { value: 'area_sanitaria', label: 'Area sanitaria' },
            { value: 'collaboratori', label: 'Collaboratori' },
          ],
        },
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
        { name: 'photo_url', label: 'Foto', type: 'image' },
      ]}
      emptyItem={{ first_name: '', last_name: '', role: '', area: 'staff_tecnico', team_ids: [], bio: '', email: '', phone: '', photo_url: '' }}
      transformSubmit={(v) => ({
        ...v,
        team_ids: (v.team_ids || []).map(Number),
        teams: undefined, // campo di sola lettura ricevuto dall'API, da non rimandare
      })}
    />
  )
}
