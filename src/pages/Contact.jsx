export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-4xl text-navy-dark">Contatti</h1>
      <p className="text-navy-dark/60 mt-3">Dove trovarci e come metterti in contatto con la società.</p>

      <div className="grid md:grid-cols-2 gap-10 mt-12">
        <div className="space-y-6">
          <InfoBlock title="Email">
            <a href="mailto:info@magicvolleyadelfia.it" className="text-amber-dark font-semibold">
              info@magicvolleyadelfia.it
            </a>
          </InfoBlock>

          <InfoBlock title="Sede / Palestra">
            <p>Adelfia (BA), Puglia</p>
            <p className="text-sm text-navy-dark/50 mt-1">
              Indirizzo esatto e orari allenamenti disponibili su richiesta.
            </p>
          </InfoBlock>

          <InfoBlock title="Social">
            <div className="flex gap-3 mt-1">
              <SocialLink label="Instagram" href="#" />
              <SocialLink label="Facebook" href="#" />
            </div>
          </InfoBlock>
        </div>

        <div className="bg-navy-dark text-cream rounded-2xl p-8">
          <h2 className="font-display font-bold text-xl">Vuoi iscriverti?</h2>
          <p className="text-cream/70 mt-2 text-sm">
            Usa il modulo di iscrizione: è il modo più rapido per essere ricontattato dallo staff.
          </p>
          <a
            href="/iscriviti"
            className="inline-block mt-6 bg-amber hover:bg-amber-dark text-navy-dark font-display font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Vai al modulo iscrizioni
          </a>
        </div>
      </div>
    </div>
  )
}

function InfoBlock({ title, children }) {
  return (
    <div>
      <p className="font-display text-xs uppercase tracking-widest text-amber-dark mb-2">{title}</p>
      <div className="text-navy-dark font-body">{children}</div>
    </div>
  )
}

function SocialLink({ label, href }) {
  return (
    <a
      href={href}
      className="text-sm font-semibold border-2 border-navy-dark/15 hover:border-amber px-4 py-2 rounded-full transition-colors"
    >
      {label}
    </a>
  )
}
