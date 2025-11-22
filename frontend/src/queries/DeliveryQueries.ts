import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import axiosInstance from '../utils/axios'
import { authHandler } from '../utils/authHandler'
import { handleApiError } from '../utils/handleApiError'
import { apiRoutes } from '../routes/apiRoutes'

import type {
  CreateDeliveryPayload,
  DeliveryApiResponse,
  DeliveryOrder,
  DeliveryItem,
  DeliveryStatus,
} from '../types/Delivery'
import type { ProductResponse, ProductUnit } from '../types/Master/productTypes'
import {
  convertToBackendDate,
  convertToFrontendDate,
} from '../utils/commonUtils'

const statusMap: Record<string, DeliveryStatus> = {
  pending: 'scheduled',
  in_transit: 'in-transit',
  'in-transit': 'in-transit',
  delivered: 'delivered',
  cancelled: 'cancelled',
}

const defaultProduct = (productId: number, name?: string): ProductResponse => ({
  id: productId,
  name: name ?? `Product #${productId}`,
  sku: `SKU-${productId}`,
  category: [{ id: 0, name: 'N/A' }],
  cost: 0,
  unit: 'piece',
})

const normalizeStatus = (status?: string): DeliveryStatus => {
  if (!status) return 'scheduled'
  const normalized = status.toLowerCase()
  return statusMap[normalized] ?? 'scheduled'
}

const mapItems = (items: DeliveryApiResponse['items'] = []): DeliveryItem[] =>
  items.map((item, index) => {
    const fallbackId = item.productId ?? index
    return {
      id: item.id ?? fallbackId,
      product:
        item.product ??
        defaultProduct(fallbackId, item.productName ?? undefined),
      quantity: item.quantity ?? 0,
      unit: (item.unit ?? 'piece') as ProductUnit,
    }
  })

const normalizeScheduleDate = (scheduledDate?: string) => {
  if (!scheduledDate) return ''
  if (/^\d{2}-\d{2}-\d{4}$/.test(scheduledDate)) {
    return convertToFrontendDate(scheduledDate)
  }
  return scheduledDate
}

const mapDeliveryResponse = (delivery: DeliveryApiResponse): DeliveryOrder => ({
  id: delivery.id,
  reference: delivery.reference ?? `DEL-${delivery.id}`,
  status: normalizeStatus(delivery.status),
  warehouseId: delivery.warehouseId,
  locationId: delivery.locationId,
  warehouseName:
    delivery.warehouse?.[0]?.name ?? delivery.warehouseName ?? undefined,
  locationName:
    delivery.location?.[0]?.name ?? delivery.locationName ?? undefined,
  fromWarehouseId:
    delivery.warehouse?.[0]?.name ??
    delivery.warehouseName ??
    (delivery.warehouseId ? String(delivery.warehouseId) : '—'),
  fromLocationId:
    delivery.location?.[0]?.name ??
    delivery.locationName ??
    (delivery.locationId ? String(delivery.locationId) : undefined),
  deliveryAddress: delivery.deliveryAddress ?? '—',
  responsibleUserId:
    delivery.responsibleUserId === null ||
    delivery.responsibleUserId === undefined
      ? null
      : String(delivery.responsibleUserId),
  scheduleDate: normalizeScheduleDate(delivery.scheduledDate),
  customerName: delivery.customerName ?? '—',
  customerContact: delivery.customerContact,
  items: mapItems(delivery.items),
  notes: delivery.notes,
  createdAt: delivery.createdAt ?? new Date().toISOString(),
  updatedAt: delivery.updatedAt,
})

const fetchDeliveries = async (): Promise<DeliveryOrder[]> => {
  try {
    const token = authHandler()

    const res = await axiosInstance.get(apiRoutes.deliveries, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.status !== 200) {
      throw new Error(res.data?.message || 'Failed to fetch deliveries')
    }

    const payload: DeliveryApiResponse[] = res.data.data ?? []
    return payload.map(mapDeliveryResponse)
  } catch (error) {
    handleApiError(error, 'Deliveries')
    return []
  }
}

export const useFetchDeliveries = () =>
  useQuery({
    queryKey: ['deliveries'],
    queryFn: fetchDeliveries,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

export const useCreateDelivery = () => {
  const queryClient = useQueryClient()

  const create = async (payload: CreateDeliveryPayload) => {
    try {
      const token = authHandler()
      const cleanedPayload: CreateDeliveryPayload = {
        ...payload,
        scheduledDate: convertToBackendDate(payload.scheduledDate),
      }

      const res = await axiosInstance.post(
        apiRoutes.deliveries,
        cleanedPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to create delivery')
      }

      return mapDeliveryResponse(res.data.data)
    } catch (error) {
      handleApiError(error, 'Delivery')
    }
  }

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('Delivery created successfully')
      queryClient.invalidateQueries({ queryKey: ['deliveries'] })
    },
  })
}

interface UpdateDeliveryInput {
  deliveryId: number
  payload: CreateDeliveryPayload
}

export const useUpdateDelivery = () => {
  const queryClient = useQueryClient()

  const update = async ({ deliveryId, payload }: UpdateDeliveryInput) => {
    try {
      const token = authHandler()
      const cleanedPayload: CreateDeliveryPayload = {
        ...payload,
        scheduledDate: convertToBackendDate(payload.scheduledDate),
      }

      const res = await axiosInstance.patch(
        `${apiRoutes.deliveries}/${deliveryId}`,
        cleanedPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to update delivery')
      }

      return mapDeliveryResponse(res.data.data)
    } catch (error) {
      handleApiError(error, 'Delivery')
      throw error
    }
  }

  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      toast.success('Delivery updated successfully')
      queryClient.invalidateQueries({ queryKey: ['deliveries'] })
    },
  })
}
