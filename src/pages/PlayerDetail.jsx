import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../lib/api'
import { Loading, ErrorState } from '../components/Feedback'

function computeAge(birthDate) {
  const birth = new Date(birthDate)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  if (beforeBirthday) age -= 1
  return age
}

function StatBox({ label, value }) {
  return (
    <div className="bg-white border-2 border-navy-dark/10 rounded-xl px-5 py-4">
      <p className="text-[11px] uppercase tracking-widest text-navy-dark/50">{label}</p>
      <p className="scoreboard font-bold text-xl text-navy-dark mt-1">{value}</p>
    </div>
  )
}

export default function PlayerDetail() {
  const { id } = useParams()
  const [player, setPlayer] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setPlayer(null)
    setError(false)
    api.get(`/api/players/${id}`)
      .then((res) => setPlayer(res.data))
      .catch(() => setError(true))
  }, [id])

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24">
        <ErrorState message="Questa scheda non esiste o non è più disponibile." />
        <div className="text-center mt-8">
          <Link to="/squadre" className="text-amber-dark font-semibold hover:text-amber transition-colors">
            ← Torna alle squadre
          </Link>
        </div>
      </div>
    )
  }

  if (!player) return <Loading label="Carico la scheda…" />

  const age = player.birth_date ? computeAge(player.birth_date) : null

  return (
    <div>
      {/* Testata scheda, stile "match program" */}
      <section className="bg-navy-dark text-cream overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 pt-10 pb-0 md:pt-14">
          <Link to="/squadre" className="text-cream/60 hover:text-amber text-sm transition-colors">
            ← Tutte le squadre
          </Link>

          <div className="mt-8 grid md:grid-cols-[1fr_auto] gap-8 items-end">
            <div className="pb-10 md:pb-14">
              <p className="font-display text-xs uppercase tracking-widest text-amber">
                {player.team?.name} · {player.team?.category}
              </p>
              <div className="flex items-start gap-5 mt-4">
                <span className="scoreboard font-bold text-6xl md:text-8xl text-cream/15 leading-none select-none">
                  {player.jersey_number ?? '–'}
                </span>
                <div>
                  <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.02]">
                    {player.first_name}<br />{player.last_name}
                  </h1>
                  {player.role && (
                    <p className="inline-block mt-4 bg-amber text-navy-dark font-display font-semibold text-sm uppercase tracking-wide px-4 py-1.5 rounded-full">
                      {player.role}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {player.photo_url && (
              <img
                src={player.photo_url}
                alt={`${player.first_name} ${player.last_name}`}
                className="w-56 md:w-72 max-h-96 object-cover object-top rounded-t-2xl justify-self-center md:justify-self-end"
              />
            )}
          </div>
        </div>
      </section>

      {/* Dati e presentazione */}
      <section className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
          <StatBox label="Numero di maglia" value={player.jersey_number ?? '—'} />
          <StatBox label="Ruolo" value={player.role || '—'} />
          <StatBox label="Altezza" value={player.height_cm ? `${player.height_cm} cm` : '—'} />
          <StatBox label="Età" value={age !== null ? `${age} anni` : '—'} />
        </div>

        {player.bio && (
          <div className="mt-12 max-w-2xl">
            <h2 className="font-display font-bold text-2xl text-navy-dark">In campo e fuori</h2>
            <p className="text-navy-dark/70 leading-relaxed mt-4 whitespace-pre-line">{player.bio}</p>
          </div>
        )}

        {player.team && (
          <div className="mt-12">
            <Link
              to="/squadre"
              className="inline-block bg-navy-dark hover:bg-navy-light text-cream font-display font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Vedi il roster di {player.team.name}
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
