"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, ArrowRight } from "lucide-react";
import { ProjectData, TranslationFn } from "@/types/fe/portfolio";
import { SectionCard } from "../ui/section-card";

interface ProjectsSectionProps {
  projects?: ProjectData[];
  t: TranslationFn;
}

export function ProjectsSection({ projects, t }: ProjectsSectionProps) {
  if (!projects?.length) return null;

  // Batasi hanya menampilkan maksimal 3 proyek di halaman utama
  const INITIAL_COUNT = 3;
  const displayedProjects = projects.slice(0, INITIAL_COUNT);

  return (
    <SectionCard id="projects">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
        {t("projects.title")} {t("projects.title2")}
      </h2>
      <p className="text-zinc-500 mb-10">{t("projects.description")}</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayedProjects.map((project) => (
          <div
            key={project.id}
            className="group flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden"
          >
            <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  {project.title}
                </h3>
                <div className="flex gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 flex-1">
                {project.shortDesc}
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-xs rounded-md text-zinc-600 dark:text-zinc-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tombol View All Projects akan muncul jika jumlah proyek lebih dari 3 atau Anda bisa menghapus kondisinya jika ingin tombol selalu muncul */}
      {projects.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-2.5 text-sm font-medium text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            View All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </SectionCard>
  );
}