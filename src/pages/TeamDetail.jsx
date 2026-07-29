import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'
import { Loading, ErrorState } from '../components/Feedback'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

function PlayerPhotoCard({ player }) {
  return (
    <Link
      to={`/giocatrici/${player.id}`}
      className="group bg-white rounded-2xl overflow-hidden border-2 border-navy-dark/10 hover:border-amber transition-colors flex flex-col"
    >
      <div className="aspect-[3/4] bg-navy-dark/5 overflow-hidden relative">
        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={`${player.first_name} ${player.last_name}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-navy-dark">
            <span className="scoreboard font-bold text-6xl text-cream/20">
              {player.jersey_number ?? '–'}
            </span>
          </div>
        )}
        {player.jersey_number != null && (
          <span className="scoreboard absolute top-2 right-2 bg-amber text-navy-dark text-xs font-bold px-2 py-1 rounded-full">
            #{player.jersey_number}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="font-body font-semibold text-navy-dark group-hover:text-amber-dark transition-colors truncate">
          {player.first_name} {player.last_name}
        </p>
        <p className="text-xs text-navy-dark/50 uppercase tracking-wide mt-0.5">
          {player.role || 'Atleta'}
        </p>
      </div>
    </Link>
  )
}

export default function TeamDetail() {
  const { id } = useParams()
  const [team, setTeam] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setTeam(null)
    setError(false)
    api.get(`/api/teams/${id}`)
      .then((res) => setTeam(res.data))
      .catch(() => setError(true))
  }, [id])

  useDocumentMeta({
    title: team?.name,
    description: team
      ? `Roster e informazioni della squadra ${team.name} (${team.category}) di Magic Volley Adelfia ASD.`
      : undefined,
    image: team?.photo_url,
    path: `/squadre/${id}`,
  })

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <ErrorState message="Questa squadra non esiste o non è più disponibile." />
        <Link to="/squadre" className="inline-block mt-6 text-amber-dark font-semibold text-sm">
          ← Torna alle squadre
        </Link>
      </div>
    )
  }

  if (!team) return <Loading label="Carico la squadra…" />

  return (
    <div>
      <section className="bg-navy-dark text-cream">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-14 md:pb-20">
          <Link to="/squadre" className="text-cream/60 hover:text-amber text-sm transition-colors">
            ← Tutte le squadre
          </Link>

          <div className="mt-6 grid md:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <p className="font-display text-xs uppercase tracking-widest text-amber">
                {team.category} · {team.season}
              </p>
              <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight mt-2">
                {team.name}
              </h1>
              {team.description && (
                <p className="mt-4 max-w-xl text-cream/75">{team.description}</p>
              )}
              <p className="text-sm text-cream/50 mt-4">{team.players?.length || 0} atlete in rosa</p>
            </div>

            {team.photo_url && (
              <img
                src={team.photo_url}
                alt={team.name}
                className="w-full md:w-72 max-h-64 object-cover rounded-2xl justify-self-center md:justify-self-end"
              />
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        {team.players?.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {team.players.map((p) => <PlayerPhotoCard key={p.id} player={p} />)}
          </div>
        ) : (
          <p className="text-sm text-navy-dark/40 text-center py-16">
            Il roster è in via di definizione: i nomi arrivano con l'inizio della stagione.
          </p>
        )}
      </section>
    </div>
  )
}
