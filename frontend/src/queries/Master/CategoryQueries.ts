import axiosInstance from "../../utils/axios";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { apiRoutes } from "../../routes/apiRoutes";

import type { DropdownOption } from "../../components/common/DropDown";
import type { category } from "../../types/Master/CategoryTypes";
import { authHandler } from "../../utils/authHandler";
import { handleApiError } from "../../utils/handleApiError";

/**
 * -------------------------------------------
 * Category Service - CRUD Operations
 * -------------------------------------------
 */

/**
 * 🔍 Fetch all categories
 */
export const useFetchCategories = () => {
  const fetchAll = async (): Promise<category[]> => {
    try {
      const token = authHandler();

      const res = await axiosInstance.get(apiRoutes.category, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to fetch categories");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Category");
    }
  };

  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchAll,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * 🔽 Fetch Categories for Dropdown
 */
export const useFetchCategoryOptions = () => {
  const fetchOptions = async (): Promise<DropdownOption[]> => {
    const token = authHandler();
    if (!token) throw new Error("Unauthorized to perform this action.");

    try {
      const res = await axiosInstance.get(apiRoutes.category, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data.data.map((cat: category) => ({
        id: cat.id,
        label: cat.name,
      }));
    } catch (error) {
      handleApiError(error, "Category");
    }
  };

  return useQuery({
    queryKey: ["categoryOptions"],
    queryFn: fetchOptions,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

/**
 * ➕ Create Category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const create = async (newCategory: category) => {
    try {
      const token = authHandler();

      const { id, ...payload } = newCategory;

      const res = await axiosInstance.post(apiRoutes.category, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || "Failed to create category");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Category");
    }
  };

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success("Category created successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

/**
 * ✏️ Edit Category
 */
export const useEditCategory = () => {
  const queryClient = useQueryClient();

  const edit = async (updated: category) => {
    const token = authHandler();
    if (!token) throw new Error("Unauthorized to perform this action.");

    try {
      const res = await axiosInstance.put(
        `${apiRoutes.category}/${updated.id}`,
        { name: updated.name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Category");
    }
  };

  return useMutation({
    mutationFn: edit,
    onSuccess: () => {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

/**
 * ❌ Delete Category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const remove = async (category: category) => {
    const token = authHandler();
    if (!token) throw new Error("Unauthorized to perform this action.");

    try {
      const res = await axiosInstance.delete(
        `${apiRoutes.category}/${category.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status !== 200) {
        throw new Error(res.data?.message || "Failed to delete category");
      }

      return res.data.data;
    } catch (error) {
      handleApiError(error, "Category");
    }
  };

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
