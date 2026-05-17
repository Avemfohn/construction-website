import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProjectGallery } from "@/components/ProjectGallery";
import {
  ProjectUpdateTimeline,
  type ProjectUpdate,
} from "@/components/ProjectUpdateTimeline";
import { fetchJson } from "@/lib/api";

type ProjectDetail = {
  id: number;
  title: string;
  slug: string;
  summary: string;
  description: string;
  status: string;
  location: string;
  features: string[];
  images: { id: number; image: string | null; caption: string; sort_order: number }[];
  updates: ProjectUpdate[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pagePath = `/projects/${slug}`;
  const project = await fetchJson<ProjectDetail>(`/api/projects/${slug}/`);
  if (!project) return { title: "Proje", alternates: { canonical: pagePath } };
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: pagePath },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: pagePath,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await fetchJson<ProjectDetail>(`/api/projects/${slug}/`);
  if (!project) notFound();

  const galleryImages = project.images
    .filter((img): img is typeof img & { image: string } => Boolean(img.image))
    .map((img) => ({
      id: img.id,
      image: img.image,
      caption: img.caption,
    }));

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy-950 via-anthracite-950 to-anthracite-950 px-4 pb-20 pt-8 sm:px-6 sm:pt-10">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/projects"
            className="text-xs font-medium uppercase tracking-[0.2em] text-gold-500/90 transition hover:text-gold-300"
          >
            ← Projeler
          </Link>
          <p className="mt-6 text-xs font-medium uppercase tracking-[0.35em] text-anthracite-500">
            {project.status === "ongoing" ? "Devam ediyor" : "Tamamlandı"}
            {project.location ? ` · ${project.location}` : ""}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-anthracite-50 sm:text-4xl md:text-5xl">
            {project.title}
          </h1>
          {project.summary ? (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-anthracite-300 sm:text-lg">
              {project.summary}
            </p>
          ) : null}

          {project.features?.length ? (
            <ul className="mt-8 flex flex-wrap gap-3">
              {project.features.map((f) => (
                <li
                  key={f}
                  className="rounded-sm border border-gold-500/30 bg-gold-500/5 px-3 py-1.5 text-xs text-gold-200/90"
                >
                  {f}
                </li>
              ))}
            </ul>
          ) : null}

          {project.description ? (
            <div className="mt-12 max-w-3xl text-sm leading-relaxed text-anthracite-400">
              {project.description.split("\n").map((para, i) => (
                <p key={i} className="mb-4 last:mb-0">
                  {para}
                </p>
              ))}
            </div>
          ) : null}

          {galleryImages.length > 0 ? (
            <ProjectGallery title={project.title} images={galleryImages} />
          ) : null}

          <ProjectUpdateTimeline
            updates={project.updates ?? []}
            projectStatus={project.status}
          />
        </div>
      </main>
  );
}
