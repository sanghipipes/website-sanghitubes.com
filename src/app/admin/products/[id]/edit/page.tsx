import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/services/admin'
import { getProductById } from '@/services/product'
import { ProductForm } from '@/components/admin/ProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const adminUser = await getAdminUser(user.id)
  if (!adminUser || !['admin', 'editor'].includes(adminUser.role)) {
    redirect('/admin/dashboard')
  }

  const product = await getProductById(id)
  if (!product) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          <p className="text-slate-400 text-sm mt-0.5">{product.name}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
        <ProductForm product={product} />
      </div>
    </div>
  )
}
