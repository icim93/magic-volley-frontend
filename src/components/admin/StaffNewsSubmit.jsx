import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { slugify } from '../../lib/slugify'

const emptyForm = { title: '', slug: '', summary: '', content: '', cover_image_url: '', published: false }

const statusLabel = {
  pending: 'In attesa di approvazione',
  approved: 'Approvata',
  rejected: 'Rifiutata',
}
const statusColor = {
  pending: 'bg-navy-light/15 text-navy-light',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
}

// Vista per lo staff: non può pubblicare/modificare direttamente, propone e
// aspetta l'approvazione di admin/superadmin — vedi PendingNewsReview.jsx
// per il lato revisione.
export default function StaffNewsSubmit() {
  const [news, setNews] = useState(null)
  const [mine, setMine] = useState(null)
  const [form, setForm] = useState(null) // null = form chiuso
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formError, setFormError] = useState('')
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const load = () => {
    api.get('/api/news', { params: { published_only: false } }).then((res) => setNews(res.data)).catch(() => setError('Non riesco a caricare gli articoli esistenti.'))
    api.get('/api/news/revisions/mine').then((res) => setMine(res.data)).catch(() => {})
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setForm({ ...emptyForm }); setFormError(''); setDone(false) }
  const openEdit = (item) => {
    setForm({
      news_id: item.id,
      title: item.title, slug: item.slug, summary: item.summary || '',
      content: item.content, cover_image_url: item.cover_image_url || '', published: item.published,
    })
    setFormError('')
    setDone(false)
  }
  const closeForm = () => setForm(null)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleImageUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setFormError('')
    try {
      const data = new FormData()
      data.append('file', file)
      const { data: res } = await api.post('/api/uploads', data, { params: { folder: 'news' } })
      setForm((f) => ({ ...f, cover_image_url: res.url }))
    } catch {
      setFormError('Caricamento immagine non riuscito.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title) }
      await api.post('/api/news/revisions', payload)
      setDone(true)
      load()
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Invio della proposta non riuscito.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy-dark">News</h1>
          <p className="text-navy-dark/60 text-sm mt-1">
            Proponi un articolo nuovo o una modifica: un admin dovrà approvarla prima che diventi visibile.
          </p>
        </div>
        <button
          onClick={openNew}
          className="bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold text-sm px-5 py-2.5 rounded-full transition-colors shrink-0"
        >
          + Proponi nuova news
        </button>
      </div>

      {error && <p className="text-amber-dark text-sm font-medium mb-4">{error}</p>}

      <p className="font-display font-semibold text-navy-dark mb-3">Articoli esistenti</p>
      <div className="bg-white border-2 border-navy-dark/10 rounded-2xl overflow-hidden mb-8">
        {news === null ? (
          <p className="text-navy-dark/50 text-sm p-6">Caricamento…</p>
        ) : news.length === 0 ? (
          <p className="text-navy-dark/50 text-sm p-6">Nessun articolo presente ancora.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {news.map((item) => (
                <tr key={item.id} className="border-t border-navy-dark/5 first:border-t-0">
                  <td className="px-5 py-3 text-navy-dark">{item.title}</td>
                  <td className="px-5 py-3 text-navy-dark/50 text-xs">{item.published ? 'Pubblicato' : 'Bozza'}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => openEdit(item)} className="text-navy-light hover:text-navy-dark font-semibold text-sm">
                      Proponi modifica
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="font-display font-semibold text-navy-dark mb-3">Le tue proposte</p>
      <div className="bg-white border-2 border-navy-dark/10 rounded-2xl overflow-hidden">
        {mine === null ? (
          <p className="text-navy-dark/50 text-sm p-6">Caricamento…</p>
        ) : mine.length === 0 ? (
          <p className="text-navy-dark/50 text-sm p-6">Non hai ancora proposto nessuna news.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {mine.map((r) => (
                <tr key={r.id} className="border-t border-navy-dark/5 first:border-t-0">
                  <td className="px-5 py-3 text-navy-dark">
                    {r.title}
                    {r.news_id && <span className="text-navy-dark/40 text-xs ml-2">(modifica)</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[r.status]}`}>
                      {statusLabel[r.status]}
                    </span>
                    {r.status === 'rejected' && r.reject_reason && (
                      <p className="text-xs text-navy-dark/50 mt-1">Motivo: {r.reject_reason}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 bg-navy-dark/40 flex items-center justify-center p-5 z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-cream rounded-2xl p-7 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            {done ? (
              <div>
                <h2 className="font-display font-bold text-lg text-navy-dark mb-2">Proposta inviata ✓</h2>
                <p className="text-sm text-navy-dark/70">
                  Un admin la vedrà nella coda di approvazione. La trovi anche in "Le tue proposte" qui sotto.
                </p>
                <button
                  onClick={closeForm}
                  className="mt-6 bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  Chiudi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <h2 className="font-display font-bold text-lg text-navy-dark">
                    {form.news_id ? 'Proponi modifica' : 'Proponi nuova news'}
                  </h2>
                  <button type="button" onClick={closeForm} aria-label="Chiudi" className="text-navy-dark/40 hover:text-navy-dark shrink-0">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-semibold text-navy-dark">Titolo *</span>
                    <input required value={form.title} onChange={update('title')} className="input mt-1.5" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-navy-dark">Slug (URL)</span>
                    <input value={form.slug} onChange={update('slug')} placeholder="lasciare vuoto per generarlo dal titolo" className="input mt-1.5" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-navy-dark">Riassunto breve</span>
                    <input value={form.summary} onChange={update('summary')} className="input mt-1.5" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-navy-dark">Contenuto completo *</span>
                    <textarea required rows={6} value={form.content} onChange={update('content')} className="input mt-1.5" />
                  </label>
                  <label className="block">
                    <span className="text-sm font-semibold text-navy-dark">Immagine di copertina</span>
                    <div className="mt-1.5 space-y-2">
                      {form.cover_image_url && (
                        <img src={form.cover_image_url} alt="" className="h-20 w-auto rounded-lg border-2 border-navy-dark/10 object-cover" />
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => handleImageUpload(e.target.files?.[0])}
                        className="text-sm text-navy-dark/70"
                      />
                      {uploading && <p className="text-xs text-navy-dark/50">Caricamento…</p>}
                    </div>
                  </label>
                  <label className="flex items-center gap-2.5">
                    <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="w-5 h-5 accent-amber" />
                    <span className="text-sm font-semibold text-navy-dark">Da pubblicare subito, una volta approvata</span>
                  </label>
                </div>

                {formError && <p className="text-amber-dark text-sm font-medium mt-4">{formError}</p>}

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark font-display font-semibold px-5 py-2.5 rounded-full transition-colors"
                  >
                    {saving ? 'Invio…' : 'Invia proposta'}
                  </button>
                  <button type="button" onClick={closeForm} className="text-navy-dark/60 hover:text-navy-dark font-semibold px-3">
                    Annulla
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
