import React, { useState, useEffect } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL;

export default function TaskDetails({ token, taskId, onBack, onEdit }) {
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!taskId) return
    setLoading(true)
    fetch(`${BASE_URL}/api/tasks/${taskId}`, {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then(r => r.json())
      .then(d => {
        setTask(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [taskId])

  const getPriorityStyles = (priority) => {
    if (priority === 'high') return 'bg-[#E05353]/10 text-[#E05353] border border-[#E05353]/20'
    if (priority === 'medium') return 'bg-[#E8C14C]/10 text-[#B89A3A] border border-[#E8C14C]/20'
    return 'bg-[#76C893]/10 text-[#5A9E6F] border border-[#76C893]/20'
  }

  const getStatusStyles = (status) => {
    if (status === 'completed') return 'bg-[#76C893]/10 text-[#5A9E6F]'
    if (status === 'in-progress') return 'bg-[#5A67D8]/10 text-[#5A67D8]'
    return 'bg-[#F2F2F7] text-[#666666]'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#666666]">Loading task details...</div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#666666] hover:text-[#2D2D2D] mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to Tasks</span>
        </button>
        <div className="bg-white border border-[#E8E8E8] rounded-xl p-12 text-center">
          <p className="text-[#666666]">Task not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#666666] hover:text-[#2D2D2D] mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Back to Tasks</span>
      </button>

      <div className="bg-white border border-[#E8E8E8] rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E8E8E8]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#2D2D2D]">{task.title}</h2>
              <p className="text-sm text-[#9A9A9A] mt-1">
                Created {new Date(task.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getPriorityStyles(task.priority)}`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusStyles(task.status)}`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-medium text-[#9A9A9A] uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-[#2D2D2D] leading-relaxed">
                {task.description || 'No description provided'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E8E8E8]">
              <div className="bg-[#F2F2F7] rounded-lg p-4">
                <h3 className="text-xs font-medium text-[#9A9A9A] uppercase tracking-wide mb-1">
                  Due Date
                </h3>
                <p className="text-[#2D2D2D] font-medium">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set'}
                </p>
              </div>

              <div className="bg-[#F2F2F7] rounded-lg p-4">
                <h3 className="text-xs font-medium text-[#9A9A9A] uppercase tracking-wide mb-1">
                  Assigned To
                </h3>
                <p className="text-[#2D2D2D] font-medium">
                  {task.assignedTo ? task.assignedTo.name : 'Unassigned'}
                </p>
                {task.assignedTo && (
                  <p className="text-xs text-[#9A9A9A] mt-0.5">{task.assignedTo.email}</p>
                )}
              </div>

              <div className="bg-[#F2F2F7] rounded-lg p-4">
                <h3 className="text-xs font-medium text-[#9A9A9A] uppercase tracking-wide mb-1">
                  Priority Level
                </h3>
                <p className="text-[#2D2D2D] font-medium">
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#FAFAFA] border-t border-[#E8E8E8] flex items-center gap-3">
          <button
            onClick={() => onEdit(task._id)}
            className="px-5 py-2.5 bg-[#5A67D8] hover:bg-[#4C56C0] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Edit Task
          </button>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-white border border-[#E8E8E8] hover:bg-[#F2F2F7] text-[#666666] text-sm font-medium rounded-lg transition-colors"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  )
}