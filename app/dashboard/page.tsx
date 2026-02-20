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
    <div className="min-h-screen bg-[#f0ece4]">
      {/* Header */}
      <nav className="px-6 py-4 border-b-2 border-black flex justify-between items-center">
        <span className="font-black text-sm tracking-[0.2em] uppercase">LinkTrack</span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono border-2 border-black bg-white px-3 py-1.5 text-gray-600">
            {user.email}
          </span>
          <form action={logout}>
            <button className="text-xs font-black uppercase tracking-widest border-2 border-black px-4 py-1.5 bg-[#FF6B6B] text-white hover:bg-[#ff5555] transition-colors">
              Exit
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Create link section */}
        <div className="border-2 border-black bg-white p-6 mb-8 [box-shadow:4px_4px_0px_#000]">
          <h2 className="font-black text-base uppercase tracking-widest mb-1">New Target</h2>
          <div className="w-14 h-0.5 bg-black mb-5" />

          <form action={createLink}>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-black uppercase tracking-widest mb-1.5">
                  Destination URL
                </label>
                <input
                  name="url"
                  type="url"
                  placeholder="https://..."
                  required
                  className="w-full border-2 border-black px-3 py-2.5 text-sm font-mono bg-white outline-none focus:border-[#00C4B1] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-1.5">
                  Slug
                </label>
                <div className="flex border-2 border-black">
                  <span className="px-2.5 flex items-center text-sm font-mono bg-gray-100 border-r-2 border-black select-none">
                    /
                  </span>
                  <input
                    name="slug"
                    placeholder="short"
                    required
                    className="w-28 px-3 py-2.5 text-sm font-mono bg-white outline-none focus:bg-[#f0ece4] transition-colors"
                  />
                </div>
              </div>
              <button className="px-5 py-2.5 bg-[#00C4B1] border-2 border-black text-black font-black text-xs uppercase tracking-widest hover:bg-[#00b0a0] transition-colors whitespace-nowrap">
                Shorten It
              </button>
            </div>
            {searchParams.error && (
              <p className="text-xs font-mono bg-[#FF6B6B] border-2 border-black px-3 py-2 mt-3 text-white">
                {searchParams.error}
              </p>
            )}
          </form>
        </div>

        {/* Links list */}
        <div>
          <h2 className="font-black text-base uppercase tracking-widest mb-4">Active Links</h2>

          <div className="space-y-3">
            {links?.map(link => {
              const clicks = link.clicks as any[]
              const bySource = clicks.reduce((acc: Record<string, number>, c) => {
                acc[c.source_tag] = (acc[c.source_tag] ?? 0) + 1
                return acc
              }, {})

              return (
                <div
                  key={link.id}
                  className="border-2 border-black bg-white p-4 [box-shadow:4px_4px_0px_#000] flex justify-between items-center gap-6"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <a
                        href={`${host}/${link.slug}`}
                        target="_blank"
                        className="font-black text-sm hover:underline"
                      >
                        /{link.slug}
                      </a>
                      <span className="text-xs font-black bg-[#F7C948] border-2 border-black px-1.5 py-0.5 uppercase tracking-wide">
                        Live
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        {clicks.length} {clicks.length === 1 ? 'click' : 'clicks'}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-gray-400 truncate">{link.original_url}</p>
                    {Object.keys(bySource).length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        {Object.entries(bySource)
                          .sort(([, a], [, b]) => (b as number) - (a as number))
                          .map(([src, count]) => (
                            <div key={src} className="flex items-center gap-2">
                              <span className="text-xs font-mono text-gray-500 w-16 truncate">{src}</span>
                              <div className="flex-1 h-3 bg-[#f0ece4] border-2 border-black">
                                <div
                                  className="h-full bg-black"
                                  style={{ width: `${Math.round(((count as number) / clicks.length) * 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-black w-4 text-right">{count as number}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    <span className="text-xs font-mono border-2 border-black bg-[#f0ece4] px-3 py-1.5 block text-gray-600">
                      {host}/{link.slug}?source=twitter
                    </span>
                  </div>
                </div>
              )
            })}

            {!links?.length && (
              <div className="border-2 border-black bg-white text-center py-12 [box-shadow:4px_4px_0px_#000]">
                <p className="font-mono text-sm text-gray-400">// No links yet. Create one above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
