import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { TrajectoryDivider } from '../components/Feedback'

export default function Home() {
  const [nextMatch, setNextMatch] = useState(null)
  const [news, setNews] = useState([])
  const [teams, setTeams] = useState([])

  useEffect(() => {
    api.get('/api/matches', { params: { upcoming_only: true } })
      .then((res) => setNextMatch(res.data[0] || null))
      .catch(() => {})

    api.get('/api/news', { params: { published_only: true } })
      .then((res) => setNews(res.data.slice(0, 3)))
      .catch(() => {})

    api.get('/api/teams')
      .then((res) => setTeams(res.data))
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-dark text-cream">
        {/* Arco decorativo che richiama la traiettoria della schiacciata */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
          viewBox="0 0 1200 700"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M -50 600 Q 400 100 1250 250" stroke="#5B85C9" strokeWidth="3" fill="none" className="arc-line" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-5 pt-20 pb-24 md:pt-28 md:pb-32">
          <div className="flex items-end gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-navy-light" />
            <span className="w-5 h-5 rounded-full bg-amber" />
            <span className="w-7 h-7 rounded-full bg-amber-dark" />
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl md:text-7xl leading-[1.05] max-w-3xl">
            Magic Volley<br />
            <span className="text-amber">Adelfia</span>
          </h1>
          <p className="mt-6 max-w-lg text-cream/80 text-lg font-body">
            Squadre 2ª Divisione, U16 e U18. Passione, disciplina e schiacciate
            che si allenano ogni settimana ad Adelfia.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/iscriviti"
              className="bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Iscriviti alla società
            </Link>
            <Link
              to="/squadre"
              className="border-2 border-cream/30 hover:border-amber text-cream font-display font-semibold px-7 py-3.5 rounded-full transition-colors"
            >
              Scopri le squadre
            </Link>
          </div>
        </div>
      </section>

      {/* PROSSIMA PARTITA */}
      <section className="max-w-6xl mx-auto px-5 -mt-10 relative z-10">
        <div className="bg-cream border-2 border-navy-dark/10 rounded-2xl shadow-lg shadow-navy-dark/5 p-6 md:p-8">
          <p className="font-display text-xs uppercase tracking-widest text-amber-dark mb-3">
            Prossima partita
          </p>
          {nextMatch ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="scoreboard text-xl md:text-2xl text-navy-dark">
                {nextMatch.home_team_name} <span className="text-navy-light">vs</span> {nextMatch.away_team_name}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-navy-dark/70 font-body">
                <span>
                  {new Date(nextMatch.match_date).toLocaleDateString('it-IT', {
                    weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                {nextMatch.location && <span>{nextMatch.location}</span>}
              </div>
            </div>
          ) : (
            <p className="text-navy-dark/60 font-body text-sm">
              Nessuna partita in calendario al momento — torna a trovarci presto.
            </p>
          )}
        </div>
      </section>

      <TrajectoryDivider className="my-20" />

      {/* SQUADRE */}
      <section className="max-w-6xl mx-auto px-5">
        <h2 className="font-display font-bold text-3xl text-navy-dark text-center">Le nostre squadre</h2>
        <p className="text-center text-navy-dark/60 mt-3 max-w-md mx-auto">
          Tre categorie, un'unica maglia. Ogni squadra ha la sua storia e il suo roster.
        </p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {teams.slice(0, 3).map((team) => (
            <Link
              key={team.id}
              to="/squadre"
              className="group bg-white rounded-2xl border-2 border-navy-dark/10 p-6 hover:border-amber transition-colors"
            >
              <p className="font-display text-xs uppercase tracking-widest text-navy-light">{team.category}</p>
              <p className="font-display font-bold text-xl text-navy-dark mt-2">{team.name}</p>
              <p className="text-sm text-navy-dark/60 mt-2">{team.players?.length || 0} giocatrici in rosa</p>
              <span className="inline-block mt-4 text-sm font-semibold text-amber-dark group-hover:translate-x-1 transition-transform">
                Vedi roster →
              </span>
            </Link>
          ))}
          {teams.length === 0 && (
            <p className="text-navy-dark/50 text-sm col-span-full text-center py-10">
              Le squadre verranno mostrate qui non appena saranno inserite nel pannello gestionale.
            </p>
          )}
        </div>
      </section>

      <TrajectoryDivider className="my-20" />

      {/* NEWS */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display font-bold text-3xl text-navy-dark">Ultime news</h2>
          <Link to="/news" className="text-sm font-semibold text-amber-dark hover:text-amber transition-colors">
            Tutte le news →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {news.map((item) => (
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
              <div className="p-5">
                <p className="font-display font-semibold text-navy-dark group-hover:text-amber-dark transition-colors">
                  {item.title}
                </p>
                {item.summary && (
                  <p className="text-sm text-navy-dark/60 mt-2 line-clamp-2">{item.summary}</p>
                )}
              </div>
            </Link>
          ))}
          {news.length === 0 && (
            <p className="text-navy-dark/50 text-sm col-span-full text-center py-10">
              Nessuna news pubblicata ancora.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
