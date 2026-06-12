'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, FileText, LogOut, ShieldCheck } from 'lucide-react'
import { adminLogoutAction } from '@/actions/auth'

interface AdminNavProps {
  role: string
  email: string
}

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'sales', 'editor'] },
  { href: '/admin/products',  label: 'Products',  icon: Package,         roles: ['admin', 'editor'] },
  { href: '/admin/quotes',    label: 'Quotes',    icon: FileText,        roles: ['admin', 'sales'] },
]

export function AdminNav({ role, email }: AdminNavProps) {
  const pathname = usePathname()
  const router   = useRouter()

  const handleLogout = async () => {
    await adminLogoutAction()
    router.push('/admin/login')
    router.refresh()
  }

  const visibleLinks = navLinks.filter((l) => l.roles.includes(role))

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14 gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <ShieldCheck size={18} className="text-blue-400" />
          <span className="text-white font-bold text-sm tracking-wide">Admin</span>
          <span className="ml-2 text-xs px-2 py-0.5 bg-blue-900/60 text-blue-300 rounded-full capitalize border border-blue-700/50">
            {role}
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {visibleLinks.map((link) => {
            const active = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <link.icon size={15} />
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* User + logout */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-slate-400 text-xs hidden sm:block truncate max-w-[160px]">{email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-300 hover:bg-red-900/40 hover:text-red-400 transition-colors"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
