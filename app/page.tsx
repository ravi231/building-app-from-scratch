import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-black text-white text-xl font-bold select-none">
        LT
      </div>
      <h1 className="text-5xl font-bold tracking-tight mb-3">LinkTrack</h1>
      <p className="text-gray-500 text-lg max-w-md mb-8 leading-relaxed">
        Create short links with source tracking. See exactly which channels drive your clicks.
      </p>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="px-6 py-2.5 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Log In
        </Link>
      </div>
      <div className="mt-16 flex gap-8 text-sm text-gray-400">
        <span>Custom slugs</span>
        <span>·</span>
        <span>Source tracking</span>
        <span>·</span>
        <span>Click analytics</span>
      </div>
    </main>
  )
}
