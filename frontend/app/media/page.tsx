import type { Metadata } from "next";
import Image from "next/image";

import { fetchJson } from "@/lib/api";

export const metadata: Metadata = {
  title: "Founder's corner",
  description: "Site visits, greetings, and updates",
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
    return new Date(iso).toLocaleDateString("en-GB", {
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
          Media &amp; updates
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-anthracite-50 sm:text-4xl">
          The Founder&apos;s Corner
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-anthracite-400">
          Site visits, holiday greetings, and announcements — straight from the
          field.
        </p>

        {items.length === 0 ? (
          <p className="mt-12 rounded-sm border border-navy-800/80 bg-navy-950/30 px-4 py-6 text-sm text-anthracite-500">
            No announcements yet. Create them in Django admin or via the API.
          </p>
        ) : (
          <ul className="mt-12 space-y-12">
            {items.map((post) => (
              <li
                key={post.id}
                className="overflow-hidden rounded-sm border border-navy-800/80 bg-anthracite-900/20 shadow-luxury"
              >
                {post.image ? (
                  <div className="relative aspect-[16/10] w-full sm:aspect-video">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 48rem"
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
