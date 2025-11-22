import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import ErrorComponent from '../components/common/Error'
import GenericTable, { type DataCell } from '../components/common/GenericTable'
import MasterPagesSkeleton from '../components/masterPage.components/LoadingSkeleton'
import PageHeader from '../components/masterPage.components/PageHeader'
import { useFetchDeliveries } from '../queries/DeliveryQueries'
import { appRoutes } from '../routes/appRoutes'
import { authHandler } from '../utils/authHandler'
import type { DeliveryOrder } from '../types/Delivery'

const statusStyles: Record<string, string> = {
  scheduled: 'bg-blue-50 text-blue-700 border-blue-200',
  'in-transit': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

const formatDate = (value?: string) => {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString()
}

const DeliveryPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = authHandler()
    if (!token) navigate(appRoutes.signIn)
  }, [navigate])

  const { data: deliveries, isLoading, isError } = useFetchDeliveries()

  if (isLoading) return <MasterPagesSkeleton />
  if (isError) return <ErrorComponent />

  const dataCell: DataCell[] = [
    {
      headingTitle: 'Reference',
      accessVar: 'reference',
      sortable: true,
      searchable: true,
      className: 'min-w-[140px]',
    },
    {
      headingTitle: 'Customer',
      accessVar: 'customerName',
      sortable: true,
      searchable: true,
      className: 'min-w-[180px] max-w-[220px]',
    },
    {
      headingTitle: 'Status',
      accessVar: 'status',
      sortable: true,
      searchable: true,
      className: 'min-w-[140px] max-w-[160px]',
      render: (value) => (
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusStyles[value as string] ?? 'border-slate-200 bg-slate-100 text-slate-600'}`}
        >
          {(value as string)?.replace('-', ' ') ?? '—'}
        </span>
      ),
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
      className: 'min-w-[140px]',
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
      headingTitle: 'Responsible',
      accessVar: 'responsibleUserId',
      sortable: true,
      searchable: true,
      className: 'min-w-[150px]',
    },
    {
      headingTitle: '# Items',
      accessVar: (row: DeliveryOrder) => row.items.length,
      sortable: true,
      searchable: false,
      className: 'min-w-[100px] text-right',
    },
    {
      headingTitle: 'Delivery Address',
      accessVar: 'deliveryAddress',
      sortable: false,
      searchable: true,
      className: 'min-w-[220px] max-w-[320px]',
    },
  ]

  return (
    <main className="flex h-min w-full max-w-full flex-col gap-4">
      <section className="table-container flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
        <header className="flex flex-row items-center justify-between">
          <PageHeader title="Delivery Management" />
        </header>

        <GenericTable
          isMasterTable
          data={deliveries ?? []}
          dataCell={dataCell}
          isLoading={isLoading}
          rowKey={(row) => row.id}
          tableTitle="Delivery Orders"
          messageWhenNoData="No delivery orders available."
        />
      </section>
    </main>
  )
}

export default DeliveryPage
