export interface InternalMoveItem {
  productId: string
  quantity: number
}

export type InternalMoveStatus = "ready" | "pending" | "processed" | "cancelled"

export interface InternalMove {
  id: string
  reference: string
  fromWarehouseId: string
  fromLocationId: string
  toWarehouseId: string
  toLocationId: string
  scheduleDate: string
  status: InternalMoveStatus
  items: InternalMoveItem[]
  createdAt: string
}
