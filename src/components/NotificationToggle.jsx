import { useEffect, useState } from 'react'
import { isPushSupported, getPushSubscriptionStatus, subscribeToPush, unsubscribeFromPush } from '../lib/pushSubscription'

// Card riutilizzata sia nella Dashboard genitori (primo invito) sia nel
// Profilo (interruttore permanente). Non supportato = non renderizza nulla:
// su iOS Safari (fuori da un'installazione Home) l'API push non esiste
// proprio, meglio non mostrare un controllo che non può funzionare.
export default function NotificationToggle({ variant = 'card' }) {
  const [supported, setSupported] = useState(true)
  const [status, setStatus] = useState('checking') // checking | subscribed | unsubscribed | denied
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isPushSupported()) {
      setSupported(false)
      return
    }
    if (Notification.permission === 'denied') {
      setStatus('denied')
      return
    }
    getPushSubscriptionStatus().then(setStatus).catch(() => setStatus('unsubscribed'))
  }, [])

  const handleEnable = async () => {
    setBusy(true)
    setError('')
    try {
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission()
        if (permission !== 'granted') {
          setStatus(permission === 'denied' ? 'denied' : 'unsubscribed')
          return
        }
      }
      await subscribeToPush()
      setStatus('subscribed')
    } catch {
      setError('Non siamo riusciti ad attivare le notifiche. Riprova.')
    } finally {
      setBusy(false)
    }
  }

  const handleDisable = async () => {
    setBusy(true)
    setError('')
    try {
      await unsubscribeFromPush()
      setStatus('unsubscribed')
    } catch {
      setError('Non siamo riusciti a disattivare le notifiche. Riprova.')
    } finally {
      setBusy(false)
    }
  }

  if (!supported) return null

  const wrapClass =
    variant === 'card'
      ? 'bg-white border-2 border-navy-dark/10 rounded-2xl p-6'
      : ''

  return (
    <div className={wrapClass}>
      {variant === 'card' && (
        <p className="font-display text-xs uppercase tracking-widest text-amber-dark mb-3">Notifiche</p>
      )}

      {status === 'checking' && <p className="text-sm text-navy-dark/50">Controllo…</p>}

      {status === 'denied' && (
        <p className="text-sm text-navy-dark/60">
          Le notifiche sono bloccate per questo sito. Per attivarle, abilitale dalle impostazioni del browser
          (icona del lucchetto vicino all'indirizzo).
        </p>
      )}

      {status === 'subscribed' && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm font-semibold text-navy-dark">✓ Notifiche attive su questo dispositivo</p>
          <button
            onClick={handleDisable}
            disabled={busy}
            className="text-sm font-semibold text-navy-dark/50 hover:text-navy-dark disabled:opacity-60"
          >
            Disattiva
          </button>
        </div>
      )}

      {status === 'unsubscribed' && (
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-navy-dark">Ricevi un avviso per news, risultati e promemoria partite</p>
          </div>
          <button
            onClick={handleEnable}
            disabled={busy}
            className="bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark text-sm font-display font-semibold px-4 py-2 rounded-full transition-colors shrink-0"
          >
            {busy ? 'Attivo…' : 'Attiva notifiche'}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-amber-dark font-medium mt-2">{error}</p>}
    </div>
  )
}
