import { useNavigate } from "react-router-dom";
import WarehouseEdit from "./EditWarehouse.component";
import PageHeader from "../../../components/masterPage.components/PageHeader";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import DialogBox from "../../../components/common/DialogBox";
import GenericTable, {
  type DataCell,
} from "../../../components/common/GenericTable";
import ErrorComponent from "../../../components/common/Error";
import MasterPagesSkeleton from "../../../components/masterPage.components/LoadingSkeleton";
import { useFetchWarehouses } from "../../../queries/Master/Warehouse";
import { appRoutes } from "../../../routes/appRoutes";
import type { Warehouse } from "../../../types/Master/Warehouse";
import { authHandler } from "../../../utils/authHandler";
import type { FormState } from "../../../types/appTypes";
import { DeleteWarehouseDialogBox } from "./DeleteWarehouseDialogBox";

const WarehousesPage = () => {
  const navigate = useNavigate();

  // Redirect if token missing
  useEffect(() => {
    const token = authHandler();
    if (!token) navigate(appRoutes.signIn);
  }, [navigate]);

  // Dialog + Form State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [formState, setFormState] = useState<FormState>("create");

  // Fetch warehouses
  const { data: warehouses, isLoading, isError } = useFetchWarehouses();

  const handleWarehouseDeleted = () => {
    setWarehouse(null);
    setFormState("create");
  };

  if (isLoading) return <MasterPagesSkeleton />;
  if (isError) return <ErrorComponent />;

  // Table Columns for Warehouses
  const dataCell: DataCell[] = [
    {
      headingTitle: "Short Code",
      accessVar: "shortCode",
      searchable: true,
      sortable: true,
      className: "min-w-[120px] max-w-[160px]",
    },
    {
      headingTitle: "Name",
      accessVar: "name",
      searchable: true,
      sortable: true,
      className: "min-w-[150px] max-w-[200px]",
    },
    {
      headingTitle: "City",
      accessVar: "city",
      searchable: true,
      sortable: true,
      className: "min-w-[120px] max-w-[160px]",
    },
    {
      headingTitle: "Address",
      accessVar: "address",
      searchable: true,
      sortable: true,
      className: "min-w-[200px] max-w-[300px]",
    },
  ];

  return (
    <main className="flex h-max w-full max-w-full flex-col gap-4 md:flex-row">
      <AnimatePresence>
        {isDeleteDialogOpen && (
          <DialogBox setToggleDialogueBox={setIsDeleteDialogOpen}>
            <DeleteWarehouseDialogBox
              setWarehouse={setWarehouse}
              setFormState={setFormState}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              warehouse={warehouse!}
              onDeleted={handleWarehouseDeleted}
            />
          </DialogBox>
        )}
      </AnimatePresence>

      {/* Left side table */}
      <section className="table-container flex w-full flex-col gap-3 rounded-xl md:w-[50%]">
        <header className="flex flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm">
          <PageHeader title="Warehouse Configuration" />
        </header>

        <GenericTable
          isMasterTable
          data={warehouses ?? []}
          dataCell={dataCell}
          isLoading={isLoading}
          onEdit={(row) => {
            setFormState("edit");
            setWarehouse(row);
          }}
          onDelete={(row) => {
            setWarehouse(row);
            setIsDeleteDialogOpen(true);
          }}
          onView={(row) => {
            setFormState("display");
            setWarehouse(row);
          }}
          rowKey={(row) => row.id}
          tableTitle="Warehouse Configuration"
        />
      </section>

      {/* Right side form */}
      <section className="table-container max-h-full w-full flex-col gap-3 rounded-xl bg-white/80 p-4 shadow-sm md:w-[50%]">
        <WarehouseEdit
          warehouseDetails={warehouse}
          formState={formState}
          setFormState={setFormState}
          setWarehouseData={setWarehouse}
        />
      </section>
    </main>
  );
};

export default WarehousesPage;
