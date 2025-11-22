import axiosInstance from "../utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../routes/apiRoutes";

import { authHandler } from "../utils/authHandler";
import { handleApiError } from "../utils/handleApiError";

import type {
  InternalTransferRequest,
  InternalTransferData,
  TransferProduct,
  TransferWarehouse,
  TransferLocation,
} from "../types/InternalDelivery";


export const useFetchInternalTransfers = () => {
  const fetchAll = async (): Promise<InternalTransferData[]> => {
    try {
      const token = authHandler();

      const res = await axiosInstance.get(apiRoutes.internalTransfers, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error("Failed to fetch internal transfers");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Internal Transfer");
    }
  };

  return useQuery({
    queryKey: ["internalTransfers"],
    queryFn: fetchAll,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};




export const useCreateInternalTransfer = () => {
  const queryClient = useQueryClient();

  const create = async (payload: InternalTransferRequest) => {
    try {
      const token = authHandler();

      const res = await axiosInstance.post(apiRoutes.internalTransfers, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error("Failed to create internal transfer");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Internal Transfer");
    }
  };

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success("Internal transfer created successfully");
      queryClient.invalidateQueries({ queryKey: ["internalTransfers"] });
    },
  });
};


export const useEditInternalTransfer = () => {
  const queryClient = useQueryClient();

  const edit = async (update: Partial<InternalTransferRequest> & { id: number }) => {
    try {
      const token = authHandler();

      const res = await axiosInstance.patch(
        `${apiRoutes.internalTransfers}/${update.id}`,
        update,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Internal Transfer");
    }
  };

  return useMutation({
    mutationFn: edit,
    onSuccess: () => {
      toast.success("Internal transfer updated successfully");
      queryClient.invalidateQueries({ queryKey: ["internalTransfers"] });
    },
  });
};

export const useFetchInternalTransferById = (id: number | string, enabled = true) => {
  const fetchOne = async (): Promise<InternalTransferData> => {
    try {
      const token = authHandler();

      const res = await axiosInstance.get(`${apiRoutes.internalTransfers}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error("Failed to fetch internal transfer details");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Internal Transfer");
    }
  };

  return useQuery({
    queryKey: ["internalTransfer", id],
    queryFn: fetchOne,
    enabled: Boolean(id) && enabled,
    retry: 1,
  });
};


export const useDeleteInternalTransfer = () => {
  const queryClient = useQueryClient();

  const remove = async (id: number) => {
    try {
      const token = authHandler();

      const res = await axiosInstance.delete(
        `${apiRoutes.internalTransfers}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) {
        throw new Error("Failed to delete internal transfer");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Internal Transfer");
    }
  };

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success("Internal transfer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["internalTransfers"] });
    },
  });
};
