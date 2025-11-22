import axiosInstance from "../../utils/axios";
import axios from "axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";


import type { DropdownOption } from "../../components/common/DropDown";
import type { Warehouse } from "../../types/Master/Warehouse";
import  { authHandler } from "../../utils/authHandler";
import { handleApiError } from "../../utils/handleApiError";

/**
 * -------------------------------------------
 * Warehouse Service - CRUD Operations
 * -------------------------------------------
 */

/**
 * 🔍 Fetch all warehouses
 */
export const useFetchWarehouses = () => {
  const fetchAll = async (): Promise<Warehouse[]> => {
    try {
      const token = authHandler();

      const res = await axiosInstance.get(apiRoutes.warehouse, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch warehouses");
      }

      return res.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch warehouses");
      } else {
        toast.error("Something went wrong while fetching warehouses");
      }
      throw new Error("Warehouse fetch failed");
    }
  };

  return useQuery({
    queryKey: ["warehouses"],
    queryFn: fetchAll,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * 🔽 Fetch Warehouses for Dropdown
 */
export const useFetchWarehouseOptions = () => {
  const fetchOptions = async (): Promise<DropdownOption[]> => {
    const token = authHandler();
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.get(apiRoutes.warehouse, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to fetch warehouses");
    }

    return res.data.data.map((wh: Warehouse) => ({
      id: wh.id,
      label: `${wh.shortCode} - ${wh.name}`,
    }));
  };

  return useQuery({
    queryKey: ["warehouseOptions"],
    queryFn: fetchOptions,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * ➕ Create Warehouse
 */
export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  const create = async (newWarehouse: Warehouse) => {
    try {
      const token = authHandler();

      const { id,  ...payload } = newWarehouse;

      const res = await axiosInstance.post(`${apiRoutes.warehouse}/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create warehouse");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Warehouse");
    }
  };

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success("Warehouse created successfully");
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
  });
};

/**
 * ✏️ Edit Warehouse
 */
export const useEditWarehouse = () => {
  const queryClient = useQueryClient();

  const edit = async (updated: Warehouse) => {
    const token = authHandler();
    if (!token) throw new Error("Unauthorized to perform this action.");

    const { id: warehouseId, ...payload } = updated;

    const res = await axiosInstance.put(
      `${apiRoutes.warehouse}/${warehouseId}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to update warehouse");
    }

    return res.data.data;
  };

  return useMutation({
    mutationFn: edit,
    onSuccess: () => {
      toast.success("Warehouse updated successfully");
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Update failed");
      }
    },
  });
};

/**
 * ❌ Delete Warehouse
 */
export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  const remove = async (warehouse: Warehouse) => {
    const token = authHandler();
    if (!token) throw new Error("Unauthorized to perform this action.");

    const res = await axiosInstance.delete(
      `${apiRoutes.warehouse}/${warehouse.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.status !== 200) {
      throw new Error(res.data?.message || "Failed to delete warehouse");
    }

    return res.data.data;
  };

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success("Warehouse deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    },
  });
};
