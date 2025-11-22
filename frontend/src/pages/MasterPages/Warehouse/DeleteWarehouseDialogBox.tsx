import ButtonSm from "../../../components/common/Buttons";
import { useDeleteWarehouse } from "../../../queries/Master/WarehouseQueries";
import type { FormState } from "../../../types/appTypes";
import type { Warehouse } from "../../../types/Master/Warehouse";


export const DeleteWarehouseDialogBox = ({
  setFormState,
  setWarehouse,
  setIsDeleteDialogOpen,
  warehouse,
  onDeleted,
}: {
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setWarehouse: React.Dispatch<React.SetStateAction<Warehouse | null>>;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  warehouse: Warehouse;
  onDeleted?: () => void;
}) => {
  const { mutate: deleteWarehouse, isPending: isDeleting } =
    useDeleteWarehouse();

  const handleDelete = () => {
    deleteWarehouse(warehouse, {
      onSuccess: () => {
        setFormState("create");
        setWarehouse(null);
        setIsDeleteDialogOpen(false);
        if (onDeleted) onDeleted();
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Warehouse
        <img
          onClick={() => setIsDeleteDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the warehouse{" "}
        <strong>{warehouse.name}</strong>? This action is irreversible.
      </p>

      <section className="mt-1 grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        <ButtonSm
          className="justify-center font-semibold"
          state="outline"
          text="Cancel"
          onClick={() => setIsDeleteDialogOpen(false)}
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
