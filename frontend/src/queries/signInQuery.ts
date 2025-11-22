import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import axiosInstance from '../utils/axios'
import { toast } from 'react-toastify'
import { SignInSchema } from '../utils/validationSchema'
import { ZodError } from 'zod'
import { apiRoutes } from '../routes/apiRoutes'
import Cookies from 'js-cookie'
import type {
  signInRequestType,
  SignInResponseType,
} from '@/types/authApiTypes'

const signInRequest = async (
  data: signInRequestType
): Promise<SignInResponseType> => {
  try {
    const parsed = SignInSchema.parse(data)
    const response = await axiosInstance.post(apiRoutes.signin, parsed, {
      timeout: 30000,
    })

    if (response.status === 200 || response.status === 201) {
      // ✅ Store token in a secure cookie
      Cookies.set('token', response.data.token, {
        expires: 1, // 1 day
        secure: true, // use false for localhost
        sameSite: 'strict', // protect from CSRF
        path: '/', // available throughout the app
      })

      toast.success('Sign-in successful!')
      return response.data
    } else {
      throw new Error(response.data?.message || 'Login failed')
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const firstError = error.errors?.[0]?.message ?? 'Invalid input'
      toast.error(firstError)
    } else if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || 'Invalid credentials')
    } else {
      toast.error('Something went wrong during sign-in')
    }
    throw error
  }
}

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: signInRequest,
  })
}
