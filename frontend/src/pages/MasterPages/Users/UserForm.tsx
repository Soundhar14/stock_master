import { useMemo, useState } from 'react'
import Input from '../../../components/common/Input'
import ButtonSm from '../../../components/common/Buttons'
import DropdownSelect, {
  type DropdownOption,
} from '../../../components/common/DropDown'
import type { FormState } from '../../../types/appTypes'
import type {
  UpdateUserPayload,
  User,
  UserRole,
} from '../../../types/Master/UserTypes'
import {
  useCreateUser,
  useUpdateUser,
} from '../../../queries/Master/UserQueries'
import { useFetchWarehouseOptions } from '../../../queries/Master/WarehouseQueries'

interface UserFormProps {
  userDetails: User | null
  formState: FormState
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>
}

const ROLE_OPTIONS: Array<DropdownOption & { value: UserRole }> = [
  { id: 1, label: 'Admin', value: 'admin' },
  { id: 2, label: 'Inventory Manager', value: 'inventory_manager' },
  { id: 3, label: 'Warehouse Staff', value: 'warehouse_staff' },
]

const DEFAULT_ROLE_OPTION: DropdownOption = { id: 0, label: 'Select Role' }
const DEFAULT_WAREHOUSE_OPTION: DropdownOption = {
  id: 0,
  label: 'Select Warehouse',
}

type UserDraft = Omit<User, 'role'> & {
  role: UserRole | ''
  password: string
  warehouseId: number | null
}

const EMPTY_USER: UserDraft = {
  id: '',
  name: '',
  email: '',
  phone: '',
  role: '',
  password: '',
  warehouseId: null,
}

