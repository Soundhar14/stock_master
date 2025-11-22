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

export interface ProductRequest {
  id?: number;
  name: string;
  sku: string;
  description: string;
  categoryId: number;
  cost: number;
  unit: string
}



export interface ProductResponse {
  id: number;
  name: string;
  sku: string;
  category: ProductCategory[]; // API returns category array
  cost: number;
  unit: string;
}


