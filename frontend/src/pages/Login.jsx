import React, { useState } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Login({ onLogin, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setLoading(false)
        return setErr(data.message || 'Login failed')
      }
      onLogin(data.token, data.user)
    } catch (e) {
      setErr('Network error')
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-[#2D2D2D]">Welcome back</h2>
          <p className="text-[#666666] mt-2">Sign in to continue to TaskFlow</p>
        </div>

        <div className="bg-white border border-[#E8E8E8] rounded-xl p-8 shadow-sm">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#F2F2F7] border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A67D8] focus:border-transparent text-[#2D2D2D] placeholder-[#9A9A9A] transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-[#F2F2F7] border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A67D8] focus:border-transparent text-[#2D2D2D] placeholder-[#9A9A9A] transition-all"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {err && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-[#E05353]">{err}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#5A67D8] hover:bg-[#4C56C0] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[#666666]">
          New to TaskFlow?{' '}
          <button
            onClick={onSwitch}
            className="text-[#5A67D8] font-medium hover:underline"
          >
            Create an account
          </button>
        </p>
      </div>
    </div>
  )
}