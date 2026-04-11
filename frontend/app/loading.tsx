/** Shown during route transitions while Server Components resolve (dev feels slow without this). */
export default function Loading() {
  return (
    <div className="flex min-h-[40dvh] flex-col items-center justify-center gap-3 bg-gradient-to-b from-navy-950 via-anthracite-950 to-anthracite-950 px-4">
      <div
        className="h-9 w-9 animate-spin rounded-full border-2 border-gold-500/20 border-t-gold-400/80"
        aria-hidden
      />
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-anthracite-500">
        Yükleniyor
      </p>
    </div>
  );
}
