import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'react-toastify'

import Input from '../../components/common/Input'
import ButtonSm from '../../components/common/Buttons'
import Textarea from '../../components/common/Textarea'
import DropdownSelect, {
  type DropdownOption,
} from '../../components/common/DropDown'
import {
  useCreateDelivery,
  useUpdateDelivery,
} from '../../queries/DeliveryQueries'
import { useFetchWarehouses } from '../../queries/Master/WarehouseQueries'
import { useFetchProductOptions } from '../../queries/Master/productQueries'
import type { CreateDeliveryPayload, DeliveryOrder } from '../../types/Delivery'

const statusOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

const defaultProductOption: DropdownOption = {
  id: 0,
  label: 'Select Product',
}

const defaultWarehouseOption: DropdownOption = {
  id: 0,
  label: 'Select Warehouse',
}

const defaultLocationOption: DropdownOption = {
  id: 0,
  label: 'Select Location',
}

const createEmptyItem = () => ({
  productOption: defaultProductOption,
  quantity: '',
})

const generateReference = () => {
  const now = new Date()
  const datePart = `${now.getFullYear()}${`${now.getMonth() + 1}`.padStart(2, '0')}${`${now.getDate()}`.padStart(2, '0')}`
  const timePart = `${`${now.getHours()}`.padStart(2, '0')}${`${now.getMinutes()}`.padStart(2, '0')}${`${now.getSeconds()}`.padStart(2, '0')}`
  return `ref-${datePart}-${timePart}`
}

interface CreateDeliveryFormProps {
  onCancel?: () => void
  onSuccess?: () => void
}

