import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import ErrorComponent from '../components/common/Error'
import GenericTable, { type DataCell } from '../components/common/GenericTable'
import MasterPagesSkeleton from '../components/masterPage.components/LoadingSkeleton'
import PageHeader from '../components/masterPage.components/PageHeader'
import ButtonSm from '../components/common/Buttons'
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
      render: (value) => (value ? String(value) : '—'),
    },

    {
      headingTitle: '#DropDown',
      render: (_, row: DeliveryOrder) => (
        <section className="flex w-full flex-col gap-3">
          <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Delivery Address
              </p>
              <p className="font-medium text-slate-900">
                {row.deliveryAddress || 'Not provided'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                From Location
              </p>
              <p className="font-medium text-slate-900">
                {row.fromLocationId || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Notes
              </p>
              <p className="font-medium text-slate-900">
                {row.notes || 'No additional notes'}
              </p>
            </div>
          </div>
          <header className="flex flex-row items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              Products ({row.items.length})
            </p>
          </header>
          <div className="flex flex-col divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {row.items.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-500">
                No products linked to this delivery.
              </p>
            )}
            {row.items.map((item) => (
              <article
                key={item.id}
                className="grid grid-cols-1 gap-2 px-4 py-3 text-sm text-slate-600 md:grid-cols-4"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Product
                  </p>
                  <p className="font-medium text-slate-800">
                    {item.product?.name ?? 'Unnamed Product'}
                  </p>
                  <p className="text-xs text-slate-500">
                    SKU: {item.product?.sku ?? '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Quantity
                  </p>
                  <p className="font-medium text-slate-800">
                    {item.quantity} {item.unit}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Notes
                  </p>
                  <p className="font-medium text-slate-700">
                    {item.notes ?? '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Product Cost
                  </p>
                  <p className="font-medium text-slate-700">
                    {item.product?.cost ?? '—'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ),
    },
  ]

  return (
    <main className="flex h-min w-full max-w-full flex-col gap-4">
      <section className="table-container flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">
        <header className="flex flex-row items-center justify-between">
          <PageHeader title="Delivery Management" />
          <ButtonSm
            className="text-white"
            state="default"
            text="New Delivery"
            onClick={() => navigate(appRoutes.deliveryCreate)}
          />
        </header>
      </section>
      <GenericTable
        isMasterTable
        isADropDown
        data={deliveries ?? []}
        dataCell={dataCell}
        isLoading={isLoading}
        rowKey={(row) => row.id}
        onEdit={() => {}}
        onDelete={() => {}}
        tableTitle="Delivery Orders"
        messageWhenNoData="No delivery orders available."
      />
    </main>
  )
}

export default DeliveryPage
