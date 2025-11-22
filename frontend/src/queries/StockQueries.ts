import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import axiosInstance from '../utils/axios'
import { authHandler } from '../utils/authHandler'
import { handleApiError } from '../utils/handleApiError'
import { apiRoutes } from '../routes/apiRoutes'

import type { Stock } from '../types/Stock'
import type { ProductResponse } from '../types/Master/productTypes'
import type { Warehouse } from '../types/Master/Warehouse'
import type { Location } from '../types/Master/Location'

type MaybeArray<T> = T | T[] | null | undefined

const normalizeEntity = <T>(value: MaybeArray<T>): T | null => {
  if (!value) return null
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

type RawStockRecord = {
  id: number
  productId?: number | null
  warehouseId?: number | null
  locationId?: number | null
  product?: MaybeArray<ProductResponse>
  warehouse?: MaybeArray<Warehouse>
  location?: MaybeArray<Location>
  onHand?: number
  reserved?: number
  freeToUse?: number
}

const adaptStockRecord = (record: RawStockRecord): Stock => {
  const product = normalizeEntity(record.product)
  const warehouse = normalizeEntity(record.warehouse)
  const location = normalizeEntity(record.location)

  return {
    id: record.id,
    product,
    productId: product?.id ?? record.productId ?? null,
    warehouse,
    warehouseId: warehouse?.id ?? record.warehouseId ?? null,
    location,
    locationId: location?.id ?? record.locationId ?? null,
    onHand: record.onHand ?? 0,
    reserved: record.reserved ?? 0,
    freeToUse:
      record.freeToUse ??
      Math.max((record.onHand ?? 0) - (record.reserved ?? 0), 0),
  }
}

const adaptStockResponse = (records: RawStockRecord[] = []): Stock[] =>
  records.map(adaptStockRecord)

const fetchStock = async (): Promise<Stock[]> => {
  try {
    const token = authHandler()

    const res = await axiosInstance.get(apiRoutes.stock, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.status !== 200) {
      throw new Error(res.data?.message || 'Failed to fetch stock records')
    }

    return adaptStockResponse(res.data?.data ?? [])
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

type StockUpdateInput = {
  id: number
  productId: number
  warehouseId: number
  locationId: number | null
  onHand: number
  reserved: number
  freeToUse?: number
}

const updateStockRecord = async (payload: StockUpdateInput): Promise<Stock> => {
  const formattedPayload = {
    productId: payload.productId,
    warehouseId: payload.warehouseId,
    locationId: payload.locationId,
    onHand: payload.onHand,
    reserved: payload.reserved,
    freeToUse:
      payload.freeToUse !== undefined
        ? payload.freeToUse
        : Math.max(payload.onHand - payload.reserved, 0),
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

  const data = res.data?.data
  const updated = Array.isArray(data) ? data[0] : data

  return adaptStockRecord(updated)
}

type StockCreateInput = {
  productId: number
  warehouseId: number
  locationId: number | null
  onHand: number
  reserved: number
  freeToUse?: number
}

const createStockRecord = async (payload: StockCreateInput): Promise<Stock> => {
  const formattedPayload = {
    productId: payload.productId,
    warehouseId: payload.warehouseId,
    locationId: payload.locationId,
    onHand: payload.onHand,
    reserved: payload.reserved,
    freeToUse:
      payload.freeToUse !== undefined
        ? payload.freeToUse
        : Math.max(payload.onHand - payload.reserved, 0),
  }

  const token = authHandler()

  const res = await axiosInstance.post(apiRoutes.stock, formattedPayload, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status !== 201 && res.status !== 200) {
    throw new Error(res.data?.message || 'Failed to create stock record')
  }

  const data = res.data?.data
  const created = Array.isArray(data) ? data[0] : data

  return adaptStockRecord(created)
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

const deleteStockRecord = async (stockId: number): Promise<number> => {
  const token = authHandler()

  const res = await axiosInstance.delete(`${apiRoutes.stock}/${stockId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (res.status !== 200) {
    throw new Error(res.data?.message || 'Failed to delete stock record')
  }

  return stockId
}

export const useCreateStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStockRecord,
    onSuccess: (newRecord) => {
      toast.success('Stock created successfully')
      queryClient.setQueryData<Stock[] | undefined>(['stock'], (existing) => {
        if (!existing) return [newRecord]
        return [newRecord, ...existing]
      })
    },
    onError: (error) => {
      handleApiError(error, 'Stock')
    },
  })
}

export const useDeleteStock = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteStockRecord,
    onSuccess: (deletedId) => {
      toast.success('Stock deleted successfully')
      queryClient.setQueryData<Stock[] | undefined>(['stock'], (existing) => {
        if (!existing) return existing
        return existing.filter((record) => record.id !== deletedId)
      })
    },
    onError: (error) => {
      handleApiError(error, 'Stock')
    },
  })
}
