"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useState } from "react";

import type { ProjectUpdateMedia } from "@/components/ProjectUpdateTimeline";

const easeLux = [0.22, 1, 0.36, 1] as const;

export function UpdateMediaGallery({
  media,
  title,
}: {
  media: ProjectUpdateMedia[];
  title: string;
}) {
  const labelId = useId();
  const [openImageIndex, setOpenImageIndex] = useState<number | null>(null);

  const sorted = useMemo(
    () => [...media].sort((a, b) => a.sort_order - b.sort_order),
    [media],
  );

  const images = useMemo(
    () => sorted.filter((m): m is ProjectUpdateMedia & { kind: "image" } => m.kind === "image"),
    [sorted],
  );

  const close = useCallback(() => setOpenImageIndex(null), []);

  const go = useCallback(
    (dir: -1 | 1) => {
      setOpenImageIndex((i) => {
        if (i === null) return null;
        const next = i + dir;
        if (next < 0) return images.length - 1;
        if (next >= images.length) return 0;
        return next;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (openImageIndex === null) return;
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
  }, [openImageIndex, close, go]);

  if (sorted.length === 0) return null;

  const activeImage =
    openImageIndex !== null ? images[openImageIndex] ?? null : null;
  const lightboxOpen = openImageIndex !== null && activeImage !== null;
  const imageCount = images.length;

  let imageSlot = 0;

  return (
    <>
      <div className="border-t border-navy-800/60 px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
        <p className="text-xs text-anthracite-500">
          Tam boyut için görsele tıklayın
        </p>
        <ul className="mt-4 grid gap-6 sm:grid-cols-2">
          {sorted.map((item) => {
            if (item.kind === "video") {
              return (
                <li
                  key={item.id}
                  className="overflow-hidden rounded-sm border border-navy-800/80 bg-anthracite-900/20"
                >
                  <div className="relative aspect-[4/3] w-full bg-anthracite-950 sm:aspect-[3/2]">
                    <video
                      className="h-full w-full object-contain"
                      controls
                      playsInline
                      preload="metadata"
                      title={item.caption || title}
                    >
                      <source src={item.url} type="video/mp4" />
                    </video>
                  </div>
                  {item.caption ? (
                    <p className="px-3 py-2 text-xs text-anthracite-500">
                      {item.caption}
                    </p>
                  ) : null}
                </li>
              );
            }

            const index = imageSlot;
            imageSlot += 1;

            return (
              <li
                key={item.id}
                className="overflow-hidden rounded-sm border border-navy-800/80 bg-anthracite-900/20 transition hover:border-gold-500/30"
              >
                <button
                  type="button"
                  onClick={() => setOpenImageIndex(index)}
                  className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/60"
                  aria-haspopup="dialog"
                  aria-expanded={openImageIndex === index}
                  aria-controls={labelId}
                >
                  <div className="relative aspect-[4/3] w-full cursor-zoom-in bg-anthracite-950 sm:aspect-[3/2]">
                    <Image
                      src={item.url}
                      alt={item.caption || title}
                      fill
                      className="object-contain object-center transition duration-500 ease-out group-hover:scale-[1.01] group-hover:brightness-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <span className="pointer-events-none absolute inset-0 bg-navy-950/0 transition group-hover:bg-navy-950/20" />
                  </div>
                  {item.caption ? (
                    <p className="px-3 py-2 text-xs text-anthracite-500 group-hover:text-anthracite-400">
                      {item.caption}
                    </p>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <AnimatePresence>
        {lightboxOpen && activeImage ? (
          <motion.div
            key="update-lightbox"
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
                {imageCount > 1 ? (
                  <>
                    {(openImageIndex ?? 0) + 1} / {imageCount}
                  </>
                ) : (
                  <span className="text-anthracite-600">Görsel</span>
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
                  key={activeImage.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.28, ease: easeLux }}
                  className="flex w-full max-w-5xl flex-col items-center"
                >
                  <LightboxImage
                    src={activeImage.url}
                    alt={activeImage.caption || title}
                    labelId={labelId}
                    idx={openImageIndex ?? 0}
                    n={imageCount}
                    title={title}
                    caption={activeImage.caption}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {imageCount > 1 ? (
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

function LightboxImage({
  src,
  alt,
  labelId,
  idx,
  n,
  title,
  caption,
}: {
  src: string;
  alt: string;
  labelId: string;
  idx: number;
  n: number;
  title: string;
  caption: string;
}) {
  return (
    <>
      <div className="relative h-[min(72dvh,calc(100dvh-13rem))] w-full max-w-5xl overflow-hidden rounded-sm border border-navy-800/80 bg-anthracite-950 shadow-luxury sm:h-[min(76dvh,calc(100dvh-12rem))]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center"
          sizes="100vw"
          priority
        />
      </div>
      {caption ? (
        <p
          id={labelId}
          className="mt-3 max-h-24 w-full overflow-y-auto px-2 text-center text-sm leading-snug text-anthracite-300 sm:mt-4"
        >
          {caption}
        </p>
      ) : (
        <span id={labelId} className="sr-only">
          {title} — görsel {idx + 1} / {n}
        </span>
      )}
    </>
  );
}
