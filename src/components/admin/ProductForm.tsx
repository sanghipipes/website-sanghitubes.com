'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import { CATEGORIES, generateSlug, type ProductFormInput } from '@/lib/validations/product'
import { createProductAction, updateProductAction } from '@/actions/products'
import type { ProductRow } from '@/types'

interface ProductFormProps {
  product?: ProductRow
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter()
  const isEdit = !!product

  const [form, setForm] = useState({
    name:        product?.name        ?? '',
    slug:        product?.slug        ?? '',
    category:    product?.category    ?? CATEGORIES[0],
    description: product?.description ?? '',
    material:    product?.material    ?? '',
    size:        product?.size        ?? '',
    imageUrl:    product?.image_url   ?? '',
    featured:    product?.featured    ?? false,
  })
  const [saving, setSaving]   = useState(false)
  const [error,  setError]    = useState('')

  const handleNameChange = (name: string) => {
    setForm((f) => ({ ...f, name, slug: isEdit ? f.slug : generateSlug(name) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const input = form as unknown as ProductFormInput
    const result = isEdit
      ? await updateProductAction(product.id, input)
      : await createProductAction(input)

    setSaving(false)

    if (!result.success) {
      setError(result.error ?? 'Something went wrong.')
      return
    }
    router.push('/admin/products')
    router.refresh()
  }

  const field = (label: string, key: keyof typeof form, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) =>
          key === 'name'
            ? handleNameChange(e.target.value)
            : setForm((f) => ({ ...f, [key]: e.target.value }))
        }
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {field('Product Name *', 'name', 'text', 'e.g. K9 DI Spun Pipe')}
      {field('Slug *', 'slug', 'text', 'e.g. k9-di-spun-pipe')}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Category *</label>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          placeholder="Short product description..."
          className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
        />
      </div>

      {field('Material', 'material', 'text', 'e.g. Ductile Iron')}
      {field('Size / Range', 'size', 'text', 'e.g. DN 80 – DN 1200')}
      {field('Image URL', 'imageUrl', 'url', 'https://...')}

      <div className="flex items-center gap-3">
        <input
          id="featured"
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          className="w-4 h-4 accent-blue-500"
        />
        <label htmlFor="featured" className="text-sm text-slate-300">Mark as featured product</label>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium rounded-lg text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
