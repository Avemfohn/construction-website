import { FounderVideoPlaylist } from "@/components/FounderVideoPlaylist";
import { FounderVideoPlayer } from "@/components/FounderVideoPlayer";

export type FounderVideoItem = {
  id: number;
  title: string;
  video_url: string | null;
  poster_url: string | null;
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
      {items.length > 1 ? (
        <p className="mt-2 text-sm text-anthracite-500">
          Bir videoyu seçin; oynatıcıda izleyin.
        </p>
      ) : null}

      {items.length === 0 ? (
        <div className="mt-6 rounded-sm border border-dashed border-gold-500/30 bg-navy-950/40 px-5 py-8 text-center text-sm text-anthracite-500">
          <p>Henüz yayınlanmış video yok.</p>
        </div>
      ) : items.length === 1 ? (
        <div className="mt-8 overflow-hidden rounded-sm border border-navy-800/80 shadow-luxury">
          {items[0].title ? (
            <p className="border-b border-navy-800/80 bg-navy-950/50 px-4 py-3 text-sm font-medium text-anthracite-100">
              {items[0].title}
            </p>
          ) : null}
          <div className="aspect-video w-full bg-navy-950">
            <FounderVideoPlayer item={items[0]} />
          </div>
        </div>
      ) : (
        <FounderVideoPlaylist videos={items} />
      )}
    </section>
  );
}
