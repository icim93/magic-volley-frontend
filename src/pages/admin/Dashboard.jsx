import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../lib/api'

const cards = [
  { key: 'teams', label: 'Squadre', endpoint: '/api/teams', to: '/admin/squadre' },
  { key: 'players', label: 'Giocatrici', endpoint: '/api/players', to: '/admin/giocatrici' },
  { key: 'matches', label: 'Partite (prossime)', endpoint: '/api/matches', params: { upcoming_only: true }, to: '/admin/partite' },
  { key: 'registrations', label: 'Iscrizioni da esaminare', endpoint: '/api/registrations', params: { status: 'pending' }, to: '/admin/iscrizioni' },
]

export default function Dashboard() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    cards.forEach((c) => {
      api.get(c.endpoint, { params: c.params }).then((res) => {
        setCounts((prev) => ({ ...prev, [c.key]: res.data.length }))
      }).catch(() => {})
    })
  }, [])

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-navy-dark">Panoramica</h1>
      <p className="text-navy-dark/60 text-sm mt-1">Situazione generale della società.</p>

      <div className="grid sm:grid-cols-2 gap-5 mt-8">
        {cards.map((c) => (
          <Link
            key={c.key}
            to={c.to}
            className="bg-white border-2 border-navy-dark/10 hover:border-amber rounded-2xl p-6 transition-colors"
          >
            <p className="scoreboard text-4xl font-bold text-navy-dark">
              {counts[c.key] ?? '—'}
            </p>
            <p className="text-sm text-navy-dark/60 mt-2">{c.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
