export interface Warehouse {
  id: number
  shortCode: string
  name: string
  address: string
  city: string
  locations?: Location[]
  isActive: boolean
}
export interface Location {
  id: number
  name: string
}
