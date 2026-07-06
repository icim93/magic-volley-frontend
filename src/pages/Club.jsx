import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { Loading, TrajectoryDivider } from '../components/Feedback'

const VALUES = [
  {
    title: 'Crescita, prima del risultato',
    text: 'Il punteggio racconta una serata, il percorso racconta una persona. Lavoriamo perché ogni atleta esca dalla palestra migliore di come è entrata — in campo e fuori.',
  },
  {
    title: 'Una palestra che è casa',
    text: 'Chi entra da noi trova un posto dove essere presa sul serio: negli allenamenti, nelle difficoltà, nelle ambizioni. Le famiglie sono parte del progetto, non spettatrici.',
  },
  {
    title: 'Ambizione senza scorciatoie',
    text: 'Vogliamo competere e vincere, ma alle nostre condizioni: preparazione seria, rispetto per le avversarie e nessun successo costruito sulle spalle di una ragazza di quindici anni.',
  },
]

// Raggruppa lo staff in aree dell'organigramma in base al ruolo dichiarato.
function classifyStaff(member) {
  const role = (member.role || '').toLowerCase()
  if (/(president|vice.?president|dirigent|segret|direttor|consiglier|tesorier)/.test(role)) return 'Dirigenza'
  if (/(allenator|coach|scoutman|prepar|assistent|team manager)/.test(role)) return 'Staff tecnico'
  if (/(fisio|medic|osteopat|nutriz)/.test(role)) return 'Area sanitaria'
  return 'Collaboratori'
}

const AREA_ORDER = ['Dirigenza', 'Staff tecnico', 'Area sanitaria', 'Collaboratori']

