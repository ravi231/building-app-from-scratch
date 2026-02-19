import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">LinkTrack</h1>
      <p className="text-gray-500">URL attribution analytics — see which sources drive clicks</p>
      <div className="flex gap-3 mt-2">
        <Link href="/signup" className="px-5 py-2 bg-black text-white rounded-lg">Get Started</Link>
        <Link href="/login" className="px-5 py-2 border rounded-lg">Log In</Link>
      </div>
    </main>
  )
}
