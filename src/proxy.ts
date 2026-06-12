import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — MUST be called before any redirect/logic.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLoginPage  = pathname === '/admin/login'
  const isAdminRoute = pathname.startsWith('/admin') && !isLoginPage

  // --- Admin route protection ---
  if (isAdminRoute) {
    if (!user) {
      return redirect(request, '/admin/login')
    }

    // Verify the authenticated user exists in admin_users
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!adminUser) {
      return redirect(request, '/admin/login', 'unauthorized')
    }

    // Role-based route enforcement
    const { role } = adminUser
    if (pathname.startsWith('/admin/products') && !['admin', 'editor'].includes(role)) {
      return redirect(request, '/admin/dashboard')
    }
    if (pathname.startsWith('/admin/quotes') && !['admin', 'sales'].includes(role)) {
      return redirect(request, '/admin/dashboard')
    }
  }

  // --- Redirect already-authenticated admins away from login ---
  if (isLoginPage && user) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (adminUser) {
      return redirect(request, '/admin/dashboard')
    }
  }

  // Pass current pathname as a header so the root layout can
  // conditionally hide the main Navbar/Footer on admin pages.
  supabaseResponse.headers.set('x-pathname', pathname)

  return supabaseResponse
}

function redirect(request: NextRequest, path: string, error?: string): NextResponse {
  const url = request.nextUrl.clone()
  url.pathname = path
  if (error) url.searchParams.set('error', error)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/admin/:path*',
    // Extend here if you need middleware on other routes in future.
  ],
}
