export function TrajectoryDivider({ className = '' }) {
  return (
    <div className={`trajectory-divider text-navy-light ${className}`} role="presentation">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  )
}

export function Loading({ label = 'Caricamento…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-navy-light">
      <div className="trajectory-divider animate-pulse">
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </div>
      <p className="font-body text-sm">{label}</p>
    </div>
  )
}

export function EmptyState({ title, description }) {
  return (
    <div className="text-center py-16 px-6 border-2 border-dashed border-navy-light/30 rounded-2xl">
      <p className="font-display font-semibold text-navy-dark">{title}</p>
      {description && <p className="text-sm text-navy-dark/60 mt-2">{description}</p>}
    </div>
  )
}

export function ErrorState({ message = 'Qualcosa è andato storto. Riprova più tardi.' }) {
  return (
    <div className="text-center py-16 px-6 border-2 border-dashed border-amber-dark/40 rounded-2xl">
      <p className="font-display font-semibold text-amber-dark">Non riesco a caricare i dati</p>
      <p className="text-sm text-navy-dark/60 mt-2">{message}</p>
    </div>
  )
}
