/**
 * Base URL for Server Components / Route Handlers.
 * In Docker frontend: INTERNAL_API_URL=http://backend:8000
 * In devcontainer `npm run dev`: prefer NEXT_PUBLIC_API_URL or INTERNAL=http://localhost:8000
 */
export function getServerApiBase(): string {
  const raw =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000";
  return raw.replace(/\/$/, "");
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  const url = `${getServerApiBase()}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      ...init,
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * When Next.js fetches the API via INTERNAL_API_URL (e.g. http://backend:8000),
 * absolute media URLs in JSON use that host. Browsers cannot reach `backend`,
 * so rewrite to NEXT_PUBLIC_API_URL for client-loaded assets (video, images).
 */
export function rewriteForBrowser(url: string | null | undefined): string | null {
  if (url == null || url === "") return null;
  const publicBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  const internal = process.env.INTERNAL_API_URL?.replace(/\/$/, "") ?? "";
  if (internal && url.startsWith(internal)) {
    return publicBase ? url.replace(internal, publicBase) : url;
  }
  try {
    const u = new URL(url);
    if (u.hostname === "backend" && u.port === "8000" && publicBase) {
      const pub = new URL(publicBase);
      u.protocol = pub.protocol;
      u.host = pub.host;
      return u.toString();
    }
  } catch {
    if (url.startsWith("/") && publicBase) {
      return `${publicBase}${url}`;
    }
  }
  return url;
}
