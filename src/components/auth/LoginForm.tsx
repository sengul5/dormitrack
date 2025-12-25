import { useState } from 'react'
import { authClient } from '@lib/auth-client'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Loading toast
    const loadingToast = toast.loading('Signing in...')

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast)
          toast.success('Login successful! Redirecting...')

          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1000)
        },
        onError: (ctx) => {
          toast.dismiss(loadingToast)
          // Show error message
          toast.error(ctx.error.message || 'An error occurred during login.')
          setLoading(false)
        },
      }
    )
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    toast.promise(
      authClient.signIn.social({
        provider: provider,
        callbackURL: '/dashboard',
      }),
      {
        loading: `Connecting with ${provider}...`,
        success: 'Redirecting...',
        error: 'Connection failed.',
      }
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-[450px] rounded-xl bg-white p-8 shadow-sm sm:p-12">
        <h1 className="mb-10 text-center text-3xl font-bold text-slate-900">Login</h1>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              required
              placeholder="Loisbecket@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="relative space-y-1.5">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="•••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center space-x-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-500">Remember me</span>
            </label>
            <a href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-700">
              Forgot Password ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">Or</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="flex w-full items-center justify-center space-x-3 rounded-lg border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="h-5 w-5"
              alt="Google"
            />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin('facebook')}
            className="flex w-full items-center justify-center space-x-3 rounded-lg border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              className="h-5 w-5"
              alt="Facebook"
            />
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-blue-600 hover:underline">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  )
}
