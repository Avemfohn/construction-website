import Link from "next/link";

const links = [
  { href: "/", label: "Ana sayfa" },
  { href: "/projects", label: "Projeler" },
  { href: "/urban-renewal", label: "Kentsel dönüşüm" },
  { href: "/media", label: "Ayhan Ercan" },
  { href: "/contact", label: "İletişim" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy-800/60 bg-anthracite-950/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="relative block shrink-0 transition-opacity hover:opacity-90"
          aria-label="Ercan İnşaat — ana sayfa"
        >
          <img
            src="/logo.svg"
            alt="Ercan İnşaat"
            width={300}
            height={64}
            className="h-11 w-auto max-h-12 max-w-[min(280px,58vw)] object-contain object-left sm:h-12"
            decoding="async"
            fetchPriority="high"
          />
        </Link>
        <ul className="flex flex-wrap items-center justify-end gap-4 text-xs font-medium uppercase tracking-[0.2em] text-anthracite-400 sm:gap-6">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="transition hover:text-gold-400/95"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
