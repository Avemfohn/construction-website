import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-center bg-gradient-to-b from-navy-950 via-anthracite-950 to-anthracite-950 px-6 py-20 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90">
        404
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-anthracite-50 sm:text-4xl">
        Sayfa bulunamadı
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-anthracite-400">
        Aradığınız adres taşınmış veya silinmiş olabilir. Ana sayfadan
        devam edebilirsiniz.
      </p>
      <Link
        href="/"
        className="mt-10 rounded-sm border border-gold-500/50 bg-gold-600/10 px-8 py-3 text-sm font-medium text-gold-100 shadow-luxury backdrop-blur-sm transition hover:border-gold-400 hover:bg-gold-500/15"
      >
        Ana sayfaya dön
      </Link>
    </main>
  );
}
