import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import ErrorComponent from '../components/common/Error'
import GenericTable, { type DataCell } from '../components/common/GenericTable'
import MasterPagesSkeleton from '../components/masterPage.components/LoadingSkeleton'
import PageHeader from '../components/masterPage.components/PageHeader'
import { appRoutes } from '../routes/appRoutes'
import { authHandler } from '../utils/authHandler'
import type { InternalMove } from '../types/InternalDelivery'

// Status UI styles
const statusStyles: Record<string, string> = {
  ready: 'bg-blue-50 text-blue-700 border-blue-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  processed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

const formatDate = (value?: string) => {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString()
}

// 🔥 Dummy Internal Moves List
const dummyInternalMoves: InternalMove[] = [
  {
    id: "WH/MOVE/0007",
    reference: "WH/MOVE/0007",
    fromWarehouseId: "WH1",
    fromLocationId: "LOC-RACK-A",
    toWarehouseId: "WH1",
    toLocationId: "LOC-PROD-ZONE",
    scheduleDate: "2025-01-15T09:00:00Z",
    status: "ready",
    items: [
      { productId: "P1001", quantity: 20 }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "WH/MOVE/0008",
    reference: "WH/MOVE/0008",
    fromWarehouseId: "WH2",
    fromLocationId: "LOC-STORAGE-B",
    toWarehouseId: "WH3",
    toLocationId: "LOC-QC-AREA",
    scheduleDate: "2025-02-01T10:30:00Z",
    status: "pending",
    items: [
      { productId: "P2002", quantity: 10 },
      { productId: "P3003", quantity: 5 }
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "WH/MOVE/0009",
    reference: "WH/MOVE/0009",
    fromWarehouseId: "WH1",
    fromLocationId: "LOC-PACK-A",
    toWarehouseId: "WH2",
    toLocationId: "LOC-STOCK-FIN",
    scheduleDate: "2025-02-10T15:00:00Z",
    status: "processed",
    items: [
      { productId: "P4004", quantity: 50 }
    ],
    createdAt: new Date().toISOString(),
  },
]

const InternalMovePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = authHandler()
    if (!token) navigate(appRoutes.signIn)
  }, [navigate])

  // 🚀 Using dummy data instead of fetch hook
  const internalMoves = dummyInternalMoves
  const isLoading = false
  const isError = false

  const dataCell: DataCell[] = [
    {
      headingTitle: 'Reference',
      accessVar: 'reference',
      sortable: true,
      searchable: true,
      className: 'min-w-[140px]',
    },
    {
      headingTitle: 'From Warehouse',
      accessVar: 'fromWarehouseId',
      sortable: true,
      searchable: true,
      className: 'min-w-[160px]',
    },
    {
      headingTitle: 'From Location',
      accessVar: 'fromLocationId',
      sortable: true,
      searchable: true,
      className: 'min-w-[160px]',
    },
    {
      headingTitle: 'To Warehouse',
      accessVar: 'toWarehouseId',
      sortable: true,
      searchable: true,
      className: 'min-w-[160px]',
    },
    {
      headingTitle: 'To Location',
      accessVar: 'toLocationId',
      sortable: true,
      searchable: true,
      className: 'min-w-[160px]',
    },
    {
      headingTitle: 'Schedule Date',
      accessVar: 'scheduleDate',
      sortable: true,
      searchable: false,
      className: 'min-w-[140px]',
      render: (value) => formatDate(value as string | undefined),
    },
    {
      headingTitle: 'Status',
      accessVar: 'status',
      sortable: true,
      searchable: true,
      className: 'min-w-[140px] max-w-[160px]',
      render: (value) => (
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
            statusStyles[value as string] ??
            'border-slate-200 bg-slate-100 text-slate-600'
          }`}
        >
          {(value as string).replace('-', ' ') || '—'}
        </span>
      ),
    },
    {
      headingTitle: '# Items',
      accessVar: (row: InternalMove) => row.items.length,
      sortable: true,
      searchable: false,
      className: 'min-w-[100px] text-right',
    },
    {
      headingTitle: 'Created At',
      accessVar: 'createdAt',
      sortable: true,
      searchable: false,
      className: 'min-w-[140px]',
      render: (value) => formatDate(value as string | undefined),
    },
  ]

  return (
    <main className="flex h-min w-full max-w-full flex-col gap-4">
      <section className="table-container flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
        <header className="flex flex-row items-center justify-between">
          <PageHeader title="Internal Delivery / Move Management" />
        </header>

        <GenericTable
          isMasterTable
          data={internalMoves}
          dataCell={dataCell}
          isLoading={isLoading}
          rowKey={(row) => row.id}
          tableTitle="Internal Moves"
          messageWhenNoData="No internal moves available."
        />
      </section>
    </main>
  )
}

export default InternalMovePage
