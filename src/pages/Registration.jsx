import { useState } from 'react'
import api from '../lib/api'

const categories = ['U16', 'U18', '2ª Divisione', 'Altro / non so']

const emptyForm = {
  first_name: '',
  last_name: '',
  birth_date: '',
  parent_name: '',
  email: '',
  phone: '',
  requested_team_category: '',
}

export default function Registration() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('')

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      await api.post('/api/registrations', form)
      setStatus('done')
      setForm(emptyForm)
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err.response?.data?.detail
          ? 'Controlla i dati inseriti e riprova.'
          : 'Non siamo riusciti a inviare la richiesta. Riprova più tardi.'
      )
    }
  }

  if (status === 'done') {
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <div className="flex justify-center gap-2 mb-6">
          <span className="w-3 h-3 rounded-full bg-navy-light" />
          <span className="w-4 h-4 rounded-full bg-amber" />
          <span className="w-5 h-5 rounded-full bg-amber-dark" />
        </div>
        <h1 className="font-display font-bold text-2xl text-navy-dark">Richiesta inviata</h1>
        <p className="text-navy-dark/60 mt-3">
          Grazie! Lo staff della società esaminerà la richiesta e ti risponderà via email o telefono a breve.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-8 text-amber-dark font-semibold text-sm"
        >
          Invia un'altra richiesta
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-4xl text-navy-dark">Iscriviti</h1>
      <p className="text-navy-dark/60 mt-3">
        Compila il modulo per richiedere il tesseramento. Ti contatteremo per completare la pratica
        (certificato medico e documenti verranno richiesti in un secondo momento).
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
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

        <Field label="Nome del genitore" hint="Se l'atleta è minorenne">
          <input value={form.parent_name} onChange={update('parent_name')} className="input" />
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

        {status === 'error' && (
          <p className="text-sm text-amber-dark font-medium">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-amber hover:bg-amber-dark disabled:opacity-60 text-navy-dark font-display font-semibold py-3.5 rounded-full transition-colors"
        >
          {status === 'sending' ? 'Invio in corso…' : 'Invia richiesta di iscrizione'}
        </button>
      </form>
    </div>
  )
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
