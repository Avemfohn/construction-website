"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const links = [
  { href: "/", label: "Ana sayfa" },
  { href: "/projects", label: "Projeler" },
  { href: "/urban-renewal", label: "Kentsel dönüşüm" },
  { href: "/media", label: "Ayhan Ercan" },
  { href: "/contact", label: "İletişim" },
] as const;

const easeMenu = [0.22, 1, 0.36, 1] as const;
const easeOutFast = [0.4, 0, 0.2, 1] as const;

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [animatingHref, setAnimatingHref] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [introTarget, setIntroTarget] = useState({ x: 0, y: 0, scale: 0.24 });

  const menuId = useId();
  const animTimeoutRef = useRef<number | null>(null);
  const logoAnchorRef = useRef<HTMLImageElement | null>(null);

  const triggerBuildAnim = (href: string) => {
    setAnimatingHref(href);
    if (animTimeoutRef.current) window.clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = window.setTimeout(() => {
      setAnimatingHref((current) => (current === href ? null : current));
      animTimeoutRef.current = null;
    }, 700);
  };

  useEffect(() => {
    setOpen(false);
    document.body.style.removeProperty("overflow");
    setAnimatingHref(null);
  }, [pathname]);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(
    () => () => {
      if (animTimeoutRef.current) window.clearTimeout(animTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    const key = "site_logo_intro_seen_v1";
    if (sessionStorage.getItem(key) === "1") {
      setShowIntro(false);
      return;
    }

    const measure = () => {
      const anchor = logoAnchorRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      const targetX = anchor.left + anchor.width / 2;
      const targetY = anchor.top + anchor.height / 2;
      const startWidth = Math.min(window.innerWidth * 0.75, 520);
      const targetScale = Math.max(0.16, Math.min(0.55, anchor.width / startWidth));
      setIntroTarget({
        x: targetX - startX,
        y: targetY - startY,
        scale: targetScale,
      });
    };

    const raf = window.requestAnimationFrame(measure);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!showIntro) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showIntro]);

  return (
    <header className="sticky top-0 z-50 supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <nav
        className="relative z-[2] mx-auto max-w-5xl px-4 pb-2 pt-3 sm:px-6"
        aria-label="Ana navigasyon"
      >
        <div
          className={`relative overflow-hidden px-3 py-1.5 transition-all duration-400 sm:px-4 ${
            scrolled
              ? "rounded-full border border-gold-500/35 bg-anthracite-950/86 shadow-[0_10px_26px_rgba(3,7,18,0.48)] backdrop-blur-md"
              : "rounded-full border border-white/10 bg-anthracite-950/38 shadow-[0_6px_18px_rgba(2,6,16,0.3)] backdrop-blur-sm"
          }`}
        >
          <div
            className={`relative flex items-center justify-between gap-4 transition-all duration-400 ${
              scrolled ? "min-h-[3.2rem]" : "min-h-[4.1rem]"
            }`}
          >
            <Link
              href="/"
              className={`flex min-w-0 shrink items-center transition-all duration-400 hover:opacity-90 ${
                scrolled ? "h-11" : "h-14"
              }`}
              aria-label="Ercan İnşaat — ana sayfa"
              onClick={() => setOpen(false)}
            >
              <img
                ref={logoAnchorRef}
                src="/logo.png"
                alt="Ercan İnşaat"
                width={300}
                height={64}
                className={`w-auto object-contain transition-all duration-400 ${
                  scrolled
                    ? "h-11 max-h-11 max-w-[min(250px,62vw)] sm:h-12 sm:max-h-12 lg:h-12 lg:max-h-12 lg:max-w-[min(290px,44vw)]"
                    : "h-14 max-h-14 max-w-[min(320px,74vw)] sm:h-16 sm:max-h-16 lg:h-[4.35rem] lg:max-h-[4.35rem] lg:max-w-[min(410px,52vw)]"
                }`}
                decoding="async"
                fetchPriority="high"
              />
            </Link>

            <ul
              className={`hidden flex-1 items-center justify-end gap-1 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors lg:flex xl:gap-2 ${
                scrolled ? "text-anthracite-100" : "text-anthracite-200"
              }`}
            >
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`relative block rounded-full px-3 py-2 transition xl:px-4 ${
                      scrolled
                        ? "hover:bg-gold-500/14 hover:text-gold-200"
                        : "hover:bg-white/8 hover:text-gold-200"
                    }`}
                    onClick={() => triggerBuildAnim(href)}
                  >
                    {label}
                    <AnimatePresence>
                      {animatingHref === href ? <BuildPulse /> : null}
                    </AnimatePresence>
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`flex h-11 min-w-11 shrink-0 items-center justify-center rounded-full border transition lg:hidden ${
                scrolled
                  ? "border-gold-500/45 bg-navy-950/80 text-anthracite-100 hover:border-gold-300/70 hover:text-gold-200"
                  : "border-gold-500/35 bg-navy-950/80 text-anthracite-100 hover:border-gold-400/60 hover:text-gold-200"
              }`}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {showIntro ? (
          <motion.div
            key="logo-intro-overlay"
            className="fixed inset-0 z-[90] flex items-center justify-center bg-anthracite-950"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <motion.div
              initial={{ x: 0, y: 0, scale: 1 }}
              animate={{
                x: [0, 0, 0, introTarget.x],
                y: [0, 0, 0, introTarget.y],
                scale: [1, 1.1, 1.1, introTarget.scale],
              }}
              transition={{
                duration: 1.85,
                times: [0, 0.32, 0.6, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              onAnimationComplete={() => {
                sessionStorage.setItem("site_logo_intro_seen_v1", "1");
                setShowIntro(false);
              }}
            >
              <img
                src="/logo.png"
                alt="Ercan İnşaat intro"
                className="h-auto w-[min(76vw,520px)] object-contain"
              />
            </motion.div>
          </motion.div>
        ) : null}

        {open ? (
          <>
            <motion.button
              key="mobile-nav-backdrop"
              type="button"
              aria-label="Menüyü kapat"
              className="fixed inset-0 z-0 bg-navy-950/65 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.1, ease: easeOutFast },
              }}
              transition={{ duration: 0.22, ease: easeMenu }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              key="mobile-nav-panel"
              id={menuId}
              className={`relative z-[1] overflow-hidden border-t shadow-luxury backdrop-blur-lg lg:hidden ${
                scrolled
                  ? "border-anthracite-700/20 bg-anthracite-950/95"
                  : "border-navy-800/70 bg-anthracite-950/98"
              }`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -12,
                transition: { duration: 0.16, ease: easeOutFast },
              }}
              transition={{ duration: 0.36, ease: easeMenu }}
              style={{
                paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
              }}
            >
              <ul className="mx-auto max-h-[min(70dvh,28rem)] max-w-6xl divide-y divide-navy-800/50 overflow-y-auto overscroll-contain px-4 py-1 sm:px-6">
                {links.map(({ href, label }, i) => (
                  <motion.li
                    key={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.26,
                      delay: 0.04 + i * 0.04,
                      ease: easeMenu,
                    }}
                  >
                    <Link
                      href={href}
                      className="block min-h-[2.75rem] py-3 text-sm font-medium uppercase tracking-[0.2em] text-anthracite-200 transition hover:text-gold-400/95 active:bg-navy-900/50"
                      onClick={() => {
                        triggerBuildAnim(href);
                        setOpen(false);
                      }}
                    >
                      {label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function BuildPulse() {
  return (
    <motion.span
      className="pointer-events-none absolute -right-1 -top-4 flex h-4 items-end gap-[2px]"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -2 }}
    >
      <motion.span
        className="block w-[3px] rounded-sm bg-gold-300/95"
        initial={{ height: 0 }}
        animate={{ height: 8 }}
        transition={{ duration: 0.25, delay: 0.02 }}
      />
      <motion.span
        className="block w-[3px] rounded-sm bg-gold-400/95"
        initial={{ height: 0 }}
        animate={{ height: 13 }}
        transition={{ duration: 0.25, delay: 0.08 }}
      />
      <motion.span
        className="block w-[3px] rounded-sm bg-gold-500/95"
        initial={{ height: 0 }}
        animate={{ height: 10 }}
        transition={{ duration: 0.25, delay: 0.14 }}
      />
    </motion.span>
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
