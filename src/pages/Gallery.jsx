import { useEffect, useState, useCallback } from 'react'
import api from '../lib/api'
import { Loading, EmptyState, ErrorState } from '../components/Feedback'

export default function Gallery() {
  const [photos, setPhotos] = useState(null)
  const [error, setError] = useState(false)
  const [category, setCategory] = useState(null) // null = tutte
  const [lightbox, setLightbox] = useState(null) // indice della foto aperta, null = chiuso

  useEffect(() => {
    api.get('/api/gallery')
      .then((res) => setPhotos(res.data))
      .catch(() => setError(true))
  }, [])

  const categories = [...new Set((photos || []).map((p) => p.category).filter(Boolean))]
  const visible = category ? photos.filter((p) => p.category === category) : (photos || [])

  const close = useCallback(() => setLightbox(null), [])
  const prev = useCallback(() => setLightbox((i) => (i > 0 ? i - 1 : visible.length - 1)), [visible.length])
  const next = useCallback(() => setLightbox((i) => (i < visible.length - 1 ? i + 1 : 0)), [visible.length])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, close, prev, next])

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-4xl text-navy-dark">Fotogallery</h1>
      <p className="text-navy-dark/60 mt-3 max-w-xl">
        Le partite viste da bordo campo, gli allenamenti che nessuno applaude
        e i momenti che una classifica non sa raccontare.
      </p>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8">
          <button
            onClick={() => setCategory(null)}
            className={`text-sm font-semibold px-4 py-1.5 rounded-full border-2 transition-colors ${
              category === null ? 'bg-navy-dark border-navy-dark text-cream' : 'border-navy-dark/15 text-navy-dark/70 hover:border-navy-dark/40'
            }`}
          >
            Tutte
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-sm font-semibold px-4 py-1.5 rounded-full border-2 transition-colors ${
                category === c ? 'bg-navy-dark border-navy-dark text-cream' : 'border-navy-dark/15 text-navy-dark/70 hover:border-navy-dark/40'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10">
        {error && <ErrorState />}
        {!photos && !error && <Loading label="Carico le foto…" />}
        {photos && photos.length === 0 && (
          <EmptyState
            title="La gallery è in allestimento"
            description="Le prime foto arriveranno con la prossima giornata di campionato."
          />
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visible.map((photo, idx) => (
            <button
              key={photo.id}
              onClick={() => setLightbox(idx)}
              className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-navy-dark/10 hover:border-amber transition-colors bg-navy-dark/5 text-left"
            >
              <img
                src={photo.image_url}
                alt={photo.caption || 'Foto Magic Volley Adelfia ASD'}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {photo.caption && (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-dark/80 to-transparent text-cream text-xs px-3 pt-8 pb-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {photo.caption}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && visible[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-navy-dark/95 flex flex-col items-center justify-center p-5"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Foto ingrandita"
        >
          <button
            onClick={close}
            className="absolute top-5 right-5 text-cream/70 hover:text-cream"
            aria-label="Chiudi"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute left-3 md:left-8 text-cream/60 hover:text-amber transition-colors"
            aria-label="Foto precedente"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <img
            src={visible[lightbox].image_url}
            alt={visible[lightbox].caption || ''}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[78vh] max-w-full rounded-xl object-contain"
          />
          <div className="mt-4 text-center" onClick={(e) => e.stopPropagation()}>
            {visible[lightbox].caption && (
              <p className="text-cream/90 text-sm max-w-xl">{visible[lightbox].caption}</p>
            )}
            <p className="scoreboard text-cream/40 text-xs mt-2">
              {lightbox + 1} / {visible.length}
            </p>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute right-3 md:right-8 text-cream/60 hover:text-amber transition-colors"
            aria-label="Foto successiva"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
