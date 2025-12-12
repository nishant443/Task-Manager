import React, { useState, useEffect } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL;

export default function Users({ token }) {
  const [users, setUsers] = useState([])
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${BASE_URL}/api/users`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setUsers(d)
        } else {
          setErr(d.message || 'Cannot load users')
        }
        setLoading(false)
      })
      .catch(() => {
        setErr('Network error')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#666666]">Loading users...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#2D2D2D]">Users</h2>
        <p className="text-sm text-[#666666] mt-1">
          {users.length} registered {users.length === 1 ? 'user' : 'users'}
        </p>
      </div>

      {err && (
        <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg mb-6">
          <p className="text-sm text-[#E05353]">{err}</p>
        </div>
      )}

      {!err && users.length === 0 && (
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-12 text-center">
          <div className="w-12 h-12 bg-[#F2F2F7] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="text-[#2D2D2D] font-medium mb-1">No users found</h3>
          <p className="text-sm text-[#666666]">Users will appear here once registered</p>
        </div>
      )}

      {!err && users.length > 0 && (
        <div className="bg-white border border-[#E8E8E8] rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F2F2F7] border-b border-[#E8E8E8]">
                <th className="text-left px-6 py-3 text-xs font-medium text-[#9A9A9A] uppercase tracking-wide">
                  User
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[#9A9A9A] uppercase tracking-wide">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-[#9A9A9A] uppercase tracking-wide">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, index) => (
                <tr
                  key={u._id}
                  className={index !== users.length - 1 ? 'border-b border-[#E8E8E8]' : ''}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-[#5A67D8]/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-[#5A67D8]">
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-[#2D2D2D] font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[#666666]">{u.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    {u.isAdmin ? (
                      <span className="inline-flex px-2.5 py-1 bg-[#5A67D8]/10 text-[#5A67D8] text-xs font-medium rounded-md">
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 bg-[#F2F2F7] text-[#666666] text-xs font-medium rounded-md">
                        Member
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}