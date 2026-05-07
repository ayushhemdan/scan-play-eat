import Link from "next/link";

export default function CafeNotFound() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-6xl">🍔</p>
      <h1 className="text-2xl font-black text-zinc-100">Cafe not found</h1>
      <p className="text-zinc-500 text-sm max-w-xs">
        This link doesn&apos;t match any cafe on our platform. Check the URL or scan the QR code again.
      </p>
      <Link
        href="/"
        className="mt-4 text-sm font-semibold px-5 py-2.5 rounded-full border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 transition-colors"
      >
        Go Home
      </Link>
    </main>
  );
}
