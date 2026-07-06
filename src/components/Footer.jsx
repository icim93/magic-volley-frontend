import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-navy-dark text-cream/90 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <img
            src="/logo-dark.jpg"
            alt="Magic Volley Adelfia ASD"
            className="h-24 w-auto mb-3 mix-blend-lighten"
          />
          <p className="font-display font-bold text-lg">Magic Volley Adelfia ASD</p>
          <p className="text-sm text-cream/60 mt-2 max-w-xs">
            Pallavolo femminile ad Adelfia: 2ª Divisione, U16 e U18. Un progetto
            sportivo che cresce insieme alle sue atlete.
          </p>
        </div>

        <div>
          <p className="font-display text-sm uppercase tracking-wider text-amber mb-4">Sezioni</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/societa" className="hover:text-amber transition-colors">La società</Link></li>
            <li><Link to="/squadre" className="hover:text-amber transition-colors">Squadre</Link></li>
            <li><Link to="/calendario" className="hover:text-amber transition-colors">Calendario &amp; Risultati</Link></li>
            <li><Link to="/news" className="hover:text-amber transition-colors">News</Link></li>
            <li><Link to="/gallery" className="hover:text-amber transition-colors">Fotogallery</Link></li>
            <li><Link to="/iscriviti" className="hover:text-amber transition-colors">Iscrizioni</Link></li>
            <li><Link to="/sponsor" className="hover:text-amber transition-colors">Sponsor</Link></li>
            <li><Link to="/area-riservata/login" className="hover:text-amber transition-colors">Area riservata famiglie</Link></li>
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
        © {new Date().getFullYear()} Magic Volley Adelfia ASD. Tutti i diritti riservati.
      </div>
    </footer>
  )
}
