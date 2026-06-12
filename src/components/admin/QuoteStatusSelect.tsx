'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateQuoteStatusAction } from '@/actions/admin-quotes'
import type { QuoteStatus } from '@/types'

const STATUS_OPTIONS: { value: QuoteStatus; label: string; color: string }[] = [
  { value: 'pending',     label: 'Pending',     color: 'text-yellow-400' },
  { value: 'in_progress', label: 'In Progress', color: 'text-blue-400'   },
  { value: 'completed',   label: 'Completed',   color: 'text-green-400'  },
  { value: 'cancelled',   label: 'Cancelled',   color: 'text-red-400'    },
]

interface QuoteStatusSelectProps {
  quoteId:       string
  currentStatus: QuoteStatus
}

export function QuoteStatusSelect({ quoteId, currentStatus }: QuoteStatusSelectProps) {
  const [status,  setStatus]  = useState<QuoteStatus>(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const router = useRouter()

  const handleChange = async (newStatus: QuoteStatus) => {
    setLoading(true)
    setError('')
    const result = await updateQuoteStatusAction(quoteId, newStatus)
    setLoading(false)
    if (result.success) {
      setStatus(newStatus)
      router.refresh()
    } else {
      setError(result.error ?? 'Failed to update.')
    }
  }

  const current = STATUS_OPTIONS.find((s) => s.value === status)

  return (
    <div className="flex items-center gap-3">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as QuoteStatus)}
        disabled={loading}
        className={`px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60 ${current?.color ?? ''}`}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {loading && <span className="text-slate-400 text-xs">Saving…</span>}
      {error   && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}
