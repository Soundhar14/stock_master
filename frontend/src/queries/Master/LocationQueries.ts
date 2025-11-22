// Location Service - based on Warehouse service structure

import axiosInstance from "../../utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";
import type { DropdownOption } from "../../components/common/DropDown";
import type { Location } from "../../types/Master/Location";
import { authHandler } from "../../utils/authHandler";
import { handleApiError } from "../../utils/handleApiError";

/**
 * -------------------------------------------
 * Location Service - CRUD Operations
 * -------------------------------------------
 */

// Fetch all locations
export const useFetchLocations = () => {
  const fetchAll = async (): Promise<Location[]> => {
    try {
      const token = authHandler();
      const res = await axiosInstance.get(apiRoutes.location, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch locations");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Location");
    }
  };

  return useQuery({
    queryKey: ["locations"],
    queryFn: fetchAll,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

// Fetch dropdown options
export const useFetchLocationOptions = () => {
  const fetchOptions = async (): Promise<DropdownOption[]> => {
    const token = authHandler();
    if (!token) throw new Error("Unauthorized to perform this action.");

    try {
      const res = await axiosInstance.get(apiRoutes.location, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data.map((loc: Location) => ({
        id: loc.id,
        label: loc.name,
      }));
    } catch (error) {
      handleApiError(error, "Location");
    }
  };

  return useQuery({
    queryKey: ["locationOptions"],
    queryFn: fetchOptions,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

// Create Location
export const useCreateLocation = () => {
  const queryClient = useQueryClient();

  const create = async (newLocation: Location) => {
    try {
      const token = authHandler();
      const { id, ...payload } = newLocation;

      const res = await axiosInstance.post(`${apiRoutes.location}/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create location");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Location");
    }
  };

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success("Location created successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

// Edit Location
export const useEditLocation = () => {
  const queryClient = useQueryClient();

  const edit = async (updated: Location) => {
    const token = authHandler();
    if (!token) throw new Error("Unauthorized to perform this action.");

    try {
      const { id: locationId, ...payload } = updated;

      const res = await axiosInstance.put(
        `${apiRoutes.location}/${locationId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Location");
    }
  };

  return useMutation({
    mutationFn: edit,
    onSuccess: () => {
      toast.success("Location updated successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

// Delete Location
export const useDeleteLocation = () => {
  const queryClient = useQueryClient();

  const remove = async (location: Location) => {
    const token = authHandler();
    if (!token) throw new Error("Unauthorized to perform this action.");

    try {
      const res = await axiosInstance.delete(
        `${apiRoutes.location}/${location.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to delete location");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Location");
    }
  };

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success("Location deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};
