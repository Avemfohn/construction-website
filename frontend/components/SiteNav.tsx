"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";

const links = [
  { href: "/", label: "Ana sayfa" },
  { href: "/projects", label: "Projeler" },
  { href: "/urban-renewal", label: "Kentsel dönüşüm" },
  { href: "/media", label: "Ayhan Ercan" },
  { href: "/contact", label: "İletişim" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-navy-800/60 bg-anthracite-950/90 backdrop-blur-md supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <nav
        className="relative z-[2] mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6"
        aria-label="Ana navigasyon"
      >
        <Link
          href="/"
          className="min-w-0 shrink py-1 transition-opacity hover:opacity-90"
          aria-label="Ercan İnşaat — ana sayfa"
          onClick={() => setOpen(false)}
        >
          <img
            src="/logo.svg"
            alt="Ercan İnşaat"
            width={300}
            height={64}
            className="h-9 w-auto max-h-10 max-w-[min(220px,50vw)] object-contain object-left sm:h-10 lg:h-12 lg:max-h-12 lg:max-w-[min(280px,55vw)]"
            decoding="async"
            fetchPriority="high"
          />
        </Link>

        <button
          type="button"
          className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-sm border border-navy-700/80 bg-navy-950/50 text-anthracite-200 transition hover:border-gold-500/40 hover:text-gold-200 lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>

        <ul className="hidden min-w-0 items-center justify-end gap-5 text-xs font-medium uppercase tracking-[0.18em] text-anthracite-400 lg:flex xl:gap-7">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="block py-2 transition hover:text-gold-400/95"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="fixed inset-0 z-0 bg-navy-950/65 backdrop-blur-[2px] lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            id={menuId}
            className="relative z-[1] border-t border-navy-800/70 bg-anthracite-950/98 shadow-luxury backdrop-blur-lg lg:hidden"
            style={{
              paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
            }}
          >
            <ul className="mx-auto max-h-[min(70dvh,28rem)] max-w-6xl divide-y divide-navy-800/50 overflow-y-auto overscroll-contain px-4 py-1 sm:px-6">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block min-h-[2.75rem] py-3 text-sm font-medium uppercase tracking-[0.2em] text-anthracite-200 transition hover:text-gold-400/95 active:bg-navy-900/50"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
