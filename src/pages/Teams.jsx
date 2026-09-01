import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { Loading, EmptyState, ErrorState } from '../components/Feedback'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function Teams() {
  const [teams, setTeams] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get('/api/teams')
      .then((res) => setTeams(res.data))
      .catch(() => setError(true))
  }, [])

  useDocumentMeta({
    title: 'Squadre',
    description: 'Le squadre di Magic Volley Adelfia Associazione Sportiva Dilettantistica: rose, categorie e schede delle atlete.',
    path: '/squadre',
  })

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-4xl text-navy-dark">Le squadre</h1>
      <p className="text-navy-dark/60 mt-3 max-w-xl">
        Un unico percorso, tre tappe. Apri la pagina di una squadra per vedere il roster completo.
      </p>

      <div className="mt-12 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {error && <ErrorState />}
        {!teams && !error && <Loading label="Carico le squadre…" />}
        {teams && teams.length === 0 && (
          <EmptyState title="Nessuna squadra pubblicata" description="Le squadre appariranno qui non appena inserite nel pannello." />
        )}

        {teams?.map((team) => (
          <Link
            key={team.id}
            to={`/squadre/${team.id}`}
            className="group bg-white rounded-2xl overflow-hidden border-2 border-navy-dark/10 hover:border-amber transition-colors flex flex-col"
          >
            {team.photo_url ? (
              <div className="aspect-[16/9] overflow-hidden bg-navy-light/10">
                <img
                  src={team.photo_url}
                  alt={team.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="aspect-[16/9] bg-navy-dark flex items-center justify-center">
                <span className="font-display font-bold text-2xl text-cream/20 uppercase tracking-widest">
                  {team.category}
                </span>
              </div>
            )}
            <div className="p-6">
              <p className="font-display text-xs uppercase tracking-widest text-navy-light">
                {team.category} · {team.season}
              </p>
              <p className="font-display font-bold text-xl text-navy-dark mt-2">{team.name}</p>
              <p className="text-sm text-navy-dark/60 mt-2">{team.players?.length || 0} atlete in rosa</p>
              <span className="inline-block mt-4 text-sm font-semibold text-amber-dark group-hover:translate-x-1 transition-transform">
                Vedi la squadra →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
