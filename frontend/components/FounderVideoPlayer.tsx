import type { FounderVideoItem } from "@/components/FounderVideos";

export function FounderVideoPlayer({
  item,
  className = "h-full w-full object-contain",
}: {
  item: Pick<FounderVideoItem, "id" | "title" | "video_url" | "poster_url">;
  className?: string;
}) {
  const title = item.title || "Ayhan Ercan — soru ve cevap";

  return (
    <video
      className={className}
      controls
      playsInline
      preload={item.poster_url ? "none" : "metadata"}
      poster={item.poster_url ?? undefined}
      title={title}
    >
      <source src={item.video_url!} />
    </video>
  );
}
