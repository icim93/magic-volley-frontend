import { useState } from 'react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { REGISTRATION_DOCUMENTS } from '../data/registrationDocuments'
import { DocumentCard, DocumentModal } from '../components/DocumentViewer'

export default function Documents() {
  const [openDoc, setOpenDoc] = useState(null)

  useDocumentMeta({
    title: 'Documenti',
    description: 'Regolamento, Statuto, Informativa Privacy e Documento di Safe Guarding di Magic Volley Adelfia Associazione Sportiva Dilettantistica.',
    path: '/documenti',
  })

  return (
    <div className="max-w-3xl mx-auto px-5 py-16">
      <h1 className="font-display font-bold text-4xl text-navy-dark">Documenti</h1>
      <p className="text-navy-dark/60 mt-3 max-w-xl">
        I documenti che genitori e atlete sottoscrivono al momento dell'iscrizione — consultabili qui in qualsiasi
        momento, anche dopo aver firmato.
      </p>

      <div className="mt-10 space-y-3">
        {REGISTRATION_DOCUMENTS.map((doc) => (
          <DocumentCard key={doc.key} doc={doc} onOpen={() => setOpenDoc(doc)} />
        ))}
      </div>

      {openDoc && <DocumentModal doc={openDoc} onClose={() => setOpenDoc(null)} />}
    </div>
  )
}
