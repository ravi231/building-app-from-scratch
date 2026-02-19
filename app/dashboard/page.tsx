import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export default async function Dashboard({ searchParams }: { searchParams: { error?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: links } = await supabase
    .from('links')
    .select('*, clicks(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  async function createLink(formData: FormData) {
    'use server'
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('links').insert({
      user_id: user.id,
      original_url: formData.get('url') as string,
      slug: formData.get('slug') as string,
    })
    if (error) redirect('/dashboard?error=' + encodeURIComponent(error.message))
    revalidatePath('/dashboard')
  }

  async function logout() {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  const host = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">LinkTrack</h1>
        <form action={logout}>
          <button className="text-sm text-gray-500 hover:text-black">Logout</button>
        </form>
      </div>

      {/* Create link form */}
      <form action={createLink} className="flex gap-2 mb-8">
        <input name="url" type="url" placeholder="https://destination-url.com" required
          className="flex-1 border px-3 py-2 rounded-lg text-sm" />
        <input name="slug" placeholder="my-slug" required
          className="border px-3 py-2 rounded-lg text-sm w-32" />
        <button className="px-4 py-2 bg-black text-white rounded-lg text-sm">Create</button>
      </form>
      {searchParams.error && <p className="text-red-500 text-sm mb-4">{searchParams.error}</p>}

      <p className="text-xs text-gray-400 mb-2">
        Share links as <code>{host}/[slug]?source=twitter</code> to track clicks by source.
      </p>

      {/* Links list */}
      <div className="space-y-3">
        {links?.map(link => {
          const bySource = (link.clicks as any[]).reduce((acc: Record<string, number>, c) => {
            acc[c.source_tag] = (acc[c.source_tag] ?? 0) + 1
            return acc
          }, {})

          return (
            <div key={link.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="min-w-0">
                  <a href={`${host}/${link.slug}`} target="_blank"
                    className="font-mono text-sm font-medium hover:underline">
                    /{link.slug}
                  </a>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{link.original_url}</p>
                </div>
                <span className="text-sm font-medium ml-4 shrink-0">
                  {(link.clicks as any[]).length} clicks
                </span>
              </div>
              {Object.keys(bySource).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {Object.entries(bySource).map(([src, count]) => (
                    <span key={src} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {src}: {count as number}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {!links?.length && (
          <p className="text-gray-400 text-sm text-center py-8">No links yet. Create one above.</p>
        )}
      </div>
    </div>
  )
}
