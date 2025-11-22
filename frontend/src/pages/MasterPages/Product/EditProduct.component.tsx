import { useEffect, useState, useMemo } from "react";
import Input from "../../../components/common/Input";
import ButtonSm from "../../../components/common/Buttons";
import DropdownSelect from "../../../components/common/DropDown";

import type { FormState } from "../../../types/appTypes";
import type {
  ProductRequest,
  ProductResponse,
  ProductUnit,
} from "../../../types/Master/productTypes";

import { useCreateProduct, useEditProduct } from "../../../queries/Master/productQueries";
import { useFetchCategoryOptions } from "../../../queries/Master/CategoryQueries";

interface ProductEditProps {
  productDetails: ProductResponse | null;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setProductData: React.Dispatch<React.SetStateAction<ProductResponse | null>>;
}

// Unit dropdown from ProductUnit union
const unitOptions: { id: number; label: ProductUnit }[] = [
  { id: 1, label: "kg" },
  { id: 2, label: "g" },
  { id: 3, label: "litre" },
  { id: 4, label: "ml" },
  { id: 5, label: "piece" },
  { id: 6, label: "box" },
  { id: 7, label: "meter" },
  { id: 8, label: "bundle" },
  { id: 9, label: "packet" },
  { id: 10, label: "roll" },
];

const ProductEdit = ({
  productDetails,
  formState,
  setFormState,
  setProductData,
}: ProductEditProps) => {

  const emptyProduct: ProductRequest = {
    id: 0,
    name: "",
    sku: "",
    description: "",
    categoryId: 0,
    cost: 0,
    unit: "kg",
  };

  const [productData, setProductDataLocal] = useState<ProductRequest | null>(null);
  const [newProductData, setNewProductData] = useState<ProductRequest | null>(null);
  const [title, setTitle] = useState("");

  const { mutate: createProduct, isPending, isSuccess } = useCreateProduct();
  const {
    mutate: updateProduct,
    isPending: isUpdatePending,
    isSuccess: isUpdatingSuccess,
  } = useEditProduct();

  const { data: categoryOptions } = useFetchCategoryOptions();

  // Compare changes
  const isProductChanged = useMemo(() => {
    return JSON.stringify(productData) !== JSON.stringify(newProductData);
  }, [productData, newProductData]);

  // Load initial data for edit mode
  useEffect(() => {
    if (formState === "create") {
      setProductDataLocal(emptyProduct);
      setNewProductData(emptyProduct);
      setTitle("");
    } else if (productDetails) {
      const mapped: ProductRequest = {
        id: productDetails.id,
        name: productDetails.name,
        sku: productDetails.sku,
        description: "",
        categoryId: productDetails.category?.[0]?.id ?? 0,
        cost: productDetails.cost,
        unit: productDetails.unit as ProductUnit,
      };

      setProductDataLocal(mapped);
      setNewProductData(mapped);
      setTitle(productDetails.name);
    }
  }, [productDetails, formState]);

  // After create or update success
  useEffect(() => {
    if (isSuccess) {
      setProductDataLocal(emptyProduct);
      setNewProductData(emptyProduct);
      setFormState("create");
      setTitle("");
    }

    if (isUpdatingSuccess && newProductData && productDetails) {
      setProductData({
        ...productDetails,
        name: newProductData.name,
        sku: newProductData.sku,
        cost: newProductData.cost,
        unit: newProductData.unit,
        category: [
          {
            id: newProductData.categoryId,
            name: categoryOptions?.find(c => c.id === newProductData.categoryId)?.label ?? "",
          },
        ],
      });

      setFormState("create");
      setTitle(newProductData.name);
    }
  }, [isSuccess, isUpdatingSuccess]);

  const handleCancel = () => {
    setProductDataLocal(emptyProduct);
    setNewProductData(emptyProduct);
    setFormState("create");
    setTitle("");
  };

  if (!productData || !newProductData) {
    return <p className="text-center text-sm text-gray-500">Select a product to view details.</p>;
  }

  return (
    <main className="flex max-h-full w-full max-w-[870px] flex-col gap-2">
      <div className="product-config-container flex flex-col gap-3 rounded-[20px]">

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (formState === "create") {
              createProduct(newProductData);
            }
          }}
        >
          {/* HEADER */}
          <header className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-zinc-800">
              {formState === "create"
                ? "Product Configuration"
                : `${title || "Product"} Configuration`}
            </h1>

            <div className="flex gap-3">
              <ButtonSm
                text="Cancel"
                state="outline"
                type="button"
                onClick={handleCancel}
              />

              {/* Create */}
              {formState === "create" && (
                <ButtonSm
                  className="text-white"
                  text={isPending ? "Creating..." : "Create New"}
                  state="default"
                  type="submit"
                />
              )}

              {/* Edit */}
              {formState === "edit" && (
                <ButtonSm
                  className="text-white"
                  text={isUpdatePending ? "Updating..." : "Save Changes"}
                  state="default"
                  disabled={!isProductChanged}
                  type="button"
                  onClick={() => {
                    if (newProductData?.id) updateProduct(newProductData);
                  }}
                />
              )}
            </div>
          </header>

          {/* FORM FIELDS */}
          <section className="flex flex-col gap-3 px-3">

            <Input
              title="Product Name"
              required
              placeholder="Enter product name"
              inputValue={newProductData.name}
              onChange={(value) =>
                setNewProductData({ ...newProductData, name: value })
              }
            />

            <Input
              title="SKU"
              required
              placeholder="Enter product SKU"
              inputValue={newProductData.sku}
              onChange={(value) =>
                setNewProductData({ ...newProductData, sku: value })
              }
            />

            <Input
              title="Description"
              required
              placeholder="Enter product description"
              inputValue={newProductData.description}
              onChange={(value) =>
                setNewProductData({ ...newProductData, description: value })
              }
            />

            <Input
              title="Cost"
              type="num"
              required
              placeholder="Enter product cost"
              inputValue={newProductData.cost}
              onChange={(value) =>
                setNewProductData({ ...newProductData, cost: Number(value) })
              }
            />

            {/* UNIT */}
            <DropdownSelect
              title="Unit"
              required
              options={unitOptions}
              selected={{
                id: unitOptions.find((u) => u.label === newProductData.unit)?.id ?? 1,
                label: newProductData.unit,
              }}
              onChange={(option) =>
                setNewProductData({ ...newProductData, unit: option.label })
              }
            />

            {/* CATEGORY */}
            <DropdownSelect
              title="Category"
              required
              options={categoryOptions || []}
              selected={{
                id: newProductData.categoryId,
                label:
                  categoryOptions?.find((c) => c.id === newProductData.categoryId)
                    ?.label || "Select Category",
              }}
              onChange={(option) =>
                setNewProductData({ ...newProductData, categoryId: option.id })
              }
            />

          </section>
        </form>
      </div>
    </main>
  );
};

export default ProductEdit;
