import ButtonSm from "../../../components/common/Buttons";
import { useDeleteCategory } from "../../../queries/Master/CategoryQueries";
import type { FormState } from "../../../types/appTypes";
import type { category } from "../../../types/Master/CategoryTypes";

export const DeleteCategoryDialogBox = ({
  setFormState,
  setCategory,
  setIsDeleteDialogOpen,
  category,
  onDeleted,
}: {
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  setCategory: React.Dispatch<React.SetStateAction<category | null>>;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category: category;
  onDeleted?: () => void;
}) => {
  const { mutate: deleteCategory, isPending: isDeleting } =
    useDeleteCategory();

  const handleDelete = () => {
    deleteCategory(category, {
      onSuccess: () => {
        setFormState("create");
        setCategory(null);
        setIsDeleteDialogOpen(false);
        if (onDeleted) onDeleted();
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <header className="header flex w-full flex-row items-center justify-between text-lg font-medium text-red-600">
        Delete Category
        <img
          onClick={() => setIsDeleteDialogOpen(false)}
          className="w-5 cursor-pointer"
          src="/icons/close-icon.svg"
          alt="close"
        />
      </header>

      <p className="text-md font-medium text-zinc-700">
        Are you sure you want to delete the category{" "}
        <strong>{category.name}</strong>? This action is irreversible.
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
