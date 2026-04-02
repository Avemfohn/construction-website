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

  return (
    <>
      <section className="mt-16">
        <h2 className="font-display text-xl font-semibold text-anthracite-100">
          Gallery
        </h2>
        <p className="mt-2 text-xs text-anthracite-500">
          Tap an image to view full size
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: easeLux }}
          >
            <button
              type="button"
              aria-label="Close gallery"
              className="absolute inset-0 bg-navy-950/88 backdrop-blur-sm"
              onClick={close}
            />
            <div className="relative z-[1] flex max-h-[min(90vh,900px)] w-full max-w-5xl flex-col">
              <motion.div
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.72, ease: easeLux, delay: 0.08 }}
                className="relative flex w-full flex-col"
              >
                <button
                  type="button"
                  onClick={close}
                  className="absolute -right-1 -top-12 z-[2] rounded-sm border border-anthracite-600/80 bg-anthracite-950/90 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-anthracite-200 transition hover:border-gold-500/50 hover:text-gold-200 sm:right-0 sm:top-0 sm:translate-y-[-120%]"
                >
                  Close
                </button>
                {images.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Previous image"
                      onClick={() => go(-1)}
                      className="absolute left-0 top-1/2 z-[2] -translate-x-1 translate-y-[-50%] rounded-sm border border-navy-700/90 bg-anthracite-950/80 p-3 text-anthracite-200 transition hover:border-gold-500/50 hover:text-gold-200 sm:-translate-x-4"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Next image"
                      onClick={() => go(1)}
                      className="absolute right-0 top-1/2 z-[2] translate-x-1 translate-y-[-50%] rounded-sm border border-navy-700/90 bg-anthracite-950/80 p-3 text-anthracite-200 transition hover:border-gold-500/50 hover:text-gold-200 sm:translate-x-4"
                    >
                      ›
                    </button>
                  </>
                ) : null}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.62, ease: easeLux }}
                    className="w-full"
                  >
                    <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-navy-800/80 shadow-luxury">
                      <Image
                        src={active.image}
                        alt={active.caption || title}
                        fill
                        className="object-contain bg-anthracite-950"
                        sizes="100vw"
                        priority
                      />
                    </div>
                    {active.caption ? (
                      <p
                        id={labelId}
                        className="mt-4 text-center text-sm text-anthracite-300"
                      >
                        {active.caption}
                      </p>
                    ) : (
                      <span id={labelId} className="sr-only">
                        {title} — image {(openIndex ?? 0) + 1} of{" "}
                        {images.length}
                      </span>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
