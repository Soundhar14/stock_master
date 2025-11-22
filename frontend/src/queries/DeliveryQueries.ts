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
import { convertToBackendDate } from '../utils/commonUtils'

const statusMap: Record<string, DeliveryStatus> = {
  pending: 'scheduled',
  in_transit: 'in-transit',
  'in-transit': 'in-transit',
  delivered: 'delivered',
  cancelled: 'cancelled',
}

const defaultProduct = (productId: number): ProductResponse => ({
  id: productId,
  name: `Product #${productId}`,
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
  items.map((item, index) => ({
    id: item.productId ?? index,
    product: defaultProduct(item.productId ?? index),
    quantity: item.quantity ?? 0,
    unit: (item.unit ?? 'piece') as ProductUnit,
  }))

const mapDeliveryResponse = (delivery: DeliveryApiResponse): DeliveryOrder => ({
  id: delivery.id,
  reference: delivery.reference ?? `DEL-${delivery.id}`,
  status: normalizeStatus(delivery.status),
  fromWarehouseId: delivery.warehouseId ? String(delivery.warehouseId) : '—',
  fromLocationId: delivery.locationId ? String(delivery.locationId) : undefined,
  deliveryAddress: delivery.deliveryAddress ?? '—',
  responsibleUserId:
    delivery.responsibleUserId === null ||
    delivery.responsibleUserId === undefined
      ? null
      : String(delivery.responsibleUserId),
  scheduleDate: convertToBackendDate(delivery.scheduledDate),
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
