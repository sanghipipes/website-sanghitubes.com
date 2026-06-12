import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/services/admin'
import { getAllQuotes } from '@/services/quote'
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

export default async function AdminQuotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const adminUser = await getAdminUser(user.id)
  if (!adminUser || !['admin', 'sales'].includes(adminUser.role)) {
    redirect('/admin/dashboard')
  }

  const quotes = await getAllQuotes()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Quote Requests</h1>
        <p className="text-slate-400 text-sm mt-1">{quotes.length} total inquiry{quotes.length !== 1 ? 'ies' : 'y'}</p>
      </div>

      <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
        {quotes.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">No quote requests yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-800/50">
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Customer</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden sm:table-cell">Items</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium">Status</th>
                  <th className="text-left px-5 py-3 text-slate-400 font-medium hidden md:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-slate-400 font-medium">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {quotes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{q.customer_name}</div>
                      <div className="text-xs text-slate-500">{q.company_name ?? q.email}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 hidden sm:table-cell">
                      {q.items.length} item{q.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_BADGE[q.status]}`}>
                        {STATUS_LABEL[q.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs hidden md:table-cell">
                      {new Date(q.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/quotes/${q.id}`}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                      >
                        Details →
                      </Link>
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
