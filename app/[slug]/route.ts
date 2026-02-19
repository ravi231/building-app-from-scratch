import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = createClient()

  const { data: link } = await supabase
    .from('links')
    .select('id, original_url')
    .eq('slug', params.slug)
    .single()

  if (!link) return NextResponse.redirect(new URL('/', req.url))

  await supabase.from('clicks').insert({
    link_id: link.id,
    source_tag: req.nextUrl.searchParams.get('source') ?? 'direct',
    country: req.headers.get('x-vercel-ip-country') ?? '',
    referrer: req.headers.get('referer') ?? '',
  })

  return NextResponse.redirect(link.original_url)
}
