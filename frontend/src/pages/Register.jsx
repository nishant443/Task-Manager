import React, { useState } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Register({ onLogin, onSwitch }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        setLoading(false)
        return setErr(data.message || 'Registration failed')
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
          <h2 className="text-2xl font-semibold text-[#2D2D2D]">Create your account</h2>
          <p className="text-[#666666] mt-2">Get started with KartavyaBook</p>
        </div>

        <div className="bg-white border border-[#E8E8E8] rounded-xl p-8 shadow-sm">
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#F2F2F7] border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A67D8] focus:border-transparent text-[#2D2D2D] placeholder-[#9A9A9A] transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                placeholder="Create a password"
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-[#666666]">
          Already have an account?{' '}
          <button
            onClick={onSwitch}
            className="text-[#5A67D8] font-medium hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}