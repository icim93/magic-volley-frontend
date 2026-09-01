// Genera il modulo di richiesta tesseramento come vero PDF A4, costruito riga
// per riga con jsPDF — non è uno screenshot della pagina, quindi niente
// intestazioni del browser, niente interruzioni di pagina a metà frase.
import { jsPDF } from 'jspdf'

const MARGIN = 20
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const NAVY = [20, 33, 61]
const GRAY = [110, 110, 110]

function makeCursor(doc) {
  let y = MARGIN
  const ensureSpace = (needed) => {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      doc.addPage()
      y = MARGIN
    }
  }
  return {
    get y() { return y },
    space(h) { ensureSpace(h); y += h },
    heading(text, size = 15) {
      ensureSpace(size / 2 + 4)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(size)
      doc.setTextColor(...NAVY)
      doc.text(text, PAGE_WIDTH / 2, y, { align: 'center' })
      y += size / 2.2
    },
    subheading(text, size = 10) {
      ensureSpace(size / 2 + 3)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(size)
      doc.setTextColor(...GRAY)
      doc.text(text, PAGE_WIDTH / 2, y, { align: 'center' })
      y += size / 2 + 6
    },
    label(text) {
      ensureSpace(6)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(...NAVY)
      doc.text(text, MARGIN, y)
      y += 6
    },
    // Parola chiave della dichiarazione (CHIEDO, DICHIARO, AUTORIZZO...),
    // centrata e in grande per evitare di doverla ripetere in mezzo al testo.
    keyword(text, size = 13) {
      this.space(3)
      ensureSpace(size / 2 + 3)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(size)
      doc.setTextColor(...NAVY)
      doc.text(text, PAGE_WIDTH / 2, y, { align: 'center' })
      y += size / 2 + 4
    },
    paragraph(text, { size = 10.5, align = 'left' } = {}) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(size)
      doc.setTextColor(...NAVY)
      const lines = doc.splitTextToSize(text, CONTENT_WIDTH)
      const lineHeight = size / 2.1
      lines.forEach((line) => {
        ensureSpace(lineHeight)
        doc.text(line, align === 'center' ? PAGE_WIDTH / 2 : MARGIN, y, align === 'center' ? { align: 'center' } : undefined)
        y += lineHeight
      })
    },
    bullet(text, size = 10.5) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(size)
      doc.setTextColor(...NAVY)
      const lines = doc.splitTextToSize(text, CONTENT_WIDTH - 6)
      const lineHeight = size / 2.1
      lines.forEach((line, i) => {
        ensureSpace(lineHeight)
        doc.text(i === 0 ? `•  ${line}` : `   ${line}`, MARGIN, y)
        y += lineHeight
      })
    },
    row(label, value) {
      ensureSpace(6.5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(...GRAY)
      doc.text(label, MARGIN, y)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...NAVY)
      doc.text(String(value ?? '—'), PAGE_WIDTH - MARGIN, y, { align: 'right' })
      doc.setDrawColor(230, 230, 230)
      doc.line(MARGIN, y + 1.5, PAGE_WIDTH - MARGIN, y + 1.5)
      y += 6.5
    },
    signatureLine(label) {
      this.space(14)
      ensureSpace(10)
      doc.setDrawColor(...NAVY)
      doc.line(MARGIN, y, MARGIN + 70, y)
      y += 4
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(...GRAY)
      doc.text(label, MARGIN, y)
      y += 8
    },
    divider() {
      this.space(4)
      ensureSpace(2)
      doc.setDrawColor(225, 225, 225)
      doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
      y += 8
    },
  }
}

