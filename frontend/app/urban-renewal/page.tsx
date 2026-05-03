import type { Metadata } from "next";

import { fetchJson, rewriteForBrowser } from "@/lib/api";
import { FounderVideos, type FounderVideoItem } from "@/components/FounderVideos";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata: Metadata = {
  title: "Kentsel dönüşüm",
  description:
    "Ercan İnşaat — kentsel dönüşümde güven, süreç ve yanıtlar.",
};

type FaqRow = {
  id: number;
  question: string;
  answer: string;
  section: "general" | "urban_renewal";
  sort_order: number;
};

export default async function UrbanRenewalPage() {
  const founderVideosRaw =
    (await fetchJson<FounderVideoItem[]>("/api/founder-videos/")) ?? [];
  const founderVideos: FounderVideoItem[] = founderVideosRaw.map((row) => ({
    ...row,
    video_url: rewriteForBrowser(row.video_url) ?? row.video_url,
  }));
  const urban = (await fetchJson<FaqRow[]>("/api/faqs/?section=urban_renewal")) ?? [];
  const general = (await fetchJson<FaqRow[]>("/api/faqs/?section=general")) ?? [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-950 via-anthracite-950 to-anthracite-950 px-4 pb-24 pt-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90">
          Kentsel dönüşüm
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-anthracite-50 sm:text-4xl">
          Kentsel dönüşüm
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-anthracite-400">
          Süreç, güvenlik ve sakinlerle çalışma biçimimiz hakkında soru-cevaplar.
        </p>

        <FounderVideos videos={founderVideos} />

        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold text-anthracite-100">
            Sıkça sorulan sorular
          </h2>
          <p className="mt-2 text-sm text-anthracite-500">
            Kentsel dönüşüm odağı
          </p>
          {urban.length === 0 ? (
            <p className="mt-8 rounded-sm border border-navy-800/80 bg-navy-950/30 px-4 py-6 text-sm text-anthracite-500">
              Bu bölümde henüz SSS yok. Django yönetiminden ekleyin veya örnek veri
              komutunu çalıştırın.
            </p>
          ) : (
            <FaqAccordion items={urban} className="mt-8" />
          )}
        </section>

        {general.length > 0 ? (
          <section className="mt-16">
            <h2 className="font-display text-xl font-semibold text-anthracite-100">
              Genel
            </h2>
            <FaqAccordion items={general} className="mt-8" />
          </section>
        ) : null}
      </div>
    </main>
  );
}
