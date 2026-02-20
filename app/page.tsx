import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0ece4]">
      {/* Nav */}
      <nav className="px-6 py-4 border-b-2 border-black">
        <span className="font-black text-xs tracking-[0.2em] uppercase">LinkTrack</span>
      </nav>

      {/* Hero */}
      <main className="flex flex-col items-center px-4 pt-14 pb-10">
        <div className="border-2 border-black bg-white p-10 max-w-xl w-full text-center">
          <h1 className="font-display text-7xl leading-none tracking-wide uppercase mb-5">
            Track{' '}
            <span className="bg-[#E8384F] text-white px-2 py-0.5">Every</span>
            {' '}Click
          </h1>
          <p className="font-mono text-sm text-gray-500 mb-8 leading-relaxed">
            // The no-nonsense URL shortener for people<br />who like data.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/signup"
              className="px-6 py-3 bg-[#00C4B1] border-2 border-black font-black text-sm uppercase tracking-wider hover:bg-[#00b0a0] transition-colors"
            >
              Start Tracking →
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 border-2 border-black bg-white font-black text-sm uppercase tracking-wider hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 max-w-xl w-full mt-6">
          <div className="bg-[#9B5DE5] border-2 border-black p-5">
            <p className="font-black text-xs text-white uppercase tracking-widest mb-2">
              01. Shorten
            </p>
            <div className="w-8 h-0.5 bg-white/50 mb-2" />
            <p className="text-xs text-white/75 font-mono leading-relaxed">
              Make ugly links pretty. Custom slugs included.
            </p>
          </div>
          <div className="bg-[#F7C948] border-2 border-black border-l-0 p-5">
            <p className="font-black text-xs text-black uppercase tracking-widest mb-2">
              02. Track
            </p>
            <div className="w-8 h-0.5 bg-black/30 mb-2" />
            <p className="text-xs text-black/60 font-mono leading-relaxed">
              Know the source. Add tags instantly.
            </p>
          </div>
          <div className="bg-[#FF6B6B] border-2 border-black border-l-0 p-5">
            <p className="font-black text-xs text-white uppercase tracking-widest mb-2">
              03. Analyze
            </p>
            <div className="w-8 h-0.5 bg-white/50 mb-2" />
            <p className="text-xs text-white/75 font-mono leading-relaxed">
              Real numbers. No fluff. Just data.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
