import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'

import DialogBox from '../components/common/DialogBox'
import ErrorComponent from '../components/common/Error'
import GenericTable, { type DataCell } from '../components/common/GenericTable'
import MasterPagesSkeleton from '../components/masterPage.components/LoadingSkeleton'
import PageHeader from '../components/masterPage.components/PageHeader'
import { useFetchStock } from '../queries/StockQueries'
import { appRoutes } from '../routes/appRoutes'
import { authHandler } from '../utils/authHandler'
import type { Stock } from '../types/Stock'
import EditStockDialog from './StockManagement/EditStockDialog'

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
      className: 'min-w-[140px] max-w-[200px]',
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
        </header>
      </section>
      <GenericTable
        isMasterTable
        data={stockRecords ?? []}
        dataCell={dataCell}
        isLoading={isLoading}
        rowKey={(row) => row.id}
        tableTitle="Inventory Snapshot"
        messageWhenNoData="No stock records available."
        onEdit={(row) => {
          setSelectedStockRecord(row as Stock)
          setIsEditDialogOpen(true)
        }}
      />
      <AnimatePresence>
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
