import ButtonSm from '../../../components/common/Buttons'
import type { FormState } from '../../../types/appTypes'
import type { User } from '../../../types/Master/UserTypes'
import { useDeleteUser } from '../../../queries/Master/UserQueries'

interface DeleteUserDialogProps {
  user: User
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  onDeleted?: () => void
}

export const DeleteUserDialog = ({
  user,
  setFormState,
  setSelectedUser,
  setIsDeleteDialogOpen,
  onDeleted,
}: DeleteUserDialogProps) => {
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser()

  const handleDelete = () => {
    deleteUser(user, {
      onSuccess: () => {
        setFormState('create')
        setSelectedUser(null)
        setIsDeleteDialogOpen(false)
        if (onDeleted) onDeleted()
      },
    })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="flex w-full items-center justify-between text-lg font-medium text-red-600">
        Delete User
        <img
          onClick={() => setIsDeleteDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete <strong>{user.name}</strong>? This
        action cannot be undone.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={() => setIsDeleteDialogOpen(false)}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          onClick={handleDelete}
          text={isDeleting ? 'Deleting...' : 'Delete'}
        />
      </section>
    </div>
  )
}
