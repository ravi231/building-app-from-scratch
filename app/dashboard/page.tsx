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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black text-white text-xs font-bold flex items-center justify-center select-none">
              LT
            </div>
            <span className="font-semibold text-gray-900">LinkTrack</span>
          </div>
          <form action={logout}>
            <button className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100">
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Create link section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Create a new link</h2>
          <form action={createLink} className="flex gap-2">
            <input
              name="url"
              type="url"
              placeholder="https://destination-url.com"
              required
              className="flex-1 border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors"
            />
            <input
              name="slug"
              placeholder="my-slug"
              required
              className="border border-gray-200 px-3 py-2 rounded-lg text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-colors w-32"
            />
            <button className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap">
              Create
            </button>
          </form>
          {searchParams.error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-3">
              {searchParams.error}
            </p>
          )}
          <p className="text-xs text-gray-400 mt-3">
            Share as <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">{host}/[slug]?source=twitter</code> to track clicks by source.
          </p>
        </div>

        {/* Links list */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Your links {links?.length ? `(${links.length})` : ''}
          </h2>

          <div className="space-y-3">
            {links?.map(link => {
              const clicks = link.clicks as any[]
              const bySource = clicks.reduce((acc: Record<string, number>, c) => {
                acc[c.source_tag] = (acc[c.source_tag] ?? 0) + 1
                return acc
              }, {})

              return (
                <div key={link.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <a
                        href={`${host}/${link.slug}`}
                        target="_blank"
                        className="font-mono text-sm font-semibold text-gray-900 hover:underline"
                      >
                        /{link.slug}
                      </a>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{link.original_url}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                      {clicks.length} {clicks.length === 1 ? 'click' : 'clicks'}
                    </span>
                  </div>
                  {Object.keys(bySource).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                      {Object.entries(bySource).map(([src, count]) => (
                        <span
                          key={src}
                          className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {src}: <span className="font-medium">{count as number}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {!links?.length && (
              <div className="bg-white rounded-xl border border-gray-200 border-dashed text-center py-12">
                <p className="text-gray-400 text-sm">No links yet. Create your first one above.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
