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
    process.env.NEXT_PUBLIC_CONTACT_PHONE || "+90 212 555 00 00";
  const tel = phone.replace(/\s+/g, "");
  const igHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "ercaninsaat";
  const igUrl =
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || instagramHref(igHandle);

  return (
    <main className="flex min-h-[calc(100vh-4.5rem)] flex-col items-center justify-center bg-gradient-to-b from-navy-950 via-anthracite-950 to-anthracite-950 px-6 py-20">
      <div className="max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-gold-400/90">
          İletişim
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-anthracite-50 sm:text-4xl">
          Bize ulaşın
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-anthracite-400">
          Ercan İnşaat — doğrudan hat için arayın veya Instagram&apos;dan
          takip edin.
        </p>

        <div className="mt-12 flex flex-col items-center gap-8">
          <a
            href={`tel:${tel}`}
            className="inline-flex min-w-[14rem] items-center justify-center rounded-sm border border-gold-500/50 bg-gold-600/10 px-10 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-100 shadow-luxury backdrop-blur-sm transition hover:border-gold-400 hover:bg-gold-500/15"
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
