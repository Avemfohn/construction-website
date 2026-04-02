import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/urban-renewal", label: "Urban renewal" },
  { href: "/media", label: "Founder's corner" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy-800/60 bg-anthracite-950/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-wide text-anthracite-100 transition hover:text-gold-300"
        >
          Development
        </Link>
        <ul className="flex flex-wrap items-center gap-6 text-xs font-medium uppercase tracking-[0.2em] text-anthracite-400">
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
