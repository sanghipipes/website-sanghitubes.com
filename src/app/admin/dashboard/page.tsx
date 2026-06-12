import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, Package, Clock, CheckCircle2, TrendingUp, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAdminUser } from '@/services/admin'
import { getQuoteStats } from '@/services/quote'
import { getAllProducts } from '@/services/product'
import type { QuoteStatus } from '@/types'

const STATUS_BADGE: Record<QuoteStatus, string> = {
  pending:     'bg-yellow-900/40 text-yellow-400 border-yellow-700/50',
  in_progress: 'bg-blue-900/40 text-blue-400 border-blue-700/50',
  completed:   'bg-green-900/40 text-green-400 border-green-700/50',
  cancelled:   'bg-red-900/40 text-red-400 border-red-700/50',
}
const STATUS_LABEL: Record<QuoteStatus, string> = {
  pending:     'Pending',
  in_progress: 'In Progress',
  completed:   'Completed',
  cancelled:   'Cancelled',
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const adminUser = await getAdminUser(user.id)
  if (!adminUser) redirect('/admin/login')

  const adminSupabase = createAdminClient()
  const [stats, recentQuotesResult, productsResult] = await Promise.allSettled([
    getQuoteStats(),
    adminSupabase
      .from('quote_requests')
      .select('id, customer_name, company_name, email, status, created_at')
      .order('created_at', { ascending: false })
      .limit(6),
    getAllProducts(),
  ])

  const quoteStats     = stats.status === 'fulfilled' ? stats.value : { total: 0, pending: 0, inProgress: 0, completed: 0 }
  type RecentQuote = { id: string; customer_name: string; company_name: string | null; email: string; status: string; created_at: string }
  const recentQuotes: RecentQuote[] = recentQuotesResult.status === 'fulfilled' ? ((recentQuotesResult.value.data ?? []) as RecentQuote[]) : []
  const totalProducts  = productsResult.status === 'fulfilled' ? productsResult.value.length : 0

  const statCards = [
    { label: 'Total Quotes',   value: quoteStats.total,      icon: FileText,     color: 'bg-slate-800 border-slate-700', iconColor: 'text-blue-400' },
    { label: 'Pending',        value: quoteStats.pending,    icon: Clock,        color: 'bg-yellow-900/20 border-yellow-700/30', iconColor: 'text-yellow-400' },
    { label: 'In Progress',    value: quoteStats.inProgress, icon: TrendingUp,   color: 'bg-blue-900/20 border-blue-700/30', iconColor: 'text-blue-400' },
    { label: 'Completed',      value: quoteStats.completed,  icon: CheckCircle2, color: 'bg-green-900/20 border-green-700/30', iconColor: 'text-green-400' },
    { label: 'Total Products', value: totalProducts,         icon: Package,      color: 'bg-slate-800 border-slate-700', iconColor: 'text-orange-400' },
  ]

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back, <span className="text-slate-200 font-medium">{adminUser.email}</span>
          {' '}&mdash; <span className="capitalize">{adminUser.role}</span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`border rounded-xl p-4 ${card.color}`}>
            <card.icon size={20} className={`mb-3 ${card.iconColor}`} />
            <div className="text-2xl font-bold text-white">{card.value}</div>
            <div className="text-xs text-slate-400 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent quotes */}
      {['admin', 'sales'].includes(adminUser.role) && (
        <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
            <h2 className="font-semibold text-white">Recent Quote Requests</h2>
            <Link
              href="/admin/quotes"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recentQuotes.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-500 text-sm">No quotes yet.</div>
          ) : (
            <div className="divide-y divide-slate-800">
              {recentQuotes.map((q) => (
                <Link
                  key={q.id}
                  href={`/admin/quotes/${q.id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{q.customer_name}</p>
                    <p className="text-xs text-slate-400">{q.company_name ?? q.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_BADGE[q.status as QuoteStatus]}`}>
                      {STATUS_LABEL[q.status as QuoteStatus]}
                    </span>
                    <span className="text-xs text-slate-500 hidden sm:block">
                      {new Date(q.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {['admin', 'editor'].includes(adminUser.role) && (
          <Link
            href="/admin/products/new"
            className="flex items-center gap-3 bg-slate-900 border border-slate-700 hover:border-blue-700/60 rounded-xl p-5 transition-colors group"
          >
            <Package size={22} className="text-orange-400 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-white text-sm">Add New Product</p>
              <p className="text-xs text-slate-400">Create a product listing</p>
            </div>
            <ArrowRight size={16} className="text-slate-500 ml-auto group-hover:text-blue-400 transition-colors" />
          </Link>
        )}
        {['admin', 'sales'].includes(adminUser.role) && (
          <Link
            href="/admin/quotes"
            className="flex items-center gap-3 bg-slate-900 border border-slate-700 hover:border-blue-700/60 rounded-xl p-5 transition-colors group"
          >
            <FileText size={22} className="text-blue-400 group-hover:scale-110 transition-transform" />
            <div>
              <p className="font-semibold text-white text-sm">Manage Quotes</p>
              <p className="text-xs text-slate-400">View and update inquiries</p>
            </div>
            <ArrowRight size={16} className="text-slate-500 ml-auto group-hover:text-blue-400 transition-colors" />
          </Link>
        )}
      </div>
    </div>
  )
}
