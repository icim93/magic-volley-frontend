import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Loading, EmptyState, ErrorState } from '../components/Feedback'

export default function Sponsors() {
  const [sponsors, setSponsors] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get('/api/sponsors')
      .then((res) => setSponsors(res.data))
      .catch(() => setError(true))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-4xl text-navy-dark">I nostri sponsor</h1>
      <p className="text-navy-dark/60 mt-3 max-w-xl">
        Grazie a chi sostiene la società e rende possibile ogni stagione.
      </p>

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {error && <ErrorState />}
        {!sponsors && !error && <Loading label="Carico gli sponsor…" />}
        {sponsors?.length === 0 && <EmptyState title="Nessuno sponsor pubblicato ancora" />}

        {sponsors?.map((s) => (
          <a
            key={s.id}
            href={s.website_url || undefined}
            target={s.website_url ? '_blank' : undefined}
            rel="noreferrer"
            className="bg-white border-2 border-navy-dark/10 hover:border-amber rounded-xl p-6 flex items-center justify-center aspect-square transition-colors"
          >
            <img src={s.logo_url} alt={s.name} className="max-h-full max-w-full object-contain" />
          </a>
        ))}
      </div>

      <div className="mt-16 bg-navy-dark text-cream rounded-2xl p-8 md:p-10 text-center">
        <h2 className="font-display font-bold text-2xl">Vuoi diventare sponsor?</h2>
        <p className="text-cream/70 mt-2 max-w-md mx-auto">
          Scrivici per scoprire come il tuo brand può crescere insieme alla nostra società.
        </p>
        <a
          href="mailto:info@magicvolleyadelfia.it"
          className="inline-block mt-6 bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold px-6 py-3 rounded-full transition-colors"
        >
          Contattaci
        </a>
      </div>
    </div>
  )
}
