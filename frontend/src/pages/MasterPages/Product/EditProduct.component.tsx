import { useEffect, useState } from 'react'
import Input from '../../../components/common/Input'
import ButtonSm from '../../../components/common/Buttons'
import type { FormState } from '../../../types/appTypes'

import {
  useCreateProduct,
  useEditProduct,
} from '../../../queries/Product/productQueries'
import DropdownSelect from "../../../components/common/DropDown";
import type { DropdownOption } from "../../../components/common/DropDown";
import type { Product, ProductCategory, ProductUnit } from '../../../types/Product/productTypes'

const units: ProductUnit[] = [
  'kg',
  'g',
  'litre',
  'ml',
  'piece',
  'box',
  'meter',
  'bundle',
  'packet',
  'roll',
]

const mockCategories: ProductCategory[] = [
  { id: 1, name: 'Raw Materials' },
  { id: 2, name: 'Finished Goods' },
  { id: 3, name: 'Accessories' },
]

const categoryOptions: DropdownOption[] = mockCategories.map((cat) => ({
  id: cat.id,
  label: cat.name,
}));

const unitOptions: DropdownOption[] = units.map((u, index) => ({
  id: index + 1,
  label: u,
}));

/* Example categories (you must replace with API query later) */

const ProductEdit = ({
  productDetails,
  formState,
  setFormState,
  setProductData,
}: {
  productDetails: Product | null
  formState: FormState
  setFormState: React.Dispatch<React.SetStateAction<FormState>>
  setProductData: React.Dispatch<React.SetStateAction<Product | null>>
}) => {
  const emptyProduct: Product = {
    id: 0,
    name: '',
    sku: '',
    cost: 0,
    unit: 'kg',
    category: { id: 1, name: 'Raw Materials' },
  }

  const [productData, setProductDataLocal] = useState<Product | null>(null)
  const [newProductData, setNewProductData] = useState<Product | null>(null)
  const [title, setTitle] = useState('')

  const { mutate: createProduct, isPending, isSuccess } = useCreateProduct()
  const {
    mutate: updateProduct,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditProduct()

  // Load values into form
  useEffect(() => {
    if (formState === 'create') {
      setProductDataLocal(emptyProduct)
      setNewProductData(emptyProduct)
      setTitle('')
    } else if (productDetails) {
      setProductDataLocal(productDetails)
      setNewProductData(productDetails)
      setTitle(productDetails.name)
    }
  }, [productDetails, formState])

  // After create/update success
  useEffect(() => {
    if (isSuccess) {
      setProductDataLocal(emptyProduct)
      setNewProductData(emptyProduct)
      setFormState('create')
      setTitle('')
    } else if (isUpdatingSuccess && newProductData) {
      setProductDataLocal(newProductData)
      setProductData(newProductData)
      setFormState('create')
      setTitle(newProductData.name)
    }
  }, [isSuccess, isUpdatingSuccess])

  const handleCancel = () => {
    setProductDataLocal(emptyProduct)
    setNewProductData(emptyProduct)
    setFormState('create')
    setTitle('')
  }

  const hasData =
    newProductData?.name ||
    newProductData?.sku ||
    newProductData?.cost

  if (!productData || !newProductData) {
    return (
      <p className="text-center text-sm text-gray-500">
        Select a product to view details.
      </p>
    )
  }

  return (
    <main className="flex max-h-full w-full max-w-[870px] flex-col gap-2">
      <div className="product-config-container flex flex-col gap-3 rounded-[20px]">
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (formState === 'create') {
              createProduct(newProductData)
            }
          }}
        >
          {/* Header */}
          <header className="header flex w-full flex-row items-center justify-between">
            <h1 className="text-start text-lg font-semibold text-zinc-800">
              {formState === 'create'
                ? 'Product Configuration'
                : `${title || 'Product'} Configuration`}
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

              {formState === 'display' && productData.id !== 0 && (
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
                  onClick={() => updateProduct(newProductData)}
                  disabled={
                    JSON.stringify(newProductData) ===
                    JSON.stringify(productData)
                  }
                />
              )}
            </section>
          </header>

          {/* Product Details */}
          <section className="product-details-section flex w-full flex-col gap-2 px-3">
            <Input
              required
              disabled={formState === 'display'}
              title="Product Name"
              type="str"
              inputValue={newProductData.name}
              name="name"
              placeholder="Enter product name"
              maxLength={50}
              onChange={(value) =>
                setNewProductData({ ...newProductData, name: value })
              }
            />

            <Input
              required
              disabled={formState === 'display'}
              title="SKU"
              type="str"
              inputValue={newProductData.sku}
              name="sku"
              placeholder="Enter product SKU"
              maxLength={50}
              onChange={(value) =>
                setNewProductData({ ...newProductData, sku: value })
              }
            />

  {/* CATEGORY DROPDOWN (Custom Component) */}
<DropdownSelect
  title="Category"
  required
  disabled={formState === "display"}
  options={categoryOptions}
  selected={{
    id: newProductData.category.id,
    label: newProductData.category.name,
  }}
  onChange={(option) => {
    const category = mockCategories.find((c) => c.id === option.id)!;
    setNewProductData({
      ...newProductData,
      category: category,
    });
  }}
/>

{/* UNIT DROPDOWN (Custom Component) */}
<DropdownSelect
  title="Unit"
  required
  disabled={formState === "display"}
  options={unitOptions}
  selected={{
    id: unitOptions.find((u) => u.label === newProductData.unit)?.id ?? 0,
    label: newProductData.unit,
  }}
  onChange={(option) => {
    setNewProductData({
      ...newProductData,
      unit: option.label as ProductUnit,
    });
  }}
/>


            <Input
              required
              disabled={formState === 'display'}
              title="Cost"
              type="num"
              inputValue={newProductData.cost}
              name="cost"
              placeholder="Enter cost"
              onChange={(value) =>
                setNewProductData({
                  ...newProductData,
                  cost: Number(value),
                })
              }
            />
          </section>
        </form>
      </div>
    </main>
  )
}

export default ProductEdit
