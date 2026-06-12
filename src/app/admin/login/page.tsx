'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Loader2, AlertCircle } from 'lucide-react'
import { adminLoginAction } from '@/actions/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await adminLoginAction(email, password)
    setLoading(false)

    if (result.success) {
      router.push('/admin/dashboard')
      router.refresh()
    } else {
      setError(result.error ?? 'Login failed.')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900/40 border border-blue-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-slate-400 text-sm mt-1">Sanghi Pipes &amp; Tubes — Staff Only</p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 border border-slate-700 rounded-2xl p-8 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sanghitubes.com"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/60 text-red-400 px-4 py-3 rounded-xl text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 text-xs mt-6">
          Authorised personnel only. All access is logged.
        </p>
      </div>
    </div>
  )
}
