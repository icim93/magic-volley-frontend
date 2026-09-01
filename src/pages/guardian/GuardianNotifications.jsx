import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import guardianApi from '../../lib/guardianApi'
import { Loading, ErrorState, EmptyState } from '../../components/Feedback'

// Report delle notifiche ricevute: una notifica push del sistema operativo
// sparisce non appena vista, quindi questa pagina è l'unico posto dove un
// genitore può ritrovarla in un secondo momento — funziona anche per chi
// non ha mai attivato le notifiche push (es. ricevute solo via email).
export default function GuardianNotifications() {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    guardianApi.get('/api/guardian-auth/notifications')
      .then((res) => setItems(res.data))
      .catch(() => setError(true))
    // Segna come lette non appena la pagina viene aperta: niente contatore
    // "non lette" da gestire a parte, basta lo stile diverso finché non si aggiorna.
    guardianApi.post('/api/guardian-auth/notifications/mark-read').catch(() => {})
  }, [])

  return (
    <div>
      <Link to="/area-riservata" className="text-sm text-navy-dark/60 hover:text-navy-dark font-semibold">
        ← Indietro
      </Link>

      <h1 className="font-display font-bold text-2xl text-navy-dark mt-3">Notifiche</h1>
      <p className="text-navy-dark/60 text-sm mt-1">Le notifiche ricevute, anche quelle già viste sul telefono.</p>

      <div className="mt-8 space-y-3">
        {error && <ErrorState message="Non riesco a caricare le notifiche. Riprova più tardi." />}
        {!items && !error && <Loading label="Carico le notifiche…" />}
        {items?.length === 0 && (
          <EmptyState title="Nessuna notifica ricevuta" description="Le notifiche che ricevi (news, risultati, promemoria, messaggi dalla società) compariranno qui." />
        )}

        {items?.map((n) => (
          <div
            key={n.id}
            className={`bg-white border-2 rounded-2xl p-5 ${n.read_at ? 'border-navy-dark/10' : 'border-amber/50'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="font-display font-semibold text-navy-dark">{n.title}</p>
              {!n.read_at && <span className="w-2 h-2 rounded-full bg-amber shrink-0 mt-1.5" />}
            </div>
            <p className="text-sm text-navy-dark/70 mt-1">{n.body}</p>
            <p className="text-xs text-navy-dark/40 mt-2">
              {new Date(n.created_at).toLocaleString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
            {n.url && (
              <Link to={n.url} className="inline-block mt-2 text-xs font-semibold text-amber-dark hover:text-amber">
                Vedi →
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
