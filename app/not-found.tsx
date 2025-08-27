import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-[var(--muted)] mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/">
          <button className="
            px-6 py-3 rounded-lg
            bg-[var(--primary)] hover:bg-[var(--primary-hover)]
            text-white font-medium
            transition-colors duration-200
          ">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  )
}