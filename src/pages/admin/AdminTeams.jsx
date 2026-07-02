import EntityManager from '../../components/admin/EntityManager'

export default function AdminTeams() {
  return (
    <EntityManager
      title="Squadre"
      description="Le categorie della società: 2ª Divisione, U16, U18…"
      endpoint="/api/teams"
      listParams={{ active_only: false }}
      columns={[
        { key: 'name', label: 'Nome' },
        { key: 'category', label: 'Categoria' },
        { key: 'season', label: 'Stagione' },
        { key: 'is_active', label: 'Attiva', render: (i) => (i.is_active ? 'Sì' : 'No') },
      ]}
      fields={[
        { name: 'name', label: 'Nome squadra', required: true },
        { name: 'category', label: 'Categoria (es. U16, U18, 2ª Divisione)', required: true },
        { name: 'season', label: 'Stagione (es. 2025/2026)', required: true },
        { name: 'description', label: 'Descrizione', type: 'textarea' },
        { name: 'photo_url', label: 'URL foto squadra' },
        { name: 'is_active', label: 'Squadra attiva', type: 'checkbox' },
      ]}
      emptyItem={{ name: '', category: '', season: '', description: '', photo_url: '', is_active: true }}
    />
  )
}
