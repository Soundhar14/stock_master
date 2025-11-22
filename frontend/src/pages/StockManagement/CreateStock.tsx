import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

import Input from '../../components/common/Input'
import ButtonSm from '../../components/common/Buttons'
import DropdownSelect, {
  type DropdownOption,
} from '../../components/common/DropDown'
import { useCreateStock } from '../../queries/StockQueries'
import { useFetchProductOptions } from '../../queries/Master/productQueries'
import {
  useFetchWarehouseOptions,
  useFetchWarehouses,
} from '../../queries/Master/WarehouseQueries'

interface CreateStockProps {
  onClose: () => void
}

type CreateStockFormState = {
  onHand: number
  reserved: number
}

const productPlaceholder: DropdownOption = { id: 0, label: 'Select Product' }
const warehousePlaceholder: DropdownOption = {
  id: 0,
  label: 'Select Warehouse',
}
const locationPlaceholder: DropdownOption = {
  id: 0,
  label: 'Select Location',
}

const sanitizeQuantity = (value: string | number): number => {
  if (value === '' || value === null || value === undefined) return 0
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return 0
  return Math.max(0, parsed)
}

const CreateStock = ({ onClose }: CreateStockProps) => {
  const [formValues, setFormValues] = useState<CreateStockFormState>({
    onHand: 0,
    reserved: 0,
  })
  const [selectedProduct, setSelectedProduct] =
    useState<DropdownOption>(productPlaceholder)
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<DropdownOption>(warehousePlaceholder)
  const [selectedLocation, setSelectedLocation] =
    useState<DropdownOption>(locationPlaceholder)

  const { mutate: createStock, isPending } = useCreateStock()
  const { data: productOptions, isLoading: productOptionsLoading } =
    useFetchProductOptions()
  const { data: warehouseOptions, isLoading: warehouseOptionsLoading } =
    useFetchWarehouseOptions()
  const { data: warehouses, isLoading: warehousesLoading } =
    useFetchWarehouses()

  const selectedWarehouseDetails = useMemo(() => {
    if (!warehouses || !selectedWarehouse.id) return null
    return (
      warehouses.find((warehouse) => warehouse.id === selectedWarehouse.id) ??
      null
    )
  }, [warehouses, selectedWarehouse.id])

  const locationOptions = useMemo<DropdownOption[]>(() => {
    if (!selectedWarehouseDetails?.locations?.length) return []
    return selectedWarehouseDetails.locations.map((location) => ({
      id: location.id,
      label: location.name,
    }))
  }, [selectedWarehouseDetails])

  const freeToUse = useMemo(() => {
    const computed = formValues.onHand - formValues.reserved
    return computed >= 0 ? computed : 0
  }, [formValues])

  const hasValidationError = formValues.reserved > formValues.onHand
  const hasRequiredSelections =
    selectedProduct.id !== 0 && selectedWarehouse.id !== 0
  const canSubmit = hasRequiredSelections && !hasValidationError

  const handleQuantityChange = (
    field: 'onHand' | 'reserved',
    value: string | number
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: sanitizeQuantity(value),
    }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!canSubmit) {
      if (!hasRequiredSelections) {
        toast.error('Select both product and warehouse to create stock.')
      }
      return
    }

    const productId = selectedProduct.id
    const warehouseId = selectedWarehouse.id
    const locationId = selectedLocation.id === 0 ? null : selectedLocation.id

    createStock(
      {
        productId,
        warehouseId,
        locationId,
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

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <header className="rounded-2xl bg-slate-50 p-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            New Stock Entry
          </p>
          <h2 className="text-xl font-semibold text-slate-900">
            Create Inventory Record
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Provide the identifiers and quantities to register stock.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <DropdownSelect
          title="Product"
          options={productOptions ?? []}
          selected={selectedProduct}
          onChange={(option) => setSelectedProduct(option)}
          required
          placeholder="Select product"
          isLoading={productOptionsLoading}
        />
        <DropdownSelect
          title="Warehouse"
          options={warehouseOptions ?? []}
          selected={selectedWarehouse}
          onChange={(option) => {
            setSelectedWarehouse(option)
            setSelectedLocation(locationPlaceholder)
          }}
          required
          placeholder="Select warehouse"
          isLoading={warehouseOptionsLoading}
        />
        <DropdownSelect
          title="Location"
          options={locationOptions}
          selected={
            selectedLocation.id === 0
              ? {
                  ...selectedLocation,
                  label:
                    selectedWarehouse.id === 0
                      ? 'Select Warehouse First'
                      : locationPlaceholder.label,
                }
              : selectedLocation
          }
          onChange={(option) => setSelectedLocation(option)}
          disabled={selectedWarehouse.id === 0}
          allowClear
          isLoading={warehousesLoading && selectedWarehouse.id !== 0}
        />
      </section>

      <section className="flex flex-col gap-3">
        <Input
          title="On Hand Quantity"
          type="num"
          min={0}
          inputValue={formValues.onHand}
          onChange={(value) => handleQuantityChange('onHand', value)}
          required
        />
        <Input
          title="Reserved Quantity"
          type="num"
          min={0}
          inputValue={formValues.reserved}
          onChange={(value) => handleQuantityChange('reserved', value)}
          required
        />
        <Input
          title="Free To Use"
          type="num"
          inputValue={freeToUse}
          disabled
          onChange={() => {}}
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
        <ButtonSm
          text={isPending ? 'Creating...' : 'Create Stock'}
          state="default"
          type="submit"
          className="min-w-[140px] justify-center text-white"
          disabled={isPending || !canSubmit}
        />
      </section>
    </form>
  )
}

export default CreateStock
