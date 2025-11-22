import { useNavigate } from "react-router-dom";
import CategoryEdit from "./EditCategory.component";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import DialogBox from "../../../components/common/DialogBox";
import GenericTable, {
  type DataCell,
} from "../../../components/common/GenericTable";
import ErrorComponent from "../../../components/common/Error";
import MasterPagesSkeleton from "../../../components/masterPage.components/LoadingSkeleton";
import { useFetchCategories } from "../../../queries/Master/CategoryQueries";
import { appRoutes } from "../../../routes/appRoutes";
import type { category } from "../../../types/Master/CategoryTypes";
import { authHandler } from "../../../utils/authHandler";
import type { FormState } from "../../../types/appTypes";
import { DeleteCategoryDialogBox } from "./DeleteCategoryDialogBox";

const CategoriesPage = () => {
  const navigate = useNavigate();

  // Redirect if token missing
  useEffect(() => {
    const token = authHandler();
    if (!token) navigate(appRoutes.signIn);
  }, [navigate]);

  // Dialog + Form State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [category, setCategory] = useState<category | null>(null);
  const [formState, setFormState] = useState<FormState>("create");

  // Fetch categories
  const { data: categories, isLoading, isError } = useFetchCategories();

  const handleCategoryDeleted = () => {
    setCategory(null);
    setFormState("create");
  };

  if (isLoading) return <MasterPagesSkeleton />;
  if (isError) return <ErrorComponent />;

  // Table Columns for Categories
  const dataCell: DataCell[] = [
    {
      headingTitle: "Name",
      accessVar: "name",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
  ];

  return (
    <main className="flex h-max w-full max-w-full flex-col gap-4 md:flex-row">
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsDeleteDialogOpen}>
            <DeleteCategoryDialogBox
              setCategory={setCategory}
              setFormState={setFormState}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              category={category!}
              onDeleted={handleCategoryDeleted}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left side table */}
      <section className="table-container flex w-full flex-col gap-3 rounded-xl md:w-[50%]">
        <header className="flex flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
          <PageHeader title="Category Configuration" />
        </header>

        <GenericTable
          isMasterTable
          data={categories ?? []}
          dataCell={dataCell}
          isLoading={isLoading}
          onEdit={(row) => {
            setFormState("edit");
            setCategory(row);
          }}
          onDelete={(row) => {
            setCategory(row);
            setIsDeleteDialogOpen(true);
          }}
          onView={(row) => {
            setFormState("display");
            setCategory(row);
          }}
          rowKey={(row) => row.id}
          tableTitle="Category Configuration"
        />
      </section>

      {/* Right side form */}
      <section className="table-container max-h-full w-full flex-col gap-3 rounded-xl bg-white/80 p-4 shadow-sm md:w-[50%]">
        <CategoryEdit
          categoryDetails={category}
          formState={formState}
          setFormState={setFormState}
          setCategoryData={setCategory}
        />
      </section>
    </main>
  );
};

export default CategoriesPage;
