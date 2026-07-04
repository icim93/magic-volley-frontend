import { useEffect, useState } from 'react'
import guardianApi from '../../lib/guardianApi'
import { useGuardianAuth } from '../../context/GuardianAuthContext'
import { Loading, ErrorState } from '../../components/Feedback'

const statusLabel = {
  scheduled: 'In programma',
  played: 'Giocata',
  postponed: 'Rinviata',
  cancelled: 'Annullata',
}

export default function GuardianDashboard() {
  const { guardian: cachedGuardian } = useGuardianAuth()
  const [guardian, setGuardian] = useState(cachedGuardian)
  const [matches, setMatches] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    guardianApi.get('/api/guardian-auth/me').then((res) => setGuardian(res.data)).catch(() => setError(true))
    guardianApi.get('/api/guardian-auth/matches').then((res) => setMatches(res.data)).catch(() => setError(true))
  }, [])

  if (error) return <ErrorState message="Non riesco a caricare i tuoi dati. Riprova più tardi." />
  if (!guardian) return <Loading label="Carico i tuoi dati…" />

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy-dark">
        Ciao {guardian.first_name} 👋
      </h1>
      <p className="text-navy-dark/60 text-sm mt-1">Ecco la situazione delle tue figlie/i in società.</p>

      <div className="mt-8 space-y-4">
        {guardian.players.map((player) => (
          <div key={player.id} className="bg-white border-2 border-navy-dark/10 rounded-2xl p-6">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-display font-semibold text-lg text-navy-dark">
                  {player.first_name} {player.last_name}
                </p>
                <p className="text-sm text-navy-dark/60">
                  {player.team.name} · {player.team.category} · {player.team.season}
                </p>
              </div>
              {player.jersey_number != null && (
                <div className="scoreboard w-11 h-11 flex items-center justify-center rounded-full bg-navy-dark text-cream font-bold text-lg shrink-0">
                  {player.jersey_number}
                </div>
              )}
            </div>

            {/* Placeholder pagamenti: arriverà nella Fase 2 */}
            <div className="mt-4 bg-navy-light/10 rounded-xl p-3 text-xs text-navy-dark/60">
              Stato pagamenti quote — disponibile a breve in questa sezione.
            </div>
          </div>
        ))}

        {guardian.players.length === 0 && (
          <p className="text-navy-dark/50 text-sm">
            Nessuna giocatrice ancora collegata al tuo account. Contatta la società se pensi sia un errore.
          </p>
        )}
      </div>

      <h2 className="font-display font-bold text-xl text-navy-dark mt-10">Partite delle tue squadre</h2>
      <div className="mt-4 space-y-3">
        {matches === null && <Loading label="Carico il calendario…" />}
        {matches?.length === 0 && (
          <p className="text-navy-dark/50 text-sm">Nessuna partita disponibile al momento.</p>
        )}
        {matches?.map((m) => {
          const date = new Date(m.match_date)
          return (
            <div key={m.id} className="flex items-center gap-4 bg-white border-2 border-navy-dark/10 rounded-xl p-4">
              <div className="scoreboard text-center w-16 shrink-0">
                <p className="text-xs uppercase text-navy-light">{date.toLocaleDateString('it-IT', { month: 'short' })}</p>
                <p className="text-xl font-bold text-navy-dark">{date.toLocaleDateString('it-IT', { day: '2-digit' })}</p>
              </div>
              <div className="flex-1">
                <p className="font-body font-semibold text-sm text-navy-dark">
                  {m.home_team_name} <span className="text-navy-light">vs</span> {m.away_team_name}
                </p>
                <p className="text-xs text-navy-dark/50 mt-0.5">
                  {date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                  {m.location && ` · ${m.location}`}
                </p>
              </div>
              {m.status === 'played' && m.home_sets != null ? (
                <div className="scoreboard font-bold text-navy-dark bg-amber/15 px-3 py-1 rounded-full text-sm">
                  {m.home_sets} – {m.away_sets}
                </div>
              ) : (
                <span className="text-xs font-semibold uppercase text-navy-light">{statusLabel[m.status]}</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
