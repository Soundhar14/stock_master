import { useState } from 'react'
import Input from '../../components/common/Input'
import ButtonSm from '../../components/common/Buttons'
import Textarea from '../../components/common/Textarea'
import { toast } from 'react-toastify'
import { useCreateDelivery } from '../../queries/DeliveryQueries'
import type { CreateDeliveryPayload } from '../../types/Delivery'

const statusOptions = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'In Transit', value: 'IN_TRANSIT' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
]

const emptyItem = { productId: '', quantity: '' }

interface CreateDeliveryDialogProps {
  onClose: () => void
}

const CreateDeliveryDialog = ({ onClose }: CreateDeliveryDialogProps) => {
  const [reference, setReference] = useState('')
  const [status, setStatus] = useState('PENDING')
  const [warehouseId, setWarehouseId] = useState('')
  const [locationId, setLocationId] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [responsibleUserId, setResponsibleUserId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerContact, setCustomerContact] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState([{ ...emptyItem }])

  const { mutate: createDelivery, isPending } = useCreateDelivery()

  const handleAddItem = () => {
    setItems((prev) => [...prev, { ...emptyItem }])
  }

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== index))
  }

  const updateItem = (
    index: number,
    field: 'productId' | 'quantity',
    value: string
  ) => {
    setItems((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    )
  }

  const validItems = items
    .map((item) => ({
      productId: Number(item.productId),
      quantity: Number(item.quantity),
    }))
    .filter(
      (item) =>
        !Number.isNaN(item.productId) && item.productId > 0 && item.quantity > 0
    )

  const parsedWarehouseId = Number(warehouseId)
  const parsedLocationId = locationId ? Number(locationId) : undefined
  const hasValidWarehouse =
    !Number.isNaN(parsedWarehouseId) && parsedWarehouseId > 0

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
      warehouseId: parsedWarehouseId,
      locationId:
        parsedLocationId && !Number.isNaN(parsedLocationId)
          ? parsedLocationId
          : undefined,
      deliveryAddress: deliveryAddress.trim(),
      responsibleUserId: (() => {
        const trimmed = responsibleUserId.trim()
        if (!trimmed) return null
        const numeric = Number(trimmed)
        return !Number.isNaN(numeric) && numeric > 0 ? numeric : trimmed
      })(),
      scheduledDate,
      customerName: customerName.trim(),
      customerContact: customerContact.trim() || undefined,
      notes: notes.trim() || undefined,
      items: validItems,
    }

    createDelivery(payload, {
      onSuccess: () => {
        onClose()
      },
    })
  }

  return (
    <form
      className="flex w-full max-w-2xl flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Create Delivery
          </h2>
          <p className="text-sm text-slate-500">
            Fill the details below to schedule a new delivery order.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-500 transition hover:text-slate-800"
        >
          <img src="/icons/close-icon.svg" alt="Close" className="h-5 w-5" />
        </button>
      </header>

      <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input
          title="Reference"
          placeholder="DEL-1001"
          inputValue={reference}
          onChange={setReference}
        />
        <Input
          required
          title="Warehouse ID"
          placeholder="e.g., 1"
          inputValue={warehouseId}
          onChange={setWarehouseId}
        />
        <Input
          title="Location ID"
          placeholder="e.g., 2"
          inputValue={locationId}
          onChange={setLocationId}
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

      <section className="flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 p-4">
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
            className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <Input
              required
              title="Product ID"
              placeholder="Product ID"
              inputValue={item.productId}
              onChange={(value) => updateItem(index, 'productId', value)}
            />
            <Input
              required
              title="Quantity"
              placeholder="Quantity"
              inputValue={item.quantity}
              onChange={(value) => updateItem(index, 'quantity', value)}
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
        <ButtonSm
          type="submit"
          state="default"
          text={isPending ? 'Creating Delivery...' : 'Create Delivery'}
          className="w-full justify-center text-white"
          disabled={!canSubmit || isPending}
        />
        <ButtonSm
          type="button"
          state="outline"
          text="Cancel"
          className="w-full justify-center"
          onClick={onClose}
        />
      </section>
    </form>
  )
}

export default CreateDeliveryDialog
