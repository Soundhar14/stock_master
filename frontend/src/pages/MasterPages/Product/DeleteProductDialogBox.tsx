import ButtonSm from "../../../components/common/Buttons";
import { useDeleteProduct } from "../../../queries/Master/productQueries";
import type { Product } from "../../../types/Master/productTypes";

export const DeleteProductDialogBox = ({
  setIsDeleteProductDialogOpen,
  product,
  onDeleted,
}: {
  setIsDeleteProductDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  product: Product;
  onDeleted?: () => void;
}) => {
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const handleDelete = () => {
    deleteProduct(product, {
      onSuccess: () => {
        setIsDeleteProductDialogOpen(false);
        if (onDeleted) onDeleted();
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Header */}
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Product
        <img
          onClick={() => setIsDeleteProductDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      {/* Body */}
      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the product{" "}
        <strong>{product.name}</strong>? This action is irreversible.
      </p>

      {/* Footer */}
      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={() => setIsDeleteProductDialogOpen(false)}
        />

        <ButtonSm
          className="items-center justify-center bg-red-500 text-center text-white hover:bg-red-700 active:bg-red-500"
          state="default"
          onClick={handleDelete}
          text={isDeleting ? "Deleting..." : "Delete"}
        />
      </section>
    </div>
  );
};
