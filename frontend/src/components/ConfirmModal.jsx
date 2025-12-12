import React from 'react'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <div className="w-12 h-12 bg-[#E05353]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-[#E05353]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#2D2D2D] text-center mb-2">
            {title || 'Confirm'}
          </h3>
          <p className="text-sm text-[#666666] text-center">
            {message || 'Are you sure?'}
          </p>
        </div>
        <div className="flex border-t border-[#E8E8E8]">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-sm font-medium text-[#666666] hover:bg-[#F2F2F7] transition-colors"
          >
            Cancel
          </button>
          <div className="w-px bg-[#E8E8E8]"></div>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 text-sm font-medium text-[#E05353] hover:bg-[#E05353]/5 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}