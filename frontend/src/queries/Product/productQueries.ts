import axiosInstance from '../../utils/axios'
import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { apiRoutes } from '../../routes/apiRoutes'
import { authHandler } from '../../utils/authHandler'
import { handleApiError } from '../../utils/handleApiError'

import type { Product } from '../../types/Product/productTypes'

/* -------------------------------
   🔍 Fetch All Products
-------------------------------- */
export const useFetchProducts = () => {
  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const token = authHandler()
      const res = await axiosInstance.get(apiRoutes.products, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to fetch products')
      }

      return res.data.data
    } catch (error) {
      handleApiError(error, 'Product')
      throw error
    }
  }

  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

/* -------------------------------
   ➕ Create Product
-------------------------------- */
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  const createProduct = async (newProduct: Product) => {
    try {
      const token = authHandler()
      newProduct.companyId = 3

      const res = await axiosInstance.post(apiRoutes.products, newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to create product')
      }

      return res.data.data
    } catch (error) {
      handleApiError(error, 'Product')
      throw error
    }
  }

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success('Product created successfully')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

/* -------------------------------
   ✏️ Edit Product
-------------------------------- */
export const useEditProduct = () => {
  const queryClient = useQueryClient()

  const editProduct = async (updatedProduct: Product) => {
    const token = authHandler()
    const { id, ...payload } = updatedProduct
    payload.companyId = 3

    const res = await axiosInstance.put(
      `${apiRoutes.products}/${id}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (res.status !== 200) {
      throw new Error(res.data?.message || 'Failed to update product')
    }

    return res.data.data
  }

  return useMutation({
    mutationFn: editProduct,
    onSuccess: () => {
      toast.success('Product updated successfully')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Update failed')
      }
    },
  })
}

/* -------------------------------
   ❌ Delete Product
-------------------------------- */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  const deleteProduct = async (product: Product) => {
    const token = authHandler()

    const res = await axiosInstance.delete(
      `${apiRoutes.products}/${product.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    if (res.status !== 200) {
      throw new Error(res.data?.message || 'Failed to delete product')
    }

    return res.data.data
  }

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success('Product deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Delete failed')
      }
    },
  })
}
