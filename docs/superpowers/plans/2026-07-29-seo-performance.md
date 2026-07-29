# SEO & Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give ogni pagina pubblica un titolo/meta description propri, aggiungere tag Open Graph, esporre `robots.txt` + `sitemap.xml` dinamica, separare il bundle admin/area-riservata dal bundle pubblico, e lazy-load delle immagini sotto la piega — senza toccare design, copy o modello dati esistenti.

**Architecture:** Frontend (`magic-volley-frontend`, React+Vite SPA) riceve un hook `useDocumentMeta` chiamato da ogni pagina pubblica, `React.lazy` per le route admin/guardian, e attributi `loading="lazy"` su immagini specifiche. Backend (`magic-volley-backend`, FastAPI) riceve un nuovo router che genera `sitemap.xml` al volo dal DB. Il frontend (Render Static Site) proxa `/sitemap.xml` verso il backend (Render Web Service) tramite un file `_redirects`.

**Tech Stack:** React 18, Vite 5, react-router-dom 6 (frontend) — FastAPI, SQLAlchemy (backend). Nessuna nuova dipendenza.

## Global Constraints

- Dominio pubblico di produzione: `https://www.magicvolleyadelfia.it` (confermato dall'utente).
- Deploy attuale: Render Static Site (frontend, `magic-volley-frontend.onrender.com`) + Render Web Service (backend, `magic-volley-backend.onrender.com`) + Postgres gestito — non Vercel.
- Immagine OG di default per le pagine senza foto propria: `/logo.png` (confermato dall'utente).
- Anteprime social (WhatsApp/Facebook) per articoli/schede sono fuori scope per questo piano (limite tecnico di una SPA client-side, accettato dall'utente) — non tentare di "risolverle" con soluzioni improvvisate.
- Nessuna nuova dipendenza npm o pip: niente `react-helmet-async`, niente librerie di sitemap.
- **Questo progetto non ha un test runner configurato** (niente Vitest/Jest lato frontend, niente pytest lato backend). Al posto del ciclo TDD automatico, ogni task usa la verifica manuale già definita nello spec (curl, devtools, `npm run build`) — è l'adattamento corretto per questa codebase, non un'omissione.

---

### Task 1: Hook `useDocumentMeta`

**Files:**
- Create: `magic-volley-frontend/src/hooks/useDocumentMeta.js`

**Interfaces:**
- Produces: `useDocumentMeta({ title, description, image, path, type })` — hook React, nessun valore di ritorno. `title` è il titolo specifico della pagina (senza suffisso, viene aggiunto dall'hook) o `undefined` per usare solo il nome del sito. `description` è la meta description (stringa, opzionale). `image` è un path assoluto dal root (es. `/logo.png`) o un URL completo (es. `cover_image_url` di una news); se omesso usa `/logo.png`. `path` è il path della route corrente (es. `/squadre`), usato per costruire `og:url`. `type` è `website` (default) o `article`/`profile`.

- [ ] **Step 1: Creare il file dell'hook**

```js
import { useEffect } from 'react'

const SITE_NAME = 'Magic Volley Adelfia ASD'
const SITE_URL = 'https://www.magicvolleyadelfia.it'
const DEFAULT_IMAGE = '/logo.png'

function setMetaTag(attr, key, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function resolveUrl(value) {
  if (!value) return null
  return value.startsWith('http') ? value : `${SITE_URL}${value}`
}

export function useDocumentMeta({ title, description, image, path, type = 'website' }) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME
    document.title = fullTitle

    const resolvedImage = resolveUrl(image) || `${SITE_URL}${DEFAULT_IMAGE}`
    const resolvedUrl = path ? `${SITE_URL}${path}` : SITE_URL

    setMetaTag('name', 'description', description)
    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:image', resolvedImage)
    setMetaTag('property', 'og:url', resolvedUrl)
    setMetaTag('property', 'og:type', type)
    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', resolvedImage)
  }, [title, description, image, path, type])
}
```

- [ ] **Step 2: Verifica manuale rapida**

Non esiste ancora nessuna pagina che chiama l'hook (arriva nel Task 2), quindi non c'è un modo per "vederlo" in azione adesso. Verifica solo che il file non abbia errori di sintassi:

Run: `cd magic-volley-frontend && node --check src/hooks/useDocumentMeta.js`
Expected: nessun output (il comando esce con codice 0).

Nota: `node --check` valida solo la sintassi JS pura; l'hook usa JSX-free syntax quindi va bene così com'è.

- [ ] **Step 3: Commit**

```bash
cd magic-volley-frontend
git add src/hooks/useDocumentMeta.js
git commit -m "feat: add useDocumentMeta hook for per-page title/meta/OG tags"
```

---

### Task 2: Collegare l'hook a tutte le pagine pubbliche

**Files:**
- Modify: `magic-volley-frontend/src/pages/Home.jsx`
- Modify: `magic-volley-frontend/src/pages/Club.jsx`
- Modify: `magic-volley-frontend/src/pages/Teams.jsx`
- Modify: `magic-volley-frontend/src/pages/PlayerDetail.jsx`
- Modify: `magic-volley-frontend/src/pages/Gallery.jsx`
- Modify: `magic-volley-frontend/src/pages/Calendar.jsx`
- Modify: `magic-volley-frontend/src/pages/News.jsx`
- Modify: `magic-volley-frontend/src/pages/NewsDetail.jsx`
- Modify: `magic-volley-frontend/src/pages/Registration.jsx`
- Modify: `magic-volley-frontend/src/pages/Sponsors.jsx`
- Modify: `magic-volley-frontend/src/pages/Contact.jsx`

**Interfaces:**
- Consumes: `useDocumentMeta` da `../hooks/useDocumentMeta` (Task 1).

- [ ] **Step 1: Home.jsx**

Aggiungi l'import in cima al file (dopo gli import esistenti):

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

Nel corpo della funzione `Home()`, subito dopo l'ultimo `useEffect` esistente (quello che carica `teams`), aggiungi:

```js
  useDocumentMeta({
    description: 'Sito ufficiale di Magic Volley Adelfia ASD — pallavolo femminile: squadre, atlete, staff, calendario, fotogallery, news e iscrizioni.',
    path: '/',
  })
```

(Nessun `title` passato: la Home usa solo il nome del sito, senza suffisso.)

- [ ] **Step 2: Club.jsx**

Import:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

Nel corpo di `Club()`, dopo i due `useEffect` esistenti:

```js
  useDocumentMeta({
    title: 'Società',
    description: "Chi siamo, la nostra missione e l'organigramma di Magic Volley Adelfia ASD.",
    path: '/societa',
  })
```

- [ ] **Step 3: Teams.jsx**

Import:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

Nel corpo di `Teams()`, dopo il `useEffect` esistente:

```js
  useDocumentMeta({
    title: 'Squadre',
    description: 'Le squadre di Magic Volley Adelfia ASD: rose, categorie e schede delle atlete.',
    path: '/squadre',
  })
```

- [ ] **Step 4: PlayerDetail.jsx**

Import:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

Nel corpo di `PlayerDetail()`, subito dopo il `useEffect` esistente e **prima** del blocco `if (error) { ... }` (l'hook va chiamato ad ogni render, non dentro un return condizionale):

```js
  useDocumentMeta({
    title: player ? `${player.first_name} ${player.last_name}` : undefined,
    description: player
      ? (player.bio || `Scheda di ${player.first_name} ${player.last_name}, ${player.role || 'atleta'} di Magic Volley Adelfia ASD.`)
      : undefined,
    image: player?.photo_url,
    path: `/giocatrici/${id}`,
    type: 'profile',
  })
```

- [ ] **Step 5: Gallery.jsx**

Import:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

Nel corpo di `Gallery()`, dopo il `useEffect` che carica `photos` (prima degli altri `useCallback`/`useEffect` di navigazione lightbox, l'ordine tra loro non conta):

```js
  useDocumentMeta({
    title: 'Fotogallery',
    description: 'Foto delle partite, degli allenamenti e degli eventi di Magic Volley Adelfia ASD.',
    path: '/gallery',
  })
```

- [ ] **Step 6: Calendar.jsx**

Import:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

Nel corpo di `Calendar()`, dopo il `useEffect` esistente:

```js
  useDocumentMeta({
    title: 'Calendario & Risultati',
    description: 'Prossime partite e risultati delle squadre di Magic Volley Adelfia ASD.',
    path: '/calendario',
  })
```

- [ ] **Step 7: News.jsx**

Import:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

Nel corpo di `News()`, dopo il `useEffect` esistente:

```js
  useDocumentMeta({
    title: 'News',
    description: 'Tutte le novità di Magic Volley Adelfia ASD.',
    path: '/news',
  })
```

- [ ] **Step 8: NewsDetail.jsx**

Import:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

Nel corpo di `NewsDetail()`, subito dopo il `useEffect` esistente e **prima** del blocco `if (error) { ... }`:

```js
  useDocumentMeta({
    title: item?.title,
    description: item?.summary || 'Leggi le ultime notizie di Magic Volley Adelfia ASD.',
    image: item?.cover_image_url,
    path: `/news/${slug}`,
    type: 'article',
  })
```

- [ ] **Step 9: Registration.jsx**

Import:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

`Registration()` non ha `useEffect` esistenti: aggiungi la chiamata subito dopo le righe `useState` esistenti, prima della funzione `handleSubmit`:

```js
  useDocumentMeta({
    title: 'Iscriviti',
    description: 'Richiedi il tesseramento a Magic Volley Adelfia ASD: compila il modulo di iscrizione.',
    path: '/iscriviti',
  })
```

- [ ] **Step 10: Sponsors.jsx**

Import:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'
```

Nel corpo di `Sponsors()`, dopo il `useEffect` esistente:

```js
  useDocumentMeta({
    title: 'Sponsor',
    description: 'Gli sponsor che sostengono Magic Volley Adelfia ASD.',
    path: '/sponsor',
  })
```

- [ ] **Step 11: Contact.jsx**

`Contact()` è un componente senza stato (nessun `useState`/`useEffect`). Aggiungi l'import e la chiamata come prima riga del corpo funzione:

```js
import { useDocumentMeta } from '../hooks/useDocumentMeta'

export default function Contact() {
  useDocumentMeta({
    title: 'Contatti',
    description: 'Contatti e informazioni per raggiungere Magic Volley Adelfia ASD.',
    path: '/contatti',
  })

  return (
    // ... resto invariato
```

- [ ] **Step 12: Verifica manuale in browser**

```bash
cd magic-volley-frontend
npm run dev
```

Apri ogni route (`/`, `/societa`, `/squadre`, `/giocatrici/{id di una giocatrice esistente}`, `/gallery`, `/calendario`, `/news`, `/news/{slug di una news esistente}`, `/iscriviti`, `/sponsor`, `/contatti`) e per ognuna:
- controlla che il titolo della tab del browser cambi in `"<Nome pagina> · Magic Volley Adelfia ASD"` (o solo `"Magic Volley Adelfia ASD"` per la Home);
- apri devtools → Elements → `<head>` → verifica che `<meta name="description">` e i tag `og:*`/`twitter:*` abbiano il contenuto atteso per quella pagina, e che cambino navigando da una pagina all'altra senza reload completo.

Expected: nessun titolo/meta rimane "incollato" dalla pagina precedente.

- [ ] **Step 13: Commit**

```bash
git add src/pages/Home.jsx src/pages/Club.jsx src/pages/Teams.jsx src/pages/PlayerDetail.jsx src/pages/Gallery.jsx src/pages/Calendar.jsx src/pages/News.jsx src/pages/NewsDetail.jsx src/pages/Registration.jsx src/pages/Sponsors.jsx src/pages/Contact.jsx
git commit -m "feat: wire useDocumentMeta into every public page"
```

---

### Task 3: `robots.txt` e proxy della sitemap

**Files:**
- Create: `magic-volley-frontend/public/robots.txt`
- Create: `magic-volley-frontend/public/_redirects`

**Interfaces:**
- Consumes: l'endpoint `/sitemap.xml` che verrà creato nel Task 4 sul backend Render già attivo (`https://magic-volley-backend.onrender.com`).

- [ ] **Step 1: Creare `public/robots.txt`**

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /area-riservata

Sitemap: https://www.magicvolleyadelfia.it/sitemap.xml
```

- [ ] **Step 2: Creare `public/_redirects`**

```
/sitemap.xml  https://magic-volley-backend.onrender.com/sitemap.xml  200
```

(Status `200` = rewrite: Render serve il contenuto del backend mantenendo l'URL `/sitemap.xml` nella barra degli indirizzi, invece di fare un redirect visibile all'utente/ai bot.)

- [ ] **Step 3: Verifica manuale**

```bash
cd magic-volley-frontend
npm run build
```

Controlla che `robots.txt` e `_redirects` compaiano dentro `dist/` (Vite copia il contenuto di `public/` così com'è):

```bash
ls dist/robots.txt dist/_redirects
```

Expected: entrambi i file elencati senza errori.

Il comportamento reale del rewrite (`/sitemap.xml` che restituisce l'XML del backend) si potrà verificare solo dopo il prossimo deploy su Render, una volta completato anche il Task 4 — annotalo come verifica da fare in produzione dopo il deploy.

- [ ] **Step 4: Commit**

```bash
git add public/robots.txt public/_redirects
git commit -m "feat: add robots.txt and sitemap.xml proxy rewrite"
```

---

### Task 4: Endpoint backend `GET /sitemap.xml`

**Files:**
- Create: `magic-volley-backend/app/routers/sitemap.py`
- Modify: `magic-volley-backend/app/main.py:15` (import) e dopo la riga 61 (include_router)
- Modify: `magic-volley-backend/.env.example`

**Interfaces:**
- Consumes: `models.News` (campi `slug`, `published`), `models.Player` (campi `id`, `is_active`) da `app.models`; `get_db` da `app.database`.
- Produces: route `GET /sitemap.xml` che risponde con XML (`Content-Type: application/xml`), montata senza prefisso (non sotto `/api`, perché deve essere raggiungibile a `/sitemap.xml` esatto).

- [ ] **Step 1: Creare il router**

```python
"""
Genera sitemap.xml al volo, includendo le pagine statiche pubbliche più
ogni news pubblicata e ogni giocatrice attiva. Non richiede autenticazione:
è un endpoint pubblico, come robots.txt.
"""
import os
from xml.sax.saxutils import escape

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database import get_db
from app import models

router = APIRouter(tags=["Sitemap"])

PUBLIC_SITE_URL = os.getenv("PUBLIC_SITE_URL", "https://www.magicvolleyadelfia.it").rstrip("/")

STATIC_PATHS = [
    "/", "/societa", "/squadre", "/calendario", "/news",
    "/gallery", "/sponsor", "/contatti", "/iscriviti",
]


def _url_entry(path: str) -> str:
    return f"  <url>\n    <loc>{escape(PUBLIC_SITE_URL + path)}</loc>\n  </url>"


@router.get("/sitemap.xml")
def sitemap(db: Session = Depends(get_db)):
    entries = [_url_entry(p) for p in STATIC_PATHS]

    published_news = (
        db.query(models.News.slug).filter(models.News.published == True).all()  # noqa: E712
    )
    entries += [_url_entry(f"/news/{slug}") for (slug,) in published_news]

    active_players = (
        db.query(models.Player.id).filter(models.Player.is_active == True).all()  # noqa: E712
    )
    entries += [_url_entry(f"/giocatrici/{player_id}") for (player_id,) in active_players]

    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(entries)
        + "\n</urlset>"
    )
    return Response(content=xml, media_type="application/xml")
```

- [ ] **Step 2: Montare il router in `main.py`**

Modifica la riga di import (riga 15):

```python
from app.routers import auth, teams, players, staff, matches, news, registrations, sponsors, guardian_auth, gallery, sitemap
```

Aggiungi dopo l'ultimo `app.include_router(...)` esistente (dopo `app.include_router(gallery.router)`):

```python
app.include_router(sitemap.router)
```

- [ ] **Step 3: Aggiungere `PUBLIC_SITE_URL` a `.env.example`**

Aggiungi in fondo al file, dopo la riga `ALLOWED_ORIGINS=...`:

```
# URL pubblico del sito (usato per generare gli URL assoluti nella sitemap.xml)
PUBLIC_SITE_URL=https://www.magicvolleyadelfia.it
```

- [ ] **Step 4: Verifica manuale**

Con il backend avviato in locale (`uvicorn app.main:app --reload`) e almeno una news pubblicata + una giocatrice attiva già presenti nel DB di sviluppo:

```bash
curl -s http://localhost:8000/sitemap.xml
```

Expected: XML valido che inizia con `<?xml version="1.0" encoding="UTF-8"?>`, contiene un `<url><loc>` per ognuna delle 9 route statiche, un `<url><loc>https://www.magicvolleyadelfia.it/news/<slug-vero></loc>` per la news pubblicata, e un `<url><loc>https://www.magicvolleyadelfia.it/giocatrici/<id-vero></loc>` per la giocatrice attiva.

- [ ] **Step 5: Commit**

```bash
cd ../magic-volley-backend
git add app/routers/sitemap.py app/main.py .env.example
git commit -m "feat: add dynamic sitemap.xml endpoint"
```

---

### Task 5: Code splitting per pannello admin e area riservata

**Files:**
- Modify: `magic-volley-frontend/src/App.jsx`

**Interfaces:**
- Consumes: `Loading` da `./components/Feedback` (già esistente).

- [ ] **Step 1: Sostituire gli import statici con `React.lazy`**

Nella riga 1, aggiungi `lazy` e `Suspense` all'import di React Router esistente diventa un import React separato. Sostituisci le prime righe:

```js
import { Routes, Route } from 'react-router-dom'
```

con:

```js
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
```

Sostituisci questo blocco di import (admin + guardian):

```js
import Login from './pages/admin/Login'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminTeams from './pages/admin/AdminTeams'
import AdminPlayers from './pages/admin/AdminPlayers'
import AdminStaff from './pages/admin/AdminStaff'
import AdminMatches from './pages/admin/AdminMatches'
import AdminNews from './pages/admin/AdminNews'
import AdminRegistrations from './pages/admin/AdminRegistrations'
import AdminSponsors from './pages/admin/AdminSponsors'
import AdminGallery from './pages/admin/AdminGallery'

import GuardianLogin from './pages/guardian/GuardianLogin'
import ActivateAccount from './pages/guardian/ActivateAccount'
import GuardianLayout from './pages/guardian/GuardianLayout'
import GuardianDashboard from './pages/guardian/GuardianDashboard'
```

con:

```js
const Login = lazy(() => import('./pages/admin/Login'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminTeams = lazy(() => import('./pages/admin/AdminTeams'))
const AdminPlayers = lazy(() => import('./pages/admin/AdminPlayers'))
const AdminStaff = lazy(() => import('./pages/admin/AdminStaff'))
const AdminMatches = lazy(() => import('./pages/admin/AdminMatches'))
const AdminNews = lazy(() => import('./pages/admin/AdminNews'))
const AdminRegistrations = lazy(() => import('./pages/admin/AdminRegistrations'))
const AdminSponsors = lazy(() => import('./pages/admin/AdminSponsors'))
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'))

const GuardianLogin = lazy(() => import('./pages/guardian/GuardianLogin'))
const ActivateAccount = lazy(() => import('./pages/guardian/ActivateAccount'))
const GuardianLayout = lazy(() => import('./pages/guardian/GuardianLayout'))
const GuardianDashboard = lazy(() => import('./pages/guardian/GuardianDashboard'))
```

Aggiungi anche l'import di `Loading`, vicino agli altri import di componenti:

```js
import { Loading } from './components/Feedback'
```

- [ ] **Step 2: Avvolgere `<Routes>` in `<Suspense>`**

Nel corpo di `App()`, trova:

```jsx
      <Routes>
        {/* Sito pubblico */}
```

e sostituiscilo con:

```jsx
      <Suspense fallback={<Loading label="Caricamento…" />}>
      <Routes>
        {/* Sito pubblico */}
```

Trova la chiusura corrispondente (l'ultimo `</Routes>` del file, subito prima di `</GuardianAuthProvider>`) e sostituiscila:

```jsx
      </Routes>
    </GuardianAuthProvider>
```

con:

```jsx
      </Routes>
      </Suspense>
    </GuardianAuthProvider>
```

- [ ] **Step 3: Verifica manuale — funzionamento**

```bash
cd magic-volley-frontend
npm run dev
```

Apri `/admin/login` e `/area-riservata/login` nel browser: verifica che le pagine carichino normalmente (con un breve flash del fallback "Caricamento…" alla prima visita, impercettibile in locale ma visibile mettendo il devtools in "Slow 3G" nel pannello Network).

- [ ] **Step 4: Verifica manuale — bundle separato**

```bash
npm run build
ls -la dist/assets/*.js
```

Expected: più file `.js` distinti dentro `dist/assets/` (uno per il bundle principale, altri per i chunk lazy di admin/guardian), invece di un unico file monolitico. I nomi esatti dei chunk sono generati da Vite e non prevedibili in anticipo — l'importante è che ce ne sia più di uno.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "perf: lazy-load admin and guardian route trees"
```

---

### Task 6: Lazy-loading immagini sotto la piega

**Files:**
- Modify: `magic-volley-frontend/src/pages/Home.jsx`
- Modify: `magic-volley-frontend/src/pages/News.jsx`
- Modify: `magic-volley-frontend/src/pages/Teams.jsx`
- Modify: `magic-volley-frontend/src/pages/PlayerDetail.jsx`

- [ ] **Step 1: Home.jsx — immagine copertina news**

Trova (nella sezione "NEWS"):

```jsx
              {item.cover_image_url && (
                <div className="aspect-[16/9] overflow-hidden bg-navy-light/10">
                  <img src={item.cover_image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
```

Sostituisci con:

```jsx
              {item.cover_image_url && (
                <div className="aspect-[16/9] overflow-hidden bg-navy-light/10">
                  <img
                    src={item.cover_image_url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
```

(L'immagine hero della Home, `logo-dark.jpg`, resta invariata: è above-the-fold.)

- [ ] **Step 2: News.jsx — immagine card lista**

Trova:

```jsx
            {item.cover_image_url && (
              <div className="aspect-[16/9] overflow-hidden bg-navy-light/10">
                <img src={item.cover_image_url} alt="" className="w-full h-full object-cover" />
              </div>
            )}
```

Sostituisci con:

```jsx
            {item.cover_image_url && (
              <div className="aspect-[16/9] overflow-hidden bg-navy-light/10">
                <img
                  src={item.cover_image_url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
```

- [ ] **Step 3: Teams.jsx — avatar giocatrici nel roster**

Trova (dentro `PlayerCard`):

```jsx
      {player.photo_url ? (
        <img
          src={player.photo_url}
          alt={`${player.first_name} ${player.last_name}`}
          className="w-11 h-11 rounded-full object-cover object-top shrink-0"
        />
      ) : (
```

Sostituisci con:

```jsx
      {player.photo_url ? (
        <img
          src={player.photo_url}
          alt={`${player.first_name} ${player.last_name}`}
          loading="lazy"
          decoding="async"
          className="w-11 h-11 rounded-full object-cover object-top shrink-0"
        />
      ) : (
```

- [ ] **Step 4: PlayerDetail.jsx — foto scheda giocatrice**

Trova:

```jsx
            {player.photo_url && (
              <img
                src={player.photo_url}
                alt={`${player.first_name} ${player.last_name}`}
                className="w-56 md:w-72 max-h-96 object-cover object-top rounded-t-2xl justify-self-center md:justify-self-end"
              />
            )}
```

Sostituisci con:

```jsx
            {player.photo_url && (
              <img
                src={player.photo_url}
                alt={`${player.first_name} ${player.last_name}`}
                loading="lazy"
                decoding="async"
                className="w-56 md:w-72 max-h-96 object-cover object-top rounded-t-2xl justify-self-center md:justify-self-end"
              />
            )}
```

- [ ] **Step 5: Verifica manuale**

```bash
cd magic-volley-frontend
npm run dev
```

Apri `/`, `/news`, `/squadre` e la scheda di una giocatrice attiva. In devtools → Elements, controlla che i quattro `<img>` modificati abbiano l'attributo `loading="lazy"` nel DOM. In devtools → Network, ricarica la pagina e verifica che le immagini fuori dallo schermo iniziale non vengano scaricate finché non scorri fino a raggiungerle.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.jsx src/pages/News.jsx src/pages/Teams.jsx src/pages/PlayerDetail.jsx
git commit -m "perf: lazy-load below-the-fold images"
```

---

## Nota post-piano

Dopo il deploy su Render di entrambe le modifiche (frontend e backend), verificare in produzione:
- `https://www.magicvolleyadelfia.it/robots.txt` risponde con il contenuto atteso;
- `https://www.magicvolleyadelfia.it/sitemap.xml` risponde con l'XML generato dal backend (non un redirect visibile, non un 404);
- il titolo della tab cambia navigando tra le pagine reali in produzione.

Questa verifica di produzione non può essere fatta ora (richiede il deploy) — va programmata come ultimo passo dopo aver eseguito questo piano.
