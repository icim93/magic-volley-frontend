import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { REGISTRATION_DOCUMENTS } from '../data/registrationDocuments'
import { DocumentCard, DocumentModal } from '../components/DocumentViewer'
import { generateRegistrationPdf } from '../lib/registrationPdf'

const emptyForm = {
  first_name: '',
  last_name: '',
  birth_date: '',
  birth_place: '',
  address: '',
  city: '',
  postal_code: '',
  fiscal_code: '',
  parent_name: '',
  parent_birth_place: '',
  parent_address: '',
  parent_city: '',
  parent_postal_code: '',
  parent_fiscal_code: '',
  email: '',
  phone: '',
  requested_team_category: '',
}

// Età alla data odierna: sotto i 18 anni servono i dati del genitore/tutore.
function computeAge(birthDate) {
  const birth = new Date(birthDate)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const beforeBirthday =
    now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())
  if (beforeBirthday) age -= 1
  return age
}

function Field({ label, hint, required, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-navy-dark">
        {label}{required && <span className="text-amber-dark"> *</span>}
      </span>
      {hint && <span className="block text-xs text-navy-dark/50 mb-1.5">{hint}</span>}
      <div className={hint ? '' : 'mt-1.5'}>{children}</div>
    </label>
  )
}

function StepDots({ step }) {
  return (
    <div className="flex gap-2 mb-8">
      {[1, 2, 3].map((n) => (
        <div key={n} className={`flex-1 h-1.5 rounded-full ${n <= step ? 'bg-amber' : 'bg-navy-dark/10'}`} />
      ))}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-navy-dark/5 py-1.5 text-sm">
      <dt className="text-navy-dark/50">{label}</dt>
      <dd className="text-navy-dark font-medium text-right">{value || '—'}</dd>
    </div>
  )
}

// Riepilogo a schermo di quanto inserito: il vero modulo da firmare è il PDF
// generato da generateRegistrationPdf, non questa vista (che qui serve solo
// da controllo prima dell'invio).
function SummaryDoc({ form, isMinor }) {
  const fullName = `${form.first_name} ${form.last_name}`.trim()
  const birthDateLabel = form.birth_date ? new Date(form.birth_date).toLocaleDateString('it-IT') : ''

  return (
    <div className="border-2 border-navy-dark/10 rounded-2xl p-6">
      <dl className="space-y-1">
        <Row label="Nome e cognome" value={fullName} />
        <Row label="Luogo e data di nascita" value={form.birth_place ? `${form.birth_place}, ${birthDateLabel}` : birthDateLabel} />
        <Row label="Indirizzo" value={form.address} />
        <Row label="Città" value={form.city} />
        <Row label="CAP" value={form.postal_code} />
        <Row label="Codice fiscale" value={form.fiscal_code} />
        <Row label="Email" value={form.email} />
        <Row label="Telefono" value={form.phone} />
        <Row label="Categoria di interesse" value={form.requested_team_category} />
      </dl>
      {isMinor && (
        <>
          <p className="font-display font-semibold text-xs uppercase tracking-wide text-navy-dark/50 mt-5 mb-1">
            Genitore/tutore
          </p>
          <dl className="space-y-1">
            <Row label="Nome e cognome" value={form.parent_name} />
            <Row label="Luogo di nascita" value={form.parent_birth_place} />
            <Row label="Indirizzo" value={form.parent_address} />
            <Row label="Città" value={form.parent_city} />
            <Row label="CAP" value={form.parent_postal_code} />
            <Row label="Codice fiscale" value={form.parent_fiscal_code} />
          </dl>
        </>
      )}
    </div>
  )
}

