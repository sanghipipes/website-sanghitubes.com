'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteProductAction } from '@/actions/products'

interface DeleteProductButtonProps {
  id:   string
  name: string
}

export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setLoading(true)
    const result = await deleteProductAction(id)
    setLoading(false)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error ?? 'Delete failed.')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  )
}
