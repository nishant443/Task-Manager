import React, { useState, useEffect } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL;

export default function TaskForm({ token, taskId, onSaved }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState('medium')
  const [assignedTo, setAssignedTo] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [searchEmail, setSearchEmail] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }

    if (taskId) {
      setFetching(true)
      fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
        .then(r => r.json())
        .then(d => {
          setTitle(d.title || '')
          setDescription(d.description || '')
          setDueDate(d.dueDate ? new Date(d.dueDate).toISOString().slice(0, 10) : '')
          setPriority(d.priority || 'medium')
          setAssignedTo(d.assignedTo ? d.assignedTo._id : '')
          setSearchEmail(d.assignedTo ? d.assignedTo.email : '')
          setFetching(false)
        })
        .catch(() => setFetching(false))
    }

    fetch(`${BASE_URL}/api/users`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setUsers(d)
      })
      .catch(() => {})
  }, [taskId])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const body = {
      title,
      description,
      dueDate: dueDate || null,
      priority,
      assignedTo: assignedTo || null
    }
    if (taskId) {
      await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(body)
      })
    } else {
      await fetch(`${BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify(body)
      })
    }
    setLoading(false)
    onSaved && onSaved()
  }

  const getPriorityStyles = (value) => {
    if (priority === value) {
      if (value === 'high') return 'bg-[#E05353] text-white border-[#E05353]'
      if (value === 'medium') return 'bg-[#E8C14C] text-white border-[#E8C14C]'
      return 'bg-[#76C893] text-white border-[#76C893]'
    }
    return 'bg-white text-[#666666] border-[#E8E8E8] hover:bg-[#F2F2F7]'
  }

  const handleEmailChange = (e) => {
    const email = e.target.value
    setSearchEmail(email)
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (foundUser) {
      setAssignedTo(foundUser._id)
    } else {
      setAssignedTo('')
    }
  }

  const handleUserSelect = (user) => {
    setAssignedTo(user._id)
    setSearchEmail(user.email)
  }

  const assignToMe = () => {
    if (currentUser) {
      const me = users.find(u => u._id === currentUser.id || u.email === currentUser.email)
      if (me) {
        setAssignedTo(me._id)
        setSearchEmail(me.email)
      }
    }
  }

  const clearAssignment = () => {
    setAssignedTo('')
    setSearchEmail('')
  }

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    u.name.toLowerCase().includes(searchEmail.toLowerCase())
  )

  const selectedUser = users.find(u => u._id === assignedTo)

  const isAssignedToMe = currentUser && selectedUser &&
    (selectedUser._id === currentUser.id || selectedUser.email === currentUser.email)

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#666666]">Loading task...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => onSaved && onSaved()}
        className="flex items-center gap-2 text-[#666666] hover:text-[#2D2D2D] mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to Tasks</span>
      </button>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#2D2D2D]">
          {taskId ? 'Edit Task' : 'Create Task'}
        </h2>
        <p className="text-sm text-[#666666] mt-1">
          {taskId ? 'Update the task details below' : 'Fill in the details to create a new task'}
        </p>
      </div>

      <div className="bg-white border border-[#E8E8E8] rounded-xl p-6 shadow-sm">
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 bg-[#F2F2F7] border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A67D8] focus:border-transparent text-[#2D2D2D] placeholder-[#9A9A9A] transition-all"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 bg-[#F2F2F7] border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A67D8] focus:border-transparent text-[#2D2D2D] placeholder-[#9A9A9A] transition-all resize-none"
              placeholder="Enter task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Due Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 bg-[#F2F2F7] border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A67D8] focus:border-transparent text-[#2D2D2D] transition-all"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
                Priority
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  className={`flex-1 py-3 px-3 text-sm font-medium rounded-lg border transition-all ${getPriorityStyles('low')}`}
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  className={`flex-1 py-3 px-3 text-sm font-medium rounded-lg border transition-all ${getPriorityStyles('medium')}`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`flex-1 py-3 px-3 text-sm font-medium rounded-lg border transition-all ${getPriorityStyles('high')}`}
                >
                  High
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-2">
              Assign To
            </label>

            {selectedUser ? (
              <div className="flex items-center justify-between px-4 py-3 bg-[#5A67D8]/5 border border-[#5A67D8]/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#5A67D8] rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#2D2D2D]">{selectedUser.name}</p>
                      {isAssignedToMe && (
                        <span className="text-xs bg-[#5A67D8] text-white px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#666666]">{selectedUser.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearAssignment}
                  className="p-2 text-[#666666] hover:text-[#E05353] hover:bg-[#E05353]/10 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={assignToMe}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#5A67D8]/10 hover:bg-[#5A67D8]/20 border-2 border-dashed border-[#5A67D8]/30 rounded-lg text-[#5A67D8] font-medium transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Assign to me
                </button>

                <div className="relative flex items-center">
                  <div className="flex-1 border-t border-[#E8E8E8]"></div>
                  <span className="px-3 text-xs text-[#9A9A9A]">or search user</span>
                  <div className="flex-1 border-t border-[#E8E8E8]"></div>
                </div>

                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    className="w-full pl-12 pr-4 py-3 bg-[#F2F2F7] border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A67D8] focus:border-transparent text-[#2D2D2D] placeholder-[#9A9A9A] transition-all"
                    placeholder="Search by name or email"
                    value={searchEmail}
                    onChange={handleEmailChange}
                  />

                  {searchEmail && filteredUsers.length > 0 && !assignedTo && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#E8E8E8] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {filteredUsers.map(user => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => handleUserSelect(user)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-[#F2F2F7] transition-colors text-left"
                        >
                          <div className="w-8 h-8 bg-[#5A67D8]/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-[#5A67D8]">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-[#2D2D2D]">{user.name}</p>
                              {currentUser && (user._id === currentUser.id || user.email === currentUser.email) && (
                                <span className="text-xs bg-[#F2F2F7] text-[#666666] px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#666666]">{user.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {searchEmail && filteredUsers.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#E8E8E8] rounded-lg shadow-lg p-4">
                      <p className="text-sm text-[#666666] text-center">No users found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#F2F2F7] border border-[#E8E8E8] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#9A9A9A] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-[#666666]">
                Only the task creator or an admin can delete this task. Assigned users can view and update the task but cannot delete it.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-[#E8E8E8]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#5A67D8] hover:bg-[#4C56C0] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : taskId ? 'Update Task' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => onSaved && onSaved()}
              className="px-6 py-3 bg-[#F2F2F7] hover:bg-[#E8E8E8] text-[#666666] font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}