"use client";

import React from "react";
import { useState } from "react";
import { Calendar, GraduationCap, ChevronUp, ChevronDown } from "lucide-react";
import { getEmploymentTypeIcon } from "@/lib/fe/icons";
import { EducationData, ExperienceData, TranslationFn } from "@/types/fe/portfolio";
import { SectionCard } from "../ui/section-card";

interface ExperienceSectionProps {
  experiences?: ExperienceData[];
  education?: EducationData[];
  t: TranslationFn;
}

export function ExperienceSection({ experiences, education, t }: ExperienceSectionProps) {
  const [showAll, setShowAll] = useState(false);
  
  const timeline = [
    ...(experiences || []).map((exp) => ({
      id: `exp-${exp.id}`,
      title: exp.title,
      position: "Senior Full Stack Developer",
      company: exp.company,
      period: `${new Date(exp.startDate).getFullYear()} - ${exp.isCurrent ? "Present" : new Date(exp.endDate!).getFullYear()}`,
      description: exp.description,
      icon: getEmploymentTypeIcon(exp.employmentType || "FULL_TIME"),
    })),
    ...(education || []).map((edu) => ({
      id: `edu-${edu.id}`,
      title: edu.degree,
      position: null,
      company: edu.institution,
      period: `${new Date(edu.startDate).getFullYear()} - ${edu.isCurrent ? "Present" : new Date(edu.endDate!).getFullYear()}`,
      description: `${edu.field}${edu.gpa ? ` • GPA: ${edu.gpa}` : ""}`,
      icon: GraduationCap,
    })),
  ].sort((a, b) => {
    const yearA = parseInt(a.period.split(" - ")[0]);
    const yearB = parseInt(b.period.split(" - ")[0]);
    return yearB - yearA;
  });

  if (!timeline.length) return null;

  const INITIAL_COUNT = 3;
  const displayedTimeline = showAll ? timeline : timeline.slice(0, INITIAL_COUNT);

  return (
    <SectionCard id="experience">
      <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-10">{t("experience.title")} {t("experience.title2")}</h2>
      <div className="space-y-10">
        {displayedTimeline.map((item) => (
          <div key={item.id} className="group relative flex gap-6 pb-10 border-b border-zinc-200 dark:border-zinc-800 last:border-0 last:pb-0">
            <div className="hidden sm:flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
                <item.icon className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
            </div>
            
            <div className="flex-1">
              {/* Kontainer atas diubah agar menampung title dan position sejajar dengan tahun */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 gap-4">
                <div>
                  {item.title && (
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
                      {item.title}
                    </h3>
                  )}
                  {item.position && (
                    <h3 className={`font-semibold text-black-600 dark:text-violet-400 ${!item.title ? 'text-xl' : 'text-base mt-1'}`}>
                      {item.position}
                    </h3>
                  )}
                </div>
                
                <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-zinc-500 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 px-2.5 py-1 rounded-full mt-1 sm:mt-0">
                  <Calendar className="h-3 w-3" />
                  {item.period}
                </span>
              </div>
              
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-300 mb-3">{item.company}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {timeline.length > INITIAL_COUNT && (
        <div className="mt-8 flex justify-center">
          <button onClick={() => setShowAll(!showAll)} className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-2.5 text-sm font-medium text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
            {showAll ? "Show Less" : "Show More"}
            {showAll ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      )}
    </SectionCard>
  );
}