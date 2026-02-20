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
    <div className="min-h-screen bg-[#f0ece4]">
      <nav className="px-6 py-4 border-b-2 border-black">
        <Link href="/" className="font-black text-xs tracking-[0.2em] uppercase hover:underline">
          LinkTrack
        </Link>
      </nav>

      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">
          <div className="border-2 border-black bg-white p-8">
            <h1 className="font-display text-5xl uppercase tracking-wide leading-none mb-1">
              Log In
            </h1>
            <div className="w-10 h-1 bg-[#00C4B1] mb-6" />

            <form action={login} className="space-y-4">
              {searchParams.error && (
                <div className="text-xs font-mono bg-[#FF6B6B] border-2 border-black px-3 py-2 text-white">
                  {searchParams.error}
                </div>
              )}
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-widest">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white outline-none focus:border-[#00C4B1] transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-black uppercase tracking-widest">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full border-2 border-black px-3 py-2 text-sm font-mono bg-white outline-none focus:border-[#00C4B1] transition-colors"
                />
              </div>
              <button className="w-full py-3 bg-black text-white font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors">
                Log In →
              </button>
            </form>
          </div>

          <p className="text-xs font-mono text-center mt-4 text-gray-600">
            No account?{' '}
            <Link href="/signup" className="font-bold text-black underline hover:text-gray-700">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
