import ButtonSm from '../../components/common/Buttons'
import type { Stock } from '../../types/Stock'
import { useDeleteStock } from '../../queries/StockQueries'

interface DeleteStockDialogProps {
  stock: Stock
  onClose: () => void
}

const DeleteStockDialog = ({ stock, onClose }: DeleteStockDialogProps) => {
  const { mutate: deleteStock, isPending } = useDeleteStock()

  const handleDelete = () => {
    deleteStock(stock.id, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="flex w-full items-center justify-between text-lg font-semibold text-red-600">
        Delete Stock Record
        <img
          onClick={onClose}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-sm font-medium text-slate-600">
        Are you sure you want to delete the stock entry for{' '}
        <strong>{stock.product?.name ?? `Product #${stock.productId}`}</strong>{' '}
        stored in{' '}
        <strong>
          {stock.warehouse?.name ?? `Warehouse #${stock.warehouseId}`}
        </strong>
        ? This action cannot be undone.
      </p>

      <section className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <div className="flex flex-col gap-1">
          <p>
            <span className="font-semibold text-slate-500">SKU:</span>{' '}
            {stock.product?.sku ?? '—'}
          </p>
          <p>
            <span className="font-semibold text-slate-500">Location:</span>{' '}
            {stock.location?.name ?? stock.locationId ?? '—'}
          </p>
          <p>
            <span className="font-semibold text-slate-500">On Hand:</span>{' '}
            {stock.onHand}
          </p>
          <p>
            <span className="font-semibold text-slate-500">Reserved:</span>{' '}
            {stock.reserved}
          </p>
        </div>
      </section>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={onClose}
        />
        <ButtonSm
          className="items-center justify-center bg-red-500 text-white hover:bg-red-600"
          state="default"
          onClick={handleDelete}
          text={isPending ? 'Deleting...' : 'Delete'}
          disabled={isPending}
        />
      </section>
    </div>
  )
}

export default DeleteStockDialog
