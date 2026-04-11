import type { Metadata } from "next";
import Image from "next/image";

import { fetchJson } from "@/lib/api";

export const metadata: Metadata = {
  title: "Ayhan Ercan — medya",
  description:
    "Ercan İnşaat — Ayhan Ercan’dan şantiye notları, tebrikler ve duyurular.",
};

type Announcement = {
  id: number;
  title: string;
  body: string;
  image: string | null;
  published_at: string;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function MediaPage() {
  const items = (await fetchJson<Announcement[]>("/api/announcements/")) ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-950 via-anthracite-950 to-anthracite-950 px-4 pb-24 pt-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90">
          Ercan İnşaat
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-anthracite-50 sm:text-4xl">
          Ayhan Ercan
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-anthracite-400">
          Şantiyeden notlar, tebrikler ve duyurular — kurucumuz Ayhan
          Ercan&apos;dan.
        </p>

        {items.length === 0 ? (
          <p className="mt-12 rounded-sm border border-navy-800/80 bg-navy-950/30 px-4 py-6 text-sm text-anthracite-500">
            Henüz duyuru yok. Django yönetiminden veya API üzerinden ekleyebilirsiniz.
          </p>
        ) : (
          <ul className="mt-12 space-y-12">
            {items.map((post) => (
              <li
                key={post.id}
                className="overflow-hidden rounded-sm border border-navy-800/80 bg-anthracite-900/20 shadow-luxury"
              >
                {post.image ? (
                  <div className="flex w-full max-w-full justify-center overflow-hidden bg-anthracite-950/50">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={1600}
                      height={1200}
                      sizes="(max-width: 768px) 100vw, min(48rem, 100vw)"
                      className="h-auto w-full max-h-[min(85vh,1100px)] object-contain"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                ) : null}
                <div className="p-6 sm:p-8">
                  <time
                    className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500/80"
                    dateTime={post.published_at}
                  >
                    {formatDate(post.published_at)}
                  </time>
                  <h2 className="mt-3 font-display text-xl font-semibold text-anthracite-50">
                    {post.title}
                  </h2>
                  {post.body ? (
                    <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-anthracite-400">
                      {post.body}
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
