import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'

import PageHeader from '../../../components/masterPage.components/PageHeader'
import GenericTable, {
  type DataCell,
} from '../../../components/common/GenericTable'
import DialogBox from '../../../components/common/DialogBox'
import MasterPagesSkeleton from '../../../components/masterPage.components/LoadingSkeleton'
import ErrorComponent from '../../../components/common/Error'
import { authHandler } from '../../../utils/authHandler'
import { appRoutes } from '../../../routes/appRoutes'
import { useFetchUsers } from '../../../queries/Master/UserQueries'
import type { User, UserRole } from '../../../types/Master/UserTypes'
import type { FormState } from '../../../types/appTypes'
import { DeleteUserDialog } from './DeleteUserDialog'
import UserForm from './UserForm'

const formatRole = (role: UserRole) => {
  switch (role) {
    case 'admin':
      return 'Admin'
    case 'inventory_manager':
      return 'Inventory Manager'
    case 'warehouse_staff':
      return 'Warehouse Staff'
    default:
      return role
  }
}

const UsersPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = authHandler()
    if (!token) navigate(appRoutes.signIn)
  }, [navigate])

  const [formState, setFormState] = useState<FormState>('create')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data: users, isLoading, isError } = useFetchUsers()

  const columns: DataCell[] = useMemo(
    () => [
      {
        headingTitle: 'Email',
        accessVar: 'email',
        searchable: true,
        sortable: true,
        className: 'min-w-[220px] max-w-[250px]',
      },

      {
        headingTitle: 'Role',
        accessVar: 'role',
        className: 'min-w-[160px] max-w-[180px]',
        render: (value) => (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {value ? formatRole(value as UserRole) : '—'}
          </span>
        ),
      },
    ],
    []
  )

  const handleDeleted = () => {
    setIsDeleteDialogOpen(false)
    setFormState('create')
    setSelectedUser(null)
  }

  if (isLoading) return <MasterPagesSkeleton />
  if (isError) return <ErrorComponent />

  return (
    <main className="flex h-max w-full max-w-full flex-col gap-4 md:flex-row">
      <AnimatePresence>
        {isDeleteDialogOpen && selectedUser && (
          <DialogBox setToggleDialogueBox={setIsDeleteDialogOpen}>
            <DeleteUserDialog
              user={selectedUser}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              setFormState={setFormState}
              setSelectedUser={setSelectedUser}
              onDeleted={handleDeleted}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      <section className="table-container flex w-full flex-col gap-3 rounded-xl md:w-[50%]">
        <header className="flex flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
          <PageHeader title="User Configuration" />
        </header>

        <GenericTable
          isMasterTable
          data={users ?? []}
          dataCell={columns}
          tableTitle="User Configuration"
          onEdit={(row) => {
            setFormState('edit')
            setSelectedUser(row)
          }}
          onDelete={(row) => {
            setSelectedUser(row)
            setIsDeleteDialogOpen(true)
          }}
          onView={(row) => {
            setSelectedUser(row)
            setFormState('display')
          }}
          rowKey={(row) => row.id}
          messageWhenNoData="No users found."
        />
      </section>

      <section className="table-container max-h-full w-full flex-col gap-3 rounded-xl bg-white/80 p-4 shadow-sm md:w-[50%]">
        <UserForm
          key={
            formState === 'create' ? 'create' : (selectedUser?.id ?? 'create')
          }
          userDetails={formState === 'create' ? null : selectedUser}
          formState={formState}
          setFormState={setFormState}
          setSelectedUser={setSelectedUser}
        />
      </section>
    </main>
  )
}

export default UsersPage
