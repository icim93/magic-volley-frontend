import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

export default function AdminDocuments() {
  const { user } = useAuth()
  const canDelete = user?.role === 'admin' || user?.role === 'superadmin'

  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const load = () => {
    api.get('/api/documents')
      .then((res) => setItems(res.data))
      .catch(() => setError('Non riesco a caricare i documenti.'))
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post('/api/uploads', form, { params: { folder: 'documenti' } })
      await api.post('/api/documents', {
        title: title.trim() || file.name,
        category: category.trim() || null,
        file_url: data.url,
        file_name: file.name,
      })
      setTitle('')
      setCategory('')
      setFile(null)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Caricamento non riuscito. Controlla il formato e la dimensione del file (max 15MB).')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (doc) => {
    if (!window.confirm(`Eliminare "${doc.title}"? L'operazione non è reversibile.`)) return
    try {
      await api.delete(`/api/documents/${doc.id}`)
      load()
    } catch {
      setError('Non riesco a eliminare il documento.')
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy-dark">Documenti</h1>
          <p className="text-navy-dark/60 text-sm mt-1">
            Materiale condiviso dello staff: scout gara, file per gli allenatori e altro. Visibile solo a chi
            accede al pannello.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpload} className="bg-white border-2 border-navy-dark/10 rounded-2xl p-6 mb-8">
        <p className="font-display font-semibold text-navy-dark mb-4">Carica un nuovo documento</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-semibold text-navy-dark">Titolo</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Es. Scout Adelfia-Bari 12/10"
              className="input mt-1.5"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-navy-dark">Categoria</span>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Es. Scouting, Materiale allenatori"
              className="input mt-1.5"
            />
          </label>
        </div>
        <label className="block mt-4">
          <span className="text-sm font-semibold text-navy-dark">File (PDF, Word, Excel, immagine… max 15MB)</span>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1.5 text-sm text-navy-dark/70"
          />
        </label>

        {error && <p className="text-amber-dark text-sm font-medium mt-4">{error}</p>}

        <button
          type="submit"
          disabled={!file || uploading}
          className="mt-5 bg-amber hover:bg-amber-dark disabled:opacity-50 disabled:cursor-not-allowed text-navy-dark font-display font-semibold text-sm px-5 py-2.5 rounded-full transition-colors"
        >
          {uploading ? 'Caricamento…' : 'Carica documento'}
        </button>
      </form>

      <div className="bg-white border-2 border-navy-dark/10 rounded-2xl overflow-hidden">
        {items === null ? (
          <p className="text-navy-dark/50 text-sm p-6">Caricamento…</p>
        ) : items.length === 0 ? (
          <p className="text-navy-dark/50 text-sm p-6">Nessun documento caricato ancora.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-dark/5 text-left">
                <th className="px-5 py-3 font-display font-semibold text-navy-dark/70 text-xs uppercase tracking-wide">Titolo</th>
                <th className="px-5 py-3 font-display font-semibold text-navy-dark/70 text-xs uppercase tracking-wide">Categoria</th>
                <th className="px-5 py-3 font-display font-semibold text-navy-dark/70 text-xs uppercase tracking-wide">Caricato da</th>
                <th className="px-5 py-3 font-display font-semibold text-navy-dark/70 text-xs uppercase tracking-wide">Data</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((doc) => (
                <tr key={doc.id} className="border-t border-navy-dark/5">
                  <td className="px-5 py-3 text-navy-dark font-medium">{doc.title}</td>
                  <td className="px-5 py-3 text-navy-dark/70">{doc.category || '—'}</td>
                  <td className="px-5 py-3 text-navy-dark/70">{doc.uploaded_by?.full_name || '—'}</td>
                  <td className="px-5 py-3 text-navy-dark/50 text-xs">
                    {new Date(doc.created_at).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-navy-light hover:text-navy-dark font-semibold mr-4"
                    >
                      Scarica
                    </a>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(doc)}
                        className="text-amber-dark hover:text-red-600 font-semibold"
                      >
                        Elimina
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
