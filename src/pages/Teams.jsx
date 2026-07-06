import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { Loading, EmptyState, ErrorState } from '../components/Feedback'

function PlayerCard({ player }) {
  return (
    <Link
      to={`/giocatrici/${player.id}`}
      className="group bg-white border-2 border-navy-dark/10 hover:border-amber rounded-xl p-4 flex items-center gap-4 transition-colors"
    >
      {player.photo_url ? (
        <img
          src={player.photo_url}
          alt={`${player.first_name} ${player.last_name}`}
          className="w-11 h-11 rounded-full object-cover object-top shrink-0"
        />
      ) : (
        <div className="scoreboard w-11 h-11 flex items-center justify-center rounded-full bg-navy-dark text-cream font-bold text-lg shrink-0">
          {player.jersey_number ?? '–'}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-body font-semibold text-navy-dark truncate">
          {player.first_name} {player.last_name}
        </p>
        <p className="text-xs text-navy-dark/50 uppercase tracking-wide">
          {player.photo_url && player.jersey_number != null && (
            <span className="scoreboard text-amber-dark mr-1.5">#{player.jersey_number}</span>
          )}
          {player.role || 'Atleta'}
        </p>
      </div>
      <span className="text-navy-dark/30 group-hover:text-amber-dark group-hover:translate-x-0.5 transition-all shrink-0" aria-hidden="true">
        →
      </span>
    </Link>
  )
}

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
        Ogni maglia ha un nome, ogni numero una storia. Apri la scheda di
        un'atleta per conoscerla meglio.
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
                {team.players.map((p) => <PlayerCard key={p.id} player={p} />)}
              </div>
            ) : (
              <p className="text-sm text-navy-dark/40 mt-6">
                Il roster è in via di definizione: i nomi arrivano con l'inizio della stagione.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
