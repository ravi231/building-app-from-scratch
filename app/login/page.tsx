import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function Login({ searchParams }: { searchParams: { error?: string } }) {
  async function login(formData: FormData) {
    'use server'
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    if (error) redirect('/login?error=' + encodeURIComponent(error.message))
    redirect('/dashboard')
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-black text-white text-sm font-bold mb-4 select-none">
            LT
          </div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your LinkTrack account</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form action={login} className="space-y-4">
            {searchParams.error && (
              <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {searchParams.error}
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors"
              />
            </div>
            <button className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Log In
            </button>
          </form>
        </div>

        <p className="text-sm text-center text-gray-500 mt-5">
          No account?{' '}
          <Link href="/signup" className="text-gray-900 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
