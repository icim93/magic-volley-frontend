import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Loading, EmptyState, ErrorState } from '../components/Feedback'

export default function Teams() {
  const [teams, setTeams] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.get('/api/teams')
      .then((res) => setTeams(res.data))
      .catch(() => setError(true))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-4xl text-navy-dark">Le squadre</h1>
      <p className="text-navy-dark/60 mt-3 max-w-xl">
        Il roster completo di ogni categoria, aggiornato stagione per stagione.
      </p>

      <div className="mt-12 space-y-14">
        {error && <ErrorState />}
        {!teams && !error && <Loading label="Carico le squadre…" />}
        {teams && teams.length === 0 && (
          <EmptyState title="Nessuna squadra pubblicata" description="Le squadre appariranno qui non appena inserite nel pannello." />
        )}

        {teams?.map((team) => (
          <div key={team.id}>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="font-display font-bold text-2xl text-navy-dark">{team.name}</h2>
              <span className="font-mono text-xs uppercase tracking-widest text-amber-dark bg-amber/15 px-2.5 py-1 rounded-full">
                {team.category} · {team.season}
              </span>
            </div>
            {team.description && <p className="text-navy-dark/60 mt-2 max-w-xl">{team.description}</p>}

            {team.players?.length > 0 ? (
              <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {team.players.map((p) => (
                  <div key={p.id} className="bg-white border-2 border-navy-dark/10 rounded-xl p-4 flex items-center gap-4">
                    <div className="scoreboard w-11 h-11 flex items-center justify-center rounded-full bg-navy-dark text-cream font-bold text-lg shrink-0">
                      {p.jersey_number ?? '–'}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-navy-dark">{p.first_name} {p.last_name}</p>
                      {p.role && <p className="text-xs text-navy-dark/50 uppercase tracking-wide">{p.role}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-navy-dark/40 mt-6">Roster in aggiornamento.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
