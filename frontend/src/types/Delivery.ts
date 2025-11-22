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
  deliveryAddress: string
  responsibleUserId: string
  scheduleDate?: string
  customerName: string
  items: DeliveryItem[]
  notes?: string
  createdAt: string
  updatedAt?: string
}
