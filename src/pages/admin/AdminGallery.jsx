import EntityManager from '../../components/admin/EntityManager'

const LIST_PARAMS = { include_hidden: true }

export default function AdminGallery() {
  return (
    <EntityManager
      title="Fotogallery"
      description="Le foto mostrate nella gallery pubblica del sito, ordinabili e raggruppate per categoria."
      endpoint="/api/gallery"
      listParams={LIST_PARAMS}
      columns={[
        {
          key: 'image_url',
          label: 'Anteprima',
          render: (item) => (
            <img src={item.image_url} alt="" className="w-16 h-12 object-cover rounded-lg" />
          ),
        },
        { key: 'caption', label: 'Didascalia' },
        { key: 'category', label: 'Categoria' },
        { key: 'display_order', label: 'Ordine' },
        { key: 'is_active', label: 'Visibile', render: (item) => (item.is_active ? 'Sì' : 'No') },
      ]}
      fields={[
        { name: 'image_url', label: 'URL immagine', required: true },
        { name: 'caption', label: 'Didascalia' },
        { name: 'category', label: 'Categoria (es. Partite, Allenamenti, Eventi)' },
        { name: 'display_order', label: 'Ordine di visualizzazione', type: 'number' },
        { name: 'is_active', label: 'Visibile sul sito', type: 'checkbox' },
      ]}
      emptyItem={{ image_url: '', caption: '', category: '', display_order: 0, is_active: true }}
      transformSubmit={(v) => ({
        ...v,
        display_order: v.display_order !== null && v.display_order !== '' ? Number(v.display_order) : 0,
      })}
    />
  )
}