export function generateRegistrationPdf(form, isMinor) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const c = makeCursor(doc)

  const fullName = `${form.first_name} ${form.last_name}`.trim()
  const birthDateLabel = form.birth_date ? new Date(form.birth_date).toLocaleDateString('it-IT') : '__/__/____'

  c.heading('Modulo di richiesta tesseramento')
  c.subheading('Magic Volley Adelfia Associazione Sportiva Dilettantistica')

  c.row('Nome e cognome', fullName)
  c.row('Luogo e data di nascita', form.birth_place ? `${form.birth_place}, ${birthDateLabel}` : birthDateLabel)
  c.row('Indirizzo', form.address)
  c.row('Città', form.city ? `${form.city}${form.postal_code ? ` (${form.postal_code})` : ''}` : form.postal_code)
  c.row('Codice fiscale', form.fiscal_code)
  c.row('Email', form.email)
  c.row('Telefono', form.phone)
  c.row('Categoria di interesse', form.requested_team_category)

  if (isMinor) {
    c.space(3)
    c.label('Genitore/tutore')
    c.row('Nome e cognome', form.parent_name)
    c.row('Luogo e data di nascita', form.parent_birth_place)
    c.row('Indirizzo', form.parent_address)
    c.row('Città', form.parent_city ? `${form.parent_city}${form.parent_postal_code ? ` (${form.parent_postal_code})` : ''}` : form.parent_postal_code)
    c.row('Codice fiscale', form.parent_fiscal_code)
  }

  c.divider()

  if (isMinor) {
    c.label('Quadro A')
    c.keyword('CHIEDO')
    c.paragraph(
      `l'ammissione di ${fullName || "l'atleta sopra indicato/a"} a Magic Volley Adelfia Associazione Sportiva ` +
      `Dilettantistica in qualità di tesserato/a.`,
      { align: 'center' }
    )
    c.signatureLine("Firma dell'atleta")

    c.divider()

    c.label('Quadro B')
    c.keyword('AUTORIZZO E ACCONSENTO')
    c.paragraph(
      `all'ammissione di ${fullName || "l'atleta sopra indicato/a"} a Magic Volley Adelfia Associazione Sportiva ` +
      `Dilettantistica, in qualità di genitore/tutore esercente la responsabilità genitoriale, nel rispetto delle ` +
      `norme e dei regolamenti statutari.`,
      { align: 'center' }
    )
    c.keyword('DICHIARO')
    c.bullet('Di aver preso visione e di accettare lo Statuto e il Regolamento Associativo.')
    c.bullet('Di aver preso visione e di accettare le condizioni delle polizze assicurative CSEN e FIPAV.')
    c.bullet('Di impegnarmi al pagamento della quota di iscrizione annuale e delle quote mensili a seconda dell\'attività scelta.')
    c.bullet('Di autorizzare Magic Volley Adelfia Associazione Sportiva Dilettantistica al trattamento dei dati personali e all\'utilizzo delle immagini/video/fotografie del minore sopra indicato, ai sensi del Regolamento UE 2016/679 come modificato dal D.Lgs. 101 del 10/08/2018.')
    c.bullet('Di aver preso visione e di accettare il Modello Organizzativo e di Controllo dell\'Attività Sportiva (Safe Guarding).')
    c.signatureLine('Firma del genitore/tutore')
  } else {
    c.keyword('CHIEDO')
    c.paragraph(
      `l'ammissione a Magic Volley Adelfia Associazione Sportiva Dilettantistica in qualità di tesserato/a.`,
      { align: 'center' }
    )
    c.keyword('DICHIARO')
    c.bullet('Di aver preso visione e di accettare lo Statuto e il Regolamento Associativo.')
    c.bullet('Di aver preso visione e di accettare le condizioni delle polizze assicurative CSEN e FIPAV.')
    c.bullet('Di impegnarmi al pagamento della quota di iscrizione annuale e delle quote mensili a seconda dell\'attività scelta.')
    c.bullet('Di autorizzare Magic Volley Adelfia Associazione Sportiva Dilettantistica al trattamento dei miei dati personali e all\'utilizzo delle mie immagini/video/fotografie, ai sensi del Regolamento UE 2016/679 come modificato dal D.Lgs. 101 del 10/08/2018.')
    c.bullet('Di aver preso visione e di accettare il Modello Organizzativo e di Controllo dell\'Attività Sportiva (Safe Guarding).')
    c.signatureLine('Firma')
  }

  c.space(8)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...GRAY)
  doc.text('Adelfia, lì _______________', MARGIN, c.y)

  const fileName = `modulo-iscrizione-${(form.last_name || 'magic-volley').toLowerCase().replace(/\s+/g, '-')}.pdf`
  doc.save(fileName)
}
