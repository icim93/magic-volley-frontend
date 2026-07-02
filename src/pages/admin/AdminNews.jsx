import EntityManager from '../../components/admin/EntityManager'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminNews() {
  return (
    <EntityManager
      title="News"
      description="Articoli e comunicati pubblicati sul sito."
      endpoint="/api/news"
      listParams={{ published_only: false }}
      columns={[
        { key: 'title', label: 'Titolo' },
        { key: 'published', label: 'Pubblicato', render: (i) => (i.published ? 'Sì' : 'Bozza') },
        { key: 'created_at', label: 'Creato il', render: (i) => new Date(i.created_at).toLocaleDateString('it-IT') },
      ]}
      fields={[
        { name: 'title', label: 'Titolo', required: true },
        { name: 'slug', label: 'Slug (URL, es. "torneo-primavera")', required: true },
        { name: 'summary', label: 'Riassunto breve' },
        { name: 'content', label: 'Contenuto completo', type: 'textarea', required: true },
        { name: 'cover_image_url', label: 'URL immagine di copertina' },
        { name: 'published', label: 'Pubblicato (visibile sul sito)', type: 'checkbox' },
      ]}
      emptyItem={{ title: '', slug: '', summary: '', content: '', cover_image_url: '', published: false }}
      transformSubmit={(v) => ({ ...v, slug: v.slug || slugify(v.title) })}
    />
  )
}
