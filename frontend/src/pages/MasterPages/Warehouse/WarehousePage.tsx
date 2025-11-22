import { useNavigate } from 'react-router-dom'
import BranchEdit from './EditWarehouse.component'
import PageHeader from '../../../components/masterPage.components/PageHeader'
import { AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'
import DialogBox from '../../../components/common/DialogBox'
import { DeleteBranchDialogBox } from './DeleteWarehouseDialogBox'
import { useFetchBranches } from '../../../queries/masterQueries/BranchQuery'
import MasterPagesSkeleton from '../../../components/masterPage.components/LoadingSkeleton'
import ErrorComponent from '../../../components/common/Error'
import { appRoutes } from '../../../routes/appRoutes'
import type { FormState } from '../../../types/appTypes'
import type { BranchDetails } from '../../../types/masterApiTypes'

// ✅ import new GenericTableMaster
import GenericTable, {
  type DataCell,
} from '../../../components/common/GenericTable'

const BranchesPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = authHandler()
    if (!token) {
      navigate(appRoutes.signIn)
    }
  }, [navigate])

  const [isDeleteBranchDialogOpen, setIsDeleteBranchDialogOpen] =
    useState(false)
  const [branch, setBranch] = useState<BranchDetails | null>(null)
  const [formState, setFormState] = useState<FormState>('create')

  const { data: branches, isLoading, isError } = useFetchBranches()

  const handleBranchDeleted = () => {
    setBranch(null)
    setFormState('create')
  }

  if (isLoading) return <MasterPagesSkeleton />
  if (isError) return <ErrorComponent />

  // ✅ Define columns for GenericTable
  const dataCell: DataCell[] = [
    {
      headingTitle: 'Name',
      accessVar: 'name',
      searchable: true,
      sortable: true,
      className: 'min-w-[150px] max-w-[200px]',
    },
    {
      headingTitle: 'Address',
      accessVar: 'addressLine1',
      searchable: true,
      sortable: true,
      className: 'min-w-[200px] max-w-[300px]',
    },
  ]

  return (
    <main className="flex h-max w-full max-w-full flex-col gap-4 md:flex-row">
      <AnimatePresence>
        {isDeleteBranchDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsDeleteBranchDialogOpen}>
            <DeleteBranchDialogBox
              setBranch={setBranch}
              setFormState={setFormState}
              setIsDeleteBranchDialogOpen={setIsDeleteBranchDialogOpen}
              branch={branch!}
              onDeleted={handleBranchDeleted}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left side table */}
      <section className="table-container flex w-full flex-col gap-3 rounded-[12px] md:w-[50%]">
        <header className="flex flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
          <PageHeader title="Branch Configuration" />
        </header>
        <GenericTable
          isMasterTable
          data={branches ?? []} // ensures [] is passed if undefined
          dataCell={dataCell}
          isLoading={isLoading}
          onEdit={(row) => {
            setFormState('edit')
            setBranch(row)
          }}
          onDelete={(row) => {
            setBranch(row)
            setIsDeleteBranchDialogOpen(true)
          }}
          onView={(row) => {
            setFormState('display')
            setBranch(row)
          }}
          rowKey={(row) => row.id}
          tableTitle="Branch Configuration"
        />
      </section>

      {/* Right side form */}
      <section className="table-container max-h-full w-full flex-col gap-3 rounded-[12px] bg-white/80 p-4 shadow-sm md:w-[50%]">
        <BranchEdit
          branchDetails={branch}
          formState={formState}
          setFormState={setFormState}
          setBranchData={setBranch}
        />
      </section>
    </main>
  )
}

export default BranchesPage
