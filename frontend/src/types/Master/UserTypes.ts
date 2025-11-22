export type UserRole = 'admin' | 'inventory_manager' | 'warehouse_staff'

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  warehouseId?: number | null
}

export type CreateUserPayload = Omit<User, 'id'> & {
  password: string
}

export type UpdateUserPayload = User & {
  password?: string
}
