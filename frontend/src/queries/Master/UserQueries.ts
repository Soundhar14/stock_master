import axiosInstance from '../../utils/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { apiRoutes } from '../../routes/apiRoutes'
import { authHandler } from '../../utils/authHandler'
import { handleApiError } from '../../utils/handleApiError'
import type {
  CreateUserPayload,
  UpdateUserPayload,
  User,
} from '../../types/Master/UserTypes'

const USERS_QUERY_KEY = ['users'] as const

const requireToken = () => {
  const token = authHandler()
  if (!token) throw new Error('Unauthorized to perform this action.')
  return token
}

const MOCK_USERS: User[] = [
  {
    id: 'USR-101',
    name: 'Avery Patel',
    email: 'avery.patel@example.com',
    phone: '+1 555-214-9001',
    role: 'admin',
    warehouseId: null,
  },
  {
    id: 'USR-102',
    name: 'Jordan Smith',
    email: 'jordan.smith@example.com',
    phone: '+1 555-214-9002',
    role: 'inventory_manager',
    warehouseId: null,
  },
  {
    id: 'USR-103',
    name: 'Meera Sundaram',
    email: 'meera.sundaram@example.com',
    phone: '+1 555-214-9003',
    role: 'warehouse_staff',
    warehouseId: 2,
  },
]

export const useFetchUsers = () => {
  const fetchAll = async (): Promise<User[]> => {
    // Temporary mock data until the backend endpoint is ready.
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_USERS), 200)
    })
  }

  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: fetchAll,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })
}

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  const create = async (payload: CreateUserPayload) => {
    try {
      const token = requireToken()
      const res = await axiosInstance.post(
        apiRoutes.users,
        {
          ...payload,
          warehouseId:
            payload.role === 'warehouse_staff'
              ? (payload.warehouseId ?? null)
              : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status !== 201 && res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to create user')
      }

      return res.data.data as User
    } catch (error) {
      handleApiError(error, 'User')
    }
  }

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      toast.success('User created successfully')
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  const update = async (user: UpdateUserPayload) => {
    try {
      const token = requireToken()
      const payload = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        warehouseId:
          user.role === 'warehouse_staff' ? (user.warehouseId ?? null) : null,
        ...(user.password ? { password: user.password } : {}),
      }
      const res = await axiosInstance.patch(
        `${apiRoutes.users}/${user.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to update user')
      }

      return res.data.data as User
    } catch (error) {
      handleApiError(error, 'User')
    }
  }

  return useMutation({
    mutationFn: update,
    onSuccess: () => {
      toast.success('User updated successfully')
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  const remove = async (user: User) => {
    try {
      const token = requireToken()
      const res = await axiosInstance.delete(`${apiRoutes.users}/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.status !== 200) {
        throw new Error(res.data?.message || 'Failed to delete user')
      }

      return res.data.data
    } catch (error) {
      handleApiError(error, 'User')
    }
  }

  return useMutation({
    mutationFn: remove,
    onSuccess: () => {
      toast.success('User deleted successfully')
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
  })
}
