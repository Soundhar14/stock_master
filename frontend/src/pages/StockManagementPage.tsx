import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'

import DialogBox from '../components/common/DialogBox'
import ErrorComponent from '../components/common/Error'
import GenericTable, { type DataCell } from '../components/common/GenericTable'
import ButtonSm from '../components/common/Buttons'
import MasterPagesSkeleton from '../components/masterPage.components/LoadingSkeleton'
import PageHeader from '../components/masterPage.components/PageHeader'
import { useFetchStock } from '../queries/StockQueries'
import { appRoutes } from '../routes/appRoutes'
import { authHandler } from '../utils/authHandler'
import type { Stock } from '../types/Stock'
import EditStockDialog from './StockManagement/EditStockDialog'
import DeleteStockDialog from './StockManagement/DeleteStockDialog'
import CreateStock from './StockManagement/CreateStock'

const StockManagementPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = authHandler()
    if (!token) navigate(appRoutes.signIn)
  }, [navigate])

  const { data: stockRecords, isLoading, isError } = useFetchStock()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedStockRecord, setSelectedStockRecord] = useState<Stock | null>(
    null
  )
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [stockPendingDelete, setStockPendingDelete] = useState<Stock | null>(
    null
  )
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleDialogToggle: Dispatch<SetStateAction<boolean>> = (value) => {
    setIsEditDialogOpen((prev) => {
      const nextValue = typeof value === 'function' ? value(prev) : value
      if (!nextValue) {
        setSelectedStockRecord(null)
      }
      return nextValue
    })
  }

  const handleDialogClose = () => {
    setSelectedStockRecord(null)
    setIsEditDialogOpen(false)
  }

  const handleDeleteDialogClose = () => {
    setStockPendingDelete(null)
    setIsDeleteDialogOpen(false)
  }

  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false)
  }

  if (isLoading) return <MasterPagesSkeleton />
  if (isError) return <ErrorComponent />

  const dataCell: DataCell[] = [
    {
      headingTitle: 'Product',
      accessVar: 'product.name',
      searchable: true,
      sortable: true,
      className: 'min-w-[160px] max-w-[220px]',
    },
    {
      headingTitle: 'SKU',
      accessVar: 'product.sku',
      searchable: true,
      sortable: true,
      className: 'min-w-[140px] max-w-[200px]',
    },
    {
      headingTitle: 'Warehouse',
      accessVar: 'warehouse.name',
      searchable: true,
      sortable: true,
      className: 'min-w-[160px] max-w-[220px]',
    },
    {
      headingTitle: 'Location',
      accessVar: 'location.name',
      searchable: true,
      sortable: true,
      className: 'min-w-[160px] max-w-[220px]',
      render: (_, row: Stock) =>
        row.location?.name ?? row.locationId ?? row.location?.id ?? '—',
    },
    {
      headingTitle: 'On Hand',
      accessVar: 'onHand',
      sortable: true,
      searchable: false,
      className: 'min-w-[100px] text-right',
    },
    {
      headingTitle: 'Reserved',
      accessVar: 'reserved',
      sortable: true,
      searchable: false,
      className: 'min-w-[100px] text-right',
    },
    {
      headingTitle: 'Free to Use',
      accessVar: 'freeToUse',
      sortable: true,
      searchable: false,
      className: 'min-w-[120px] text-right',
    },
  ]

  return (
    <main className="flex h-min w-full max-w-full flex-col gap-4">
      <section className="table-container flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
        <header className="flex flex-row items-center justify-between">
          <PageHeader title="Stock Management" />
          <ButtonSm
            state="default"
            text="Add Stock"
            className="text-white"
            onClick={() => setIsCreateDialogOpen(true)}
          />
        </header>
      </section>
      <GenericTable
        data={stockRecords ?? []}
        isMasterTable={false}
        dataCell={dataCell}
        isLoading={isLoading}
        rowKey={(row) => row.id}
        tableTitle="Inventory Snapshot"
        messageWhenNoData="No stock records available."
        onEdit={(row) => {
          setSelectedStockRecord(row as Stock)
          setIsEditDialogOpen(true)
        }}
        onDelete={(row) => {
          setStockPendingDelete(row as Stock)
          setIsDeleteDialogOpen(true)
        }}
      />
      <AnimatePresence>
        {isCreateDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsCreateDialogOpen} width="520px">
            <CreateStock onClose={handleCreateDialogClose} />
          </DialogBox>
        )}
        {isDeleteDialogOpen && stockPendingDelete && (
          <DialogBox setToggleDialogueBox={setIsDeleteDialogOpen} width="480px">
            <DeleteStockDialog
              stock={stockPendingDelete}
              onClose={handleDeleteDialogClose}
            />
          </DialogBox>
        )}
        {isEditDialogOpen && selectedStockRecord && (
          <DialogBox setToggleDialogueBox={handleDialogToggle} width="520px">
            <EditStockDialog
              key={selectedStockRecord.id}
              stock={selectedStockRecord}
              onClose={handleDialogClose}
            />
          </DialogBox>
        )}
      </AnimatePresence>
    </main>
  )
}

export default StockManagementPage
