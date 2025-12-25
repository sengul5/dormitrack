import { useState } from 'react'
import { authClient } from '@lib/auth-client'
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const loadingToast = toast.loading('Creating account...')

    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onSuccess: () => {
          toast.dismiss(loadingToast)
          toast.success('Account created successfully! Redirecting...')

          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1000)
        },
        onError: (ctx) => {
          toast.dismiss(loadingToast)
          toast.error(ctx.error.message || 'An error occurred during registration.')
          setLoading(false)
        },
      }
    )
  }

  const handleSocialRegister = async (provider: 'google' | 'facebook') => {
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
        <h1 className="mb-2 text-center text-3xl font-bold text-slate-900">Create Account</h1>
        <p className="mb-8 text-center text-sm text-gray-500">
          Sign up to get started with your 30 days free trial
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>

          <div className="relative space-y-1.5">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-400">Must be at least 8 characters</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-gray-500">Or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleSocialRegister('google')}
            className="flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="h-5 w-5"
              alt="Google"
            />
            <span>Google</span>
          </button>

          <button
            onClick={() => handleSocialRegister('facebook')}
            className="flex items-center justify-center space-x-2 rounded-lg border border-gray-200 bg-white py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              className="h-5 w-5"
              alt="Facebook"
            />
            <span>Facebook</span>
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:underline">
            Log In
          </a>
        </div>
      </div>
    </div>
  )
}
