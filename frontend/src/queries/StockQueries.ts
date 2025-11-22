import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import axiosInstance from '../utils/axios'
import { authHandler } from '../utils/authHandler'
import { handleApiError } from '../utils/handleApiError'
import { apiRoutes } from '../routes/apiRoutes'

import type { Stock } from '../types/Stock'
import type { Product } from '../types/Master/productTypes'
import type { Warehouse } from '../types/Master/Warehouse'

const shouldUseDummyStock =
  (import.meta.env.VITE_USE_DUMMY_DATA ?? 'true') !== 'false'

const dummyProducts: Product[] = [
  {
    id: 1,
    name: 'Steel Rod',
    sku: 'ST-ROD-16',
    category: { id: 1, name: 'Metals' },
    cost: 200,
    unit: 'kg',
  },
  {
    id: 2,
    name: 'Copper Wire',
    sku: 'CP-WR-05',
    category: { id: 2, name: 'Wires' },
    cost: 120,
    unit: 'kg',
  },
]

const dummyWarehouses: Warehouse[] = [
  {
    id: 1,
    shortCode: 'WH-001',
    name: 'Central Distribution',
    address: '42 Market Street',
    city: 'Chennai',
    isActive: true,
  },
  {
    id: 2,
    shortCode: 'WH-002',
    name: 'North Hub',
    address: '18 Industrial Estate Road',
    city: 'Bangalore',
    isActive: true,
  },
]

const dummyStock: Stock[] = [
  {
    id: 101,
    location: { id: 11, name: 'Aisle 3, Shelf B' },
    onHand: 120,
    reserved: 20,
    freeToUse: 100,
    product: dummyProducts[0],
    warehouse: dummyWarehouses[0],
  },
  {
    id: 102,
    location: { id: 12, name: 'Aisle 3, Shelf B' },
    onHand: 80,
    reserved: 15,
    freeToUse: 65,
    product: dummyProducts[1],
    warehouse: dummyWarehouses[1],
  },
]

const fetchStock = async (): Promise<Stock[]> => {
  try {
    if (shouldUseDummyStock) {
      return dummyStock
    }

    const token = authHandler()

    const res = await axiosInstance.get(apiRoutes.stock, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.status !== 200) {
      throw new Error(res.data?.message || 'Failed to fetch stock records')
    }

    return res.data.data
  } catch (error) {
    handleApiError(error, 'Stock')
    return []
  }
}

export const useFetchStock = () => {
  return useQuery({
    queryKey: ['stock'],
    queryFn: fetchStock,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

type StockUpdateInput = Pick<Stock, 'id' | 'onHand' | 'reserved'> & {
  freeToUse?: number
}

const updateStockRecord = async (payload: StockUpdateInput): Promise<Stock> => {
  const formattedPayload = {
    onHand: payload.onHand,
    reserved: payload.reserved,
    freeToUse:
      payload.freeToUse !== undefined
        ? payload.freeToUse
        : Math.max(payload.onHand - payload.reserved, 0),
  }

  if (shouldUseDummyStock) {
    const stockIndex = dummyStock.findIndex(
      (record) => record.id === payload.id
    )
    if (stockIndex === -1) {
      throw new Error('Stock record not found')
    }

    dummyStock[stockIndex] = {
      ...dummyStock[stockIndex],
      ...formattedPayload,
    }

    return dummyStock[stockIndex]
  }

  const token = authHandler()

  const res = await axiosInstance.put(
    `${apiRoutes.stock}/${payload.id}`,
    formattedPayload,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (res.status !== 200) {
    throw new Error(res.data?.message || 'Failed to update stock record')
  }

  return res.data.data
}

export const useUpdateStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStockRecord,
    onSuccess: (updatedRecord) => {
      toast.success('Stock updated successfully')
      queryClient.setQueryData<Stock[] | undefined>(['stock'], (existing) => {
        if (!existing) return existing
        return existing.map((record) =>
          record.id === updatedRecord.id
            ? { ...record, ...updatedRecord }
            : record
        )
      })
    },
    onError: (error) => {
      handleApiError(error, 'Stock')
    },
  })
}