function StaffCard({ member }) {
  const initials = `${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`.toUpperCase()
  return (
    <div className="bg-white border-2 border-navy-dark/10 rounded-2xl overflow-hidden flex flex-col">
      <div className="aspect-[4/3] bg-navy-dark/5 flex items-center justify-center overflow-hidden">
        {member.photo_url ? (
          <img
            src={member.photo_url}
            alt={`${member.first_name} ${member.last_name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-display font-bold text-5xl text-navy-light/40">{initials}</span>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <p className="font-display text-xs uppercase tracking-widest text-amber-dark">{member.role}</p>
        <p className="font-display font-bold text-lg text-navy-dark mt-1">
          {member.first_name} {member.last_name}
        </p>
        {member.bio && <p className="text-sm text-navy-dark/60 mt-2 flex-1">{member.bio}</p>}
        {member.teams?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {member.teams.map((t) => (
              <span key={t.id} className="text-[11px] font-semibold uppercase tracking-wide bg-navy-dark/5 text-navy-dark/70 px-2 py-0.5 rounded-full">
                {t.category}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Club() {
  const [staff, setStaff] = useState(null)
  const [teams, setTeams] = useState([])

  useEffect(() => {
    api.get('/api/staff')
      .then((res) => setStaff(res.data))
      .catch(() => setStaff([]))

    api.get('/api/teams')
      .then((res) => setTeams(res.data))
      .catch(() => {})
  }, [])

  const playerCount = teams.reduce((sum, t) => sum + (t.players?.length || 0), 0)

  const grouped = AREA_ORDER
    .map((area) => ({
      area,
      members: (staff || []).filter((m) => classifyStaff(m) === area),
    }))
    .filter((g) => g.members.length > 0)

  return (
    <div>
      {/* Intestazione */}
      <section className="bg-navy-dark text-cream">
        <div className="max-w-6xl mx-auto px-5 py-16 md:py-20">
          <p className="font-display text-xs uppercase tracking-widest text-amber mb-4">La società</p>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl leading-tight max-w-2xl">
            Magic Volley Adelfia ASD
          </h1>
          <p className="mt-5 text-cream/80 text-lg max-w-2xl">
            Un'associazione sportiva dilettantistica nata per dare alle ragazze di Adelfia
            un posto dove la pallavolo si impara facendola bene: tecnica curata, gruppi seri,
            adulti che ci mettono la faccia.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-6xl mx-auto px-5 py-16 md:py-20">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10 items-start">
          <div>
            <h2 className="font-display font-bold text-3xl text-navy-dark">La nostra missione</h2>
            <img
              src="/monogramma.png"
              alt="Monogramma MVA"
              className="w-44 md:w-56 mt-6"
            />
          </div>
          <div className="space-y-4 text-navy-dark/75 leading-relaxed">
            <p>
              Crediamo che una società di pallavolo giovanile abbia un compito solo in apparenza semplice:
              prendere una ragazza che ama questo sport e restituirle, anno dopo anno, una versione
              più forte di sé. Più tecnica, più consapevole, più capace di stare in un gruppo che
              pretende e sostiene allo stesso tempo.
            </p>
            <p>
              Per questo ogni scelta — dagli allenatori che ingaggiamo alle ore di palestra che
              programmiamo — risponde alla stessa domanda: <em>fa crescere le nostre atlete?</em> Se
              la risposta è sì, si fa. La 2ª Divisione è il punto d'arrivo naturale di questo percorso:
              una prima squadra costruita in casa, con le ragazze cresciute nei nostri campionati giovanili.
            </p>
          </div>
        </div>

        {/* Valori */}
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-white border-2 border-navy-dark/10 rounded-2xl p-6">
              <p className="font-display font-bold text-lg text-navy-dark">{v.title}</p>
              <p className="text-sm text-navy-dark/60 mt-3 leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>

        {/* Numeri */}
        <div className="mt-14 bg-navy-dark text-cream rounded-2xl p-8 md:p-10 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="scoreboard font-bold text-4xl md:text-5xl text-amber">{teams.length || '3'}</p>
            <p className="text-xs uppercase tracking-widest text-cream/60 mt-2">Squadre in campo</p>
          </div>
          <div>
            <p className="scoreboard font-bold text-4xl md:text-5xl text-amber">{playerCount || '—'}</p>
            <p className="text-xs uppercase tracking-widest text-cream/60 mt-2">Atlete tesserate</p>
          </div>
          <div>
            <p className="scoreboard font-bold text-4xl md:text-5xl text-amber">1</p>
            <p className="text-xs uppercase tracking-widest text-cream/60 mt-2">Maglia, per tutte</p>
          </div>
        </div>
      </section>

      <TrajectoryDivider className="mb-16" />

      {/* Organigramma e staff */}
      <section className="max-w-6xl mx-auto px-5 pb-24">
        <h2 className="font-display font-bold text-3xl text-navy-dark">Organigramma</h2>
        <p className="text-navy-dark/60 mt-3 max-w-xl">
          Le persone che tengono in piedi la società, dal campo alla scrivania.
          Perché dietro ogni allenamento che inizia puntuale c'è qualcuno che ha aperto la palestra.
        </p>

        {staff === null && <Loading label="Carico lo staff…" />}

        {staff !== null && grouped.length === 0 && (
          <p className="text-navy-dark/50 text-sm mt-10">
            L'organigramma completo sarà pubblicato a breve.
          </p>
        )}

        <div className="mt-10 space-y-14">
          {grouped.map(({ area, members }) => (
            <div key={area}>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="font-display font-bold text-xl text-navy-dark shrink-0">{area}</h3>
                <div className="h-0.5 flex-1 bg-navy-dark/10 rounded-full" />
                <span className="scoreboard text-sm text-navy-dark/40 shrink-0">{members.length}</span>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {members.map((m) => <StaffCard key={m.id} member={m} />)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-navy-dark/60">Vuoi far parte del progetto?</p>
          <Link
            to="/iscriviti"
            className="inline-block mt-4 bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold px-7 py-3.5 rounded-full transition-colors"
          >
            Iscriviti alla società
          </Link>
        </div>
      </section>
    </div>
  )
}
