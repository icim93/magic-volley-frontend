// Converte un titolo in uno slug URL-friendly (minuscolo, senza accenti,
// spazi/punteggiatura sostituiti da trattini). Condiviso da AdminNews e
// StaffNewsSubmit per non ripetere la stessa regex in due posti.
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
