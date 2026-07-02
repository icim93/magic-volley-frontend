import EntityManager from '../../components/admin/EntityManager'

export default function AdminSponsors() {
  return (
    <EntityManager
      title="Sponsor"
      description="Loghi e link degli sponsor mostrati sul sito pubblico."
      endpoint="/api/sponsors"
      listParams={{ active_only: false }}
      columns={[
        { key: 'name', label: 'Nome' },
        { key: 'tier', label: 'Livello' },
        { key: 'display_order', label: 'Ordine' },
        { key: 'is_active', label: 'Attivo', render: (i) => (i.is_active ? 'Sì' : 'No') },
      ]}
      fields={[
        { name: 'name', label: 'Nome sponsor', required: true },
        { name: 'logo_url', label: 'URL logo', required: true },
        { name: 'website_url', label: 'Sito web' },
        { name: 'tier', label: 'Livello (es. main, gold, standard)' },
        { name: 'display_order', label: 'Ordine di visualizzazione', type: 'number' },
        { name: 'is_active', label: 'Visibile sul sito', type: 'checkbox' },
      ]}
      emptyItem={{ name: '', logo_url: '', website_url: '', tier: 'standard', display_order: 0, is_active: true }}
      transformSubmit={(v) => ({ ...v, display_order: Number(v.display_order || 0) })}
    />
  )
}
