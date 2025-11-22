import { useEffect, useState } from 'react'
import Input from '../../../components/common/Input'
import ButtonSm from '../../../components/common/Buttons'
import {
  useCreateWarehouse,
  useEditWarehouse,
} from '../../../queries/Master/WarehouseQueries'
import type { FormState } from '../../../types/appTypes'
import type { Warehouse, Location } from '../../../types/Master/Warehouse'
import { Trash2Icon } from 'lucide-react'

const WarehouseEdit = ({
  warehouseDetails,
  formState,
  setFormState,
  setWarehouseData,
}: {
  warehouseDetails: Warehouse | null
  formState: FormState
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
  setWarehouseData: React.Dispatch<React.SetStateAction<Warehouse | null>>
}) => {
  const [warehouseLocal, setWarehouseLocal] = useState<Warehouse | null>(null)
  const [newWarehouse, setNewWarehouse] = useState<Warehouse | null>(null)
  const [title, setTitle] = useState('')

  // hooks (shape kept similar to your branch hooks)
  const { mutate: createWarehouse, isPending, isSuccess } = useCreateWarehouse()
  const {
    mutate: updateWarehouse,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditWarehouse()

  // Minimal empty warehouse object matching your Warehouse type
  const emptyWarehouse: Warehouse = {
    id: 0,
    shortCode: '',
    name: '',
    address: '',
    city: '',
    locations: [],
    isActive: true,
  }

  const normalizeWarehouse = (warehouse: Warehouse): Warehouse => ({
    ...warehouse,
    locations: warehouse.locations ?? [],
  })

  // initialize local state based on formState / incoming prop
  useEffect(() => {
    if (formState === 'create') {
      setWarehouseLocal(emptyWarehouse)
      setNewWarehouse(emptyWarehouse)
      setTitle('')
    } else if (warehouseDetails) {
      const hydratedWarehouse = normalizeWarehouse(warehouseDetails)
      setWarehouseLocal(hydratedWarehouse)
      setNewWarehouse(hydratedWarehouse)
      setTitle(hydratedWarehouse.name || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warehouseDetails, formState])

  // react to create / update success (same UX as branch)
  useEffect(() => {
    if (isSuccess) {
      setWarehouseLocal(emptyWarehouse)
      setNewWarehouse(emptyWarehouse)
      setFormState('create')
      setTitle('')
    } else if (isUpdatingSuccess && newWarehouse) {
      const hydratedWarehouse = normalizeWarehouse(newWarehouse)
      setWarehouseLocal(hydratedWarehouse)
      setWarehouseData(hydratedWarehouse)
      setFormState('create')
      setTitle(hydratedWarehouse.name)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isUpdatingSuccess])

  const handleCancel = () => {
    setWarehouseLocal(emptyWarehouse)
    setNewWarehouse(emptyWarehouse)
    setFormState('create')
    setTitle('')
  }

  const safeLocations = newWarehouse?.locations ?? []

  const createTempLocation = (): Location => ({
    id: -Date.now(),
    name: '',
  })

  const handleLocationNameChange = (index: number, value: string) => {
    if (!newWarehouse) return
    const updatedLocations = safeLocations.map((location, idx) =>
      idx === index ? { ...location, name: value } : location
    )
    setNewWarehouse({ ...newWarehouse, locations: updatedLocations })
  }

  const handleAddLocation = () => {
    if (!newWarehouse) return
    const updatedLocations: Location[] = [
      ...safeLocations,
      createTempLocation(),
    ]
    setNewWarehouse({ ...newWarehouse, locations: updatedLocations })
  }

  const handleRemoveLocation = (locationId: number) => {
    if (!newWarehouse) return
    const updatedLocations = safeLocations.filter(
      (loc) => loc.id !== locationId
    )
    setNewWarehouse({ ...newWarehouse, locations: updatedLocations })
  }

  const hasData =
    Boolean(newWarehouse?.shortCode) ||
    Boolean(newWarehouse?.name) ||
    Boolean(newWarehouse?.address) ||
    Boolean(newWarehouse?.city)

  if (!warehouseLocal || !newWarehouse) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select a warehouse to view details.
      </p>
    )
  }

  return (
    <main className="flex h-min w-full max-w-[870px] flex-col gap-2">
      <div className="branch-config-container flex flex-col gap-3 rounded-[20px]">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (formState === 'create') {
              createWarehouse(newWarehouse)
            }
          }}
        >
          <header className="header flex w-full flex-row items-center justify-between">
            <h1 className="text-start text-lg font-semibold text-zinc-800">
              {formState === 'create'
                ? 'Warehouse Configuration'
                : `${title || 'Warehouse'} Configuration`}
            </h1>

            <section className="ml-auto flex flex-row items-center gap-3">
              {(formState === 'edit' ||
                (formState === 'create' && hasData)) && (
                <ButtonSm
                  className="font-medium"
                  text="Cancel"
                  state="outline"
                  onClick={handleCancel}
                  type="button"
                />
              )}

              {formState === 'display' && warehouseLocal.id !== 0 && (
                <ButtonSm
                  className="font-medium"
                  text="Back"
                  state="outline"
                  onClick={handleCancel}
                  type="button"
                />
              )}

              {formState === 'create' && (
                <ButtonSm
                  className="font-medium text-white"
                  text={isPending ? 'Creating...' : 'Create New'}
                  state="default"
                  type="submit"
                />
              )}

              {formState === 'edit' && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-60"
                  text={isUpdatePending ? 'Updating...' : 'Save Changes'}
                  state="default"
                  type="button"
                  onClick={() => updateWarehouse(newWarehouse)}
                  disabled={
                    JSON.stringify(newWarehouse) ===
                    JSON.stringify(warehouseLocal)
                  }
                />
              )}
            </section>
          </header>

          {/* Warehouse Details */}
          <section className="branch-details-section flex w-full flex-col gap-2 px-3">
            <Input
              required
              disabled={formState === 'display'}
              title="Short Code"
              type="str"
              inputValue={newWarehouse.shortCode}
              name="shortCode"
              placeholder="WH1-Chennai"
              maxLength={50}
              onChange={(value) =>
                setNewWarehouse({ ...newWarehouse, shortCode: value })
              }
            />

            <Input
              required
              disabled={formState === 'display'}
              title="Warehouse Name"
              type="str"
              inputValue={newWarehouse.name}
              name="name"
              placeholder="Enter warehouse name"
              maxLength={100}
              onChange={(value) =>
                setNewWarehouse({ ...newWarehouse, name: value })
              }
            />

            <div className="flex flex-col gap-3">
              <Input
                required
                disabled={formState === 'display'}
                title="Address"
                type="str"
                inputValue={newWarehouse.address}
                name="address"
                placeholder="Enter address"
                maxLength={200}
                onChange={(value) =>
                  setNewWarehouse({ ...newWarehouse, address: value })
                }
              />

              <Input
                disabled={formState === 'display'}
                title="City"
                type="str"
                inputValue={newWarehouse.city}
                name="city"
                placeholder="City"
                maxLength={80}
                onChange={(value) =>
                  setNewWarehouse({ ...newWarehouse, city: value })
                }
              />
            </div>

            {/* Simple location editor so QA can verify UI flows */}
            <div className="my-4 flex items-center justify-between">
              <h2 className="text-md font-semibold text-slate-700">
                Locations
              </h2>
              {formState !== 'display' && (
                <button
                  type="button"
                  onClick={handleAddLocation}
                  className="cursor-pointer text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  + Add Location
                </button>
              )}
            </div>
            <section className="flex flex-col gap-2">
              {safeLocations.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No locations added yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-2">
                  {safeLocations.map((location, index) => (
                    <li
                      key={location.id}
                      className="flex flex-col gap-2 rounded-2xl bg-slate-50 md:flex-row md:items-end"
                    >
                      <Input
                        title={`Location ${index + 1}`}
                        placeholder="Enter location name"
                        type="str"
                        maxLength={80}
                        name={`location-${location.id}`}
                        disabled={formState === 'display'}
                        inputValue={location.name}
                        onChange={(value) =>
                          handleLocationNameChange(index, value)
                        }
                      />
                      {formState !== 'display' && (
                        <button className="mb-0.5 flex cursor-pointer flex-row items-center gap-2 rounded-xl bg-red-100 p-4 text-sm font-medium text-red-600">
                          <Trash2Icon
                            className="cursor-pointer border-0 bg-transparent p-0 text-red-600 transition-transform hover:scale-110"
                            onClick={() => handleRemoveLocation(location.id)}
                            size={14}
                          />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </section>
        </form>
      </div>
    </main>
  )
}

export default WarehouseEdit
