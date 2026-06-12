import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/services/admin'
import { AdminNav } from '@/components/admin/AdminNav'

export const metadata: Metadata = {
  title: 'Admin — Sanghi Pipes & Tubes',
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Attempt to load session — if missing, show content anyway;
  // the middleware already handles redirects for protected routes.
  let role  = ''
  let email = ''

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const adminUser = await getAdminUser(user.id)
      role  = adminUser?.role  ?? ''
      email = adminUser?.email ?? user.email ?? ''
    }
  } catch {
    // ignore — login page doesn't need session
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {role && <AdminNav role={role} email={email} />}
      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
