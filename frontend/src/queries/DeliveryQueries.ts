import { useQuery } from '@tanstack/react-query'

import axiosInstance from '../utils/axios'
import { authHandler } from '../utils/authHandler'
import { handleApiError } from '../utils/handleApiError'
import { apiRoutes } from '../routes/apiRoutes'

import type { DeliveryOrder, DeliveryStatus } from '../types/Delivery'
import type { Product } from '../types/Master/productTypes'

const shouldUseDummyDeliveries =
  (import.meta.env.VITE_USE_DUMMY_DATA ?? 'true') !== 'false'

const dummyProducts: Product[] = [
  {
    id: 1,
    name: 'Steel Rod 12mm',
    sku: 'ST-ROD-12',
    category: { id: 1, name: 'Metals' },
    cost: 220,
    unit: 'kg',
  },
  {
    id: 2,
    name: 'Galvanized Sheet',
    sku: 'GV-SHEET-01',
    category: { id: 2, name: 'Sheets' },
    cost: 150,
    unit: 'piece',
  },
]

const deliveryStatusLabels: DeliveryStatus[] = [
  'scheduled',
  'in-transit',
  'delivered',
]

const dummyDeliveries: DeliveryOrder[] = [
  {
    id: 5001,
    reference: 'DO-5001',
    status: deliveryStatusLabels[0],
    fromWarehouseId: 'WH-001',
    fromLocationId: 'RACK-A1',
    deliveryAddress: 'Azure Interiors Pvt Ltd, Velachery, Chennai',
    responsibleUserId: 'USR-104',
    scheduleDate: '2025-11-23',
    customerName: 'Azure Interiors',
    items: [
      { id: 1, product: dummyProducts[0], quantity: 40, unit: 'kg' },
      { id: 2, product: dummyProducts[1], quantity: 12, unit: 'piece' },
    ],
    notes: 'Handle with care. Deliver before noon.',
    createdAt: '2025-11-20T09:00:00Z',
    updatedAt: '2025-11-21T15:00:00Z',
  },
  {
    id: 5002,
    reference: 'DO-5002',
    status: deliveryStatusLabels[1],
    fromWarehouseId: 'WH-002',
    fromLocationId: 'ZONE-02',
    deliveryAddress: 'Sunrise Builders, Whitefield, Bangalore',
    responsibleUserId: 'USR-204',
    scheduleDate: '2025-11-24',
    customerName: 'Sunrise Builders',
    items: [{ id: 3, product: dummyProducts[0], quantity: 25, unit: 'kg' }],
    createdAt: '2025-11-20T11:30:00Z',
    updatedAt: '2025-11-21T10:15:00Z',
  },
  {
    id: 5003,
    reference: 'DO-5003',
    status: deliveryStatusLabels[2],
    fromWarehouseId: 'WH-001',
    deliveryAddress: 'Solid Core Industries, Coimbatore',
    responsibleUserId: 'USR-102',
    scheduleDate: '2025-11-19',
    customerName: 'Solid Core Industries',
    items: [{ id: 4, product: dummyProducts[1], quantity: 60, unit: 'piece' }],
    notes: 'Partial delivery accepted',
    createdAt: '2025-11-15T08:45:00Z',
    updatedAt: '2025-11-19T17:50:00Z',
  },
]

const fetchDeliveries = async (): Promise<DeliveryOrder[]> => {
  try {
    if (shouldUseDummyDeliveries) {
      return dummyDeliveries
    }

    const token = authHandler()

    const res = await axiosInstance.get(apiRoutes.deliveries, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.status !== 200) {
      throw new Error(res.data?.message || 'Failed to fetch deliveries')
    }

    return res.data.data
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
