import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/services/admin'
import { getQuoteById } from '@/services/quote'
import { QuoteStatusSelect } from '@/components/admin/QuoteStatusSelect'

export default async function QuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const adminUser = await getAdminUser(user.id)
  if (!adminUser || !['admin', 'sales'].includes(adminUser.role)) {
    redirect('/admin/dashboard')
  }

  const quote = await getQuoteById(id)
  if (!quote) notFound()

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/quotes"
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Quote #{quote.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {new Date(quote.created_at).toLocaleString('en-IN', {
              timeZone: 'Asia/Kolkata',
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>
      </div>

      {/* Status */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Status</h2>
        <QuoteStatusSelect quoteId={quote.id} currentStatus={quote.status} />
      </div>

      {/* Customer info */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Customer Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={<Building2 size={15} />} label="Name"    value={quote.customer_name} />
          {quote.company_name && <InfoRow icon={<Building2 size={15} />} label="Company" value={quote.company_name} />}
          <InfoRow icon={<Mail size={15} />}  label="Email"  value={quote.email} />
          <InfoRow icon={<Phone size={15} />} label="Phone"  value={quote.phone} />
          {quote.city && <InfoRow icon={<MapPin size={15} />} label="City"  value={quote.city} />}
        </div>
      </div>

      {/* Products */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
            Requested Products ({quote.items.length})
          </h2>
        </div>
        {quote.items.length === 0 ? (
          <div className="px-6 py-6 text-slate-500 text-sm">No items recorded.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="text-left px-6 py-3 text-slate-400 font-medium">Product</th>
                <th className="text-center px-6 py-3 text-slate-400 font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {quote.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-3 text-white">{item.product_name}</td>
                  <td className="px-6 py-3 text-center font-bold text-slate-200">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Message */}
      {quote.message && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Message</h2>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{quote.message}</p>
        </div>
      )}
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-slate-500 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-white font-medium">{value}</p>
      </div>
    </div>
  )
}
