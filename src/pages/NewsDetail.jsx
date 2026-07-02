import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../lib/api'
import { Loading, ErrorState } from '../components/Feedback'

export default function NewsDetail() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setItem(null)
    api.get(`/api/news/${slug}`)
      .then((res) => setItem(res.data))
      .catch(() => setError(true))
  }, [slug])

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16">
        <ErrorState message="Questo articolo non esiste o non è più disponibile." />
        <Link to="/news" className="inline-block mt-6 text-amber-dark font-semibold text-sm">← Torna alle news</Link>
      </div>
    )
  }

  if (!item) return <Loading label="Carico l'articolo…" />

  return (
    <article className="max-w-2xl mx-auto px-5 py-16">
      <Link to="/news" className="text-amber-dark font-semibold text-sm">← Tutte le news</Link>

      <p className="font-mono text-xs text-navy-light mt-6">
        {item.published_at &&
          new Date(item.published_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      <h1 className="font-display font-bold text-3xl md:text-4xl text-navy-dark mt-2">{item.title}</h1>

      {item.cover_image_url && (
        <img src={item.cover_image_url} alt="" className="w-full rounded-2xl mt-8 aspect-[16/9] object-cover" />
      )}

      <div className="prose prose-navy mt-8 font-body text-navy-dark/80 leading-relaxed whitespace-pre-wrap">
        {item.content}
      </div>
    </article>
  )
}
