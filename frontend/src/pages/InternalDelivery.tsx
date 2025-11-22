import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ErrorComponent from "../components/common/Error";
import GenericTable, { type DataCell } from "../components/common/GenericTable";
import MasterPagesSkeleton from "../components/masterPage.components/LoadingSkeleton";
import PageHeader from "../components/masterPage.components/PageHeader";
import ButtonSm from "../components/common/Buttons";
import {toast} from "react-toastify"
import { appRoutes } from "../routes/appRoutes";
import { authHandler } from "../utils/authHandler";

import { useFetchInternalTransfers, useDeleteInternalTransfer } from "../queries/internalTransfer";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const parsed = new Date(value);
  return isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
};

const InternalMovePage = () => {
  const navigate = useNavigate();
  const deleteMutation = useDeleteInternalTransfer();

  useEffect(() => {
    const token = authHandler();
    if (!token) navigate(appRoutes.signIn);
  }, [navigate]);

  const { data, isLoading, isError } = useFetchInternalTransfers();

  // 👉 Handle edit click
  const handleEdit = (row: any) => {
    navigate(`/internal-transfer/edit/${row.id}`);
  };

  // 👉 Handle delete click
  const handleDelete = (row: any) => {
    if (confirm("Are you sure you want to delete this internal transfer?")) {
      deleteMutation.mutate(row.id);
    }
  };

  // 👉 Table Column Config
  const dataCell: DataCell[] = [
    {
      headingTitle: "Reference",
      accessVar: "reference",
      sortable: true,
      searchable: true,
      className: "min-w-[140px]",
    },
    {
      headingTitle: "From Warehouse",
      accessVar: "sourceWarehouse[0].name",
      sortable: true,
      searchable: true,
      className: "min-w-[160px]",
    },
    {
      headingTitle: "From Location",
      accessVar: "sourceLocation[0].name",
      sortable: true,
      searchable: true,
      className: "min-w-[160px]",
    },
    {
      headingTitle: "To Warehouse",
      accessVar: "destinationWarehouse[0].name",
      sortable: true,
      searchable: true,
      className: "min-w-[160px]",
    },
    {
      headingTitle: "To Location",
      accessVar: "destinationLocation[0].name",
      sortable: true,
      searchable: true,
      className: "min-w-[160px]",
    },
    {
      headingTitle: "Quantity",
      accessVar: "quantity",
      sortable: true,
      className: "min-w-[120px]",
    },
    {
      headingTitle: "Transfer Date",
      accessVar: "transferDate",
      sortable: true,
      className: "min-w-[160px]",
      render: (value) => formatDate(value as string),
    },
    {
      headingTitle: "Status",
      accessVar: "status",
      sortable: true,
      searchable: true,
      className: "min-w-[140px]",
      render: (value) => (
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
            statusStyles[value as string] ??
            "border-slate-200 bg-slate-100 text-slate-600"
          }`}
        >
          {String(value).toLowerCase()}
        </span>
      ),
    },
    {
      headingTitle: "# Items",
      accessVar: (row) => row.product?.length ?? 0,
      sortable: true,
      className: "min-w-[100px] text-right",
    },
  ];

  return (
    <main className="flex h-min w-full max-w-full flex-col gap-4">
      <section className="table-container flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-sm">

        {/* ⭐ HEADER AREA WITH ACTION BUTTONS */}
        <header className="flex flex-row items-center justify-between">
          <PageHeader title="Internal Delivery / Move Management" />

          {/* Right-side buttons */}
          <div className="flex items-center gap-3">
            <ButtonSm
              text="Add New"
              state="default"
              className="text-white"
              onClick={() => navigate("/internal-transfer/create")}
            />
          </div>
        </header>

        {isLoading ? (
          <MasterPagesSkeleton />
        ) : isError ? (
          <ErrorComponent />
        ) : (
          <GenericTable
            isMasterTable
            data={data ?? []}
            dataCell={dataCell}
            rowKey={(row) => row.id}
            tableTitle="Internal Transfers"
            messageWhenNoData="No internal transfers available."
            
            // 👉 Pass Edit/Delete handlers
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </section>
    </main>
  );
};

export default InternalMovePage;
