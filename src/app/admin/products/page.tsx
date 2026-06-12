import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/services/admin'
import { getAllProducts } from '@/services/product'
import { DeleteProductButton } from './DeleteProductButton'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const adminUser = await getAdminUser(user.id)
  if (!adminUser || !['admin', 'editor'].includes(adminUser.role)) {
    redirect('/admin/dashboard')
  }

  const products = await getAllProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">{products.length} product{products.length !== 1 ? 's' : ''} in catalogue</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 text-sm mb-4">No products yet.</p>
            <Link href="/admin/products/new" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Create your first product →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Name</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden sm:table-cell">Category</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden md:table-cell">Slug</th>
                  <th className="text-center px-5 py-3 text-slate-400 font-medium">Featured</th>
                  <th className="text-right px-5 py-3 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{p.name}</div>
                      {p.material && <div className="text-xs text-slate-500 mt-0.5">{p.material}</div>}
                    </td>
                    <td className="px-5 py-4 text-slate-300 hidden sm:table-cell">
                      <span className="bg-slate-800 px-2 py-0.5 rounded text-xs">{p.category}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono text-xs hidden md:table-cell">{p.slug}</td>
                    <td className="px-5 py-4 text-center">
                      {p.featured ? (
                        <Star size={15} className="text-yellow-400 fill-yellow-400 mx-auto" />
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>
                        {adminUser.role === 'admin' && (
                          <DeleteProductButton id={p.id} name={p.name} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
