/**
 * Ayhan Ercan — YouTube soru-cevap gömüleri.
 * NEXT_PUBLIC_FOUNDER_YOUTUBE_IDS=id1,id2 (11 karakterlik video kimlikleri).
 */
export function FounderVideos() {
  const raw = process.env.NEXT_PUBLIC_FOUNDER_YOUTUBE_IDS?.trim();
  const ids =
    raw
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  return (
    <section className="mt-14">
      <h2 className="font-display text-xl font-semibold text-anthracite-100">
        Ayhan Ercan — soru &amp; cevap
      </h2>
      <p className="mt-2 text-sm text-anthracite-500">
        Kurucumuzdan video yanıtlar — kimlikleri ortam değişkeniyle ekleyin.
      </p>

      {ids.length === 0 ? (
        <div className="mt-6 rounded-sm border border-dashed border-gold-500/30 bg-navy-950/40 px-5 py-8 text-center text-sm text-anthracite-500">
          <p>
            <code className="text-gold-400/90">NEXT_PUBLIC_FOUNDER_YOUTUBE_IDS</code>{" "}
            değişkenini{" "}
            <code className="text-gold-400/90">frontend/.env.local</code>{" "}
            dosyasına ekleyin (virgülle ayrılmış YouTube video kimlikleri).
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-10">
          {ids.map((id) => (
            <li key={id}>
              <div className="overflow-hidden rounded-sm border border-navy-800/80 shadow-luxury">
                <div className="aspect-video w-full">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube.com/embed/${id}`}
                    title="Ayhan Ercan — soru ve cevap"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
