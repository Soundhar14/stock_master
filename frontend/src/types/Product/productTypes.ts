export type ProductUnit =
  | 'kg'
  | 'g'
  | 'litre'
  | 'ml'
  | 'piece'
  | 'box'
  | 'meter'
  | 'bundle'
  | 'packet'
  | 'roll'

export interface ProductCategory {
  id: number
  name: string
}

export interface Product {
  id: number
  name: string
  sku: string
  category: ProductCategory
  cost: number
  unit: ProductUnit
  companyId?: number
}
