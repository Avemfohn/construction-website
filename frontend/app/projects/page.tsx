import type { Metadata } from "next";
import Link from "next/link";

import { fetchJson } from "@/lib/api";

export const metadata: Metadata = {
  title: "Projeler",
  description: "Ercan İnşaat — devam eden ve tamamlanan projeler",
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

export default async function ProjectsPage() {
  const all = await fetchJson<ProjectRow[]>("/api/projects/");

  const ongoing =
    all?.filter((p) => p.status === "ongoing") ?? [];
  const completed =
    all?.filter((p) => p.status === "completed") ?? [];

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
          Devam eden ve tamamlanan çalışmalarımızdan bir seçki. Ayrıntılar ve
          görseller için tıklayın.
        </p>

        {!all?.length ? (
          <p className="mt-12 rounded-sm border border-navy-800/80 bg-navy-950/40 px-6 py-8 text-sm text-anthracite-400">
            API’den proje dönmedi. Django arka ucunu çalıştırın ve veri olduğundan
            emin olun (örneğin{" "}
            <code className="text-gold-400/90">manage.py seed_demo_data</code>
            ).
          </p>
        ) : (
          <div className="mt-14 space-y-16">
            <ProjectSection
              title="Devam eden"
              emptyMessage="Henüz devam eden proje yok."
              projects={ongoing}
            />
            <ProjectSection
              title="Tamamlanan"
              emptyMessage="Henüz tamamlanan proje yok."
              projects={completed}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function ProjectSection({
  title,
  emptyMessage,
  projects,
}: {
  title: string;
  emptyMessage: string;
  projects: ProjectRow[];
}) {
  return (
    <section>
      <h2 className="border-b border-gold-500/25 pb-2 font-display text-xl font-semibold text-anthracite-100">
        {title}
      </h2>
      {projects.length === 0 ? (
        <p className="mt-4 text-sm text-anthracite-500">{emptyMessage}</p>
      ) : (
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
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
                <h3 className="mt-2 font-display text-lg font-semibold text-anthracite-50 group-hover:text-gold-200">
                  {p.title}
                </h3>
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
      )}
    </section>
  );
}
