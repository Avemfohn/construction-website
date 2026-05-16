"use client";

import { useState } from "react";

import { FounderVideoPlayer } from "@/components/FounderVideoPlayer";
import type { FounderVideoItem } from "@/components/FounderVideos";

export function FounderVideoPlaylist({ videos }: { videos: FounderVideoItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = videos[activeIndex];

  return (
    <div className="mt-8">
      <div className="overflow-hidden rounded-sm border border-navy-800/80 shadow-luxury">
        <div className="aspect-video w-full bg-navy-950">
          <FounderVideoPlayer key={active.id} item={active} />
        </div>
        {active.title ? (
          <p className="border-t border-navy-800/80 bg-navy-950/50 px-4 py-3 text-sm font-medium text-anthracite-100">
            {active.title}
          </p>
        ) : null}
      </div>

      <nav className="mt-4" aria-label="Soru ve cevap videoları">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-anthracite-500">
          Tüm videolar ({videos.length})
        </p>
        <ol className="mt-3 max-h-64 space-y-1 overflow-y-auto rounded-sm border border-navy-800/80 bg-navy-950/30 p-1.5 sm:max-h-72">
          {videos.map((row, index) => {
            const isActive = index === activeIndex;
            const label = row.title?.trim() || `Video ${index + 1}`;

            return (
              <li key={row.id}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex w-full items-start gap-3 rounded-sm px-3 py-2.5 text-left text-sm transition ${
                    isActive
                      ? "bg-gold-600/15 text-anthracite-50 ring-1 ring-inset ring-gold-500/40"
                      : "text-anthracite-300 hover:bg-navy-900/60 hover:text-anthracite-100"
                  }`}
                >
                  <span
                    className={`mt-0.5 shrink-0 tabular-nums text-xs font-semibold ${
                      isActive ? "text-gold-400" : "text-anthracite-500"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 leading-snug [overflow-wrap:anywhere]">
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
