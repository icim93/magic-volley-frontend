import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { REGISTRATION_DOCUMENTS } from '../data/registrationDocuments'

const emptyForm = {
  first_name: '',
  last_name: '',
  birth_date: '',
  parent_name: '',
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
    <div className="flex gap-2 mb-8 print:hidden">
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

function SignatureLine({ label }) {
  return (
    <div>
      <div className="h-16 border-b-2 border-navy-dark/30" />
      <p className="text-xs text-navy-dark/50 mt-1.5">{label}</p>
    </div>
  )
}

// Riepilogo stampabile: mostrato sia in anteprima (step 3) sia dopo l'invio,
// così chi si dimentica di stampare prima può farlo comunque dopo.
function SummaryDoc({ form, isMinor }) {
  return (
    <div className="border-2 border-navy-dark/10 rounded-2xl p-6 print:border-0 print:p-0">
      <p className="font-display font-bold text-lg text-navy-dark print:text-center">
        Modulo di richiesta tesseramento
      </p>
      <p className="text-xs text-navy-dark/40 print:text-center print:mb-6">Magic Volley Adelfia ASD</p>

      <dl className="mt-4 space-y-1">
        <Row label="Nome e cognome" value={`${form.first_name} ${form.last_name}`} />
        <Row label="Data di nascita" value={form.birth_date ? new Date(form.birth_date).toLocaleDateString('it-IT') : ''} />
        {isMinor && <Row label="Genitore/tutore" value={form.parent_name} />}
        <Row label="Email" value={form.email} />
        <Row label="Telefono" value={form.phone} />
        <Row label="Categoria di interesse" value={form.requested_team_category} />
      </dl>

      <p className="text-sm text-navy-dark/80 mt-6 leading-relaxed">
        Dichiaro di aver letto e accettato: Regolamento interno, Statuto della società, Informativa Privacy,
        Autorizzazione all'utilizzo delle immagini, Documento di Safe Guarding.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-8">
        <SignatureLine label="Firma dell'atleta" />
        {isMinor && <SignatureLine label="Firma del genitore/tutore" />}
      </div>
      <p className="text-xs text-navy-dark/40 mt-8">Data: _______________</p>
    </div>
  )
}

export default function Registration() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(emptyForm)
  const [categories, setCategories] = useState([])
  const [docsRead, setDocsRead] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    api.get('/api/teams')
      .then((res) => setCategories([...new Set(res.data.map((t) => t.category).filter(Boolean))]))
      .catch(() => {})
  }, [])

  useDocumentMeta({
    title: 'Iscriviti',
    description: 'Richiedi il tesseramento a Magic Volley Adelfia ASD: compila il modulo di iscrizione.',
    path: '/iscriviti',
  })

  const isMinor = form.birth_date ? computeAge(form.birth_date) < 18 : false

  // Se l'atleta risulta maggiorenne, il nome del genitore non serve più: lo svuotiamo
  // per non mandarlo per sbaglio insieme alla richiesta.
  useEffect(() => {
    if (!isMinor && form.parent_name) setForm((f) => ({ ...f, parent_name: '' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMinor])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const canProceedStep1 =
    form.first_name.trim() && form.last_name.trim() && form.birth_date &&
    form.email.trim() && form.phone.trim() &&
    (!isMinor || form.parent_name.trim())

  const allDocsRead = REGISTRATION_DOCUMENTS.every((d) => docsRead[d.key])

  const handleDocScroll = (key) => (e) => {
    const el = e.target
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 12) {
      setDocsRead((prev) => (prev[key] ? prev : { ...prev, [key]: true }))
    }
  }

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
    <div className="max-w-lg mx-auto px-5 py-16 print:py-0">
      {status !== 'done' && <StepDots step={step} />}

      {status === 'done' ? (
        <div>
          <div className="print:hidden bg-green-50 border-2 border-green-200 rounded-2xl p-5 mb-8 text-center">
            <p className="font-display font-bold text-navy-dark">Richiesta inviata ✓</p>
            <p className="text-sm text-navy-dark/60 mt-1">
              Se non l'hai ancora fatto, stampa il modulo qui sotto, firmalo e portalo in palestra.
              Lo staff esaminerà la richiesta e ti risponderà via email o telefono a breve.
            </p>
            <button onClick={resetAll} className="mt-4 text-amber-dark font-semibold text-sm">
              Invia un'altra richiesta
            </button>
          </div>
          <SummaryDoc form={form} isMinor={isMinor} />
          <div className="print:hidden text-center mt-6">
            <button
              type="button"
              onClick={() => window.print()}
              className="border-2 border-navy-dark/20 hover:border-navy-dark text-navy-dark font-display font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Stampa il modulo
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
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Nome" required>
                <input required value={form.first_name} onChange={update('first_name')} className="input" />
              </Field>
              <Field label="Cognome" required>
                <input required value={form.last_name} onChange={update('last_name')} className="input" />
              </Field>
            </div>

            <Field label="Data di nascita" required>
              <input required type="date" value={form.birth_date} onChange={update('birth_date')} className="input" />
            </Field>

            <Field
              label="Nome del genitore/tutore"
              hint={
                !form.birth_date
                  ? 'Si abilita dopo aver inserito la data di nascita'
                  : isMinor
                  ? "Obbligatorio: l'atleta è minorenne"
                  : "Non necessario: l'atleta è maggiorenne"
              }
            >
              <input
                required={isMinor}
                disabled={!isMinor}
                value={form.parent_name}
                onChange={update('parent_name')}
                className="input disabled:opacity-40 disabled:cursor-not-allowed"
              />
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
            Passo 2 di 3 — scorri ogni documento fino in fondo per confermarne la lettura.
          </p>

          <div className="mt-4 bg-amber/15 border-2 border-amber/40 rounded-xl p-3 text-xs text-navy-dark/70">
            ⚠️ Testi provvisori (bozza) usati solo per collaudare questo modulo — verranno sostituiti con i
            documenti ufficiali della società.
          </div>

          <div className="mt-6 space-y-5">
            {REGISTRATION_DOCUMENTS.map((doc) => (
              <div key={doc.key} className="border-2 border-navy-dark/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-navy-dark/5">
                  <p className="font-display font-semibold text-sm text-navy-dark">{doc.title}</p>
                  <span className={`text-xs font-semibold ${docsRead[doc.key] ? 'text-green-700' : 'text-navy-dark/40'}`}>
                    {docsRead[doc.key] ? '✓ Letto' : 'Scorri per confermare'}
                  </span>
                </div>
                <div
                  onScroll={handleDocScroll(doc.key)}
                  className="h-40 overflow-y-auto px-4 py-3 text-xs text-navy-dark/70 whitespace-pre-line leading-relaxed bg-white"
                >
                  {doc.text}
                </div>
              </div>
            ))}
          </div>

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
            Passo 3 di 3 — controlla i dati, stampa il modulo, firmalo e portalo in palestra. Poi invia la richiesta.
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
              onClick={() => window.print()}
              className="border-2 border-navy-dark/20 hover:border-navy-dark text-navy-dark font-display font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Stampa il modulo
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
