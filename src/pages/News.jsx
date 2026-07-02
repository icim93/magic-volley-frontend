import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { Loading, EmptyState, ErrorState } from '../components/Feedback'

export default function News() {
  const [news, setNews] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get('/api/news', { params: { published_only: true } })
      .then((res) => setNews(res.data))
      .catch(() => setError(true))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-4xl text-navy-dark">News</h1>
      <p className="text-navy-dark/60 mt-3">Tutte le novità della società.</p>

      <div className="mt-12 grid md:grid-cols-2 gap-6">
        {error && <ErrorState />}
        {!news && !error && <Loading label="Carico le news…" />}
        {news?.length === 0 && <EmptyState title="Nessuna news pubblicata ancora" />}

        {news?.map((item) => (
          <Link
            key={item.id}
            to={`/news/${item.slug}`}
            className="group rounded-2xl overflow-hidden border-2 border-navy-dark/10 hover:border-amber transition-colors bg-white"
          >
            {item.cover_image_url && (
              <div className="aspect-[16/9] overflow-hidden bg-navy-light/10">
                <img src={item.cover_image_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6">
              <p className="font-mono text-xs text-navy-light">
                {item.published_at &&
                  new Date(item.published_at).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="font-display font-semibold text-lg text-navy-dark mt-2 group-hover:text-amber-dark transition-colors">
                {item.title}
              </p>
              {item.summary && <p className="text-sm text-navy-dark/60 mt-2 line-clamp-3">{item.summary}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
