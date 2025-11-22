import { useMemo, useState } from 'react'

import Input from '../../components/common/Input'
import ButtonSm from '../../components/common/Buttons'
import type { Stock } from '../../types/Stock'
import { useUpdateStock } from '../../queries/StockQueries'

interface EditStockDialogProps {
  stock: Stock
  onClose: () => void
}

const sanitizeNumber = (value: string | number): number => {
  if (value === '' || value === null || value === undefined) return 0
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return 0
  return Math.max(0, parsed)
}

const EditStockDialog = ({ stock, onClose }: EditStockDialogProps) => {
  const [formValues, setFormValues] = useState({
    onHand: stock.onHand,
    reserved: stock.reserved,
  })

  const freeToUse = useMemo(() => {
    const computed = formValues.onHand - formValues.reserved
    return computed >= 0 ? computed : 0
  }, [formValues])

  const hasValidationError = formValues.reserved > formValues.onHand
  const isDirty =
    formValues.onHand !== stock.onHand || formValues.reserved !== stock.reserved

  const { mutate: updateStock, isPending } = useUpdateStock()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (hasValidationError || !isDirty) return

    updateStock(
      {
        id: stock.id,
        onHand: formValues.onHand,
        reserved: formValues.reserved,
        freeToUse,
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  const handleNumericChange = (
    field: 'onHand' | 'reserved',
    value: string | number
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: sanitizeNumber(value),
    }))
  }

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <header className="rounded-2xl bg-slate-50 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
              Stock Update
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              {stock.product?.name ?? 'Unnamed Product'}
            </h2>
            <p className="text-sm font-medium text-slate-500">
              SKU: {stock.product?.sku ?? '—'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold tracking-wide text-slate-500 uppercase opacity-0 transition-colors hover:border-red-300 hover:text-red-500"
          >
            Close
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-500">Warehouse</span>
          <span className="text-base font-medium text-slate-800">
            {stock.warehouse?.name ?? '—'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-500">Location ID</span>
          <span className="text-base font-medium text-slate-800">
            {stock.location.name ?? '—'}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Input
          title="On Hand Quantity"
          type="num"
          min={0}
          inputValue={formValues.onHand}
          onChange={(value) => handleNumericChange('onHand', value)}
          required
        />

        <Input
          title="Reserved Quantity"
          type="num"
          min={0}
          inputValue={formValues.reserved}
          onChange={(value) => handleNumericChange('reserved', value)}
          required
        />

        <Input
          title="Free To Use"
          onChange={() => {}}
          type="num"
          inputValue={freeToUse}
          disabled
        />

        {hasValidationError && (
          <p className="text-sm text-red-500">
            Reserved quantity cannot exceed On Hand quantity.
          </p>
        )}
      </section>

      <section className="mt-2 flex flex-row justify-end gap-3">
        <ButtonSm
          text="Cancel"
          state="outline"
          type="button"
          onClick={onClose}
          className="min-w-[120px] justify-center"
        />
        {isDirty && (
          <ButtonSm
            text={isPending ? 'Saving...' : 'Save Changes'}
            state="default"
            type="submit"
            className="min-w-[140px] justify-center text-white"
            disabled={isPending || hasValidationError}
          />
        )}
      </section>
    </form>
  )
}

export default EditStockDialog
