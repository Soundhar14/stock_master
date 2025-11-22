import axiosInstance from '../../utils/axios'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { apiRoutes } from '../../routes/apiRoutes'

import type { DropdownOption } from '../../components/common/DropDown'
import type { Warehouse } from '../../types/Master/Warehouse'
import { authHandler } from '../../utils/authHandler'
import { handleApiError } from '../../utils/handleApiError'

const formatLocationsForCreate = (
  locations: Warehouse['locations']
): string[] => {
  return (locations ?? [])
    .map((location) => location.name?.trim() ?? '')
    .filter((name) => Boolean(name))
}

type UpdateLocationPayload = {
  id?: number
  name: string
}

//  to send only strings when creating and id+string when updating
const formatLocationsForUpdate = (
  locations: Warehouse['locations']
): UpdateLocationPayload[] => {
  return (locations ?? [])
    .map((location) => {
      const name = location.name?.trim()
      if (!name) return null

      if (location.id && location.id > 0) {
        return { id: location.id, name }
      }

      return { name }
    })
    .filter((location): location is UpdateLocationPayload => Boolean(location))
}

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
      const token = authHandler()

      const res = await axiosInstance.get(apiRoutes.warehouse, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to fetch warehouses')
      }

      return res.data.data
    } catch (error) {
      handleApiError(error, 'Warehouse')
    }
  }

  return useQuery({
    queryKey: ['warehouses'],
    queryFn: fetchAll,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

/**
 * 🔽 Fetch Warehouses for Dropdown
 */
export const useFetchWarehouseOptions = () => {
  const fetchOptions = async (): Promise<DropdownOption[]> => {
    const token = authHandler()
    if (!token) throw new Error('Unauthorized to perform this action.')
    try {
      const res = await axiosInstance.get(apiRoutes.warehouse, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data.data.map((wh: Warehouse) => ({
        id: wh.id,
        label: `${wh.shortCode} - ${wh.name}`,
      }))
    } catch (error) {
      handleApiError(error, 'Warehouse')
    }
  }

  return useQuery({
    queryKey: ['warehouseOptions'],
    queryFn: fetchOptions,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

/**
 * ➕ Create Warehouse
 */
export const useCreateWarehouse = () => {
  const queryClient = useQueryClient()

  const create = async (newWarehouse: Warehouse) => {
    try {
      const token = authHandler()

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = newWarehouse

      const payload = {
        ...rest,
        locations: formatLocationsForCreate(newWarehouse.locations),
      }

      const res = await axiosInstance.post(`${apiRoutes.warehouse}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to create warehouse')
      }

      return res.data.data
    } catch (error) {
      handleApiError(error, 'Warehouse')
    }
  }

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Warehouse created successfully')
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
    },
  })
}

/**
 * ✏️ Edit Warehouse
 */
export const useEditWarehouse = () => {
  const queryClient = useQueryClient()

  const edit = async (updated: Warehouse) => {
    const token = authHandler()
    if (!token) throw new Error('Unauthorized to perform this action.')

    try {
      const { id: warehouseId, ...rest } = updated

      const payload = {
        ...rest,
        locations: formatLocationsForUpdate(updated.locations),
      }

      const res = await axiosInstance.patch(
        `${apiRoutes.warehouse}/${warehouseId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      return res.data.data
    } catch (error) {
      handleApiError(error, 'Warehouse')
    }
  }

  return useMutation({
    mutationFn: edit,
    onSuccess: () => {
      toast.success('Warehouse updated successfully')
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
    },
  })
}

/**
 * ❌ Delete Warehouse
 */
export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient()

  const remove = async (warehouse: Warehouse) => {
    const token = authHandler()
    if (!token) throw new Error('Unauthorized to perform this action.')

    try {
      const res = await axiosInstance.delete(
        `${apiRoutes.warehouse}/${warehouse.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to delete warehouse')
      }

      return res.data.data
    } catch (error) {
      handleApiError(error, 'Warehouse')
    }
  }

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('Warehouse deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['warehouses'] })
    },
  })
}