const UserForm = ({
  userDetails,
  formState,
  setFormState,
  setSelectedUser,
}: UserFormProps) => {
  const [draftUser, setDraftUser] = useState<UserDraft>(() =>
    userDetails
      ? {
          ...EMPTY_USER,
          ...userDetails,
          role: userDetails.role,
          warehouseId:
            typeof userDetails.warehouseId === 'number'
              ? userDetails.warehouseId
              : (userDetails.warehouseId ?? null),
          password: '',
        }
      : { ...EMPTY_USER }
  )

  const { mutate: createUser, isPending: isCreating } = useCreateUser()
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser()
  const { data: warehouseOptions = [], isLoading: isWarehouseLoading } =
    useFetchWarehouseOptions()

  const selectedRoleOption = useMemo(() => {
    return (
      ROLE_OPTIONS.find((option) => option.value === draftUser.role) ||
      DEFAULT_ROLE_OPTION
    )
  }, [draftUser.role])

  const selectedWarehouseOption = useMemo(() => {
    if (!draftUser.warehouseId) return DEFAULT_WAREHOUSE_OPTION
    const option = warehouseOptions.find(
      (wh) => Number(wh.id) === Number(draftUser.warehouseId)
    )
    return option ?? DEFAULT_WAREHOUSE_OPTION
  }, [draftUser.warehouseId, warehouseOptions])

  const isDisplayMode = formState === 'display'
  const isEditMode = formState === 'edit'
  const requiresWarehouse = draftUser.role === 'warehouse_staff'
  const hasPrefilledData = Boolean(
    draftUser.name ||
      draftUser.email ||
      draftUser.phone ||
      draftUser.role ||
      draftUser.password ||
      draftUser.warehouseId
  )

  const requiresPassword = formState === 'create'
  const canSubmit =
    Boolean(draftUser.name.trim()) &&
    Boolean(draftUser.email.trim()) &&
    Boolean(draftUser.phone.trim()) &&
    Boolean(draftUser.role) &&
    (!requiresPassword || Boolean(draftUser.password.trim())) &&
    (!requiresWarehouse || draftUser.warehouseId !== null)

  const basePristine =
    !!userDetails &&
    draftUser.name.trim() === userDetails.name.trim() &&
    draftUser.email.trim() === userDetails.email.trim() &&
    draftUser.phone.trim() === userDetails.phone.trim() &&
    draftUser.role === userDetails.role &&
    (draftUser.warehouseId ?? null) === (userDetails.warehouseId ?? null)

  const isPristine = basePristine && !draftUser.password.trim()

  const resetToCreate = () => {
    if (formState === 'create') {
      setDraftUser({ ...EMPTY_USER })
    }
    setSelectedUser(null)
    setFormState('create')
  }

  const handleCreate = () => {
    if (!canSubmit) return

    const normalizedWarehouseId =
      draftUser.role === 'warehouse_staff'
        ? (draftUser.warehouseId ?? null)
        : null

    createUser(
      {
        name: draftUser.name.trim(),
        email: draftUser.email.trim(),
        phone: draftUser.phone.trim(),
        role: draftUser.role as UserRole,
        password: draftUser.password.trim(),
        warehouseId: normalizedWarehouseId,
      },
      {
        onSuccess: () => {
          resetToCreate()
        },
      }
    )
  }

  const handleUpdate = () => {
    if (!userDetails || !canSubmit) return

    const normalizedWarehouseId =
      draftUser.role === 'warehouse_staff'
        ? (draftUser.warehouseId ?? null)
        : null

    const payload: UpdateUserPayload = {
      id: userDetails.id,
      name: draftUser.name.trim(),
      email: draftUser.email.trim(),
      phone: draftUser.phone.trim(),
      role: (draftUser.role || userDetails.role) as UserRole,
      warehouseId: normalizedWarehouseId,
      ...(draftUser.password.trim()
        ? { password: draftUser.password.trim() }
        : {}),
    }

    updateUser(payload, {
      onSuccess: (updated) => {
        const nextUser = updated ?? payload
        setSelectedUser(nextUser)
        setFormState('create')
      },
    })
  }

  return (
    <main className="flex max-h-full w-full flex-col gap-2">
      <div className="flex flex-col gap-3 rounded-[20px]">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (formState === 'create') {
              handleCreate()
            }
          }}
        >
          <header className="flex w-full items-center justify-between">
            <h1 className="text-lg font-semibold text-zinc-800">
              {formState === 'create'
                ? 'User Configuration'
                : `${userDetails?.name || 'User'} Configuration`}
            </h1>

            <section className="ml-auto flex flex-row items-center gap-3">
              {(isEditMode || (formState === 'create' && hasPrefilledData)) && (
                <ButtonSm
                  className="font-medium"
                  text="Cancel"
                  state="outline"
                  onClick={resetToCreate}
                  type="button"
                />
              )}

              {formState === 'display' && (
                <ButtonSm
                  className="font-medium"
                  text="Back"
                  state="outline"
                  onClick={resetToCreate}
                  type="button"
                />
              )}

              {formState === 'create' && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-60"
                  text={isCreating ? 'Creating...' : 'Create User'}
                  state="default"
                  type="submit"
                  disabled={!canSubmit || isCreating}
                />
              )}

              {isEditMode && (
                <ButtonSm
                  className="font-medium text-white disabled:opacity-60"
                  text={isUpdating ? 'Saving...' : 'Save Changes'}
                  state="default"
                  type="button"
                  disabled={!canSubmit || isPristine || isUpdating}
                  onClick={handleUpdate}
                />
              )}
            </section>
          </header>

          <section className="flex w-full flex-col gap-2 px-3">
            <Input
              required
              disabled={isDisplayMode}
              title="Full Name"
              type="str"
              inputValue={draftUser.name}
              name="name"
              placeholder="Enter full name"
              maxLength={120}
              onChange={(value) => setDraftUser({ ...draftUser, name: value })}
            />
            <Input
              required
              disabled={isDisplayMode}
              title="Email"
              type="str"
              inputValue={draftUser.email}
              name="email"
              placeholder="Enter email address"
              maxLength={120}
              onChange={(value) => setDraftUser({ ...draftUser, email: value })}
            />
            <Input
              required
              disabled={isDisplayMode}
              title="Phone"
              type="str"
              inputValue={draftUser.phone}
              name="phone"
              placeholder="Enter phone number"
              maxLength={20}
              onChange={(value) => setDraftUser({ ...draftUser, phone: value })}
            />
            <Input
              required={requiresPassword}
              disabled={isDisplayMode}
              title="Password"
              type="str"
              htmlType="password"
              inputValue={draftUser.password}
              name="password"
              placeholder={
                formState === 'edit'
                  ? 'Enter new password (optional)'
                  : 'Enter password'
              }
              minLength={6}
              onChange={(value) =>
                setDraftUser({ ...draftUser, password: value })
              }
            />
            <DropdownSelect
              title="Role"
              required
              disabled={isDisplayMode}
              options={ROLE_OPTIONS}
              selected={selectedRoleOption}
              placeholder="Select role"
              onChange={(option) => {
                const role = (ROLE_OPTIONS.find((opt) => opt.id === option.id)
                  ?.value || '') as UserRole | ''
                setDraftUser((prev) => ({
                  ...prev,
                  role,
                  warehouseId:
                    role === 'warehouse_staff' ? prev.warehouseId : null,
                }))
              }}
            />
            {draftUser.role === 'warehouse_staff' && (
              <DropdownSelect
                title="Warehouse"
                required={requiresWarehouse}
                disabled={isDisplayMode}
                options={warehouseOptions}
                selected={selectedWarehouseOption}
                placeholder="Select warehouse"
                isLoading={isWarehouseLoading}
                onChange={(option) =>
                  setDraftUser((prev) => ({
                    ...prev,
                    warehouseId: option.id === 0 ? null : Number(option.id),
                  }))
                }
              />
            )}
          </section>
        </form>
      </div>
    </main>
  )
}

export default UserForm
