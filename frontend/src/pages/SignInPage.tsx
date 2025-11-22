// File: src/pages/AuthPage.tsx

import { useEffect, useState } from 'react'
import Input from '../components/common/Input'
import { useSignInMutation } from '../queries/signInQuery'
import { useLocation, useNavigate } from 'react-router-dom'
import ButtonSm from '../components/common/Buttons'
import Spinner from '../components/common/Spinner'
import { toast } from 'react-toastify'
import { appRoutes } from '../routes/appRoutes'
import { ForgotPasswordPopup } from './ForgotPasswordPopup'

export const SignInPage = () => {
  const location = useLocation()  
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false)
  const [email, setemail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const { mutate, isPending, isSuccess } = useSignInMutation()

  useEffect(() => {
    if (isSuccess) {
      const params = new URLSearchParams(location.search)
      const redirectTo = params.get('redirect')
      navigate(redirectTo || appRoutes.dashboard, { replace: true })
    }
  }, [isSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      return toast.error('Username and password are required')
    }

    mutate({ email, password })
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm flex flex-col gap-4">
          <div className="mb-2 text-center lg:text-left">
            <img
              src="./icons/logo-icon.svg"
              alt="Payroll Logo"
              className="mx-auto mb-3 h-20 w-20 sm:h-24 sm:w-24 lg:mx-0"
            />
            <p className="text-sm text-gray-500 lg:text-base">Please sign in!</p>
            <h2 className="mt-1 text-xl font-semibold text-gray-700 sm:text-2xl">
              Welcome to Payroll
            </h2>
          </div>

          <form
            className="flex w-full flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* Username */}
            <Input
              type="str"
              name="email"
              placeholder="Enter your username or email"
              title="Email"
              inputValue={email}
              onChange={setemail}
            />

            {/* Password */}
            <div className="relative w-full">
              <h3 className="mb-1 text-xs font-semibold text-slate-700">Password</h3>
              <div className="parent-input-wrapper flex items-center justify-between overflow-clip rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 focus-within:border-slate-500">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 text-slate-500 hover:text-blue-600 active:scale-95"
                >
                  <img
                    src={
                      showPassword
                        ? '/icons/eye-icon.svg'
                        : '/icons/eye-off-icon.svg'
                    }
                    alt={showPassword ? 'Hide Password' : 'Show Password'}
                    className="h-6 w-6"
                  />
                </button>
              </div>


            </div>
                          <div className="flex w-full justify-end -mt-2">
  <button
    type="button"
    onClick={() => setIsForgotOpen(true)}
    className="text-xs text-blue-600 cursor-pointer hover:underline"
  >
    Forgot Password?
  </button>
</div>

         {/* Submit Button */}
<ButtonSm
  state="default"
  type="submit"
  className="w-full flex items-center justify-center rounded-2xl bg-blue-500 px-3.5 py-3 text-sm font-medium text-white text-center transition hover:bg-blue-700 disabled:opacity-40"
  disabled={isPending || !email || !password}
>
  <span className="flex items-center justify-center gap-2">
    {isPending && <Spinner size="sm" className="text-white" />}
    Sign In
  </span>
</ButtonSm>

          </form>
        </div>
      </div>

      {isForgotOpen && (
  <ForgotPasswordPopup onClose={() => setIsForgotOpen(false)} />
)}


      {/* Right Side - Hidden on Mobile */}
      <div className="relative hidden w-full items-center justify-center lg:flex lg:w-1/2">
        <div className="absolute z-20 text-[40px] leading-[45px] font-medium text-[#00b3fa] mix-blend-difference md:text-[55px] md:leading-[55px] xl:text-[80px] xl:leading-20">
          Reliable <br /> Fast <br /> Smart.
        </div>

        <img
          src="./Images/sign-in-image.webp"
          alt="Login art"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
      </div>
    </div>
  )
}
