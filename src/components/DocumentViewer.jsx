// Card + popup per mostrare un documento (Regolamento, Statuto, Privacy, Safe
// Guarding...). Riusato sia nello step 2 del modulo iscrizioni (con conferma
// di lettura obbligatoria) sia nella pagina pubblica /documenti (sola lettura).

export function DocumentCard({ doc, read, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full flex items-center justify-between gap-3 border-2 border-navy-dark/10 hover:border-amber rounded-xl px-5 py-4 text-left transition-colors bg-white"
    >
      <div>
        <p className="font-display font-semibold text-navy-dark">{doc.title}</p>
        {doc.description && <p className="text-xs text-navy-dark/50 mt-0.5">{doc.description}</p>}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {read !== undefined && (
          <span className={`text-xs font-semibold ${read ? 'text-green-700' : 'text-navy-dark/40'}`}>
            {read ? '✓ Letto' : 'Da leggere'}
          </span>
        )}
        <span className="text-navy-light">→</span>
      </div>
    </button>
  )
}

export function DocumentModal({ doc, onClose, onScrolledToBottom }) {
  const handleScroll = (e) => {
    const el = e.target
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12) {
      onScrolledToBottom?.()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-navy-dark/50 flex items-center justify-center p-4">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-navy-dark/10 shrink-0">
          <div>
            <p className="font-display font-bold text-lg text-navy-dark">{doc.title}</p>
            {doc.links?.filter((l) => l.url).length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                {doc.links.filter((l) => l.url).map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-amber-dark hover:text-amber"
                  >
                    {l.label} →
                  </a>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi"
            className="text-navy-dark/40 hover:text-navy-dark shrink-0"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6L18 18M6 18L18 6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div
          onScroll={handleScroll}
          className="overflow-y-auto px-6 py-5 text-sm text-navy-dark/80 whitespace-pre-line leading-relaxed"
        >
          {doc.text}
        </div>
      </div>
    </div>
  )
}
