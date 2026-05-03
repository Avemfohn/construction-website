import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Ercan İnşaat — Ayhan Ercan ve ekiple iletişim.",
};

function instagramHref(handle: string): string {
  const h = handle.replace(/^@/, "");
  return `https://www.instagram.com/${h}/`;
}

export default function ContactPage() {
  const phone =
    process.env.NEXT_PUBLIC_CONTACT_PHONE || "+90 212 569 54 54";
  const tel = phone.replace(/\s+/g, "");
  const igHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "ayhanerc";
  const igUrl =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || instagramHref(igHandle);
  const addressLine =
    process.env.NEXT_PUBLIC_CONTACT_ADDRESS?.trim() ||
    "Nine Hatun, İnönü Cd. No:31, 34220 Esenler/İstanbul";
  /** Haritada işletme kartı çıksın diye sorguya firma adı eklenir; ekranda yalnızca adres gösterilir. */
  const mapsSearchQuery =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_SEARCH_QUERY?.trim() ||
    `Ercan İnşaat, ${addressLine}`;
  const directMapsUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL?.trim();
  const mapsUrl =
    directMapsUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsSearchQuery)}`;

  return (
    <main className="flex min-h-[calc(100dvh-4rem)] min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-gradient-to-b from-navy-950 via-anthracite-950 to-anthracite-950 px-4 py-16 sm:px-6 sm:py-20">
      <div className="max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90">
          İletişim
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-anthracite-50 sm:text-4xl">
          Bize ulaşın
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-anthracite-400">
          Bize belirtilen iletişim bilgileri ile ulaşabilirsiniz.
        </p>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Adres: ${addressLine}. Google Haritalarda göster`}
          className="group mt-5 inline-flex max-w-md cursor-pointer flex-col items-center gap-1.5 rounded-sm border border-transparent px-2 py-1 text-center transition hover:border-gold-500/20 hover:bg-navy-950/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/55"
        >
          <span className="text-sm font-medium leading-snug tracking-wide text-anthracite-100 underline decoration-gold-500/35 decoration-1 underline-offset-[5px] transition group-hover:text-gold-100 group-hover:decoration-gold-400/80 sm:text-[0.95rem] sm:leading-relaxed">
            {addressLine}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-500/90 transition group-hover:text-gold-300">
            <MapPinIcon className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
            Haritada aç
          </span>
        </a>

        <div className="mt-10 flex w-full max-w-sm flex-col items-center gap-6 sm:mt-12 sm:max-w-none sm:gap-8">
          <a
            href={`tel:${tel}`}
            className="inline-flex w-full min-h-12 items-center justify-center rounded-sm border border-gold-500/50 bg-gold-600/10 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-100 shadow-luxury backdrop-blur-sm transition hover:border-gold-400 hover:bg-gold-500/15 sm:min-h-0 sm:w-auto sm:min-w-[14rem] sm:px-10 sm:py-4"
          >
            Bizi arayın
          </a>
          <p className="text-xs tracking-wide text-anthracite-500">{phone}</p>

          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-navy-700/80 text-anthracite-200 transition hover:border-gold-500/50 hover:text-gold-300"
            aria-label="Instagram: Ercan İnşaat"
          >
            <InstagramIcon className="h-7 w-7" />
          </a>
          <p className="text-xs text-anthracite-600">
            @{igHandle.replace(/^@/, "")}
          </p>
        </div>
      </div>
    </main>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21c-4-3.73-8-8.26-8-11a8 8 0 0 1 16 0c0 2.74-4 7.27-8 11z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm8.5 1.75h-8.5A4 4 0 0 0 3.75 7.75v8.5a4 4 0 0 0 4 4h8.5a4 4 0 0 0 4-4v-8.5a4 4 0 0 0-4-4zM12 7.25a4.75 4.75 0 1 1 0 9.5 4.75 4.75 0 0 1 0-9.5zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.75-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </svg>
  );
}
