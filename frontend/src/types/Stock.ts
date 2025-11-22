import type { Product } from './Product'
import type { Warehouse } from './Master/Warehouse'
import type { Location } from './Master/Location'

export interface Stock {
  id: number
  productId: number
  warehouseId: number
  locationId: number
  onHand: number
  reserved: number
  freeToUse: number
  product?: Product
  warehouse?: Warehouse
  location?: Location
}
