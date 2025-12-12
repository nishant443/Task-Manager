import React, { useState, useEffect } from 'react'
import ConfirmModal from '../components/ConfirmModal'

const BASE_URL = import.meta.env.VITE_API_URL;

export default function TaskList({ token, user, onEdit, onView }) {
  const [tasks, setTasks] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(9)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/tasks?page=${page}&limit=${limit}`, {
        headers: { Authorization: 'Bearer ' + token }
      })
      const data = await res.json()
      if (res.ok) {
        setTasks(data.tasks)
        setTotal(data.total)
      }
    } catch (e) { }
    setLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [page])

  const markComplete = async (id) => {
    await fetch(`${BASE_URL}/api/tasks/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ status: 'completed' })
    })
    fetchTasks()
  }

  const changePriority = async (id, priority) => {
    await fetch(`${BASE_URL}/api/tasks/${id}/priority`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ priority })
    })
    fetchTasks()
  }

  const confirmDelete = (task) => {
    const assignedUserId = task.assignedTo ? task.assignedTo._id : null;
    const createdById = task.createdBy ? task.createdBy._id : null;

    if (assignedUserId === user._id && createdById !== user._id) {
      alert("You cannot delete this task. It was assigned to you by another user.");
      return;
    }
    setDeletingId(task._id);
  }

  const doDelete = async () => {
    if (!deletingId) return
    await fetch(`${BASE_URL}/api/tasks/${deletingId}?confirm=true`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + token }
    })
    setDeletingId(null)
    fetchTasks()
  }

  const cancelDelete = () => setDeletingId(null)

  const getPriorityStyles = (priority) => {
    if (priority === 'high') return 'bg-[#FFF0F0] border-[#E05353] text-[#E05353]'
    if (priority === 'medium') return 'bg-[#FFF8E5] border-[#E8C14C] text-[#B89A3A]'
    return 'bg-[#E5FFF0] border-[#76C893] text-[#5A9E6F]'
  }


  const getStatusStyles = (status) => {
    if (status === 'completed') return 'text-[#76C893]'
    if (status === 'in-progress') return 'text-[#5A67D8]'
    return 'text-[#666666]'
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-[#2D2D2D]">Tasks</h2>
          <p className="text-sm text-[#666666] mt-1">{total} total tasks</p>
        </div>
        <div className="text-sm text-[#666666]">
          Page {page} of {totalPages}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-[#666666]">Loading tasks...</div>
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-12 text-center">
          <div className="w-12 h-12 bg-[#F2F2F7] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#9A9A9A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-[#2D2D2D] font-medium mb-1">No tasks yet</h3>
          <p className="text-sm text-[#666666]">Create your first task to get started</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map(t => (
            <div
              key={t._id}
              className={`border rounded-xl p-5 hover:shadow-md transition-shadow ${getPriorityStyles(t.priority)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[#2D2D2D] font-medium truncate">{t.title}</h3>
                  <p className="text-sm text-[#9A9A9A] mt-0.5">
                    {t.assignedTo ? t.assignedTo.name : 'Unassigned'}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-xs font-medium ml-3 ${getPriorityStyles(t.priority)}`}>
                  {t.priority.charAt(0).toUpperCase() + t.priority.slice(1)}
                </span>
              </div>

              <p className="text-sm text-[#666666] mb-4 line-clamp-2">
                {t.description ? t.description : 'No description'}
              </p>

              <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-[#E8E8E8]">
                <div className="text-[#666666]">
                  <span className="text-[#9A9A9A]">Due:</span>{' '}
                  {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'Not set'}
                </div>
                <div className={`font-medium ${getStatusStyles(t.status)}`}>
                  {t.status.charAt(0).toUpperCase() + t.status.slice(1).replace('-', ' ')}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => onView(t._id)}
                  className="flex-1 px-3 py-2 bg-[#5A67D8] hover:bg-[#4C56C0] text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onEdit(t._id)}
                  className="flex-1 px-3 py-2 bg-[#F2F2F7] hover:bg-[#E8E8E8] text-[#2D2D2D] text-sm font-medium rounded-lg transition-colors"
                >
                  Edit
                </button>
              </div>

              <div className="flex items-center gap-2">
                {t.status !== 'completed' && (
                  <button
                    onClick={() => markComplete(t._id)}
                    className="flex-1 px-3 py-2 bg-[#76C893]/10 hover:bg-[#76C893]/20 text-[#5A9E6F] text-sm font-medium rounded-lg transition-colors"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => confirmDelete(t)}
                  className="flex-1 px-3 py-2 bg-[#E05353]/10 hover:bg-[#E05353]/20 text-[#E05353] text-sm font-medium rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-[#E8E8E8]">
                <label className="block text-xs text-[#9A9A9A] mb-1.5">Priority</label>
                <select
                  className="w-full px-3 py-2 bg-[#F2F2F7] border border-[#E8E8E8] rounded-lg text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#5A67D8] focus:border-transparent"
                  value={t.priority}
                  onChange={(e) => changePriority(t._id, e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-[#E8E8E8]">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-[#E8E8E8] text-[#2D2D2D] text-sm font-medium rounded-lg hover:bg-[#F2F2F7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
              Math.max(0, page - 3),
              Math.min(totalPages, page + 2)
            ).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  p === page
                    ? 'bg-[#5A67D8] text-white'
                    : 'bg-white border border-[#E8E8E8] text-[#666666] hover:bg-[#F2F2F7]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * limit >= total}
            className="px-4 py-2 bg-white border border-[#E8E8E8] text-[#2D2D2D] text-sm font-medium rounded-lg hover:bg-[#F2F2F7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <ConfirmModal
        open={!!deletingId}
        title="Delete task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={doDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}
