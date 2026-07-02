import { useEffect, useState } from 'react'
import api from '../lib/api'
import { Loading, EmptyState, ErrorState } from '../components/Feedback'

const statusLabel = {
  scheduled: 'In programma',
  played: 'Giocata',
  postponed: 'Rinviata',
  cancelled: 'Annullata',
}

function MatchRow({ match }) {
  const date = new Date(match.match_date)
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 bg-white border-2 border-navy-dark/10 rounded-xl p-5">
      <div className="scoreboard text-center sm:w-20 shrink-0">
        <p className="text-xs uppercase text-navy-light">{date.toLocaleDateString('it-IT', { month: 'short' })}</p>
        <p className="text-2xl font-bold text-navy-dark">{date.toLocaleDateString('it-IT', { day: '2-digit' })}</p>
      </div>

      <div className="flex-1">
        <p className="font-body font-semibold text-navy-dark">
          {match.home_team_name} <span className="text-navy-light">vs</span> {match.away_team_name}
        </p>
        <p className="text-xs text-navy-dark/50 mt-1">
          {date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
          {match.location && ` · ${match.location}`}
        </p>
      </div>

      {match.status === 'played' && match.home_sets != null ? (
        <div className="scoreboard text-lg font-bold text-navy-dark bg-amber/15 px-4 py-1.5 rounded-full">
          {match.home_sets} – {match.away_sets}
        </div>
      ) : (
        <span className="text-xs font-semibold uppercase tracking-wide text-navy-light">
          {statusLabel[match.status] || match.status}
        </span>
      )}
    </div>
  )
}

export default function Calendar() {
  const [tab, setTab] = useState('upcoming')
  const [matches, setMatches] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    setMatches(null)
    const request =
      tab === 'upcoming'
        ? api.get('/api/matches', { params: { upcoming_only: true } })
        : api.get('/api/matches/results')

    request.then((res) => setMatches(res.data)).catch(() => setError(true))
  }, [tab])

  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-4xl text-navy-dark">Calendario &amp; Risultati</h1>

      <div className="flex gap-2 mt-8 border-b-2 border-navy-dark/10">
        {[
          { key: 'upcoming', label: 'Prossime partite' },
          { key: 'results', label: 'Risultati' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-3 font-display font-semibold text-sm -mb-0.5 border-b-2 transition-colors ${
              tab === t.key ? 'border-amber text-amber-dark' : 'border-transparent text-navy-dark/50 hover:text-navy-dark'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {error && <ErrorState />}
        {!matches && !error && <Loading label="Carico il calendario…" />}
        {matches?.length === 0 && (
          <EmptyState
            title={tab === 'upcoming' ? 'Nessuna partita in programma' : 'Nessun risultato disponibile'}
            description="Il calendario viene aggiornato dallo staff nel pannello gestionale."
          />
        )}
        {matches?.map((m) => <MatchRow key={m.id} match={m} />)}
      </div>
    </div>
  )
}
