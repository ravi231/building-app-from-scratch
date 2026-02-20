import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default function Signup({ searchParams }: { searchParams: { error?: string } }) {
  async function signup(formData: FormData) {
    'use server'
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    })
    if (error) redirect('/signup?error=' + encodeURIComponent(error.message))
    redirect('/dashboard')
  }

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-black text-white text-sm font-bold mb-4 select-none">
            LT
          </div>
          <h1 className="text-2xl font-bold">Create an account</h1>
          <p className="text-gray-500 text-sm mt-1">Start tracking your links today</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <form action={signup} className="space-y-4">
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
                placeholder="Min. 6 characters"
                required
                minLength={6}
                className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors"
              />
            </div>
            <button className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
              Create Account
            </button>
          </form>
        </div>

        <p className="text-sm text-center text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-gray-900 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
