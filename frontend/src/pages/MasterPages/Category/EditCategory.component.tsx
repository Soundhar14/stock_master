import { useEffect, useState } from 'react'
import Input from '../../../components/common/Input'
import ButtonSm from '../../../components/common/Buttons'

import {
  useCreateCategory,
  useEditCategory,
} from '../../../queries/Master/CategoryQueries'

import type { FormState } from '../../../types/appTypes'
import type { category } from '../../../types/Master/CategoryTypes'

const CategoryEdit = ({
  categoryDetails,
  formState,
  setFormState,
  setCategoryData,
}: {
  categoryDetails: category | null
  formState: FormState
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
  setCategoryData: React.Dispatch<React.SetStateAction<category | null>>
}) => {
  const [categoryLocal, setCategoryLocal] = useState<category | null>(null)
  const [newCategory, setNewCategory] = useState<category | null>(null)
  const [title, setTitle] = useState('')

  // Hooks
  const { mutate: createCategory, isPending, isSuccess } = useCreateCategory()
  const {
    mutate: updateCategory,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditCategory()

  // Empty Category
  const emptyCategory: category = {
    id: 0,
    name: '',
  }

  // Initialize
  useEffect(() => {
    if (formState === 'create') {
      setCategoryLocal(emptyCategory)
      setNewCategory(emptyCategory)
      setTitle('')
    } else if (categoryDetails) {
      setCategoryLocal(categoryDetails)
      setNewCategory(categoryDetails)
      setTitle(categoryDetails.name || '')
    }
  }, [categoryDetails, formState])

  // Success Handlers
  useEffect(() => {
    if (isSuccess) {
      setCategoryLocal(emptyCategory)
      setNewCategory(emptyCategory)
      setFormState('create')
      setTitle('')
    } else if (isUpdatingSuccess && newCategory) {
      setCategoryLocal(newCategory)
      setCategoryData(newCategory)
      setFormState('create')
      setTitle(newCategory.name)
    }
  }, [isSuccess, isUpdatingSuccess])

  const handleCancel = () => {
    setCategoryLocal(emptyCategory)
    setNewCategory(emptyCategory)
    setFormState('create')
    setTitle('')
  }

  const hasData = Boolean(newCategory?.name)

  if (!categoryLocal || !newCategory) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select a category to view details.
      </p>
    )
  }

  return (
    <main className="flex max-h-full w-full flex-col gap-2">
      <div className="flex flex-col gap-3 rounded-[20px]">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (formState === 'create') {
              createCategory(newCategory)
            }
          }}
        >
          <header className="flex w-full items-center justify-between">
            <h1 className="text-lg font-semibold text-zinc-800">
              {formState === 'create'
                ? 'Category Configuration'
                : `${title || 'Category'} Configuration`}
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

              {formState === 'display' && categoryLocal.id !== 0 && (
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
                  disabled={
                    JSON.stringify(newCategory) ===
                    JSON.stringify(categoryLocal)
                  }
                  onClick={() => updateCategory(newCategory)}
                />
              )}
            </section>
          </header>

          {/* Category Fields */}
          <section className="flex w-full flex-col gap-2 px-3">
            <Input
              required
              disabled={formState === 'display'}
              title="Category Name"
              type="str"
              inputValue={newCategory.name}
              name="name"
              placeholder="Enter category name"
              maxLength={100}
              onChange={(value) =>
                setNewCategory({ ...newCategory, name: value })
              }
            />
          </section>
        </form>
      </div>
    </main>
  )
}

export default CategoryEdit
