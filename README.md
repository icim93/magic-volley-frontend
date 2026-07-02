# Magic Volley Adelfia — Frontend

Sito pubblico + pannello gestionale, in React + Vite + Tailwind. Si collega al backend FastAPI (`magic-volley-backend`).

## Avvio in locale

```bash
npm install
cp .env.example .env      # e verifica che VITE_API_URL punti al backend (default: http://localhost:8000)
npm run dev
```

Il sito parte su `http://localhost:5173`. Assicurati che il backend sia già avviato (vedi README del backend) e che tu abbia creato un utente admin con `python create_admin.py`.

- Sito pubblico: `http://localhost:5173/`
- Pannello gestionale: `http://localhost:5173/admin/login`

## Struttura

```
src/
  lib/api.js               -> client Axios, aggiunge automaticamente il token JWT alle richieste
  context/AuthContext.jsx   -> stato di login del pannello admin
  components/
    Navbar.jsx / Footer.jsx      -> layout del sito pubblico
    Feedback.jsx                  -> stati di caricamento/vuoto/errore, divisore "traiettoria"
    ProtectedRoute.jsx             -> blocca l'accesso a /admin se non loggati
    admin/EntityManager.jsx         -> componente generico di gestione CRUD, riusato da tutte
                                       le pagine admin (tabella + form in overlay)
  pages/
    Home, Teams, Calendar, News, NewsDetail, Registration, Sponsors, Contact  -> sito pubblico
    admin/
      Login, AdminLayout, Dashboard
      AdminTeams, AdminPlayers, AdminStaff, AdminMatches,
      AdminNews, AdminRegistrations, AdminSponsors
```

## Identità visiva

Palette e tipografia derivate dal logo Magic Volley Adelfia:
- Navy `#1B3A6B`, Navy scuro `#14213D`, Azzurro `#5B85C9`
- Ambra `#F2A93B`, Ambra scuro `#E07B1A`
- Crema `#FAF7F1` (sfondo)
- Font: **Unbounded** (titoli), **Inter** (testo), **Space Mono** (punteggi/numeri di maglia/date)

Il motivo dei tre cerchi del logo torna come separatore "a traiettoria" tra le sezioni del sito.

## Build di produzione

```bash
npm run build
```

Genera la cartella `dist/`, pronta per il deploy (es. Vercel, Netlify, o qualsiasi hosting statico).
Ricorda di impostare `VITE_API_URL` come variabile d'ambiente sulla piattaforma di hosting, puntando all'URL del backend in produzione.

## Note per l'estensione futura

- **Upload immagini**: al momento i campi "URL foto/logo" richiedono un link diretto all'immagine (es. da un servizio di hosting immagini). Se vuoi caricare file direttamente dal pannello, serve aggiungere un endpoint di upload sul backend (es. verso S3/Cloudinary) e un componente di upload qui.
- **Pagamenti iscrizioni**: il flusso attuale gestisce solo lo stato "in attesa di pagamento" manualmente; per un pagamento online reale andrebbe integrato Stripe o PayPal nel form di iscrizione.
