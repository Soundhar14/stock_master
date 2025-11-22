import {  useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AnimatePresence } from 'motion/react'

import ProductEdit from './EditProduct.component'
import PageHeader from '../../../components/masterPage.components/PageHeader'
import DialogBox from '../../../components/common/DialogBox'
import { DeleteProductDialogBox } from './DeleteProductDialogBox'



import { appRoutes } from '../../../routes/appRoutes'
import type { FormState } from '../../../types/appTypes'
import type { Product } from '../../../types/Master/productTypes'

import GenericTable, {
  type DataCell,
} from '../../../components/common/GenericTable'
import { authHandler } from '../../../utils/authHandler'

const ProductPage = () => {

 const dummyProducts: Product[] = [
  {
    id: 1,
    name: "Steel Rod",
    sku: "SR-001",
    category: { id: 1, name: "Raw Materials" },
    cost: 200,
    unit: "kg",
    companyId: 3,
  },
  {
    id: 2,
    name: "Copper Wire",
    sku: "CW-257",
    category: { id: 1, name: "Raw Materials" },
    cost: 480,
    unit: "roll",
    companyId: 3,
  },
  {
    id: 3,
    name: "PVC Pipe",
    sku: "PVC-102",
    category: { id: 2, name: "Hardware" },
    cost: 150,
    unit: "meter",
    companyId: 3,
  },
  {
    id: 4,
    name: "Lubricant Oil",
    sku: "LO-550",
    category: { id: 3, name: "Chemicals" },
    cost: 90,
    unit: "litre",
    companyId: 3,
  },
  {
    id: 5,
    name: "Packing Box",
    sku: "PB-900",
    category: { id: 4, name: "Packaging" },
    cost: 12,
    unit: "piece",
    companyId: 3,
  },
  {
    id: 6,
    name: "Aluminium Sheet",
    sku: "AL-332",
    category: { id: 1, name: "Raw Materials" },
    cost: 780,
    unit: "kg",
    companyId: 3,
  },
  {
    id: 7,
    name: "Cable Bundle",
    sku: "CB-778",
    category: { id: 2, name: "Hardware" },
    cost: 350,
    unit: "bundle",
    companyId: 3,
  },
  {
    id: 8,
    name: "Plastic Granules",
    sku: "PG-420",
    category: { id: 3, name: "Chemicals" },
    cost: 65,
    unit: "kg",
    companyId: 3,
  },
  {
    id: 9,
    name: "Shrink Wrap",
    sku: "SW-210",
    category: { id: 4, name: "Packaging" },
    cost: 30,
    unit: "roll",
    companyId: 3,
  },
  {
    id: 10,
    name: "Metal Screws",
    sku: "MS-010",
    category: { id: 2, name: "Hardware" },
    cost: 5,
    unit: "packet",
    companyId: 3,
  },
];
  const navigate = useNavigate()

  // 🔐 Auth Check
  useEffect(() => {
    const token = authHandler()
    if (!token) {
      navigate(appRoutes.signIn)
    }
  }, [navigate])

  // UI state
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] =
    useState(false)

  const [product, setProduct] = useState<Product | null>(null)
  const [formState, setFormState] = useState<FormState>('create')

  // Fetch products
  // const {
  //   data: products,
  //   isLoading,
  //   isError,
  // } = useFetchProducts()
const products = dummyProducts
  const handleProductDeleted = () => {
    setProduct(null)
    setFormState('create')
  }

  // if (isLoading) return <MasterPagesSkeleton />
  // if (isError) return <ErrorComponent />

  // Table Columns
  const dataCell: DataCell[] = [
    {
      headingTitle: 'Product Name',
      accessVar: 'name',
      searchable: true,
      sortable: true,
      className: 'min-w-[150px] max-w-[200px]',
    },
    {
      headingTitle: 'SKU',
      accessVar: 'sku',
      searchable: true,
      sortable: true,
      className: 'min-w-[120px] max-w-[180px]',
    },
    {
      headingTitle: 'Category',
      accessVar: 'category.name',
      searchable: true,
      sortable: true,
      className: 'min-w-[150px] max-w-[200px]',
    },
    {
      headingTitle: 'Unit',
      accessVar: 'unit',
      searchable: true,
      sortable: true,
      className: 'min-w-[100px]',
    },
    {
      headingTitle: 'Cost',
      accessVar: 'cost',
      searchable: false,
      sortable: true,
      className: 'min-w-[100px]',
    },
  ]

  return (
    <main className="flex h-max w-full max-w-full flex-col gap-4 md:flex-row">
      <AnimatePresence>
        {isDeleteProductDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsDeleteProductDialogOpen}>
          <DeleteProductDialogBox
  setIsDeleteProductDialogOpen={setIsDeleteProductDialogOpen}
  product={product!}
  onDeleted={handleProductDeleted}
/>

          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left side table */}
      <section className="table-container flex w-full flex-col gap-3 rounded-xl md:w-[50%]">
        <header className="flex flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
          <PageHeader title="Product Configuration" />
        </header>

        <GenericTable
          isMasterTable
          data={products ?? []}
          dataCell={dataCell}
          // isLoading={isLoading}
          onEdit={(row) => {
            setFormState('edit')
            setProduct(row)
          }}
          onDelete={(row) => {
            setProduct(row)
            setIsDeleteProductDialogOpen(true)
          }}
          onView={(row) => {
            setFormState('display')
            setProduct(row)
          }}
          rowKey={(row) => row.id}
          tableTitle="Product Configuration"
        />
      </section>

      {/* Right side form */}
      <section className="table-container max-h-full w-full flex-col gap-3 rounded-xl bg-white/80 p-4 shadow-sm md:w-[50%]">
        <ProductEdit
          productDetails={product}
          formState={formState}
          setFormState={setFormState}
          setProductData={setProduct}
        />
      </section>
    </main>
  )
}

export default ProductPage
