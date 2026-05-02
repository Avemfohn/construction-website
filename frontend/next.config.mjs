/** @type {import('next').NextConfig} */
function apiMediaRemotePattern() {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return [];
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const protocol = url.protocol.replace(":", "");
    const port = url.port || undefined;
    return [
      {
        protocol,
        hostname: url.hostname,
        ...(port ? { port } : {}),
        pathname: "/media/**",
      },
    ];
  } catch {
    return [];
  }
}

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "8000",
        pathname: "/media/**",
      },
      ...apiMediaRemotePattern(),
    ],
  },
};

export default nextConfig;
