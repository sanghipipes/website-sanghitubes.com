import { redirect } from 'next/navigation'

// /admin → redirect to dashboard (middleware ensures auth).
export default function AdminIndexPage() {
  redirect('/admin/dashboard')
}
