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
    <main className="flex items-center justify-center min-h-screen">
      <form action={signup} className="w-80 space-y-3">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {searchParams.error && <p className="text-red-500 text-sm">{searchParams.error}</p>}
        <input name="email" type="email" placeholder="Email" required className="w-full border px-3 py-2 rounded-lg" />
        <input name="password" type="password" placeholder="Password (min 6 chars)" required minLength={6} className="w-full border px-3 py-2 rounded-lg" />
        <button className="w-full py-2 bg-black text-white rounded-lg">Sign Up</button>
        <p className="text-sm text-center text-gray-500">
          Have an account? <Link href="/login" className="underline">Log in</Link>
        </p>
      </form>
    </main>
  )
}
