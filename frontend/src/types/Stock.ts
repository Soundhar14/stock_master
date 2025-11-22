import type { ProductResponse } from './Master/productTypes'
import type { Warehouse } from './Master/Warehouse'
import type { Location } from './Master/Location'

export interface Stock {
  id: number
  product?: ProductResponse | null
  productId?: number | null
  warehouse?: Warehouse | null
  warehouseId?: number | null
  location?: Location | null
  locationId?: number | null
  onHand: number
  reserved: number
  freeToUse: number
}
