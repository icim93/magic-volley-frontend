import EntityManager from '../../components/admin/EntityManager'
import PendingNewsReview from '../../components/admin/PendingNewsReview'
import StaffNewsSubmit from '../../components/admin/StaffNewsSubmit'
import { useAuth } from '../../context/AuthContext'
import { slugify } from '../../lib/slugify'

export default function AdminNews() {
  const { user } = useAuth()

  // Lo staff non scrive mai direttamente: propone, e aspetta l'approvazione
  // di admin/superadmin (vedi StaffNewsSubmit / PendingNewsReview).
  if (user?.role === 'staff') {
    return <StaffNewsSubmit />
  }

  return (
    <div>
      <PendingNewsReview />
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
          { name: 'cover_image_url', label: 'Immagine di copertina', type: 'image' },
          { name: 'published', label: 'Pubblicato (visibile sul sito)', type: 'checkbox' },
        ]}
        emptyItem={{ title: '', slug: '', summary: '', content: '', cover_image_url: '', published: false }}
        transformSubmit={(v) => ({ ...v, slug: v.slug || slugify(v.title) })}
      />
    </div>
  )
}
