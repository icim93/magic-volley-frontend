// Testi mostrati nello step 2 del modulo di iscrizione (/iscriviti).
// Ogni "text" è semplice testo multi-riga (niente markup), mostrato in un
// riquadro scrollabile nel form.
//
// Stato dei contenuti (aggiornato 2026-08-31):
// - regolamento, statuto, safeguarding: testi UFFICIALI, trascritti dai
//   documenti forniti dalla società (Regolamento associativo.pdf, Statuto.pdf,
//   MOG DELIBERATO PDF.pdf). Pronti per la produzione.
// - privacy (include anche l'autorizzazione foto): bozza scritta da Claude in
//   stile GDPR standard, in assenza di un documento ufficiale della società —
//   falla verificare da un consulente/legale prima di considerarla definitiva.
// Le assicurazioni CSEN/FIPAV non sono documenti a sé in questo step: restano
// referenziate all'interno del Regolamento, con link diretto alle polizze caricate.

// URL dei PDF originali su Supabase Storage (caricati con upload_source_documents.py
// dalla cartella backend, che scrive gli URL reali — con nome file casuale — in
// Statuti/document_urls.json). Valorizzati subito dopo l'upload.
export const ORIGINAL_DOCUMENT_URLS = {
  regolamento: 'https://uqhbujsirvupfdcdiesa.supabase.co/storage/v1/object/public/media/documenti-originali/1fa9b858fe6a4983a1cd0c7778ba9a01.pdf',
  statuto: 'https://uqhbujsirvupfdcdiesa.supabase.co/storage/v1/object/public/media/documenti-originali/d134be0938c5463f83c2eca8f6b3daff.pdf',
  safeguarding: 'https://uqhbujsirvupfdcdiesa.supabase.co/storage/v1/object/public/media/documenti-originali/11d5718bef58492aabd2a9d11807376e.pdf',
}

export const INSURANCE_URLS = {
  csen: 'https://uqhbujsirvupfdcdiesa.supabase.co/storage/v1/object/public/media/documenti-originali/6ba498bcbd64427f936d8620bc72d7ee.pdf',
  fipav: 'https://uqhbujsirvupfdcdiesa.supabase.co/storage/v1/object/public/media/documenti-originali/4bda4bd6ec7f4057b14beeba3422134f.pdf',
}

