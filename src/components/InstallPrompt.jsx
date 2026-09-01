import { useEffect, useState } from 'react'

// Chrome/Android decide da soli quando l'app "merita" il prompt di installazione
// (beforeinstallprompt) e non lo mostrano mai in automatico senza un gesto
// dell'utente — qui lo intercettiamo e lo trasformiamo in un banner nostro,
// così è visibile subito invece che nascosto nel menu del browser.
// Su iOS Safari questo evento non esiste proprio: niente da fare qui,
// resta solo la via manuale (Condividi -> Aggiungi a Home).
const DISMISS_KEY = 'mva_install_dismissed_at'
const DISMISS_DAYS = 14

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
    if (isStandalone) return

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0)
    const dismissedRecently = dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000
    if (dismissedRecently) return

    const onBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    }
    const onInstalled = () => {
      setVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:max-w-sm z-40 bg-navy-dark text-cream rounded-2xl shadow-xl p-4 flex items-center gap-3">
      <img src="/pwa-64x64.png" alt="" className="w-10 h-10 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-sm">Installa Magic Volley</p>
        <p className="text-xs text-cream/60 mt-0.5">Accesso rapido dalla schermata Home, anche offline.</p>
      </div>
      <div className="flex flex-col gap-1 shrink-0 items-end">
        <button
          onClick={handleInstall}
          className="bg-amber hover:bg-amber-dark text-navy-dark text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
        >
          Installa
        </button>
        <button onClick={handleDismiss} className="text-cream/50 hover:text-cream text-xs px-1">
          No grazie
        </button>
      </div>
    </div>
  )
}
