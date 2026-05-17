import { rewriteForBrowser } from "@/lib/api";

import { UpdateMediaGallery } from "@/components/UpdateMediaGallery";

export type ProjectUpdateMedia = {
  id: number;
  kind: "image" | "video";
  url: string;
  poster_url: string | null;
  caption: string;
  sort_order: number;
};

export type ProjectUpdate = {
  id: number;
  title: string;
  body: string;
  published_at: string;
  media: ProjectUpdateMedia[];
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

export function ProjectUpdateTimeline({
  updates,
  projectStatus,
}: {
  updates: ProjectUpdate[];
  projectStatus: string;
}) {
  const items = updates.map((row) => ({
    ...row,
    media: row.media.map((m) => ({
      ...m,
      url: rewriteForBrowser(m.url) ?? m.url,
      poster_url: m.poster_url
        ? (rewriteForBrowser(m.poster_url) ?? m.poster_url)
        : m.poster_url,
    })),
  }));

  if (items.length === 0) {
    if (projectStatus !== "ongoing") return null;
    return (
      <section className="mt-16 border-t border-navy-800/60 pt-12">
        <h2 className="font-display text-xl font-semibold text-anthracite-50 sm:text-2xl">
          Şantiye güncellemeleri
        </h2>
        <p className="mt-4 rounded-sm border border-navy-800/80 bg-navy-950/30 px-4 py-6 text-sm text-anthracite-500">
          Henüz güncelleme yok.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-16 border-t border-navy-800/60 pt-12">
      <h2 className="font-display text-xl font-semibold text-anthracite-50 sm:text-2xl">
        Şantiye güncellemeleri
      </h2>
      <ul className="mt-10 space-y-12">
        {items.map((update) => (
          <li
            key={update.id}
            className="overflow-hidden rounded-sm border border-navy-800/80 bg-anthracite-900/20 shadow-luxury"
          >
            <div className="p-6 sm:p-8">
              <time
                className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500/80"
                dateTime={update.published_at}
              >
                {formatDate(update.published_at)}
              </time>
              <h3 className="mt-3 font-display text-xl font-semibold text-anthracite-50">
                {update.title}
              </h3>
              {update.body ? (
                <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-anthracite-400">
                  {update.body}
                </div>
              ) : null}
            </div>
            <UpdateMediaGallery media={update.media} title={update.title} />
          </li>
        ))}
      </ul>
    </section>
  );
}