export const REGISTRATION_DOCUMENTS = [
  {
    key: 'regolamento',
    title: 'Regolamento interno',
    description: 'Iscrizione, quote, assicurazione, comportamento in palestra e in trasferta.',
    links: [
      { label: 'Documento originale (PDF)', url: ORIGINAL_DOCUMENT_URLS.regolamento },
      { label: 'Polizza infortuni CSEN (PDF)', url: INSURANCE_URLS.csen, required: true },
      { label: 'Polizza infortuni FIPAV (PDF)', url: INSURANCE_URLS.fipav, required: true },
    ],
    text: `Regolamento Associativo

Obiettivo della Magic Volley Adelfia Associazione Sportiva Dilettantistica è quello di diffondere la pratica della pallavolo sia sotto l'aspetto ludico e agonistico, ma soprattutto quello di consentire ai propri associati uno sviluppo della personalità armonico ed equilibrato.
I corsi hanno una durata di circa dieci mesi per tutte le attività e possono essere protratti fino alla fine di luglio con l'attività del campo estivo.
L'iscrizione ha una validità annuale a partire dal primo di settembre per finire al trentuno di agosto ed è subordinata al versamento della quota che annualmente viene determinata dal Consiglio Direttivo per coprire gli oneri sostenuti dall'Associazione.
Gli associati/tesserati saranno ammessi ad utilizzare i servizi dell'Associazione solo dopo aver espletato tutte le formalità di rito previste per l'iscrizione:
1) Sottoscrizione modulo d'iscrizione associativa/partecipazione corsi;
2) Sottoscrizione modulo tesseramento FIPAV;
3) Presentazione del certificato medico per attività sportiva non agonistica;
4) Pagamento della Quota Associativa/Partecipazione corsi;
5) Pagamento della quota mensile partecipazione corsi.
Per quanto previsto dal punto 1 è possibile effettuare per i nuovi iscritti una lezione prova totalmente gratuita, previa sottoscrizione da parte di un genitore del modulo di assunzione di responsabilità civile e penale.
Per quanto previsto dal punto 3 gli associati che svolgono l'attività agonistica sono tenuti a svolgere la visita medico sportiva per l'idoneità agonistica presso un centro di medicina dello sport convenzionato. Senza l'idoneità di cui sopra l'associato non potrà svolgere alcun campionato federale ma potrà partecipare agli allenamenti della squadra di appartenenza (previa presentazione di un certificato per attività sportiva non agonistica).
Per quanto previsto dai punti quattro e cinque le quote già versate nel caso di espulsione per motivi disciplinari, assenza per malattia o per qualsiasi altra ragione non imputabile all'Associazione non saranno rimborsate. Le quote mensili vanno versate entro il cinque di ogni mese e comunque non oltre la seconda lezione/allenamento.
Per ragioni contabili non sono ammesse deroghe alle date indicate per il versamento delle quote, eventuali ritardi saranno considerati quali dichiarazioni di rinuncia. La dichiarazione di rinuncia al corso deve essere comunicata per iscritto entro cinque giorni dall'inizio del mese, pena il pagamento della quota mensile dovuta.
Gli associati non in regola con il versamento della quota mensile o rinunciatari non potranno beneficiare dei servizi dell'Associazione. Se volessero riprendere successivamente le attività dovranno riversare la quota Associativa e/o partecipazione corsi.

È prerogativa dell'Associazione decidere:
1) La composizione dei gruppi;
2) Istruttori e tecnici federali;
3) Giorni ed orari delle lezioni/allenamenti.
4) La partecipazione ai campionati di serie, minivolley e/o di categoria.
Per quanto previsto dal punto 3 le lezioni/allenamenti coincidenti con le festività non saranno effettuati.
Per quanto previsto dal punto 4, i genitori all'atto dell'iscrizione sono tenuti a comunicare eventuali situazioni che possano impedire la partecipazione del proprio figlio ai campionati svolti dal gruppo di appartenenza.
Tutti gli associati al termine del turno di lezione/allenamento devono ritirare tutti gli effetti personali. In ogni caso l'Associazione non si assume nessuna responsabilità circa oggetti e/o indumenti eventualmente dimenticati o smarriti.
Gli associati potranno essere presi dai rispettivi genitori o da persone dagli stessi indicati, al termine della lezione. Si prega di voler comunicare eventuali rientri non accompagnati e di riprendere i propri figli entro massimo dieci minuti dal termine della lezione. La responsabilità ex art. 2048 c.c. e quella sulla custodia dei minori viene assunta dall'allenatore e/o istruttore dell'Associazione solo nella fascia oraria relativa all'attività svolta dall'associazione stessa nei confronti dell'atleta minorenne. Oltre tale lasso di tempo e al di fuori della palestra la Associazione si intende liberata da ogni tipo di responsabilità di cui sopra.
Per motivi di sicurezza, è fatto assoluto divieto ai genitori di sostare nelle strutture sportive, ove si svolgono i corsi, al fine di evitare qualsiasi tipo di accadimento fortuito (pallonate, ecc.). Gli stessi potranno accedere esclusivamente nelle aree appositamente individuate assumendosi qualsiasi responsabilità di carattere civile e/o penale.
L'abbigliamento per la partecipazione alle lezioni/allenamenti e/o alle manifestazioni organizzate dalla FIPAV a cui l'Associazione partecipa è a totale o parziale carico dei genitori su indicazione della stessa Associazione.
Chi non indossa la divisa ufficiale non potrà prendere parte alle gare, ma potrà regolarmente frequentare le lezioni o gli allenamenti.
Tutti gli allievi sono assicurati con specifica polizza base Federale della Compagnia Allianz Assicurazioni spa valida per gli associati tesserati alla FIPAV. Le condizioni di polizza sono interamente consultabili e scaricabili nel sito www.federvolley.it (cliccare su Documenti e quindi all'apertura della tendina cliccare su Assicurazioni).
Con l'iscrizione il socio accetta i termini e le condizioni previste dalla polizza FIPAV e libera espressamente l'Associazione Magic Volley Adelfia a.s.d. da ogni pretesa risarcitoria eccedente i limiti descritti nella suddetta polizza.
È compito dell'allenatore, di ogni genitore e dell'associato segnalare tempestivamente verbalmente e entro il giorno seguente per iscritto, eventuali infortuni accaduti durante partite ed allenamenti tramite il dirigente e la segreteria, poiché la denuncia deve essere effettuata entro trenta giorni dall'infortunio. È possibile stipulare delle polizze integrative con costo a carico dell'Associato e da richiedere alla dirigenza all'atto dell'iscrizione.

L'attività sportiva si svolge principalmente presso il palazzetto dello sport di Adelfia, le palestre scolastiche locali, salvo diverse disposizioni. Le lezioni/allenamenti si svolgono dal lunedì al sabato; partite amichevoli o ufficiali e tornei si svolgono prevalentemente la domenica mattina e/o pomeriggio, salve diverse disposizioni.
L'Associato è tenuto a garantire la sua presenza per l'attività organizzativa della Associazione per partite, tornei, gare e feste societarie. Se vi sono assenze per attività già programmate (settimane bianche, gite scolastiche, viaggi, ecc.) i genitori dell'atleta sono tenuti a segnalarlo con anticipo all'allenatore e/o il dirigente di riferimento.
Le assenze prolungate degli allenamenti senza una adeguata giustificazione o motivazione comportano, dopo trenta giorni consecutivi, l'esclusione dell'associato da ogni attività della Associazione senza alcun rimborso della quota versata. Si rammenta che l'assenza agli allenamenti e alle partite può danneggiare tutta la squadra e la Associazione.
Gli associati durante la gara e gli allenamenti devono osservare sempre ed in qualsiasi situazione, un atteggiamento leale, corretto e rispettoso nei confronti di dirigenti, allenatori, istruttori, altri associati, avversari, arbitri e pubblico. Non sono tollerati comportamenti violenti o comunque contrari all'etica sportiva. La Associazione è tenuta a prendere provvedimenti disciplinari contro chi non rispetti tali norme di comportamento ed è autorizzata, in casi estremi a sospenderli dall'attività sportiva.
Nelle palestre, negli spogliatoi e nei locali utilizzati dall'Associazione va tenuto un comportamento corretto, educato e rispettoso degli altri, evitando urla e schiamazzi. In palestra si accede con una corretta tenuta sportiva possibilmente indossata nello spogliatoio (ovviamente dove è possibile).
L'Associato è tenuto a presentarsi con puntualità alle lezioni/allenamenti e partite.

Ringraziandovi anticipatamente per la collaborazione, auguriamo a tutti i nostri associati e ai loro familiari di trascorrere un piacevole anno tutti insieme ricordandoci che la crescita armonica dei nostri figli passa attraverso:

Il rispetto del prossimo e di noi stessi`,
  },
  {
    key: 'statuto',
    title: 'Statuto della società',
    description: 'Denominazione, scopi, organi sociali, assemblea, patrimonio.',
    links: [{ label: 'Documento originale (PDF)', url: ORIGINAL_DOCUMENT_URLS.statuto }],
    text: `STATUTO di "MAGIC VOLLEY ADELFIA Associazione Sportiva Dilettantistica"

Articolo 1
Comparto Normativo - Denominazione - Sede - Durata - Oggetto sociale - Ambito di operatività

È costituita, ai sensi degli artt. 14 e seguenti del Codice Civile l'Associazione denominata "MAGIC VOLLEY ADELFIA Associazione Sportiva Dilettantistica". Le norme sull'ordinamento interno sono altresì ispirate a principi di democrazia e di uguaglianza dei diritti di tutti gli associati, con la previsione dell'elettività delle cariche sociali in ossequio ai principi di cui all'articolo 90 del DL 289/2002 e del D.Lgs 36/2021. L'Associazione potrà richiedere il Riconoscimento Giuridico secondo le modalità di legge, laddove ne avesse i necessari requisiti; ai fini sportivi l'Associazione è riconosciuta dalle FSN/DSA/EPS cui si affilierà.

L'Associazione ha la propria sede legale in Adelfia (BA) in Via Guido Rossa, n. 4C. Il trasferimento della sede legale all'interno del Comune di Adelfia (BA) può essere deliberato dall'organo di amministrazione (il Consiglio Direttivo) e in tal caso non comporta modifica statutaria, ma l'obbligo di comunicazione agli uffici competenti. L'Associazione ha durata illimitata. L'Associazione può istituire sedi secondarie locali, in tutta Italia.

L'Associazione non ha scopo di lucro né diretto né indiretto, così come definito all'articolo 8 del D.Lgs 36/2021, ed opera in ambito nazionale; ai sensi del D.Lgs 36/2021 inoltre, essa esercita, organizza e gestisce, in via stabile e principale, attività sportive dilettantistiche, ivi comprese la formazione, la didattica, la preparazione e l'assistenza all'attività sportiva dilettantistica.

Il sodalizio si conforma alle norme e alle direttive degli organismi dell'ordinamento sportivo, con particolare riferimento alle disposizioni del CONI nonché agli Statuti ed ai Regolamenti delle FSN/DSA/EPS cui l'associazione si affilia mediante domanda deliberata dal Consiglio Direttivo.

Articolo 2
- Fine Istituzionale e Attività -

L'associazione è un centro permanente di vita associativa a carattere volontario e democratico la cui attività è espressione di partecipazione, solidarietà e pluralismo. Essa opera per fini sportivi, ricreativi e culturali per l'esclusivo soddisfacimento di interessi collettivi, tramite l'organizzazione di attività sportive dilettantistiche (come già richiamato all'articolo 1), compresa l'attività didattica per l'avvio e l'aggiornamento e il perfezionamento nelle attività sportive.

L'associazione si propone di:
a) promuovere e sviluppare attività sportive dilettantistiche, in della particolare lo Sport Pallavolo in tutte le sue discipline (tra cui, a titolo esemplificativo ma non esaustivo: minivolley, beach volley e sitting volley), ed eventualmente, anche ogni altra disciplina sportiva riconosciuta dal CONI;
b) organizzare manifestazioni sportive in via diretta o collaborare con altri soggetti per la loro realizzazione;
c) studiare, promuovere, sviluppare e adottare nuove metodologie per migliorare l'organizzazione e la pratica dello sport e formare gli esperti in grado di proporle;
d) gestire impianti, propri o di terzi, adibiti a palestre, campi e strutture sportive di vario genere, eventualmente anche in collaborazione con altri enti ed ATI;
e) provvedere alla manutenzione delle infrastrutture, degli impianti e delle attrezzature sportive;
f) gestire e/o realizzare in qualunque forma impianti, attrezzature, strutture e locali necessari per le attività sportive;
g) provvedere alla fornitura delle attrezzature sportive per i propri atleti;
h) organizzare squadre sportive o singoli atleti per la partecipazione, a titolo solo esemplificativo e non esaustivo, a campionati, gare, concorsi, manifestazioni o iniziative di diverse discipline sportive;
i) indire corsi di avviamento agli sport, attività motoria e di mantenimento, corsi di formazione e di qualificazione per operatori sportivi;
l) organizzare eventi ed attività ludiche, ricreative e culturali a favore di un migliore utilizzo del tempo libero degli iscritti e della comunità (a titolo esemplificativo e non esaustivo, attività di pre e dopo scuola, centri estivi e camp sportivi), anche di somministrazione alimenti e bevande o turistiche;
m) collaborare con altre organizzazioni nazionali ed internazionali che promuovono le medesime discipline sportive.

L'Associazione non può svolgere attività diverse da quelle sopraindicate ad eccezione di quelle strumentali o secondarie a quelle istituzionali, secondo i criteri e i limiti definiti con decreto del Presidente del Consiglio dei ministri o della Autorità politica da esso delegata in materia di sport, di concerto con il Ministro dell'economia e delle finanze.

Articolo 3
- Associati e Tesserati -

A. Possono far parte dell'Associazione tutti coloro che ne condividono gli scopi fissati dallo Statuto e vogliono dare il proprio contributo personale e/o finanziario al perseguimento degli stessi. È espressamente esclusa la temporaneità della partecipazione alla vita associativa. Chiunque voglia aderire all'Associazione deve:
- presentare domanda scritta, sulla quale decide il Consiglio Direttivo a maggioranza;
- dichiarare di accettare le norme dello Statuto e dell'eventuale regolamento di attuazione;
- versare la quota annuale fissata dal Consiglio Direttivo.

La mancata ammissione deve essere motivata.

Gli associati si distinguono in fondatori, ordinari, onorari:
- gli associati fondatori sono coloro che hanno partecipato alla costituzione dell'Associazione;
- gli associati ordinari sono tutti coloro che aderiscono successivamente alla costituzione dell'Associazione, previa presentazione di apposita domanda scritta e relativa ammissione;
- gli associati onorari sono dichiarati tali dal Consiglio Direttivo per aver svolto attività particolarmente significative per la vita dell'Associazione o per notorietà e particolari meriti.

Tutti gli associati maggiorenni in regola col pagamento della quota sociale annuale hanno diritto a:
- partecipare a tutte le attività promosse dall'Associazione;
- candidarsi per ricoprire le cariche associative;
- partecipare alle Assemblee con diritto di voto attivo e passivo;
- votare per l'approvazione e le modificazioni dello statuto e dei regolamenti e per la nomina di tutti gli organi direttivi dell'associazione.

Tutti gli associati hanno i seguenti doveri:
- osservare lo Statuto nonché l'eventuale regolamento di attuazione e le delibere assunte dagli organi sociali nel rispetto delle disposizioni statutarie;
- collaborare con gli organi sociali per la realizzazione delle attività volte a compiere il Fine Istituzionale dell'Associazione (articolo 2);
- astenersi dall'intraprendere iniziative in contrasto con gli scopi dell'Associazione;
- pagare la quota associativa con le modalità e nei termini fissati dal Consiglio Direttivo.

B. Il tesserato è colui che partecipa alle attività dell'Associazione con una o più delle seguenti finalità:
- imparare o perfezionarsi in una o più discipline sportive;
- partecipare ai campionati o alle gare o alle manifestazioni della federazione sportiva nazionale, disciplina sportiva associata o ente di promozione sportiva alla quale l'Associazione è affiliata;
- svolgere una o più delle mansioni previste dai regolamenti e dagli statuti delle FSN/DSA/EPS cui l'Associazione è affiliata.
Il tesserato ha il dovere di rispettare ogni regola fissata dal Coni o dalla FSN/DSA/EPS cui l'associazione è affiliata.
Si intendono qui interamente richiamati gli articoli 15 e 16 del D.Lgs 36/2021 e dagli eventuali successivi decreti correttivi ed attuativi.

Articolo 4
- Perdita dello status di associato -

Gli associati cessano di appartenere all'Associazione per recesso, decadenza, esclusione e per causa di morte. L'associato può recedere in qualunque momento dall'Associazione; il recesso deve essere comunicato per iscritto al Consiglio Direttivo e ha effetto con lo scadere dell'anno in corso, purché sia fatto almeno 3 mesi prima.

Decade l'associato che, nonostante la messa in mora, non provveda a mettersi in regola con il pagamento della quota associativa annuale nei termini indicatigli.

L'esclusione è deliberata dall'Assemblea per gravi motivi e previa contestazione degli stessi, con assegnazione di un termine di 30 giorni per la formulazione di eventuali controdeduzioni.

In particolare, l'esclusione può essere deliberata nel caso in cui l'associato:
- abbia danneggiato moralmente e materialmente in modo grave l'Associazione;
- non abbia ottemperato in modo grave alle disposizioni dello statuto, ai regolamenti interni o alle deliberazioni assunte dagli organi sociali.

L'associato può ricorrere all'autorità giudiziaria entro 6 mesi dal giorno in cui gli è stata notificata la deliberazione. Nel caso sia istituito il Collegio dei Probiviri l'associato ricorrerà preliminarmente a tale organo, nel caso in cui non sia istituito il Collegio dei Probiviri l'associato ricorrerà preliminarmente alla prima Assemblea degli Associati utile. Nei casi espressamente previsti dai Regolamenti di Giustizia del Coni sarà possibile ricorrere al Collegio arbitrale del Coni stesso.

Gli associati che abbiano receduto o siano stati esclusi o che comunque abbiano cessato di appartenere all'Associazione, non possono ripetere (cioè richiedere in giudizio) i contributi versati e non hanno alcun diritto sul patrimonio dell'Associazione.

Articolo 5
- Organi sociali -

Sono Organi dell'Associazione:
- l'Assemblea degli associati (ordinaria e straordinaria);
- il Consiglio Direttivo;
- il Presidente;
- il Collegio dei Revisori dei Conti (se costituito nei casi previsti dalle norme di legge);
- Il Collegio dei Probiviri (se costituito).
Vige il rispetto della democrazia interna. Le cariche elettive vengono ricoperte a titolo gratuito salvo il rimborso delle spese sostenute in nome e per conto dell'Associazione (preventivamente autorizzate dal Consiglio Direttivo ed adeguatamente documentate) e salvo eventuali compensi per il consiglio direttivo purché non siano superiori al compenso massimo previsto per i presidenti dei collegi sindacali delle Spa di cui al D.P.R. 645/1994 e D.L. 239/1995 convertito dalla Legge 336/1995. Tutti gli organi sociali sono liberamente eleggibili.

Articolo 6
- Assemblea degli Associati -

L'Assemblea è l'organo sovrano dell'Associazione. Tutti gli associati maggiorenni in regola con il pagamento della quota associativa annuale hanno diritto di partecipare alle Assemblee sia ordinarie che straordinarie.

L'Assemblea ordinaria indirizza tutta l'attività dell'Associazione ed in particolare:
- approva le linee generali del programma di attività per l'anno sociale;
- approva il Rendiconto Economico Finanziario Annuale (da qui in poi R.E.F.A.) dell'anno precedente entro 4 mesi dalla chiusura dell'esercizio finanziario ed eventualmente un Bilancio di Previsione per l'anno in corso;
- elegge i membri del Consiglio Direttivo;
- elegge i membri del Collegio dei Revisori dei Conti (se costituito);
- elegge i membri del Collegio dei Probiviri (se costituito);
- delibera i regolamenti e le loro modifiche;
- delibera su tutte le questioni attinenti la gestione dell'Associazione che il Consiglio Direttivo riterrà di sottoporle;
- delibera in ordine all'esclusione degli associati;
- delibera la partecipazione ad Enti, società e ad altri organismi con finalità statutarie analoghe o strumentali per il raggiungimento degli scopi sociali;
- delibera le azioni di responsabilità contro gli amministratori per fatti da loro compiuti;
- delibera su ogni altra questione ad essa riservata dalla legge o dallo Statuto.

L'Assemblea deve essere convocata dal Presidente dell'Associazione con modalità tali da garantirne la conoscenza personale e diretta da parte degli associati. Le convocazioni devono essere effettuate mediante:
- idoneo avviso individuale, contenente gli argomenti all'ordine del giorno, da inviarsi ai singoli associati almeno 15 giorni prima della data prevista per la riunione;
- idoneo avviso collettivo (ad esempio con la pubblicazione sulla Bacheca Sociale o sul sito web dell'Associazione), contenente gli argomenti all'ordine del giorno, almeno 30 giorni prima della data prevista per la riunione.

L'Assemblea, sia ordinaria che straordinaria, viene convocata dal Presidente del Consiglio Direttivo. L'assemblea ordinaria viene convocata almeno una volta l'anno per l'approvazione dei bilanci/rendiconti ed ogni qualvolta lo stesso Presidente o 1/10 degli associati ne ravvisino l'opportunità.

Nelle deliberazioni di approvazione del bilancio/Rendiconto e in quelle che riguardano la loro responsabilità, gli amministratori non possono votare.

Qualora debbano essere affrontate specifiche problematiche possono partecipare all'Assemblea, senza diritto di voto, anche professionisti ed esperti esterni.

L'Assemblea straordinaria, da convocarsi con le modalità previste per quella ordinaria, delibera in ordine alle modifiche statutarie, allo scioglimento dell'Associazione e alla devoluzione del patrimonio che dovesse residuare conclusa la fase di liquidazione.

L'Assemblea, sia ordinaria che straordinaria, è presieduta dal Presidente del Consiglio Direttivo o, in sua assenza, dal Vicepresidente o, in assenza di entrambi, dal membro più anziano del Consiglio Direttivo. L'Assemblea ordinaria è validamente costituita in prima convocazione quando sia presente o rappresentata almeno la metà degli associati con diritto di voto. In seconda convocazione, da effettuarsi dopo che siano trascorse almeno 24 ore dalla prima, l'Assemblea è validamente costituita qualunque sia il numero degli associati con diritto di voto intervenuti o rappresentati. Le deliberazioni dell'Assemblea ordinaria sono assunte col voto favorevole della maggioranza dei presenti. L'Assemblea può riunirsi anche in un luogo diverso dalla sede sociale, purché in Italia (se non avviene in via telematica nel rispetto dei requisiti definiti dalle norme di legge).

Per le modifiche statutarie l'Assemblea straordinaria è validamente costituita con la presenza di almeno i 3/4 degli associati con diritto di voto e le deliberazioni sono assunte col voto favorevole della maggioranza dei presenti.

Per deliberare lo scioglimento dell'Associazione e la devoluzione del patrimonio occorre il voto favorevole di almeno tre quarti degli associati con diritto di voto.

Ogni associato può farsi rappresentare in Assemblea da un altro associato, mediante delega scritta, secondo il principio del voto singolo previsto dal Codice Civile. Ogni associato può essere portatore di un'unica delega. Gli associati non possono partecipare alla votazione su questioni concernenti i loro interessi e, comunque, in tutti i casi in cui vi sia un conflitto d'interessi.

I verbali di assemblea e gli eventuali Rendiconti/Bilanci approvati o esaminati, contenenti le deliberazioni adottate, devono essere sottoscritti dal Segretario e dal Presidente, e portati a conoscenza degli associati con modalità idonee (nei casi di legge anche attraverso la pubblicazione e/o l'invio agli associati), ancorché non intervenuti.
I verbali di cui sopra sono riportati, a cura del segretario, nell'apposito libro-verbali. Le deliberazioni adottate validamente dall'Assemblea obbligano tutti gli associati anche se assenti, dissenzienti o astenuti.

Articolo 7
- Consiglio Direttivo -

Il Consiglio Direttivo è composto da un numero di membri non inferiore a 3 e non superiore a 7, eletti dall'Assemblea degli associati. Il Consiglio Direttivo dura in carica 4 anni e i suoi membri sono rieleggibili. Possono farne parte esclusivamente gli associati maggiorenni in regola con il pagamento della quota associativa. Il Consiglio Direttivo nomina al suo interno il Presidente, il Vice Presidente e il Segretario. Nel caso in cui, per dimissioni o altra causa, uno o più membri del Consiglio vengano a mancare, l'Assemblea (o lo stesso Consiglio Direttivo) può provvedere alla loro sostituzione nominando i primi dei non eletti ed i nuovi nominati rimangono in carica fino allo scadere dell'intero Consiglio; questo meccanismo è attivabile fino ad esaurimento della graduatoria dei non eletti.
Alla scadenza naturale o nel caso in cui venga meno oltre la metà dei membri del Consiglio, l'Assemblea deve provvedere alla nomina del nuovo Consiglio entro il termine massimo di 3 mesi. I consiglieri che, senza giustificato motivo, non intervengano per tre sedute consecutive alle riunioni del Consiglio, sono considerati decaduti.
Il Consiglio Direttivo è organo esecutivo ed è dotato di tutti i poteri di ordinaria e straordinaria amministrazione che non spettino all'Assemblea e nei limiti di quanto stabilito annualmente dalla stessa.

Il Consiglio Direttivo ha i seguenti compiti:
- curare l'esecuzione delle deliberazioni dell'Assemblea;
- redigere i programmi delle attività istituzionali previste dallo Statuto sulla base delle linee approvate dall'Assemblea degli associati;
- redigere i bilanci/rendiconti da sottoporre all'Assemblea per l'approvazione;
- nominare al proprio interno il Presidente, il Vicepresidente, il Segretario;
- deliberare sulle domande di nuove adesioni;
- pronunciare la decadenza del consigliere che, senza giustificato motivo, non intervenga a 3 sedute consecutive;
- fissare la quota associativa annuale di adesione all'Associazione, gli importi dei contributi di partecipazione alle attività e i corrispettivi specifici per le eventuali attività commerciali;
- adottare provvedimenti disciplinari, come l'ammonizione, o la sospensione da 1 a 12 mesi. Resta facoltà dei soci soggetti a tali provvedimenti ricorrere contro gli stessi alla prima Assemblea degli Associati utile.

Il Consiglio Direttivo è presieduto dal Presidente; in caso di sua assenza dal Vicepresidente e, in assenza di entrambi, dal Consigliere più anziano.
Il Consiglio è convocato ogni qualvolta il Presidente lo ritenga opportuno o quando almeno i 1/3 dei componenti ne faccia richiesta. Esso assume le proprie deliberazioni con la presenza della maggioranza dei suoi membri ed il voto favorevole della maggioranza dei suoi membri presenti, ai quali spetta un solo voto. In seno al Consiglio non è ammessa delega.
Di ogni seduta del Consiglio Direttivo deve essere redatto apposito verbale dal Segretario che lo deve firmare unitamente al Presidente; i verbali sono riportati nell'apposito libro-verbali del Consiglio Direttivo.

È fatto divieto ai membri del Consiglio Direttivo di ricoprire qualsiasi carica in altre società o associazioni sportive dilettantistiche nell'ambito della medesima Federazione Sportiva Nazionale, disciplina sportiva associata o Ente di Promozione Sportiva riconosciuti dal CONI.
Gli amministratori dovranno svolgere il proprio incarico a titolo gratuito salvo quanto previsto all'articolo 5.

Articolo 8
- Presidente -

Il Presidente ha il compito di presiedere l'Assemblea degli associati nonché il Consiglio Direttivo, coordinandone i lavori. Al Presidente è attribuita la rappresentanza legale dell'Associazione di fronte ai terzi ed in giudizio, cura l'attuazione delle deliberazioni dell'Assemblea e del Consiglio, coordina le attività dell'Associazione, ha i poteri di ordinaria e straordinaria amministrazione. In caso di necessità ed urgenza il Presidente può esercitare i poteri del Consiglio Direttivo e adottare provvedimenti, riferendone tempestivamente allo stesso ed in ogni caso nella riunione immediatamente successiva, per la ratifica. In caso di sua assenza o impedimento, le sue funzioni spettano al Vicepresidente. Il mandato del Presidente è di pari durata di quello del Consiglio Direttivo, cioè 4 anni.

Articolo 9
- Collegio dei Revisori dei Conti -

Il Collegio dei Revisori dei Conti è un organo opzionale composto (salvo nei casi in cui la sua nomina sia obbligatoria per legge) da 3 membri effettivi e 2 supplenti nominati dall'Assemblea degli associati fra associati o terzi che siano in possesso di adeguate competenze economico-contabili, nei casi previsti dalla legge. I revisori non possono essere contemporaneamente membri del Consiglio Direttivo o del Collegio dei Probiviri. Il Collegio dei Revisori dura in carica 4 anni e i suoi membri sono rieleggibili. Il Collegio elegge al proprio interno il Presidente. Nel caso in cui, per dimissioni o altra causa, uno dei Revisori decada dall'incarico, subentra il Revisore supplente più anziano di età che rimane in carica fino allo scadere dell'intero Collegio.
Il Collegio dei Revisori ha il compito di controllare trimestralmente la gestione amministrativo/contabile, di esaminare in via preliminare i bilanci/rendiconti, di redigere una relazione di accompagnamento agli stessi. I Revisori hanno facoltà di partecipare, anche singolarmente, alle riunioni del Consiglio Direttivo senza diritto di voto.
L'attività del Collegio dei Revisori deve risultare da apposito verbale riportato nel libro dei verbali del Collegio dei Revisori, nel quale devono essere riportate anche le relazioni ai bilanci/rendiconti.

Articolo 10
- Vincolo di Giustizia e Collegio dei Probiviri -

L'Associazione si impegna a far rispettare ai propri associati, tesserati, atleti, partecipanti le disposizioni statutarie e regolamentarie proprie della FSN/DSA/EPS cui è affiliata, con conseguente devoluzione ai propri organi di giustizia e arbitrali delle controversie che dovessero insorgere tra gli associati o tra questi e l'Associazione stessa. È tuttavia obbligo delle parti cercare di comporre bonariamente la controversia nell'ambito dell'Associazione attraverso la costituzione del Collegio dei Probiviri.

Il Collegio dei Probiviri è quindi un organo opzionale composto da 3 membri, nominati dall'Assemblea (ove fosse necessario risolvere controversie tra associati o tra gli associati e il Consiglio Direttivo), fra gli associati maggiorenni in regola con il pagamento della quota associativa. I probiviri non possono essere contemporaneamente membri del Consiglio Direttivo o dell'Organo di Revisione.
Il Collegio dei Probiviri dura in carica 4 anni e i suoi membri sono rieleggibili.
Il Collegio è presieduto da un Presidente eletto a maggioranza fra i suoi componenti.
Il Collegio decide sulle controversie che dovessero insorgere tra associati, tra questi e l'Associazione o i suoi organi. Avverso il giudizio del Collegio, è possibile ricorrere al giudice ordinario.

Articolo 11
- Patrimonio dell'Associazione -

Il patrimonio dell'Associazione è indivisibile ed è costituito:
- da eventuali beni immobili, mobili registrati e mobili che diverranno di proprietà dell'Associazione o che potranno essere acquistati e/o acquisiti da lasciti e donazioni;
- da contributi, erogazioni, lasciti e donazioni di enti e soggetti pubblici e privati;
- da eventuali fondi di riserva o di accantonamento costituiti con gli avanzi di gestione o utili delle annualità precedenti.

Gli associati, che abbiano receduto o siano stati esclusi o che comunque abbiano cessato di appartenere all'associazione, non possono ripetere i contributi versati, né hanno alcun diritto sul patrimonio dell'associazione, come previsto dall'articolo 24 del Codice Civile.
Ancora, i contributi degli associati e i beni acquistati con questi contributi costituiscono il fondo comune dell'associazione. Finché questa dura, i singoli associati non possono chiedere la divisione del fondo comune, né pretendere la quota in caso di recesso, in conformità a quanto previsto dall'articolo 37 del Codice Civile.

Articolo 12
- Risorse economiche -

Le risorse economiche dell'associazione sono costituite da:
- quote e contributi degli associati e dei tesserati;
- eredità, donazioni e legati;
- contributi dello Stato, delle regioni, di enti locali, di enti o di istituzioni pubbliche, delle FSN/DSA/EPS a cui l'associazione è affiliata, anche finalizzati al sostegno di specifici e documentati programmi realizzati nell'ambito dei fini statutari, ivi compreso il 5 per mille;
- contributi dell'Unione europea e di organismi internazionali;
- entrate derivanti da prestazioni di servizi convenzionati;
- proventi delle cessioni di beni e servizi agli associati o ai partecipanti in conformità alle finalità istituzionali derivanti dal pagamento di corrispettivi specifici (compresi i contributi e le quote supplementari determinati in funzione delle maggiori o diverse prestazioni alle quali danno diritto) purché attuati dall'Associazione senza specifica organizzazione e senza che il valore dei corrispettivi ecceda i costi di diretta imputazione;
- erogazioni liberali degli associati e dei terzi;
- entrate derivanti da iniziative di raccolte fondi;
- altre eventuali entrate commerciali e non, previste dalle normative che regolano le Associazioni Sportive Dilettantistiche (tra cui a titolo esemplificativo ma non esaustivo, quelle previste per le entrate diverse di cui all'articolo 2 del presente statuto, quali: i proventi derivanti da sponsorizzazione, promo-pubblicitari, cessione di diritti e indennità legate alla formazione degli atleti e dalla gestione di impianti e strutture sportive);
- altre entrate compatibili previste dalle normative che regolano gli Enti Non Commerciali italiani.

Ogni quota o contributo associativo è intrasmissibile e non rivalutabile ad eccezione dei trasferimenti a causa di morte.
L'associazione ha il divieto di distribuire, anche in modo indiretto, utili e avanzi di gestione nonché fondi, riserve o capitale durante la vita dell'associazione, salvo che la destinazione o la distribuzione non siano imposte dalla legge.
Tutte le entrate ed eventuali avanzi di gestione sono destinati esclusivamente alla realizzazione delle finalità dell'associazione.

Articolo 13
- Rendiconto Economico Finanziario Annuale (R.E.F.A.) -

L'esercizio sociale dell'Associazione ha inizio il 1° gennaio e termina il 31 dicembre di ciascun anno.
Il Consiglio Direttivo redige il R.E.F.A., dal quale devono risultare i beni, i contributi o i lasciti ricevuti e le spese effettuate, e lo sottopone all'approvazione dell'Assemblea degli associati entro 4 mesi dalla chiusura dell'esercizio sociale.
Il Consiglio Direttivo redige, se richiesto dalle norme di legge, dagli associati o da Enti Pubblici per la partecipazione a gare/bandi/concorsi/appalti e simili il bilancio preventivo, che deve contenere le previsioni di entrata e di spesa, e lo sottopone all'approvazione dell'Assemblea degli Associati entro 4 mesi dall'inizio del nuovo esercizio sociale.
Gli eventuali utili ed avanzi di gestione devono essere obbligatoriamente destinati allo svolgimento dell'attività statutaria o all'incremento del patrimonio associativo.

Articolo 14
- Liquidazione e devoluzione del patrimonio -

Lo scioglimento dell'Associazione e la devoluzione del patrimonio vengono disposti con deliberazione dell'Assemblea Straordinaria approvata con il voto favorevole di almeno 3/4 degli associati con diritto di voto.
L'eventuale patrimonio residuo, ultimata la procedura di liquidazione effettuata secondo quanto stabilito dalle disposizioni di attuazione del codice civile, sarà devoluto ad altri Enti/Istituti sportivi aventi finalità sportive uguali o analoghe e operanti nel territorio sentito (se costituito) l'organismo di controllo di cui all'articolo 3, comma 190, della legge 23 dicembre 1996, n. 662, salvo diversa destinazione imposta dalla legge e sempre nel rispetto di quanto previsto all'articolo 7) comma 1) lettera h) del D.Lgs 36/2021.

Articolo 15
- Clausole speciali di garanzia dell'assenza di scopo di lucro -

È vietata la distribuzione, anche indiretta, di utili ed avanzi di gestione, fondi e riserve comunque denominati, a soci o associati, lavoratori e collaboratori, amministratori ed altri componenti degli organi sociali, anche nel caso di recesso o di qualsiasi altra ipotesi di scioglimento individuale del rapporto. Ai sensi e per gli effetti di cui al presente comma, si applica l'articolo 3, comma 2, ultimo periodo, e comma 2-bis, del decreto legislativo 3 luglio 2017, n. 112.

Articolo 16
- Lavoratori e volontari -

Per quanto concerne tali figure si rimanda alla disciplina delle norme legislative attuali e future in vigore.

Articolo 17
- Disposizioni finali -

Per quanto non espressamente previsto dal presente statuto si applicano le disposizioni dello statuto e dei regolamenti del CONI e della FSN/DSA/EPS a cui l'associazione è affiliata ed in subordine le norme del Codice Civile Italiano. Dal momento della loro entrata in vigore inoltre, si dovranno intendere qui integrati i dettami, ove pertinenti, del D.Lgs 36/2021 (comunemente definito quale "Riforma dello Sport") e dei suoi decreti attuativi e correttivi.`,
  },
  {
    key: 'privacy',
    title: 'Informativa Privacy (GDPR) e Autorizzazione all\'utilizzo delle immagini',
    description: 'Dati trattati, finalità, autorizzazione foto/video, diritti dell\'interessato.',
    text: `INFORMATIVA SUL TRATTAMENTO DEI DATI PERSONALI (Regolamento UE 2016/679 – GDPR) E AUTORIZZAZIONE ALL'UTILIZZO DELLE IMMAGINI

Titolare del trattamento
Il titolare del trattamento dei dati è Magic Volley Adelfia Associazione Sportiva Dilettantistica, con sede in Adelfia (BA), Via Guido Rossa n. 4C. Per qualsiasi richiesta relativa al trattamento dei dati personali è possibile scrivere a info@magicvolleyadelfia.it.

Dati raccolti e finalità del trattamento
In fase di iscrizione vengono raccolti i dati anagrafici (nome, cognome, data di nascita), i dati di contatto (email, telefono) e, per gli atleti minorenni, i dati del genitore/tutore. In fase di tesseramento e nel corso della stagione possono inoltre essere richiesti il certificato medico sportivo e, ove necessaria, ulteriore documentazione sanitaria.

Tali dati sono trattati per le seguenti finalità:
- gestione dell'iscrizione e del tesseramento sportivo;
- adempimenti nei confronti della Federazione Italiana Pallavolo (FIPAV) e degli enti di promozione sportiva (es. CSEN) cui l'Associazione è affiliata, incluso il tesseramento e la copertura assicurativa;
- organizzazione e gestione delle attività sportive, degli allenamenti, delle partite e degli eventi sociali;
- comunicazioni relative alla vita associativa (es. calendario, convocazioni, comunicazioni organizzative);
- adempimenti amministrativi, contabili e fiscali previsti dalla legge.

Base giuridica
Il trattamento si basa sull'esecuzione del rapporto associativo/di tesseramento sportivo instaurato con l'iscrizione, sull'adempimento di obblighi di legge e, per il trattamento delle immagini e per i dati dei minori, sul consenso espresso da chi esercita la responsabilità genitoriale.

Trattamento delle immagini e dei video
Con l'iscrizione, l'atleta (o chi esercita la responsabilità genitoriale, per i minori) autorizza Magic Volley Adelfia Associazione Sportiva Dilettantistica a riprendere, fotografare e pubblicare immagini e video ritraenti l'atleta durante allenamenti, partite ed eventi sociali, per finalità sportive, promozionali e informative della società e/o di un suo sponsor, ai sensi del Regolamento UE 2016/679 così come modificato dal D.Lgs. 101 del 10/08/2018.
Le immagini potranno essere utilizzate su: sito web ufficiale, canali social della società (Instagram, Facebook), materiale promozionale cartaceo o digitale.
L'autorizzazione è concessa a titolo gratuito e può essere revocata in qualsiasi momento con comunicazione scritta a info@magicvolleyadelfia.it; la revoca non ha effetto retroattivo sul materiale già pubblicato prima della richiesta.
La società si impegna a non utilizzare le immagini in contesti lesivi della dignità o dell'immagine dell'atleta.

Comunicazione e conservazione dei dati
I dati non sono ceduti a terzi se non per obblighi di legge o verso la Federazione/l'ente di promozione sportiva cui l'Associazione è affiliata (FIPAV, CSEN) e verso il fornitore della copertura assicurativa. I dati possono essere conservati su infrastrutture informatiche gestite da fornitori terzi (hosting, database, storage) che agiscono in qualità di responsabili del trattamento, nel rispetto della normativa vigente. I dati sono conservati per il tempo necessario alle finalità sopra indicate e comunque nei limiti previsti dalla legge.

Diritti dell'interessato
L'interessato (o chi esercita la responsabilità genitoriale, per i minori) può in ogni momento richiedere accesso, rettifica, cancellazione o limitazione del trattamento dei propri dati, nonché opporsi al trattamento, scrivendo a info@magicvolleyadelfia.it.`,
  },
  {
    key: 'safeguarding',
    title: 'Documento di Safe Guarding (Modello Organizzativo e di Controllo)',
    description: 'Tutela dei minori, prevenzione abusi, responsabile safeguarding, segnalazioni.',
    links: [{ label: 'Documento originale (PDF)', url: ORIGINAL_DOCUMENT_URLS.safeguarding }],
    text: `MODELLO ORGANIZZATIVO E DI CONTROLLO DELL'ATTIVITÀ SPORTIVA

Il presente modello organizzativo e di controllo dell'attività sportiva è redatto dalla Magic Volley Adelfia Associazione Sportiva Dilettantistica (di seguito, l'Associazione), come previsto dal comma 2 dell'articolo 16 del d.lgs. n. 39 del 28 febbraio 2021 e utilizzando le linee guida pubblicate dalla FIPAV e dal CSEN APS.
Si applica a chiunque partecipi con qualsiasi funzione o titolo all'attività della Associazione, indipendente dalla disciplina sportiva praticata. Ha validità quadriennale dalla data di approvazione e deve essere aggiornato ogni qual volta necessario al fine di recepire le eventuali modifiche e integrazioni dei Principi Fondamentali emanati dal CONI, le eventuali ulteriori disposizioni emanate dalla Giunta Nazionale del C.O.N.I. e le raccomandazioni dell'Osservatorio Permanente del CONI per le Politiche di Safeguarding.
L'obiettivo del presente modello è quello di promuovere una cultura e un ambiente inclusivo che assicurino la dignità e il rispetto dei diritti di tutti i tesserati, in particolare minori, e garantiscano l'uguaglianza e l'equità, nonché valorizzino le diversità, tutelando al contempo l'integrità fisica e morale di tutti i tesserati.
Il presente modello organizzativo e di controllo dell'attività sportiva deve essere pubblicato sulla homepage del sito dell'Associazione, affisso nella sede della medesima nonché comunicato al Safeguarding Office del CSEN e della FIPAV raggiungibile via mail agli indirizzi salvaguardi@csen.it, e safeguarding@federvolley.it insieme alla nomina del Responsabile contro abusi, violenze e discriminazioni nominato direttamente dalla Associazione.

Diritti e doveri
A tutti i tesserati e le tesserate sono riconosciuti i diritti fondamentali:
- a un trattamento dignitoso e rispettoso in ogni rapporto, contesto e situazione in ambito associativo;
- alla tutela da ogni forma di abuso, molestia, violenza di genere e ogni altra condizione di discriminazione, indipendentemente da etnia, convinzioni personali, disabilità, età, identità di genere, orientamento sessuale, lingua, opinione politica, religione, condizione patrimoniale, di nascita, fisica, intellettiva, relazionale o sportiva;
- a che la salute e il benessere psico-fisico siano garantiti come prevalenti rispetto a ogni risultato sportivo.
Coloro che prendono parte a qualsiasi titolo e in qualsiasi funzione e/o ruolo all'attività sportiva, in forma diretta o indiretta, sono tenuti a rispettare tutte le disposizioni e le prescrizioni a tutela degli indicati diritti dei tesserati e delle tesserate.
I tecnici, i dirigenti, i soci e tutti gli altri tesserati e tesserate sono tenuti a conoscere il presente modello, il Codice di condotta a tutela dei minori e per la prevenzione delle molestie, della violenza di genere e di ogni altra condizione di discriminazione e il Regolamento per la tutela dei tesserati dagli abusi e dalle condotte discriminatorie adottato dal CSEN APS e dalla FIPAV.

Prevenzione e gestione dei rischi
Comportamenti rilevanti

Ai fini del presente modello, costituiscono comportamenti rilevanti:
- l'abuso psicologico: qualunque atto indesiderato, tra cui la mancanza di rispetto, il confinamento, la sopraffazione, l'isolamento o qualsiasi altro trattamento che possa incidere sul senso di identità, dignità e autostima, ovvero tale da intimidire, turbare o alterare la serenità del tesserato, anche se perpetrato attraverso l'utilizzo di strumenti digitali;
- l'abuso fisico: qualunque condotta consumata o tentata (tra cui botte, pugni, percosse, soffocamento, schiaffi, calci o lancio di oggetti), che sia in grado in senso reale o potenziale di procurare direttamente o indirettamente un danno alla salute, un trauma, lesioni fisiche o che danneggi l'integrità psicofisica del tesserato. Tali atti possono anche consistere nell'indurre un tesserato a svolgere (al fine di una migliore performance sportiva) un'attività fisica inappropriata oppure forzare ad allenarsi atleti ammalati, infortunati o comunque doloranti. In quest'ambito rientrano anche quei comportamenti che favoriscono il consumo di alcol, di sostanze comunque vietate da norme vigenti o le pratiche di doping;
- la molestia sessuale: qualunque atto o comportamento indesiderato e non gradito di natura sessuale, sia esso verbale, non verbale o fisico che comporti fastidio o disturbo. Tali atti o comportamenti possono anche consistere nel rivolgere osservazioni o allusioni sessualmente esplicite, nonché richieste indesiderate o non gradite aventi connotazione sessuale, ovvero telefonate, messaggi, lettere od ogni altra forma di comunicazione a contenuto sessuale, anche con effetto intimidatorio, degradante o umiliante;
- l'abuso sessuale: qualsiasi comportamento o condotta avente connotazione sessuale, senza contatto o con contatto, e considerata non desiderata, o il cui consenso è costretto, manipolato, non dato o negato. Può consistere anche nel costringere un tesserato a porre in essere condotte sessuali inappropriate o indesiderate, o nell'osservare il tesserato in condizioni e contesti non appropriati;
- la negligenza: il mancato intervento di un dirigente, tecnico o qualsiasi tesserato, anche in ragione dei doveri che derivano dal suo ruolo, il quale, presa conoscenza di uno degli eventi, o comportamento, o condotta, o atto di cui al presente modello, omette di intervenire causando un danno, permettendo che venga causato un danno o creando un pericolo imminente di danno. Può consistere anche nel persistente e sistematico disinteresse, ovvero trascuratezza, dei bisogni fisici e/o psicologici del tesserato;
- l'incuria: la mancata soddisfazione delle necessità fondamentali a livello fisico, medico, educativo ed emotivo;
- l'abuso di matrice religiosa: l'impedimento, il condizionamento o la limitazione del diritto di professare liberamente la propria fede religiosa e di esercitarne in privato o in pubblico il culto purché non si tratti di riti contrari al buon costume;
- il bullismo, il cyberbullismo: qualsiasi comportamento offensivo e/o aggressivo che un singolo individuo o più soggetti possono mettere in atto, personalmente, attraverso i social network o altri strumenti di comunicazione, sia in maniera isolata, sia ripetutamente nel corso del tempo, ai danni di uno o più tesserati con lo scopo di esercitare un potere o un dominio sul tesserato. Possono anche consistere in comportamenti di prevaricazione e sopraffazione ripetuti e atti ad intimidire o turbare un tesserato che determinano una condizione di disagio, insicurezza, paura, esclusione o isolamento (tra cui umiliazioni, critiche riguardanti l'aspetto fisico, minacce verbali, anche in relazione alla performance sportiva, diffusione di notizie infondate, minacce di ripercussioni fisiche o di danneggiamento di oggetti posseduti dalla vittima);
- i comportamenti discriminatori: qualsiasi comportamento finalizzato a conseguire un effetto discriminatorio basato su etnia, colore, caratteristiche fisiche, genere, status socio economico, prestazioni sportive e capacità atletiche, religione, convinzioni personali, disabilità, età o orientamento sessuale.
I comportamenti rilevanti possono verificarsi in qualsiasi forma e modalità, comprese quelle di persona e tramite modalità informatiche, sul web e attraverso messaggi, e-mail, social network e blog.

Responsabile contro abusi, violenze e discriminazioni

Il Consiglio Direttivo nomina un Responsabile contro abusi, violenze e discriminazioni, con lo scopo di prevenire e contrastare ogni tipo di abuso, violenza e discriminazione sui soci nonché per garantire la protezione dell'integrità fisica e morale degli sportivi ed in generale di tutti i tesserati.
Il Responsabile contro abusi, violenze e discriminazioni, potrebbe essere preferibilmente soggetto autonomo e possibilmente indipendente dalle cariche sociali e da rapporti con gli allenatori e tecnici, verrà selezionato tra i soggetti che abbiano esperienza nel settore, competenze comunicative e capacità di gestione delle situazioni delicate. Dovrà essere opportunamente formato e partecipare ai seminari informativi organizzati dal CSEN APS e dalla FIPAV alle quali è affiliata.
Prima della nomina andrà acquisito il certificato del casellario giudiziale. Non può essere, infatti, designato come responsabile chi ha subito una condanna penale anche non definitiva per reati non colposi.
In ogni caso, il Responsabile Safeguarding all'interno della Associazione svolge funzioni di vigilanza circa l'adozione e l'aggiornamento dei modelli e dei codici di condotta, nonché di collettore di eventuali segnalazioni di condotte rilevanti ai fini delle politiche di safeguarding, potendo svolgere anche funzioni ispettive.
Il Responsabile safeguarding sarà tenuto a sensibilizzazione i membri della Associazione sulle questioni di safeguarding e sarà tenuto a collaborare con le autorità competenti.
Il Responsabile safeguarding dovrà definire e pubblicizzare i canali di comunicazione chiari per i membri dell'associazione sportiva per segnalare casi di abuso o maltrattamento e stabilire le procedure per la registrazione e la gestione delle segnalazioni ricevute.
Il Responsabile safeguarding dovrà garantire la confidenzialità e la riservatezza delle informazioni riguardanti casi di abuso o maltrattamento essendo tenuto a trattare le informazioni sensibili in modo riservato e nel rispetto della privacy delle persone coinvolte.
Il Consiglio direttivo potrà sospendere o rimuovere il Responsabile safeguarding in caso di mancata conformità ai requisiti o di violazione delle politiche dell'associazione relative alla protezione dei minori.

Uso degli spazi dell'Associazione

Deve essere sempre garantito l'accesso ai locali e agli spazi in gestione o in uso all'Associazione durante gli allenamenti e le sessioni prova di tesserati e tesserate minorenni a coloro che esercitano la responsabilità genitoriale o ai soggetti cui è affidata la cura degli atleti e delle atlete ovvero a loro delegati. Presso le strutture in gestione o in uso all'Associazione devono essere predisposte tutte le misure necessarie a prevenire qualsivoglia situazione di rischio.
Durante le sessioni di allenamento o di prova è consentito l'accesso agli spogliatoi esclusivamente agli atleti e alle atlete della Associazione.
Durante le sessioni di allenamento o di prova non è consentito l'accesso agli spogliatoi a utenti esterni o genitori/accompagnatori, se non previa autorizzazione da parte di un tecnico o dirigente e, comunque, solo per eventuale assistenza a tesserati e tesserate sotto gli 8 anni di età o con disabilità motoria o intelletivo/relazionale.
In caso di necessità, fermo restando la tempestiva richiesta di intervento al servizio di soccorso sanitario qualora necessario, l'accesso all'infermeria è consentito al medico sociale o, in caso di manifestazione sportiva, al medico di gara o, in loro assenza, a un tecnico formato sulle procedure di primo soccorso esclusivamente per le procedure strettamente necessarie al primo soccorso nei confronti della persona offesa. La porta dovrà rimanere aperta e, se possibile, dovrà essere presente almeno un'altra persona (atleta, tecnico, dirigente, collaboratore, eccetera).

Trasferte

In caso di trasferte che prevedano un pernottamento, agli atleti dovranno essere riservate camere, eventualmente in condivisione con atleti dello stesso genere, diverse da quelle in cui alloggeranno i tecnici, i dirigenti o altri accompagnatori, salvo nel caso di parentela stretta tra l'atleta e l'accompagnatore. Durante le trasferte di qualsiasi tipo è dovere degli accompagnatori vigilare sugli atleti accompagnati, soprattutto se minorenni, mettendo in atto tutte le azioni necessarie a garantire l'integrità fisica e morale degli stessi ed evitare qualsiasi comportamento rilevante ai fini del presente modello.

Inclusività

L'Associazione/Società garantisce a tutti i propri tesserati e ai tesserati di altre associazioni e società sportive dilettantistiche pari diritti e opportunità, indipendentemente da etnia, convinzioni personali, disabilità, età, identità di genere, orientamento sessuale, lingua, opinione politica, religione, condizione patrimoniale, di nascita, fisica, intellettiva, relazionale o sportiva.
L'Associazione si impegna, anche tramite accordi, convenzioni e collaborazioni con altre associazioni o società sportive dilettantistiche, a garantire il diritto allo sport agli atleti con disabilità fisica o intellettivo-relazionale, integrando suddetti atleti, anche tesserati per altre associazioni o società sportive dilettantistiche, nel gruppo di atleti tesserati per l'Associazione/Società loro coetanei.
La Associazione si impegna a garantire il diritto allo sport anche agli atleti svantaggiati dal punto di vista economico o famigliare, favorendo la partecipazione di suddetti atleti alle attività dell'associazione anche mediante sconti delle quote di tesseramento e/o mediante accordi, convenzioni e collaborazioni con enti del terzo settore operanti sul territorio e nei comuni limitrofi.

Contrasto dei comportamenti lesivi e gestione delle segnalazioni
Segnalazione dei comportamenti lesivi

In caso di presunti comportamenti lesivi, da parte di tesserati o di persone terze, nei confronti di altri tesserati, soprattutto se minorenni, deve essere tempestivamente segnalato al Responsabile contro abusi, violenze e discriminazioni nominato dalla Associazione tramite comunicazione a voce o via posta elettronica all'indirizzo email annalisalavopa74@gmail.com La password di accesso a tale indirizzo email sarà in possesso esclusivamente del Responsabile.
In caso dei suddetti comportamenti lesivi, se necessario, deve essere inviata segnalazione al Safeguarding Office CSEN e FIPAV per la tutela dei tesserati dagli abusi e dalle condotte discriminatorie agli indirizzi email salvaguardia@csen.it – safeguarding@federvolley.it
In caso di gravi comportamenti lesivi l'Associazione deve notificare i fatti di cui è venuta a conoscenza alle forze dell'ordine.
L'Associazione deve garantire l'adozione di apposite misure che prevengano qualsivoglia forma di vittimizzazione secondaria dei tesserati che abbiano in buona fede:
- presentato una denuncia o una segnalazione;
- manifestato l'intenzione di presentare una denuncia o una segnalazione;
- assistito o sostenuto un altro tesserato nel presentare una denuncia o una segnalazione;
- reso testimonianza o audizione in procedimenti in materia di abusi, violenze o discriminazioni;
- intrapreso qualsiasi altra azione o iniziativa relativa o inerente alle politiche di safeguarding.

Sistema disciplinare e meccanismi sanzionatori

A titolo esemplificativo e non esaustivo, i comportamenti sanzionabili possono essere ricondotti a:
- mancata attuazione colposa delle misure indicate nel Modello e della documentazione che ne costituisce parte integrante (es. Codice di condotta a tutela dei minori e per la prevenzione delle molestie, della violenza di genere e di ogni altra condizione di discriminazione);
- violazione dolosa delle misure indicate nel presente modello e della documentazione che ne costituisce parte integrante (es. Codice di condotta a tutela dei minori e per la prevenzione delle molestie, della violenza di genere e di ogni altra condizione di discriminazione), tale da compromettere il rapporto di fiducia tra l'autore e l'Associazione/Società in quanto preordinata in modo univoco a commettere un reato;
- violazione delle misure poste a tutela del segnalante;
- effettuazione con dolo o colpa grave di segnalazioni che si rivelano infondate;
- violazione degli obblighi di informazione nei confronti dell'Associazione/Società;
- violazione delle disposizioni concernenti le attività di informazione, formazione e diffusione nei confronti dei destinatari del presente modello;
- atti di ritorsione o discriminatori, diretti o indiretti, nei confronti del segnalante per motivi collegati, direttamente o indirettamente, alla segnalazione;
- mancata applicazione del presente sistema disciplinare.
Le sanzioni comminabili sono diversificate in ragione della natura del rapporto giuridico intercorrente tra l'autore della violazione e l'Associazione/Società, nonché del rilievo e gravità della violazione commessa e del ruolo e responsabilità dell'autore. Le sanzioni comminabili sono diversificate tenuto conto del grado di imprudenza, imperizia, negligenza, colpa o dell'intenzionalità del comportamento relativo all'azione/omissione, tenuto altresì conto dell'eventuale recidiva, nonché dell'attività lavorativa svolta dall'interessato e della relativa posizione funzionale, gravità del pericolo creato, entità del danno eventualmente creato, presenza di circostanze aggravanti o attenuanti, eventuale condivisione di responsabilità con altri soggetti che abbiano concorso nel determinare l'infrazione, unitamente a tutte le altre particolari circostanze che possono aver caratterizzato il fatto.
Il presente sistema sanzionatorio deve essere portato a conoscenza di tutti i Destinatari del Modello attraverso i mezzi ritenuti più idonei dall'Associazione/Società.

Sanzioni nei confronti dei collaboratori retribuiti

I comportamenti tenuti dai collaboratori retribuiti in violazione delle disposizioni del presente modello, inclusa la violazione degli obblighi di informazione nei confronti dell'Associazione, e della documentazione che ne costituisce parte integrante (es. Codice di condotta a tutela dei minori e per la prevenzione delle molestie, della violenza di genere e di ogni altra condizione di discriminazione) sono definiti illeciti disciplinari.
Nei confronti dei collaboratori retribuiti, possono essere comminate le seguenti sanzioni, che devono essere commisurate alla natura e gravità della violazione commessa:
- richiamo verbale per mancanze lievi;
- ammonizione scritta nei casi di recidiva delle infrazioni di cui al precedente punto 1;
- risoluzione del contratto e, in caso di collaboratore socio dell'Associazione, radiazione dello stesso. Ai fini del precedente punto:
1. incorre nel provvedimento disciplinare del richiamo verbale per le mancanze lievi il collaboratore che violi, per mera negligenza, le procedure aziendali, le prescrizioni del Codice di condotta a tutela dei minori e per la prevenzione delle molestie, della violenza di genere e di ogni altra condizione di discriminazione o adotti, nello svolgimento di attività sensibili, un comportamento non conforme alle prescrizioni contenute nel presente modello, qualora la violazione non abbia rilevanza esterna;
2. incorre nel provvedimento disciplinare dell'ammonizione scritta il collaboratore che risulti recidivo, durante il biennio, nella commissione di infrazioni per le quali è applicabile il richiamo verbale e/o violi, per mera negligenza, le procedure aziendali, le prescrizioni del Codice di condotta a tutela dei minori e per la prevenzione delle molestie, della violenza di genere e di ogni altra condizione di discriminazione o adotti, nello svolgimento di attività nelle aree a rischio, un comportamento non conforme alle prescrizioni contenute nel presente modello, qualora la violazione abbia rilevanza esterna;
3. incorre nel provvedimento disciplinare della risoluzione del contratto il collaboratore che eluda fraudolentemente le prescrizioni del presente modello attraverso un comportamento inequivocabilmente diretto alla commissione di uno dei reati ricompreso fra quelli previsti agli articoli 600-bis, 600-ter, 600-quater, 600-quater.1, 600-quinques, 604-bis, 604-ter, 609-bis, 609-ter, 609-quater, 609-quinques, 609-octies, 609-undecies del codice penale, ovvero che abbiano violato i divieti di cui al Capo II del Titolo I, Libro III del D.Lgs. 11/04/2006, n. 198, ovvero siano stati condannati in via definitiva per i reati di cui agli articoli 600-bis, 600-ter, 600-quater, 600-quater.1, 600-quinques, 604-bis, 604-ter, 609-bis, 609-ter, 609-quater, 609-quinques, 609-octies, 609-undecies del codice penale e/o violi il sistema di controllo interno attraverso la sottrazione, la distruzione o l'alterazione di documentazione ovvero impedendo il controllo o l'accesso alle informazioni e alla documentazione agli organi preposti, incluso il Responsabile contro abusi, violenze e discriminazioni in modo da impedire la trasparenza e verificabilità delle stesse.

Sanzioni nei confronti dei volontari

Nei confronti dei volontari dell'Associazione, possono essere comminate le seguenti sanzioni, che devono essere commisurate alla natura e gravità della violazione commessa:
- richiamo verbale per mancanze lievi;
- ammonizione scritta nei casi di recidiva delle infrazioni di cui al precedente punto 1;
- rescissione del rapporto di volontariato e, in caso di volontario socio dell'Associazione, radiazione dello stesso. Ai fini del precedente punto si rimanda al punto 3 della sezione "Sanzioni nei confronti dei collaboratori retribuiti".

Obblighi informativi e altre misure

L'Associazione è tenuta a pubblicare il presente modello e il nominativo del Responsabile contro abusi, violenze e discriminazioni presso la sua sede e le strutture che ha in gestione o in uso, nonché sulla homepage del sito istituzionale (ove sia possibile e l'Affiliata abbia sito internet).
Al momento dell'adozione del presente modello e in occasione di ogni sua modifica, l'Associazione deve darne comunicazione via posta elettronica a tutti i soci e a tutti i tesserati, nonché collaboratori e volontari. L'Associazione deve informare il tesserato o eventualmente coloro che esercitano la responsabilità genitoriale o i soggetti cui è affidata la cura degli atleti, del presente modello e del nominativo e dei contatti del Responsabile contro abusi, violenze e discriminazioni, nonché fornire i moduli per formulare la segnalazione.
L'Associazione deve dare immediata comunicazione di ogni informazione rilevante al Responsabile contro abusi, violenze e discriminazioni ed al Safeguarding Office del CSEN APS raggiungibile all'indirizzo mail salvaguardia@csen.it e della FIPAV safeguarding@federvolley.it.
L'Associazione deve dare diffusione presso i propri tesserati di idonee informative finalizzate alla prevenzione e contrasto dei fenomeni di abuso, violenza e discriminazione nonché alla consapevolezza dei tesserati in ordine a propri diritti, obblighi e tutele.
L'Associazione deve prevedere adeguate misure per la diffusione di o l'accesso a materiali informativi finalizzati alla sensibilizzazione su e alla prevenzione dei disturbi alimentari negli sportivi. L'Associazione deve prevedere un'adeguata informativa ai tesserati o eventualmente a coloro esercitano la responsabilità genitoriale o i soggetti cui è affidata la cura degli atleti, con riferimento alle specifiche misure adottate per la prevenzione e contrasto dei fenomeni di abuso, violenza e discriminazione in occasione di manifestazioni sportive.
L'Associazione deve dare comunicazione ai tesserati o eventualmente a coloro esercitano la responsabilità genitoriale o i soggetti cui è affidata la cura degli atleti di ogni altra politica di safeguarding adottata dal CSEN APS e dalla FIPAV.

Adottato il 23.08.2024`,
  },
]