export default function Registration() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [docsRead, setDocsRead] = useState({})
  const [openDoc, setOpenDoc] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    api.get('/api/teams')
      .then((res) => setCategories([...new Set(res.data.map((t) => t.category).filter(Boolean))]))
      .catch(() => {})
  }, [])

  useDocumentMeta({
    title: 'Iscriviti',
    description: 'Richiedi il tesseramento a Magic Volley Adelfia Associazione Sportiva Dilettantistica: compila il modulo di iscrizione.',
    path: '/iscriviti',
  })

  const isMinor = form.birth_date ? computeAge(form.birth_date) < 18 : false

  // Se l'atleta risulta maggiorenne, i dati del genitore non servono più: li svuotiamo
  // per non mandarli per sbaglio insieme alla richiesta.
  useEffect(() => {
    if (!isMinor && (form.parent_name || form.parent_birth_place || form.parent_address || form.parent_city || form.parent_postal_code || form.parent_fiscal_code)) {
      setForm((f) => ({
        ...f,
        parent_name: '', parent_birth_place: '', parent_address: '',
        parent_city: '', parent_postal_code: '', parent_fiscal_code: '',
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMinor])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const canProceedStep1 =
    form.first_name.trim() && form.last_name.trim() && form.birth_date &&
    form.birth_place.trim() && form.address.trim() && form.city.trim() && form.postal_code.trim() && form.fiscal_code.trim() &&
    form.email.trim() && form.phone.trim() &&
    (!isMinor || (
      form.parent_name.trim() && form.parent_birth_place.trim() && form.parent_address.trim() &&
      form.parent_city.trim() && form.parent_postal_code.trim() && form.parent_fiscal_code.trim()
    ))

  const allDocsRead = REGISTRATION_DOCUMENTS.every((d) => docsRead[d.key])

  const markRead = (key) => setDocsRead((prev) => (prev[key] ? prev : { ...prev, [key]: true }))

  const downloadPdf = () => generateRegistrationPdf(form, isMinor)

  const handleSubmit = async () => {
    setStatus('sending')
    setErrorMsg('')
    try {
      await api.post('/api/registrations', { ...form, documents_accepted: allDocsRead })
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err.response?.data?.detail
          ? 'Controlla i dati inseriti e riprova.'
          : 'Non siamo riusciti a inviare la richiesta. Riprova più tardi.'
      )
    }
  }

  const resetAll = () => {
    setStatus('idle')
    setStep(1)
    setForm(emptyForm)
    setDocsRead({})
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-16">
      {status !== 'done' && <StepDots step={step} />}

      {status === 'done' ? (
        <div>
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-8 text-center">
            <p className="font-display font-bold text-navy-dark">Richiesta inviata ✓</p>
            <p className="text-sm text-navy-dark/60 mt-1">
              Se non l'hai ancora fatto, scarica il modulo qui sotto, firmalo e portalo in palestra.
              Lo staff esaminerà la richiesta e ti risponderà via email o telefono a breve.
            </p>
            <button onClick={resetAll} className="mt-4 text-amber-dark font-semibold text-sm">
              Invia un'altra richiesta
            </button>
          </div>
          <SummaryDoc form={form} isMinor={isMinor} />
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={downloadPdf}
              className="border-2 border-navy-dark/20 hover:border-navy-dark text-navy-dark font-display font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Scarica il modulo da firmare (PDF)
            </button>
          </div>
        </div>
      ) : step === 1 ? (
        <div>
          <h1 className="font-display font-bold text-4xl text-navy-dark">Iscriviti</h1>
          <p className="text-navy-dark/60 mt-3">
            Passo 1 di 3 — i tuoi dati. Al passo successivo trovi Regolamento, Statuto, Privacy e le altre
            informative da leggere.
          </p>

          <div className="mt-10 space-y-5">
            <p className="font-display font-semibold text-xs uppercase tracking-wide text-navy-dark/50">Atleta</p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Nome" required>
                <input required value={form.first_name} onChange={update('first_name')} className="input" />
              </Field>
              <Field label="Cognome" required>
                <input required value={form.last_name} onChange={update('last_name')} className="input" />
              </Field>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Luogo di nascita" required>
                <input required value={form.birth_place} onChange={update('birth_place')} className="input" placeholder="Es. Bari" />
              </Field>
              <Field label="Data di nascita" required>
                <input required type="date" value={form.birth_date} onChange={update('birth_date')} className="input" />
              </Field>
            </div>

            <Field label="Indirizzo di residenza" required>
              <input required value={form.address} onChange={update('address')} className="input" placeholder="Via e numero civico" />
            </Field>

            <div className="grid sm:grid-cols-[1fr_auto] gap-5">
              <Field label="Città di residenza" required>
                <input required value={form.city} onChange={update('city')} className="input" placeholder="Es. Adelfia" />
              </Field>
              <Field label="CAP" required>
                <input required value={form.postal_code} onChange={update('postal_code')} maxLength={5} className="input w-24" placeholder="70010" />
              </Field>
            </div>

            <Field label="Codice fiscale" required>
              <input required value={form.fiscal_code} onChange={update('fiscal_code')} maxLength={16} className="input uppercase" />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Email" required>
                <input required type="email" value={form.email} onChange={update('email')} className="input" />
              </Field>
              <Field label="Telefono" required>
                <input required type="tel" value={form.phone} onChange={update('phone')} className="input" />
              </Field>
            </div>

            <Field label="Categoria di interesse">
              <select value={form.requested_team_category} onChange={update('requested_team_category')} className="input">
                <option value="">Seleziona…</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            {!form.birth_date ? (
              <p className="text-xs text-navy-dark/40">
                I dati del genitore/tutore compaiono qui sotto una volta inserita la data di nascita, se l'atleta
                risulta minorenne.
              </p>
            ) : isMinor && (
              <>
                <p className="font-display font-semibold text-xs uppercase tracking-wide text-navy-dark/50 pt-4">
                  Genitore/tutore — obbligatorio: l'atleta è minorenne
                </p>

                <Field label="Nome e cognome" required>
                  <input required value={form.parent_name} onChange={update('parent_name')} className="input" />
                </Field>

                <Field label="Luogo di nascita" required>
                  <input required value={form.parent_birth_place} onChange={update('parent_birth_place')} className="input" placeholder="Es. Bari" />
                </Field>

                <Field label="Indirizzo di residenza" required>
                  <input required value={form.parent_address} onChange={update('parent_address')} className="input" placeholder="Via e numero civico" />
                </Field>

                <div className="grid sm:grid-cols-[1fr_auto] gap-5">
                  <Field label="Città di residenza" required>
                    <input required value={form.parent_city} onChange={update('parent_city')} className="input" placeholder="Es. Adelfia" />
                  </Field>
                  <Field label="CAP" required>
                    <input required value={form.parent_postal_code} onChange={update('parent_postal_code')} maxLength={5} className="input w-24" placeholder="70010" />
                  </Field>
                </div>

                <Field label="Codice fiscale" required>
                  <input required value={form.parent_fiscal_code} onChange={update('parent_fiscal_code')} maxLength={16} className="input uppercase" />
                </Field>
              </>
            )}

            <button
              type="button"
              disabled={!canProceedStep1}
              onClick={() => setStep(2)}
              className="w-full bg-amber hover:bg-amber-dark disabled:opacity-40 disabled:cursor-not-allowed text-navy-dark font-display font-semibold py-3.5 rounded-full transition-colors"
            >
              Avanti — Documenti da leggere
            </button>
          </div>
        </div>
      ) : step === 2 ? (
        <div>
          <h1 className="font-display font-bold text-3xl text-navy-dark">Documenti da leggere</h1>
          <p className="text-navy-dark/60 mt-3 text-sm">
            Passo 2 di 3 — apri ogni documento e scorrilo fino in fondo per confermarne la lettura. Per Statuto e
            Safe Guarding puoi anche consultare il PDF originale. Nel Regolamento devi anche aprire i link delle
            polizze assicurative CSEN e FIPAV.
          </p>

          <div className="mt-6 space-y-3">
            {REGISTRATION_DOCUMENTS.map((doc) => (
              <DocumentCard
                key={doc.key}
                doc={doc}
                read={!!docsRead[doc.key]}
                onOpen={() => setOpenDoc(doc)}
              />
            ))}
          </div>

          {openDoc && (
            <DocumentModal
              doc={openDoc}
              onClose={() => setOpenDoc(null)}
              onFullyRead={() => markRead(openDoc.key)}
            />
          )}

          <div className="flex gap-3 mt-8">
            <button type="button" onClick={() => setStep(1)} className="text-navy-dark/60 hover:text-navy-dark font-semibold px-3">
              ← Indietro
            </button>
            <button
              type="button"
              disabled={!allDocsRead}
              onClick={() => setStep(3)}
              className="flex-1 bg-amber hover:bg-amber-dark disabled:opacity-40 disabled:cursor-not-allowed text-navy-dark font-display font-semibold py-3.5 rounded-full transition-colors"
            >
              Avanti — Riepilogo
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="font-display font-bold text-3xl text-navy-dark">Riepilogo</h1>
          <p className="text-navy-dark/60 mt-3 text-sm">
            Passo 3 di 3 — controlla i dati, scarica il modulo, firmalo e portalo in palestra. Poi invia la richiesta.
          </p>

          <div className="mt-6">
            <SummaryDoc form={form} isMinor={isMinor} />
          </div>

          {errorMsg && <p className="text-sm text-amber-dark font-medium mt-4">{errorMsg}</p>}

          <div className="flex flex-wrap gap-3 mt-8">
            <button type="button" onClick={() => setStep(2)} className="text-navy-dark/60 hover:text-navy-dark font-semibold px-3">
              ← Indietro
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              className="border-2 border-navy-dark/20 hover:border-navy-dark text-navy-dark font-display font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Scarica il modulo (PDF)
            </button>
            <button
              type="button"
              disabled={status === 'sending'}
              onClick={handleSubmit}
              className="flex-1 bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark font-display font-semibold py-3 rounded-full transition-colors"
            >
              {status === 'sending' ? 'Invio in corso…' : 'Invia la richiesta di iscrizione'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
