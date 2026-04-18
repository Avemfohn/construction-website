"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useState } from "react";

export type GalleryImage = {
  id: number;
  image: string;
  caption: string;
};

const easeLux = [0.22, 1, 0.36, 1] as const;

export function ProjectGallery({
  title,
  images,
}: {
  title: string;
  images: GalleryImage[];
}) {
  const labelId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setOpenIndex((i) => {
        if (i === null) return null;
        const next = i + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [openIndex, close, go]);

  if (images.length === 0) return null;

  const active =
    openIndex !== null ? images[openIndex] ?? null : null;
  const isOpen = openIndex !== null && active !== null;
  const n = images.length;
  const idx = openIndex ?? 0;

  return (
    <>
      <section className="mt-16">
        <h2 className="font-display text-xl font-semibold text-anthracite-100">
          Galeri
        </h2>
        <p className="mt-2 text-xs text-anthracite-500">
          Tam boyut için görsele tıklayın
        </p>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {images.map((img, index) => (
            <li
              key={img.id}
              className="overflow-hidden rounded-sm border border-navy-800/80 bg-anthracite-900/20 transition hover:border-gold-500/30"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
                aria-haspopup="dialog"
                aria-expanded={openIndex === index}
                aria-controls={labelId}
              >
                <div className="relative aspect-video w-full cursor-zoom-in">
                  <Image
                    src={img.image}
                    alt={img.caption || title}
                    fill
                    className="object-cover transition duration-500 ease-out group-hover:scale-[1.02] group-hover:brightness-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/20" />
                </div>
                {img.caption ? (
                  <p className="px-3 py-2 text-xs text-anthracite-500 group-hover:text-anthracite-400">
                    {img.caption}
                  </p>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <AnimatePresence>
        {isOpen && active ? (
          <motion.div
            key="lightbox"
            className="fixed inset-0 z-[100] flex flex-col bg-navy-950"
            style={{
              paddingTop: "max(0.5rem, env(safe-area-inset-top, 0px))",
              paddingBottom: "max(0.25rem, env(safe-area-inset-bottom, 0px))",
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: easeLux }}
          >
            <button
              type="button"
              aria-label="Galeriyi kapat"
              className="absolute inset-0 z-0 bg-navy-950/90 backdrop-blur-[1px]"
              onClick={close}
            />

            <div className="relative z-[2] flex shrink-0 items-center justify-between gap-3 px-3 sm:px-5">
              <p className="min-w-0 text-xs font-medium uppercase tracking-[0.2em] text-anthracite-500">
                {n > 1 ? (
                  <>
                    {idx + 1} / {n}
                  </>
                ) : (
                  <span className="text-anthracite-600">Galeri</span>
                )}
              </p>
              <button
                type="button"
                onClick={close}
                className="min-h-11 min-w-[5.5rem] shrink-0 rounded-sm border border-anthracite-600/80 bg-anthracite-950/95 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-anthracite-100 shadow-luxury transition hover:border-gold-500/50 hover:text-gold-200"
              >
                Kapat
              </button>
            </div>

            <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-center justify-center px-2 py-2 sm:px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.28, ease: easeLux }}
                  className="flex w-full max-w-5xl flex-col items-center"
                >
                  <div className="relative aspect-video w-full max-h-[min(58dvh,calc(100dvh-13rem))] overflow-hidden rounded-sm border border-navy-800/80 bg-anthracite-950 shadow-luxury sm:max-h-[min(68dvh,calc(100dvh-12rem))]">
                    <Image
                      src={active.image}
                      alt={active.caption || title}
                      fill
                      className="object-contain"
                      sizes="100vw"
                      priority
                    />
                  </div>

                  {active.caption ? (
                    <p
                      id={labelId}
                      className="mt-3 max-h-24 w-full overflow-y-auto px-2 text-center text-sm leading-snug text-anthracite-300 sm:mt-4"
                    >
                      {active.caption}
                    </p>
                  ) : (
                    <span id={labelId} className="sr-only">
                      {title} — görsel {idx + 1} / {n}
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {n > 1 ? (
              <div className="relative z-[2] flex shrink-0 items-center justify-center gap-4 px-4 pb-3 pt-1 sm:gap-6 sm:pb-4">
                <button
                  type="button"
                  aria-label="Önceki görsel"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="flex min-h-12 min-w-[3.25rem] items-center justify-center rounded-sm border border-navy-600/90 bg-anthracite-900/95 text-xl leading-none text-anthracite-100 shadow-luxury transition hover:border-gold-500/45 hover:text-gold-200 active:scale-[0.98]"
                >
                  ‹
                </button>
                <button
                  type="button"
                  aria-label="Sonraki görsel"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="flex min-h-12 min-w-[3.25rem] items-center justify-center rounded-sm border border-navy-600/90 bg-anthracite-900/95 text-xl leading-none text-anthracite-100 shadow-luxury transition hover:border-gold-500/45 hover:text-gold-200 active:scale-[0.98]"
                >
                  ›
                </button>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
