import type { ProductResponse, ProductUnit } from './Master/productTypes'

export type DeliveryStatus =
  | 'scheduled'
  | 'in-transit'
  | 'delivered'
  | 'cancelled'

export interface DeliveryItem {
  id: number
  product: ProductResponse
  quantity: number
  unit: ProductUnit
  notes?: string
}

export interface DeliveryOrder {
  id: number
  reference: string
  status: DeliveryStatus
  fromWarehouseId: string
  fromLocationId?: string
  warehouseId?: number
  locationId?: number
  warehouseName?: string
  locationName?: string
  deliveryAddress: string
  responsibleUserId: string | null
  scheduleDate?: string
  customerName: string
  customerContact?: string
  items: DeliveryItem[]
  notes?: string
  createdAt: string
  updatedAt?: string
}

export type DeliveryApiStatus =
  | 'PENDING'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'CANCELLED'

export interface DeliveryItemPayload {
  productId: number
  quantity: number
  unit?: ProductUnit
}

export interface DeliveryRelationInfo {
  id: number
  name?: string
}

export interface DeliveryApiItem extends DeliveryItemPayload {
  id?: number
  productName?: string
  product?: ProductResponse
}

export interface CreateDeliveryPayload {
  reference?: string
  status?: DeliveryApiStatus
  warehouseId: number
  locationId?: number
  deliveryAddress: string
  responsibleUserId?: number | string | null
  scheduledDate: string
  customerName: string
  customerContact?: string
  notes?: string
  items: DeliveryItemPayload[]
}

export interface DeliveryApiResponse
  extends Omit<CreateDeliveryPayload, 'items'> {
  id: number
  reference: string
  status: DeliveryApiStatus
  createdAt: string
  updatedAt?: string
  items: DeliveryApiItem[]
  warehouse?: DeliveryRelationInfo[]
  warehouseName?: string
  location?: DeliveryRelationInfo[]
  locationName?: string
}
