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
    <main className="flex items-center justify-center min-h-screen">
      <form action={login} className="w-80 space-y-3">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
        {searchParams.error && <p className="text-red-500 text-sm">{searchParams.error}</p>}
        <input name="email" type="email" placeholder="Email" required className="w-full border px-3 py-2 rounded-lg" />
        <input name="password" type="password" placeholder="Password" required className="w-full border px-3 py-2 rounded-lg" />
        <button className="w-full py-2 bg-black text-white rounded-lg">Log In</button>
        <p className="text-sm text-center text-gray-500">
          No account? <Link href="/signup" className="underline">Sign up</Link>
        </p>
      </form>
    </main>
  )
}
