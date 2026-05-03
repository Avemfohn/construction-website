import type { Metadata } from "next";
import Link from "next/link";

import { fetchJson } from "@/lib/api";

export const metadata: Metadata = {
  title: "Projeler",
  description: "Ercan İnşaat — projeler",
  alternates: { canonical: "/projects" },
};

type ProjectRow = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  status: "ongoing" | "completed";
  location: string;
  featured: boolean;
};

/** Şimdilik yalnızca devam eden projeler listelenir; tamamlananlar arka planda duruyor. */
export default async function ProjectsPage() {
  const all = await fetchJson<ProjectRow[]>("/api/projects/");
  const ongoing =
    all?.filter((p) => p.status === "ongoing") ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-950 via-anthracite-950 to-anthracite-950 px-4 pb-20 pt-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90">
          Portföy
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-anthracite-50 sm:text-4xl">
          Projeler
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-anthracite-400">
          Çalışmalarımızdan bir seçki. Ayrıntılar ve görseller için tıklayın.
        </p>

        {ongoing.length > 0 ? (
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ongoing.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="group block rounded-sm border border-navy-800/80 bg-anthracite-900/30 p-6 shadow-luxury transition hover:border-gold-500/35 hover:bg-navy-950/40"
                >
                  {p.featured ? (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold-400">
                      Öne çıkan
                    </span>
                  ) : null}
                  <h2 className="mt-2 font-display text-lg font-semibold text-anthracite-50 group-hover:text-gold-200">
                    {p.title}
                  </h2>
                  {p.location ? (
                    <p className="mt-2 text-xs text-anthracite-500">{p.location}</p>
                  ) : null}
                  {p.summary ? (
                    <p className="mt-3 text-sm leading-relaxed text-anthracite-400 line-clamp-3">
                      {p.summary}
                    </p>
                  ) : null}
                  <span className="mt-4 inline-block text-xs font-medium uppercase tracking-widest text-gold-500/90">
                    Projeyi görüntüle →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-14 rounded-sm border border-navy-800/80 bg-navy-950/40 px-8 py-14 text-center shadow-luxury">
            <p className="font-display text-lg font-medium text-anthracite-200">
              Yakında yüklenecek
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-anthracite-500">
              Projelerimiz bu sayfada çok yakında yer alacak. Güncel haberler için
              bizimle iletişime geçebilirsiniz.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-sm border border-gold-500/45 bg-gold-600/10 px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-gold-200 transition hover:border-gold-400 hover:bg-gold-500/15"
            >
              İletişim
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
