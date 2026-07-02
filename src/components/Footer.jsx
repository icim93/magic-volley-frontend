import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-cream/90 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-end gap-1 mb-3">
            <span className="w-2 h-2 rounded-full bg-navy-light" />
            <span className="w-3 h-3 rounded-full bg-amber" />
            <span className="w-4 h-4 rounded-full bg-amber-dark" />
          </div>
          <p className="font-display font-bold text-lg">Magic Volley Adelfia</p>
          <p className="text-sm text-cream/60 mt-2 max-w-xs">
            Società di pallavolo femminile — squadre 2ª Divisione, U16 e U18.
          </p>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-wider text-amber mb-4">Sezioni</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/squadre" className="hover:text-amber transition-colors">Squadre</Link></li>
            <li><Link to="/calendario" className="hover:text-amber transition-colors">Calendario &amp; Risultati</Link></li>
            <li><Link to="/news" className="hover:text-amber transition-colors">News</Link></li>
            <li><Link to="/iscriviti" className="hover:text-amber transition-colors">Iscrizioni</Link></li>
            <li><Link to="/sponsor" className="hover:text-amber transition-colors">Sponsor</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-wider text-amber mb-4">Contatti</p>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>Adelfia, Puglia</li>
            <li><a href="mailto:info@magicvolleyadelfia.it" className="hover:text-amber transition-colors">info@magicvolleyadelfia.it</a></li>
            <li><Link to="/contatti" className="hover:text-amber transition-colors">Modulo di contatto →</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Magic Volley Adelfia. Tutti i diritti riservati.
      </div>
    </footer>
  )
}
