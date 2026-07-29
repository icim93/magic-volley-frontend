# SEO & Performance — Design

Data: 2026-07-29

## Contesto

Il sito Magic Volley Adelfia (React + Vite SPA, backend FastAPI separato) ha una
sola `<title>` e `<meta name="description">` statiche in `index.html`, condivise
da tutte le pagine. Non esistono `robots.txt`, `sitemap.xml`, tag Open Graph, né
code splitting o lazy-loading immagini oltre alla Gallery. Questo lavoro copre la
prima fetta di miglioramenti SEO/performance concordata con il cliente, a parità
di design visivo, copy e modello dati.

Dominio di produzione confermato: `magicvolleyadelfia.it`.

## Vincolo tecnico noto (accettato)

Il sito è una SPA client-side pura, senza SSR. I tag impostati via JavaScript
dopo il mount:
- **funzionano** per Google/Bing (Googlebot esegue JS e indicizza titolo/
  descrizione per pagina) e per il titolo mostrato nella tab del browser;
- **non funzionano** per i crawler di anteprima di WhatsApp/Facebook/Twitter,
  che leggono l'HTML grezzo prima che React esegua. Le anteprime social per i
  singoli articoli/schede restano quindi generiche (logo + descrizione del
  sito) fino a un eventuale intervento futuro (SSR parziale o proxy che
  rileva gli user-agent dei bot social e serve tag pre-renderizzati).
  **Fuori scope per questo giro**, da tracciare come nota per estensioni
  future (come già fatto nel README per upload immagini e pagamenti).

## Componenti

### 1. Hook `useDocumentMeta`

Nuovo file `src/hooks/useDocumentMeta.js`. Nessuna nuova dipendenza (niente
react-helmet-async). Firma:

```js
useDocumentMeta({ title, description, image, url, type })
```

Al mount (e quando cambiano gli argomenti, es. slug news):
- imposta `document.title` (con suffisso fisso, es. `"{titolo} · Magic Volley Adelfia ASD"`);
- crea/aggiorna `<meta name="description">`;
- crea/aggiorna `<meta property="og:title">`, `og:description`, `og:image`,
  `og:url`, `og:type` (default `website`, `article` per le news);
- crea/aggiorna `<meta name="twitter:card" content="summary_large_image">`,
  `twitter:title`, `twitter:description`, `twitter:image`.

`image` di default è `/logo.png` per le pagine senza foto propria; News e
PlayerDetail passano `cover_image_url` / `photo_url` quando disponibili.

Ogni pagina pubblica (Home, Club, Teams, PlayerDetail, Gallery, Calendar,
News, NewsDetail, Registration, Sponsors, Contact) chiama l'hook con i propri
valori. Le pagine admin/guardian non lo usano (non indicizzate, `robots.txt`
le esclude comunque).

### 2. `robots.txt`

Nuovo file statico `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /area-riservata

Sitemap: https://magicvolleyadelfia.it/sitemap.xml
```

### 3. `sitemap.xml` (generato dal backend)

Nuovo endpoint `GET /sitemap.xml` in `magic-volley-backend` (router dedicato o
aggiunto a `main.py`), risposta `Content-Type: application/xml`. Contenuto:
- le route statiche pubbliche: `/`, `/societa`, `/squadre`, `/calendario`,
  `/news`, `/gallery`, `/sponsor`, `/contatti`, `/iscriviti`;
- `/news/{slug}` per ogni news con `published = true`;
- `/giocatrici/{id}` per ogni giocatrice con `is_active = true`.

Tutti gli URL nel sitemap usano il dominio pubblico del frontend
(`https://magicvolleyadelfia.it`), non l'URL del backend — servirà quindi una
costante/config per il base URL pubblico (env var lato backend, es.
`PUBLIC_SITE_URL`, default `https://magicvolleyadelfia.it`).

Per esporre il file alla radice del dominio frontend (dove Google/robots.txt
lo cercano) senza duplicare la logica lato frontend, si aggiunge un
`vercel.json` nel repo frontend con un rewrite:

```json
{
  "rewrites": [
    { "source": "/sitemap.xml", "destination": "https://<backend-url>/sitemap.xml" }
  ]
}
```

Il valore reale di `<backend-url>` verrà inserito al momento del deploy (non
ancora avvenuto); il file viene comunque aggiunto ora così è pronto.

### 4. Code splitting

In `src/App.jsx`, le route sotto `/admin/*` e `/area-riservata/*` passano da
import statici a `React.lazy(() => import(...))`, con un `<Suspense
fallback={...}>` che avvolge l'intero albero di `<Routes>`. Le pagine
pubbliche restano import statici (sono il punto d'ingresso principale e già
leggere). Questo evita che ogni visitatore pubblico scarichi anche il bundle
del pannello admin (EntityManager + tutte le pagine `Admin*`) e dell'area
riservata famiglie.

Fallback di sospensione: riuso del componente `Loading` già esistente in
`Feedback.jsx`, centrato in pagina.

### 5. Lazy-loading immagini

Aggiunta di `loading="lazy" decoding="async"` alle immagini sotto la piega in:
- Home: card squadre (nessuna immagine attuale, salta) e card news (`cover_image_url`);
- News: card lista news;
- Teams: eventuali foto squadra (`photo_url`) se presenti;
- PlayerDetail: foto giocatrice.

Esclusa esplicitamente l'immagine hero della Home (`logo-dark.jpg`), che resta
eager perché è above-the-fold e influisce sul LCP.

## Testing

- Verifica manuale: aprire ogni pagina pubblica e controllare in devtools che
  `document.title` e i meta tag cambino correttamente (incluso al cambio di
  slug/id senza reload completo, es. da un articolo all'altro via link interni).
- `curl http://localhost:8000/sitemap.xml` con almeno una news pubblicata e
  una giocatrice attiva a DB: verificare che compaiano i rispettivi URL.
- `npm run build` seguito da ispezione di `dist/assets`: confermare che
  esista un chunk separato per l'area admin (non incluso nel bundle
  principale caricato da `/`).
- Verifica visuale che le pagine pubbliche continuino a funzionare invariate
  (nessuna regressione visiva o di navigazione dovuta al code splitting).

## Fuori scope (annotato per il futuro)

- Anteprime social (WhatsApp/Facebook/Twitter) corrette per articoli e schede
  giocatrici — richiede SSR parziale o proxy bot-aware.
- Upload immagini diretto dal pannello (già in README).
- Pagamenti online iscrizioni (già in README).
