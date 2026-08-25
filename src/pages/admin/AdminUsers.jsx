import { useAuth } from '../../context/AuthContext'
import EntityManager from '../../components/admin/EntityManager'

const roleLabels = { staff: 'Staff', admin: 'Admin', superadmin: 'Superadmin' }

export default function AdminUsers() {
  const { user } = useAuth()

  if (user && user.role !== 'superadmin') {
    return (
      <div>
        <h1 className="font-display font-bold text-2xl text-navy-dark">Utenti</h1>
        <p className="text-navy-dark/60 text-sm mt-2">
          Solo un superadmin può gestire gli account del pannello.
        </p>
      </div>
    )
  }

  return (
    <EntityManager
      title="Utenti"
      description="Account staff/admin del pannello gestionale. Solo un superadmin può creare o modificare altri account admin."
      endpoint="/api/auth/users"
      hideDelete
      columns={[
        { key: 'email', label: 'Username' },
        { key: 'full_name', label: 'Nome e cognome' },
        { key: 'role', label: 'Ruolo', render: (i) => roleLabels[i.role] || i.role },
        { key: 'is_active', label: 'Attivo', render: (i) => (i.is_active ? 'Sì' : 'No') },
      ]}
      fields={[
        { name: 'email', label: 'Username', required: true },
        { name: 'full_name', label: 'Nome e cognome', required: true },
        {
          name: 'role',
          label: 'Ruolo',
          type: 'select',
          required: true,
          options: [
            { value: 'staff', label: 'Staff' },
            { value: 'admin', label: 'Admin' },
            { value: 'superadmin', label: 'Superadmin' },
          ],
        },
        { name: 'is_active', label: 'Account attivo', type: 'checkbox' },
        { name: 'password', label: 'Password (obbligatoria per un nuovo utente, lascia vuoto in modifica per non cambiarla)', type: 'password' },
      ]}
      emptyItem={{ email: '', full_name: '', role: 'staff', is_active: true, password: '' }}
    />
  )
}