const CreateDeliveryForm = ({
  onCancel,
  onSuccess,
}: CreateDeliveryFormProps) => {
  const [reference] = useState(generateReference)
  const [status, setStatus] = useState('PENDING')
  const [selectedWarehouse, setSelectedWarehouse] = useState<DropdownOption>(
    defaultWarehouseOption
  )
  const [selectedLocation, setSelectedLocation] = useState<DropdownOption>(
    defaultLocationOption
  )
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [responsibleUserId, setResponsibleUserId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerContact, setCustomerContact] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([createEmptyItem()])

  const { data: productOptions = [], isLoading: isLoadingProducts } =
    useFetchProductOptions()
  const { data: warehouseList = [], isLoading: isLoadingWarehouses } =
    useFetchWarehouses()

  const { mutate: createDelivery, isPending } = useCreateDelivery()

  const handleAddItem = () => setItems((prev) => [...prev, createEmptyItem()])

  const handleRemoveItem = (index: number) =>
    setItems((prev) => prev.filter((_, idx) => idx !== index))

  const updateItemQuantity = (index: number, value: string) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, quantity: value } : item
      )
    )
  }

  const updateItemProduct = (index: number, option: DropdownOption) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, productOption: option } : item
      )
    )
  }

  const handleWarehouseSelection = (option: DropdownOption) => {
    setSelectedWarehouse(option)
    setSelectedLocation(defaultLocationOption)
  }

  const resolvedProductOptions = useMemo(() => {
    if (!productOptions.length) return [defaultProductOption]
    return productOptions
  }, [productOptions])

  const validItems = items
    .map((item) => ({
      productId: item.productOption.id,
      quantity: Number(item.quantity),
    }))
    .filter(
      (item) =>
        !Number.isNaN(item.productId) && item.productId > 0 && item.quantity > 0
    )

  const resolvedWarehouseOptions = useMemo(() => {
    if (!warehouseList?.length) return []
    return warehouseList.map((wh) => ({
      id: wh.id,
      label: `${wh.shortCode ?? wh.id} - ${wh.name}`,
    }))
  }, [warehouseList])

  const activeWarehouse = useMemo(
    () => warehouseList.find((wh) => wh.id === selectedWarehouse.id),
    [warehouseList, selectedWarehouse]
  )

  const locationOptions = useMemo(() => {
    if (!activeWarehouse?.locations?.length) return []
    return activeWarehouse.locations
      .filter((location) => Boolean(location.id))
      .map((location) => ({
        id: location.id as number,
        label: location.name ?? `Location ${location.id}`,
      }))
  }, [activeWarehouse])

  const hasValidWarehouse = selectedWarehouse.id > 0

  const canSubmit =
    hasValidWarehouse &&
    Boolean(deliveryAddress.trim()) &&
    Boolean(scheduledDate) &&
    Boolean(customerName.trim()) &&
    validItems.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!canSubmit) {
      toast.error('Please fill all required fields and add at least one item.')
      return
    }

    const payload: CreateDeliveryPayload = {
      reference: reference.trim() || undefined,
      status: status as CreateDeliveryPayload['status'],
      warehouseId: selectedWarehouse.id,
      locationId: selectedLocation.id > 0 ? selectedLocation.id : undefined,
      deliveryAddress: deliveryAddress.trim(),
      responsibleUserId: (() => {
        const trimmed = responsibleUserId.trim()
        if (!trimmed) return null
        const numeric = Number(trimmed)
        if (!Number.isNaN(numeric) && numeric > 0) return numeric
        return trimmed
      })(),
      scheduledDate,
      customerName: customerName.trim(),
      customerContact: customerContact.trim() || undefined,
      notes: notes.trim() || undefined,
      items: validItems,
    }

    createDelivery(payload, {
      onSuccess: () => {
        toast.success('Delivery created successfully')
        onSuccess?.()
      },
    })
  }

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          title="Reference"
          placeholder="DEL-1001"
          inputValue={reference}
          onChange={() => {}}
          disabled
        />
        <DropdownSelect
          title="Warehouse"
          required
          options={resolvedWarehouseOptions}
          selected={selectedWarehouse}
          onChange={handleWarehouseSelection}
          isLoading={isLoadingWarehouses}
        />
        <DropdownSelect
          title="Location"
          options={locationOptions}
          selected={selectedLocation}
          onChange={(option) => setSelectedLocation(option)}
          disabled={!locationOptions.length}
          placeholder={
            locationOptions.length ? 'Select Location' : 'No locations'
          }
        />
        <Input
          title="Responsible User ID"
          placeholder="e.g., 5"
          inputValue={responsibleUserId}
          onChange={setResponsibleUserId}
        />
        <Input
          required
          title="Schedule Date"
          htmlType="date"
          inputValue={scheduledDate}
          onChange={setScheduledDate}
        />
        <Input
          required
          title="Customer Name"
          placeholder="John Doe"
          inputValue={customerName}
          onChange={setCustomerName}
        />
        <Input
          title="Customer Contact"
          placeholder="9876543210"
          inputValue={customerContact}
          onChange={setCustomerContact}
        />
        <div className="flex flex-col">
          <label className="mb-1 text-xs font-semibold text-slate-700">
            Status
          </label>
          <select
            className="rounded-xl border-2 border-slate-300 bg-white px-3 py-3 text-sm font-medium text-slate-700 focus:border-slate-500 focus:outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <Textarea
        title="Delivery Address"
        placeholder="123 Main Street, City"
        inputValue={deliveryAddress}
        onChange={(value) => setDeliveryAddress(value)}
        required
      />

      <Textarea
        title="Notes"
        placeholder="Any special handling instructions"
        inputValue={notes}
        onChange={(value) => setNotes(value)}
      />

      <section className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-800">Items</h3>
            <p className="text-xs text-slate-500">
              Add products that need to be delivered.
            </p>
          </div>
          <ButtonSm
            type="button"
            state="outline"
            text="Add Item"
            onClick={handleAddItem}
          />
        </header>

        {items.map((item, index) => (
          <div
            key={`item-${index}`}
            className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <DropdownSelect
              title="Product"
              required
              options={resolvedProductOptions}
              selected={item.productOption}
              onChange={(option) => updateItemProduct(index, option)}
              isLoading={isLoadingProducts}
            />
            <Input
              required
              title="Quantity"
              placeholder="Quantity"
              inputValue={item.quantity}
              onChange={(value) => updateItemQuantity(index, value)}
            />
            {items.length > 1 && (
              <ButtonSm
                type="button"
                state="outline"
                text="Remove"
                onClick={() => handleRemoveItem(index)}
                className="self-end"
              />
            )}
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2 border-t border-slate-200 pt-4">
        <div className="flex flex-col gap-2 md:flex-row md:justify-end">
          {onCancel && (
            <ButtonSm
              type="button"
              state="outline"
              text="Cancel"
              className="justify-center px-4 py-2 text-sm md:w-auto"
              onClick={onCancel}
            />
          )}
          <ButtonSm
            type="submit"
            state="default"
            text={isPending ? 'Saving...' : 'Create Delivery'}
            className="justify-center px-4 py-2 text-sm text-white md:w-auto"
            disabled={!canSubmit || isPending}
          />
        </div>
      </section>
    </form>
  )
}

export default CreateDeliveryForm
