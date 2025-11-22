import type { Product } from './Master/productTypes'
import type { Location, Warehouse } from './Master/Warehouse'

export interface Stock {
  id: number
  product: Product
  warehouse: Warehouse
  location: Location
  onHand: number
  reserved: number
  freeToUse: number
}
