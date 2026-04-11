export type FounderVideoItem = {
  id: number;
  title: string;
  video_url: string | null;
  sort_order: number;
};

/**
 * Lists videos uploaded in Django admin (backend → Cloudinary).
 * This component only reads `GET /api/founder-videos/` and renders players.
 */
export function FounderVideos({ videos }: { videos: FounderVideoItem[] }) {
  const items = videos.filter((v) => v.video_url);

  return (
    <section className="mt-14">
      <h2 className="font-display text-xl font-semibold text-anthracite-100">
        Ayhan Ercan — soru &amp; cevap
      </h2>
      <p className="mt-2 text-sm text-anthracite-500">
        Kurucumuzdan video yanıtlar. Yükleme yalnızca yönetim panelinde (arka uç);
        bu sayfa kayıtları API ile okur ve oynatır.
      </p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-sm border border-dashed border-gold-500/30 bg-navy-950/40 px-5 py-8 text-center text-sm text-anthracite-500">
          <p>
            Henüz yayınlanmış video yok.{" "}
            <span className="text-anthracite-400">
              Yönetim panelinde &quot;Founder videos&quot; bölümünden video ekleyin;
              Cloudinary anahtarlarının backend ortamında tanımlı olduğundan emin olun.
            </span>
          </p>
        </div>
      ) : (
        <ul className="mt-8 space-y-10">
          {items.map((row) => (
            <li key={row.id}>
              {row.title ? (
                <p className="mb-2 text-sm font-medium text-anthracite-200">
                  {row.title}
                </p>
              ) : null}
              <div className="overflow-hidden rounded-sm border border-navy-800/80 shadow-luxury">
                <div className="aspect-video w-full max-w-full bg-navy-950">
                  <video
                    className="h-full w-full max-w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                    title={row.title || "Ayhan Ercan — soru ve cevap"}
                  >
                    <source src={row.video_url!} />
                  </video>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
